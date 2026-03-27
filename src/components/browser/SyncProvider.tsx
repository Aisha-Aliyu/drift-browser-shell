"use client";

import { useEffect } from "react";
import { useSyncData } from "@/hooks/useSyncData";
import { useBrowser } from "@/context/BrowserContext";

export default function SyncProvider() {
  const { setSyncCallbacks } = useBrowser();
  const { syncBookmark, removeBookmarkFromDB, syncHistory, clearHistoryFromDB } = useSyncData();

  useEffect(() => {
    setSyncCallbacks({ syncBookmark, removeBookmarkFromDB, syncHistory, clearHistoryFromDB });
  }, [setSyncCallbacks, syncBookmark, removeBookmarkFromDB, syncHistory, clearHistoryFromDB]);

  return null;
}