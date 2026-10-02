"use client";

// src/components/template-previews/slate-geometric.tsx
// Slate Geometric - Modern slate-grey low-poly triangles that pulse and slide with a sky-blue accent (free)
// Slug: "slate-geometric" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
// and in TemplateCard.tsx (PREVIEW_ASPECT).
import React from "react";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

const THEME: CardTheme = {
  font: "'Manrope', 'Segoe UI', Arial, sans-serif",
  bg: "#1f2937",
  text: "#f3f4f6",
  muted: "#9ca3af",
  accent: "#38bdf8",
  accent2: "#a3e635",
  glow: "56,189,248",
  rowBg: "rgba(17,24,39,0.7)",
  rowBorder: "rgba(56,189,248,0.3)",
  panel: "#111827",
  barBg: "rgba(31,41,55,0.92)",
};

const CSS = `
@keyframes slt-pulse { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
@keyframes slt-slide { 0%,100% { translate: 0 0; } 50% { translate: 30px -20px; } }
@keyframes slt-spin { to { rotate: 360deg; } }
@keyframes slt-line { from { translate: -1200px 0; } to { translate: 1200px 0; } }
.slt-t { animation: slt-pulse 6s ease-in-out infinite; }
.slt-s { animation: slt-slide 10s ease-in-out infinite; }
.slt-hex { transform-box: fill-box; transform-origin: center; animation: slt-spin 80s linear infinite; }
.slt-line { animation: slt-line 7s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .slt-t, .slt-s, .slt-hex, .slt-line { animation: none; } }
`;

const TRIS: [string, string][] = [
  ["0,0 360,0 0,420", "#374151"], ["360,0 740,0 380,380", "#273244"], ["740,0 1024,0 1024,400", "#374151"],
  ["0,420 380,380 0,860", "#2b3647"], ["1024,400 700,820 1024,1000", "#374151"], ["0,1100 400,1536 0,1536", "#2b3647"],
  ["1024,1100 1024,1536 640,1536", "#374151"], ["380,380 740,0 1024,400", "#303b4d"], ["0,860 340,1100 0,1100", "#273244"],
];
const hex = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, i) => { const a = (Math.PI / 3) * i; return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`; }).join(" ");

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >

    <rect width="1024" height="1536" fill="#1f2937" />
    {TRIS.map(([p, c], i) => (
      <g key={i} className="slt-s" style={{ animationDelay: `${-i * 1.1}s` }}>
        <polygon className="slt-t" style={{ animationDelay: `${-i * 0.8}s` }} points={p} fill={c} stroke="#38bdf8" strokeOpacity=".18" />
      </g>
    ))}
    <polygon className="slt-hex" points={hex(512, 780, 330)} fill="none" stroke="#38bdf8" strokeWidth="1.6" opacity=".4" />
    <polygon className="slt-hex" style={{ animationDirection: "reverse" }} points={hex(512, 780, 230)} fill="none" stroke="#a3e635" strokeWidth="1.2" strokeDasharray="6 12" opacity=".45" />
    <g className="slt-line"><rect x="0" y="1180" width="320" height="4" fill="#38bdf8" opacity=".8" /><rect x="120" y="1196" width="180" height="2" fill="#a3e635" opacity=".7" /></g>
    <rect x="44" y="44" width="936" height="1448" fill="none" stroke="#38bdf8" strokeWidth="1.4" opacity=".5" />
  </svg>
);

export const SlateGeometric: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);

export default SlateGeometric;
