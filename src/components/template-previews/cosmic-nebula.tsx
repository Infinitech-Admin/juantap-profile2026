"use client";

// src/components/template-previews/cosmic-nebula.tsx
// Cosmic Nebula - Violet nebula clouds, a slowly turning spiral galaxy, twinkling stars and a ringed planet (premium)
// Slug: "cosmic-nebula" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
// and in TemplateCard.tsx (PREVIEW_ASPECT).
import React from "react";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

const THEME: CardTheme = {
  font: "'Space Grotesk', 'Segoe UI', Arial, sans-serif",
  bg: "#07031a",
  text: "#f4efff",
  muted: "#b4a6e0",
  accent: "#c084fc",
  accent2: "#38bdf8",
  glow: "192,132,252",
  rowBg: "rgba(24,12,56,0.7)",
  rowBorder: "rgba(192,132,252,0.3)",
  panel: "#160b38",
  barBg: "rgba(7,3,26,0.92)",
};

const CSS = `
@keyframes cnb-spin { to { rotate: 360deg; } }
@keyframes cnb-d1 { 0%,100% { translate: 0 0; } 50% { translate: 80px 60px; } }
@keyframes cnb-d2 { 0%,100% { translate: 0 0; } 50% { translate: -90px 40px; } }
@keyframes cnb-d3 { 0%,100% { translate: 0 0; } 50% { translate: 60px -70px; } }
@keyframes cnb-twinkle { 0%,100% { opacity: .15; } 50% { opacity: 1; } }
@keyframes cnb-bob { 0%,100% { translate: 0 0; } 50% { translate: 0 -16px; } }
.cnb-spin { transform-origin: 512px 640px; animation: cnb-spin 90s linear infinite; }
.cnb-d1 { animation: cnb-d1 16s ease-in-out infinite; }
.cnb-d2 { animation: cnb-d2 20s ease-in-out infinite; }
.cnb-d3 { animation: cnb-d3 18s ease-in-out infinite; }
.cnb-star { animation: cnb-twinkle 4s ease-in-out infinite; }
.cnb-planet { animation: cnb-bob 8s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .cnb-spin, .cnb-d1, .cnb-d2, .cnb-d3, .cnb-star, .cnb-planet { animation: none; } }
`;

const STARS = Array.from({ length: 90 }, (_, i) => ({
  x: (i * 131) % 1024,
  y: (i * 233) % 1536,
  r: 0.7 + (i % 4) * 0.5,
  d: (i % 9) * 0.45,
}));
const ARM =
  "M512 640 C 580 560 700 590 720 700 S 620 900 470 860 S 270 700 340 540 S 600 380 780 470";
const ARM_W = [30, 14, 3];

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >
    <defs>
      <radialGradient id="cnb-bg" cx="50%" cy="40%" r="85%">
        <stop offset="0" stopColor="#1a0b3d" />
        <stop offset=".6" stopColor="#07031a" />
        <stop offset="1" stopColor="#020108" />
      </radialGradient>
      <radialGradient id="cnb-n1">
        <stop offset="0" stopColor="#c084fc" stopOpacity=".55" />
        <stop offset="1" stopColor="#c084fc" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="cnb-n2">
        <stop offset="0" stopColor="#38bdf8" stopOpacity=".4" />
        <stop offset="1" stopColor="#38bdf8" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="cnb-n3">
        <stop offset="0" stopColor="#f472b6" stopOpacity=".45" />
        <stop offset="1" stopColor="#f472b6" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="cnb-pl" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f0abfc" />
        <stop offset=".6" stopColor="#7c3aed" />
        <stop offset="1" stopColor="#1e1b4b" />
      </linearGradient>
    </defs>
    <rect width="1024" height="1536" fill="url(#cnb-bg)" />
    <circle className="cnb-d1" cx="200" cy="300" r="420" fill="url(#cnb-n1)" />
    <circle className="cnb-d2" cx="840" cy="760" r="460" fill="url(#cnb-n2)" />
    <circle className="cnb-d3" cx="300" cy="1250" r="440" fill="url(#cnb-n3)" />
    {STARS.map((s, i) => (
      <circle
        key={i}
        className="cnb-star"
        style={{ animationDelay: `${s.d}s` }}
        cx={s.x}
        cy={s.y}
        r={s.r}
        fill="#fff"
      />
    ))}
    <g className="cnb-spin">
      {[0, 180].map((rot) => (
        <g key={rot} transform={`rotate(${rot} 512 640)`}>
          {ARM_W.map((w) => (
            <path
              key={w}
              d={ARM}
              fill="none"
              stroke="#e9d5ff"
              strokeOpacity={w === 30 ? 0.07 : w === 14 ? 0.15 : 0.55}
              strokeWidth={w}
              strokeLinecap="round"
            />
          ))}
        </g>
      ))}
      <circle cx="512" cy="640" r="40" fill="#fff" opacity=".18" />
      <circle cx="512" cy="640" r="16" fill="#fff" opacity=".95" />
    </g>
    <g className="cnb-planet">
      <ellipse
        cx="830"
        cy="1290"
        rx="170"
        ry="34"
        transform="rotate(-18 830 1290)"
        fill="none"
        stroke="#e9d5ff"
        strokeOpacity=".5"
        strokeWidth="5"
      />
      <circle cx="830" cy="1290" r="88" fill="url(#cnb-pl)" />
      <path
        d="M672 1330 A170 34 0 0 0 988 1250"
        transform="rotate(-18 830 1290)"
        fill="none"
        stroke="#e9d5ff"
        strokeOpacity=".7"
        strokeWidth="5"
      />
    </g>
    <rect
      x="44"
      y="44"
      width="936"
      height="1448"
      rx="22"
      fill="none"
      stroke="#c084fc"
      strokeWidth="1.2"
      opacity=".4"
    />
  </svg>
);

export const CosmicNebula: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);

export default CosmicNebula;
