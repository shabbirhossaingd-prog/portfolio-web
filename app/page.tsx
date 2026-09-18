"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  Film,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  Moon,
  Palette,
  Play,
  Sparkles,
  Sun,
  WandSparkles,
} from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { designProjects, motionProjects } from "@/lib/portfolio";

const heroLight = "data:image/webp;base64,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";
const heroDark = "data:image/webp;base64,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";

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

function Tip({ children, text, className = "" }: { children: React.ReactNode; text: string; className?: string }) {
  return <span className={"hover-tip " + className} data-tip={text}>{children}</span>;
}

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const saved = window.localStorage.getItem("portfolio-theme");
    if (saved === "dark" || saved === "light") setTheme(saved);
  }, []);

  const changeTheme = (value: "light" | "dark") => {
    setTheme(value);
    window.localStorage.setItem("portfolio-theme", value);
  };

  return (
    <main className={"mono-page theme-" + theme}>
      <header className="mono-nav">
        <a href="#home" className="mono-name"><Tip text="Graphic Designer · Video Editor">Shabbir Azhaf</Tip></a>
        <nav>
          <a href="#design"><Tip text="Selected graphic design">Design</Tip></a>
          <a href="#motion"><Tip text="Video editing & motion">Motion</Tip></a>
          <a href="#software"><Tip text="Creative toolkit">Software</Tip></a>
          <a href="#contact"><Tip text="Hiring & project inquiry">Contact</Tip></a>
        </nav>
        <div className="nav-actions">
          <div className="theme-switch" aria-label="Theme selector">
            <button className={theme === "light" ? "active" : ""} onClick={() => changeTheme("light")} aria-label="Light mode">
              <Sun size={14} />
            </button>
            <button className={theme === "dark" ? "active" : ""} onClick={() => changeTheme("dark")} aria-label="Dark mode">
              <Moon size={14} />
            </button>
          </div>
          <a href="#contact" className="mono-pill">Hire Me <ArrowUpRight size={14} /></a>
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
            <button className={theme === "light" ? "active" : ""} onClick={() => changeTheme("light")}>White</button>
            <span>/</span>
            <button className={theme === "dark" ? "active" : ""} onClick={() => changeTheme("dark")}>Black</button>
          </div>
        </div>

        <div className="hero-bottom">
          <p>
            <Tip text="Personal portfolio statement">
              I’m Shabbir Hossain Azhaf — a graphic designer and video editor creating clean brand visuals, social design and motion-led stories.
            </Tip>
          </p>
          <div className="hero-links">
            <a href="#design">Explore work <ArrowUpRight size={15} /></a>
            <a href="mailto:shabbirhossain.gd@gmail.com">Email me <Mail size={15} /></a>
          </div>
        </div>
      </section>

      <section className="mono-section" id="design">
        <div className="section-kicker"><span>01</span><Tip text="Graphic design portfolio">Selected Design</Tip></div>
        <div className="section-title-row">
          <h2><Tip text="Logos, social media, profiles and print">Built to feel simple.<br />Designed to stay memorable.</Tip></h2>
          <p>Separate design portfolio for brand identity, social media posters, company profiles and campaign visuals.</p>
        </div>

        <div className="mono-work-grid">
          {designProjects.map((project, index) => (
            <motion.article
              className="mono-work-card"
              key={project.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: .5, delay: index * .06 }}
            >
              <div className={"mono-work-art art-" + (index + 1)}>
                <span className="work-index">0{index + 1}</span>
                <div className="poster-window">
                  <span>{project.category}</span>
                  <strong>{project.title}</strong>
                  <small>Shabbir Azhaf · {project.year}</small>
                </div>
                <div className="abstract-mark mark-a" />
                <div className="abstract-mark mark-b" />
              </div>
              <div className="mono-work-meta">
                <div>
                  <h3><Tip text={project.description}>{project.title}</Tip></h3>
                  <span>{project.category}</span>
                </div>
                <ArrowUpRight size={18} />
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mono-section motion-wrap" id="motion">
        <div className="section-kicker"><span>02</span><Tip text="Video editing & motion graphics">Motion / Video</Tip></div>
        <div className="section-title-row">
          <h2><Tip text="Dedicated motion portfolio">Frames with rhythm.<br />Edits with purpose.</Tip></h2>
          <p>Video stays separate from static design. YouTube links can later play inside the site through the admin portfolio system.</p>
        </div>

        <div className="mono-motion-grid">
          {motionProjects.map((project, index) => (
            <motion.article
              className="mono-motion-card"
              key={project.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: .5, delay: index * .07 }}
            >
              <div className={"mono-video-art video-" + (index + 1)}>
                <div className="video-orbit" />
                <button aria-label={"Preview " + project.title}><Play size={18} fill="currentColor" /></button>
                <span className="video-label">{project.category}</span>
              </div>
              <div className="mono-work-meta">
                <div>
                  <h3><Tip text={project.description}>{project.title}</Tip></h3>
                  <span>{project.year}</span>
                </div>
                <Film size={18} />
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mono-section software-section" id="software">
        <div className="section-kicker"><span>03</span><Tip text="Software I use every day">Creative Toolkit</Tip></div>
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
        <div className="section-kicker"><span>04</span><Tip text="No company list — only the creative path">Creative Journey</Tip></div>
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
          <div className="section-kicker"><span>05</span><Tip text="Quick project answers">Before we work together</Tip></div>
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
          <div className="section-kicker invert"><span>06</span><Tip text="Freelance · Collaboration · Full-time">Let’s work together</Tip></div>
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
        <div><a href="#design">Design</a><a href="#motion">Motion</a><a href="#software">Software</a><a href="#contact">Contact</a></div>
        <span>© 2026</span>
      </footer>
    </main>
  );
}
