"use client";

// src/components/template-previews/mint-fresh.tsx
// Mint Fresh - Clean mint-green card with floating rings, rising bubbles and flowing waves (free)
// Slug: "mint-fresh" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
// and in TemplateCard.tsx (PREVIEW_ASPECT).
import React from "react";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

const THEME: CardTheme = {
  font: "'Nunito', 'Segoe UI', Arial, sans-serif",
  bg: "#ecfdf5",
  text: "#064e3b",
  muted: "#3f7d68",
  accent: "#10b981",
  accent2: "#34d399",
  glow: "16,185,129",
  rowBg: "rgba(255,255,255,0.84)",
  rowBorder: "rgba(16,185,129,0.3)",
  panel: "#ffffff",
  barBg: "rgba(255,255,255,0.92)",
};

const CSS = `
@keyframes mnt-float { 0%,100% { translate: 0 0; } 50% { translate: 24px -34px; } }
@keyframes mnt-wave { from { translate: 0 0; } to { translate: -1024px 0; } }
@keyframes mnt-rise { 0% { translate: 0 0; opacity: 0; } 20% { opacity: .8; } 100% { translate: 20px -1500px; opacity: 0; } }
.mnt-f1 { animation: mnt-float 9s ease-in-out infinite; }
.mnt-f2 { animation: mnt-float 12s ease-in-out -4s infinite; }
.mnt-w1 { animation: mnt-wave 26s linear infinite; }
.mnt-w2 { animation: mnt-wave 36s linear infinite reverse; }
.mnt-b { animation: mnt-rise 14s ease-in infinite; }
@media (prefers-reduced-motion: reduce) { .mnt-f1, .mnt-f2, .mnt-w1, .mnt-w2, .mnt-b { animation: none; } }
`;

const wave = (y: number, a: number) => `M0 ${y} C 256 ${y - a} 768 ${y + a} 1024 ${y} S 1792 ${y - a} 2048 ${y} V1536 H0Z`;
const BUBBLES = Array.from({ length: 12 }, (_, i) => ({ x: 50 + ((i * 83) % 920), y: 1560 + ((i * 57) % 160), r: 5 + (i % 4) * 4, d: i * 1.1 }));

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >

    <defs>
      <linearGradient id="mnt-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f0fff8" /><stop offset="1" stopColor="#d1fae5" /></linearGradient>
    </defs>
    <rect width="1024" height="1536" fill="url(#mnt-bg)" />
    <g fill="none" stroke="#10b981" strokeWidth="2">
      <circle className="mnt-f1" cx="840" cy="260" r="150" opacity=".35" />
      <circle className="mnt-f1" cx="840" cy="260" r="100" opacity=".25" strokeDasharray="4 10" />
      <circle className="mnt-f2" cx="170" cy="640" r="90" opacity=".3" />
      <circle className="mnt-f2" cx="880" cy="980" r="60" opacity=".3" />
    </g>
    <g className="mnt-w1" opacity=".5"><path d={wave(1230, 70)} fill="#a7f3d0" /></g>
    <g className="mnt-w2" opacity=".75"><path d={wave(1320, 60)} fill="#6ee7b7" /></g>
    <g className="mnt-w1" opacity=".95"><path d={wave(1410, 50)} fill="#10b981" /></g>
    {BUBBLES.map((b, i) => (<circle key={i} className="mnt-b" style={{ animationDelay: `${b.d}s` }} cx={b.x} cy={b.y} r={b.r} fill="#fff" fillOpacity=".6" stroke="#10b981" strokeOpacity=".45" />))}
    <rect x="44" y="44" width="936" height="1448" rx="28" fill="none" stroke="#10b981" strokeWidth="1.2" opacity=".35" />
  </svg>
);

export const MintFresh: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);

export default MintFresh;
