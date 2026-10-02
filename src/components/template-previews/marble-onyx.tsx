"use client";

// src/components/template-previews/marble-onyx.tsx
// Marble Onyx - white marble with gold veins (premium)
// Slug: "marble-onyx" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
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
  bg: "#f5f3ee",
  text: "#1c1917",
  muted: "#78716c",
  accent: "#a8863a",
  accent2: "#1c1917",
  glow: "168,134,58",
  rowBg: "rgba(255,255,255,0.88)",
  rowBorder: "rgba(168,134,58,0.35)",
  panel: "#ffffff",
  barBg: "rgba(255,255,255,0.92)",
};

const CSS = `
@keyframes mo-draw  { from { stroke-dashoffset: 1000; } to { stroke-dashoffset: 0; } }
@keyframes mo-lap   { to { stroke-dashoffset: -1000; } }
@keyframes mo-fleck { 0%,100% { translate: 0 0; opacity: .3; } 50% { translate: 14px -22px; opacity: 1; } }
.mo-v1 { stroke-dasharray: 1000; animation: mo-draw 3.6s ease-out .2s both; }
.mo-v2 { stroke-dasharray: 1000; animation: mo-draw 4.4s ease-out .7s both; }
.mo-v3 { stroke-dasharray: 1000; animation: mo-draw 5s ease-out 1.1s both; }
.mo-gold { stroke-dasharray: 1000; animation: mo-draw 5.5s ease-out 1.6s both; }
.mo-lap { stroke-dasharray: 90 910; animation: mo-lap 9s linear infinite; }
.mo-fleck { animation: mo-fleck 7s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .mo-v1, .mo-v2, .mo-v3, .mo-gold { animation: none; stroke-dashoffset: 0; } .mo-lap, .mo-fleck { animation: none; } }
`;

const FLECKS = Array.from({ length: 14 }, (_, i) => ({
  x: 60 + ((i * 131) % 900),
  y: 100 + ((i * 227) % 1340),
  r: 1.6 + (i % 3),
  d: i * 0.55,
}));

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >
    <defs>
      <linearGradient id="mo-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fbfaf7" />
        <stop offset=".5" stopColor="#f1eee7" />
        <stop offset="1" stopColor="#e7e3da" />
      </linearGradient>
      <linearGradient id="mo-gold" x1="0" x2="1">
        <stop offset="0" stopColor="#c9a24a" />
        <stop offset=".5" stopColor="#e8cf82" />
        <stop offset="1" stopColor="#a8863a" />
      </linearGradient>
    </defs>
    <rect width="1024" height="1536" fill="url(#mo-bg)" />
    <g fill="none" strokeLinecap="round">
      <path
        className="mo-v1"
        pathLength={1000}
        d="M-20 180 C 200 240, 300 80, 520 260 S 800 420, 1060 300"
        stroke="#78716c"
        strokeWidth="2.2"
        opacity=".35"
      />
      <path
        className="mo-v2"
        pathLength={1000}
        d="M120 -20 C 180 300, 40 520, 260 760 S 420 1100, 300 1560"
        stroke="#44403c"
        strokeWidth="1.6"
        opacity=".3"
      />
      <path
        className="mo-v3"
        pathLength={1000}
        d="M1060 700 C 820 760, 760 980, 540 1060 S 220 1280, -20 1240"
        stroke="#78716c"
        strokeWidth="2"
        opacity=".3"
      />
      <path
        className="mo-gold"
        pathLength={1000}
        d="M-20 1000 C 240 940, 420 1140, 640 1000 S 900 820, 1060 900"
        stroke="url(#mo-gold)"
        strokeWidth="3"
      />
      <path
        className="mo-gold"
        pathLength={1000}
        d="M700 -20 C 640 240, 860 420, 780 640"
        stroke="url(#mo-gold)"
        strokeWidth="1.8"
      />
    </g>
    {FLECKS.map((f, i) => (
      <circle
        key={i}
        className="mo-fleck"
        style={{ animationDelay: `${f.d}s` }}
        cx={f.x}
        cy={f.y}
        r={f.r}
        fill="#c9a24a"
      />
    ))}
    <rect
      x="44"
      y="44"
      width="936"
      height="1448"
      fill="none"
      stroke="#a8863a"
      strokeWidth="1.2"
      opacity=".5"
    />
    <rect
      x="60"
      y="60"
      width="904"
      height="1416"
      fill="none"
      stroke="#1c1917"
      strokeWidth="1"
      opacity=".25"
    />
    <rect
      className="mo-lap"
      pathLength={1000}
      x="44"
      y="44"
      width="936"
      height="1448"
      fill="none"
      stroke="url(#mo-gold)"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
);

export const MarbleOnyx: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);
export default MarbleOnyx;
