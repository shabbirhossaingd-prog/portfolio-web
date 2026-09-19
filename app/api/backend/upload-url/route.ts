import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin-auth";
import { callBackendEdge } from "@/lib/backend-edge";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value || null;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    folder?: string;
    fileName?: string;
  } | null;

  if (!body?.folder || !body?.fileName) {
    return NextResponse.json({ error: "Invalid folder or file name." }, { status: 400 });
  }

  const result = await callBackendEdge("prepare-upload", token, {
    folder: body.folder,
    fileName: body.fileName,
  });

  return NextResponse.json(result.data, { status: result.status });
}
