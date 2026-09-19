"use client";

import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  Clapperboard,
  GraduationCap,
  Image as ImageIcon,
  Instagram,
  Layers3,
  Linkedin,
  Mail,
  MessageCircle,
  Moon,
  Palette,
  PenTool,
  Sparkles,
  Sun,
  Users,
} from "lucide-react";
import ContactForm from "@/components/ContactForm";
import PortfolioShowcase from "@/components/PortfolioShowcase";
import { defaultSiteContent, type SiteContent } from "@/lib/site-content";

const heroLightFallback = "/hero-light.webp";
const heroDarkFallback = "/hero-dark.webp";

const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bgrpvjuvghdjbxmljtgm.supabase.co";
const publicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_WheOVPSgKqPTXiHuD1uhXA_S4Vubljo";
const contentClient = publicUrl && publicAnonKey ? createClient(publicUrl, publicAnonKey) : null;

const toolIconMap = {
  image: ImageIcon,
  pen: PenTool,
  video: Clapperboard,
  sparkles: Sparkles,
} as const;

function scrollToId(event: MouseEvent<HTMLAnchorElement>, id: string) {
  event.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", window.location.pathname + window.location.search);
}

function Tip({ children, text, className = "" }: { children: ReactNode; text: string; className?: string }) {
  return <span className={"hover-tip " + className} data-tip={text}>{children}</span>;
}

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);

  useEffect(() => {
    let cancelled = false;

    async function loadSiteContent() {
      if (!contentClient) return;
      const { data, error } = await contentClient
        .from("site_content")
        .select("value")
        .eq("key", "site")
        .maybeSingle();

      if (!cancelled && !error && data?.value) {
        const value = data.value as Partial<SiteContent>;
        setSiteContent({
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
        });
      }
    }

    loadSiteContent();

    const channel = contentClient
      ?.channel("site-content-sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_content" },
        () => loadSiteContent(),
      )
      .subscribe();

    return () => {
      cancelled = true;
      if (channel && contentClient) contentClient.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    const saved = window.localStorage.getItem("portfolio-theme");
    if (saved === "dark" || saved === "light") {
      setTheme(saved);
      return;
    }
    setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }, []);

  const changeTheme = (value: "light" | "dark") => {
    setTheme(value);
    window.localStorage.setItem("portfolio-theme", value);
  };

  const heroLight = siteContent.hero.lightImage || heroLightFallback;
  const heroDark = siteContent.hero.darkImage || heroDarkFallback;

  return (
    <main className={"mono-page theme-" + theme}>
      <header className="mono-nav">
        <a href="/" onClick={(event) => scrollToId(event, "home")} className="mono-name"><Tip text="Graphic Designer · Video Editor">Shabbir Azhaf</Tip></a>
        <nav>
          <a href="/" onClick={(event) => scrollToId(event, "design")}><Tip text="Posters, reels, video, logos and motion">Work</Tip></a>
          <a href="/" onClick={(event) => scrollToId(event, "tools")}><Tip text="Creative software and capabilities">Tools</Tip></a>
          <a href="/" onClick={(event) => scrollToId(event, "experience")}><Tip text="Professional work history">Experience</Tip></a>
          <a href="/" onClick={(event) => scrollToId(event, "contact")}><Tip text="Hiring & project inquiry">Contact</Tip></a>
        </nav>
        <div className="nav-actions">
          <div className="theme-switch" aria-label="Theme selector">
            <button className={theme === "light" ? "active" : ""} onClick={() => changeTheme("light")} aria-label="Light mode" aria-pressed={theme === "light"}>
              <Sun size={14} />
            </button>
            <button className={theme === "dark" ? "active" : ""} onClick={() => changeTheme("dark")} aria-label="Dark mode" aria-pressed={theme === "dark"}>
              <Moon size={14} />
            </button>
          </div>
          <a href="/" onClick={(event) => scrollToId(event, "contact")} className="mono-pill">Hire Me <ArrowUpRight size={14} /></a>
        </div>
      </header>

      <section className="mono-hero" id="home">
        <div className="hero-copy-top">
          <motion.span initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }}>
            <span className="status-dot" /> {siteContent.hero.status}
          </motion.span>
          <span>{siteContent.hero.location}</span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .75, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <Tip text="Design that communicates before it decorates">{siteContent.hero.title1}</Tip>
          <br />
          <em><Tip text="Motion that adds rhythm, not noise">{siteContent.hero.title2}</Tip></em>
        </motion.h1>

        <div className="hero-portrait-stage">
          <Image
            className="hero-portrait-blur"
            src={theme === "dark" ? heroDark : heroLight}
            alt=""
            aria-hidden="true"
            fill
            sizes="(max-width: 760px) 92vw, 440px"
            quality={72}
          />
          <motion.div
            key={theme}
            className="hero-portrait-motion"
            initial={{ opacity: 0, scale: .985, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: .5 }}
          >
            <Image
              className="hero-portrait-main"
              src={theme === "dark" ? heroDark : heroLight}
              alt="Shabbir Hossain Azhaf"
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 760px) 92vw, 440px"
              quality={96}
            />
          </motion.div>
          <div className="portrait-edge-fade" />
          <div className="portrait-mode">
            <button className={theme === "light" ? "active" : ""} onClick={() => changeTheme("light")} aria-pressed={theme === "light"}>White</button>
            <span>/</span>
            <button className={theme === "dark" ? "active" : ""} onClick={() => changeTheme("dark")} aria-pressed={theme === "dark"}>Black</button>
          </div>
        </div>

        <div className="hero-bottom">
          <p>
            <Tip text="Personal portfolio statement">
              {siteContent.hero.intro}
            </Tip>
          </p>
          <div className="hero-links">
            <a href="/" onClick={(event) => scrollToId(event, "design")}>Explore work <ArrowUpRight size={15} /></a>
            <a href="mailto:shabbirhossain.gd@gmail.com">Email me <Mail size={15} /></a>
          </div>
        </div>
      </section>

      <PortfolioShowcase content={siteContent.portfolio} />

      <section className="mono-section profile-section" id="about">
        <div className="section-kicker"><span>02</span><span>{siteContent.profile.kicker}</span></div>

        <div className="profile-intro">
          <h2>{siteContent.profile.title.split("\n")[0]}<br /><em>{siteContent.profile.title.split("\n").slice(1).join(" ")}</em></h2>
          <p>{siteContent.profile.description}</p>
        </div>

        <div className="profile-dashboard">
          <section className="tool-experience-panel" id="tools">
            <div className="profile-panel-head">
              <div>
                <span>{siteContent.profile.toolsKicker}</span>
                <h3>{siteContent.profile.toolsTitle}</h3>
              </div>
              <Layers3 size={22} />
            </div>

            <div className="tool-experience-grid">
              {siteContent.tools.map((item, index) => {
                const Icon = toolIconMap[item.icon] || Sparkles;
                return (
                  <motion.article
                    className="tool-experience-card"
                    key={item.code}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * .06 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="tool-icon-orbit">
                      <Icon size={18} />
                      <span>{item.code}</span>
                    </div>
                    <div>
                      <strong>{item.name}</strong>
                      <p>{item.use}</p>
                    </div>
                    <ArrowUpRight size={15} />
                  </motion.article>
                );
              })}
            </div>

            <div className="core-skill-strip">
              <span className="skill-strip-label"><Users size={15} /> Core skills</span>
              <div>
                {siteContent.coreSkills.map((skill) => <span key={skill}>{skill}</span>)}
              </div>
            </div>

            <div className="ai-skill-strip">
              <span className="skill-strip-label"><Sparkles size={15} /> AI workflow</span>
              <div>
                {siteContent.aiSkills.map((skill) => <span key={skill}>{skill}</span>)}
              </div>
            </div>
          </section>

          <section className="work-experience-panel" id="experience">
            <div className="profile-panel-head">
              <div>
                <span>{siteContent.profile.experienceKicker}</span>
                <h3>{siteContent.profile.experienceTitle}</h3>
              </div>
              <BriefcaseBusiness size={22} />
            </div>

            <div className="experience-timeline">
              {siteContent.experience.map((item, index) => (
                <motion.article
                  className="experience-item"
                  key={item.company + item.period}
                  initial={{ opacity: 0, x: 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * .055 }}
                >
                  <div className="experience-marker">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="experience-copy">
                    <div className="experience-topline">
                      <div>
                        <h4>{item.company}</h4>
                        <strong>{item.role}</strong>
                      </div>
                      {item.current && <span className="current-badge"><i /> Current</span>}
                    </div>
                    <div className="experience-period"><CalendarDays size={13} /> {item.period}</div>
                    <p>{item.note}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        </div>

        <section className="education-panel">
          <div className="profile-panel-head">
            <div>
              <span>{siteContent.profile.educationKicker}</span>
              <h3>{siteContent.profile.educationTitle}</h3>
            </div>
            <GraduationCap size={22} />
          </div>

          <div className="education-grid">
            {siteContent.education.map((item, index) => (
              <motion.article
                key={item.title + item.meta}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * .06 }}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.place}</p>
                </div>
                <small>{item.meta}</small>
              </motion.article>
            ))}
          </div>
        </section>
      </section>

      <section className="mono-contact" id="contact">
        <div className="contact-copy">
          <div className="section-kicker invert"><span>03</span><Tip text="Freelance · Collaboration · Full-time">{siteContent.contact.kicker}</Tip></div>
          <h2>{siteContent.contact.title.split("\n")[0]}<br />{siteContent.contact.title.split("\n")[1]}<br /><em>{siteContent.contact.title.split("\n").slice(2).join(" ")}</em></h2>
          <p>{siteContent.contact.description}</p>

          <div className="social-row">
            <a href="https://www.linkedin.com/in/designerazhaf/" target="_blank" rel="noreferrer"><Linkedin size={17} /> LinkedIn</a>
            <a href="https://wa.me/8801701523130?text=Hi%20Shabbir%2C%20I%20found%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project." target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp</a>
            <a href="https://www.instagram.com/grapeobd/" target="_blank" rel="noreferrer"><Instagram size={17} /> Instagram</a>
            <a href="https://www.behance.net/azhafahmed" target="_blank" rel="noreferrer"><Palette size={17} /> Behance</a>
          </div>
        </div>
        <ContactForm />
      </section>

      <footer className="mono-footer">
        <div><strong>Shabbir Hossain Azhaf</strong><span>Graphic Designer / Video Editor</span></div>
        <div><a href="/" onClick={(event) => scrollToId(event, "design")}>Work</a><a href="/" onClick={(event) => scrollToId(event, "tools")}>Tools</a><a href="/" onClick={(event) => scrollToId(event, "experience")}>Experience</a><a href="/" onClick={(event) => scrollToId(event, "contact")}>Contact</a></div>
        <span>© 2026</span>
      </footer>
    </main>
  );
}
