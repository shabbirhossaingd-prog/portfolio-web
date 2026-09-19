import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, adminCookieOptions } from "@/lib/admin-auth";
import { callBackendEdge } from "@/lib/backend-edge";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    email?: string;
    password?: string;
  } | null;

  if (!body?.email || !body?.password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const result = await callBackendEdge<{ token?: string }>("login", null, {
    email: body.email,
    password: body.password,
  });

  if (!result.ok || !result.data.token) {
    return NextResponse.json(
      { error: result.data.error || "Invalid email or password." },
      { status: result.status || 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, result.data.token, adminCookieOptions());
  return response;
}
