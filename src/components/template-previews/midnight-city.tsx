"use client";

// src/components/template-previews/midnight-city.tsx
// Midnight City - City skyline at night with a rising moon, twinkling stars and flickering lit windows (free)
// Slug: "midnight-city" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
// and in TemplateCard.tsx (PREVIEW_ASPECT).
import React from "react";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

const THEME: CardTheme = {
  font: "'Sora', 'Segoe UI', Arial, sans-serif",
  bg: "#0f172a",
  text: "#f1f5f9",
  muted: "#94a3b8",
  accent: "#fbbf24",
  accent2: "#818cf8",
  glow: "251,191,36",
  rowBg: "rgba(15,23,42,0.74)",
  rowBorder: "rgba(251,191,36,0.3)",
  panel: "#1e1b4b",
  barBg: "rgba(15,23,42,0.92)",
};

const CSS = `
@keyframes mdc-tw { 0%,100% { opacity: .15; } 50% { opacity: 1; } }
@keyframes mdc-win { 0%,100% { opacity: .95; } 45% { opacity: .95; } 50% { opacity: .1; } 60% { opacity: .95; } }
@keyframes mdc-moon { 0%,100% { opacity: .5; scale: 1; } 50% { opacity: .85; scale: 1.08; } }
.mdc-star { animation: mdc-tw 4s ease-in-out infinite; }
.mdc-win { animation: mdc-win 7s linear infinite; }
.mdc-moon { transform-box: fill-box; transform-origin: center; animation: mdc-moon 6s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .mdc-star, .mdc-win, .mdc-moon { animation: none; } }
`;

const STARS = Array.from({ length: 50 }, (_, i) => ({ x: (i * 157) % 1024, y: (i * 233) % 900, r: 0.8 + (i % 3) * 0.6, d: (i % 8) * 0.5 }));
const B: [number, number, number][] = [[0, 110, 300], [110, 90, 420], [200, 130, 340], [330, 100, 460], [430, 120, 360], [550, 90, 500], [640, 130, 330], [770, 100, 430], [870, 154, 320]];
const WINDOWS = B.flatMap(([x, w, h], bi) => {
  const out: { x: number; y: number; k: number; d: number }[] = [];
  const cols = Math.floor((w - 14) / 22);
  const rows = Math.floor((h - 24) / 30);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const k = (c * 7 + r * 13 + bi * 5) % 5;
      if (k === 0) continue;
      out.push({ x: x + 10 + c * 22, y: 1536 - h + 16 + r * 30, k, d: ((c + r + bi) % 9) * 0.7 });
    }
  }
  return out;
});

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >

    <defs>
      <linearGradient id="mdc-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0b1026" /><stop offset=".6" stopColor="#312e81" /><stop offset="1" stopColor="#6d3a8f" /></linearGradient>
      <radialGradient id="mdc-glow"><stop offset="0" stopColor="#fef3c7" stopOpacity=".6" /><stop offset="1" stopColor="#fef3c7" stopOpacity="0" /></radialGradient>
    </defs>
    <rect width="1024" height="1536" fill="url(#mdc-bg)" />
    {STARS.map((s, i) => (<circle key={i} className="mdc-star" style={{ animationDelay: `${s.d}s` }} cx={s.x} cy={s.y} r={s.r} fill="#fff" />))}
    <circle className="mdc-moon" cx="780" cy="420" r="200" fill="url(#mdc-glow)" />
    <circle cx="780" cy="420" r="72" fill="#fef3c7" />
    <circle cx="755" cy="400" r="12" fill="#fde68a" opacity=".7" /><circle cx="806" cy="448" r="16" fill="#fde68a" opacity=".6" />
    {B.map(([x, w, h], i) => (<rect key={i} x={x} y={1536 - h} width={w} height={h} fill={i % 2 ? '#0d1330' : '#111a3e'} />))}
    {WINDOWS.map((w, i) => (
      <rect key={i} className={w.k === 1 ? 'mdc-win' : undefined} style={w.k === 1 ? { animationDelay: `${w.d}s` } : undefined} x={w.x} y={w.y} width="10" height="14" rx="1.5" fill={w.k === 2 ? '#818cf8' : '#fbbf24'} opacity={w.k === 3 ? 0.35 : 0.95} />
    ))}
    <rect x="44" y="44" width="936" height="1448" rx="20" fill="none" stroke="#fbbf24" strokeWidth="1.2" opacity=".4" />
  </svg>
);

export const MidnightCity: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);

export default MidnightCity;
