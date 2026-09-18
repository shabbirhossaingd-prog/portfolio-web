"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight, Send } from "lucide-react";

const EMAIL = "shabbirhossain.gd@gmail.com";

export default function ContactForm() {
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const company = String(data.get("company") || "");
    const project = String(data.get("project") || "");
    const budget = String(data.get("budget") || "");
    const message = String(data.get("message") || "");

    const subject = encodeURIComponent(`Portfolio inquiry — ${project || "New project"}`);
    const body = encodeURIComponent(
      `Hi Shabbir,\n\nMy name is ${name}.\nEmail: ${email}\nCompany/Brand: ${company}\nProject: ${project}\nBudget: ${budget}\n\n${message}\n`
    );

    setStatus("Opening your email app…");
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          <span>Name</span>
          <input name="name" required placeholder="Your name" />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" required placeholder="you@company.com" />
        </label>
        <label>
          <span>Company / Brand</span>
          <input name="company" placeholder="Optional" />
        </label>
        <label>
          <span>Project Type</span>
          <select name="project" defaultValue="Graphic Design">
            <option>Graphic Design</option>
            <option>Branding</option>
            <option>Social Media Design</option>
            <option>Company Profile</option>
            <option>Video Editing</option>
            <option>Motion Graphics</option>
            <option>Full-time Opportunity</option>
            <option>Other</option>
          </select>
        </label>
        <label>
          <span>Budget Range</span>
          <select name="budget" defaultValue="Let’s discuss">
            <option>Let’s discuss</option>
            <option>Under $300</option>
            <option>$300 — $800</option>
            <option>$800 — $1,500</option>
            <option>$1,500+</option>
          </select>
        </label>
      </div>

      <label className="message-field">
        <span>Message</span>
        <textarea
          name="message"
          required
          rows={6}
          placeholder="Tell me about the project, role, timeline or collaboration."
        />
      </label>

      <button className="submit-button" type="submit">
        Send inquiry <Send size={17} />
      </button>

      <div className="form-footer">
        <span>{status || "Prefer direct email?"}</span>
        <a href={`mailto:${EMAIL}`}>
          {EMAIL} <ArrowUpRight size={14} />
        </a>
      </div>
    </form>
  );
}
