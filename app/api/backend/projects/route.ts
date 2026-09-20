import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin-auth";
import { callBackendEdge } from "@/lib/backend-edge";

export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value || null;
  if (!token) return unauthorized();

  const result = await callBackendEdge<{ projects?: unknown[] }>("list-projects", token);
  return NextResponse.json(result.data, { status: result.status });
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value || null;
  if (!token) return unauthorized();

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const result = await callBackendEdge("create-project", token, body);
  return NextResponse.json(result.data, { status: result.status });
}


export async function DELETE(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value || null;
  if (!token) return unauthorized();

  const body = (await request.json().catch(() => null)) as { id?: string } | null;
  if (!body?.id) {
    return NextResponse.json({ error: "Project id is required." }, { status: 400 });
  }

  const result = await callBackendEdge("delete-project", token, { id: body.id });
  return NextResponse.json(result.data, { status: result.status });
}
