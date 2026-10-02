"use client";

// src/components/template-previews/pastel-clouds.tsx
// Pastel Clouds - Soft sky-blue card with drifting clouds, a gentle sun and pastel hills (free)
// Slug: "pastel-clouds" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
// and in TemplateCard.tsx (PREVIEW_ASPECT).
import React from "react";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

const THEME: CardTheme = {
  font: "'Poppins', 'Segoe UI', Arial, sans-serif",
  bg: "#e6f2ff",
  text: "#1e3a5f",
  muted: "#5b7ea8",
  accent: "#3b82f6",
  accent2: "#fbbf24",
  glow: "59,130,246",
  rowBg: "rgba(255,255,255,0.82)",
  rowBorder: "rgba(59,130,246,0.25)",
  panel: "#ffffff",
  barBg: "rgba(255,255,255,0.9)",
};

const CSS = `
@keyframes pcl-drift { from { translate: -420px 0; } to { translate: 1500px 0; } }
@keyframes pcl-sun { 0%,100% { scale: 1; opacity: .9; } 50% { scale: 1.08; opacity: 1; } }
.pcl-cloud { animation: pcl-drift 60s linear infinite; }
.pcl-sun { transform-box: fill-box; transform-origin: center; animation: pcl-sun 6s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .pcl-cloud, .pcl-sun { animation: none; } }
`;

const CLOUDS = [
  { y: 160, s: 1.2, d: 0, t: 70 }, { y: 420, s: 0.8, d: 25, t: 55 }, { y: 760, s: 1.0, d: 12, t: 80 },
  { y: 1020, s: 0.7, d: 40, t: 65 }, { y: 1230, s: 1.1, d: 5, t: 90 },
];

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >

    <defs>
      <linearGradient id="pcl-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9ecbff" /><stop offset=".6" stopColor="#dcedff" /><stop offset="1" stopColor="#fff1e6" /></linearGradient>
      <radialGradient id="pcl-sunglow"><stop offset="0" stopColor="#fde68a" stopOpacity=".9" /><stop offset="1" stopColor="#fde68a" stopOpacity="0" /></radialGradient>
    </defs>
    <rect width="1024" height="1536" fill="url(#pcl-sky)" />
    <circle className="pcl-sun" cx="830" cy="200" r="220" fill="url(#pcl-sunglow)" />
    <circle cx="830" cy="200" r="70" fill="#fde68a" />
    {CLOUDS.map((c, i) => (
      <g key={i} className="pcl-cloud" style={{ animationDuration: `${c.t}s`, animationDelay: `-${c.d}s` }}>
        <g transform={`translate(0 ${c.y}) scale(${c.s})`} fill="#fff" opacity=".9">
          <circle cx="60" cy="40" r="40" /><circle cx="110" cy="20" r="52" /><circle cx="170" cy="40" r="42" /><rect x="40" y="40" width="150" height="42" rx="21" />
        </g>
      </g>
    ))}
    <path d="M0 1380 C 200 1300 420 1360 620 1300 S 900 1280 1024 1330 V1536 H0Z" fill="#c7e6d3" />
    <path d="M0 1450 C 240 1390 480 1450 700 1400 S 940 1390 1024 1430 V1536 H0Z" fill="#a8d5ba" />
    <rect x="44" y="44" width="936" height="1448" rx="28" fill="none" stroke="#3b82f6" strokeWidth="1.2" opacity=".3" />
  </svg>
);

export const PastelClouds: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);

export default PastelClouds;
