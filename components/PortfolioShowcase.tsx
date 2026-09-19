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

function PinMedia({ item, index }: { item: PortfolioItem; index: number }) {
  const cover = itemCover(item);
  const category = resolveFilter(item);

  if (item.video_url && !item.cover_url) {
    return (
      <video
        src={item.video_url}
        muted
        playsInline
        preload="metadata"
        aria-label={item.title}
      />
    );
  }

  if (cover) {
    return <img src={cover} alt={item.title} loading="lazy" />;
  }

  return (
    <div className={"portfolio-pin-placeholder ratio-" + (index % 4)} aria-hidden="true">
      <span>{category}</span>
      <strong>{item.title}</strong>
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

  return (
    <div className="portfolio-full-empty">
      <div className="portfolio-pin-placeholder ratio-1">
        <span>{resolveFilter(item)}</span>
        <strong>{item.title}</strong>
      </div>
    </div>
  );
}

export default function PortfolioShowcase() {
  const [items, setItems] = useState<PortfolioItem[]>(fallbackItems);
  const [activeFilter, setActiveFilter] = useState<FilterName>("All Work");
  const [selectedId, setSelectedId] = useState("");
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
      setItems(data as PortfolioItem[]);
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
      <div className="section-kicker"><span>01</span><span>Selected Work</span></div>

      <div className="section-title-row">
        <h2>Browse everything.<br />Filter what you need.</h2>
        <p>
          A Pinterest-inspired portfolio wall. All Work shows everything; each category button instantly shows every project from that category.
          Click any piece to open the full poster, reel, video or case-study view.
        </p>
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
            {filtered.map((item, index) => {
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
                  <button type="button" className="portfolio-pin-media" onClick={() => openItem(item)} aria-label={"Open " + item.title}>
                    <PinMedia item={item} index={index} />
                    <span className="portfolio-pin-shade" />
                    {isVideo && <span className="portfolio-pin-play"><Play size={15} fill="currentColor" /> Play</span>}
                    <span className="portfolio-pin-open"><Maximize2 size={15} /> View</span>
                  </button>

                  <div className="portfolio-pin-meta">
                    <div>
                      <span>{resolveFilter(item)}{item.year ? " · " + item.year : ""}</span>
                      <h3>{item.title}</h3>
                    </div>
                    <button type="button" onClick={() => openItem(item)} aria-label={"Open " + item.title}>
                      <Maximize2 size={15} />
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        ) : (
          <motion.div className="portfolio-no-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            No published work in this category yet.
          </motion.div>
        )}
      </AnimatePresence>

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
                <span>
                  {resolveFilter(selected)}
                  {selectedIndex >= 0 ? " · " + String(selectedIndex + 1).padStart(2, "0") + "/" + String(filtered.length).padStart(2, "0") : ""}
                </span>
                <strong>{selected.title}</strong>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
