"use client";

// src/components/template-previews/cyber-grid.tsx
// Cyber Grid - Neon retro-future horizon: striped sun, endless perspective grid and wireframe mountains (premium)
// Slug: "cyber-grid" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
// and in TemplateCard.tsx (PREVIEW_ASPECT).
import React from "react";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

const THEME: CardTheme = {
  font: "'Orbitron', 'Segoe UI', Arial, sans-serif",
  bg: "#0b0220",
  text: "#fdf4ff",
  muted: "#c4a5e8",
  accent: "#f0abfc",
  accent2: "#22d3ee",
  glow: "240,171,252",
  rowBg: "rgba(30,8,60,0.75)",
  rowBorder: "rgba(240,171,252,0.35)",
  panel: "#1a0638",
  barBg: "rgba(11,2,32,0.92)",
};

const CSS = `
@keyframes cyg-run { 0% { translate: 0 0; opacity: 0; } 15% { opacity: .95; } 100% { translate: 0 540px; opacity: .95; } }
@keyframes cyg-pulse { 0%,100% { opacity: .75; } 50% { opacity: 1; } }
@keyframes cyg-scan { from { translate: 0 0; } to { translate: 0 8px; } }
.cyg-line { animation: cyg-run 5s cubic-bezier(.55,0,.9,.6) infinite; }
.cyg-sun { animation: cyg-pulse 4s ease-in-out infinite; }
.cyg-scan { animation: cyg-scan .5s linear infinite; }
@media (prefers-reduced-motion: reduce) { .cyg-line, .cyg-sun, .cyg-scan { animation: none; } }
`;

const HLINES = Array.from({ length: 9 }, (_, i) => i);
const VLINES = Array.from({ length: 21 }, (_, i) => -1000 + i * 150);

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >
    <defs>
      <linearGradient id="cyg-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0b0220" />
        <stop offset=".55" stopColor="#3b0764" />
        <stop offset="1" stopColor="#be185d" />
      </linearGradient>
      <linearGradient id="cyg-sunfill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fde047" />
        <stop offset=".55" stopColor="#fb7185" />
        <stop offset="1" stopColor="#c026d3" />
      </linearGradient>
      <linearGradient id="cyg-floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1e0b3a" />
        <stop offset="1" stopColor="#07010f" />
      </linearGradient>
      <mask id="cyg-mask">
        <rect width="1024" height="1536" fill="#fff" />
        <rect y="790" width="1024" height="6" fill="#000" />
        <rect y="835" width="1024" height="10" fill="#000" />
        <rect y="885" width="1024" height="14" fill="#000" />
        <rect y="935" width="1024" height="18" fill="#000" />
        <rect y="985" width="1024" height="24" fill="#000" />
      </mask>
      <pattern
        id="cyg-lines"
        width="4"
        height="4"
        patternUnits="userSpaceOnUse"
      >
        <rect width="4" height="1" fill="#000" opacity=".25" />
      </pattern>
    </defs>
    <rect width="1024" height="1536" fill="url(#cyg-sky)" />
    <g className="cyg-sun" mask="url(#cyg-mask)">
      <circle cx="512" cy="800" r="250" fill="#f0abfc" opacity=".25" />
      <circle cx="512" cy="800" r="215" fill="url(#cyg-sunfill)" />
    </g>
    <path
      d="M0 1000 L110 890 L200 950 L320 820 L430 1000 M594 1000 L700 850 L800 940 L900 880 L1024 1000"
      fill="none"
      stroke="#22d3ee"
      strokeWidth="2.4"
      strokeLinejoin="round"
      opacity=".85"
    />
    <rect y="1000" width="1024" height="536" fill="url(#cyg-floor)" />
    <g stroke="#f0abfc" strokeWidth="2" opacity=".55">
      {VLINES.map((x) => (
        <line key={x} x1="512" y1="1000" x2={x} y2="1536" />
      ))}
    </g>
    <g stroke="#f0abfc" strokeWidth="3">
      {HLINES.map((i) => (
        <line
          key={i}
          className="cyg-line"
          style={{ animationDelay: `${i * 0.55}s` }}
          x1="0"
          y1="1000"
          x2="1024"
          y2="1000"
        />
      ))}
    </g>
    <line
      x1="0"
      y1="1000"
      x2="1024"
      y2="1000"
      stroke="#22d3ee"
      strokeWidth="4"
    />
    <rect
      className="cyg-scan"
      width="1024"
      height="1536"
      fill="url(#cyg-lines)"
    />
    <rect
      x="44"
      y="44"
      width="936"
      height="1448"
      rx="10"
      fill="none"
      stroke="#f0abfc"
      strokeWidth="5"
      opacity=".18"
    />
    <rect
      x="44"
      y="44"
      width="936"
      height="1448"
      rx="10"
      fill="none"
      stroke="#f0abfc"
      strokeWidth="1.6"
      opacity=".85"
    />
  </svg>
);

export const CyberGrid: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);

export default CyberGrid;
