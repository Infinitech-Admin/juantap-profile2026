"use client";

// src/components/template-previews/desert-dune.tsx
// Desert Dune - desert sun with parallax dunes (free)
// Slug: "desert-dune" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
// and in TemplateCard.tsx (PREVIEW_ASPECT).
import React from "react";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

const THEME: CardTheme = {
  font: "'Josefin Sans', 'Segoe UI', Arial, sans-serif",
  bg: "#1a0d06",
  text: "#fff1de",
  muted: "#e5b98a",
  accent: "#f59e0b",
  accent2: "#ea580c",
  glow: "245,158,11",
  rowBg: "rgba(48,22,10,0.75)",
  rowBorder: "rgba(245,158,11,0.32)",
  panel: "#2b1409",
  barBg: "rgba(26,13,6,0.92)",
};

const CSS = `
@keyframes dd-sun   { 0%,100% { scale: 1; opacity: .95; } 50% { scale: 1.06; opacity: 1; } }
@keyframes dd-rays  { to { rotate: 360deg; } }
@keyframes dd-drift { from { translate: 0 0; } to { translate: -1024px 0; } }
@keyframes dd-dust  { 0% { translate: 0 0; opacity: 0; } 20% { opacity: .8; } 100% { translate: -900px -60px; opacity: 0; } }
.dd-sun  { transform-box: fill-box; transform-origin: center; animation: dd-sun 6s ease-in-out infinite; }
.dd-rays { transform-box: fill-box; transform-origin: center; animation: dd-rays 120s linear infinite; }
.dd-d1 { animation: dd-drift 50s linear infinite; }
.dd-d2 { animation: dd-drift 34s linear infinite; }
.dd-d3 { animation: dd-drift 22s linear infinite; }
.dd-dust { animation: dd-dust 11s linear infinite; }
@media (prefers-reduced-motion: reduce) { .dd-sun, .dd-rays, .dd-d1, .dd-d2, .dd-d3, .dd-dust { animation: none; } }
`;

const dune = (y: number, a: number) =>
  `M0 ${y} C 256 ${y - a} 768 ${y + a} 1024 ${y} S 1792 ${y - a} 2048 ${y} V1536 H0Z`;
const RAYS = Array.from({ length: 24 }, (_, i) => i * 15);
const DUST = Array.from({ length: 16 }, (_, i) => ({
  x: 1040 + ((i * 47) % 200),
  y: 1000 + ((i * 71) % 420),
  r: 1.5 + (i % 3),
  d: i * 0.7,
}));

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >
    <defs>
      <linearGradient id="dd-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1a0d06" />
        <stop offset=".4" stopColor="#5a2410" />
        <stop offset=".72" stopColor="#c2570f" />
      </linearGradient>
      <radialGradient id="dd-sunfill">
        <stop offset="0" stopColor="#fde68a" />
        <stop offset="1" stopColor="#f59e0b" />
      </radialGradient>
    </defs>
    <rect width="1024" height="1536" fill="url(#dd-bg)" />
    <g className="dd-rays">
      {RAYS.map((a) => (
        <line
          key={a}
          x1="512"
          y1="560"
          x2="512"
          y2="120"
          stroke="#fde68a"
          strokeOpacity=".22"
          strokeWidth="2"
          transform={`rotate(${a} 512 560)`}
        />
      ))}
    </g>
    <circle
      className="dd-sun"
      cx="512"
      cy="560"
      r="150"
      fill="url(#dd-sunfill)"
    />
    <circle
      cx="512"
      cy="560"
      r="195"
      fill="none"
      stroke="#fde68a"
      strokeOpacity=".4"
    />
    <g className="dd-d1">
      <path d={dune(960, 50)} fill="#8a3a0e" />
    </g>
    <g className="dd-d2">
      <path d={dune(1120, 70)} fill="#5e2509" />
    </g>
    <g className="dd-d3">
      <path d={dune(1290, 60)} fill="#33150a" />
    </g>
    {DUST.map((p, i) => (
      <circle
        key={i}
        className="dd-dust"
        style={{ animationDelay: `${p.d}s` }}
        cx={p.x}
        cy={p.y}
        r={p.r}
        fill="#fde68a"
      />
    ))}
    <rect
      x="44"
      y="44"
      width="936"
      height="1448"
      rx="20"
      fill="none"
      stroke="#f59e0b"
      strokeWidth="1.3"
      opacity=".55"
    />
  </svg>
);

export const DesertDune: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);
export default DesertDune;
