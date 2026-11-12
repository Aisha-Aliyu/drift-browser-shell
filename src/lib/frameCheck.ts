import { isKnownEmbeddable } from "@/lib/url";

const results = new Map<string, boolean>();
const MAX_CACHED = 200;

// False for pages DRIFT can show without asking the server first
export function needsFrameCheck(url: string): boolean {
  return /^https?:\/\//i.test(url) && !isKnownEmbeddable(url);
}

// Asks the server whether a site can be shown inside a frame. When the check can't run,
// it returns true so the frame still tries to load.
export async function canShowInFrame(url: string): Promise<boolean> {
  if (!needsFrameCheck(url)) return true;

  const key = url.split("#")[0];
  const cached = results.get(key);
  if (cached !== undefined) return cached;

  try {
    const response = await fetch(`/api/frame-check?url=${encodeURIComponent(key)}`, {
      cache: "no-store",
    });
    if (!response.ok) return true;
    const data: unknown = await response.json();
    const embeddable = !(
      typeof data === "object" &&
      data !== null &&
      (data as { embeddable?: unknown }).embeddable === false
    );
    if (results.size >= MAX_CACHED) results.clear();
    results.set(key, embeddable);
    return embeddable;
  } catch {
    return true;
  }
}
