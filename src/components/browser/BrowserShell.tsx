"use client";

import React from "react";
import TabStrip from "./TabStrip";
import AddressBar from "./AddressBar";
import BookmarkBar from "./BookmarkBar";
import BrowserViewport from "./BrowserViewport";
import Sidebar from "./Sidebar";
import DownloadTray from "./DownloadTray";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";

export default function BrowserShell() {
  useKeyboardShortcuts();
  useSwipeGesture("browser-viewport");

  return (
    <div
      className="flex flex-col bg-drift-void overflow-hidden"
      style={{ height: "100dvh", width: "100vw", position: "relative" }}
    >
      <TabStrip />
      <AddressBar />
      <BookmarkBar />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar />
        <BrowserViewport />
      </div>
      <DownloadTray />
    </div>
  );
}
