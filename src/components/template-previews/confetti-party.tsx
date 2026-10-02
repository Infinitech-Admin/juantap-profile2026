"use client";

// src/components/template-previews/confetti-party.tsx
// Confetti Party - Joyful pink card with colourful confetti raining down in a loop (free)
// Slug: "confetti-party" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
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
  bg: "#fff1f7",
  text: "#3b0764",
  muted: "#8b5aa8",
  accent: "#ec4899",
  accent2: "#3b82f6",
  glow: "236,72,153",
  rowBg: "rgba(255,255,255,0.86)",
  rowBorder: "rgba(236,72,153,0.3)",
  panel: "#ffffff",
  barBg: "rgba(255,245,250,0.92)",
};

const CSS = `
@keyframes cnf-fall { 0% { translate: 0 0; rotate: 0deg; opacity: 0; } 8% { opacity: 1; } 100% { translate: 70px 1700px; rotate: 720deg; opacity: 1; } }
.cnf-p { transform-box: fill-box; transform-origin: center; animation: cnf-fall 10s linear infinite; }
@media (prefers-reduced-motion: reduce) { .cnf-p { animation: none; } }
`;

const COLORS = ["#ec4899", "#3b82f6", "#facc15", "#10b981", "#a855f7", "#f97316"];
const PIECES = Array.from({ length: 40 }, (_, i) => ({
  x: (i * 79) % 1024, y: -50 - ((i * 41) % 300), c: COLORS[i % COLORS.length], k: i % 3,
  d: (i * 0.55) % 10, t: 8 + (i % 6) * 1.2, s: 0.8 + (i % 4) * 0.25,
}));

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >

    <rect width="1024" height="1536" fill="#fff1f7" />
    <circle cx="140" cy="200" r="300" fill="#fbcfe8" opacity=".45" />
    <circle cx="900" cy="1300" r="360" fill="#bfdbfe" opacity=".45" />
    {PIECES.map((p, i) => (
      <g key={i} transform={`translate(${p.x} ${p.y}) scale(${p.s})`}>
        {p.k === 0 && <rect className="cnf-p" style={{ animationDelay: `${p.d}s`, animationDuration: `${p.t}s` }} x="-8" y="-4" width="16" height="8" rx="1.5" fill={p.c} />}
        {p.k === 1 && <circle className="cnf-p" style={{ animationDelay: `${p.d}s`, animationDuration: `${p.t}s` }} r="6" fill={p.c} />}
        {p.k === 2 && <path className="cnf-p" style={{ animationDelay: `${p.d}s`, animationDuration: `${p.t}s` }} d="M0 -9 L9 7 L-9 7Z" fill={p.c} />}
      </g>
    ))}
    <rect x="44" y="44" width="936" height="1448" rx="40" fill="none" stroke="#ec4899" strokeWidth="3" strokeDasharray="2 14" strokeLinecap="round" opacity=".6" />
  </svg>
);

export const ConfettiParty: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);

export default ConfettiParty;
