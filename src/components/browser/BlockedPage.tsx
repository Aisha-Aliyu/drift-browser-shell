"use client";

import React from "react";
import { useBrowser } from "@/context/BrowserContext";
import { extractHostname, NEW_TAB_URL } from "@/lib/url";
import type { TabId } from "@/types/browser";

export default function BlockedPage({ tabId, url }: { tabId: TabId; url: string }) {
  const { navigate } = useBrowser();
  const host = extractHostname(url) || "This site";

  return (
    <div style={{
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#0a0f3c",
      padding: "32px 24px",
    }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "18px",
        textAlign: "center",
        maxWidth: "420px",
        width: "100%",
      }}>
        <div style={{
          width: "64px",
          height: "64px",
          borderRadius: "20px",
          background: "#16205a",
          border: "1px solid rgba(200,218,249,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c8daf9" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </div>

        <h1 style={{
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontSize: "26px",
          color: "#f4f8ff",
          margin: 0,
          fontWeight: 400,
          overflowWrap: "anywhere",
        }}>
          {host} can&apos;t open inside DRIFT
        </h1>

        <p style={{
          fontSize: "14px",
          color: "rgba(200,218,249,0.75)",
          fontFamily: "'DM Sans', sans-serif",
          lineHeight: 1.6,
          margin: 0,
        }}>
          This site can&apos;t be shown inside another app, so DRIFT can&apos;t display it here.
          You can still open it in a new tab.
        </p>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "10px 20px",
              borderRadius: "12px",
              background: "#2c5da9",
              color: "#f4f8ff",
              fontSize: "13px",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Open in new tab
          </a>
          <button
            type="button"
            onClick={() => navigate(tabId, NEW_TAB_URL)}
            style={{
              padding: "10px 20px",
              borderRadius: "12px",
              background: "#16205a",
              border: "1px solid rgba(200,218,249,0.2)",
              color: "#c8daf9",
              fontSize: "13px",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Back to start page
          </button>
        </div>
      </div>
    </div>
  );
}
