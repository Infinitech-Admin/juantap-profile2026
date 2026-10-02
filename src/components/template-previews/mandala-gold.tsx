"use client";

// src/components/template-previews/mandala-gold.tsx
// Mandala Gold - Sacred-geometry gold mandala with counter-rotating petals, dotted rings and a pulsing core (premium)
// Slug: "mandala-gold" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
// and in TemplateCard.tsx (PREVIEW_ASPECT).
import React from "react";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

const THEME: CardTheme = {
  font: "'Marcellus', 'Georgia', serif",
  bg: "#140806",
  text: "#fff3d6",
  muted: "#d9b77a",
  accent: "#f5c451",
  accent2: "#c2410c",
  glow: "245,196,81",
  rowBg: "rgba(40,16,8,0.76)",
  rowBorder: "rgba(245,196,81,0.34)",
  panel: "#26100a",
  barBg: "rgba(20,8,6,0.92)",
};

const CSS = `
@keyframes mdl-spin { to { rotate: 360deg; } }
@keyframes mdl-spinr { to { rotate: -360deg; } }
@keyframes mdl-pulse { 0%,100% { scale: 1; opacity: .7; } 50% { scale: 1.25; opacity: 1; } }
.mdl-a { transform-origin: 512px 560px; animation: mdl-spin 90s linear infinite; }
.mdl-b { transform-origin: 512px 560px; animation: mdl-spinr 60s linear infinite; }
.mdl-c { transform-origin: 512px 560px; animation: mdl-spin 140s linear infinite; }
.mdl-core { transform-box: fill-box; transform-origin: center; animation: mdl-pulse 3.6s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .mdl-a, .mdl-b, .mdl-c, .mdl-core { animation: none; } }
`;

const P16 = Array.from({ length: 16 }, (_, i) => i * 22.5);
const P12 = Array.from({ length: 12 }, (_, i) => i * 30);
const CORNERS: [number, number][] = [
  [0, 0],
  [1024, 0],
  [0, 1536],
  [1024, 1536],
];

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >
    <defs>
      <radialGradient id="mdl-bg" cx="50%" cy="37%" r="75%">
        <stop offset="0" stopColor="#3a1408" />
        <stop offset=".6" stopColor="#140806" />
        <stop offset="1" stopColor="#080302" />
      </radialGradient>
      <radialGradient id="mdl-core">
        <stop offset="0" stopColor="#fff3b0" />
        <stop offset="1" stopColor="#f5c451" />
      </radialGradient>
    </defs>
    <rect width="1024" height="1536" fill="url(#mdl-bg)" />
    {CORNERS.map(([x, y], i) => (
      <g key={i} fill="none" stroke="#f5c451" opacity=".45">
        <circle cx={x} cy={y} r="150" />
        <circle cx={x} cy={y} r="190" strokeDasharray="3 9" />
        <circle cx={x} cy={y} r="230" />
      </g>
    ))}
    <g className="mdl-c">
      <circle
        cx="512"
        cy="560"
        r="320"
        fill="none"
        stroke="#f5c451"
        strokeWidth="2"
        strokeDasharray="2 12"
        strokeLinecap="round"
      />
      <circle
        cx="512"
        cy="560"
        r="290"
        fill="none"
        stroke="#f5c451"
        strokeWidth="1"
        opacity=".6"
      />
    </g>
    <g
      className="mdl-a"
      fill="#f5c451"
      fillOpacity=".06"
      stroke="#f5c451"
      strokeWidth="1.6"
    >
      {P16.map((a) => (
        <ellipse
          key={a}
          cx="512"
          cy="430"
          rx="36"
          ry="120"
          transform={`rotate(${a} 512 560)`}
        />
      ))}
    </g>
    <g
      className="mdl-b"
      fill="#c2410c"
      fillOpacity=".12"
      stroke="#fbbf24"
      strokeWidth="1.4"
    >
      {P12.map((a) => (
        <ellipse
          key={a}
          cx="512"
          cy="488"
          rx="22"
          ry="70"
          transform={`rotate(${a} 512 560)`}
        />
      ))}
    </g>
    <circle
      cx="512"
      cy="560"
      r="150"
      fill="none"
      stroke="#f5c451"
      strokeWidth="1"
      opacity=".55"
    />
    <circle
      cx="512"
      cy="560"
      r="60"
      fill="none"
      stroke="#fff3b0"
      strokeWidth="1.6"
      opacity=".8"
    />
    <circle
      className="mdl-core"
      cx="512"
      cy="560"
      r="26"
      fill="url(#mdl-core)"
    />
    <rect
      x="44"
      y="44"
      width="936"
      height="1448"
      rx="20"
      fill="none"
      stroke="#f5c451"
      strokeWidth="1.4"
      opacity=".6"
    />
    <rect
      x="62"
      y="62"
      width="900"
      height="1412"
      rx="12"
      fill="none"
      stroke="#f5c451"
      strokeWidth="1"
      opacity=".3"
    />
  </svg>
);

export const MandalaGold: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);

export default MandalaGold;
