"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Check,
  Film,
  FolderOpen,
  Image as ImageIcon,
  LayoutDashboard,
  LoaderCircle,
  LogIn,
  LogOut,
  Plus,
  Upload,
  Video,
} from "lucide-react";

type FolderLabel = "Posters" | "Reels" | "Videos" | "Logos" | "Company Profiles" | "Animations";

type ProjectRow = {
  id: string;
  title: string;
  type: "design" | "video";
  category: FolderLabel;
  cover_url?: string | null;
  video_url?: string | null;
  year?: number | null;
  published?: boolean;
  created_at?: string;
};

const folders: Array<{
  label: FolderLabel;
  slug: string;
  kind: "image" | "video";
}> = [
  { label: "Posters", slug: "posters", kind: "image" },
  { label: "Reels", slug: "reels", kind: "video" },
  { label: "Videos", slug: "videos", kind: "video" },
  { label: "Logos", slug: "logos", kind: "image" },
  { label: "Company Profiles", slug: "company-profiles", kind: "image" },
  { label: "Animations", slug: "animations", kind: "video" },
];

const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const publicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const browserSupabase =
  publicUrl && publicAnonKey ? createClient(publicUrl, publicAnonKey) : null;

export default function AdminPage() {
  const [checking, setChecking] = useState(true);
  const [configured, setConfigured] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState("designerazhaf@gmail.com");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);

  const [folder, setFolder] = useState<FolderLabel>("Posters");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [publishBusy, setPublishBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [projects, setProjects] = useState<ProjectRow[]>([]);

  const selectedFolder = useMemo(
    () => folders.find((item) => item.label === folder) || folders[0],
    [folder],
  );

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function checkSession() {
    try {
      const response = await fetch("/api/admin/session", { cache: "no-store" });
      const data = await response.json();
      setConfigured(Boolean(data.configured));
      setAuthenticated(Boolean(data.authenticated));
      if (data.authenticated) await loadProjects();
    } finally {
      setChecking(false);
    }
  }

  async function login(event: FormEvent) {
    event.preventDefault();
    setLoginBusy(true);
    setLoginError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setLoginError(data.error || "Login failed.");
        return;
      }

      setAuthenticated(true);
      setPassword("");
      await loadProjects();
    } catch {
      setLoginError("Could not connect to the admin server.");
    } finally {
      setLoginBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => null);
    setAuthenticated(false);
    setProjects([]);
  }

  async function loadProjects() {
    const response = await fetch("/api/admin/projects", { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    setProjects(data.projects || []);
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setYear(new Date().getFullYear().toString());
    setFile(null);
  }

  async function uploadAndSave(published: boolean) {
    if (!file || !title.trim()) {
      setStatus("Add a project title and choose a file first.");
      return;
    }

    if (!browserSupabase) {
      setStatus("Supabase public environment variables are missing.");
      return;
    }

    const shouldBeVideo = selectedFolder.kind === "video";
    if (shouldBeVideo && !file.type.startsWith("video/")) {
      setStatus("This folder needs a video file.");
      return;
    }
    if (!shouldBeVideo && !file.type.startsWith("image/")) {
      setStatus("This folder needs an image file.");
      return;
    }

    setPublishBusy(true);
    setStatus("Preparing secure upload…");

    try {
      const signedResponse = await fetch("/api/admin/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folder: selectedFolder.slug,
          fileName: file.name,
        }),
      });

      const signed = await signedResponse.json();
      if (!signedResponse.ok) throw new Error(signed.error || "Could not prepare upload.");

      setStatus("Uploading original file without resizing or cropping…");

      const { error: uploadError } = await browserSupabase.storage
        .from(signed.bucket)
        .uploadToSignedUrl(signed.path, signed.token, file, {
          contentType: file.type || undefined,
        });

      if (uploadError) throw uploadError;

      setStatus("Saving portfolio item…");

      const saveResponse = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          category: folder,
          description: description.trim(),
          fileUrl: signed.publicUrl,
          year: Number(year) || new Date().getFullYear(),
          published,
        }),
      });

      const saved = await saveResponse.json();
      if (!saveResponse.ok) throw new Error(saved.error || "Could not save project.");

      setStatus(published ? "Published successfully." : "Draft saved successfully.");
      resetForm();
      await loadProjects();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setPublishBusy(false);
    }
  }

  if (checking) {
    return (
      <main className="admin-login-shell">
        <div className="admin-login-card admin-loading-card">
          <LoaderCircle className="spin" size={24} />
          <span>Checking admin session…</span>
        </div>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="admin-login-shell">
        <form className="admin-login-card" onSubmit={login}>
          <a className="admin-login-mark" href="/">SA</a>
          <span className="admin-login-kicker">Portfolio Admin</span>
          <h1>Sign in to publish work.</h1>
          <p>Upload original poster and video files, choose their folder, and publish them directly to the portfolio.</p>

          {!configured && (
            <div className="admin-config-warning">
              Server admin password is not configured yet. Add the admin environment variables in Vercel before signing in.
            </div>
          )}

          <label>
            Email
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {loginError && <div className="admin-login-error">{loginError}</div>}

          <button className="admin-login-button" type="submit" disabled={loginBusy || !configured}>
            {loginBusy ? <LoaderCircle className="spin" size={17} /> : <LogIn size={17} />}
            {loginBusy ? "Signing in…" : "Sign in"}
          </button>

          <a className="admin-back-link" href="/">← Back to portfolio</a>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/">SA</a>
        <div className="admin-nav">
          <button className="active"><LayoutDashboard size={18} /> Dashboard</button>
          <button><ImageIcon size={18} /> Visual work</button>
          <button><Video size={18} /> Video work</button>
        </div>
        <button className="admin-logout" onClick={logout}><LogOut size={17} /> Log out</button>
      </aside>

      <section className="admin-main">
        <div className="admin-head">
          <div>
            <span>Portfolio CMS</span>
            <h1>Upload original work</h1>
          </div>
          <button className="admin-primary" onClick={resetForm}><Plus size={17} /> New item</button>
        </div>

        <div className="admin-note">
          <strong>Original ratio is preserved.</strong> A 9:16 reel stays 9:16, a 4:5 poster stays 4:5, and wide video stays wide.
          The public gallery only adds rounded corners; full view opens the real original media.
        </div>

        <div className="admin-layout">
          <div className="admin-panel">
            <div className="admin-panel-title">
              <h2>Add portfolio item</h2>
              <span>{selectedFolder.kind === "video" ? "Video" : "Image"}</span>
            </div>

            <div className="admin-folder-grid" aria-label="Upload folder">
              {folders.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={folder === item.label ? "active" : ""}
                  onClick={() => {
                    setFolder(item.label);
                    setFile(null);
                    setStatus("");
                  }}
                >
                  <FolderOpen size={16} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="admin-fields">
              <label>
                Project title
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. Campaign poster"
                />
              </label>

              <div className="admin-field-pair">
                <label>
                  Folder
                  <select
                    value={folder}
                    onChange={(event) => {
                      setFolder(event.target.value as FolderLabel);
                      setFile(null);
                    }}
                  >
                    {folders.map((item) => <option key={item.label}>{item.label}</option>)}
                  </select>
                </label>

                <label>
                  Year
                  <input
                    inputMode="numeric"
                    value={year}
                    onChange={(event) => setYear(event.target.value)}
                    placeholder="2026"
                  />
                </label>
              </div>

              <label>
                Description
                <textarea
                  rows={4}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Short optional project description…"
                />
              </label>

              <label className="upload-box admin-real-upload">
                <Upload size={22} />
                <strong>{file ? file.name : selectedFolder.kind === "video" ? "Choose original video" : "Choose original artwork"}</strong>
                <span>
                  {file
                    ? Math.max(0.01, file.size / 1024 / 1024).toFixed(2) + " MB · original ratio kept"
                    : selectedFolder.kind === "video"
                      ? "MP4 / WebM / supported video — no forced 4:5 crop"
                      : "JPG / PNG / WebP — no forced crop"}
                </span>
                <span className="upload-choose">Choose file</span>
                <input
                  type="file"
                  accept={selectedFolder.kind === "video" ? "video/*" : "image/*"}
                  onChange={(event) => setFile(event.target.files?.[0] || null)}
                />
              </label>
            </div>

            {status && (
              <div className={"admin-upload-status " + (status.includes("successfully") ? "success" : "")}>
                {status.includes("successfully") && <Check size={15} />}
                {publishBusy && <LoaderCircle className="spin" size={15} />}
                <span>{status}</span>
              </div>
            )}

            <div className="admin-actions">
              <button disabled={publishBusy} onClick={() => uploadAndSave(false)}>Save draft</button>
              <button className="admin-primary" disabled={publishBusy} onClick={() => uploadAndSave(true)}>
                {publishBusy ? <LoaderCircle className="spin" size={16} /> : <Upload size={16} />}
                Publish project
              </button>
            </div>
          </div>

          <div className="admin-preview-stack">
            <div className="admin-preview">
              <div className="admin-preview-head">
                <span>Real-ratio preview</span>
                <span>{folder}</span>
              </div>

              <div className="admin-media-preview">
                {previewUrl ? (
                  selectedFolder.kind === "video" ? (
                    <video src={previewUrl} controls muted playsInline />
                  ) : (
                    <img src={previewUrl} alt="Upload preview" />
                  )
                ) : (
                  <div className="admin-preview-empty">
                    {selectedFolder.kind === "video" ? <Film size={25} /> : <ImageIcon size={25} />}
                    <span>Your original media preview appears here.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="admin-recent">
              <div className="admin-preview-head">
                <span>Recent uploads</span>
                <span>{projects.length}</span>
              </div>

              <div className="admin-recent-list">
                {projects.length ? projects.slice(0, 8).map((project) => (
                  <div className="admin-recent-row" key={project.id}>
                    <div className="admin-recent-thumb">
                      {project.cover_url ? (
                        <img src={project.cover_url} alt="" />
                      ) : project.video_url ? (
                        <video src={project.video_url} muted preload="metadata" />
                      ) : null}
                    </div>
                    <div>
                      <strong>{project.title}</strong>
                      <span>{project.category} · {project.year || "—"}</span>
                    </div>
                    <span className={project.published ? "live" : "draft"}>{project.published ? "Live" : "Draft"}</span>
                  </div>
                )) : (
                  <div className="admin-recent-empty">No uploads yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
