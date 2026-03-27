import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,


  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.google.com" },
      { protocol: "https", hostname: "*.googleapis.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
      { protocol: "https", hostname: "img.clerk.com" },
    ],
  },


  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control",       value: "on"                              },
          { key: "X-Content-Type-Options",        value: "nosniff"                         },
          { key: "X-Frame-Options",               value: "SAMEORIGIN"                      },
          { key: "X-XSS-Protection",              value: "1; mode=block"                   },
          { key: "Referrer-Policy",               value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",            value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
    ];
  },
};

export default nextConfig;
