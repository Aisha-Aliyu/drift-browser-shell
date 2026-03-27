"use client";

import React, {
  createContext, useContext, useReducer,
  useCallback, useMemo, useRef,
} from "react";
import type { BrowserState, BrowserAction, TabId } from "@/types/browser";
import { browserReducer, makeInitialState } from "@/lib/browserReducer";
import { resolveInput, toDisplayUrl, getFaviconUrl, NEW_TAB_URL } from "@/lib/url";

interface IframeRefs {
  [tabId: TabId]: HTMLIFrameElement | null;
}

type SyncCallbacks = {
  syncBookmark?: (url: string, title: string, favicon: string | null) => void;
  removeBookmarkFromDB?: (id: string) => void;
  syncHistory?: (url: string, title: string, favicon: string | null) => void;
  clearHistoryFromDB?: () => void;
};

interface BrowserContextValue {
  state: BrowserState;
  dispatch: React.Dispatch<BrowserAction>;
  iframeRefs: React.MutableRefObject<IframeRefs>;
  navigate: (tabId: TabId, rawInput: string) => void;
  goBack: (tabId: TabId) => void;
  goForward: (tabId: TabId) => void;
  reload: (tabId: TabId) => void;
  activeTab: BrowserState["tabs"][0] | undefined;
  setSyncCallbacks: (cb: SyncCallbacks) => void;
}

const BrowserContext = createContext<BrowserContextValue | null>(null);

export function BrowserProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(browserReducer, undefined, makeInitialState);
  const iframeRefs = useRef<IframeRefs>({});
  const syncCallbacks = useRef<SyncCallbacks>({});

  const setSyncCallbacks = useCallback((cb: SyncCallbacks) => {
    syncCallbacks.current = cb;
  }, []);

  const navigate = useCallback(
    (tabId: TabId, rawInput: string) => {
      const url = resolveInput(rawInput);
      const displayUrl = toDisplayUrl(url);
      const favicon = getFaviconUrl(url);
      dispatch({ type: "NAVIGATE", tabId, url });
      dispatch({ type: "TAB_UPDATE_URL", tabId, url, displayUrl });
    },
    []
  );

  const goBack = useCallback((tabId: TabId) => {
    const iframe = iframeRefs.current[tabId];
    try { iframe?.contentWindow?.history.back(); } catch { /* cross-origin */ }
    dispatch({ type: "TAB_GO_BACK", tabId });
  }, []);

  const goForward = useCallback((tabId: TabId) => {
    const iframe = iframeRefs.current[tabId];
    try { iframe?.contentWindow?.history.forward(); } catch { /* cross-origin */ }
    dispatch({ type: "TAB_GO_FORWARD", tabId });
  }, []);

  const reload = useCallback((tabId: TabId) => {
    const iframe = iframeRefs.current[tabId];
    try {
      iframe?.contentWindow?.location.reload();
    } catch {
      const tab = state.tabs.find((t) => t.id === tabId);
      if (tab && iframe) iframe.src = tab.url;
    }
    dispatch({ type: "TAB_LOADING", tabId });
  }, [state.tabs]);

  const activeTab = useMemo(
    () => state.tabs.find((t) => t.id === state.activeTabId),
    [state.tabs, state.activeTabId]
  );

  const value = useMemo(
    () => ({
      state, dispatch, iframeRefs,
      navigate, goBack, goForward, reload,
      activeTab, setSyncCallbacks,
    }),
    [state, navigate, goBack, goForward, reload, activeTab, setSyncCallbacks]
  );

  return (
    <BrowserContext.Provider value={value}>
      {children}
    </BrowserContext.Provider>
  );
}

export function useBrowser() {
  const ctx = useContext(BrowserContext);
  if (!ctx) throw new Error("useBrowser must be used inside BrowserProvider");
  return ctx;
}
