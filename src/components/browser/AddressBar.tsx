"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { clsx } from "clsx";
import { useBrowser } from "@/context/BrowserContext";
import {
  IconBack, IconForward, IconReload, IconStop,
  IconHome, IconLock, IconUnlock, IconSearch,
  IconBookmark, IconSettings,
} from "@/components/icons/Icons";
import { isSecure, toDisplayUrl, NEW_TAB_URL } from "@/lib/url";
import SettingsPanel from "./SettingsPanel";
import { useToast } from "@/components/ui/Toast";

export default function AddressBar() {
  const { state, dispatch, navigate, goBack, goForward, reload, activeTab } = useBrowser();
  const toast = useToast();
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isFocused && activeTab) {
      setInputValue(activeTab.displayUrl || "");
    }
  }, [activeTab?.id, activeTab?.displayUrl, isFocused]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
    }
    if (showSettings) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showSettings]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    if (activeTab) {
      const val = activeTab.url === NEW_TAB_URL ? "" : activeTab.url;
      setInputValue(val);
      setTimeout(() => inputRef.current?.select(), 10);
    }
  }, [activeTab]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    if (activeTab) setInputValue(activeTab.displayUrl || "");
  }, [activeTab]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && activeTab) {
        e.currentTarget.blur();
        navigate(activeTab.id, inputValue);
      }
      if (e.key === "Escape") {
        e.currentTarget.blur();
        setInputValue(activeTab?.displayUrl || "");
      }
    },
    [navigate, activeTab, inputValue]
  );

  const handleHome = useCallback(() => {
    if (!activeTab) return;
    navigate(activeTab.id, "https://duckduckgo.com");
  }, [navigate, activeTab]);

  const copyUrl = useCallback(() => {
    if (!activeTab || activeTab.url === NEW_TAB_URL) return;
    navigator.clipboard.writeText(activeTab.url).then(() => {
      toast("URL copied to clipboard", "success");
    }).catch(() => {
      toast("Could not copy URL", "error");
    });
  }, [activeTab, toast]);

  const isBookmarked = activeTab
    ? state.bookmarks.some((b) => b.url === activeTab.url)
    : false;

  const toggleBookmark = useCallback(() => {
    if (!activeTab || activeTab.url === NEW_TAB_URL) return;
    if (isBookmarked) {
      const bm = state.bookmarks.find((b) => b.url === activeTab.url);
      if (bm) {
        dispatch({ type: "REMOVE_BOOKMARK", id: bm.id });
        toast("Bookmark removed", "info");
      }
    } else {
      dispatch({
        type: "ADD_BOOKMARK",
        url: activeTab.url,
        title: activeTab.title,
        favicon: activeTab.favicon,
      });
      toast("Bookmark saved", "success");
    }
  }, [activeTab, isBookmarked, state.bookmarks, dispatch, toast]);

  const secure = activeTab ? isSecure(activeTab.url) : false;
  const isLoading = activeTab?.isLoading ?? false;
  const canGoBack = activeTab?.canGoBack ?? false;
  const isNewTab = !activeTab || activeTab.url === NEW_TAB_URL;

  return (
    <div className="url-bar-bg flex items-center gap-1 px-2 py-2" style={{ position: "relative" }}>
      {/* Nav buttons */}
      <div className="flex items-center gap-0.5 flex-shrink-0">
        <NavBtn onClick={() => activeTab && goBack(activeTab.id)} disabled={!canGoBack} label="Back" title="Back">
          <IconBack size={14} />
        </NavBtn>
        <NavBtn onClick={() => activeTab && goForward(activeTab.id)} disabled={false} label="Forward" title="Forward">
          <IconForward size={14} />
        </NavBtn>
        <NavBtn
          onClick={() => activeTab && (isLoading ? null : reload(activeTab.id))}
          disabled={false}
          label={isLoading ? "Stop" : "Reload"}
          title={isLoading ? "Stop" : "Reload"}
        >
          {isLoading ? <IconStop size={14} /> : <IconReload size={14} />}
        </NavBtn>
        <NavBtn onClick={handleHome} disabled={false} label="Home" title="Home">
          <IconHome size={14} />
        </NavBtn>
      </div>

      {/* URL input */}
      <div
        className={clsx(
          "flex-1 flex items-center gap-2 h-9 px-3 rounded-xl min-w-0 transition-all duration-200 glass-light",
          isFocused
            ? "border-drift-blue/50 shadow-drift-url bg-drift-surface/60"
            : "hover:border-white/[0.15]"
        )}
      >
        {/* Security icon */}
        <button
          onClick={copyUrl}
          disabled={isNewTab}
          title={
            secure
              ? "Secure connection; click to copy URL"
              : isNewTab
              ? ""
              : "Not secure. click to copy URL"
          }
          aria-label="Copy URL"
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: isNewTab ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
          className={clsx(
            "transition-colors duration-150",
            secure
              ? "text-emerald-400/80 hover:text-emerald-300"
              : isNewTab
              ? "text-drift-sky/50"
              : "text-amber-400/70 hover:text-amber-300"
          )}
        >
          {isNewTab
            ? <IconSearch size={13} />
            : secure
            ? <IconLock size={13} />
            : <IconUnlock size={13} />}
        </button>

        <input
          ref={inputRef}
          type="text"
          value={isFocused ? inputValue : (isNewTab ? "" : inputValue)}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="Search or enter URL"
          aria-label="Address bar"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className="flex-1 bg-transparent text-drift-white text-[13px] font-mono placeholder:text-drift-mist/25 outline-none border-none min-w-0"
        />
      </div>

      {/* Bookmark */}
      <button
        onClick={toggleBookmark}
        aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this page"}
        title={isBookmarked ? "Remove bookmark" : "Bookmark this page"}
        disabled={isNewTab}
        className={clsx(
          "flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150",
          "disabled:opacity-25 disabled:cursor-not-allowed",
          isBookmarked
            ? "text-drift-sky hover:text-drift-mist"
            : "text-drift-mist/35 hover:text-drift-mist hover:bg-drift-surface"
        )}
      >
        <IconBookmark size={14} filled={isBookmarked} />
      </button>

      {/* Settings */}
      <div ref={settingsRef} style={{ position: "relative" }}>
        <button
          onClick={() => setShowSettings((v) => !v)}
          aria-label="Settings"
          title="Settings"
          className={clsx(
            "flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150",
            showSettings
              ? "bg-drift-lift text-drift-mist"
              : "text-drift-mist/35 hover:text-drift-mist hover:bg-drift-surface"
          )}
        >
          <IconSettings size={14} />
        </button>
        {showSettings && <SettingsPanel />}
      </div>
    </div>
  );
}

function NavBtn({
  children, onClick, disabled, label, title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  label: string;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={title}
      className={clsx(
        "w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-100",
        "text-drift-mist/45 hover:text-drift-mist hover:bg-drift-surface",
        "disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-transparent"
      )}
    >
      {children}
    </button>
  );
}
