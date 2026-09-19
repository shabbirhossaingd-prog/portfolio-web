"use client";

import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  Moon,
  Palette,
  Sparkles,
  Sun,
  WandSparkles,
} from "lucide-react";
import ContactForm from "@/components/ContactForm";
import PortfolioShowcase from "@/components/PortfolioShowcase";

const heroLight = "/hero-light.webp";
const heroDark = "/hero-dark.webp";

const journey = [
  { no: "01", year: "2022", title: "Graphic Design", note: "Started building visual systems through layout, branding and social media design." },
  { no: "02", year: "2023", title: "Brand & Social", note: "Developed a sharper eye for campaign consistency, visual hierarchy and brand storytelling." },
  { no: "03", year: "2024", title: "Video Editing", note: "Expanded into editing, pacing, transitions and short-form visual storytelling." },
  { no: "04", year: "NOW", title: "Design + Motion", note: "Blending static design and motion into one focused personal creative practice." },
];

const software = [
  { code: "Ps", name: "Adobe Photoshop", use: "Image editing, compositing, social design" },
  { code: "Ai", name: "Adobe Illustrator", use: "Logo, vector, brand identity" },
  { code: "Pr", name: "Adobe Premiere Pro", use: "Video editing, reels, promotional cuts" },
  { code: "Ae", name: "Adobe After Effects", use: "Motion graphics, type animation, compositing" },
];

const faqs = [
  ["What can I hire you for?", "Logo and brand identity, social media design, posters, company profiles, video editing, reels and motion graphics."],
  ["Can I contact you for a full-time role?", "Yes. Use the hiring form below and include the role, company, timeline and any important details."],
  ["Can you work remotely?", "Yes. I am based in Dhaka, Bangladesh and work with remote projects and collaborations."],
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
  const [openFaq, setOpenFaq] = useState(0);

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
          <a href="/" onClick={(event) => scrollToId(event, "software")}><Tip text="Creative toolkit">Software</Tip></a>
          <a href="/" onClick={(event) => scrollToId(event, "about")}><Tip text="Creative journey">Journey</Tip></a>
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

      <section className="mono-section software-section" id="software">
        <div className="section-kicker"><span>02</span><Tip text="Software I use every day">Creative Toolkit</Tip></div>
        <div className="software-heading">
          <h2><Tip text="Hover every app to see how I use it">The tools are quiet.<br />The ideas do the talking.</Tip></h2>
          <WandSparkles size={30} />
        </div>

        <div className="software-grid">
          {software.map((item, index) => (
            <motion.article
              className="software-card"
              key={item.code}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * .06 }}
            >
              <div className="software-icon">{item.code}</div>
              <div>
                <strong>{item.name}</strong>
                <span>{item.use}</span>
              </div>
              <div className="software-popup">{item.use}</div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mono-section journey-section" id="about">
        <div className="section-kicker"><span>03</span><Tip text="No company list — only the creative path">Creative Journey</Tip></div>
        <div className="journey-head">
          <h2><Tip text="A simple serial timeline">Learning, refining,<br />then combining both worlds.</Tip></h2>
          <p>No company names. No résumé-style block. Just the progression of the craft, shown in order.</p>
        </div>

        <div className="journey-list">
          {journey.map((item) => (
            <motion.article
              key={item.no}
              className="journey-row"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span>{item.no}</span>
              <span className="journey-year">{item.year}</span>
              <h3><Tip text={item.note}>{item.title}</Tip></h3>
              <p>{item.note}</p>
              <Sparkles size={16} />
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mono-section faq-section">
        <div className="faq-intro">
          <div className="section-kicker"><span>04</span><Tip text="Quick project answers">Before we work together</Tip></div>
          <h2>Simple questions.<br /><em>Clear answers.</em></h2>
        </div>
        <div className="faq-list">
          {faqs.map(([q, a], index) => (
            <button key={q} className={openFaq === index ? "open" : ""} onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>
              <div><span><Tip text="Click to expand">{q}</Tip></span><ChevronDown size={18} /></div>
              <p>{a}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="mono-contact" id="contact">
        <div className="contact-copy">
          <div className="section-kicker invert"><span>05</span><Tip text="Freelance · Collaboration · Full-time">Let’s work together</Tip></div>
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
        <div><a href="/" onClick={(event) => scrollToId(event, "design")}>Work</a><a href="/" onClick={(event) => scrollToId(event, "software")}>Software</a><a href="/" onClick={(event) => scrollToId(event, "about")}>Journey</a><a href="/" onClick={(event) => scrollToId(event, "contact")}>Contact</a></div>
        <span>© 2026</span>
      </footer>
    </main>
  );
}
