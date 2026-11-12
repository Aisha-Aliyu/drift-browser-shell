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
  timeout: 2000,
});

// Caps how many outside requests DRIFT can be made to send in total, whatever the source
export const frameCheckGlobalLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(600, "1 m"),
  prefix: "drift:framecheck:all",
  timeout: 2000,
});

export function getIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "127.0.0.1";
}
