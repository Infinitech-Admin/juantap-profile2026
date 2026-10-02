"use client";

// src/components/template-previews/rose-gold-silk.tsx
// Rose Gold Silk - blush card with flowing silk waves (free)
// Slug: "rose-gold-silk" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
// and in TemplateCard.tsx (PREVIEW_ASPECT).
import React from "react";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

const THEME: CardTheme = {
  font: "'Cormorant Garamond', 'Georgia', serif",
  bg: "#fbeeea",
  text: "#4a2a2a",
  muted: "#94696a",
  accent: "#b76e79",
  accent2: "#e8b4b8",
  glow: "183,110,121",
  rowBg: "rgba(255,255,255,0.82)",
  rowBorder: "rgba(183,110,121,0.3)",
  panel: "#fff7f5",
  barBg: "rgba(255,247,245,0.92)",
};

const CSS = `
@keyframes sk-drift { from { translate: 0 0; } to { translate: -1024px 0; } }
@keyframes sk-up    { 0% { translate: 0 0; opacity: 0; } 20% { opacity: .7; } 100% { translate: 20px -1500px; opacity: 0; } }
.sk-w1 { animation: sk-drift 22s linear infinite; }
.sk-w2 { animation: sk-drift 30s linear infinite reverse; }
.sk-w3 { animation: sk-drift 38s linear infinite; }
.sk-w4 { animation: sk-drift 48s linear infinite reverse; }
.sk-bub { animation: sk-up 14s ease-in infinite; }
@media (prefers-reduced-motion: reduce) { .sk-w1, .sk-w2, .sk-w3, .sk-w4, .sk-bub { animation: none; } }
`;

const wave = (y: number, a: number) =>
  `M0 ${y} C 256 ${y - a} 768 ${y + a} 1024 ${y} S 1792 ${y + a} 2048 ${y} V1536 H0Z`;
const BUBBLES = Array.from({ length: 12 }, (_, i) => ({
  x: 60 + ((i * 89) % 900),
  y: 1580 + ((i * 53) % 200),
  r: 6 + (i % 4) * 5,
  d: i * 1.2,
}));

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >
    <defs>
      <linearGradient id="sk-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff6f3" />
        <stop offset="1" stopColor="#f6d9d3" />
      </linearGradient>
      <linearGradient id="sk-g1" x1="0" x2="1">
        <stop offset="0" stopColor="#e8b4b8" />
        <stop offset=".5" stopColor="#f6d6cf" />
        <stop offset="1" stopColor="#d99aa2" />
      </linearGradient>
      <linearGradient id="sk-g2" x1="0" x2="1">
        <stop offset="0" stopColor="#d99aa2" />
        <stop offset=".5" stopColor="#c58089" />
        <stop offset="1" stopColor="#e8b4b8" />
      </linearGradient>
    </defs>
    <rect width="1024" height="1536" fill="url(#sk-bg)" />
    <g className="sk-w1" opacity=".55">
      <path
        d={wave(150, 70)}
        fill="url(#sk-g1)"
        transform="translate(0 -60) scale(1 .22)"
      />
    </g>
    <g className="sk-w2" opacity=".5">
      <path d={wave(1170, 90)} fill="url(#sk-g1)" />
    </g>
    <g className="sk-w3" opacity=".7">
      <path d={wave(1270, 70)} fill="url(#sk-g2)" />
    </g>
    <g className="sk-w4" opacity=".9">
      <path d={wave(1380, 60)} fill="#b76e79" />
    </g>
    {BUBBLES.map((b, i) => (
      <circle
        key={i}
        className="sk-bub"
        style={{ animationDelay: `${b.d}s` }}
        cx={b.x}
        cy={b.y}
        r={b.r}
        fill="#fff"
        fillOpacity=".5"
        stroke="#b76e79"
        strokeOpacity=".4"
      />
    ))}
    <rect
      x="44"
      y="44"
      width="936"
      height="1448"
      rx="28"
      fill="none"
      stroke="#b76e79"
      strokeWidth="1.4"
      opacity=".55"
    />
  </svg>
);

export const RoseGoldSilk: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);
export default RoseGoldSilk;
