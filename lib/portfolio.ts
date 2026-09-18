export type ProjectType = "design" | "motion";

export type Project = {
  title: string;
  category: string;
  year: string;
  type: ProjectType;
  description: string;
};

export const designProjects: Project[] = [
  {
    title: "Campaign Systems",
    category: "Social Media Design",
    year: "2026",
    type: "design",
    description: "Bold, conversion-aware campaign visuals built as flexible content systems."
  },
  {
    title: "Identity Objects",
    category: "Logo & Brand Identity",
    year: "2026",
    type: "design",
    description: "Logo thinking translated into usable brand language across real touchpoints."
  },
  {
    title: "Editorial Presence",
    category: "Company Profile",
    year: "2025",
    type: "design",
    description: "Structured corporate storytelling with strong hierarchy, pacing and visual rhythm."
  },
  {
    title: "Launch Materials",
    category: "Print & Flyer",
    year: "2025",
    type: "design",
    description: "Print-ready promotional design balancing clarity, energy and brand consistency."
  }
];

export const motionProjects: Project[] = [
  {
    title: "Product Motion",
    category: "Motion Graphics",
    year: "2026",
    type: "motion",
    description: "Short-form motion systems for product reveals, feature stories and digital campaigns."
  },
  {
    title: "Social Cuts",
    category: "Reels & Social Video",
    year: "2026",
    type: "motion",
    description: "Fast-paced edits designed for hooks, retention and platform-native storytelling."
  },
  {
    title: "Brand Films",
    category: "Promotional Video",
    year: "2025",
    type: "motion",
    description: "Narrative-led promotional edits using pacing, typography and sound-driven structure."
  }
];

export const experience = [
  {
    role: "Designer & Editor",
    place: "Kreatech",
    period: "2023 — Present",
    note: "Graphic design, print material, social media design and creative visual storytelling."
  },
  {
    role: "Graphic Designer",
    place: "Creative IT Institute",
    period: "2023",
    note: "Internship focused on social media design and branding."
  },
  {
    role: "Graphic Designer",
    place: "Fiverr · Remote",
    period: "2022 — 2023",
    note: "Freelance graphic design services with a focus on social media graphics."
  }
];

export const education = [
  {
    title: "Video Editing",
    place: "Creative IT Institute",
    period: "2024",
  },
  {
    title: "BBA · Marketing",
    place: "Tejgaon College",
    period: "2023 — Present",
  },
  {
    title: "Graphic Design",
    place: "Creative IT Institute",
    period: "2022 — 2023",
  }
];

export const skills = ["Photoshop", "Illustrator", "Premiere Pro", "After Effects"];

export const profile =
  "Creative and detail-oriented graphic designer and video editor focused on social content, brand identity, company profiles, flyers and motion-led storytelling.";
