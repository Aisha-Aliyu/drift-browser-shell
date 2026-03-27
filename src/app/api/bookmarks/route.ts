import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { rateLimiter, getIp } from "@/lib/ratelimit";
import { sanitizeUrl } from "@/lib/url";

export async function GET(request: NextRequest) {
  const ip = getIp(request);
  const rl = await rateLimiter.limit(ip);
  if (!rl.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const session = await auth();
  const userId = session?.userId;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  return NextResponse.json({ bookmarks });
}

export async function POST(request: NextRequest) {
  const ip = getIp(request);
  const rl = await rateLimiter.limit(ip);
  if (!rl.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const session = await auth();
  const userId = session?.userId;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const url = typeof body.url === "string" ? body.url : null;
  const title = typeof body.title === "string" ? body.title : "";
  const favicon = typeof body.favicon === "string" ? body.favicon : null;

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  const safeUrl = sanitizeUrl(url.trim().slice(0, 2048));
  if (safeUrl === "about:blank") {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const safeTitle = title.trim().slice(0, 500) || safeUrl;
  const safeFavicon = favicon
    ? sanitizeUrl(favicon.trim().slice(0, 2048)) || null
    : null;

  const bookmark = await prisma.bookmark.upsert({
    where: { userId_url: { userId, url: safeUrl } },
    create: { userId, url: safeUrl, title: safeTitle, favicon: safeFavicon },
    update: { title: safeTitle, favicon: safeFavicon },
  });

  return NextResponse.json({ bookmark }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const ip = getIp(request);
  const rl = await rateLimiter.limit(ip);
  if (!rl.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const session = await auth();
  const userId = session?.userId;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Bookmark ID is required" }, { status: 400 });
  }

  await prisma.bookmark.deleteMany({
    where: { id, userId },
  });

  return NextResponse.json({ success: true });
}
