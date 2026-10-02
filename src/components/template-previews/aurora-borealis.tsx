"use client";

// src/components/template-previews/aurora-borealis.tsx
// Aurora Borealis - Northern lights curtains over snowy peaks, twinkling stars and a shimmering lake (premium)
// Slug: "aurora-borealis" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
// and in TemplateCard.tsx (PREVIEW_ASPECT).
import React from "react";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

const THEME: CardTheme = {
  font: "'Raleway', 'Segoe UI', Arial, sans-serif",
  bg: "#030a14",
  text: "#e9fff7",
  muted: "#8fc9b8",
  accent: "#5eead4",
  accent2: "#a78bfa",
  glow: "94,234,212",
  rowBg: "rgba(6,24,34,0.72)",
  rowBorder: "rgba(94,234,212,0.3)",
  panel: "#07202c",
  barBg: "rgba(3,10,20,0.92)",
};

const CSS = `
@keyframes aur-sway { 0%,100% { translate: -40px 0; scale: 1 1; opacity: .55; } 50% { translate: 40px -30px; scale: 1.05 1.18; opacity: 1; } }
@keyframes aur-twinkle { 0%,100% { opacity: .15; } 50% { opacity: 1; } }
@keyframes aur-lake { 0%,100% { opacity: .15; translate: 0 0; } 50% { opacity: .6; translate: 14px 0; } }
.aur-r1 { transform-box: fill-box; transform-origin: 50% 100%; animation: aur-sway 9s ease-in-out infinite; }
.aur-r2 { transform-box: fill-box; transform-origin: 50% 100%; animation: aur-sway 12s ease-in-out -4s infinite; }
.aur-r3 { transform-box: fill-box; transform-origin: 50% 100%; animation: aur-sway 15s ease-in-out -8s infinite; }
.aur-star { animation: aur-twinkle 4s ease-in-out infinite; }
.aur-lake { animation: aur-lake 5s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .aur-r1, .aur-r2, .aur-r3, .aur-star, .aur-lake { animation: none; } }
`;

const STARS = Array.from({ length: 70 }, (_, i) => ({
  x: (i * 149) % 1024,
  y: (i * 241) % 900,
  r: 0.8 + (i % 3) * 0.7,
  d: (i % 8) * 0.5,
}));
const LAKE = [1290, 1330, 1370, 1410, 1450];

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >
    <defs>
      <linearGradient id="aur-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#030a14" />
        <stop offset=".65" stopColor="#071e2e" />
        <stop offset="1" stopColor="#0b3a3a" />
      </linearGradient>
      <linearGradient id="aur-c1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#5eead4" stopOpacity=".9" />
        <stop offset=".55" stopColor="#34d399" stopOpacity=".25" />
        <stop offset="1" stopColor="#34d399" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="aur-c2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#c4b5fd" stopOpacity=".8" />
        <stop offset=".6" stopColor="#8b5cf6" stopOpacity=".22" />
        <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="aur-c3" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7dd3fc" stopOpacity=".8" />
        <stop offset=".6" stopColor="#38bdf8" stopOpacity=".2" />
        <stop offset="1" stopColor="#38bdf8" stopOpacity="0" />
      </linearGradient>
    </defs>
    <rect width="1024" height="1536" fill="url(#aur-bg)" />
    {STARS.map((s, i) => (
      <circle
        key={i}
        className="aur-star"
        style={{ animationDelay: `${s.d}s` }}
        cx={s.x}
        cy={s.y}
        r={s.r}
        fill="#fff"
      />
    ))}
    <path
      className="aur-r3"
      d="M-60 260 C 160 380 380 120 600 240 S 920 360 1090 200 V 900 H-60Z"
      fill="url(#aur-c3)"
      opacity=".75"
    />
    <path
      className="aur-r2"
      d="M-60 480 C 220 300 420 620 620 420 S 920 300 1090 460 V 1050 H-60Z"
      fill="url(#aur-c2)"
    />
    <path
      className="aur-r1"
      d="M-60 360 C 180 160 360 520 560 300 S 900 140 1090 340 V 1000 H-60Z"
      fill="url(#aur-c1)"
    />
    <path
      d="M0 1230 L140 1060 L260 1160 L430 940 L600 1140 L760 1010 L900 1130 L1024 1030 V1536 H0Z"
      fill="#04121c"
    />
    <path
      d="M430 940 L395 990 L430 975 L462 1000Z M760 1010 L732 1050 L760 1038 L786 1056Z"
      fill="#cffafe"
      opacity=".7"
    />
    <rect y="1250" width="1024" height="286" fill="#031018" opacity=".75" />
    {LAKE.map((y, i) => (
      <rect
        key={y}
        className="aur-lake"
        style={{ animationDelay: `${i * 0.7}s` }}
        x={160 + i * 40}
        y={y}
        width={700 - i * 80}
        height="3"
        rx="1.5"
        fill={i % 2 ? "#a78bfa" : "#5eead4"}
      />
    ))}
    <rect
      x="44"
      y="44"
      width="936"
      height="1448"
      rx="22"
      fill="none"
      stroke="#5eead4"
      strokeWidth="1.2"
      opacity=".4"
    />
  </svg>
);

export const AuroraBorealis: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);

export default AuroraBorealis;
