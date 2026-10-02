"use client";

// src/components/template-previews/tropical-leaves.tsx
// Tropical Leaves - Deep jungle green with swaying palm leaves and golden light specks (free)
// Slug: "tropical-leaves" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
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
  bg: "#052e1f",
  text: "#ecfdf5",
  muted: "#86d9b2",
  accent: "#34d399",
  accent2: "#fbbf24",
  glow: "52,211,153",
  rowBg: "rgba(6,50,34,0.75)",
  rowBorder: "rgba(52,211,153,0.32)",
  panel: "#07402b",
  barBg: "rgba(5,46,31,0.92)",
};

const CSS = `
@keyframes trp-sway { 0%,100% { rotate: -4deg; } 50% { rotate: 5deg; } }
@keyframes trp-speck { 0%,100% { translate: 0 0; opacity: .2; } 50% { translate: 16px -24px; opacity: 1; } }
.trp-leaf { transform-box: fill-box; transform-origin: 0% 100%; animation: trp-sway 7s ease-in-out infinite; }
.trp-speck { animation: trp-speck 6s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .trp-leaf, .trp-speck { animation: none; } }
`;

const LEAVES: [number, number, number, number, string][] = [
  [-30, 330, -35, 1.1, "#10b981"], [-30, 330, 10, 1.3, "#059669"], [-20, 560, -5, 0.9, "#34d399"],
  [1050, 260, 215, 1.1, "#10b981"], [1050, 260, 170, 1.3, "#059669"],
  [-30, 1560, -60, 1.5, "#059669"], [-30, 1560, -20, 1.2, "#10b981"],
  [1054, 1560, 240, 1.5, "#059669"], [1054, 1560, 200, 1.2, "#10b981"], [520, 1580, -90, 0.9, "#34d399"],
];
const SPECKS = Array.from({ length: 16 }, (_, i) => ({ x: 60 + ((i * 127) % 900), y: 100 + ((i * 211) % 1340), r: 1.8 + (i % 3), d: (i % 8) * 0.7 }));

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >

    <defs>
      <linearGradient id="trp-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0a4a30" /><stop offset=".5" stopColor="#052e1f" /><stop offset="1" stopColor="#021a11" /></linearGradient>
    </defs>
    <rect width="1024" height="1536" fill="url(#trp-bg)" />
    {LEAVES.map(([x, y, rot, s, c], i) => (
      <g key={i} transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
        <g className="trp-leaf" style={{ animationDelay: `${-i * 0.9}s` }}>
          <path d="M0 0 C 40 -150 200 -230 320 -200 C 290 -80 150 -10 0 0Z" fill={c} opacity=".85" />
          <path d="M0 0 C 90 -70 190 -130 300 -190" fill="none" stroke="#d1fae5" strokeOpacity=".5" strokeWidth="2" />
        </g>
      </g>
    ))}
    {SPECKS.map((p, i) => (<circle key={i} className="trp-speck" style={{ animationDelay: `${p.d}s` }} cx={p.x} cy={p.y} r={p.r} fill="#fbbf24" />))}
    <rect x="44" y="44" width="936" height="1448" rx="24" fill="none" stroke="#34d399" strokeWidth="1.2" opacity=".4" />
  </svg>
);

export const TropicalLeaves: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);

export default TropicalLeaves;
