"use client";

// src/components/template-previews/minimal-paper.tsx
import React from "react";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

const THEME: CardTheme = {
  font: "'Inter', 'Segoe UI', Arial, sans-serif",
  bg: "#fafaf7",
  text: "#111827",
  muted: "#6b7280",
  accent: "#1f2937",
  accent2: "#ef4444",
  glow: "239,68,68",
  rowBg: "rgba(255,255,255,0.95)",
  rowBorder: "rgba(17,24,39,0.12)",
  panel: "#ffffff",
  barBg: "rgba(255,255,255,0.92)",
};

const CSS = `
@keyframes mp-draw  { from { stroke-dashoffset: 1000; } to { stroke-dashoffset: 0; } }
@keyframes mp-float { 0%,100% { translate: 0 0; } 50% { translate: 18px -26px; } }
@keyframes mp-spin  { to { rotate: 360deg; } }
.mp-draw  { stroke-dasharray: 1000; animation: mp-draw 2.6s ease-out .2s both; }
.mp-draw2 { stroke-dasharray: 1000; animation: mp-draw 3.2s ease-out .6s both; }
.mp-dot   { animation: mp-float 8s ease-in-out infinite; }
.mp-orbit { animation: mp-spin 40s linear infinite; transform-box: fill-box; transform-origin: center; }
@media (prefers-reduced-motion: reduce) { .mp-draw, .mp-draw2 { animation: none; stroke-dashoffset: 0; } .mp-dot, .mp-orbit { animation: none; } }
`;

const MARKS: [number, number][] = [
  [48, 48],
  [976, 48],
  [48, 1488],
  [976, 1488],
];

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >
    <defs>
      <pattern
        id="mp-dots"
        width="32"
        height="32"
        patternUnits="userSpaceOnUse"
      >
        <circle cx="2" cy="2" r="1.3" fill="#111827" opacity="0.12" />
      </pattern>
    </defs>

    <rect width="1024" height="1536" fill="#fafaf7" />
    <rect width="1024" height="1536" fill="url(#mp-dots)" />

    {/* big hand-drawn style lines */}
    <g fill="none" stroke="#111827" strokeLinecap="round">
      <path
        className="mp-draw"
        pathLength={1000}
        d="M-20 300 C 260 180, 520 380, 820 220 S 1040 120, 1060 140"
        strokeWidth="2"
        opacity="0.55"
      />
      <path
        className="mp-draw2"
        pathLength={1000}
        d="M-20 1300 C 220 1420, 520 1220, 820 1340 S 1040 1420, 1060 1400"
        strokeWidth="2"
        opacity="0.55"
      />
    </g>

    {/* thin orbit ring with a red marker */}
    <g className="mp-orbit">
      <circle
        cx="860"
        cy="1180"
        r="150"
        fill="none"
        stroke="#111827"
        strokeWidth="1.4"
        opacity="0.3"
        strokeDasharray="4 10"
      />
      <circle cx="860" cy="1030" r="9" fill="#ef4444" />
    </g>
    <circle
      cx="150"
      cy="420"
      r="70"
      fill="none"
      stroke="#111827"
      strokeWidth="1.4"
      opacity="0.25"
    />

    {/* floating red dot */}
    <circle className="mp-dot" cx="150" cy="420" r="8" fill="#ef4444" />

    {/* corner crop marks */}
    <g stroke="#111827" strokeWidth="2" opacity="0.5">
      {MARKS.map(([x, y], i) => {
        const dx = x < 512 ? 1 : -1;
        const dy = y < 768 ? 1 : -1;
        return (
          <g key={i}>
            <line x1={x} y1={y} x2={x + 28 * dx} y2={y} />
            <line x1={x} y1={y} x2={x} y2={y + 28 * dy} />
          </g>
        );
      })}
    </g>
  </svg>
);

export const MinimalPaper: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);

export default MinimalPaper;
