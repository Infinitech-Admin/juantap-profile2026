"use client";

// src/components/template-previews/emerald-noir.tsx
// Emerald Noir - emerald and brass art-deco sunburst (premium)
// Slug: "emerald-noir" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
// and in TemplateCard.tsx (PREVIEW_ASPECT).
import React from "react";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

const THEME: CardTheme = {
  font: "'Cinzel', 'Georgia', serif",
  bg: "#04100c",
  text: "#eaf6ee",
  muted: "#8fb8a2",
  accent: "#d4b45a",
  accent2: "#10b981",
  glow: "212,180,90",
  rowBg: "rgba(6,28,20,0.78)",
  rowBorder: "rgba(212,180,90,0.32)",
  panel: "#082219",
  barBg: "rgba(4,16,12,0.92)",
};

const CSS = `
@keyframes en-sway  { 0%,100% { rotate: -5deg; } 50% { rotate: 5deg; } }
@keyframes en-arc   { 0%,100% { opacity: .15; } 50% { opacity: .75; } }
@keyframes en-spark { 0%,100% { opacity: 0; scale: .4; } 50% { opacity: 1; scale: 1; } }
.en-rays  { transform-origin: 512px 1536px; animation: en-sway 14s ease-in-out infinite; }
.en-arc   { animation: en-arc 5s ease-in-out infinite; }
.en-spark { transform-box: fill-box; transform-origin: center; animation: en-spark 3.4s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .en-rays, .en-arc, .en-spark { animation: none; } }
`;

const RAYS = Array.from({ length: 23 }, (_, i) => -77 + i * 7);
const SPARKS = Array.from({ length: 16 }, (_, i) => ({
  x: 80 + ((i * 163) % 860),
  y: 90 + ((i * 211) % 700),
  d: (i % 8) * 0.45,
}));

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >
    <defs>
      <radialGradient id="en-bg" cx="50%" cy="100%" r="95%">
        <stop offset="0" stopColor="#0d3a2a" />
        <stop offset=".6" stopColor="#04100c" />
        <stop offset="1" stopColor="#020806" />
      </radialGradient>
      <linearGradient id="en-ray" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#d4b45a" stopOpacity=".5" />
        <stop offset="1" stopColor="#d4b45a" stopOpacity="0" />
      </linearGradient>
    </defs>
    <rect width="1024" height="1536" fill="url(#en-bg)" />
    <g className="en-rays">
      {RAYS.map((a, i) => (
        <line
          key={i}
          x1="512"
          y1="1536"
          x2="512"
          y2="-200"
          stroke="url(#en-ray)"
          strokeWidth={i % 2 ? 1.2 : 2.4}
          transform={`rotate(${a} 512 1536)`}
        />
      ))}
    </g>
    {[300, 480, 660, 840, 1020].map((r, i) => (
      <circle
        key={r}
        className="en-arc"
        style={{ animationDelay: `${i * 0.7}s` }}
        cx="512"
        cy="1536"
        r={r}
        fill="none"
        stroke="#d4b45a"
        strokeWidth="1.4"
      />
    ))}
    <rect
      x="44"
      y="44"
      width="936"
      height="1448"
      fill="none"
      stroke="#d4b45a"
      strokeWidth="1.6"
      opacity=".7"
    />
    <rect
      x="62"
      y="62"
      width="900"
      height="1412"
      fill="none"
      stroke="#10b981"
      strokeWidth="1"
      opacity=".5"
    />
    {SPARKS.map((p, i) => (
      <circle
        key={i}
        className="en-spark"
        style={{ animationDelay: `${p.d}s` }}
        cx={p.x}
        cy={p.y}
        r="3.2"
        fill="#f5dc8a"
      />
    ))}
  </svg>
);

export const EmeraldNoir: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);
export default EmeraldNoir;
