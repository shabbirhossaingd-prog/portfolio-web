import { cookies } from "next/headers";
import HomeClient from "@/components/HomeClient";
import { defaultSiteContent, type SiteContent } from "@/lib/site-content";

const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bgrpvjuvghdjbxmljtgm.supabase.co";
const publicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_WheOVPSgKqPTXiHuD1uhXA_S4Vubljo";

function mergeSiteContent(value?: Partial<SiteContent> | null): SiteContent {
  if (!value) return defaultSiteContent;

  return {
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
  };
}

async function getInitialSiteContent(): Promise<SiteContent> {
  if (!publicUrl || !publicAnonKey) return defaultSiteContent;

  try {
    const response = await fetch(
      publicUrl + "/rest/v1/site_content?key=eq.site&select=value",
      {
        headers: {
          apikey: publicAnonKey,
          Authorization: "Bearer " + publicAnonKey,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) return defaultSiteContent;
    const rows = (await response.json()) as Array<{ value?: Partial<SiteContent> }>;
    return mergeSiteContent(rows[0]?.value || null);
  } catch {
    return defaultSiteContent;
  }
}

export default async function Home() {
  const initialSiteContent = await getInitialSiteContent();
  const cookieStore = await cookies();
  const savedTheme = cookieStore.get("portfolio-theme")?.value;
  const initialTheme = savedTheme === "dark" ? "dark" : "light";

  return <HomeClient initialSiteContent={initialSiteContent} initialTheme={initialTheme} />;
}
