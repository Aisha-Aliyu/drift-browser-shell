import { NextRequest, NextResponse } from "next/server";
import { CHECKER_UA_TOKEN, checkEmbeddable, toPublicUrl } from "@/lib/framePolicy";
import { frameCheckGlobalLimiter, frameCheckLimiter, getIp, localLimit } from "@/lib/ratelimit";

// Tells the client whether a site can be shown inside DRIFT's frame, so it can offer
// "Open in new tab" instead of a blank page. The answer is only ever a yes or no.
const TIMEOUT_MS = 5000;
const PER_VISITOR_PER_MINUTE = 60;
const OVERALL_PER_MINUTE = 600;

function fail(status: number, reason: string) {
  return NextResponse.json({ error: reason }, { status });
}

// After Upstash fails, skip it for a minute so later requests don't wait on it again
const UPSTASH_RETRY_MS = 60_000;
let upstashDownUntil = 0;

// Uses the shared Upstash limits. If Upstash fails or doesn't answer in time, it falls back
// to limits kept on this server instance, so the check never runs unlimited.
async function withinLimits(ip: string): Promise<{ allowed: boolean; shared: boolean }> {
  if (Date.now() >= upstashDownUntil) {
    try {
      const perVisitor = await frameCheckLimiter.limit(ip);
      if (perVisitor.reason !== "timeout") {
        if (!perVisitor.success) return { allowed: false, shared: true };
        // Checked second, so one busy visitor can't use up everyone's budget
        const overall = await frameCheckGlobalLimiter.limit("all");
        if (overall.reason !== "timeout") return { allowed: overall.success, shared: true };
      }
      console.error("[frame-check] Upstash rate limiter timed out, using local limits");
    } catch (err) {
      console.error("[frame-check] Upstash rate limiter failed, using local limits", err);
    }
    upstashDownUntil = Date.now() + UPSTASH_RETRY_MS;
  }
  const allowed =
    localLimit(`ip:${ip}`, PER_VISITOR_PER_MINUTE) && localLimit("all", OVERALL_PER_MINUTE);
  return { allowed, shared: false };
}

export async function GET(request: NextRequest) {
  // Refuse requests that browsers mark as coming from another site, so other sites can't
  // spend DRIFT's budget through embedded requests, and refuse the checker calling itself.
  // "none" means someone opened the address directly, which is fine.
  const fetchSite = request.headers.get("sec-fetch-site");
  const userAgent = request.headers.get("user-agent") ?? "";
  const crossSite = fetchSite !== null && fetchSite !== "same-origin" && fetchSite !== "none";
  if (crossSite || userAgent.includes(CHECKER_UA_TOKEN)) {
    return fail(403, "forbidden");
  }

  const { allowed, shared } = await withinLimits(getIp(request));
  if (!allowed) return fail(429, "rate_limited");

  const raw = request.nextUrl.searchParams.get("url");
  if (!raw || raw.length > 2048) return fail(400, "invalid_url");

  // One deadline covers every DNS lookup, redirect and response
  const signal = AbortSignal.timeout(TIMEOUT_MS);
  const target = await toPublicUrl(raw, signal);
  if (!target) return fail(400, "not_allowed");

  try {
    const embeddable = await checkEmbeddable(target, request.nextUrl.origin, signal);
    return NextResponse.json(shared ? { embeddable } : { embeddable, limits: "local" });
  } catch (err) {
    console.error("[frame-check] Could not check", target.origin, err);
    return fail(502, "unreachable");
  }
}
