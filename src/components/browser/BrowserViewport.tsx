"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useBrowser } from "@/context/BrowserContext";
import { toDisplayUrl, getFaviconUrl, extractHostname, NEW_TAB_URL } from "@/lib/url";
import { canShowInFrame, needsFrameCheck } from "@/lib/frameCheck";
import NewTabPage from "./NewTabPage";
import ErrorPage from "./ErrorPage";
import BlockedPage from "./BlockedPage";
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

type FrameStatus = "checking" | "ok" | "blocked";

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
  const [frameCheck, setFrameCheck] = useState<{ url: string; embeddable: boolean } | null>(null);

  // Sites that refuse to be framed load as a blank page, so ask the server before loading them
  const checkNeeded = needsFrameCheck(url);
  let status: FrameStatus = "ok";
  if (checkNeeded) {
    if (!frameCheck || frameCheck.url !== url) status = "checking";
    else if (!frameCheck.embeddable) status = "blocked";
  }

  useEffect(() => {
    if (!checkNeeded) return;
    let cancelled = false;
    canShowInFrame(url).then((embeddable) => {
      if (!cancelled) setFrameCheck({ url, embeddable });
    });
    return () => {
      cancelled = true;
    };
  }, [url, checkNeeded]);

  // The blocked page stands in for the site, so finish loading and record the visit
  useEffect(() => {
    if (status !== "blocked" || !isLoading) return;
    const title = extractHostname(url) || "Untitled";
    const favicon = getFaviconUrl(url) || null;
    dispatch({ type: "TAB_LOADED", tabId, title, favicon });
    dispatch({ type: "ADD_HISTORY", entry: { url, title, favicon, tabId } });
  }, [status, isLoading, url, tabId, dispatch]);

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

  if (status === "blocked") {
    return <BlockedPage tabId={tabId} url={url} />;
  }

  return (
    <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
      {(status === "checking" || !iframeReady || isLoading) && (
        <div style={{ position: "absolute", inset: 0, zIndex: 2 }}>
          <PageSkeleton />
        </div>
      )}
      {status === "ok" && (
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
      )}
    </div>
  );
}
