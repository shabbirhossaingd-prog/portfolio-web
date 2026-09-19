"use client";

import { useState } from "react";
import {
  Image as ImageIcon,
  LayoutDashboard,
  Link2,
  LogOut,
  Plus,
  Settings,
  Upload,
  Video,
} from "lucide-react";

export default function AdminPage() {
  const [type, setType] = useState<"design" | "video">("design");

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/">SA</a>
        <div className="admin-nav">
          <button className="active"><LayoutDashboard size={18} /> Dashboard</button>
          <button><ImageIcon size={18} /> Design work</button>
          <button><Video size={18} /> Video work</button>
          <button><Settings size={18} /> Settings</button>
        </div>
        <button className="admin-logout"><LogOut size={17} /> Log out</button>
      </aside>

      <section className="admin-main">
        <div className="admin-head">
          <div>
            <span>Portfolio CMS</span>
            <h1>Creative dashboard</h1>
          </div>
          <button className="admin-primary"><Plus size={17} /> Add project</button>
        </div>

        <div className="admin-note">
          <strong>Portfolio flow:</strong> publish an item with one of the site categories. Published work is loaded dynamically on the homepage and appears first as a round preview, not as a full-size card.
        </div>

        <div className="admin-layout">
          <div className="admin-panel">
            <div className="admin-panel-title">
              <h2>Add new portfolio item</h2>
              <span>Draft</span>
            </div>

            <div className="admin-toggle">
              <button className={type === "design" ? "active" : ""} onClick={() => setType("design")}>
                <ImageIcon size={17} /> Design
              </button>
              <button className={type === "video" ? "active" : ""} onClick={() => setType("video")}>
                <Video size={17} /> Video
              </button>
            </div>

            <div className="admin-fields">
              <label>Project title<input placeholder="e.g. Brand campaign 2026" /></label>
              <label>Category
                <select defaultValue={type === "design" ? "Posters" : "Reels"}>
                  {type === "design" ? (
                    <>
                      <option>Posters</option>
                      <option>Logos</option>
                      <option>Company Profiles</option>
                    </>
                  ) : (
                    <>
                      <option>Reels</option>
                      <option>Videos</option>
                      <option>Animations</option>
                    </>
                  )}
                </select>
              </label>
              <label>Description<textarea rows={4} placeholder="Short case-study description..." /></label>

              <div className="upload-box">
                <Upload size={22} />
                <strong>{type === "design" ? "Upload cover / artwork" : "Upload video or poster"}</strong>
                <span>Drag files here or choose from your device</span>
                <button>Choose file</button>
              </div>

              {type === "video" && (
                <label>YouTube link
                  <div className="url-input"><Link2 size={17} /><input placeholder="https://youtu.be/..." /></div>
                  <small>Paste a YouTube URL to generate an in-site video preview.</small>
                </label>
              )}
            </div>

            <div className="admin-actions">
              <button>Save draft</button>
              <button className="admin-primary">Publish project</button>
            </div>
          </div>

          <div className="admin-preview">
            <div className="admin-preview-head">
              <span>Live preview</span>
              <span>{type === "design" ? "Design card" : "Video card"}</span>
            </div>
            <div className={"preview-card " + type}>
              <div className="preview-tag">{type === "design" ? "SOCIAL MEDIA" : "MOTION GRAPHICS"}</div>
              <div className="preview-big">{type === "design" ? "MAKE IT\nVISIBLE." : "FRAME\nBY FRAME."}</div>
              {type === "video" && <div className="preview-play">▶</div>}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
