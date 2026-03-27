"use client";

import React from "react";
import { useBrowser } from "@/context/BrowserContext";
import { IconDownload, IconClose } from "@/components/icons/Icons";

export default function DownloadTray() {
  const { state, dispatch } = useBrowser();

  if (state.downloads.length === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "12px",
        right: "12px",
        width: "min(300px, 90vw)",
        zIndex: 50,
        borderRadius: "14px",
        background: "rgba(17,26,84,0.97)",
        border: "1px solid rgba(200,218,249,0.1)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(10,15,60,0.6)",
        overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 14px",
        borderBottom: "1px solid rgba(200,218,249,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <IconDownload size={13} className="text-drift-sky" />
          <span style={{ fontSize: "12px", color: "rgba(200,218,249,0.7)", fontWeight: 500 }}>
            Downloads
          </span>
        </div>
        <button
          onClick={() => dispatch({ type: "CLEAR_DOWNLOADS" })}
          aria-label="Clear downloads"
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "6px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "rgba(200,218,249,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconClose size={10} />
        </button>
      </div>

      {/* List */}
      <div style={{ maxHeight: "200px", overflowY: "auto" }}>
        {state.downloads.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 14px",
              borderBottom: "1px solid rgba(200,218,249,0.04)",
            }}
          >
            <IconDownload size={13} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: "12px",
                color: "rgba(200,218,249,0.8)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
                {item.filename}
              </p>
              <p style={{ fontSize: "10px", color: "rgba(200,218,249,0.3)", marginTop: "2px" }}>
                {item.status === "done"
                  ? "Complete"
                  : item.status === "error"
                  ? "Failed"
                  : item.status === "downloading"
                  ? "Downloading..."
                  : "Starting..."}
              </p>
            </div>
            <span style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              flexShrink: 0,
              background:
                item.status === "done"
                  ? "#34d399"
                  : item.status === "error"
                  ? "#f87171"
                  : "#2c5da9",
            }} />
          </div>
        ))}
      </div>
    </div>
  );
}
