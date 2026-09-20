"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import BackendContentEditor from "@/components/BackendContentEditor";
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
  Trash2,
} from "lucide-react";

type FolderLabel = "Posters" | "Reels" | "Videos" | "AI Video" | "Logos" | "Company Profiles" | "Animations";

type ProjectRow = {
  id: string;
  title: string;
  type: "design" | "video";
  category: FolderLabel;
  cover_url?: string | null;
  video_url?: string | null;
  youtube_url?: string | null;
  source_url?: string | null;
  source_kind?: "upload" | "youtube" | "drive" | "direct" | "embed" | null;
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
  { label: "AI Video", slug: "ai-video", kind: "video" },
  { label: "Logos", slug: "logos", kind: "image" },
  { label: "Company Profiles", slug: "company-profiles", kind: "image" },
  { label: "Animations", slug: "animations", kind: "video" },
];

const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bgrpvjuvghdjbxmljtgm.supabase.co";
const publicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_WheOVPSgKqPTXiHuD1uhXA_S4Vubljo";
const browserSupabase =
  publicUrl && publicAnonKey ? createClient(publicUrl, publicAnonKey) : null;

export default function BackendPage() {
  const [checking, setChecking] = useState(true);
  const [activePanel, setActivePanel] = useState<"dashboard" | "visual" | "video">("dashboard");
  const contentEditorRef = useRef<HTMLDivElement | null>(null);
  const uploadPanelRef = useRef<HTMLDivElement | null>(null);
  const [configured, setConfigured] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);

  const [folder, setFolder] = useState<FolderLabel>("Posters");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [file, setFile] = useState<File | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [publishBusy, setPublishBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [deletingId, setDeletingId] = useState("");

  const linkedDriveFolder = linkUrl.trim() ? isDriveFolderUrl(linkUrl.trim()) : false;
  const linkedPreview = linkUrl.trim() && !linkedDriveFolder ? normalizedPreviewUrl(linkUrl.trim()) : "";
  const linkedSourceKind = linkUrl.trim() ? sourceKindFromUrl(linkUrl.trim()) : null;
  const linkedDriveThumb = linkedSourceKind === "drive" && !linkedDriveFolder ? driveThumbnail(linkUrl.trim()) : "";

  const selectedFolder = useMemo(
    () => folders.find((item) => item.label === folder) || folders[0],
    [folder],
  );

  const visibleFolders = useMemo(() => {
    if (activePanel === "visual") return folders.filter((item) => item.kind === "image");
    if (activePanel === "video") return folders.filter((item) => item.kind === "video");
    return folders;
  }, [activePanel]);

  const visibleProjects = useMemo(() => {
    if (activePanel === "visual") return projects.filter((project) => project.type === "design");
    if (activePanel === "video") return projects.filter((project) => project.type === "video");
    return projects;
  }, [projects, activePanel]);

  const videoExtensions = new Set(["mp4", "webm", "mov", "m4v", "ogg", "ogv"]);
  const imageExtensions = new Set(["jpg", "jpeg", "png", "webp", "gif", "avif"]);
  const pdfExtensions = new Set(["pdf"]);

  function extensionOf(name: string) {
    return name.split(".").pop()?.toLowerCase() || "";
  }

  function isSupportedVideo(file: File) {
    return file.type.startsWith("video/") || videoExtensions.has(extensionOf(file.name));
  }

  function isSupportedImage(file: File) {
    return file.type.startsWith("image/") || imageExtensions.has(extensionOf(file.name));
  }

  function isSupportedPdf(file: File) {
    return file.type === "application/pdf" || pdfExtensions.has(extensionOf(file.name));
  }

  function inferredContentType(file: File) {
    if (file.type) return file.type;

    const extension = extensionOf(file.name);
    const types: Record<string, string> = {
      mp4: "video/mp4",
      webm: "video/webm",
      mov: "video/quicktime",
      m4v: "video/x-m4v",
      ogg: "video/ogg",
      ogv: "video/ogg",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      gif: "image/gif",
      avif: "image/avif",
      pdf: "application/pdf",
    };

    return types[extension] || "application/octet-stream";
  }

  function youtubeIdFromUrl(value: string) {
    try {
      const url = new URL(value);
      if (url.hostname.includes("youtu.be")) return url.pathname.replace("/", "").split("/")[0] || null;
      if (url.pathname.startsWith("/embed/")) return url.pathname.split("/embed/")[1]?.split("/")[0] || null;
      if (url.pathname.startsWith("/shorts/")) return url.pathname.split("/shorts/")[1]?.split("/")[0] || null;
      return url.searchParams.get("v");
    } catch {
      return null;
    }
  }

  function driveFileId(value: string) {
    try {
      const url = new URL(value);
      const byPath = url.pathname.match(/\/file\/d\/([^/]+)/)?.[1];
      if (byPath) return byPath;
      return url.searchParams.get("id");
    } catch {
      return null;
    }
  }

  function isDriveFolderUrl(value: string) {
    try {
      const url = new URL(value);
      return url.hostname.includes("drive.google.com") && /\/drive\/folders\//.test(url.pathname);
    } catch {
      return false;
    }
  }

  function sourceKindFromUrl(value: string): "youtube" | "drive" | "direct" {
    if (youtubeIdFromUrl(value)) return "youtube";
    try {
      const url = new URL(value);
      if (url.hostname.includes("drive.google.com")) return "drive";
    } catch {}
    return "direct";
  }

  function driveResourceKey(value: string) {
    try {
      return new URL(value).searchParams.get("resourcekey") || "";
    } catch {
      return "";
    }
  }

  function normalizedPreviewUrl(value: string) {
    const sourceKind = sourceKindFromUrl(value);
    if (sourceKind === "youtube") {
      const id = youtubeIdFromUrl(value);
      return id ? "https://www.youtube.com/embed/" + id + "?controls=1&rel=0" : value;
    }
    if (sourceKind === "drive") {
      const id = driveFileId(value);
      const resourceKey = driveResourceKey(value);
      return id
        ? "https://drive.google.com/file/d/" + id + "/preview" + (resourceKey ? "?resourcekey=" + encodeURIComponent(resourceKey) : "")
        : "";
    }
    return value;
  }

  function driveThumbnail(value: string) {
    const id = driveFileId(value);
    if (!id) return "";
    const resourceKey = driveResourceKey(value);
    return "https://drive.google.com/thumbnail?id=" + id + "&sz=w2000" + (resourceKey ? "&resourcekey=" + encodeURIComponent(resourceKey) : "");
  }

  function openPanel(panel: "dashboard" | "visual" | "video") {
    setActivePanel(panel);
    setStatus("");
    setFile(null);

    if (panel === "visual") setFolder("Posters");
    if (panel === "video") setFolder("Videos");

    requestAnimationFrame(() => {
      if (panel === "dashboard") {
        contentEditorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        uploadPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

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
      const response = await fetch("/api/backend/session", { cache: "no-store" });
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
      const response = await fetch("/api/backend/login", {
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
      setLoginError("Could not connect to the backend service.");
    } finally {
      setLoginBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/backend/logout", { method: "POST" }).catch(() => null);
    setAuthenticated(false);
    setProjects([]);
  }

  async function loadProjects() {
    const response = await fetch("/api/backend/projects", { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    setProjects(data.projects || []);
  }

  async function deleteProject(project: ProjectRow) {
    const label = project.title?.trim() || project.category || "this item";
    if (!window.confirm(`Delete “${label}” from the portfolio? This cannot be undone.`)) return;

    setDeletingId(project.id);
    setStatus("");

    try {
      const response = await fetch("/api/backend/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: project.id }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Could not delete project.");

      setProjects((current) => current.filter((item) => item.id !== project.id));
      setStatus("Project deleted successfully.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Delete failed.");
    } finally {
      setDeletingId("");
    }
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setYear(new Date().getFullYear().toString());
    setFile(null);
    setLinkUrl("");
  }

  async function uploadAndSave(published: boolean) {
    const pastedLink = linkUrl.trim();

    if (!file && !pastedLink) {
      setStatus("Choose a file or paste a media link first.");
      return;
    }

    const shouldBeVideo = selectedFolder.kind === "video";
    const shouldBeCompanyProfile = folder === "Company Profiles";

    if (file) {
      if (!browserSupabase) {
        setStatus("Supabase public environment variables are missing.");
        return;
      }

      if (shouldBeVideo && !isSupportedVideo(file)) {
        setStatus("Unsupported video. Use MP4, WebM, MOV, M4V or OGG.");
        return;
      }

      if (!shouldBeVideo && shouldBeCompanyProfile && !isSupportedImage(file) && !isSupportedPdf(file)) {
        setStatus("Unsupported company profile file. Use PDF, JPG, PNG, WebP, GIF or AVIF.");
        return;
      }

      if (!shouldBeVideo && !shouldBeCompanyProfile && !isSupportedImage(file)) {
        setStatus("Unsupported image. Use JPG, PNG, WebP, GIF or AVIF.");
        return;
      }
    }

    if (pastedLink) {
      try {
        new URL(pastedLink);
      } catch {
        setStatus("Paste a valid Google Drive, YouTube or direct media link.");
        return;
      }

      if (isDriveFolderUrl(pastedLink)) {
        setStatus("That is a Google Drive folder link. Open the actual image/video file → Share → Copy link, then paste that file link here.");
        return;
      }
    }

    setPublishBusy(true);

    try {
      let fileUrl = "";
      let sourceUrl = pastedLink;
      let sourceKind: "upload" | "youtube" | "drive" | "direct" = pastedLink
        ? sourceKindFromUrl(pastedLink)
        : "upload";

      if (file) {
        setStatus("Preparing secure upload…");

        const signedResponse = await fetch("/api/backend/upload-url", {
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

        const { error: uploadError } = await browserSupabase!.storage
          .from(signed.bucket)
          .uploadToSignedUrl(signed.path, signed.token, file, {
            contentType: inferredContentType(file),
            cacheControl: "31536000",
          });

        if (uploadError) throw uploadError;
        fileUrl = signed.publicUrl;
        sourceUrl = signed.publicUrl;
        sourceKind = "upload";
      } else {
        setStatus("Saving linked media…");
      }

      const saveResponse = await fetch("/api/backend/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          category: folder,
          description: description.trim(),
          fileUrl: fileUrl || undefined,
          sourceUrl: sourceUrl || undefined,
          sourceKind,
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
      setStatus(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setPublishBusy(false);
    }
  }

  if (checking) {
    return (
      <main className="admin-login-shell">
        <div className="admin-login-card admin-loading-card">
          <LoaderCircle className="spin" size={24} />
          <span>Checking backend session…</span>
        </div>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="admin-login-shell">
        <form className="admin-login-card" onSubmit={login}>
          <a className="admin-login-mark" href="/">SA</a>
          <span className="admin-login-kicker">Portfolio Backend</span>
          <h1>Sign in to publish work.</h1>
          <p>Upload original poster and video files, choose their folder, and publish them directly to the portfolio.</p>

          {!configured && (
            <div className="admin-config-warning">
              Backend access is not configured on the production server yet.
            </div>
          )}

          <label>
            Email
            <input
              type="email"
              autoComplete="username"
              placeholder="Enter backend email"
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

          <button className="admin-login-button" type="submit" disabled={loginBusy}>
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
          <button type="button" className={activePanel === "dashboard" ? "active" : ""} onClick={() => openPanel("dashboard")}><LayoutDashboard size={18} /> Dashboard</button>
          <button type="button" className={activePanel === "visual" ? "active" : ""} onClick={() => openPanel("visual")}><ImageIcon size={18} /> Visual work</button>
          <button type="button" className={activePanel === "video" ? "active" : ""} onClick={() => openPanel("video")}><Video size={18} /> Video work</button>
        </div>
        <button className="admin-logout" onClick={logout}><LogOut size={17} /> Log out</button>
      </aside>

      <section className="admin-main">
        <div className="admin-head">
          <div>
            <span>Portfolio CMS</span>
            <h1>
              {activePanel === "dashboard"
                ? "Manage portfolio"
                : activePanel === "video"
                  ? "Video work"
                  : "Visual work"}
            </h1>
          </div>
          <button
            type="button"
            className="admin-primary"
            onClick={() => {
              resetForm();
              openPanel(activePanel === "video" ? "video" : "visual");
            }}
          ><Plus size={17} /> New item</button>
        </div>

        {activePanel === "dashboard" ? (
          <div ref={contentEditorRef}>
            <BackendContentEditor />
          </div>
        ) : (
          <>
            <div className="admin-note">
              <strong>{activePanel === "video" ? "Video work" : "Visual work"} mode.</strong>{" "}
              {activePanel === "video"
                ? "Add Reels, Videos, AI Video or Animations using an upload or pasted Drive / YouTube / direct link."
                : "Add Posters, Logos or Company Profiles using an upload or pasted Drive / direct image link."}
            </div>
        <div className="admin-layout" ref={uploadPanelRef}>
          <div className="admin-panel">
            <div className="admin-panel-title">
              <h2>Add portfolio item</h2>
              <span>{selectedFolder.kind === "video" ? "Video" : "Image"}</span>
            </div>

            <div className="admin-folder-grid" aria-label="Upload folder">
              {visibleFolders.map((item) => (
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
                Project title <span className="admin-optional">Optional</span>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Optional — e.g. Campaign poster"
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
                    {visibleFolders.map((item) => <option key={item.label}>{item.label}</option>)}
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
                Description <span className="admin-optional">Optional</span>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Short optional project description…"
                />
              </label>

              <div className="admin-link-source">
                <span className="admin-link-divider">or paste a link</span>
                <label>
                  Media link
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(event) => {
                      setLinkUrl(event.target.value);
                      if (event.target.value) setFile(null);
                      setStatus("");
                    }}
                    placeholder="Paste Drive, YouTube or direct media link"
                  />
                </label>
                <small>
                  {folder === "Company Profiles"
                    ? "For Company Profiles, upload a PDF or paste a Google Drive PDF link. The cover page shows in the portfolio, and clicking it opens the full scrollable document. Drive files must be shared as “Anyone with the link”."
                    : "Google Drive, YouTube, direct image/video URLs are shown inside your website. Drive files must be shared as “Anyone with the link”."}
                </small>
              </div>

              <label className="upload-box admin-real-upload">
                <Upload size={22} />
                <strong>{file ? file.name : selectedFolder.kind === "video" ? "Choose original video" : folder === "Company Profiles" ? "Choose company profile PDF or cover" : "Choose original artwork"}</strong>
                <span>
                  {file
                    ? Math.max(0.01, file.size / 1024 / 1024).toFixed(2) + " MB · original ratio kept"
                    : selectedFolder.kind === "video"
                      ? "MP4 / WebM / MOV / M4V / OGG — original ratio kept"
                      : folder === "Company Profiles"
                        ? "PDF / JPG / PNG / WebP / GIF / AVIF — PDF opens as a scrollable document"
                        : "JPG / PNG / WebP / GIF / AVIF — no forced crop"}
                </span>
                <span className="upload-choose">Choose file</span>
                <input
                  type="file"
                  accept={selectedFolder.kind === "video"
                    ? "video/*,.mp4,.webm,.mov,.m4v,.ogg,.ogv"
                    : folder === "Company Profiles"
                      ? "application/pdf,.pdf,image/*,.jpg,.jpeg,.png,.webp,.gif,.avif"
                      : "image/*,.jpg,.jpeg,.png,.webp,.gif,.avif"}
                  onChange={(event) => {
                    const nextFile = event.target.files?.[0] || null;
                    setFile(nextFile);
                    if (nextFile) setLinkUrl("");
                    setStatus("");
                  }}
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
                  ) : folder === "Company Profiles" && file && isSupportedPdf(file) ? (
                    <iframe
                      src={previewUrl + "#page=1&toolbar=0&navpanes=0&view=FitH"}
                      title="Company profile PDF preview"
                    />
                  ) : (
                    <img src={previewUrl} alt="Upload preview" />
                  )
                ) : linkedDriveFolder ? (
                  <div className="admin-preview-empty admin-preview-warning">
                    <FolderOpen size={25} />
                    <strong>Drive folder link can’t display a single project.</strong>
                    <span>Open the actual poster/video file in Drive → Share → Copy link → paste that file link.</span>
                  </div>
                ) : linkedPreview ? (
                  linkedSourceKind === "youtube" || linkedSourceKind === "drive" ? (
                    selectedFolder.kind === "image" && linkedDriveThumb ? (
                      <img src={linkedDriveThumb} alt="Linked media preview" />
                    ) : (
                      <iframe
                        src={linkedPreview}
                        title="Linked media preview"
                        allow="autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                      />
                    )
                  ) : selectedFolder.kind === "video" ? (
                    <video src={linkedPreview} controls playsInline preload="metadata" />
                  ) : (
                    <img src={linkedPreview} alt="Linked media preview" />
                  )
                ) : (
                  <div className="admin-preview-empty">
                    {selectedFolder.kind === "video" ? <Film size={25} /> : <ImageIcon size={25} />}
                    <span>Upload a file or paste a media link to preview it here.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="admin-recent admin-library">
              <div className="admin-preview-head">
                <span>{activePanel === "video" ? "All uploaded videos" : "All uploaded visual work"}</span>
                <span>{visibleProjects.length}</span>
              </div>

              <div className="admin-recent-list">
                {visibleProjects.length ? visibleProjects.map((project) => (
                  <div className="admin-recent-row admin-library-row" key={project.id}>
                    <div className="admin-recent-thumb">
                      {project.cover_url ? (
                        <img src={project.cover_url} alt="" />
                      ) : project.source_kind === "youtube" && project.source_url && youtubeIdFromUrl(project.source_url) ? (
                        <img src={"https://img.youtube.com/vi/" + youtubeIdFromUrl(project.source_url) + "/hqdefault.jpg"} alt="" />
                      ) : project.source_kind === "drive" && project.source_url && driveThumbnail(project.source_url) ? (
                        <img src={driveThumbnail(project.source_url)} alt="" />
                      ) : project.video_url ? (
                        <video src={project.video_url} muted preload="metadata" />
                      ) : null}
                    </div>

                    <div className="admin-library-copy">
                      <strong>{project.title?.trim() || project.category}</strong>
                      <span>{project.category}{project.year ? " · " + project.year : ""}</span>
                    </div>

                    <span className={project.published ? "live" : "draft"}>
                      {project.published ? "Live" : "Draft"}
                    </span>

                    <button
                      type="button"
                      className="admin-delete-project"
                      onClick={() => deleteProject(project)}
                      disabled={deletingId === project.id}
                      aria-label={"Delete " + (project.title?.trim() || project.category)}
                    >
                      {deletingId === project.id ? <LoaderCircle className="spin" size={15} /> : <Trash2 size={15} />}
                      <span>{deletingId === project.id ? "Deleting" : "Delete"}</span>
                    </button>
                  </div>
                )) : (
                  <div className="admin-recent-empty">
                    {activePanel === "video" ? "No videos uploaded yet." : "No visual work uploaded yet."}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

          </>
        )}
      </section>
    </main>
  );
}
