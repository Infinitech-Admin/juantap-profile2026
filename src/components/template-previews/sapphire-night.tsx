"use client";

// src/components/template-previews/sapphire-night.tsx
// Sapphire Night - starry night sky with shooting stars (premium)
// Slug: "sapphire-night" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
// and in TemplateCard.tsx (PREVIEW_ASPECT).
import React from "react";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

const THEME: CardTheme = {
  font: "'Raleway', 'Segoe UI', Arial, sans-serif",
  bg: "#050b24",
  text: "#e8eeff",
  muted: "#97a8d8",
  accent: "#93b4ff",
  accent2: "#f5d98a",
  glow: "147,180,255",
  rowBg: "rgba(10,22,66,0.7)",
  rowBorder: "rgba(147,180,255,0.28)",
  panel: "#0b1a52",
  barBg: "rgba(5,11,36,0.92)",
};

const CSS = `
@keyframes sn-twinkle { 0%,100% { opacity: .2; } 50% { opacity: 1; } }
@keyframes sn-shoot   { 0% { translate: 0 0; opacity: 0; } 4% { opacity: 1; } 16% { translate: -760px 760px; opacity: 0; } 100% { translate: -760px 760px; opacity: 0; } }
@keyframes sn-halo    { 0%,100% { opacity: .35; scale: 1; } 50% { opacity: .7; scale: 1.08; } }
.sn-star  { animation: sn-twinkle 4s ease-in-out infinite; }
.sn-shoot { animation: sn-shoot 9s linear infinite; }
.sn-halo  { transform-box: fill-box; transform-origin: center; animation: sn-halo 6s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .sn-star, .sn-shoot, .sn-halo { animation: none; } }
`;

const STARS = Array.from({ length: 72 }, (_, i) => ({
  x: (i * 137) % 1024,
  y: (i * 263) % 1420,
  r: 0.9 + (i % 3) * 0.8,
  d: (i % 9) * 0.45,
}));
const SHOOTS = [
  { x: 900, y: 120, d: 1 },
  { x: 980, y: 480, d: 4.5 },
  { x: 700, y: 60, d: 7 },
];

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >
    <defs>
      <linearGradient id="sn-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#050b24" />
        <stop offset=".6" stopColor="#0b1d4d" />
        <stop offset="1" stopColor="#13306e" />
      </linearGradient>
      <radialGradient id="sn-glow">
        <stop offset="0" stopColor="#93b4ff" stopOpacity=".5" />
        <stop offset="1" stopColor="#93b4ff" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="sn-tail" x1="0" x2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#fff" />
      </linearGradient>
      <mask id="sn-moon">
        <rect width="1024" height="1536" fill="#fff" />
        <circle cx="838" cy="232" r="64" fill="#000" />
      </mask>
    </defs>
    <rect width="1024" height="1536" fill="url(#sn-bg)" />
    <circle
      className="sn-halo"
      cx="800"
      cy="250"
      r="230"
      fill="url(#sn-glow)"
    />
    <circle cx="800" cy="250" r="78" fill="#e8eeff" mask="url(#sn-moon)" />
    {STARS.map((s, i) => (
      <circle
        key={i}
        className="sn-star"
        style={{ animationDelay: `${s.d}s` }}
        cx={s.x}
        cy={s.y}
        r={s.r}
        fill="#fff"
      />
    ))}
    {SHOOTS.map((s, i) => (
      <g key={i} className="sn-shoot" style={{ animationDelay: `${s.d}s` }}>
        <line
          x1={s.x - 120}
          y1={s.y - 120}
          x2={s.x}
          y2={s.y}
          stroke="url(#sn-tail)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </g>
    ))}
    <path
      d="M0 1400 L180 1230 L320 1340 L520 1120 L720 1320 L860 1200 L1024 1330 V1536 H0Z"
      fill="#050b24"
      opacity=".85"
    />
    <rect
      x="44"
      y="44"
      width="936"
      height="1448"
      rx="20"
      fill="none"
      stroke="#93b4ff"
      strokeWidth="1.2"
      opacity=".4"
    />
  </svg>
);

export const SapphireNight: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);
export default SapphireNight;
