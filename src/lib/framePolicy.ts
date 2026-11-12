// Server only. Used by /api/frame-check to decide whether a site can be shown inside
// DRIFT's frame, without ever connecting to private or internal addresses.
import * as dns from "node:dns";
import * as http from "node:http";
import * as https from "node:https";
import { isIP } from "node:net";
import type { LookupFunction } from "node:net";

const MAX_REDIRECTS = 4;
const DNS_TIMEOUT_MS = 2000;
// Requests that carry this token come from the checker itself, and the route refuses them
export const CHECKER_UA_TOKEN = "DRIFT/1.0";
const USER_AGENT = `Mozilla/5.0 (compatible; ${CHECKER_UA_TOKEN}; +https://github.com/Aisha-Aliyu/drift-browser-shell)`;
const BLOCKED_HOST_SUFFIXES = [
  ".localhost", ".local", ".internal", ".lan", ".intranet", ".corp", ".home.arpa",
];

type Address = { address: string; family: 4 | 6 };

function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) {
    return true;
  }
  const [a, b, c] = parts;
  return (
    a === 0 ||                                         // "this" network
    a === 10 ||                                        // private
    a === 127 ||                                       // loopback
    (a === 100 && b >= 64 && b <= 127) ||              // carrier-grade NAT
    (a === 169 && b === 254) ||                        // link local and cloud metadata
    (a === 172 && b >= 16 && b <= 31) ||               // private
    (a === 192 && b === 0 && (c === 0 || c === 2)) ||  // protocol assignments, TEST-NET-1
    (a === 192 && b === 168) ||                        // private
    (a === 198 && (b === 18 || b === 19)) ||           // benchmarking
    (a === 198 && b === 51 && c === 100) ||            // TEST-NET-2
    (a === 203 && b === 0 && c === 113) ||             // TEST-NET-3
    a >= 224                                           // multicast and reserved
  );
}

function isPrivateIPv6(ip: string): boolean {
  const addr = ip.toLowerCase().split("%")[0];
  // Covers ::, ::1 and the IPv4-mapped and IPv4-compatible forms
  if (addr.startsWith("::")) return true;
  const first = parseInt(addr.split(":")[0], 16);
  if (Number.isNaN(first)) return true;
  return (
    first <= 0x00ff ||               // 0000::/8 reserved, includes NAT64 64:ff9b::/96
    (first & 0xfe00) === 0xfc00 ||   // fc00::/7 unique local
    (first & 0xffc0) === 0xfe80 ||   // fe80::/10 link local
    (first & 0xffc0) === 0xfec0 ||   // fec0::/10 old site local
    (first & 0xff00) === 0xff00 ||   // ff00::/8 multicast
    first === 0x2002 ||              // 6to4, which wraps an IPv4 address
    addr.startsWith("2001:db8:")     // documentation range
  );
}

export function isBlockedAddress(ip: string): boolean {
  const version = isIP(ip);
  if (version === 4) return isPrivateIPv4(ip);
  if (version === 6) return isPrivateIPv6(ip);
  return true;
}

// Asks DNS directly with a short timeout instead of using the system lookup, which runs on
// Node's small thread pool, and stops as soon as the deadline passes
async function resolveAll(host: string, signal: AbortSignal): Promise<Address[]> {
  if (signal.aborted) throw new Error("Timed out");
  const resolver = new dns.promises.Resolver({ timeout: DNS_TIMEOUT_MS, tries: 1 });
  const cancel = () => resolver.cancel();
  signal.addEventListener("abort", cancel, { once: true });
  try {
    const [v4, v6] = await Promise.allSettled([resolver.resolve4(host), resolver.resolve6(host)]);
    const addresses: Address[] = [];
    if (v4.status === "fulfilled") {
      addresses.push(...v4.value.map((address) => ({ address, family: 4 as const })));
    }
    if (v6.status === "fulfilled") {
      addresses.push(...v6.value.map((address) => ({ address, family: 6 as const })));
    }
    return addresses;
  } finally {
    signal.removeEventListener("abort", cancel);
  }
}

// Returns the URL only when it is http or https on a standard port and every address
// it resolves to is public. Anything else returns null.
export async function toPublicUrl(raw: string, signal: AbortSignal): Promise<URL | null> {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  if (url.username || url.password) return null;
  if (url.port && url.port !== "80" && url.port !== "443") return null;

  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "").replace(/\.$/, "");
  if (!host || host === "localhost") return null;
  if (BLOCKED_HOST_SUFFIXES.some((suffix) => host.endsWith(suffix))) return null;
  if (isIP(host)) return isBlockedAddress(host) ? null : url;
  // A name without a dot only resolves inside a private network
  if (!host.includes(".")) return null;

  try {
    const addresses = await resolveAll(host, signal);
    if (addresses.length === 0 || addresses.some((a) => isBlockedAddress(a.address))) {
      return null;
    }
  } catch {
    return null;
  }
  return url;
}

function headerValue(value: string | string[] | undefined): string | null {
  if (value === undefined) return null;
  return Array.isArray(value) ? value.join(", ") : value;
}

// CSP source matching for one frame-ancestors source against DRIFT's own origin
function sourceAllows(source: string, self: URL): boolean {
  const value = source.toLowerCase();
  const selfScheme = self.protocol.slice(0, -1);
  if (value === "*") return true;
  if (value === "https:") return selfScheme === "https";
  if (value === "http:") return selfScheme === "http" || selfScheme === "https";
  // 'self', 'none' and the other keywords never match a different origin
  if (value.startsWith("'")) return false;

  const match =
    /^(?:([a-z][a-z0-9+.-]*):\/\/)?(\*|(?:\*\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)*)(?::(\d+|\*))?(\/.*)?$/.exec(value);
  if (!match) return false;
  const [, scheme, host, port, path] = match;
  // DRIFT runs at "/", so a source limited to any other path doesn't match it
  if (path && path !== "/") return false;

  if (scheme && scheme !== selfScheme && !(scheme === "http" && selfScheme === "https")) {
    return false;
  }
  if (host.startsWith("*.")) {
    if (!self.hostname.endsWith(host.slice(1))) return false;
  } else if (host !== "*" && host !== self.hostname) {
    return false;
  }

  if (!port) return self.port === "";
  if (port === "*") return true;
  const selfPort = self.port || (selfScheme === "https" ? "443" : "80");
  return port === selfPort || (scheme === "http" && port === "80" && selfPort === "443");
}

// null when no policy sets frame-ancestors, otherwise whether every policy allows DRIFT
export function frameAncestorsAllow(csp: string, selfOrigin: string): boolean | null {
  const self = new URL(selfOrigin);
  let found = false;
  for (const policy of csp.split(",")) {
    for (const directive of policy.split(";")) {
      const [name, ...sources] = directive.trim().split(/\s+/);
      if (name.toLowerCase() !== "frame-ancestors") continue;
      found = true;
      if (!sources.some((source) => sourceAllows(source, self))) return false;
      // Only the first frame-ancestors directive in a policy counts
      break;
    }
  }
  return found ? true : null;
}

// Follows the HTML standard: conflicting values block, and unknown values such as the
// obsolete ALLOW-FROM are ignored
export function frameOptionsBlock(value: string | null): boolean {
  if (!value) return false;
  const values = new Set(value.split(",").map((v) => v.trim().toLowerCase()));
  if (values.size > 1) {
    return values.has("deny") || values.has("sameorigin") || values.has("allowall");
  }
  return values.has("deny") || values.has("sameorigin");
}

export function allowsFraming(headers: http.IncomingHttpHeaders, selfOrigin: string): boolean {
  const csp = headerValue(headers["content-security-policy"]);
  if (csp) {
    const allowed = frameAncestorsAllow(csp, selfOrigin);
    // Browsers ignore X-Frame-Options when frame-ancestors is set
    if (allowed !== null) return allowed;
  }
  return !frameOptionsBlock(headerValue(headers["x-frame-options"]));
}

// Runs for the real connection, so a DNS answer that changes after toPublicUrl checked it
// still can't point the request at an internal address
function makeSafeLookup(signal: AbortSignal): LookupFunction {
  return (hostname, options, callback) => {
    resolveAll(hostname, signal).then(
      (addresses) => {
        if (addresses.length === 0) {
          callback(new Error("Host not found"), "", 0);
        } else if (addresses.some((a) => isBlockedAddress(a.address))) {
          callback(new Error("Address not allowed"), "", 0);
        } else if (options.all) {
          callback(null, addresses);
        } else {
          callback(null, addresses[0].address, addresses[0].family);
        }
      },
      (err: Error) => callback(err, "", 0)
    );
  };
}

type HeaderResult = { status: number; headers: http.IncomingHttpHeaders };

function fetchHeaders(url: URL, signal: AbortSignal): Promise<HeaderResult> {
  return new Promise((resolve, reject) => {
    const options: http.RequestOptions = {
      method: "GET",
      agent: false,
      lookup: makeSafeLookup(signal),
      signal,
      headers: { "User-Agent": USER_AGENT, Accept: "text/html,*/*;q=0.8" },
    };
    const onResponse = (res: http.IncomingMessage) => {
      resolve({ status: res.statusCode ?? 0, headers: res.headers });
      // Only the headers matter, so close the connection before the page downloads
      res.destroy();
    };
    const req =
      url.protocol === "https:"
        ? https.request(url, options, onResponse)
        : http.request(url, options, onResponse);
    req.on("error", reject);
    req.end();
  });
}

// Follows redirects the way the frame would and reads the final response's headers.
// Throws when the site can't be reached, so the caller can fall back to trying the frame.
export async function checkEmbeddable(
  start: URL,
  selfOrigin: string,
  signal: AbortSignal
): Promise<boolean> {
  const self = new URL(selfOrigin);
  const selfHost = self.hostname.replace(/\.$/, "");
  // Only the site's front page is requested, so tokens in a path or query string are never used up
  let current = new URL(start.origin + "/");
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    // A secure page can't load a plain http page in a frame
    if (self.protocol === "https:" && current.protocol === "http:") return false;
    // Calling DRIFT itself could chain requests through this route
    if (current.hostname.replace(/\.$/, "") === selfHost) throw new Error("Refusing to call itself");
    // Connections to IP literals skip the DNS lookup, so check those addresses here
    const host = current.hostname.replace(/^\[|\]$/g, "");
    if (isIP(host) && isBlockedAddress(host)) throw new Error("Address not allowed");

    const { status, headers } = await fetchHeaders(current, signal);
    const location = headerValue(headers.location);
    if (status >= 300 && status < 400 && location) {
      const next = await toPublicUrl(new URL(location, current).href, signal);
      if (!next) throw new Error("Redirect to a disallowed address");
      current = next;
      continue;
    }
    return allowsFraming(headers, selfOrigin);
  }
  throw new Error("Too many redirects");
}
