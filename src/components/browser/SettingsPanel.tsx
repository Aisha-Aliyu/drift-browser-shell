"use client";

import React, { useCallback } from "react";
import { useBrowser } from "@/context/BrowserContext";
import type { BrowserSettings } from "@/types/browser";

const ENGINES: { value: BrowserSettings["searchEngine"]; label: string; note: string }[] = [
  { value: "duckduckgo", label: "DuckDuckGo", note: "Privacy first" },
  { value: "google",     label: "Google",     note: "Most popular" },
  { value: "bing",       label: "Bing",       note: "Microsoft"    },
];

const FONT_SIZES: { value: BrowserSettings["fontSize"]; label: string }[] = [
  { value: "small",  label: "Small"  },
  { value: "medium", label: "Medium" },
  { value: "large",  label: "Large"  },
];

export default function SettingsPanel() {
  const { state, dispatch } = useBrowser();
  const { settings } = state;

  const updateSettings = useCallback(
    (patch: Partial<BrowserSettings>) => {
      dispatch({ type: "UPDATE_SETTINGS", settings: patch });
    },
    [dispatch]
  );

  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 6px)",
        right: "0px",
        width: "min(320px, 92vw)",
        zIndex: 100,
        borderRadius: "16px",
        background: "rgba(13,19,71,0.98)",
        border: "1px solid rgba(200,218,249,0.12)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow: "0 20px 60px rgba(10,15,60,0.8), 0 0 0 1px rgba(44,93,169,0.1)",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <Section title="Search Engine">
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {ENGINES.map((eng) => (
            <button
              key={eng.value}
              onClick={() => updateSettings({ searchEngine: eng.value })}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 12px",
                borderRadius: "10px",
                background: settings.searchEngine === eng.value
                  ? "rgba(44,93,169,0.35)"
                  : "rgba(26,40,104,0.4)",
                border: settings.searchEngine === eng.value
                  ? "1px solid rgba(44,93,169,0.5)"
                  : "1px solid rgba(200,218,249,0.06)",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: "13px", color: "#f4f8ff" }}>{eng.label}</span>
              <span style={{ fontSize: "11px", color: "rgba(200,218,249,0.4)" }}>{eng.note}</span>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Appearance">
        <Toggle
          label="Show bookmark bar"
          value={settings.showBookmarkBar}
          onChange={(v: boolean) => updateSettings({ showBookmarkBar: v })}
        />
        <div style={{ marginTop: "12px" }}>
          <p style={{
            fontSize: "10px",
            color: "rgba(200,218,249,0.3)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontFamily: "'JetBrains Mono', monospace",
            marginBottom: "6px",
          }}>
            Font size
          </p>
          <div style={{ display: "flex", gap: "6px" }}>
            {FONT_SIZES.map((fs) => (
              <button
                key={fs.value}
                onClick={() => updateSettings({ fontSize: fs.value })}
                style={{
                  flex: 1,
                  padding: "7px 4px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: settings.fontSize === fs.value
                    ? "#f4f8ff"
                    : "rgba(200,218,249,0.4)",
                  background: settings.fontSize === fs.value
                    ? "rgba(44,93,169,0.35)"
                    : "rgba(26,40,104,0.4)",
                  border: settings.fontSize === fs.value
                    ? "1px solid rgba(44,93,169,0.5)"
                    : "1px solid rgba(200,218,249,0.06)",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {fs.label}
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Data">
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <DangerButton
            label="Clear browsing history"
            onClick={() => dispatch({ type: "CLEAR_HISTORY" })}
          />
          <DangerButton
            label="Clear downloads list"
            onClick={() => dispatch({ type: "CLEAR_DOWNLOADS" })}
          />
        </div>
      </Section>

      <Section title="Keyboard shortcuts">
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          {[
            ["Ctrl + T",       "New tab"],
            ["Ctrl + W",       "Close tab"],
            ["Ctrl + L",       "Focus address bar"],
            ["Ctrl + R",       "Reload"],
            ["Ctrl + Shift+N", "Incognito tab"],
            ["Alt + ←",        "Go back"],
            ["Alt + →",        "Go forward"],
            ["Ctrl + 1–8",     "Switch tab"],
          ].map(([key, desc]) => (
            <div
              key={key}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "3px 0",
              }}
            >
              <span style={{ fontSize: "11px", color: "rgba(200,218,249,0.35)" }}>{desc}</span>
              <code style={{
                fontSize: "10px",
                color: "rgba(200,218,249,0.6)",
                background: "rgba(44,93,169,0.2)",
                padding: "2px 7px",
                borderRadius: "5px",
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {key}
              </code>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{
        fontSize: "10px",
        color: "rgba(200,218,249,0.28)",
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        fontFamily: "'JetBrains Mono', monospace",
        marginBottom: "8px",
      }}>
        {title}
      </p>
      {children}
    </div>
  );
}

function Toggle({
  label, value, onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: "13px", color: "rgba(200,218,249,0.7)" }}>{label}</span>
      <button
        onClick={() => onChange(!value)}
        role="switch"
        aria-checked={value}
        style={{
          width: "38px",
          height: "22px",
          borderRadius: "11px",
          background: value ? "#2c5da9" : "rgba(26,40,104,0.9)",
          border: "1px solid rgba(200,218,249,0.1)",
          cursor: "pointer",
          position: "relative",
          transition: "background 0.2s",
          flexShrink: 0,
        }}
      >
        <span style={{
          position: "absolute",
          top: "3px",
          left: value ? "19px" : "3px",
          width: "14px",
          height: "14px",
          borderRadius: "50%",
          background: "#f4f8ff",
          transition: "left 0.2s",
        }} />
      </button>
    </div>
  );
}

function DangerButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "9px 12px",
        borderRadius: "10px",
        background: "rgba(239,68,68,0.08)",
        border: "1px solid rgba(239,68,68,0.18)",
        color: "rgba(252,165,165,0.75)",
        fontSize: "12px",
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.15s",
        fontFamily: "'DM Sans', sans-serif",
        width: "100%",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.18)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.08)";
      }}
    >
      {label}
    </button>
  );
}
