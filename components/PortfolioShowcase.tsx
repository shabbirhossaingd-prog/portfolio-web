"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { ArrowLeft, ArrowRight, Maximize2, Play, X } from "lucide-react";
import { designProjects, motionProjects } from "@/lib/portfolio";

type FilterName = "All Work" | "Posters" | "Reels" | "Videos" | "Logos" | "Company Profiles" | "Animations";

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
  year?: number | string | null;
  sort_order?: number | null;
};

const filters: FilterName[] = [
  "All Work",
  "Posters",
  "Reels",
  "Videos",
  "Logos",
  "Company Profiles",
  "Animations",
];

const fallbackItems: PortfolioItem[] = [
  ...designProjects.map((project, index) => ({
    id: "design-" + index,
    title: project.title,
    type: "design" as const,
    category: project.category,
    description: project.description,
    year: project.year,
  })),
  ...motionProjects.map((project, index) => ({
    id: "motion-" + index,
    title: project.title,
    type: "video" as const,
    category: project.category,
    description: project.description,
    year: project.year,
  })),
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

function resolveFilter(item: PortfolioItem): Exclude<FilterName, "All Work"> {
  const text = (item.category + " " + item.title).toLowerCase();

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

function itemCover(item: PortfolioItem) {
  return item.cover_url || item.gallery_urls?.[0] || youtubeThumb(item.youtube_url) || null;
}

function PreviewMedia({ item, compact = false }: { item: PortfolioItem; compact?: boolean }) {
  const cover = itemCover(item);

  if (cover) {
    return <img src={cover} alt={item.title} loading={compact ? "lazy" : "eager"} />;
  }

  if (!compact && item.video_url) {
    return <video src={item.video_url} muted playsInline preload="metadata" aria-label={item.title} />;
  }

  return (
    <div className="portfolio-empty-art" aria-hidden="true">
      <span>{resolveFilter(item)}</span>
      <strong>{item.title.slice(0, 2).toUpperCase()}</strong>
    </div>
  );
}

function FullMedia({ item }: { item: PortfolioItem }) {
  const videoId = youtubeId(item.youtube_url);

  if (videoId) {
    return (
      <iframe
        className="portfolio-full-youtube"
        src={"https://www.youtube.com/embed/" + videoId + "?autoplay=1&rel=0"}
        title={item.title}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (item.video_url) {
    return <video className="portfolio-full-video" src={item.video_url} controls autoPlay playsInline />;
  }

  const cover = itemCover(item);
  if (cover) return <img className="portfolio-full-image" src={cover} alt={item.title} />;

  return <div className="portfolio-full-empty"><PreviewMedia item={item} /></div>;
}

export default function PortfolioShowcase() {
  const [items, setItems] = useState<PortfolioItem[]>(fallbackItems);
  const [activeFilter, setActiveFilter] = useState<FilterName>("All Work");
  const [selectedId, setSelectedId] = useState(fallbackItems[0]?.id || "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      if (!supabase) return;

      const { data, error } = await supabase
        .from("projects")
        .select("id,title,slug,type,category,description,cover_url,gallery_urls,video_url,youtube_url,year,sort_order")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (cancelled || error || !data?.length) return;

      const nextItems = data as PortfolioItem[];
      setItems(nextItems);
      setSelectedId(nextItems[0].id);
    }

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (activeFilter === "All Work") return items;
    return items.filter((item) => resolveFilter(item) === activeFilter);
  }, [items, activeFilter]);

  const selected = filtered.find((item) => item.id === selectedId) || filtered[0] || null;

  useEffect(() => {
    if (filtered.length && !filtered.some((item) => item.id === selectedId)) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

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

  function changeFilter(filter: FilterName) {
    setActiveFilter(filter);
    const next = filter === "All Work" ? items : items.filter((item) => resolveFilter(item) === filter);
    if (next[0]) setSelectedId(next[0].id);
  }

  function navigate(delta: number) {
    if (!selected || filtered.length < 2) return;
    const current = filtered.findIndex((item) => item.id === selected.id);
    const next = (current + delta + filtered.length) % filtered.length;
    setSelectedId(filtered[next].id);
  }

  return (
    <section className="mono-section portfolio-section" id="design">
      <div className="section-kicker"><span>01</span><span>Selected Work</span></div>

      <div className="section-title-row">
        <h2>Small previews first.<br />Full work on demand.</h2>
        <p>
          Choose a category, move through the round previews, then click the main piece for a full-screen view.
          New published work from the portfolio database appears here automatically.
        </p>
      </div>

      <div className="portfolio-filter-row" role="tablist" aria-label="Portfolio categories">
        {filters.map((filter) => {
          const count = filter === "All Work" ? items.length : items.filter((item) => resolveFilter(item) === filter).length;
          return (
            <button
              key={filter}
              type="button"
              role="tab"
              aria-selected={activeFilter === filter}
              className={activeFilter === filter ? "active" : ""}
              onClick={() => changeFilter(filter)}
            >
              <span>{filter}</span>
              <small>{String(count).padStart(2, "0")}</small>
            </button>
          );
        })}
      </div>

      {selected ? (
        <div className="portfolio-browser">
          <div className="portfolio-orbit-rail" aria-label="Portfolio previews">
            {filtered.map((item, index) => (
              <motion.button
                type="button"
                key={item.id}
                className={"portfolio-orbit-thumb " + (selected.id === item.id ? "active" : "")}
                onClick={() => setSelectedId(item.id)}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                aria-label={"Show " + item.title}
                aria-pressed={selected.id === item.id}
              >
                <PreviewMedia item={item} compact />
                <span>{String(index + 1).padStart(2, "0")}</span>
              </motion.button>
            ))}
          </div>

          <div className="portfolio-focus">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                className="portfolio-focus-media"
                initial={{ opacity: 0, scale: 0.985, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.3 }}
              >
                <PreviewMedia item={selected} />
                {(selected.type === "video" || selected.video_url || selected.youtube_url) && (
                  <span className="portfolio-play-badge"><Play size={16} fill="currentColor" /> Play</span>
                )}
                <button type="button" className="portfolio-open" onClick={() => setOpen(true)}>
                  <Maximize2 size={17} />
                  Full view
                </button>
              </motion.div>
            </AnimatePresence>

            <div className="portfolio-focus-meta">
              <div>
                <span>{resolveFilter(selected)} · {selected.year || "Selected"}</span>
                <h3>{selected.title}</h3>
                {selected.description && <p>{selected.description}</p>}
              </div>
              <div className="portfolio-focus-count">
                <strong>{String(filtered.findIndex((item) => item.id === selected.id) + 1).padStart(2, "0")}</strong>
                <span>/ {String(filtered.length).padStart(2, "0")}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="portfolio-no-results">No published work in this category yet.</div>
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
            aria-label={selected.title}
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
                <span>{resolveFilter(selected)}</span>
                <strong>{selected.title}</strong>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
