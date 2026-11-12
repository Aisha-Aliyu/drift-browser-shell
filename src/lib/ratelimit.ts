import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 h"),
  analytics: true,
  prefix: "drift:ratelimit",
});

// The frame check runs once for each new site a visitor opens, so it gets its own budget
export const frameCheckLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "1 m"),
  prefix: "drift:framecheck",
  timeout: 1000,
});

// Caps how many outside requests DRIFT can be made to send in total, whatever the source
export const frameCheckGlobalLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(600, "1 m"),
  prefix: "drift:framecheck:all",
  timeout: 1000,
});

// Fixed one-minute windows kept in memory on this server instance. Only used when Upstash
// can't be reached, so the frame check stays limited.
const localWindows = new Map<string, { count: number; resetAt: number }>();
const MAX_LOCAL_KEYS = 10_000;

export function localLimit(key: string, max: number, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = localWindows.get(key);
  if (entry && entry.resetAt > now) {
    entry.count += 1;
    return entry.count <= max;
  }
  if (!entry && localWindows.size >= MAX_LOCAL_KEYS) {
    // Drop only finished windows, so flooding new keys can't reset anyone's count
    for (const [k, v] of localWindows) {
      if (v.resetAt <= now) localWindows.delete(k);
    }
    if (localWindows.size >= MAX_LOCAL_KEYS) return false;
  }
  localWindows.set(key, { count: 1, resetAt: now + windowMs });
  return true;
}

export function getIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "127.0.0.1";
}
