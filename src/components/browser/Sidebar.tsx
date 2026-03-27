"use client";

import React, { useCallback } from "react";
import { clsx } from "clsx";
import { useBrowser } from "@/context/BrowserContext";
import { IconClose, IconHistory, IconBookmark } from "@/components/icons/Icons";
import { useToast } from "@/components/ui/Toast";

export default function Sidebar() {
  const { state, dispatch, navigate } = useBrowser();
  const toast = useToast();

  const close = useCallback(() => dispatch({ type: "CLOSE_SIDEBAR" }), [dispatch]);
  const switchView = useCallback(
    (view: "history" | "bookmarks") => dispatch({ type: "TOGGLE_SIDEBAR", view }),
    [dispatch]
  );
  const goTo = useCallback(
    (url: string) => {
      if (!state.activeTabId) return;
      navigate(state.activeTabId, url);
      dispatch({ type: "CLOSE_SIDEBAR" });
    },
    [navigate, state.activeTabId, dispatch]
  );

  if (!state.sidebarOpen) return null;

  const isHistory = state.sidebarView === "history";

  return (
    <div
      className="flex-shrink-0 flex flex-col glass border-r border-white/[0.06] overflow-hidden"
      style={{ width: "min(260px, 85vw)", animation: "slideDown 0.2s cubic-bezier(0.16,1,0.3,1)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/[0.05]">
        <div className="flex items-center gap-0.5">
          <ViewBtn active={isHistory} onClick={() => switchView("history")} icon={<IconHistory size={12} />} label="History" />
          <ViewBtn active={!isHistory} onClick={() => switchView("bookmarks")} icon={<IconBookmark size={12} />} label="Bookmarks" />
        </div>
        <button
          onClick={close}
          aria-label="Close"
          className="w-6 h-6 flex items-center justify-center rounded-md text-drift-mist/35 hover:text-drift-mist hover:bg-drift-surface transition-all"
        >
          <IconClose size={11} strokeWidth={2.5} />
        </button>
      </div>

      {/* Clear row */}
      {isHistory && state.history.length > 0 && (
        <div className="flex justify-end px-3 py-1.5 border-b border-white/[0.03]">
          <button
            onClick={() => {
              dispatch({ type: "CLEAR_HISTORY" });
              toast("History cleared", "info");
            }}
            className="text-[10px] text-drift-mist/25 hover:text-drift-mist/55 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto py-1">
        {isHistory ? (
          state.history.length === 0 ? (
            <EmptyState
              icon={
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(200,218,249,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v6h6" />
                  <path d="M3.05 13A9 9 0 1 0 6 5.3L3 3" />
                  <path d="M12 7v5l4 2" />
                </svg>
              }
              label="No history yet"
              sub="Pages you visit will appear here"
            />
          ) : (
            state.history.map((entry) => (
              <SidebarItem
                key={entry.id}
                favicon={entry.favicon}
                title={entry.title || entry.url}
                sub={entry.url}
                meta={new Date(entry.visitedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                onClick={() => goTo(entry.url)}
              />
            ))
          )
        ) : state.bookmarks.length === 0 ? (
          <EmptyState
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(200,218,249,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            }
            label="No bookmarks yet"
            sub="Click the bookmark icon in the address bar to save a page"
          />
        ) : (
          state.bookmarks.map((bm) => (
            <SidebarItem
              key={bm.id}
              favicon={bm.favicon}
              title={bm.title || bm.url}
              sub={bm.url}
              onClick={() => goTo(bm.url)}
              onRemove={() => {
                dispatch({ type: "REMOVE_BOOKMARK", id: bm.id });
                toast("Bookmark removed", "info");
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

function ViewBtn({
  active, onClick, icon, label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-150",
        active ? "bg-drift-blue/25 text-drift-white" : "text-drift-mist/40 hover:text-drift-mist"
      )}
    >
      {icon}{label}
    </button>
  );
}

function SidebarItem({
  favicon, title, sub, meta, onClick, onRemove,
}: {
  favicon: string | null;
  title: string;
  sub: string;
  meta?: string;
  onClick: () => void;
  onRemove?: () => void;
}) {
  return (
    <div className="group flex items-center gap-2 px-3 py-2 hover:bg-drift-surface/40 transition-colors cursor-pointer">
      <div className="flex-shrink-0 w-3.5 h-3.5 flex items-center justify-center" onClick={onClick}>
        {favicon
          ? <img src={favicon} alt="" width={13} height={13} className="rounded-sm opacity-65 group-hover:opacity-100" />
          : <span className="block w-1.5 h-1.5 rounded-full bg-drift-sky/40" />}
      </div>
      <div className="flex-1 min-w-0" onClick={onClick}>
        <p className="text-[11px] text-drift-mist/75 truncate group-hover:text-white transition-colors">{title}</p>
        <p className="text-[9px] text-drift-mist/25 truncate font-mono mt-0.5">
          {sub.replace(/^https?:\/\//, "").slice(0, 36)}
        </p>
      </div>
      {meta && (
        <span className="text-[9px] text-drift-mist/20 font-mono flex-shrink-0">{meta}</span>
      )}
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          aria-label="Remove"
          className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded text-drift-mist/30 hover:text-drift-mist hover:bg-drift-lift transition-all"
        >
          <IconClose size={9} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}

function EmptyState({
  icon, label, sub,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
}) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      gap: "10px",
      textAlign: "center",
    }}>
      {icon}
      <p style={{ fontSize: "12px", color: "rgba(200,218,249,0.35)", fontFamily: "'DM Sans', sans-serif" }}>
        {label}
      </p>
      <p style={{ fontSize: "10px", color: "rgba(200,218,249,0.18)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
        {sub}
      </p>
    </div>
  );
}
