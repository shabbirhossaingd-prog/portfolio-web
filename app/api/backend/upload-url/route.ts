import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

const folders = new Set([
  "posters",
  "reels",
  "videos",
  "ai-video",
  "logos",
  "company-profiles",
  "animations",
]);

function safeFileName(fileName: string) {
  const cleaned = fileName
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return cleaned || "portfolio-file";
}

async function ensurePortfolioBucket() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage.getBucket("portfolio");

  if (!data || error) {
    const { error: createError } = await supabase.storage.createBucket("portfolio", {
      public: true,
      fileSizeLimit: 524288000,
    });

    if (createError && !createError.message.toLowerCase().includes("already exists")) {
      throw createError;
    }
  } else if (!data.public) {
    const { error: updateError } = await supabase.storage.updateBucket("portfolio", {
      public: true,
      fileSizeLimit: 524288000,
    });

    if (updateError) throw updateError;
  }

  return supabase;
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    folder?: string;
    fileName?: string;
  } | null;

  if (!body?.folder || !folders.has(body.folder) || !body.fileName) {
    return NextResponse.json({ error: "Invalid folder or file name." }, { status: 400 });
  }

  try {
    const supabase = await ensurePortfolioBucket();
    const path =
      body.folder +
      "/" +
      Date.now() +
      "-" +
      crypto.randomUUID().slice(0, 8) +
      "-" +
      safeFileName(body.fileName);

    const { data, error } = await supabase.storage.from("portfolio").createSignedUploadUrl(path);

    if (error || !data?.token) {
      throw error || new Error("Could not create a signed upload URL.");
    }

    const publicUrl = supabase.storage.from("portfolio").getPublicUrl(path).data.publicUrl;

    return NextResponse.json({
      bucket: "portfolio",
      path,
      token: data.token,
      publicUrl,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not prepare upload.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
