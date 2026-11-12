import { NextRequest, NextResponse } from "next/server";
import { CHECKER_UA_TOKEN, checkEmbeddable, toPublicUrl } from "@/lib/framePolicy";
import { frameCheckGlobalLimiter, frameCheckLimiter, getIp } from "@/lib/ratelimit";

// Tells the client whether a site can be shown inside DRIFT's frame, so it can offer
// "Open in new tab" instead of a blank page. The answer is only ever a yes or no.
const TIMEOUT_MS = 5000;

// null means the limiter couldn't answer in time, so the check doesn't run unlimited
async function withinLimits(ip: string): Promise<boolean | null> {
  const perVisitor = await frameCheckLimiter.limit(ip);
  if (perVisitor.reason === "timeout") return null;
  if (!perVisitor.success) return false;
  // Checked second, so one busy visitor can't use up everyone's budget
  const overall = await frameCheckGlobalLimiter.limit("all");
  if (overall.reason === "timeout") return null;
  return overall.success;
}

export async function GET(request: NextRequest) {
  // Only DRIFT's own pages may use the check. Other sites can't spend its budget through
  // embedded requests, and the checker can't be pointed back at itself.
  const fetchSite = request.headers.get("sec-fetch-site");
  const userAgent = request.headers.get("user-agent") ?? "";
  if ((fetchSite && fetchSite !== "same-origin") || userAgent.includes(CHECKER_UA_TOKEN)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let allowed: boolean | null;
  try {
    allowed = await withinLimits(getIp(request));
  } catch {
    allowed = null;
  }
  if (allowed === null) {
    return NextResponse.json({ error: "Check unavailable" }, { status: 503 });
  }
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const raw = request.nextUrl.searchParams.get("url");
  if (!raw || raw.length > 2048) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  // One deadline covers every DNS lookup, redirect and response
  const signal = AbortSignal.timeout(TIMEOUT_MS);
  const target = await toPublicUrl(raw, signal);
  if (!target) {
    return NextResponse.json({ error: "URL not allowed" }, { status: 400 });
  }

  try {
    const embeddable = await checkEmbeddable(target, request.nextUrl.origin, signal);
    return NextResponse.json({ embeddable });
  } catch {
    return NextResponse.json({ error: "Site unreachable" }, { status: 502 });
  }
}
