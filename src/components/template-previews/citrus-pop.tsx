"use client";

// src/components/template-previews/citrus-pop.tsx
// Citrus Pop - Bright and playful orange-yellow card with slowly spinning citrus slices and bobbing dots (free)
// Slug: "citrus-pop" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
// and in TemplateCard.tsx (PREVIEW_ASPECT).
import React from "react";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

const THEME: CardTheme = {
  font: "'Fredoka', 'Segoe UI', Arial, sans-serif",
  bg: "#fff7e0",
  text: "#431407",
  muted: "#9a5b2e",
  accent: "#f97316",
  accent2: "#facc15",
  glow: "249,115,22",
  rowBg: "rgba(255,255,255,0.85)",
  rowBorder: "rgba(249,115,22,0.3)",
  panel: "#ffffff",
  barBg: "rgba(255,251,240,0.92)",
};

const CSS = `
@keyframes ctr-spin { to { rotate: 360deg; } }
@keyframes ctr-bob { 0%,100% { translate: 0 0; } 50% { translate: 0 -22px; } }
.ctr-s1 { transform-box: fill-box; transform-origin: center; animation: ctr-spin 40s linear infinite; }
.ctr-s2 { transform-box: fill-box; transform-origin: center; animation: ctr-spin 55s linear infinite reverse; }
.ctr-dot { animation: ctr-bob 4s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .ctr-s1, .ctr-s2, .ctr-dot { animation: none; } }
`;

const SEG = Array.from({ length: 10 }, (_, i) => i * 36);
const SLICES: [number, number, number, string, string][] = [[880, 200, 130, 'ctr-s1', '#fb923c'], [110, 1330, 160, 'ctr-s2', '#fbbf24'], [920, 1250, 80, 'ctr-s1', '#a3e635']];
const DOTS: [number, number, number, string][] = [[200, 360, 14, '#f97316'], [700, 520, 10, '#facc15'], [120, 820, 12, '#a3e635'], [900, 760, 16, '#fb923c'], [520, 1180, 10, '#f97316']];

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >

    <rect width="1024" height="1536" fill="#fff7e0" />
    <circle cx="512" cy="760" r="520" fill="#ffedb8" opacity=".6" />
    {SLICES.map(([x, y, r, cls, c], i) => (
      <g key={i} className={cls}>
        <circle cx={x} cy={y} r={r} fill={c} />
        <circle cx={x} cy={y} r={r * 0.9} fill="#fff7e0" opacity=".9" />
        <circle cx={x} cy={y} r={r * 0.82} fill={c} opacity=".55" />
        {SEG.map((a) => (<line key={a} x1={x} y1={y} x2={x} y2={y - r * 0.82} stroke="#fff7e0" strokeWidth={r * 0.03} transform={`rotate(${a} ${x} ${y})`} />))}
        <circle cx={x} cy={y} r={r * 0.08} fill="#fff7e0" />
      </g>
    ))}
    {DOTS.map(([x, y, r, c], i) => (<circle key={i} className="ctr-dot" style={{ animationDelay: `${i * 0.6}s` }} cx={x} cy={y} r={r} fill={c} />))}
    <rect x="44" y="44" width="936" height="1448" rx="34" fill="none" stroke="#f97316" strokeWidth="3" opacity=".45" />
  </svg>
);

export const CitrusPop: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);

export default CitrusPop;
