"use client";

import React, { useEffect, useRef } from "react";
import { useBrowser } from "@/context/BrowserContext";
import type { TabId } from "@/types/browser";

interface Props {
  tabId: TabId;
  x: number;
  y: number;
  onClose: () => void;
}

export default function TabContextMenu({ tabId, x, y, onClose }: Props) {
  const { state, dispatch, navigate } = useBrowser();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent | KeyboardEvent) {
      if (e instanceof KeyboardEvent && e.key === "Escape") {
        onClose();
        return;
      }
      if (
        e instanceof MouseEvent &&
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", handler);
    };
  }, [onClose]);

  const tab = state.tabs.find((t) => t.id === tabId);
  if (!tab) return null;

  const actions: { label: string; danger?: boolean; action: () => void }[] = [
    {
      label: "Duplicate tab",
      action: () => {
        dispatch({ type: "NEW_TAB" });
        const newTab = state.tabs[state.tabs.length - 1];
        if (newTab && tab.url) navigate(newTab.id, tab.url);
        onClose();
      },
    },
    {
      label: "New tab to the right",
      action: () => {
        dispatch({ type: "NEW_TAB" });
        onClose();
      },
    },
    {
      label: tab.isIncognito ? "Regular tab" : "Reopen as incognito",
      action: () => {
        dispatch({ type: "NEW_TAB", incognito: !tab.isIncognito });
        const newId = state.tabs[state.tabs.length - 1]?.id;
        if (newId && tab.url) navigate(newId, tab.url);
        onClose();
      },
    },
    { label: "divider", action: () => {} },
    {
      label: "Reload tab",
      action: () => {
        dispatch({ type: "TAB_LOADING", tabId });
        onClose();
      },
    },
    { label: "divider", action: () => {} },
    {
      label: "Close other tabs",
      danger: true,
      action: () => {
        state.tabs
          .filter((t) => t.id !== tabId)
          .forEach((t) => dispatch({ type: "CLOSE_TAB", tabId: t.id }));
        onClose();
      },
    },
    {
      label: "Close tab",
      danger: true,
      action: () => {
        dispatch({ type: "CLOSE_TAB", tabId });
        onClose();
      },
    },
  ];

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        top: y,
        left: x,
        zIndex: 200,
        background: "rgba(13,19,71,0.98)",
        border: "1px solid rgba(200,218,249,0.12)",
        borderRadius: "12px",
        padding: "6px",
        minWidth: "200px",
        boxShadow: "0 12px 40px rgba(10,15,60,0.8)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {actions.map((item, i) =>
        item.label === "divider" ? (
          <div
            key={i}
            style={{
              height: "1px",
              background: "rgba(200,218,249,0.06)",
              margin: "4px 0",
            }}
          />
        ) : (
          <button
            key={item.label}
            onClick={item.action}
            style={{
              display: "block",
              width: "100%",
              padding: "8px 12px",
              borderRadius: "8px",
              background: "transparent",
              border: "none",
              color: item.danger
                ? "rgba(252,165,165,0.8)"
                : "rgba(200,218,249,0.75)",
              fontSize: "12px",
              cursor: "pointer",
              textAlign: "left",
              transition: "background 0.1s",
              fontFamily: "'DM Sans', sans-serif",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = item.danger
                ? "rgba(239,68,68,0.12)"
                : "rgba(44,93,169,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }}
          >
            {item.label}
          </button>
        )
      )}
    </div>
  );
}
