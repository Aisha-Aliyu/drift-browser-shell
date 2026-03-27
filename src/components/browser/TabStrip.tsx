"use client";

import React, { useCallback } from "react";
import { useBrowser } from "@/context/BrowserContext";
import Tab from "./Tab";
import UserMenu from "./UserMenu";
import {
  IconPlus, IconIncognito, IconHistory, IconBookmark, IconDriftLogo,
} from "@/components/icons/Icons";
import { clsx } from "clsx";

export default function TabStrip() {
  const { state, dispatch } = useBrowser();

  const newTab        = useCallback(() => dispatch({ type: "NEW_TAB" }), [dispatch]);
  const newIncognito  = useCallback(() => dispatch({ type: "NEW_TAB", incognito: true }), [dispatch]);
  const toggleHistory   = useCallback(() => dispatch({ type: "TOGGLE_SIDEBAR", view: "history" }), [dispatch]);
  const toggleBookmarks = useCallback(() => dispatch({ type: "TOGGLE_SIDEBAR", view: "bookmarks" }), [dispatch]);

  return (
    <div className="tab-strip-bg flex items-center px-1.5 pt-1.5 pb-0 min-h-[42px] gap-1">
      {/* Logo */}
      <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 mb-0.5">
        <IconDriftLogo size={22} />
      </div>

      {/* Scrollable tabs */}
      <div className="tab-scroll pb-0 mb-0">
        {state.tabs.map((tab) => (
          <Tab key={tab.id} tab={tab} isActive={tab.id === state.activeTabId} />
        ))}
      </div>

      {/* Right controls */}
      <div className="flex-shrink-0 flex items-center gap-0.5 mb-0.5">
        <StripBtn onClick={newTab} label="New tab" title="New Tab">
          <IconPlus size={13} strokeWidth={2.2} />
        </StripBtn>
        <StripBtn onClick={newIncognito} label="Incognito" title="Incognito">
          <IconIncognito size={13} strokeWidth={2} />
        </StripBtn>

        <div className="w-px h-3.5 bg-white/[0.08] mx-0.5" />

        <StripBtn
          onClick={toggleBookmarks}
          label="Bookmarks"
          title="Bookmarks"
          active={state.sidebarOpen && state.sidebarView === "bookmarks"}
        >
          <IconBookmark size={13} strokeWidth={2} />
        </StripBtn>
        <StripBtn
          onClick={toggleHistory}
          label="History"
          title="History"
          active={state.sidebarOpen && state.sidebarView === "history"}
        >
          <IconHistory size={13} strokeWidth={2} />
        </StripBtn>

        <div className="w-px h-3.5 bg-white/[0.08] mx-0.5" />

        <div className="flex items-center justify-center w-7 h-7">
          <UserMenu />
        </div>
      </div>
    </div>
  );
}

function StripBtn({ children, onClick, label, title, active }: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  title: string;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={title}
      className={clsx(
        "w-7 h-7 rounded-md flex items-center justify-center transition-all duration-100",
        "text-drift-mist/45 hover:text-drift-mist hover:bg-drift-surface",
        active && "bg-drift-lift/80 text-drift-mist"
      )}
    >
      {children}
    </button>
  );
}