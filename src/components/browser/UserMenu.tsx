"use client";

import React from "react";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";

export default function UserMenu() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div
        style={{
          width: "26px",
          height: "26px",
          borderRadius: "50%",
          background: "rgba(44,93,169,0.2)",
          flexShrink: 0,
        }}
      />
    );
  }

  if (isSignedIn) {
    return (
      <UserButton
        appearance={{
          variables: {
            colorPrimary: "#2c5da9",
            colorBackground: "#111a54",
            colorText: "#f4f8ff",
            borderRadius: "10px",
            fontFamily: "'DM Sans', sans-serif",
          },
          elements: {
            avatarBox: {
              width: "26px",
              height: "26px",
            },
          },
        }}
      />
    );
  }

  return (
    <SignInButton mode="redirect">
      <button
        title="Sign in to sync"
        aria-label="Sign in"
        style={{
          width: "26px",
          height: "26px",
          borderRadius: "50%",
          background: "rgba(44,93,169,0.25)",
          border: "1px solid rgba(200,218,249,0.15)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(44,93,169,0.5)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(44,93,169,0.25)";
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(200,218,249,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </button>
    </SignInButton>
  );
}