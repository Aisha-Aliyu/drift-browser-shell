"use client";

import React, { useCallback, useState } from "react";
import { useBrowser } from "@/context/BrowserContext";
import { toDisplayUrl, getFaviconUrl, NEW_TAB_URL } from "@/lib/url";
import NewTabPage from "./NewTabPage";
import ErrorPage from "./ErrorPage";
import FindBar from "./FindBar";
import PageSkeleton from "./PageSkeleton";

export default function BrowserViewport() {
  const { state, dispatch, iframeRefs } = useBrowser();

  return (
    <div id="browser-viewport" className="relative flex-1 min-h-0 bg-drift-void">
      {state.tabs.map((tab) => {
        const isActive = tab.id === state.activeTabId;
        return (
          <div
            key={tab.id}
            style={{ display: isActive ? "flex" : "none" }}
            className="absolute inset-0 flex flex-col"
          >
            {tab.isLoading && <div className="load-bar" />}
            {tab.error && <ErrorPage tab={tab} />}
            {!tab.error && tab.url === NEW_TAB_URL && <NewTabPage />}
            {!tab.error && tab.url !== NEW_TAB_URL && (
              <IframeRenderer tabId={tab.id} url={tab.url} isLoading={tab.isLoading} />
            )}
            {isActive && <FindBar />}
          </div>
        );
      })}
    </div>
  );
}

function IframeRenderer({
  tabId,
  url,
  isLoading,
}: {
  tabId: string;
  url: string;
  isLoading: boolean;
}) {
  const { dispatch, iframeRefs } = useBrowser();
  const [iframeReady, setIframeReady] = useState(false);

  const handleLoad = useCallback(
    (e: React.SyntheticEvent<HTMLIFrameElement>) => {
      const iframe = e.currentTarget;
      let title = "Untitled";
      let currentUrl = url;
      let favicon: string | null = null;
      try {
        title = iframe.contentDocument?.title || toDisplayUrl(url) || "Untitled";
        currentUrl = iframe.contentWindow?.location.href || url;
        favicon = getFaviconUrl(currentUrl);
      } catch {
        favicon = getFaviconUrl(url);
      }
      setIframeReady(true);
      dispatch({ type: "TAB_LOADED", tabId, title, favicon });
      dispatch({
        type: "TAB_UPDATE_URL",
        tabId,
        url: currentUrl,
        displayUrl: toDisplayUrl(currentUrl),
      });
      dispatch({
        type: "ADD_HISTORY",
        entry: { url: currentUrl, title, favicon, tabId },
      });
    },
    [dispatch, tabId, url]
  );

  const handleError = useCallback(() => {
    setIframeReady(true);
    dispatch({
      type: "TAB_ERROR",
      tabId,
      error:
        "This page could not be loaded. It may have blocked embedding or the URL is unreachable.",
    });
  }, [dispatch, tabId]);

  return (
    <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
      {(!iframeReady || isLoading) && (
        <div style={{ position: "absolute", inset: 0, zIndex: 2 }}>
          <PageSkeleton />
        </div>
      )}
      <iframe
        ref={(el) => { iframeRefs.current[tabId] = el; }}
        src={url}
        title="Browser viewport"
        onLoad={handleLoad}
        onError={handleError}
        sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
        referrerPolicy="no-referrer-when-downgrade"
        loading="eager"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: "none",
          background: "white",
          opacity: iframeReady && !isLoading ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
      />
    </div>
  );
}
