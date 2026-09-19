"use client";

import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
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

const heroLight = "/hero-light.webp";
const heroDark = "/hero-dark.webp";

const tools = [
  { code: "Ps", name: "Adobe Photoshop", use: "Social design, image editing, compositing", icon: ImageIcon },
  { code: "Ai", name: "Adobe Illustrator", use: "Brand identity, vector design, logo work", icon: PenTool },
  { code: "Pr", name: "Adobe Premiere Pro", use: "Video editing, reels, promotional cuts", icon: Clapperboard },
  { code: "Ae", name: "Adobe After Effects", use: "Motion graphics, type animation, compositing", icon: Sparkles },
];

const coreSkills = [
  "Graphic Design",
  "Video Editing",
  "Wireframing",
  "Concepting",
  "Teamwork",
  "Communication",
];

const experience = [
  {
    company: "Apon.uk",
    role: "Graphic Designer",
    period: "04 Jun 2026 — Present",
    current: true,
    note: "Creating brand, campaign and digital visual assets across ongoing projects.",
  },
  {
    company: "Kreatech",
    role: "Designer & Editor",
    period: "2023 — Present",
    current: true,
    note: "Print materials, social media design, video editing and visual storytelling.",
  },
  {
    company: "Silk Road International",
    role: "Graphic Designer",
    period: "Feb 2026 — Jun 2026",
    current: false,
    note: "Worked across day-to-day graphic design and communication materials.",
  },
  {
    company: "Creative IT Institute",
    role: "Graphic Designer · Internship",
    period: "2023",
    current: false,
    note: "Hands-on work in social media design and branding.",
  },
  {
    company: "Fiverr",
    role: "Remote Graphic Designer",
    period: "2022 — 2023 · 6 months",
    current: false,
    note: "Delivered freelance graphic design work including social media graphics.",
  },
];

const education = [
  { title: "Graphic Design", place: "Creative IT Institute", meta: "2022 — 2023 · 8-month training" },
  { title: "Video Editing", place: "Creative IT Institute", meta: "2024 · 4-month course" },
  { title: "College", place: "Tejgaon College", meta: "Academic background" },
  { title: "BBA · Marketing", place: "Sonargaon University", meta: "2023 — Present" },
];

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
            <span className="status-dot" /> Available for selected projects
          </motion.span>
          <span>Dhaka, Bangladesh · Remote</span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .75, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <Tip text="Design that communicates before it decorates">Visuals with clarity.</Tip>
          <br />
          <em><Tip text="Motion that adds rhythm, not noise">Motion with character.</Tip></em>
        </motion.h1>

        <div className="hero-portrait-stage">
          <img className="hero-portrait-blur" src={theme === "dark" ? heroDark : heroLight} alt="" aria-hidden="true" />
          <motion.img
            key={theme}
            className="hero-portrait-main"
            src={theme === "dark" ? heroDark : heroLight}
            alt="Shabbir Hossain Azhaf"
            initial={{ opacity: 0, scale: .985, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: .5 }}
          />
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
              I’m Shabbir Hossain Azhaf — a graphic designer and video editor creating clean brand visuals, social design and motion-led stories.
            </Tip>
          </p>
          <div className="hero-links">
            <a href="/" onClick={(event) => scrollToId(event, "design")}>Explore work <ArrowUpRight size={15} /></a>
            <a href="mailto:shabbirhossain.gd@gmail.com">Email me <Mail size={15} /></a>
          </div>
        </div>
      </section>

      <PortfolioShowcase />

      <section className="mono-section profile-section" id="about">
        <div className="section-kicker"><span>02</span><span>Professional Profile</span></div>

        <div className="profile-intro">
          <h2>More than a gallery.<br /><em>A working creative profile.</em></h2>
          <p>
            Graphic designer and video editor focused on social content, brand identity, company profiles,
            print materials, reels and motion-led visual storytelling.
          </p>
        </div>

        <div className="profile-dashboard">
          <section className="tool-experience-panel" id="tools">
            <div className="profile-panel-head">
              <div>
                <span>Creative toolkit</span>
                <h3>Tools I work with</h3>
              </div>
              <Layers3 size={22} />
            </div>

            <div className="tool-experience-grid">
              {tools.map((item, index) => {
                const Icon = item.icon;
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
                {coreSkills.map((skill) => <span key={skill}>{skill}</span>)}
              </div>
            </div>
          </section>

          <section className="work-experience-panel" id="experience">
            <div className="profile-panel-head">
              <div>
                <span>Professional timeline</span>
                <h3>Work experience</h3>
              </div>
              <BriefcaseBusiness size={22} />
            </div>

            <div className="experience-timeline">
              {experience.map((item, index) => (
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
              <span>Education & training</span>
              <h3>Built through practice</h3>
            </div>
            <GraduationCap size={22} />
          </div>

          <div className="education-grid">
            {education.map((item, index) => (
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
          <div className="section-kicker invert"><span>03</span><Tip text="Freelance · Collaboration · Full-time">Let’s work together</Tip></div>
          <h2>Hiring?<br />Launching something?<br /><em>Send it my way.</em></h2>
          <p>Use the form for a project, collaboration, freelance request or full-time creative opportunity.</p>

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
