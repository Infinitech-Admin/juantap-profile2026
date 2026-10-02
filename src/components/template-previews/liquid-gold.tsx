"use client";

// src/components/template-previews/liquid-gold.tsx
// Liquid Gold - Molten gold blobs that merge and flow like liquid metal with a racing shine on the frame (premium)
// Slug: "liquid-gold" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
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
  bg: "#0b0703",
  text: "#fff6dc",
  muted: "#d6b86a",
  accent: "#f2c94c",
  accent2: "#b8860b",
  glow: "242,201,76",
  rowBg: "rgba(30,20,6,0.78)",
  rowBorder: "rgba(242,201,76,0.34)",
  panel: "#1c1206",
  barBg: "rgba(11,7,3,0.92)",
};

const CSS = `
@keyframes lqg-a { 0%,100% { translate: 0 0; } 50% { translate: 70px 90px; } }
@keyframes lqg-b { 0%,100% { translate: 0 0; } 50% { translate: -80px 60px; } }
@keyframes lqg-c { 0%,100% { translate: 0 0; } 33% { translate: -50px 90px; } 66% { translate: 60px 30px; } }
@keyframes lqg-shine { from { stroke-dashoffset: 1000; } to { stroke-dashoffset: -1000; } }
.lqg-a { animation: lqg-a 9s ease-in-out infinite; }
.lqg-b { animation: lqg-b 11s ease-in-out infinite; }
.lqg-c { animation: lqg-c 13s ease-in-out infinite; }
.lqg-shine { stroke-dasharray: 140 860; animation: lqg-shine 7s linear infinite; }
@media (prefers-reduced-motion: reduce) { .lqg-a, .lqg-b, .lqg-c, .lqg-shine { animation: none; } }
`;

const BLOBS: [number, number, number, string][] = [
  [120, 140, 120, "a"],
  [420, 60, 90, "b"],
  [900, 180, 140, "c"],
  [990, 520, 70, "b"],
  [50, 1290, 130, "c"],
  [380, 1490, 120, "a"],
  [760, 1430, 140, "b"],
  [980, 1230, 80, "a"],
];

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >
    <defs>
      <radialGradient id="lqg-bg" cx="50%" cy="45%" r="80%">
        <stop offset="0" stopColor="#1b1206" />
        <stop offset="1" stopColor="#050301" />
      </radialGradient>
      <linearGradient id="lqg-gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff3b0" />
        <stop offset=".45" stopColor="#f2c94c" />
        <stop offset="1" stopColor="#b8860b" />
      </linearGradient>
      <filter
        id="lqg-goo"
        filterUnits="userSpaceOnUse"
        x="-300"
        y="-300"
        width="1624"
        height="2136"
      >
        <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="b" />
        <feColorMatrix
          in="b"
          mode="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10"
        />
      </filter>
    </defs>
    <rect width="1024" height="1536" fill="url(#lqg-bg)" />
    <g filter="url(#lqg-goo)">
      {BLOBS.map(([x, y, r, k], i) => (
        <circle
          key={i}
          className={`lqg-${k}`}
          style={{ animationDelay: `${-i * 1.3}s` }}
          cx={x}
          cy={y}
          r={r}
          fill="url(#lqg-gold)"
        />
      ))}
    </g>
    <rect
      x="44"
      y="44"
      width="936"
      height="1448"
      rx="26"
      fill="none"
      stroke="#f2c94c"
      strokeWidth="1.4"
      opacity=".5"
    />
    <rect
      className="lqg-shine"
      pathLength={1000}
      x="44"
      y="44"
      width="936"
      height="1448"
      rx="26"
      fill="none"
      stroke="#fff3b0"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
);

export const LiquidGold: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);

export default LiquidGold;
