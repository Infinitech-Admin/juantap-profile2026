"use client";

// src/components/template-previews/lavender-dream.tsx
// Lavender Dream - Dreamy lavender gradient with drifting colour blobs and twinkling sparkles (free)
// Slug: "lavender-dream" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
// and in TemplateCard.tsx (PREVIEW_ASPECT).
import React from "react";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

const THEME: CardTheme = {
  font: "'Quicksand', 'Segoe UI', Arial, sans-serif",
  bg: "#f5f0ff",
  text: "#2e1065",
  muted: "#7c6aa8",
  accent: "#8b5cf6",
  accent2: "#f0abfc",
  glow: "139,92,246",
  rowBg: "rgba(255,255,255,0.8)",
  rowBorder: "rgba(139,92,246,0.28)",
  panel: "#ffffff",
  barBg: "rgba(255,255,255,0.9)",
};

const CSS = `
@keyframes lvd-d1 { 0%,100% { translate: 0 0; } 50% { translate: 90px 70px; } }
@keyframes lvd-d2 { 0%,100% { translate: 0 0; } 50% { translate: -100px 50px; } }
@keyframes lvd-d3 { 0%,100% { translate: 0 0; } 50% { translate: 70px -80px; } }
@keyframes lvd-tw { 0%,100% { opacity: 0; scale: .3; } 50% { opacity: 1; scale: 1; } }
.lvd-d1 { animation: lvd-d1 14s ease-in-out infinite; }
.lvd-d2 { animation: lvd-d2 18s ease-in-out infinite; }
.lvd-d3 { animation: lvd-d3 16s ease-in-out infinite; }
.lvd-tw { transform-box: fill-box; transform-origin: center; animation: lvd-tw 3.6s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .lvd-d1, .lvd-d2, .lvd-d3, .lvd-tw { animation: none; } }
`;

const SPARKS = Array.from({ length: 16 }, (_, i) => ({ x: 60 + ((i * 173) % 900), y: 80 + ((i * 251) % 1380), d: (i % 8) * 0.45 }));

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >

    <defs>
      <linearGradient id="lvd-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f8f4ff" /><stop offset="1" stopColor="#e9ddff" /></linearGradient>
      <radialGradient id="lvd-1"><stop offset="0" stopColor="#c4b5fd" stopOpacity=".8" /><stop offset="1" stopColor="#c4b5fd" stopOpacity="0" /></radialGradient>
      <radialGradient id="lvd-2"><stop offset="0" stopColor="#f0abfc" stopOpacity=".6" /><stop offset="1" stopColor="#f0abfc" stopOpacity="0" /></radialGradient>
      <radialGradient id="lvd-3"><stop offset="0" stopColor="#93c5fd" stopOpacity=".55" /><stop offset="1" stopColor="#93c5fd" stopOpacity="0" /></radialGradient>
    </defs>
    <rect width="1024" height="1536" fill="url(#lvd-bg)" />
    <circle className="lvd-d1" cx="180" cy="280" r="400" fill="url(#lvd-1)" />
    <circle className="lvd-d2" cx="860" cy="800" r="420" fill="url(#lvd-2)" />
    <circle className="lvd-d3" cx="300" cy="1300" r="420" fill="url(#lvd-3)" />
    <g fill="none" stroke="#8b5cf6" strokeWidth="1.4" opacity=".3">
      <path d="M-40 520 C 240 380 520 700 1060 480" /><path d="M-40 1100 C 280 960 600 1260 1060 1060" />
    </g>
    {SPARKS.map((s, i) => (<path key={i} className="lvd-tw" style={{ animationDelay: `${s.d}s` }} d={`M${s.x} ${s.y - 14}V${s.y + 14}M${s.x - 14} ${s.y}H${s.x + 14}`} stroke="#8b5cf6" strokeWidth="2.4" strokeLinecap="round" />))}
    <rect x="44" y="44" width="936" height="1448" rx="30" fill="none" stroke="#8b5cf6" strokeWidth="1.2" opacity=".35" />
  </svg>
);

export const LavenderDream: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);

export default LavenderDream;
