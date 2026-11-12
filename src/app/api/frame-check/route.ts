import { NextRequest, NextResponse } from "next/server";
import { checkEmbeddable, toPublicUrl } from "@/lib/framePolicy";
import { frameCheckLimiter, getIp } from "@/lib/ratelimit";

// Tells the client whether a site can be shown inside DRIFT's frame, so it can offer
// "Open in new tab" instead of a blank page. The answer is only ever a yes or no.
const TIMEOUT_MS = 5000;

export async function GET(request: NextRequest) {
  try {
    const { success } = await frameCheckLimiter.limit(getIp(request));
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
  } catch {
    return NextResponse.json({ error: "Check unavailable" }, { status: 503 });
  }

  const raw = request.nextUrl.searchParams.get("url");
  if (!raw || raw.length > 2048) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const target = await toPublicUrl(raw);
  if (!target) {
    return NextResponse.json({ error: "URL not allowed" }, { status: 400 });
  }

  try {
    const embeddable = await checkEmbeddable(
      target,
      request.nextUrl.origin,
      AbortSignal.timeout(TIMEOUT_MS)
    );
    return NextResponse.json({ embeddable });
  } catch {
    return NextResponse.json({ error: "Site unreachable" }, { status: 502 });
  }
}
