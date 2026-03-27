import React from "react";

type IconProps = {
  size?: number;
  className?: string;
  strokeWidth?: number;
};

const base = (d: string, props: IconProps, filled = false) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size ?? 16}
    height={props.size ?? 16}
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke={filled ? "none" : "currentColor"}
    strokeWidth={props.strokeWidth ?? 1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

export const IconBack = (p: IconProps) =>
  base("M19 12H5M5 12l7-7M5 12l7 7", p);

export const IconForward = (p: IconProps) =>
  base("M5 12h14M14 5l7 7-7 7", p);

export const IconReload = (p: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={p.size ?? 16}
    height={p.size ?? 16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={p.strokeWidth ?? 1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={p.className}
    aria-hidden="true"
  >
    <path d="M23 4v6h-6" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

export const IconStop = (p: IconProps) =>
  base("M18 6L6 18M6 6l12 12", p);

export const IconHome = (p: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={p.size ?? 16}
    height={p.size ?? 16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={p.strokeWidth ?? 1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={p.className}
    aria-hidden="true"
  >
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

export const IconLock = (p: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={p.size ?? 14}
    height={p.size ?? 14}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={p.strokeWidth ?? 2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={p.className}
    aria-hidden="true"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export const IconUnlock = (p: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={p.size ?? 14}
    height={p.size ?? 14}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={p.strokeWidth ?? 2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={p.className}
    aria-hidden="true"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
  </svg>
);

export const IconSearch = (p: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={p.size ?? 16}
    height={p.size ?? 16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={p.strokeWidth ?? 1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={p.className}
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

export const IconBookmark = (p: IconProps & { filled?: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={p.size ?? 16}
    height={p.size ?? 16}
    viewBox="0 0 24 24"
    fill={p.filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={p.strokeWidth ?? 1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={p.className}
    aria-hidden="true"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

export const IconHistory = (p: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={p.size ?? 16}
    height={p.size ?? 16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={p.strokeWidth ?? 1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={p.className}
    aria-hidden="true"
  >
    <path d="M3 3v6h6" />
    <path d="M3.05 13A9 9 0 1 0 6 5.3L3 3" />
    <path d="M12 7v5l4 2" />
  </svg>
);

export const IconClose = (p: IconProps) =>
  base("M18 6L6 18M6 6l12 12", p);

export const IconPlus = (p: IconProps) =>
  base("M12 5v14M5 12h14", p);

export const IconSettings = (p: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={p.size ?? 16}
    height={p.size ?? 16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={p.strokeWidth ?? 1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={p.className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

export const IconIncognito = (p: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={p.size ?? 16}
    height={p.size ?? 16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={p.strokeWidth ?? 1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={p.className}
    aria-hidden="true"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export const IconMenu = (p: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={p.size ?? 16}
    height={p.size ?? 16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={p.strokeWidth ?? 1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={p.className}
    aria-hidden="true"
  >
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export const IconDownload = (p: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={p.size ?? 16}
    height={p.size ?? 16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={p.strokeWidth ?? 1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={p.className}
    aria-hidden="true"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

/** DRIFT browser logo */
export const IconDriftLogo = ({ size = 24, className }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    aria-label="DRIFT"
  >
    <defs>
      <linearGradient id="drift-logo-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#c8daf9" />
        <stop offset="60%" stopColor="#2c5da9" />
        <stop offset="100%" stopColor="#0a0f3c" />
      </linearGradient>
    </defs>
    <path
      d="M8 6h8c5.52 0 10 4.48 10 10s-4.48 10-10 10H8V6z"
      fill="url(#drift-logo-grad)"
      opacity="0.9"
    />
    <path
      d="M13 11c3.31 0 6 2.24 6 5s-2.69 5-6 5"
      stroke="#f4f8ff"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
      opacity="0.85"
    />
    <circle cx="10" cy="16" r="1.5" fill="#f4f8ff" opacity="0.7" />
  </svg>
);
