"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Check, LoaderCircle, Plus, Save, Sparkles, Trash2, Upload } from "lucide-react";
import {
  defaultSiteContent,
  type SiteContent,
  type SiteEducation,
  type SiteExperience,
  type SiteTool,
} from "@/lib/site-content";

function csv(value: string[]) {
  return value.join(", ");
}

function fromCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bgrpvjuvghdjbxmljtgm.supabase.co";
const publicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_WheOVPSgKqPTXiHuD1uhXA_S4Vubljo";
const browserSupabase = createClient(publicUrl, publicAnonKey);

function mergeSiteContent(value: Partial<SiteContent> | null | undefined): SiteContent {
  if (!value) return defaultSiteContent;
  return {
    ...defaultSiteContent,
    ...value,
    hero: { ...defaultSiteContent.hero, ...(value.hero || {}) },
    portfolio: { ...defaultSiteContent.portfolio, ...(value.portfolio || {}) },
    profile: { ...defaultSiteContent.profile, ...(value.profile || {}) },
    contact: { ...defaultSiteContent.contact, ...(value.contact || {}) },
    tools: value.tools || defaultSiteContent.tools,
    coreSkills: value.coreSkills || defaultSiteContent.coreSkills,
    aiSkills: value.aiSkills || defaultSiteContent.aiSkills,
    experience: value.experience || defaultSiteContent.experience,
    education: value.education || defaultSiteContent.education,
  };
}

async function optimizeHeroFile(file: File, mode: "light" | "dark") {
  const bitmap = await createImageBitmap(file);
  const maxWidth = 1400;
  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) throw new Error("Could not optimize this image.");

  context.clearRect(0, 0, width, height);
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.9),
  );
  if (!blob) throw new Error("Could not optimize this image.");

  return new File([blob], "hero-" + mode + "-" + Date.now() + ".webp", {
    type: "image/webp",
  });
}

export default function BackendContentEditor() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [busy, setBusy] = useState(false);
  const [heroBusy, setHeroBusy] = useState<"light" | "dark" | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const response = await fetch("/api/backend/content", { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    if (data.content) setContent(mergeSiteContent(data.content));
  }

  async function saveContent(nextContent: SiteContent, successMessage = "Website content updated.") {
    const response = await fetch("/api/backend/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: nextContent }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Save failed.");
    setMessage(successMessage);
  }

  async function uploadHero(mode: "light" | "dark", file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("Please choose an image file.");
      return;
    }

    setHeroBusy(mode);
    setMessage(mode === "light" ? "Optimizing light photo…" : "Optimizing dark photo…");

    try {
      const optimized = await optimizeHeroFile(file, mode);
      const signedResponse = await fetch("/api/backend/hero-upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, fileName: optimized.name }),
      });
      const signed = await signedResponse.json();
      if (!signedResponse.ok) throw new Error(signed.error || "Could not prepare image upload.");

      const { error } = await browserSupabase.storage
        .from(signed.bucket)
        .uploadToSignedUrl(signed.path, signed.token, optimized, {
          contentType: "image/webp",
          cacheControl: "31536000",
        });
      if (error) throw error;

      const nextContent: SiteContent = {
        ...content,
        hero: {
          ...content.hero,
          ...(mode === "light"
            ? { lightImage: signed.publicUrl }
            : { darkImage: signed.publicUrl }),
        },
      };

      setContent(nextContent);
      await saveContent(
        nextContent,
        (mode === "light" ? "Light" : "Dark") + " homepage photo updated.",
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Photo upload failed.");
    } finally {
      setHeroBusy(null);
    }
  }

  async function save() {
    setBusy(true);
    setMessage("");
    try {
      await saveContent(content);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  }

  function updateExperience(index: number, patch: Partial<SiteExperience>) {
    setContent((prev) => ({
      ...prev,
      experience: prev.experience.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  }

  function updateEducation(index: number, patch: Partial<SiteEducation>) {
    setContent((prev) => ({
      ...prev,
      education: prev.education.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  }

  function updateTool(index: number, patch: Partial<SiteTool>) {
    setContent((prev) => ({
      ...prev,
      tools: prev.tools.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  }

  return (
    <section className="admin-content-editor">
      <div className="admin-panel-title">
        <div>
          <span>Website content</span>
          <h2>Edit portfolio sections</h2>
        </div>
        <button className="admin-primary" type="button" onClick={save} disabled={busy}>
          <Save size={16} /> {busy ? "Saving…" : "Save all changes"}
        </button>
      </div>

      <div className="admin-content-grid">
        <div className="admin-content-card">
          <h3>Hero</h3>
          <label>Status<input value={content.hero.status} onChange={(e) => setContent({ ...content, hero: { ...content.hero, status: e.target.value } })} /></label>
          <label>Location<input value={content.hero.location} onChange={(e) => setContent({ ...content, hero: { ...content.hero, location: e.target.value } })} /></label>
          <label>Main title<input value={content.hero.title1} onChange={(e) => setContent({ ...content, hero: { ...content.hero, title1: e.target.value } })} /></label>
          <label>Second title<input value={content.hero.title2} onChange={(e) => setContent({ ...content, hero: { ...content.hero, title2: e.target.value } })} /></label>
          <label>Intro<textarea rows={4} value={content.hero.intro} onChange={(e) => setContent({ ...content, hero: { ...content.hero, intro: e.target.value } })} /></label>

          <div className="admin-hero-images">
            <div className="admin-hero-image-box">
              <div className="admin-hero-preview light">
                <img src={content.hero.lightImage || "/hero-light.webp"} alt="Light homepage portrait preview" />
              </div>
              <div>
                <strong>White mode photo</strong>
                <span>Upload → auto optimize → auto side blur on website</span>
              </div>
              <label className="admin-hero-upload">
                {heroBusy === "light" ? <LoaderCircle className="spin" size={15} /> : <Upload size={15} />}
                {heroBusy === "light" ? "Optimizing…" : "Replace photo"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/avif"
                  disabled={Boolean(heroBusy)}
                  onChange={(event) => {
                    const picked = event.target.files?.[0] || null;
                    void uploadHero("light", picked);
                    event.currentTarget.value = "";
                  }}
                />
              </label>
            </div>

            <div className="admin-hero-image-box">
              <div className="admin-hero-preview dark">
                <img src={content.hero.darkImage || "/hero-dark.webp"} alt="Dark homepage portrait preview" />
              </div>
              <div>
                <strong>Black mode photo</strong>
                <span>Upload → auto optimize → auto side blur on website</span>
              </div>
              <label className="admin-hero-upload">
                {heroBusy === "dark" ? <LoaderCircle className="spin" size={15} /> : <Upload size={15} />}
                {heroBusy === "dark" ? "Optimizing…" : "Replace photo"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/avif"
                  disabled={Boolean(heroBusy)}
                  onChange={(event) => {
                    const picked = event.target.files?.[0] || null;
                    void uploadHero("dark", picked);
                    event.currentTarget.value = "";
                  }}
                />
              </label>
            </div>
          </div>

          <small>Just choose the photo. No code, crop or optimization needed. Transparent PNG is supported.</small>
        </div>

        <div className="admin-content-card">
          <h3>Profile text</h3>
          <label>Kicker<input value={content.profile.kicker} onChange={(e) => setContent({ ...content, profile: { ...content.profile, kicker: e.target.value } })} /></label>
          <label>Title<textarea rows={3} value={content.profile.title} onChange={(e) => setContent({ ...content, profile: { ...content.profile, title: e.target.value } })} /></label>
          <label>Description<textarea rows={4} value={content.profile.description} onChange={(e) => setContent({ ...content, profile: { ...content.profile, description: e.target.value } })} /></label>
          <label>Tools kicker<input value={content.profile.toolsKicker} onChange={(e) => setContent({ ...content, profile: { ...content.profile, toolsKicker: e.target.value } })} /></label>
          <label>Tools title<input value={content.profile.toolsTitle} onChange={(e) => setContent({ ...content, profile: { ...content.profile, toolsTitle: e.target.value } })} /></label>
          <label>Experience kicker<input value={content.profile.experienceKicker} onChange={(e) => setContent({ ...content, profile: { ...content.profile, experienceKicker: e.target.value } })} /></label>
          <label>Experience title<input value={content.profile.experienceTitle} onChange={(e) => setContent({ ...content, profile: { ...content.profile, experienceTitle: e.target.value } })} /></label>
          <label>Education kicker<input value={content.profile.educationKicker} onChange={(e) => setContent({ ...content, profile: { ...content.profile, educationKicker: e.target.value } })} /></label>
          <label>Education title<input value={content.profile.educationTitle} onChange={(e) => setContent({ ...content, profile: { ...content.profile, educationTitle: e.target.value } })} /></label>
        </div>

        <div className="admin-content-card">
          <h3>Portfolio section</h3>
          <label>Kicker<input value={content.portfolio.kicker} onChange={(e) => setContent({ ...content, portfolio: { ...content.portfolio, kicker: e.target.value } })} /></label>
          <label>Title<textarea rows={3} value={content.portfolio.title} onChange={(e) => setContent({ ...content, portfolio: { ...content.portfolio, title: e.target.value } })} /></label>
          <label>Description<textarea rows={4} value={content.portfolio.description} onChange={(e) => setContent({ ...content, portfolio: { ...content.portfolio, description: e.target.value } })} /></label>
        </div>

        <div className="admin-content-card">
          <h3>Skills</h3>
          <label>Core skills<input value={csv(content.coreSkills)} onChange={(e) => setContent({ ...content, coreSkills: fromCsv(e.target.value) })} /></label>
          <label>AI skills<input value={csv(content.aiSkills)} onChange={(e) => setContent({ ...content, aiSkills: fromCsv(e.target.value) })} /></label>
          <small>Comma separated. Example: GPT, Gemini, Google Flow, Freepik, Envato, Cloud, Antigravity, Vibe Coding</small>
        </div>

        <div className="admin-content-card">
          <h3>Contact</h3>
          <label>Kicker<input value={content.contact.kicker} onChange={(e) => setContent({ ...content, contact: { ...content.contact, kicker: e.target.value } })} /></label>
          <label>Title<textarea rows={3} value={content.contact.title} onChange={(e) => setContent({ ...content, contact: { ...content.contact, title: e.target.value } })} /></label>
          <label>Description<textarea rows={4} value={content.contact.description} onChange={(e) => setContent({ ...content, contact: { ...content.contact, description: e.target.value } })} /></label>
        </div>
      </div>

      <div className="admin-content-list">
        <div className="admin-content-list-head">
          <div><span>Software</span><h3>Creative tools</h3></div>
          <button type="button" onClick={() => setContent((prev) => ({ ...prev, tools: [...prev.tools, { code: "", name: "", use: "", icon: "sparkles" }] }))}><Plus size={15} /> Add tool</button>
        </div>

        {content.tools.map((item, index) => (
          <div className="admin-content-row tool" key={index}>
            <input placeholder="Code" value={item.code} onChange={(e) => updateTool(index, { code: e.target.value })} />
            <input placeholder="Tool name" value={item.name} onChange={(e) => updateTool(index, { name: e.target.value })} />
            <input placeholder="How you use it" value={item.use} onChange={(e) => updateTool(index, { use: e.target.value })} />
            <select value={item.icon} onChange={(e) => updateTool(index, { icon: e.target.value as SiteTool["icon"] })}>
              <option value="image">Image</option>
              <option value="pen">Pen</option>
              <option value="video">Video</option>
              <option value="sparkles">Sparkles</option>
            </select>
            <button type="button" className="admin-icon-button" onClick={() => setContent((prev) => ({ ...prev, tools: prev.tools.filter((_, i) => i !== index) }))}><Trash2 size={15} /></button>
          </div>
        ))}
      </div>

      <div className="admin-content-list">
        <div className="admin-content-list-head">
          <div><span>Career</span><h3>Work experience</h3></div>
          <button type="button" onClick={() => setContent((prev) => ({ ...prev, experience: [...prev.experience, { company: "", role: "", period: "", current: false, note: "" }] }))}><Plus size={15} /> Add experience</button>
        </div>

        {content.experience.map((item, index) => (
          <div className="admin-content-row" key={index}>
            <input placeholder="Company" value={item.company} onChange={(e) => updateExperience(index, { company: e.target.value })} />
            <input placeholder="Role" value={item.role} onChange={(e) => updateExperience(index, { role: e.target.value })} />
            <input placeholder="Period" value={item.period} onChange={(e) => updateExperience(index, { period: e.target.value })} />
            <input placeholder="Description" value={item.note} onChange={(e) => updateExperience(index, { note: e.target.value })} />
            <label className="admin-check"><input type="checkbox" checked={item.current} onChange={(e) => updateExperience(index, { current: e.target.checked })} /> Current</label>
            <button type="button" className="admin-icon-button" onClick={() => setContent((prev) => ({ ...prev, experience: prev.experience.filter((_, i) => i !== index) }))}><Trash2 size={15} /></button>
          </div>
        ))}
      </div>

      <div className="admin-content-list">
        <div className="admin-content-list-head">
          <div><span>Education</span><h3>Education & training</h3></div>
          <button type="button" onClick={() => setContent((prev) => ({ ...prev, education: [...prev.education, { title: "", place: "", meta: "" }] }))}><Plus size={15} /> Add education</button>
        </div>

        {content.education.map((item, index) => (
          <div className="admin-content-row education" key={index}>
            <input placeholder="Title" value={item.title} onChange={(e) => updateEducation(index, { title: e.target.value })} />
            <input placeholder="Place" value={item.place} onChange={(e) => updateEducation(index, { place: e.target.value })} />
            <input placeholder="Period / meta" value={item.meta} onChange={(e) => updateEducation(index, { meta: e.target.value })} />
            <button type="button" className="admin-icon-button" onClick={() => setContent((prev) => ({ ...prev, education: prev.education.filter((_, i) => i !== index) }))}><Trash2 size={15} /></button>
          </div>
        ))}
      </div>

      <div className="admin-ai-note">
        <Sparkles size={16} />
        <span>AI tools are shown in a compact row on the public profile.</span>
      </div>

      {message && <div className={"admin-upload-status " + (message.includes("updated") ? "success" : "")}>{message.includes("updated") && <Check size={15} />}<span>{message}</span></div>}
    </section>
  );
}
