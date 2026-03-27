"use client";

import React from "react";

export default function PageSkeleton() {
  return (
    <div
      style={{
        flex: 1,
        background: "#f8fafc",
        display: "flex",
        flexDirection: "column",
        padding: "24px",
        gap: "16px",
        overflow: "hidden",
      }}
    >
      {/* Fake browser toolbar skeleton */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <Bone width="120px" height="14px" radius="6px" />
        <Bone width="60%" height="14px" radius="6px" />
        <Bone width="80px" height="14px" radius="6px" />
      </div>

      {/* Hero block */}
      <Bone width="55%" height="32px" radius="8px" delay="0.05s" />
      <Bone width="35%" height="20px" radius="6px" delay="0.1s" />

      {/* Paragraph lines */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
        <Bone width="100%" height="12px" radius="4px" delay="0.12s" />
        <Bone width="100%" height="12px" radius="4px" delay="0.14s" />
        <Bone width="92%" height="12px" radius="4px" delay="0.16s" />
        <Bone width="78%" height="12px" radius="4px" delay="0.18s" />
      </div>

      {/* Card row */}
      <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              padding: "14px",
              borderRadius: "12px",
              background: "rgba(0,0,0,0.03)",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <Bone width="40px" height="40px" radius="10px" delay={`${0.1 + i * 0.05}s`} />
            <Bone width="80%" height="12px" radius="4px" delay={`${0.15 + i * 0.05}s`} />
            <Bone width="60%" height="10px" radius="4px" delay={`${0.2 + i * 0.05}s`} />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
        <Bone width="100%" height="12px" radius="4px" delay="0.25s" />
        <Bone width="88%" height="12px" radius="4px" delay="0.27s" />
        <Bone width="70%" height="12px" radius="4px" delay="0.29s" />
      </div>

      <style>{`
        @keyframes boneShimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
      `}</style>
    </div>
  );
}

function Bone({
  width, height, radius = "4px", delay = "0s",
}: {
  width: string;
  height: string;
  radius?: string;
  delay?: string;
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background: "linear-gradient(90deg, #e8edf5 25%, #f4f7fc 50%, #e8edf5 75%)",
        backgroundSize: "800px 100%",
        animation: `boneShimmer 1.4s ease-in-out infinite`,
        animationDelay: delay,
        flexShrink: 0,
      }}
    />
  );
}
