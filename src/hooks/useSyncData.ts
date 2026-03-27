"use client";

import { useEffect, useCallback, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useBrowser } from "@/context/BrowserContext";
import type { Bookmark, HistoryEntry } from "@/types/browser";
import { v4 as uuid } from "uuid";

async function fetchWithTimeout(url: string, options: RequestInit = {}, ms = 8000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timeout);
  }
}

export function useSyncData() {
  const { isSignedIn, isLoaded } = useUser();
  const { state, dispatch } = useBrowser();
  const lastSyncedBookmarks = useRef<string>("");
  const lastSyncedHistory = useRef<string>("");
  const isSyncing = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    async function loadFromDB() {
      try {
        const [bmRes, histRes] = await Promise.all([
          fetchWithTimeout("/api/bookmarks"),
          fetchWithTimeout("/api/history?limit=100"),
        ]);

        if (bmRes.ok) {
          const { bookmarks } = await bmRes.json() as { bookmarks: Array<{
            id: string; url: string; title: string; favicon: string | null; createdAt: string;
          }> };

          // Replace local bookmarks with DB state
          const mapped: Bookmark[] = bookmarks.map((b) => ({
            id: b.id,
            url: b.url,
            title: b.title,
            favicon: b.favicon,
            createdAt: new Date(b.createdAt).getTime(),
            folderId: null,
          }));

          mapped.forEach((bm) => {
            dispatch({ type: "ADD_BOOKMARK", url: bm.url, title: bm.title, favicon: bm.favicon });
          });
        }

        if (histRes.ok) {
          const { entries } = await histRes.json() as { entries: Array<{
            id: string; url: string; title: string; favicon: string | null;
            visitedAt: string; tabId?: string;
          }> };

          entries.forEach((e) => {
            dispatch({
              type: "ADD_HISTORY",
              entry: {
                url: e.url,
                title: e.title,
                favicon: e.favicon,
                tabId: e.tabId ?? "db",
              },
            });
          });
        }
      } catch (err) {
        console.warn("[DRIFT] Could not load data from DB:", err);
      }
    }

    loadFromDB();
  }, [isLoaded, isSignedIn, dispatch]);

  // ── Persist new bookmarks to DB ─────────
  const syncBookmark = useCallback(
    async (url: string, title: string, favicon: string | null) => {
      if (!isSignedIn) return;
      try {
        await fetchWithTimeout("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, title, favicon }),
        });
      } catch {
        console.warn("[DRIFT] Bookmark sync failed");
      }
    },
    [isSignedIn]
  );

  const removeBookmarkFromDB = useCallback(
    async (id: string) => {
      if (!isSignedIn) return;
      try {
        await fetchWithTimeout(`/api/bookmarks?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
        });
      } catch {
        console.warn("[DRIFT] Bookmark delete sync failed");
      }
    },
    [isSignedIn]
  );

  const syncHistory = useCallback(
    async (url: string, title: string, favicon: string | null) => {
      if (!isSignedIn) return;
      try {
        await fetchWithTimeout("/api/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, title, favicon }),
        });
      } catch {
        console.warn("[DRIFT] History sync failed");
      }
    },
    [isSignedIn]
  );

  const clearHistoryFromDB = useCallback(async () => {
    if (!isSignedIn) return;
    try {
      await fetchWithTimeout("/api/history", { method: "DELETE" });
    } catch {
      console.warn("[DRIFT] History clear failed");
    }
  }, [isSignedIn]);

  return { syncBookmark, removeBookmarkFromDB, syncHistory, clearHistoryFromDB };
}