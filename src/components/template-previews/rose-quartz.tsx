"use client";

// src/components/template-previews/rose-quartz.tsx
import React from "react";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

const THEME: CardTheme = {
  font: "'Playfair Display', Georgia, serif",
  bg: "#fff3f1",
  text: "#4a2c2f",
  muted: "#8a6a6c",
  accent: "#b76e79", // rose gold
  accent2: "#c9808b",
  glow: "183,110,121",
  rowBg: "rgba(255,255,255,0.72)",
  rowBorder: "rgba(183,110,121,0.28)",
  panel: "#ffffff",
  barBg: "rgba(255,255,255,0.82)",
};

const CSS = `
@keyframes rq-drift   { 0%,100% { translate: 0 0; } 50% { translate: 36px -48px; } }
@keyframes rq-drift-b { 0%,100% { translate: 0 0; } 50% { translate: -44px 32px; } }
@keyframes rq-twinkle { 0%,100% { opacity: .15; scale: .7; } 50% { opacity: .95; scale: 1.2; } }
@keyframes rq-arc     { to { stroke-dashoffset: -1000; } }
.rq-a { animation: rq-drift 14s ease-in-out infinite; }
.rq-b { animation: rq-drift-b 17s ease-in-out infinite; }
.rq-t { animation: rq-twinkle 3.6s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.rq-arc { animation: rq-arc 18s linear infinite; }
@media (prefers-reduced-motion: reduce) { .rq-a, .rq-b, .rq-t, .rq-arc { animation: none; } }
`;

const SPARKLES: [number, number, number][] = [
  [150, 420, 7],
  [880, 330, 6],
  [820, 880, 8],
  [210, 1010, 6],
  [560, 260, 5],
  [930, 1180, 7],
];

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >
    <defs>
      <linearGradient id="rq-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff8f5" />
        <stop offset="0.55" stopColor="#fde9e6" />
        <stop offset="1" stopColor="#f6d3d3" />
      </linearGradient>
      <radialGradient id="rq-blob1" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#f4b6bd" stopOpacity="0.85" />
        <stop offset="1" stopColor="#f4b6bd" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="rq-blob2" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#e8c7a6" stopOpacity="0.7" />
        <stop offset="1" stopColor="#e8c7a6" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="rq-gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#e6b8a2" />
        <stop offset="1" stopColor="#b76e79" />
      </linearGradient>
    </defs>

    <rect width="1024" height="1536" fill="url(#rq-bg)" />

    <g className="rq-a">
      <circle cx="170" cy="260" r="360" fill="url(#rq-blob1)" />
    </g>
    <g className="rq-b">
      <circle cx="900" cy="1260" r="420" fill="url(#rq-blob1)" />
    </g>
    <g className="rq-a" style={{ animationDelay: "-6s" }}>
      <circle cx="880" cy="420" r="300" fill="url(#rq-blob2)" />
    </g>

    {/* rose-gold arcs */}
    <g fill="none" stroke="url(#rq-gold)" strokeLinecap="round">
      <path
        d="M-40 1180 C 240 1020, 520 1180, 760 1500"
        strokeWidth="2"
        opacity="0.7"
      />
      <path
        className="rq-arc"
        d="M-40 1180 C 240 1020, 520 1180, 760 1500"
        pathLength={1000}
        strokeDasharray="70 930"
        strokeWidth="3.5"
      />
      <path
        d="M1064 120 C 840 160, 700 40, 560 -40"
        strokeWidth="2"
        opacity="0.7"
      />
      <path
        d="M1064 170 C 860 220, 720 100, 600 -40"
        strokeWidth="1.2"
        opacity="0.5"
      />
    </g>

    {SPARKLES.map(([x, y, s], i) => (
      <path
        key={i}
        className="rq-t"
        d={`M${x} ${y - s * 2} L${x + s * 0.5} ${y - s * 0.5} L${x + s * 2} ${y} L${x + s * 0.5} ${y + s * 0.5} L${x} ${y + s * 2} L${x - s * 0.5} ${y + s * 0.5} L${x - s * 2} ${y} L${x - s * 0.5} ${y - s * 0.5} Z`}
        fill="#c9808b"
        style={{ animationDelay: `${i * 0.6}s` }}
      />
    ))}
  </svg>
);

export const RoseQuartz: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);

export default RoseQuartz;
