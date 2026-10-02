"use client";

// src/components/template-previews/carbon-fiber.tsx
// Carbon Fiber - carbon weave with red racing line (free)
// Slug: "carbon-fiber" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
// and in TemplateCard.tsx (PREVIEW_ASPECT).
import React from "react";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

const THEME: CardTheme = {
  font: "'Rajdhani', 'Segoe UI', Arial, sans-serif",
  bg: "#0a0a0b",
  text: "#f4f4f5",
  muted: "#a1a1aa",
  accent: "#ef4444",
  accent2: "#f97316",
  glow: "239,68,68",
  rowBg: "rgba(24,24,27,0.8)",
  rowBorder: "rgba(239,68,68,0.35)",
  panel: "#18181b",
  barBg: "rgba(10,10,11,0.92)",
};

const CSS = `
@keyframes cf-lap   { to { stroke-dashoffset: -1000; } }
@keyframes cf-slash { from { translate: -1400px 0; } to { translate: 1400px 0; } }
@keyframes cf-pulse { 0%,100% { opacity: .25; scale: 1; } 50% { opacity: .6; scale: 1.15; } }
.cf-lap   { stroke-dasharray: 140 860; animation: cf-lap 5s linear infinite; }
.cf-lap2  { stroke-dasharray: 60 940; animation: cf-lap 5s linear infinite; animation-delay: -2.5s; }
.cf-slash { animation: cf-slash 6s cubic-bezier(.6,0,.4,1) infinite; }
.cf-pulse { transform-box: fill-box; transform-origin: center; animation: cf-pulse 3.5s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .cf-lap, .cf-lap2, .cf-slash, .cf-pulse { animation: none; } }
`;

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >
    <defs>
      <pattern
        id="cf-weave"
        width="16"
        height="16"
        patternUnits="userSpaceOnUse"
      >
        <rect width="8" height="8" fill="#1a1a1d" />
        <rect x="8" y="8" width="8" height="8" fill="#1a1a1d" />
        <rect x="8" width="8" height="8" fill="#0d0d0f" />
        <rect y="8" width="8" height="8" fill="#0d0d0f" />
        <path d="M0 0L8 8M8 8L16 16" stroke="#fff" strokeOpacity=".05" />
      </pattern>
      <radialGradient id="cf-vig" cx="50%" cy="45%" r="75%">
        <stop offset=".4" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity=".85" />
      </radialGradient>
      <radialGradient id="cf-red">
        <stop offset="0" stopColor="#ef4444" stopOpacity=".6" />
        <stop offset="1" stopColor="#ef4444" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="cf-stripe" x1="0" x2="1">
        <stop offset="0" stopColor="#ef4444" stopOpacity="0" />
        <stop offset=".5" stopColor="#ef4444" stopOpacity=".28" />
        <stop offset="1" stopColor="#ef4444" stopOpacity="0" />
      </linearGradient>
    </defs>
    <rect width="1024" height="1536" fill="url(#cf-weave)" />
    <rect width="1024" height="1536" fill="url(#cf-vig)" />
    <circle
      className="cf-pulse"
      cx="512"
      cy="1400"
      r="420"
      fill="url(#cf-red)"
    />
    <g className="cf-slash">
      <rect
        x="0"
        y="-100"
        width="140"
        height="1800"
        fill="url(#cf-stripe)"
        transform="skewX(-24)"
      />
    </g>
    <rect
      x="44"
      y="44"
      width="936"
      height="1448"
      rx="26"
      fill="none"
      stroke="#ef4444"
      strokeWidth="1.2"
      opacity=".25"
    />
    <rect
      className="cf-lap"
      pathLength={1000}
      x="44"
      y="44"
      width="936"
      height="1448"
      rx="26"
      fill="none"
      stroke="#ef4444"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <rect
      className="cf-lap2"
      pathLength={1000}
      x="44"
      y="44"
      width="936"
      height="1448"
      rx="26"
      fill="none"
      stroke="#f97316"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

export const CarbonFiber: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);
export default CarbonFiber;
