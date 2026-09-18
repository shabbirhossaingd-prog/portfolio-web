"use client";

import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  Palette,
  Instagram,
  Linkedin,
  MessageCircle,
  MoveRight,
  Play,
  Sparkles,
} from "lucide-react";
import ContactForm from "@/components/ContactForm";
import {
  designProjects,
  education,
  experience,
  motionProjects,
  profile,
  skills,
} from "@/lib/portfolio";

const whatsapp = "https://wa.me/8801701523130?text=Hi%20Shabbir%2C%20I%20found%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project.";

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a href="#top" className="monogram" aria-label="Home">
          SA
        </a>
        <nav>
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <a href="#contact" className="header-cta">
          Available for work <span />
        </a>
      </header>

      <section className="hero" id="top">
        <motion.div
          className="hero-kicker"
          initial="hidden"
          animate="visible"
          variants={reveal}
          transition={{ duration: 0.55 }}
        >
          <span>Dhaka, Bangladesh</span>
          <span className="dot" />
          <span>Graphic Designer / Video Editor</span>
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="visible"
          variants={reveal}
          transition={{ duration: 0.7, delay: 0.08 }}
        >
          Visuals with
          <span className="outline-word"> impact.</span>
          <br />
          Motion with
          <span className="accent-word"> intent.</span>
        </motion.h1>

        <div className="hero-bottom">
          <motion.p
            initial="hidden"
            animate="visible"
            variants={reveal}
            transition={{ duration: 0.6, delay: 0.18 }}
          >
            I’m <strong>Shabbir Hossain Azhaf</strong>. I create bold graphic design
            and motion-led visual stories for brands that want to be remembered.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial="hidden"
            animate="visible"
            variants={reveal}
            transition={{ duration: 0.6, delay: 0.26 }}
          >
            <a href="#work" className="button button-dark">
              View my work <ArrowDown size={17} />
            </a>
            <a href="#contact" className="button button-light">
              Hire me <ArrowUpRight size={17} />
            </a>
          </motion.div>
        </div>

        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            <span>BRAND IDENTITY</span><i>✦</i>
            <span>SOCIAL MEDIA</span><i>✦</i>
            <span>COMPANY PROFILE</span><i>✦</i>
            <span>VIDEO EDITING</span><i>✦</i>
            <span>MOTION GRAPHICS</span><i>✦</i>
            <span>BRAND IDENTITY</span><i>✦</i>
            <span>SOCIAL MEDIA</span><i>✦</i>
            <span>COMPANY PROFILE</span><i>✦</i>
            <span>VIDEO EDITING</span><i>✦</i>
          </div>
        </div>
      </section>

      <section className="gateway-section" id="work">
        <div className="section-label">
          <span>01</span>
          <span>Choose a direction</span>
        </div>

        <div className="gateway-grid">
          <a href="#design" className="gateway gateway-design">
            <div className="gateway-top">
              <span>Graphic Design</span>
              <ArrowUpRight />
            </div>
            <div className="gateway-word">DESIGN</div>
            <div className="mini-stack design-stack" aria-hidden="true">
              <div>POSTER</div>
              <div>BRAND</div>
              <div>PROFILE</div>
            </div>
          </a>

          <a href="#motion" className="gateway gateway-motion">
            <div className="gateway-top">
              <span>Video & Motion</span>
              <ArrowUpRight />
            </div>
            <div className="gateway-word">MOTION</div>
            <div className="motion-frame" aria-hidden="true">
              <div className="play-disc"><Play fill="currentColor" size={18} /></div>
              <div className="timeline"><span /></div>
              <div className="motion-caption">00:08 / 00:24</div>
            </div>
          </a>
        </div>
      </section>

      <section className="portfolio-section light-section" id="design">
        <div className="section-head">
          <div>
            <div className="section-label">
              <span>02</span>
              <span>Selected design</span>
            </div>
            <h2>Static work,<br />built to move people.</h2>
          </div>
          <p>
            Social media systems, brand identity, company profiles and print work
            presented as focused case-study objects.
          </p>
        </div>

        <div className="project-grid design-projects">
          {designProjects.map((project, index) => (
            <motion.article
              className={"project-card project-card-" + ((index % 4) + 1)}
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: index * 0.06 }}
            >
              <div className="project-art">
                <span>{project.category}</span>
                <strong>{project.title.split(" ")[0]}</strong>
                <div className="shape shape-a" />
                <div className="shape shape-b" />
              </div>
              <div className="project-meta">
                <div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
                <span>{project.year}</span>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="portfolio-section motion-section" id="motion">
        <div className="section-head">
          <div>
            <div className="section-label inverse">
              <span>03</span>
              <span>Selected motion</span>
            </div>
            <h2>Edits with rhythm.<br />Motion with purpose.</h2>
          </div>
          <p>
            A dedicated video area for reels, motion graphics and promotional edits.
            YouTube links can later be added from the admin and played inside the site.
          </p>
        </div>

        <div className="video-grid">
          {motionProjects.map((project, index) => (
            <motion.article
              className="video-card"
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
            >
              <div className={"video-poster poster-" + (index + 1)}>
                <div className="video-no">0{index + 1}</div>
                <div className="video-title">{project.title}</div>
                <button aria-label={"Play " + project.title}>
                  <Play fill="currentColor" size={20} />
                </button>
                <div className="frame-lines" />
              </div>
              <div className="video-meta">
                <div>
                  <h3>{project.title}</h3>
                  <span>{project.category}</span>
                </div>
                <p>{project.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="section-label">
          <span>04</span>
          <span>About</span>
        </div>

        <div className="about-intro">
          <h2>
            Design thinking,
            <br />
            editing instinct,
            <br />
            <span>one visual language.</span>
          </h2>
          <div>
            <p>{profile}</p>
            <div className="skill-row">
              {skills.map((skill) => <span key={skill}>{skill}</span>)}
            </div>
          </div>
        </div>

        <div className="resume-grid">
          <div className="resume-column">
            <div className="resume-title">Experience</div>
            {experience.map((item) => (
              <div className="resume-item" key={item.role + item.place}>
                <div>
                  <strong>{item.role}</strong>
                  <span>{item.place}</span>
                </div>
                <div>
                  <span>{item.period}</span>
                  <p>{item.note}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="resume-column">
            <div className="resume-title">Education</div>
            {education.map((item) => (
              <div className="education-item" key={item.title + item.place}>
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.place}</span>
                </div>
                <span>{item.period}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-copy">
          <div className="section-label inverse">
            <span>05</span>
            <span>Start a conversation</span>
          </div>

          <h2>
            Have a role,
            <br />
            project or idea?
            <br />
            <span>Let’s make it visual.</span>
          </h2>

          <p>
            Available for freelance projects, collaborations and full-time creative
            opportunities.
          </p>

          <div className="social-list">
            <a href="https://www.linkedin.com/in/designerazhaf/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <Linkedin size={19} /> LinkedIn <ArrowUpRight size={15} />
            </a>
            <a href={whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <MessageCircle size={19} /> WhatsApp <ArrowUpRight size={15} />
            </a>
            <a href="https://www.instagram.com/grapeobd/" target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram size={19} /> Instagram <ArrowUpRight size={15} />
            </a>
            <a href="https://www.behance.net/azhafahmed" target="_blank" rel="noreferrer" aria-label="Behance">
              <Palette size={19} /> Behance <ArrowUpRight size={15} />
            </a>
          </div>
        </div>

        <ContactForm />
      </section>

      <footer>
        <div>
          <strong>SHABBIR HOSSAIN AZHAF</strong>
          <span>Graphic Designer / Video Editor</span>
        </div>
        <div className="footer-center">
          <Sparkles size={15} />
          <span>Portfolio 2026</span>
        </div>
        <a href="#top">
          Back to top <MoveRight size={16} />
        </a>
      </footer>
    </main>
  );
}
