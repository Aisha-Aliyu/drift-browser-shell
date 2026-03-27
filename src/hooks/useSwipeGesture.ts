"use client";

import { useEffect, useRef } from "react";
import { useBrowser } from "@/context/BrowserContext";

const SWIPE_THRESHOLD = 60;  
const SWIPE_MAX_VERTICAL = 80; 
const SWIPE_VELOCITY = 0.3; 

export function useSwipeGesture(elementId: string) {
  const { activeTab, goBack, goForward } = useBrowser();
  const touch = useRef<{
    startX: number;
    startY: number;
    startTime: number;
  } | null>(null);

  useEffect(() => {
    const el = document.getElementById(elementId);
    if (!el) return;

    function onTouchStart(e: TouchEvent) {
      const t = e.touches[0];
      touch.current = {
        startX: t.clientX,
        startY: t.clientY,
        startTime: Date.now(),
      };
    }

    function onTouchEnd(e: TouchEvent) {
      if (!touch.current || !activeTab) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touch.current.startX;
      const dy = t.clientY - touch.current.startY;
      const dt = Date.now() - touch.current.startTime;
      const velocity = Math.abs(dx) / dt;

      touch.current = null;

      // Must be mostly horizontal
      if (Math.abs(dy) > SWIPE_MAX_VERTICAL) return;
      // Must travel enough distance
      if (Math.abs(dx) < SWIPE_THRESHOLD) return;
      // Must be fast enough
      if (velocity < SWIPE_VELOCITY) return;

      const fromLeft = e.changedTouches[0].clientX - dx < 28;
      const fromRight = window.innerWidth - (e.changedTouches[0].clientX - dx) < 28;

      if (dx > 0 && fromLeft) {
        goBack(activeTab.id);
      } else if (dx < 0 && fromRight) {
        goForward(activeTab.id);
      }
    }

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [elementId, activeTab, goBack, goForward]);
}
