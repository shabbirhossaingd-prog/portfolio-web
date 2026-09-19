import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { defaultSiteContent } from "@/lib/site-content";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("site_content")
      .select("value")
      .eq("key", "site")
      .maybeSingle();

    if (error) throw error;
    return NextResponse.json({ content: data?.value || defaultSiteContent });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load site content.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { content?: unknown } | null;
  if (!body?.content) {
    return NextResponse.json({ error: "Content is required." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("site_content").upsert({
      key: "site",
      value: body.content,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save site content.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
