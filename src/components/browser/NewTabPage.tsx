"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useBrowser } from "@/context/BrowserContext";
import { IconDriftLogo } from "@/components/icons/Icons";

const QUICK_LINKS = [
  { label: "GitHub",   url: "https://github.com", icon: "https://www.google.com/s2/favicons?domain=github.com&sz=32"               },
  { label: "YouTube",  url: "https://youtube.com", icon: "https://www.google.com/s2/favicons?domain=youtube.com&sz=32"              },
  { label: "MDN",      url: "https://developer.mozilla.org", icon: "https://www.google.com/s2/favicons?domain=developer.mozilla.org&sz=32"    },
  { label: "Vercel",   url: "https://vercel.com", icon: "https://www.google.com/s2/favicons?domain=vercel.com&sz=32"               },
  { label: "HN",       url: "https://news.ycombinator.com", icon: "https://www.google.com/s2/favicons?domain=news.ycombinator.com&sz=32"     },
  { label: "Reddit",   url: "https://reddit.com", icon: "https://www.google.com/s2/favicons?domain=reddit.com&sz=32"               },
  { label: "X",        url: "https://x.com",  icon: "https://www.google.com/s2/favicons?domain=x.com&sz=32"                    },
  { label: "LinkedIn", url: "https://linkedin.com", icon: "https://www.google.com/s2/favicons?domain=linkedin.com&sz=32"             },
];

function useClock() {
  const [time, setTime] = useState({ h: "", m: "", s: "", date: "" });
  useEffect(() => {
    function tick() {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      const date = now.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" });
      setTime({ h, m, s, date });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function NewTabPage() {
  const { state, navigate } = useBrowser();
  const { h, m, s, date } = useClock();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!state.activeTabId || !query.trim()) return;
      navigate(state.activeTabId, query);
    },
    [navigate, state.activeTabId, query]
  );

  const goTo = useCallback(
    (url: string) => {
      if (!state.activeTabId) return;
      navigate(state.activeTabId, url);
    },
    [navigate, state.activeTabId]
  );

  return (
    <div style={{
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      backgroundColor: "#0a0f3c",
      position: "relative",
    }}>
      {/* Radial glow */}
      <div style={{
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "120%",
        height: "50%",
        background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(44,93,169,0.28) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Subtle grid */}
      <div style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity: 0.03,
        backgroundImage: "linear-gradient(rgba(200,218,249,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,218,249,1) 1px, transparent 1px)",
        backgroundSize: "52px 52px",
      }} />

      {/* Main content */}
      <div style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "48px",
        paddingBottom: "48px",
        paddingLeft: "20px",
        paddingRight: "20px",
        gap: "32px",
        width: "100%",
        maxWidth: "540px",
        margin: "0 auto",
        boxSizing: "border-box",
      }}>

        {/* Clock block */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <IconDriftLogo size={40} />

          {/* Large digital clock */}
          <div style={{
            display: "flex",
            alignItems: "baseline",
            gap: "0px",
            marginTop: "8px",
          }}>
            <span style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: "clamp(3.5rem, 16vw, 5.5rem)",
              color: "#f4f8ff",
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}>
              {h}:{m}
            </span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "clamp(1rem, 4vw, 1.5rem)",
              color: "rgba(200,218,249,0.3)",
              marginLeft: "6px",
              lineHeight: 1,
              letterSpacing: "0",
              alignSelf: "flex-end",
              paddingBottom: "6px",
            }}>
              :{s}
            </span>
          </div>

          <p style={{
            fontSize: "13px",
            color: "rgba(200,218,249,0.4)",
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.02em",
          }}>
            {date}
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} style={{ width: "100%" }}>
          <div style={{ position: "relative", width: "100%" }}>
            <div style={{
              position: "absolute",
              inset: 0,
              borderRadius: "16px",
              background: focused
                ? "rgba(44,93,169,0.15)"
                : "rgba(26,40,104,0.5)",
              border: focused
                ? "1px solid rgba(44,93,169,0.55)"
                : "1px solid rgba(200,218,249,0.09)",
              transition: "all 0.2s",
              boxShadow: focused
                ? "0 0 0 3px rgba(44,93,169,0.15), 0 8px 24px rgba(10,15,60,0.4)"
                : "none",
              pointerEvents: "none",
            }} />
            <div style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              padding: "0 14px",
              height: "48px",
            }}>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(200,218,249,0.3)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0, marginRight: "10px" }}
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Search or enter a URL"
                autoFocus
                spellCheck={false}
                autoComplete="off"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#f4f8ff",
                  fontSize: "15px",
                  fontFamily: "'DM Sans', sans-serif",
                  minWidth: 0,
                }}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  style={{
                    background: "rgba(200,218,249,0.1)",
                    border: "none",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                    marginRight: "8px",
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(200,218,249,0.5)" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
              <button
                type="submit"
                aria-label="Search"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #2c5da9, #1a3f7a)",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 2px 8px rgba(44,93,169,0.4)",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </form>

        {/* Quick links */}
        <div style={{ width: "100%" }}>
          <p style={{
            fontSize: "10px",
            color: "rgba(200,218,249,0.22)",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            fontFamily: "'JetBrains Mono', monospace",
            marginBottom: "12px",
          }}>
            Quick access
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "10px",
          }}>
            {QUICK_LINKS.map((link) => (
              <QuickLink key={link.url} {...link} onClick={() => goTo(link.url)} />
            ))}
          </div>
        </div>

        {/* Recent history */}
        {state.history.length > 0 && (
          <div style={{ width: "100%" }}>
            <p style={{
              fontSize: "10px",
              color: "rgba(200,218,249,0.22)",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              fontFamily: "'JetBrains Mono', monospace",
              marginBottom: "8px",
            }}>
              Recent
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {state.history.slice(0, 6).map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => goTo(entry.url)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "9px 12px",
                    borderRadius: "12px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(26,40,104,0.55)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  }}
                >
                  {entry.favicon
                    ? <img src={entry.favicon} alt="" width={14} height={14} style={{ borderRadius: "3px", opacity: 0.65, flexShrink: 0 }} />
                    : <span style={{ width: "14px", height: "14px", borderRadius: "50%", background: "rgba(44,93,169,0.4)", flexShrink: 0, display: "inline-block" }} />
                  }
                  <span style={{
                    flex: 1,
                    fontSize: "12px",
                    color: "rgba(200,218,249,0.55)",
                    fontFamily: "'DM Sans', sans-serif",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    minWidth: 0,
                  }}>
                    {entry.title || entry.url}
                  </span>
                  <span style={{
                    fontSize: "10px",
                    color: "rgba(200,218,249,0.2)",
                    fontFamily: "'JetBrains Mono', monospace",
                    flexShrink: 0,
                  }}>
                    {new Date(entry.visitedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginTop: "8px",
          opacity: 0.25,
        }}>
          <IconDriftLogo size={14} />
          <span style={{
            fontSize: "11px",
            color: "rgba(200,218,249,0.8)",
            fontFamily: "'DM Serif Display', serif",
            letterSpacing: "0.08em",
          }}>
            DRIFT
          </span>
          <span style={{ fontSize: "11px", color: "rgba(200,218,249,0.4)", fontFamily: "'DM Sans', sans-serif" }}>
             Built by Aisha Aliyu
          </span>
        </div>
      </div>
    </div>
  );
}

function QuickLink({
  label, icon, onClick,
}: {
  label: string;
  icon: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={label}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "7px",
        paddingTop: "14px",
        paddingBottom: "12px",
        paddingLeft: "4px",
        paddingRight: "4px",
        borderRadius: "14px",
        background: hovered ? "rgba(31,48,112,0.8)" : "rgba(22,33,94,0.55)",
        border: hovered
          ? "1px solid rgba(44,93,169,0.3)"
          : "1px solid rgba(200,218,249,0.07)",
        cursor: "pointer",
        transition: "all 0.15s",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? "0 6px 20px rgba(10,15,60,0.4)" : "none",
        minWidth: 0,
      }}
    >
      <img
        src={icon}
        alt={label}
        width={22}
        height={22}
        style={{
          borderRadius: "6px",
          opacity: hovered ? 1 : 0.75,
          transition: "opacity 0.15s",
        }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
      <span style={{
        fontSize: "10px",
        color: hovered ? "rgba(200,218,249,0.8)" : "rgba(200,218,249,0.4)",
        fontFamily: "'DM Sans', sans-serif",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        maxWidth: "100%",
        transition: "color 0.15s",
      }}>
        {label}
      </span>
    </button>
  );
}
