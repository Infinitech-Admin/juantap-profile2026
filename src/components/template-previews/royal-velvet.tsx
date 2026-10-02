"use client";

// src/components/template-previews/royal-velvet.tsx
// Royal Velvet - burgundy velvet + gold frame (premium)
// Slug: "royal-velvet" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
// and in TemplateCard.tsx (PREVIEW_ASPECT).
import React from "react";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

const THEME: CardTheme = {
  font: "'Playfair Display', 'Georgia', serif",
  bg: "#2a0510",
  text: "#fdeedd",
  muted: "#d9a7a0",
  accent: "#e6c068",
  accent2: "#b3123b",
  glow: "230,192,104",
  rowBg: "rgba(60,8,22,0.72)",
  rowBorder: "rgba(230,192,104,0.35)",
  panel: "#3a0a18",
  barBg: "rgba(42,5,16,0.92)",
};

const CSS = `
@keyframes rv-rise  { 0% { translate: 0 0; opacity: 0; } 15% { opacity: .9; } 100% { translate: 0 -1750px; opacity: 0; } }
@keyframes rv-sweep { from { translate: -1300px 0; } to { translate: 1500px 0; } }
@keyframes rv-dash  { to { stroke-dashoffset: -240; } }
@keyframes rv-pulse { 0%,100% { opacity: .3; } 50% { opacity: 1; } }
.rv-rise  { animation: rv-rise 12s linear infinite; }
.rv-sweep { animation: rv-sweep 7s ease-in-out infinite; }
.rv-dash  { stroke-dasharray: 40 20; animation: rv-dash 6s linear infinite; }
.rv-pulse { animation: rv-pulse 3.2s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .rv-rise, .rv-sweep, .rv-dash, .rv-pulse { animation: none; } }
`;

const GEMS = Array.from({ length: 14 }, (_, i) => ({
  x: 70 + ((i * 71) % 880),
  y: 1560 + ((i * 97) % 260),
  s: 8 + (i % 4) * 4,
  d: i * 0.9,
  t: 10 + (i % 5) * 2,
}));
const CORNERS: [number, number][] = [
  [64, 64],
  [960, 64],
  [64, 1472],
  [960, 1472],
];

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >
    <defs>
      <radialGradient id="rv-bg" cx="50%" cy="32%" r="80%">
        <stop offset="0" stopColor="#5a0d26" />
        <stop offset=".55" stopColor="#2a0510" />
        <stop offset="1" stopColor="#120207" />
      </radialGradient>
      <linearGradient id="rv-shine" x1="0" x2="1">
        <stop offset="0" stopColor="#ffe6a0" stopOpacity="0" />
        <stop offset=".5" stopColor="#ffe6a0" stopOpacity=".22" />
        <stop offset="1" stopColor="#ffe6a0" stopOpacity="0" />
      </linearGradient>
      <pattern
        id="rv-weave"
        width="14"
        height="14"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(45)"
      >
        <rect width="14" height="7" fill="#fff" opacity=".025" />
      </pattern>
    </defs>
    <rect width="1024" height="1536" fill="url(#rv-bg)" />
    <rect width="1024" height="1536" fill="url(#rv-weave)" />
    <rect
      x="40"
      y="40"
      width="944"
      height="1456"
      rx="22"
      fill="none"
      stroke="#e6c068"
      strokeWidth="1.6"
      opacity=".8"
    />
    <rect
      x="64"
      y="64"
      width="896"
      height="1408"
      rx="12"
      fill="none"
      stroke="#e6c068"
      strokeWidth="1.2"
      opacity=".7"
      className="rv-dash"
    />
    {CORNERS.map(([x, y], i) => (
      <g key={i} className="rv-pulse" style={{ animationDelay: `${i * 0.6}s` }}>
        <rect
          x={x - 9}
          y={y - 9}
          width="18"
          height="18"
          fill="#e6c068"
          transform={`rotate(45 ${x} ${y})`}
        />
        <circle
          cx={x}
          cy={y}
          r="22"
          fill="none"
          stroke="#e6c068"
          strokeWidth="1"
        />
      </g>
    ))}
    {GEMS.map((p, i) => (
      <g
        key={i}
        className="rv-rise"
        style={{ animationDelay: `${p.d}s`, animationDuration: `${p.t}s` }}
      >
        <rect
          x={p.x}
          y={p.y}
          width={p.s}
          height={p.s}
          fill="#e6c068"
          opacity=".8"
          transform={`rotate(45 ${p.x} ${p.y})`}
        />
      </g>
    ))}
    <g className="rv-sweep">
      <rect
        x="0"
        y="-100"
        width="260"
        height="1760"
        fill="url(#rv-shine)"
        transform="skewX(-18)"
      />
    </g>
  </svg>
);

export const RoyalVelvet: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);
export default RoyalVelvet;
