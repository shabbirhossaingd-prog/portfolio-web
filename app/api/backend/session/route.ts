import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin-auth";
import { callBackendEdge } from "@/lib/backend-edge";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value || null;

  if (!token) {
    return NextResponse.json({ authenticated: false, configured: true });
  }

  const result = await callBackendEdge<{ authenticated?: boolean; configured?: boolean }>(
    "session",
    token,
  );

  return NextResponse.json({
    authenticated: Boolean(result.ok && result.data.authenticated),
    configured: true,
  });
}
