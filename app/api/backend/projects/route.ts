import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

const folderToProject = {
  Posters: { type: "design", folder: "posters" },
  Reels: { type: "video", folder: "reels" },
  Videos: { type: "video", folder: "videos" },
  "AI Video": { type: "video", folder: "ai-video" },
  Logos: { type: "design", folder: "logos" },
  "Company Profiles": { type: "design", folder: "company-profiles" },
  Animations: { type: "video", folder: "animations" },
} as const;

type Category = keyof typeof folderToProject;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70);
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("projects")
      .select("id,title,type,category,cover_url,video_url,youtube_url,source_url,source_kind,year,published,created_at")
      .order("created_at", { ascending: false })
      .limit(30);

    if (error) throw error;
    return NextResponse.json({ projects: data || [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load projects.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    title?: string;
    category?: Category;
    description?: string;
    fileUrl?: string;
    sourceUrl?: string;
    sourceKind?: "upload" | "youtube" | "drive" | "direct" | "embed";
    year?: number;
    published?: boolean;
  } | null;

  if (!body?.title || !body.category || !(body.category in folderToProject)) {
    return NextResponse.json({ error: "Title and folder are required." }, { status: 400 });
  }

  const mediaUrl = body.fileUrl?.trim() || body.sourceUrl?.trim() || "";
  if (!mediaUrl) {
    return NextResponse.json({ error: "Choose a file or paste a media link." }, { status: 400 });
  }

  const mapping = folderToProject[body.category];
  const baseSlug = slugify(body.title) || "project";
  const slug = baseSlug + "-" + Date.now().toString(36);

  try {
    const supabase = getSupabaseAdmin();
    const sourceKind = body.sourceKind || (body.fileUrl ? "upload" : "direct");
    const isYouTube = sourceKind === "youtube";

    const payload = {
      title: body.title.trim(),
      slug,
      type: mapping.type,
      category: body.category,
      description: body.description?.trim() || "",
      cover_url: mapping.type === "design" && !isYouTube ? mediaUrl : null,
      video_url: mapping.type === "video" && !isYouTube && sourceKind !== "drive" ? mediaUrl : null,
      youtube_url: isYouTube ? mediaUrl : null,
      source_url: mediaUrl,
      source_kind: sourceKind,
      gallery_urls: mapping.type === "design" && !isYouTube ? [mediaUrl] : [],
      year: body.year || new Date().getFullYear(),
      published: body.published !== false,
      sort_order: 0,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("projects")
      .insert(payload)
      .select("id,title,category,type,cover_url,video_url,youtube_url,source_url,source_kind,year,published,created_at")
      .single();

    if (error) throw error;
    return NextResponse.json({ project: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save project.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
