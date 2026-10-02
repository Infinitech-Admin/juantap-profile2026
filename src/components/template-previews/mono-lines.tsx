"use client";

// src/components/template-previews/mono-lines.tsx
// Mono Lines - Minimal black-on-white card with flowing line waves and a single red pulse (free)
// Slug: "mono-lines" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
// and in TemplateCard.tsx (PREVIEW_ASPECT).
import React from "react";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

const THEME: CardTheme = {
  font: "'Inter', 'Segoe UI', Arial, sans-serif",
  bg: "#fafafa",
  text: "#0a0a0a",
  muted: "#737373",
  accent: "#0a0a0a",
  accent2: "#dc2626",
  glow: "10,10,10",
  rowBg: "rgba(255,255,255,0.92)",
  rowBorder: "rgba(10,10,10,0.14)",
  panel: "#ffffff",
  barBg: "rgba(255,255,255,0.92)",
};

const CSS = `
@keyframes mnl-draw { from { stroke-dashoffset: 1000; } to { stroke-dashoffset: 0; } }
@keyframes mnl-flow { 0%,100% { translate: -22px 0; } 50% { translate: 22px 0; } }
@keyframes mnl-pulse { 0% { scale: 1; opacity: .7; } 100% { scale: 3.2; opacity: 0; } }
.mnl-l { stroke-dasharray: 1000; animation: mnl-draw 2.8s ease-out both; }
.mnl-g { animation: mnl-flow 9s ease-in-out infinite; }
.mnl-ring { transform-box: fill-box; transform-origin: center; animation: mnl-pulse 3s ease-out infinite; }
@media (prefers-reduced-motion: reduce) { .mnl-l, .mnl-g, .mnl-ring { animation: none; } }
`;

const TOP = Array.from({ length: 14 }, (_, i) => 110 + i * 24);
const BOT = Array.from({ length: 14 }, (_, i) => 1110 + i * 24);
const line = (y: number, k: number) => `M-40 ${y} C 200 ${y - 30 - k}, 400 ${y + 30 + k}, 620 ${y} S 900 ${y - 24 - k}, 1070 ${y}`;

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >

    <rect width="1024" height="1536" fill="#fafafa" />
    {TOP.map((y, i) => (
      <g key={y} className="mnl-g" style={{ animationDelay: `${-i * 0.5}s` }}>
        <path className="mnl-l" pathLength={1000} style={{ animationDelay: `${i * 0.08}s` }} d={line(y, i * 2)} fill="none" stroke="#0a0a0a" strokeWidth="1.4" opacity={0.25 + i * 0.04} />
      </g>
    ))}
    {BOT.map((y, i) => (
      <g key={y} className="mnl-g" style={{ animationDelay: `${-i * 0.5 - 3}s` }}>
        <path className="mnl-l" pathLength={1000} style={{ animationDelay: `${i * 0.08 + 0.5}s` }} d={line(y, (13 - i) * 2)} fill="none" stroke="#0a0a0a" strokeWidth="1.4" opacity={0.7 - i * 0.04} />
      </g>
    ))}
    <circle className="mnl-ring" cx="900" cy="640" r="10" fill="none" stroke="#dc2626" strokeWidth="2" />
    <circle cx="900" cy="640" r="7" fill="#dc2626" />
    <rect x="44" y="44" width="936" height="1448" fill="none" stroke="#0a0a0a" strokeWidth="1" opacity=".5" />
  </svg>
);

export const MonoLines: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);

export default MonoLines;
