import { isKnownEmbeddable } from "@/lib/url";

const results = new Map<string, boolean>();
const inFlight = new Map<string, Promise<boolean>>();
const MAX_CACHED = 200;
const CHECK_TIMEOUT_MS = 8000;

// False for pages DRIFT can show without asking the server first
export function needsFrameCheck(url: string): boolean {
  return /^https?:\/\//i.test(url) && !isKnownEmbeddable(url);
}

// Only the site's address is sent, never the path, query string or fragment, so search terms
// and tokens stay private (incognito tabs included) and one-time links aren't used up.
// Sites set their framing rules for the whole site, so one answer covers every page on it.
function checkTarget(url: string): string | null {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

async function askServer(target: string): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CHECK_TIMEOUT_MS);
  try {
    const response = await fetch(`/api/frame-check?url=${encodeURIComponent(target)}`, {
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) return true;
    const data: unknown = await response.json();
    const embeddable = !(
      typeof data === "object" &&
      data !== null &&
      (data as { embeddable?: unknown }).embeddable === false
    );
    if (results.size >= MAX_CACHED) results.clear();
    results.set(target, embeddable);
    return embeddable;
  } catch {
    return true;
  } finally {
    clearTimeout(timer);
  }
}

// Asks the server whether a site can be shown inside a frame. When the check can't run or
// takes too long, it returns true so the frame still tries to load.
export async function canShowInFrame(url: string): Promise<boolean> {
  if (!needsFrameCheck(url)) return true;
  const target = checkTarget(url);
  if (!target) return true;

  const cached = results.get(target);
  if (cached !== undefined) return cached;

  let pending = inFlight.get(target);
  if (!pending) {
    pending = askServer(target).finally(() => inFlight.delete(target));
    inFlight.set(target, pending);
  }
  return pending;
}
