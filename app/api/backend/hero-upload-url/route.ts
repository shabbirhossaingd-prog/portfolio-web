import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin-auth";
import { callNamedEdge } from "@/lib/backend-edge";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value || null;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    mode?: "light" | "dark";
    fileName?: string;
  } | null;

  if (!body?.mode || !body?.fileName) {
    return NextResponse.json({ error: "Invalid hero image request." }, { status: 400 });
  }

  const result = await callNamedEdge("portfolio-hero-upload", token, {
    mode: body.mode,
    fileName: body.fileName,
  });

  return NextResponse.json(result.data, { status: result.status });
}
