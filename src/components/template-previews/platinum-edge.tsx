"use client";

// src/components/template-previews/platinum-edge.tsx
// Platinum Edge - steel blueprint with scanning beam (premium)
// Slug: "platinum-edge" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
// and in TemplateCard.tsx (PREVIEW_ASPECT).
import React from "react";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

const THEME: CardTheme = {
  font: "'Montserrat', 'Segoe UI', Arial, sans-serif",
  bg: "#0c1118",
  text: "#eef2f7",
  muted: "#9aa7b8",
  accent: "#c9d3e0",
  accent2: "#7dd3fc",
  glow: "125,211,252",
  rowBg: "rgba(20,28,40,0.75)",
  rowBorder: "rgba(201,211,224,0.25)",
  panel: "#131b27",
  barBg: "rgba(12,17,24,0.92)",
};

const CSS = `
@keyframes pe-scan  { from { translate: 0 -200px; } to { translate: 0 1750px; } }
@keyframes pe-spin  { to { rotate: 360deg; } }
@keyframes pe-spinr { to { rotate: -360deg; } }
@keyframes pe-blink { 0%,100% { opacity: .25; } 50% { opacity: 1; } }
.pe-scan  { animation: pe-scan 6.5s linear infinite; }
.pe-ring  { transform-box: fill-box; transform-origin: center; animation: pe-spin 60s linear infinite; }
.pe-ring2 { transform-box: fill-box; transform-origin: center; animation: pe-spinr 44s linear infinite; }
.pe-blink { animation: pe-blink 2.6s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .pe-scan, .pe-ring, .pe-ring2, .pe-blink { animation: none; } }
`;

const hex = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
const NODES: [number, number][] = [
  [200, 300],
  [820, 360],
  [140, 1180],
  [880, 1240],
  [512, 150],
];
const BR: [number, number, number, number][] = [
  [56, 56, 1, 1],
  [968, 56, -1, 1],
  [56, 1480, 1, -1],
  [968, 1480, -1, -1],
];

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >
    <defs>
      <linearGradient id="pe-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#1b2430" />
        <stop offset=".5" stopColor="#0c1118" />
        <stop offset="1" stopColor="#151d28" />
      </linearGradient>
      <linearGradient id="pe-beam" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7dd3fc" stopOpacity="0" />
        <stop offset=".85" stopColor="#7dd3fc" stopOpacity=".16" />
        <stop offset="1" stopColor="#e0f2fe" stopOpacity=".7" />
      </linearGradient>
      <pattern
        id="pe-grid"
        width="64"
        height="64"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M64 0H0V64"
          fill="none"
          stroke="#c9d3e0"
          strokeWidth=".8"
          opacity=".09"
        />
      </pattern>
    </defs>
    <rect width="1024" height="1536" fill="url(#pe-bg)" />
    <rect width="1024" height="1536" fill="url(#pe-grid)" />
    <polygon
      className="pe-ring"
      points={hex(512, 430, 300)}
      fill="none"
      stroke="#c9d3e0"
      strokeWidth="1.4"
      opacity=".35"
    />
    <polygon
      className="pe-ring2"
      points={hex(512, 430, 220)}
      fill="none"
      stroke="#7dd3fc"
      strokeWidth="1.2"
      strokeDasharray="6 12"
      opacity=".5"
    />
    <polygon
      points={hex(512, 1150, 180)}
      fill="none"
      stroke="#c9d3e0"
      strokeWidth="1"
      opacity=".2"
    />
    {NODES.map(([x, y], i) => (
      <g key={i} className="pe-blink" style={{ animationDelay: `${i * 0.5}s` }}>
        <circle cx={x} cy={y} r="5" fill="#7dd3fc" />
        <circle
          cx={x}
          cy={y}
          r="14"
          fill="none"
          stroke="#7dd3fc"
          strokeWidth="1"
          opacity=".6"
        />
      </g>
    ))}
    {BR.map(([x, y, dx, dy], i) => (
      <path
        key={i}
        d={`M${x} ${y + 54 * dy}V${y}H${x + 54 * dx}`}
        fill="none"
        stroke="#c9d3e0"
        strokeWidth="3"
        strokeLinecap="round"
      />
    ))}
    <g className="pe-scan">
      <rect x="0" y="0" width="1024" height="200" fill="url(#pe-beam)" />
    </g>
  </svg>
);

export const PlatinumEdge: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);
export default PlatinumEdge;
