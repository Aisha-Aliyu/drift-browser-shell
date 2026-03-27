import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        drift: {
          void:    "#0a0f3c",
          deep:    "#0d1347",
          mid:     "#111a54",
          surface: "#16215e",
          card:    "#1a2868",
          lift:    "#1f3070",
          blue:    "#2c5da9",
          sky:     "#4a7ec5",
          mist:    "#c8daf9",
          fog:     "#e4edfc",
          white:   "#f4f8ff",
        },
      },
      fontFamily: {
        display: ["'DM Serif Display'", "Georgia", "serif"],
        mono:    ["'JetBrains Mono'", "'Fira Code'", "monospace"],
        sans:    ["'DM Sans'", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "drift-gradient": "linear-gradient(135deg, #0a0f3c 0%, #2c5da9 60%, #c8daf9 100%)",
        "drift-card":     "linear-gradient(160deg, #1a2868 0%, #0d1347 100%)",
        "drift-glow":     "radial-gradient(ellipse at 50% 0%, #2c5da9 0%, transparent 70%)",
      },
      boxShadow: {
        "drift-sm":  "0 1px 3px rgba(10,15,60,0.4), 0 1px 2px rgba(44,93,169,0.15)",
        "drift-md":  "0 4px 16px rgba(10,15,60,0.5), 0 2px 6px rgba(44,93,169,0.2)",
        "drift-lg":  "0 10px 40px rgba(10,15,60,0.6), 0 4px 16px rgba(44,93,169,0.25)",
        "drift-tab": "inset 0 1px 0 rgba(200,218,249,0.08)",
        "drift-url": "0 0 0 2px rgba(44,93,169,0.5), 0 4px 20px rgba(10,15,60,0.4)",
      },
      borderRadius: {
        "xl2": "1rem",
        "xl3": "1.25rem",
      },
      animation: {
        "tab-in":      "tabIn 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in":     "fadeIn 0.2s ease",
        "slide-down":  "slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "pulse-soft":  "pulseSoft 2s ease-in-out infinite",
        "spinner":     "spin 0.7s linear infinite",
      },
      keyframes: {
        tabIn: {
          "0%":   { opacity: "0", transform: "translateY(-4px) scale(0.97)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideDown: {
          "0%":   { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.6" },
          "50%":       { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;