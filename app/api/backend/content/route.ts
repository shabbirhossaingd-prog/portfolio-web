import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin-auth";
import { callBackendEdge } from "@/lib/backend-edge";
import { defaultSiteContent } from "@/lib/site-content";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value || null;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const result = await callBackendEdge<{ content?: unknown }>("get-content", token);
  if (!result.ok) {
    return NextResponse.json(result.data, { status: result.status });
  }

  return NextResponse.json({
    content: result.data.content || defaultSiteContent,
  });
}

export async function PUT(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value || null;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { content?: unknown } | null;
  if (!body?.content) {
    return NextResponse.json({ error: "Content is required." }, { status: 400 });
  }

  const result = await callBackendEdge("save-content", token, {
    content: body.content,
  });

  return NextResponse.json(result.data, { status: result.status });
}
