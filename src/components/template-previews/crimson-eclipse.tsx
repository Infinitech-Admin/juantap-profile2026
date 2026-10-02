"use client";

// src/components/template-previews/crimson-eclipse.tsx
// Crimson Eclipse - Total eclipse with a blazing red corona, rotating light rays and an orbiting diamond-ring flare (premium)
// Slug: "crimson-eclipse" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
// and in TemplateCard.tsx (PREVIEW_ASPECT).
import React from "react";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

const THEME: CardTheme = {
  font: "'Bodoni Moda', 'Georgia', serif",
  bg: "#0a0204",
  text: "#ffe9e9",
  muted: "#d99a9a",
  accent: "#ef4444",
  accent2: "#fb923c",
  glow: "239,68,68",
  rowBg: "rgba(40,6,10,0.78)",
  rowBorder: "rgba(239,68,68,0.35)",
  panel: "#1c0508",
  barBg: "rgba(10,2,4,0.92)",
};

const CSS = `
@keyframes ecl-spin { to { rotate: 360deg; } }
@keyframes ecl-pulse { 0%,100% { opacity: .7; scale: 1; } 50% { opacity: 1; scale: 1.06; } }
@keyframes ecl-ember { 0% { translate: 0 0; opacity: 0; } 20% { opacity: .9; } 100% { translate: 30px -900px; opacity: 0; } }
@keyframes ecl-twinkle { 0%,100% { opacity: .1; } 50% { opacity: .8; } }
.ecl-rays { transform-origin: 512px 520px; animation: ecl-spin 160s linear infinite; }
.ecl-orbit { transform-origin: 512px 520px; animation: ecl-spin 40s linear infinite; }
.ecl-corona { transform-box: fill-box; transform-origin: center; animation: ecl-pulse 5s ease-in-out infinite; }
.ecl-ember { animation: ecl-ember 10s linear infinite; }
.ecl-star { animation: ecl-twinkle 5s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .ecl-rays, .ecl-orbit, .ecl-corona, .ecl-ember, .ecl-star { animation: none; } }
`;

const RAYS = Array.from({ length: 36 }, (_, i) => ({
  a: i * 10,
  l: 120 + ((i * 53) % 260),
}));
const EMBERS = Array.from({ length: 22 }, (_, i) => ({
  x: 40 + ((i * 47) % 950),
  y: 1500 + ((i * 61) % 100),
  r: 1.5 + (i % 3),
  d: i * 0.6,
}));
const STARS = Array.from({ length: 30 }, (_, i) => ({
  x: (i * 173) % 1024,
  y: (i * 229) % 1000,
  d: (i % 6) * 0.8,
}));

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >
    <defs>
      <radialGradient id="ecl-bg" cx="50%" cy="34%" r="80%">
        <stop offset="0" stopColor="#2a0508" />
        <stop offset=".6" stopColor="#0a0204" />
        <stop offset="1" stopColor="#030001" />
      </radialGradient>
      <radialGradient id="ecl-cor">
        <stop offset=".55" stopColor="#fb923c" stopOpacity=".95" />
        <stop offset=".72" stopColor="#ef4444" stopOpacity=".5" />
        <stop offset="1" stopColor="#ef4444" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="ecl-flare">
        <stop offset="0" stopColor="#fff" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="ecl-haze" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7f1d1d" stopOpacity="0" />
        <stop offset="1" stopColor="#7f1d1d" stopOpacity=".7" />
      </linearGradient>
    </defs>
    <rect width="1024" height="1536" fill="url(#ecl-bg)" />
    {STARS.map((s, i) => (
      <circle
        key={i}
        className="ecl-star"
        style={{ animationDelay: `${s.d}s` }}
        cx={s.x}
        cy={s.y}
        r="1.6"
        fill="#fecaca"
      />
    ))}
    <g className="ecl-rays">
      {RAYS.map((r) => (
        <line
          key={r.a}
          x1="512"
          y1={520 - 200}
          x2="512"
          y2={520 - 200 - r.l}
          stroke="#fb923c"
          strokeOpacity=".35"
          strokeWidth={r.a % 30 ? 1.4 : 3}
          strokeLinecap="round"
          transform={`rotate(${r.a} 512 520)`}
        />
      ))}
    </g>
    <circle
      className="ecl-corona"
      cx="512"
      cy="520"
      r="360"
      fill="url(#ecl-cor)"
    />
    <circle cx="512" cy="520" r="190" fill="#000" />
    <circle
      cx="512"
      cy="520"
      r="192"
      fill="none"
      stroke="#fb923c"
      strokeWidth="3"
      opacity=".9"
    />
    <g className="ecl-orbit">
      <circle cx="704" cy="520" r="34" fill="url(#ecl-flare)" />
      <circle cx="704" cy="520" r="9" fill="#fff" />
    </g>
    <rect y="1000" width="1024" height="536" fill="url(#ecl-haze)" />
    {EMBERS.map((e, i) => (
      <circle
        key={i}
        className="ecl-ember"
        style={{ animationDelay: `${e.d}s` }}
        cx={e.x}
        cy={e.y}
        r={e.r}
        fill="#fb923c"
      />
    ))}
    <rect
      x="44"
      y="44"
      width="936"
      height="1448"
      fill="none"
      stroke="#ef4444"
      strokeWidth="1.4"
      opacity=".55"
    />
    <rect
      x="62"
      y="62"
      width="900"
      height="1412"
      fill="none"
      stroke="#fb923c"
      strokeWidth="1"
      opacity=".25"
    />
  </svg>
);

export const CrimsonEclipse: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);

export default CrimsonEclipse;
