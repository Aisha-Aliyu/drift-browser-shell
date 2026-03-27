const SEARCH_ENGINES = {
  duckduckgo: "https://duckduckgo.com/?q=",
  google:     "https://www.google.com/search?q=",
  bing:       "https://www.bing.com/search?q=",
};

export type SearchEngine = keyof typeof SEARCH_ENGINES;

const TRUSTED_SCHEMES = ["https:", "http:"];

export const NEW_TAB_URL = "about:newtab";

export function resolveInput(
  raw: string,
  engine: SearchEngine = "duckduckgo"
): string {
  const trimmed = raw.trim();
  if (!trimmed) return "about:blank";

  if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) {
    return sanitizeUrl(trimmed);
  }

  if (looksLikeDomain(trimmed)) {
    return sanitizeUrl(`https://${trimmed}`);
  }

  return `${SEARCH_ENGINES[engine]}${encodeURIComponent(trimmed)}`;
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
