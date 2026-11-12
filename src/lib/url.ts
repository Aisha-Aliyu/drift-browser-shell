const SEARCH_ENGINES = {
  duckduckgo: "https://duckduckgo.com/?q=",
  // igu=1 asks Google for a version of the page that can be shown inside a frame
  google:     "https://www.google.com/search?igu=1&q=",
  bing:       "https://www.bing.com/search?q=",
};

export type SearchEngine = keyof typeof SEARCH_ENGINES;

const TRUSTED_SCHEMES = ["https:", "http:"];

export const NEW_TAB_URL = "about:newtab";

export function resolveInput(
  raw: string,
  engine: SearchEngine = "google"
): string {
  const trimmed = raw.trim();
  if (!trimmed) return "about:blank";
  if (trimmed === NEW_TAB_URL) return NEW_TAB_URL;

  if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) {
    return withFrameMode(sanitizeUrl(trimmed));
  }

  if (looksLikeDomain(trimmed)) {
    return withFrameMode(sanitizeUrl(`https://${trimmed}`));
  }

  return `${SEARCH_ENGINES[engine]}${encodeURIComponent(trimmed)}`;
}

// Google's home and search pages only work inside a frame in igu=1 mode, so typing
// google.com or pasting a Google search link opens it in that mode
function withFrameMode(url: string): string {
  try {
    const u = new URL(url);
    const isGoogle = u.hostname === "google.com" || u.hostname === "www.google.com";
    if (!isGoogle || !["/", "/search", "/webhp"].includes(u.pathname)) return url;
    u.protocol = "https:";
    u.hostname = "www.google.com";
    if (u.pathname === "/") u.pathname = "/webhp";
    u.searchParams.set("igu", "1");
    return u.href;
  } catch {
    return url;
  }
}

// Popular sites that refuse to be shown inside a frame, so DRIFT can say so straight away
// without asking the server
const KNOWN_BLOCKED_HOSTS = new Set([
  "github.com", "www.github.com", "gist.github.com",
  "youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be",
  "linkedin.com", "www.linkedin.com",
  "reddit.com", "www.reddit.com", "old.reddit.com",
  "news.ycombinator.com",
  "developer.mozilla.org",
  "x.com", "twitter.com",
  "facebook.com", "www.facebook.com", "m.facebook.com",
  "instagram.com", "www.instagram.com",
  "duckduckgo.com",
  "stackoverflow.com",
  "amazon.com", "www.amazon.com",
  "netflix.com", "www.netflix.com",
]);

export function isKnownBlocked(url: string): boolean {
  try {
    const u = new URL(url);
    return (u.protocol === "https:" || u.protocol === "http:") && KNOWN_BLOCKED_HOSTS.has(u.hostname);
  } catch {
    return false;
  }
}

// Pages that are known to work inside a frame, so DRIFT can skip the server check
export function isKnownEmbeddable(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      u.protocol === "https:" &&
      (u.hostname === "www.google.com" || u.hostname === "google.com") &&
      ["/", "/search", "/webhp"].includes(u.pathname) &&
      u.searchParams.get("igu") === "1"
    );
  } catch {
    return false;
  }
}

export function toDisplayUrl(url: string): string {
  if (!url || url === "about:blank" || url === NEW_TAB_URL) return "";
  try {
    const u = new URL(url);
    let display = u.hostname + u.pathname + u.search + u.hash;
    if (display.endsWith("/") && display !== "/") {
      display = display.slice(0, -1);
    }
    return display;
  } catch {
    return url;
  }
}

export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (!TRUSTED_SCHEMES.includes(parsed.protocol)) {
      return "about:blank";
    }
    return parsed.href;
  } catch {
    return "about:blank";
  }
}

export function extractHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

export function isSecure(url: string): boolean {
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}

export function getFaviconUrl(url: string): string {
  const hostname = extractHostname(url);
  if (!hostname) return "";
  return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
}

function looksLikeDomain(input: string): boolean {
  const noSpaces = !/\s/.test(input);
  const hasDot = input.includes(".");
  if (!noSpaces || !hasDot) return false;
  const parts = input.split(".");
  const tld = parts[parts.length - 1].split("/")[0];
  return tld.length >= 2 && tld.length <= 6 && /^[a-zA-Z]+$/.test(tld);
}
