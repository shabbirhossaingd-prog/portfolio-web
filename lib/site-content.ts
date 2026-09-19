export type SiteTool = {
  code: string;
  name: string;
  use: string;
  icon: "image" | "pen" | "video" | "sparkles";
};

export type SiteExperience = {
  company: string;
  role: string;
  period: string;
  current: boolean;
  note: string;
};

export type SiteEducation = {
  title: string;
  place: string;
  meta: string;
};

export type SiteContent = {
  hero: {
    status: string;
    location: string;
    title1: string;
    title2: string;
    intro: string;
    lightImage?: string;
    darkImage?: string;
    lightScale?: number;
    lightX?: number;
    lightY?: number;
    darkScale?: number;
    darkX?: number;
    darkY?: number;
  };
  portfolio: {
    kicker: string;
    title: string;
    description: string;
  };
  profile: {
    kicker: string;
    title: string;
    description: string;
    toolsKicker: string;
    toolsTitle: string;
    experienceKicker: string;
    experienceTitle: string;
    educationKicker: string;
    educationTitle: string;
  };
  tools: SiteTool[];
  coreSkills: string[];
  aiSkills: string[];
  experience: SiteExperience[];
  education: SiteEducation[];
  contact: {
    kicker: string;
    title: string;
    description: string;
  };
};

export const defaultSiteContent: SiteContent = {
  hero: {
    status: "Available for selected projects",
    location: "Dhaka, Bangladesh · Remote",
    title1: "Visuals with clarity.",
    title2: "Motion with character.",
    intro:
      "I’m Shabbir Hossain Azhaf — a graphic designer and video editor creating clean brand visuals, social design and motion-led stories.",
    lightImage: "/hero-light.webp",
    darkImage: "/hero-dark.webp",
    lightScale: 1.3,
    lightX: 0,
    lightY: 0,
    darkScale: 1.3,
    darkX: 0,
    darkY: 0,
  },
  portfolio: {
    kicker: "Selected Work",
    title: "Browse everything.\nFilter what you need.",
    description:
      "A Pinterest-inspired portfolio wall. Filter by category and open any project in full view.",
  },
  profile: {
    kicker: "Professional Profile",
    title: "More than a gallery.\nA working creative profile.",
    description:
      "Graphic designer and video editor focused on social content, brand identity, company profiles, print materials, reels and motion-led visual storytelling.",
    toolsKicker: "Creative toolkit",
    toolsTitle: "Tools I work with",
    experienceKicker: "Professional timeline",
    experienceTitle: "Work experience",
    educationKicker: "Education & training",
    educationTitle: "Built through practice",
  },
  tools: [
    { code: "Ps", name: "Adobe Photoshop", use: "Social design, image editing, compositing", icon: "image" },
    { code: "Ai", name: "Adobe Illustrator", use: "Brand identity, vector design, logo work", icon: "pen" },
    { code: "Pr", name: "Adobe Premiere Pro", use: "Video editing, reels, promotional cuts", icon: "video" },
    { code: "Ae", name: "Adobe After Effects", use: "Motion graphics, type animation, compositing", icon: "sparkles" },
    { code: "Cc", name: "CapCut", use: "Fast social edits, reels and short-form video", icon: "video" },
  ],
  coreSkills: [
    "Graphic Design",
    "Video Editing",
    "Wireframing",
    "Concepting",
    "Teamwork",
    "Communication",
    "Vibe Coding",
  ],
  aiSkills: ["GPT", "Gemini", "Google Flow", "Freepik", "Envato", "Cloud", "Antigravity", "Vibe Coding"],
  experience: [
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
  ],
  education: [
    { title: "Graphic Design", place: "Creative IT Institute", meta: "2022 — 2023 · 8-month training" },
    { title: "Video Editing", place: "Creative IT Institute", meta: "2024 · 4-month course" },
    { title: "College", place: "Tejgaon College", meta: "Academic background" },
    { title: "BBA · Marketing", place: "Sonargaon University", meta: "2023 — Present" },
  ],
  contact: {
    kicker: "Let’s work together",
    title: "Hiring?\nLaunching something?\nSend it my way.",
    description:
      "Use the form for a project, collaboration, freelance request or full-time creative opportunity.",
  },
};
