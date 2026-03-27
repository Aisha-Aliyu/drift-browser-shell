"use client";

import React, { createContext, useContext, useCallback, useState, useEffect } from "react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 999,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          pointerEvents: "none",
          alignItems: "center",
        }}
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} item={t} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ item }: { item: ToastItem }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const color =
    item.type === "success"
      ? "rgba(52,211,153,0.9)"
      : item.type === "error"
      ? "rgba(248,113,113,0.9)"
      : "rgba(200,218,249,0.85)";

  const bg =
    item.type === "success"
      ? "rgba(6,78,59,0.92)"
      : item.type === "error"
      ? "rgba(127,29,29,0.92)"
      : "rgba(13,19,71,0.95)";

  return (
    <div
      style={{
        padding: "10px 18px",
        borderRadius: "12px",
        background: bg,
        border: `1px solid ${color}30`,
        color,
        fontSize: "13px",
        fontFamily: "'DM Sans', sans-serif",
        boxShadow: "0 8px 24px rgba(10,15,60,0.5)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        transition: "opacity 0.2s, transform 0.2s",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        whiteSpace: "nowrap",
        pointerEvents: "none",
        letterSpacing: "0.01em",
      }}
    >
      {item.message}
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx.toast;
}
