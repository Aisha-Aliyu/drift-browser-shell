"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { useBrowser } from "@/context/BrowserContext";
import { IconClose } from "@/components/icons/Icons";

export default function FindBar() {
  const { activeTab, iframeRefs } = useBrowser();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ current: 0, total: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        setOpen((v) => !v);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === "Escape") {
        setOpen(false);
        clearHighlights();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Refocus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 60);
    }
  }, [open]);

  function clearHighlights() {
    if (!activeTab) return;
    const iframe = iframeRefs.current[activeTab.id];
    try {
      iframe?.contentWindow?.getSelection()?.removeAllRanges();
    } catch { /* cross-origin */ }
    setResults({ current: 0, total: 0 });
    setQuery("");
  }

  function close() {
    setOpen(false);
    clearHighlights();
  }

  const search = useCallback(
    (text: string, direction: "next" | "prev" = "next") => {
      if (!activeTab || !text.trim()) {
        setResults({ current: 0, total: 0 });
        return;
      }
      const iframe = iframeRefs.current[activeTab.id];
      try {
        const win = iframe?.contentWindow;
        if (!win) return;
        // Use browser's native find API
        const found = (win as Window & { find?: (s: string, cs?: boolean, bk?: boolean) => boolean })
          .find?.(text, false, direction === "prev");
        if (found !== undefined) {
          setResults((r) => ({
            current: found ? (direction === "next" ? r.current + 1 : Math.max(1, r.current - 1)) : 0,
            total: found ? Math.max(r.total, r.current + 1) : 0,
          }));
        }
      } catch {
        // Cross origin iframe shows a helpful notice instead of crashing
        setResults({ current: -1, total: -1 });
      }
    },
    [activeTab, iframeRefs]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setQuery(val);
      if (val.trim()) {
        setResults({ current: 0, total: 0 });
        search(val, "next");
      } else {
        clearHighlights();
      }
    },
    [search]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.shiftKey ? search(query, "prev") : search(query, "next");
      }
      if (e.key === "Escape") close();
    },
    [query, search]
  );

  if (!open) return null;

  const isCrossOrigin = results.total === -1;

  return (
    <div
      style={{
        position: "absolute",
        top: "8px",
        right: "12px",
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 12px",
        borderRadius: "14px",
        background: "rgba(13,19,71,0.97)",
        border: "1px solid rgba(200,218,249,0.12)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(10,15,60,0.7)",
        fontFamily: "'DM Sans', sans-serif",
        minWidth: "min(300px, 90vw)",
      }}
    >
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Find in page..."
        aria-label="Find in page"
        spellCheck={false}
        style={{
          flex: 1,
          background: "rgba(26,40,104,0.7)",
          border: "1px solid rgba(200,218,249,0.1)",
          borderRadius: "8px",
          padding: "6px 10px",
          color: "#f4f8ff",
          fontSize: "13px",
          fontFamily: "'DM Sans', sans-serif",
          outline: "none",
          minWidth: 0,
        }}
      />

      {/* Result count */}
      <span style={{
        fontSize: "11px",
        color: isCrossOrigin ? "rgba(251,191,36,0.7)" : "rgba(200,218,249,0.4)",
        whiteSpace: "nowrap",
        fontFamily: "'JetBrains Mono', monospace",
        flexShrink: 0,
      }}>
        {isCrossOrigin
          ? "cross-origin"
          : query.trim()
          ? results.total === 0
            ? "no results"
            : `${results.current} / ${results.total}`
          : ""}
      </span>

      {/* Prev */}
      <button
        onClick={() => search(query, "prev")}
        aria-label="Previous result"
        style={navBtnStyle}
        title="Previous (Shift+Enter)"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>

      {/* Next */}
      <button
        onClick={() => search(query, "next")}
        aria-label="Next result"
        style={navBtnStyle}
        title="Next (Enter)"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Close */}
      <button
        onClick={close}
        aria-label="Close find bar"
        style={{ ...navBtnStyle, marginLeft: "2px" }}
      >
        <IconClose size={11} strokeWidth={2.5} />
      </button>
    </div>
  );
}

const navBtnStyle: React.CSSProperties = {
  width: "26px",
  height: "26px",
  borderRadius: "7px",
  background: "rgba(44,93,169,0.2)",
  border: "1px solid rgba(200,218,249,0.08)",
  color: "rgba(200,218,249,0.6)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  transition: "background 0.15s",
};
