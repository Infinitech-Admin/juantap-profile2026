"use client";

// src/components/template-previews/sakura-night.tsx
// Sakura Night - Cherry blossom branch under a glowing moon with falling petals and warm paper lanterns (premium)
// Slug: "sakura-night" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
// and in TemplateCard.tsx (PREVIEW_ASPECT).
import React from "react";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

const THEME: CardTheme = {
  font: "'Shippori Mincho', 'Georgia', serif",
  bg: "#130a1f",
  text: "#fff0f6",
  muted: "#e0a8c4",
  accent: "#f9a8d4",
  accent2: "#fde68a",
  glow: "249,168,212",
  rowBg: "rgba(40,14,48,0.74)",
  rowBorder: "rgba(249,168,212,0.34)",
  panel: "#240f33",
  barBg: "rgba(19,10,31,0.92)",
};

const CSS = `
@keyframes skr-fall { 0% { translate: 0 0; rotate: 0deg; opacity: 0; } 8% { opacity: .95; } 100% { translate: -280px 1700px; rotate: 640deg; opacity: .95; } }
@keyframes skr-sway { 0%,100% { rotate: -1.4deg; } 50% { rotate: 1.4deg; } }
@keyframes skr-glow { 0%,100% { opacity: .55; scale: 1; } 50% { opacity: 1; scale: 1.1; } }
.skr-petal { transform-box: fill-box; transform-origin: center; animation: skr-fall 12s linear infinite; }
.skr-branch { transform-origin: -30px 120px; animation: skr-sway 7s ease-in-out infinite; }
.skr-glow { transform-box: fill-box; transform-origin: center; animation: skr-glow 4s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .skr-petal, .skr-branch, .skr-glow { animation: none; } }
`;

const PETALS = Array.from({ length: 22 }, (_, i) => ({
  x: (i * 97) % 1100,
  y: -60 - ((i * 53) % 400),
  d: (i * 0.9) % 12,
  t: 11 + (i % 5) * 2,
  s: 0.8 + (i % 3) * 0.4,
}));
const BLOSSOMS: [number, number, number][] = [
  [180, 170, 22],
  [230, 205, 16],
  [330, 235, 24],
  [410, 190, 18],
  [500, 170, 22],
  [600, 135, 18],
  [690, 170, 24],
  [760, 195, 16],
  [130, 150, 14],
  [560, 210, 14],
];
const LANTERNS: [number, number][] = [
  [150, 1330],
  [512, 1400],
  [880, 1320],
];

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >
    <defs>
      <linearGradient id="skr-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0d0620" />
        <stop offset=".6" stopColor="#2a0f3d" />
        <stop offset="1" stopColor="#4a1747" />
      </linearGradient>
      <radialGradient id="skr-moon">
        <stop offset="0" stopColor="#fff1f6" stopOpacity=".5" />
        <stop offset="1" stopColor="#fff1f6" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="skr-lan">
        <stop offset="0" stopColor="#fde68a" stopOpacity=".8" />
        <stop offset="1" stopColor="#fde68a" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="1024" height="1536" fill="url(#skr-bg)" />
    <circle
      className="skr-glow"
      cx="790"
      cy="470"
      r="230"
      fill="url(#skr-moon)"
    />
    <circle cx="790" cy="470" r="96" fill="#fff1f6" />
    <circle cx="760" cy="445" r="14" fill="#f5d0e0" opacity=".6" />
    <circle cx="815" cy="500" r="20" fill="#f5d0e0" opacity=".5" />
    <g className="skr-branch">
      <path
        d="M-30 120 C 160 150 280 230 420 190 S 620 120 780 200 M280 230 C 300 300 340 330 380 350 M600 140 C 640 90 700 70 760 80"
        fill="none"
        stroke="#2b1226"
        strokeWidth="14"
        strokeLinecap="round"
      />
      {BLOSSOMS.map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill="#f9a8d4" opacity=".92" />
          <circle cx={x} cy={y} r={r * 0.4} fill="#fde68a" opacity=".9" />
        </g>
      ))}
    </g>
    {PETALS.map((p, i) => (
      <g key={i} transform={`translate(${p.x} ${p.y}) scale(${p.s})`}>
        <ellipse
          className="skr-petal"
          style={{ animationDelay: `${p.d}s`, animationDuration: `${p.t}s` }}
          rx="11"
          ry="6"
          fill="#f9a8d4"
        />
      </g>
    ))}
    {LANTERNS.map(([x, y], i) => (
      <g key={i}>
        <line
          x1={x}
          y1={y - 120}
          x2={x}
          y2={y - 34}
          stroke="#fde68a"
          strokeOpacity=".5"
        />
        <circle
          className="skr-glow"
          style={{ animationDelay: `${i * 0.9}s` }}
          cx={x}
          cy={y}
          r="90"
          fill="url(#skr-lan)"
        />
        <rect
          x={x - 22}
          y={y - 34}
          width="44"
          height="62"
          rx="18"
          fill="#f97316"
          opacity=".92"
        />
        <rect
          x={x - 22}
          y={y - 4}
          width="44"
          height="3"
          fill="#7c2d12"
          opacity=".6"
        />
      </g>
    ))}
    <rect
      x="44"
      y="44"
      width="936"
      height="1448"
      rx="24"
      fill="none"
      stroke="#f9a8d4"
      strokeWidth="1.2"
      opacity=".4"
    />
  </svg>
);

export const SakuraNight: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);

export default SakuraNight;
