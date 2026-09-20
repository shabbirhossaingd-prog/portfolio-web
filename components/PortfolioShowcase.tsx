"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { ArrowLeft, ArrowRight, Maximize2, Play, X } from "lucide-react";

type FilterName = "All Work" | "Posters" | "Reels" | "Videos" | "AI Video" | "Logos" | "Company Profiles" | "Animations";

type PortfolioItem = {
  id: string;
  title: string;
  slug?: string | null;
  type: "design" | "video";
  category: string;
  description?: string | null;
  cover_url?: string | null;
  gallery_urls?: string[] | null;
  video_url?: string | null;
  youtube_url?: string | null;
  source_url?: string | null;
  source_kind?: "upload" | "youtube" | "drive" | "direct" | "embed" | null;
  year?: number | string | null;
  sort_order?: number | null;
};

const filters: FilterName[] = [
  "All Work",
  "Posters",
  "Reels",
  "Videos",
  "AI Video",
  "Logos",
  "Company Profiles",
  "Animations",
];


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bgrpvjuvghdjbxmljtgm.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_WheOVPSgKqPTXiHuD1uhXA_S4Vubljo";
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

function resolveFilter(item: PortfolioItem): Exclude<FilterName, "All Work"> {
  const text = (item.category + " " + item.title).toLowerCase();

  if (/ai video|generative video|ai-generated/.test(text)) return "AI Video";
  if (/reel|short[- ]?form|social video/.test(text)) return "Reels";
  if (/animation|motion|after effects|kinetic/.test(text)) return "Animations";
  if (/company profile|profile|editorial|brochure|corporate/.test(text)) return "Company Profiles";
  if (/logo|identity|brand mark/.test(text)) return "Logos";
  if (/video|film|promo|edit/.test(text)) return "Videos";
  return "Posters";
}

function youtubeId(url?: string | null) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) return parsed.pathname.replace("/", "").split("/")[0] || null;
    if (parsed.pathname.startsWith("/embed/")) return parsed.pathname.split("/embed/")[1]?.split("/")[0] || null;
    if (parsed.pathname.startsWith("/shorts/")) return parsed.pathname.split("/shorts/")[1]?.split("/")[0] || null;
    return parsed.searchParams.get("v");
  } catch {
    return null;
  }
}

function youtubeThumb(url?: string | null) {
  const id = youtubeId(url);
  return id ? "https://img.youtube.com/vi/" + id + "/hqdefault.jpg" : null;
}

function driveFileId(url?: string | null) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const pathId = parsed.pathname.match(/\/file\/d\/([^/]+)/)?.[1];
    return pathId || parsed.searchParams.get("id");
  } catch {
    return null;
  }
}

function driveResourceKey(url?: string | null) {
  if (!url) return "";
  try {
    return new URL(url).searchParams.get("resourcekey") || "";
  } catch {
    return "";
  }
}

function drivePreview(url?: string | null) {
  const id = driveFileId(url);
  if (!id) return null;
  const resourceKey = driveResourceKey(url);
  return "https://drive.google.com/file/d/" + id + "/preview" + (resourceKey ? "?resourcekey=" + encodeURIComponent(resourceKey) : "");
}

function driveThumb(url?: string | null) {
  const id = driveFileId(url);
  if (!id) return null;
  const resourceKey = driveResourceKey(url);
  return "https://drive.google.com/thumbnail?id=" + id + "&sz=w2000" + (resourceKey ? "&resourcekey=" + encodeURIComponent(resourceKey) : "");
}

function isCompanyProfile(item: PortfolioItem) {
  return resolveFilter(item) === "Company Profiles";
}

function isPdfUrl(url?: string | null) {
  if (!url) return false;
  try {
    return /\.pdf$/i.test(new URL(url).pathname);
  } catch {
    return /\.pdf(?:$|[?#])/i.test(url);
  }
}

function pdfCoverUrl(url: string) {
  const joiner = url.includes("#") ? "&" : "#";
  return url + joiner + "page=1&toolbar=0&navpanes=0&scrollbar=0&view=FitH";
}

function pdfViewerUrl(url: string) {
  return "https://docs.google.com/gview?embedded=1&url=" + encodeURIComponent(url);
}

function itemCover(item: PortfolioItem) {
  if (item.source_kind === "drive") return driveThumb(item.source_url);
  if (item.source_kind === "youtube") return youtubeThumb(item.source_url || item.youtube_url);
  return item.cover_url || item.gallery_urls?.[0] || youtubeThumb(item.youtube_url) || null;
}

function PinMedia({ item, index }: { item: PortfolioItem; index: number }) {
  const cover = itemCover(item);
  const category = resolveFilter(item);
  const documentUrl = item.source_url || item.cover_url || item.gallery_urls?.[0] || null;

  if (isCompanyProfile(item) && documentUrl && isPdfUrl(documentUrl) && item.source_kind !== "drive") {
    return (
      <div className="portfolio-profile-cover" aria-hidden="true">
        <iframe
          src={pdfCoverUrl(documentUrl)}
          title=""
          loading="lazy"
          tabIndex={-1}
        />
      </div>
    );
  }

  if (item.video_url && !item.cover_url) {
    return (
      <video
        src={item.video_url}
        muted
        playsInline
        preload="metadata"
        aria-label={item.title || "Portfolio video"}
      />
    );
  }

  if (cover) {
    return (
      <img
        src={cover}
        alt={item.title || category}
        loading="lazy"
        decoding="async"
        fetchPriority="low"
      />
    );
  }

  return (
    <div className={"portfolio-pin-placeholder ratio-" + (index % 4)} aria-hidden="true">
      <span>{category}</span>
      <strong>{item.title}</strong>
    </div>
  );
}

function FullMedia({ item }: { item: PortfolioItem }) {
  const videoId = youtubeId(item.source_url || item.youtube_url);
  const documentUrl = item.source_url || item.cover_url || item.gallery_urls?.[0] || null;

  if (isCompanyProfile(item) && documentUrl) {
    if (item.source_kind === "drive") {
      const preview = drivePreview(documentUrl);
      if (preview) {
        return (
          <iframe
            className="portfolio-full-profile"
            src={preview}
            title={item.title || "Company profile"}
            allow="autoplay"
            allowFullScreen
          />
        );
      }
    }

    if (isPdfUrl(documentUrl)) {
      return (
        <iframe
          className="portfolio-full-profile"
          src={pdfViewerUrl(documentUrl)}
          title={item.title || "Company profile PDF"}
          allowFullScreen
        />
      );
    }

    if ((item.gallery_urls?.length || 0) > 1) {
      return (
        <div className="portfolio-profile-pages" aria-label={item.title || "Company profile pages"}>
          {item.gallery_urls!.map((url, pageIndex) => (
            <img
              key={url + pageIndex}
              src={url}
              alt={(item.title || "Company profile") + " page " + (pageIndex + 1)}
              loading={pageIndex < 2 ? "eager" : "lazy"}
              decoding="async"
            />
          ))}
        </div>
      );
    }
  }

  if (item.source_kind === "drive" && item.source_url) {
    if (item.type === "design") {
      const image = driveThumb(item.source_url);
      if (image) {
        return (
          <img
            className="portfolio-full-image"
            src={image}
            alt={item.title || "Portfolio artwork"}
            loading="eager"
            decoding="async"
          />
        );
      }
    }

    const preview = drivePreview(item.source_url);
    if (preview) {
      return (
        <iframe
          className="portfolio-full-drive"
          src={preview}
          title={item.title || "Portfolio video"}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      );
    }
  }

  if (videoId) {
    return (
      <iframe
        className="portfolio-full-youtube"
        src={"https://www.youtube.com/embed/" + videoId + "?autoplay=1&controls=1&rel=0"}
        title={item.title}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (item.video_url) {
    return (
      <video
        className="portfolio-full-video"
        src={item.video_url}
        controls
        autoPlay
        playsInline
        preload="metadata"
      />
    );
  }

  const cover = itemCover(item);
  if (cover) {
    return (
      <img
        className="portfolio-full-image"
        src={cover}
        alt={item.title || "Portfolio artwork"}
        loading="eager"
        decoding="async"
      />
    );
  }

  return (
    <div className="portfolio-full-empty">
      <div className="portfolio-pin-placeholder ratio-1">
        <span>{resolveFilter(item)}</span>
        <strong>{item.title}</strong>
      </div>
    </div>
  );
}

export default function PortfolioShowcase({
  content,
}: {
  content: { kicker: string; title: string; description: string };
}) {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterName>("All Work");
  const [selectedId, setSelectedId] = useState("");
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      if (!supabase) return;

      const { data, error } = await supabase
        .from("projects")
        .select("id,title,slug,type,category,description,cover_url,gallery_urls,video_url,youtube_url,source_url,source_kind,year,sort_order")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (cancelled) return;
      if (error) {
        setItems([]);
        return;
      }
      setItems((data || []) as PortfolioItem[]);
    }

    loadProjects();

    const channel = supabase
      ?.channel("portfolio-public-sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
        () => loadProjects(),
      )
      .subscribe();

    return () => {
      cancelled = true;
      if (channel && supabase) supabase.removeChannel(channel);
    };
  }, []);

  const filtered = useMemo(() => {
    if (activeFilter === "All Work") return items;
    return items.filter((item) => resolveFilter(item) === activeFilter);
  }, [items, activeFilter]);

  const initialVisibleCount = 16;
  const visibleFiltered = expanded ? filtered : filtered.slice(0, initialVisibleCount);
  const hasMore = filtered.length > initialVisibleCount;

  useEffect(() => {
    setExpanded(false);
  }, [activeFilter]);

  const selected = items.find((item) => item.id === selectedId) || null;
  const selectedIndex = selected ? filtered.findIndex((item) => item.id === selected.id) : -1;

  function openItem(item: PortfolioItem) {
    setSelectedId(item.id);
    setOpen(true);
  }

  function navigate(delta: number) {
    if (!selected || filtered.length < 2) return;
    const current = Math.max(0, filtered.findIndex((item) => item.id === selected.id));
    const next = (current + delta + filtered.length) % filtered.length;
    setSelectedId(filtered[next].id);
  }

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowRight") navigate(1);
      if (event.key === "ArrowLeft") navigate(-1);
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, selectedId, filtered]);

  return (
    <section className="mono-section portfolio-section" id="design">
      <div className="section-kicker"><span>01</span><span>{content.kicker}</span></div>

      <div className="section-title-row">
        <h2>{content.title.split("\n")[0]}<br />{content.title.split("\n").slice(1).join(" ")}</h2>
        <p>{content.description}</p>
      </div>

      <div className="portfolio-filter-row portfolio-filter-sticky" role="tablist" aria-label="Portfolio categories">
        {filters.map((filter) => {
          const count = filter === "All Work" ? items.length : items.filter((item) => resolveFilter(item) === filter).length;
          return (
            <button
              key={filter}
              type="button"
              role="tab"
              aria-selected={activeFilter === filter}
              className={activeFilter === filter ? "active" : ""}
              onClick={() => setActiveFilter(filter)}
            >
              <span>{filter}</span>
              <small>{String(count).padStart(2, "0")}</small>
            </button>
          );
        })}
      </div>

      {expanded && hasMore && (
        <div className="portfolio-expand-bar portfolio-expand-top">
          <span>Showing all {filtered.length} projects</span>
          <button
            type="button"
            onClick={() => {
              setExpanded(false);
              requestAnimationFrame(() => {
                document.getElementById("design")?.scrollIntoView({ behavior: "smooth", block: "start" });
              });
            }}
          >
            See less
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {filtered.length ? (
          <motion.div
            key={activeFilter}
            className="portfolio-masonry"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.26 }}
          >
            {visibleFiltered.map((item, index) => {
              const isVideo = item.type === "video" || Boolean(item.video_url || item.youtube_url);
              return (
                <motion.article
                  className="portfolio-pin"
                  key={item.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.38, delay: Math.min(index * 0.025, 0.18) }}
                >
                  <button type="button" className="portfolio-pin-media" onClick={() => openItem(item)} aria-label={item.title ? "Open " + item.title : "Open portfolio item"}>
                    <PinMedia item={item} index={index} />
                    <span className="portfolio-pin-shade" />
                    {isVideo && <span className="portfolio-pin-play"><Play size={15} fill="currentColor" /> Play</span>}
                    <span className="portfolio-pin-open"><Maximize2 size={15} /> View</span>
                  </button>

                  {item.title && (
                    <div className="portfolio-pin-title-overlay">
                      <span>{item.title}</span>
                    </div>
                  )}
                </motion.article>
              );
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {!expanded && hasMore && (
        <div className="portfolio-expand-bar portfolio-expand-bottom">
          <span>{Math.min(initialVisibleCount, filtered.length)} of {filtered.length} projects</span>
          <button type="button" onClick={() => setExpanded(true)}>
            Show more
          </button>
        </div>
      )}

      <AnimatePresence>
        {open && selected && (
          <motion.div
            className="portfolio-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={selected.title || "Portfolio full view"}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
          >
            <button type="button" className="portfolio-lightbox-close" onClick={() => setOpen(false)} aria-label="Close full view">
              <X size={20} />
            </button>

            {filtered.length > 1 && (
              <>
                <button type="button" className="portfolio-lightbox-nav prev" onClick={() => navigate(-1)} aria-label="Previous project">
                  <ArrowLeft size={20} />
                </button>
                <button type="button" className="portfolio-lightbox-nav next" onClick={() => navigate(1)} aria-label="Next project">
                  <ArrowRight size={20} />
                </button>
              </>
            )}

            <motion.div
              key={selected.id}
              className="portfolio-lightbox-content"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
            >
              <FullMedia item={selected} />
              <div className="portfolio-lightbox-caption">
                <span>
                  {resolveFilter(selected)}
                  {selectedIndex >= 0 ? " · " + String(selectedIndex + 1).padStart(2, "0") + "/" + String(filtered.length).padStart(2, "0") : ""}
                </span>
                {selected.title && <strong>{selected.title}</strong>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
