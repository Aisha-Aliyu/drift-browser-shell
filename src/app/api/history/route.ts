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

  const { searchParams } = new URL(request.url);
  const limitParam = parseInt(searchParams.get("limit") ?? "100", 10);
  const take = isNaN(limitParam) ? 100 : Math.min(limitParam, 500);

  const entries = await prisma.historyEntry.findMany({
    where: { userId },
    orderBy: { visitedAt: "desc" },
    take,
  });

  return NextResponse.json({ entries });
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

  const entry = await prisma.historyEntry.create({
    data: { userId, url: safeUrl, title: safeTitle, favicon: safeFavicon },
  });

  const overflow = await prisma.historyEntry.findMany({
    where: { userId },
    orderBy: { visitedAt: "desc" },
    skip: 500,
    select: { id: true },
  });

  if (overflow.length > 0) {
    await prisma.historyEntry.deleteMany({
where: { id: { in: overflow.map((e: { id: string }) => e.id) } },

    });
  }

  return NextResponse.json({ entry }, { status: 201 });
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

  await prisma.historyEntry.deleteMany({ where: { userId } });

  return NextResponse.json({ success: true });
}
