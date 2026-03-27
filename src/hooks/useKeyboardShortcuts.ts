"use client";

import { useEffect } from "react";
import { useBrowser } from "@/context/BrowserContext";

export function useKeyboardShortcuts() {
  const { state, dispatch, navigate, goBack, goForward, reload, activeTab } =
    useBrowser();

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const ctrl = e.ctrlKey || e.metaKey;

      // Ctrl T: new tab
      if (ctrl && e.key === "t") {
        e.preventDefault();
        dispatch({ type: "NEW_TAB" });
        return;
      }

      // Ctrl W: close active tab
      if (ctrl && e.key === "w") {
        e.preventDefault();
        if (state.activeTabId) {
          dispatch({ type: "CLOSE_TAB", tabId: state.activeTabId });
        }
        return;
      }

      // Ctrl L: focus address bar
      if (ctrl && e.key === "l") {
        e.preventDefault();
        const input = document.querySelector<HTMLInputElement>(
          '[aria-label="Address bar"]'
        );
        input?.focus();
        input?.select();
        return;
      }

      // Ctrl R: reload
      if (ctrl && e.key === "r") {
        e.preventDefault();
        if (activeTab) reload(activeTab.id);
        return;
      }

      // Ctrl Shift N: new incognito tab
      if (ctrl && e.shiftKey && e.key === "N") {
        e.preventDefault();
        dispatch({ type: "NEW_TAB", incognito: true });
        return;
      }

      // Alt Left: go back
      if (e.altKey && e.key === "ArrowLeft") {
        e.preventDefault();
        if (activeTab) goBack(activeTab.id);
        return;
      }

      // Alt Right: go forward
      if (e.altKey && e.key === "ArrowRight") {
        e.preventDefault();
        if (activeTab) goForward(activeTab.id);
        return;
      }

      // Ctrl 1: through Ctrl 8: switch to tab by index
      if (ctrl && e.key >= "1" && e.key <= "8") {
        e.preventDefault();
        const idx = parseInt(e.key, 10) - 1;
        const tab = state.tabs[idx];
        if (tab) dispatch({ type: "ACTIVATE_TAB", tabId: tab.id });
        return;
      }

      // Ctrl 9: switch to last tab
      if (ctrl && e.key === "9") {
        e.preventDefault();
        const last = state.tabs[state.tabs.length - 1];
        if (last) dispatch({ type: "ACTIVATE_TAB", tabId: last.id });
        return;
      }

      // Ctrl F handled by FindBar directly
if (ctrl && e.key === "f") {
  e.preventDefault();
  return;
}

    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [state.activeTabId, state.tabs, dispatch, navigate, goBack, goForward, reload, activeTab]);
}
