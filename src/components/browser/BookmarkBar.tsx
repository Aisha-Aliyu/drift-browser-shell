"use client";

import React, { useCallback } from "react";
import { useBrowser } from "@/context/BrowserContext";

export default function BookmarkBar() {
  const { state, navigate } = useBrowser();

  const goTo = useCallback(
    (url: string) => {
      if (!state.activeTabId) return;
      navigate(state.activeTabId, url);
    },
    [navigate, state.activeTabId]
  );

  if (!state.showBookmarkBar || state.bookmarks.length === 0) return null;

  return (
    <div
      className="flex items-center gap-0.5 px-3 py-0.5 overflow-x-auto no-select"
      style={{
        background: "linear-gradient(180deg, #0d1347 0%, #0a0f3c 100%)",
        borderBottom: "1px solid rgba(200,218,249,0.04)",
        minHeight: "28px",
      }}
    >
      {state.bookmarks.map((bm) => (
        <button
          key={bm.id}
          onClick={() => goTo(bm.url)}
          title={bm.url}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] text-drift-mist/50 hover:text-drift-mist hover:bg-drift-surface/60 transition-all whitespace-nowrap max-w-[140px] font-sans"
        >
          {bm.favicon && (
            <img
              src={bm.favicon}
              alt=""
              width={12}
              height={12}
              className="rounded-sm flex-shrink-0 opacity-70"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          )}
          <span className="truncate">{bm.title || bm.url}</span>
        </button>
      ))}
    </div>
  );
}