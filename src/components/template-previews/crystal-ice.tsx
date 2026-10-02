"use client";

// src/components/template-previews/crystal-ice.tsx
// Crystal Ice - faceted ice crystal with sparkles (free)
// Slug: "crystal-ice" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
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
  bg: "#04101e",
  text: "#eaf6ff",
  muted: "#8fb4d4",
  accent: "#7dd3fc",
  accent2: "#c4b5fd",
  glow: "125,211,252",
  rowBg: "rgba(10,36,64,0.6)",
  rowBorder: "rgba(125,211,252,0.3)",
  panel: "#0a2540",
  barBg: "rgba(4,16,30,0.9)",
};

const CSS = `
@keyframes ci-facet { 0%,100% { opacity: .05; } 50% { opacity: .3; } }
@keyframes ci-glint { 0%,100% { opacity: 0; scale: .3; rotate: 0deg; } 50% { opacity: 1; scale: 1; rotate: 45deg; } }
@keyframes ci-spin  { to { rotate: 360deg; } }
.ci-facet { animation: ci-facet 6s ease-in-out infinite; }
.ci-glint { transform-box: fill-box; transform-origin: center; animation: ci-glint 3.6s ease-in-out infinite; }
.ci-spin  { transform-box: fill-box; transform-origin: center; animation: ci-spin 90s linear infinite; }
@media (prefers-reduced-motion: reduce) { .ci-facet, .ci-glint, .ci-spin { animation: none; } .ci-facet { opacity: .15; } }
`;

const FACETS = [
  "0,0 420,0 260,300",
  "420,0 1024,0 760,340",
  "0,0 260,300 0,620",
  "1024,0 760,340 1024,700",
  "0,620 260,300 380,760",
  "1024,700 760,340 640,820",
  "0,1536 0,1100 340,1300",
  "1024,1536 1024,1080 700,1320",
  "340,1300 700,1320 512,1536",
  "0,1100 340,1300 0,1536",
];
const GLINTS = Array.from({ length: 18 }, (_, i) => ({
  x: 60 + ((i * 181) % 900),
  y: 80 + ((i * 257) % 1380),
  d: (i % 9) * 0.4,
}));
const hex = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >
    <defs>
      <linearGradient id="ci-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#04101e" />
        <stop offset=".55" stopColor="#0a2540" />
        <stop offset="1" stopColor="#0c3a5e" />
      </linearGradient>
    </defs>
    <rect width="1024" height="1536" fill="url(#ci-bg)" />
    {FACETS.map((p, i) => (
      <polygon
        key={i}
        className="ci-facet"
        style={{ animationDelay: `${i * 0.6}s` }}
        points={p}
        fill={i % 2 ? "#c4b5fd" : "#7dd3fc"}
        stroke="#bae6fd"
        strokeOpacity=".25"
        strokeWidth="1"
      />
    ))}
    <polygon
      className="ci-spin"
      points={hex(512, 760, 360)}
      fill="none"
      stroke="#bae6fd"
      strokeOpacity=".25"
      strokeWidth="1.4"
    />
    <polygon
      className="ci-spin"
      style={{ animationDirection: "reverse" }}
      points={hex(512, 760, 250)}
      fill="none"
      stroke="#7dd3fc"
      strokeOpacity=".3"
      strokeWidth="1"
      strokeDasharray="4 10"
    />
    {GLINTS.map((g, i) => (
      <path
        key={i}
        className="ci-glint"
        style={{ animationDelay: `${g.d}s` }}
        d={`M${g.x} ${g.y - 16}V${g.y + 16}M${g.x - 16} ${g.y}H${g.x + 16}`}
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
      />
    ))}
    <rect
      x="44"
      y="44"
      width="936"
      height="1448"
      rx="6"
      fill="none"
      stroke="#bae6fd"
      strokeWidth="1.2"
      opacity=".4"
    />
  </svg>
);

export const CrystalIce: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);
export default CrystalIce;
