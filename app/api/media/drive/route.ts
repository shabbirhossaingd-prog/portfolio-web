import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeHeader(response: Response, name: string) {
  const value = response.headers.get(name);
  return value || undefined;
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id")?.trim();
  const resourceKey = request.nextUrl.searchParams.get("resourcekey")?.trim();

  if (!id || !/^[A-Za-z0-9_-]+$/.test(id)) {
    return NextResponse.json({ error: "Invalid Drive file id." }, { status: 400 });
  }

  const params = new URLSearchParams({
    id,
    export: "download",
    confirm: "t",
  });

  if (resourceKey) params.set("resourcekey", resourceKey);

  const upstreamUrl = "https://drive.usercontent.google.com/download?" + params.toString();
  const range = request.headers.get("range");

  try {
    const upstream = await fetch(upstreamUrl, {
      headers: range ? { Range: range } : undefined,
      cache: "no-store",
      redirect: "follow",
    });

    if (!upstream.ok && upstream.status !== 206) {
      return NextResponse.json(
        { error: "Drive video could not be loaded." },
        { status: upstream.status || 502 },
      );
    }

    const headers = new Headers();
    headers.set("Cache-Control", "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400");
    headers.set("Content-Disposition", "inline");

    const contentType = safeHeader(upstream, "content-type");
    const contentLength = safeHeader(upstream, "content-length");
    const contentRange = safeHeader(upstream, "content-range");
    const acceptRanges = safeHeader(upstream, "accept-ranges");

    if (contentType) headers.set("Content-Type", contentType);
    if (contentLength) headers.set("Content-Length", contentLength);
    if (contentRange) headers.set("Content-Range", contentRange);
    headers.set("Accept-Ranges", acceptRanges || "bytes");

    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers,
    });
  } catch {
    return NextResponse.json({ error: "Drive video proxy failed." }, { status: 502 });
  }
}
