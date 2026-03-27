"use client";

import React from "react";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";

export default function UserMenu() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div style={{
        width: "26px",
        height: "26px",
        borderRadius: "50%",
        background: "rgba(44,93,169,0.2)",
        flexShrink: 0,
      }} />
    );
  }

  if (isSignedIn) {
    return (
      <UserButton
        appearance={{
          variables: {
            colorPrimary: "#2c5da9",
            colorBackground: "#0f1a5c",
            colorText: "#ffffff",
            colorTextSecondary: "rgba(200,218,249,0.7)",
            colorNeutral: "#ffffff",
            borderRadius: "12px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "14px",
          },
          elements: {
            avatarBox: {
              width: "26px",
              height: "26px",
            },
            userButtonPopoverCard: {
              background: "#0d1347",
              border: "1px solid rgba(200,218,249,0.15)",
              boxShadow: "0 16px 48px rgba(8,13,46,0.9)",
              borderRadius: "16px",
            },
            userButtonPopoverMain: {
              background: "transparent",
            },
            userButtonPopoverActions: {
              background: "transparent",
            },
            userButtonPopoverActionButton: {
              color: "#ffffff",
              background: "transparent",
            },
            userButtonPopoverActionButtonText: {
              color: "#ffffff",
              fontSize: "13px",
              fontFamily: "'DM Sans', sans-serif",
            },
            userButtonPopoverActionButtonIcon: {
              color: "rgba(200,218,249,0.6)",
            },
            userButtonPopoverFooter: {
              display: "none",
            },
            userPreviewMainIdentifier: {
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "600",
              fontFamily: "'DM Sans', sans-serif",
            },
            userPreviewSecondaryIdentifier: {
              color: "rgba(200,218,249,0.6)",
              fontSize: "12px",
              fontFamily: "'DM Sans', sans-serif",
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
        <svg
          width="13" height="13" viewBox="0 0 24 24"
          fill="none" stroke="rgba(200,218,249,0.7)"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </button>
    </SignInButton>
  );
}
