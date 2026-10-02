"use client";

// src/components/template-previews/inferno-ember.tsx
// Inferno Ember - Molten lava cracks, flickering flames and glowing embers rising through the dark (premium)
// Slug: "inferno-ember" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
// and in TemplateCard.tsx (PREVIEW_ASPECT).
import React from "react";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

const THEME: CardTheme = {
  font: "'Barlow Condensed', 'Segoe UI', Arial, sans-serif",
  bg: "#0c0402",
  text: "#fff2e6",
  muted: "#f0b48a",
  accent: "#ff7a1a",
  accent2: "#fbbf24",
  glow: "255,122,26",
  rowBg: "rgba(36,12,4,0.78)",
  rowBorder: "rgba(255,122,26,0.36)",
  panel: "#1e0a04",
  barBg: "rgba(12,4,2,0.92)",
};

const CSS = `
@keyframes inf-flicker { 0%,100% { scale: 1 1; opacity: .85; } 25% { scale: .92 1.12; opacity: 1; } 50% { scale: 1.06 .94; opacity: .8; } 75% { scale: .96 1.08; opacity: 1; } }
@keyframes inf-crack { 0%,100% { opacity: .4; } 50% { opacity: 1; } }
@keyframes inf-rise { 0% { translate: 0 0; opacity: 0; } 15% { opacity: 1; } 100% { translate: 40px -1500px; opacity: 0; } }
@keyframes inf-glow { 0%,100% { opacity: .65; scale: 1; } 50% { opacity: 1; scale: 1.08; } }
.inf-flame { transform-box: fill-box; transform-origin: 50% 100%; animation: inf-flicker 2.4s ease-in-out infinite; }
.inf-crack { animation: inf-crack 3s ease-in-out infinite; }
.inf-ember { animation: inf-rise 9s linear infinite; }
.inf-glow { transform-box: fill-box; transform-origin: 50% 100%; animation: inf-glow 4s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .inf-flame, .inf-crack, .inf-ember, .inf-glow { animation: none; } }
`;

const EMBERS = Array.from({ length: 38 }, (_, i) => ({ x: 30 + ((i * 53) % 970), y: 1500 + ((i * 37) % 120), r: 1.4 + (i % 4) * 0.8, d: (i * 0.45) % 9, t: 7 + (i % 5) * 1.5 }));
const FLAMES: [number, number][] = [[80, 1.1], [230, 0.8], [380, 1.3], [520, 0.9], [660, 1.2], [800, 0.85], [940, 1.15]];

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >

    <defs>
      <linearGradient id="inf-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0c0402" /><stop offset=".6" stopColor="#1f0a03" /><stop offset="1" stopColor="#5a1604" /></linearGradient>
      <radialGradient id="inf-heat" cx="50%" cy="100%" r="70%"><stop offset="0" stopColor="#ff7a1a" stopOpacity=".7" /><stop offset=".5" stopColor="#c2410c" stopOpacity=".25" /><stop offset="1" stopColor="#c2410c" stopOpacity="0" /></radialGradient>
      <linearGradient id="inf-fl" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#fbbf24" /><stop offset=".45" stopColor="#ff7a1a" /><stop offset="1" stopColor="#dc2626" stopOpacity=".1" /></linearGradient>
    </defs>
    <rect width="1024" height="1536" fill="url(#inf-bg)" />
    <ellipse className="inf-glow" cx="512" cy="1560" rx="700" ry="620" fill="url(#inf-heat)" />
    <g fill="none" stroke="#ff7a1a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <path className="inf-crack" d="M120 1536 L170 1400 L130 1300 L210 1180 L190 1080" />
      <path className="inf-crack" style={{ animationDelay: "-1s" }} d="M520 1536 L480 1420 L560 1330 L520 1220 L600 1120" />
      <path className="inf-crack" style={{ animationDelay: "-2s" }} d="M900 1536 L860 1440 L930 1340 L890 1240" />
      <path className="inf-crack" style={{ animationDelay: "-1.5s" }} strokeWidth="2.4" d="M330 1536 L360 1460 L310 1390" />
    </g>
    {FLAMES.map(([x, s], i) => (
      <g key={i} transform={`translate(${x} 1536) scale(${s})`}>
        <path className="inf-flame" style={{ animationDelay: `${-i * 0.5}s` }} d="M0 0 C -60 -90 -20 -170 -6 -280 C 28 -190 70 -110 0 0Z" fill="url(#inf-fl)" opacity=".9" />
      </g>
    ))}
    {EMBERS.map((e, i) => (<circle key={i} className="inf-ember" style={{ animationDelay: `${e.d}s`, animationDuration: `${e.t}s` }} cx={e.x} cy={e.y} r={e.r} fill="#fbbf24" />))}
    <rect x="44" y="44" width="936" height="1448" rx="18" fill="none" stroke="#ff7a1a" strokeWidth="1.4" opacity=".55" />
  </svg>
);

export const InfernoEmber: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);

export default InfernoEmber;
