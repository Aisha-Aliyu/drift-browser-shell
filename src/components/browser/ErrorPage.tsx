"use client";

import React, { useCallback } from "react";
import type { BrowserTab } from "@/types/browser";
import { useBrowser } from "@/context/BrowserContext";

export default function ErrorPage({ tab }: { tab: BrowserTab }) {
  const { navigate } = useBrowser();

  const retry = useCallback(() => navigate(tab.id, tab.url), [navigate, tab.id, tab.url]);
  const goHome = useCallback(() => navigate(tab.id, "https://duckduckgo.com"), [navigate, tab.id]);

  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#0a0f3c",
      padding: "32px 24px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse 60% 40% at 50% 40%, rgba(44,93,169,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        inset: 0,
        opacity: 0.025,
        backgroundImage: "linear-gradient(rgba(200,218,249,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,218,249,1) 1px, transparent 1px)",
        backgroundSize: "52px 52px",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        textAlign: "center",
        maxWidth: "400px",
        width: "100%",
      }}>
        {/* Error icon */}
        <div style={{
          width: "64px",
          height: "64px",
          borderRadius: "20px",
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(252,165,165,0.8)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <h1 style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "26px",
            color: "#f4f8ff",
            margin: 0,
            fontWeight: 400,
            letterSpacing: "-0.01em",
          }}>
            Page not available
          </h1>
          <p style={{
            fontSize: "13px",
            color: "rgba(200,218,249,0.45)",
            fontFamily: "'DM Sans', sans-serif",
            lineHeight: 1.6,
            margin: 0,
          }}>
            {tab.error}
          </p>
          {tab.displayUrl && (
            <p style={{
              fontSize: "11px",
              color: "rgba(200,218,249,0.2)",
              fontFamily: "'JetBrains Mono', monospace",
              marginTop: "4px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}>
              {tab.displayUrl}
            </p>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={retry}
            style={{
              padding: "10px 20px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #2c5da9, #1a3f7a)",
              border: "none",
              color: "#f4f8ff",
              fontSize: "13px",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(44,93,169,0.35)",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(44,93,169,0.45)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(44,93,169,0.35)";
            }}
          >
            Try again
          </button>
          <button
            onClick={goHome}
            style={{
              padding: "10px 20px",
              borderRadius: "12px",
              background: "rgba(26,40,104,0.6)",
              border: "1px solid rgba(200,218,249,0.1)",
              color: "rgba(200,218,249,0.65)",
              fontSize: "13px",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(26,40,104,0.9)";
              (e.currentTarget as HTMLButtonElement).style.color = "#f4f8ff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(26,40,104,0.6)";
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(200,218,249,0.65)";
            }}
          >
            Go home
          </button>
        </div>

        {/* Note */}
        <p style={{
          fontSize: "11px",
          color: "rgba(200,218,249,0.15)",
          fontFamily: "'JetBrains Mono', monospace",
          lineHeight: 1.6,
          maxWidth: "320px",
        }}>
          Many sites block iframe embedding. This is a browser security policy not a bug.
        </p>
      </div>
    </div>
  );
}
