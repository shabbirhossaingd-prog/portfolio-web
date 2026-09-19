import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  createAdminToken,
  hasAdminConfig,
  validateAdminLogin,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!hasAdminConfig()) {
    return NextResponse.json(
      { error: "Admin password is not configured on the server." },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as { email?: string; password?: string } | null;

  if (!body?.email || !body?.password || !validateAdminLogin(body.email, body.password)) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, createAdminToken(), adminCookieOptions());
  return response;
}
