"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  Palette,
  Play,
} from "lucide-react";
import ContactForm from "@/components/ContactForm";
import {
  designProjects,
  motionProjects,
  experience,
  education,
  skills,
} from "@/lib/portfolio";

const portrait = "data:image/webp;base64,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";
const whatsapp = "https://wa.me/8801701523130?text=Hi%20Shabbir%2C%20I%20found%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project.";

const process = [
  ["01", "Project Brief", "We define the goal, audience, deliverables, timeline and visual direction."],
  ["02", "Creative Direction", "I build a clear visual route with references, composition and motion language."],
  ["03", "Design / Edit", "The concept becomes polished design, motion graphics or a finished video edit."],
  ["04", "Refine", "Feedback is translated into focused revisions without losing the core idea."],
  ["05", "Deliver", "Final files are prepared cleanly for social, print, brand or video use."],
];

const faqs = [
  ["What can I hire you for?", "Brand identity, logo design, social media campaigns, company profiles, flyers, video editing, reels and motion graphics."],
  ["Do you work remotely?", "Yes. I am based in Dhaka, Bangladesh and can collaborate remotely with teams and clients."],
  ["Are you open to full-time opportunities?", "Yes. The contact form can be used for freelance projects, collaborations and full-time creative roles."],
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <main className="luzia-page">
      <header className="lz-nav">
        <a href="#home" className="lz-name">Shabbir Azhaf</a>
        <nav>
          <a href="#design">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <a href="#contact" className="lz-pill lz-pill-dark">Hire Me <ArrowUpRight size={14} /></a>
      </header>

      <section className="lz-hero" id="home">
        <div className="lz-portrait-wrap">
          <motion.div
            className="lz-portrait"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <img src={portrait} alt="Shabbir Hossain Azhaf" />
            <div className="lz-portrait-fade" />
          </motion.div>
        </div>

        <motion.div
          className="lz-availability"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
        >
          <span className="lz-status-dot" />
          Available for selected projects
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.7 }}
        >
          Shabbir creates bold brand visuals and motion stories that make ideas feel clear, memorable and alive
        </motion.h1>

        <motion.div
          className="lz-hero-copy"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.65 }}
        >
          <p>
            Graphic designer and video editor focused on social media design, brand identity,
            company profiles, flyers, reels and motion-led storytelling.
          </p>
          <a className="lz-pill lz-pill-dark" href="mailto:shabbirhossain.gd@gmail.com">
            Email Me <Mail size={14} />
          </a>
        </motion.div>
      </section>

      <section className="lz-section lz-works" id="design">
        <div className="lz-section-head">
          <h2>Featured design work</h2>
          <a href="#motion">View motion <ArrowUpRight size={15} /></a>
        </div>

        <div className="lz-work-grid">
          {designProjects.map((project, index) => (
            <motion.article
              className={"lz-work-card lz-art-" + (index + 1)}
              key={project.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: index * 0.05 }}
            >
              <div className="lz-work-visual">
                <div className="lz-poster-sheet">
                  <span>{project.category}</span>
                  <strong>{project.title}</strong>
                  <small>Shabbir Azhaf / {project.year}</small>
                </div>
                <div className="lz-art-shape one" />
                <div className="lz-art-shape two" />
              </div>
              <div className="lz-work-meta">
                <div>
                  <h3>{project.title}</h3>
                  <span>{project.category}</span>
                </div>
                <span>{project.year}</span>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="lz-feature-row">
        <div className="lz-small-feature">
          <span className="lz-eyebrow">Current role</span>
          <h3>Designer & Editor at Kreatech</h3>
          <p>Creating print, social and visual storytelling work since 2023.</p>
        </div>
        <div className="lz-dark-quote">
          <span className="lz-eyebrow">Creative approach</span>
          <p>
            “Good design should look clean, feel intentional and communicate before it decorates.”
          </p>
          <div className="lz-quote-person">
            <div className="lz-avatar">SA</div>
            <div><strong>Shabbir Hossain Azhaf</strong><span>Graphic Designer / Video Editor</span></div>
          </div>
        </div>
      </section>

      <section className="lz-stats">
        <div><strong>Since 2022</strong><span>Professional creative work</span></div>
        <div><strong>Design + Motion</strong><span>Two focused disciplines</span></div>
        <div><strong>Dhaka / Remote</strong><span>Available for collaboration</span></div>
        <div className="lz-trusted">
          <div className="lz-stack"><span>Ps</span><span>Ai</span><span>Pr</span><span>Ae</span></div>
          <small>Tools I work with</small>
        </div>
      </section>

      <section className="lz-section lz-motion-section" id="motion">
        <div className="lz-section-head">
          <div>
            <span className="lz-eyebrow">Video portfolio</span>
            <h2>Motion that keeps attention moving</h2>
          </div>
          <p>Reels, promotional edits and motion graphics presented separately from the design portfolio.</p>
        </div>

        <div className="lz-motion-grid">
          {motionProjects.map((project, index) => (
            <motion.article
              className={"lz-motion-card lz-video-" + (index + 1)}
              key={project.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: index * 0.07 }}
            >
              <div className="lz-motion-visual">
                <div className="lz-video-lines" />
                <button aria-label={"Preview " + project.title}><Play size={18} fill="currentColor" /></button>
                <div className="lz-time">00:{String(8 + index * 5).padStart(2, "0")}</div>
              </div>
              <div className="lz-work-meta">
                <div><h3>{project.title}</h3><span>{project.category}</span></div>
                <span>{project.year}</span>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="lz-services lz-section">
        <span className="lz-eyebrow">Services</span>
        <h2>Creative solutions built around brand clarity and visual storytelling.</h2>
        <div className="lz-service-grid">
          <article>
            <div className="lz-service-top"><span>01</span><a href="#contact">Start a project <ArrowUpRight size={14} /></a></div>
            <h3>Brand & Graphic Design</h3>
            <p>Logo systems, brand identity, social campaigns, posters, flyers and company profiles.</p>
            <div className="lz-tags"><span>Logo design</span><span>Brand identity</span><span>Campaign design</span></div>
          </article>
          <article>
            <div className="lz-service-top"><span>02</span><a href="#contact">Start a project <ArrowUpRight size={14} /></a></div>
            <h3>Video Editing</h3>
            <p>Short-form edits and promotional videos shaped around pacing, hooks and clear storytelling.</p>
            <div className="lz-tags"><span>Reels</span><span>Promotional</span><span>Social video</span></div>
          </article>
          <article>
            <div className="lz-service-top"><span>03</span><a href="#contact">Start a project <ArrowUpRight size={14} /></a></div>
            <h3>Motion Graphics</h3>
            <p>Type, shape and product-led motion that gives static brand ideas more energy and presence.</p>
            <div className="lz-tags"><span>Motion design</span><span>Typography</span><span>Product motion</span></div>
          </article>
        </div>
      </section>

      <section className="lz-how lz-section" id="about">
        <div className="lz-how-visual">
          <div className="lz-how-frame">
            <img src={portrait} alt="" aria-hidden="true" />
            <div className="lz-how-overlay">
              <span>SHABBIR</span>
              <strong>DESIGN<br />+ MOTION</strong>
            </div>
          </div>
        </div>
        <div className="lz-how-copy">
          <span className="lz-eyebrow">How it works</span>
          <h2>A simple creative process from first brief to final delivery.</h2>
          <div className="lz-process">
            {process.map(([n, title, desc]) => (
              <div className="lz-process-item" key={n}>
                <span>{n}</span>
                <div><strong>{title}</strong><p>{desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lz-resume lz-section">
        <div>
          <span className="lz-eyebrow">Experience</span>
          {experience.map((item) => (
            <div className="lz-resume-row" key={item.role + item.place}>
              <div><strong>{item.role}</strong><span>{item.place}</span></div>
              <span>{item.period}</span>
            </div>
          ))}
        </div>
        <div>
          <span className="lz-eyebrow">Education</span>
          {education.map((item) => (
            <div className="lz-resume-row" key={item.title + item.place}>
              <div><strong>{item.title}</strong><span>{item.place}</span></div>
              <span>{item.period}</span>
            </div>
          ))}
          <div className="lz-skill-pills">{skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
        </div>
      </section>

      <section className="lz-faq lz-section">
        <div className="lz-faq-copy">
          <span className="lz-eyebrow">Quick answers</span>
          <h2>Everything you need before starting a project.</h2>
          <a className="lz-pill lz-pill-dark" href="mailto:shabbirhossain.gd@gmail.com">Email Me <Mail size={14} /></a>
        </div>
        <div className="lz-faq-list">
          {faqs.map(([q, a], index) => (
            <button key={q} onClick={() => setOpenFaq(openFaq === index ? -1 : index)} className={openFaq === index ? "open" : ""}>
              <div><span>{q}</span><ChevronDown size={18} /></div>
              <p>{a}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="lz-contact" id="contact">
        <div className="lz-contact-lead">
          <span className="lz-eyebrow">Let’s work together</span>
          <h2>Have a project, collaboration or creative role in mind?</h2>
          <p>Send a message and tell me what you are building, launching or hiring for.</p>
          <div className="lz-socials">
            <a href="https://www.linkedin.com/in/designerazhaf/" target="_blank" rel="noreferrer"><Linkedin size={17} /> LinkedIn</a>
            <a href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp</a>
            <a href="https://www.instagram.com/grapeobd/" target="_blank" rel="noreferrer"><Instagram size={17} /> Instagram</a>
            <a href="https://www.behance.net/azhafahmed" target="_blank" rel="noreferrer"><Palette size={17} /> Behance</a>
          </div>
        </div>
        <ContactForm />
      </section>

      <footer className="lz-footer">
        <div>
          <strong>Shabbir Hossain Azhaf</strong>
          <span>Graphic Designer / Video Editor</span>
        </div>
        <div>
          <a href="#design">Works</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
        <span>© 2026 Shabbir Azhaf</span>
      </footer>
    </main>
  );
}
