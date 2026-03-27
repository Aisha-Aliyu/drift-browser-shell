"use client";

import React, { useCallback, useState } from "react";
import { clsx } from "clsx";
import type { BrowserTab } from "@/types/browser";
import { useBrowser } from "@/context/BrowserContext";
import { IconClose, IconIncognito } from "@/components/icons/Icons";
import TabContextMenu from "./TabContextMenu";

interface TabProps {
  tab: BrowserTab;
  isActive: boolean;
}

export default function Tab({ tab, isActive }: TabProps) {
  const { dispatch } = useBrowser();
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number } | null>(null);

  const activate = useCallback(() => {
    dispatch({ type: "ACTIVATE_TAB", tabId: tab.id });
  }, [dispatch, tab.id]);

  const close = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: "CLOSE_TAB", tabId: tab.id });
  }, [dispatch, tab.id]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCtxMenu({ x: e.clientX, y: e.clientY });
  }, []);

  const label = tab.title.length > 16 ? tab.title.slice(0, 16) + "…" : tab.title;

  return (
    <>
      <div
        role="tab"
        aria-selected={isActive}
        tabIndex={0}
        onClick={activate}
        onContextMenu={handleContextMenu}
        onKeyDown={(e) => e.key === "Enter" && activate()}
        className={clsx(
          "group relative flex items-center gap-1.5 h-[30px] px-2.5",
          "min-w-[90px] max-w-[160px] rounded-t-lg cursor-pointer no-select",
          "transition-colors duration-150 flex-shrink-0",
          isActive
            ? "bg-drift-mid border border-b-0 border-white/[0.07] text-drift-white"
            : "bg-transparent text-drift-mist/55 hover:bg-drift-surface/50 hover:text-drift-mist"
        )}
      >
        {/* Incognito */}
        {tab.isIncognito && (
          <span
            style={{
              position: "absolute",
              top: "2px",
              right: "2px",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: "rgba(148,163,184,0.5)",
            }}
          />
        )}

        <span className="flex-shrink-0 w-3 h-3 flex items-center justify-center">
          {tab.isIncognito ? (
            <IconIncognito size={12} className="text-drift-sky" />
          ) : tab.isLoading ? (
            <span className="block w-2.5 h-2.5 rounded-full border border-drift-sky border-t-transparent animate-spinner" />
          ) : tab.favicon ? (
            <img
              src={tab.favicon}
              alt=""
              width={12}
              height={12}
              className="rounded-sm"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <span className="block w-1.5 h-1.5 rounded-full bg-drift-sky/50" />
          )}
        </span>

        <span className="flex-1 text-[11px] font-medium truncate leading-none">
          {label}
        </span>

        <button
          onClick={close}
          aria-label="Close tab"
          className={clsx(
            "flex-shrink-0 w-3.5 h-3.5 rounded flex items-center justify-center",
            "opacity-0 group-hover:opacity-100 transition-opacity",
            "hover:bg-drift-blue/40 text-drift-mist/60 hover:text-white",
            isActive && "opacity-50"
          )}
        >
          <IconClose size={9} strokeWidth={2.5} />
        </button>
      </div>

      {ctxMenu && (
        <TabContextMenu
          tabId={tab.id}
          x={ctxMenu.x}
          y={ctxMenu.y}
          onClose={() => setCtxMenu(null)}
        />
      )}
    </>
  );
}
