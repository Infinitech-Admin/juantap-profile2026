"use client";

// src/components/template-previews/black-diamond.tsx
// Black Diamond - Jet-black card with a brilliant-cut diamond, sweeping light, rotating rays and glints (premium)
// Slug: "black-diamond" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
// and in TemplateCard.tsx (PREVIEW_ASPECT).
import React from "react";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

const THEME: CardTheme = {
  font: "'Bodoni Moda', 'Georgia', serif",
  bg: "#050507",
  text: "#f5f5f7",
  muted: "#9a9aa6",
  accent: "#e5e7eb",
  accent2: "#67e8f9",
  glow: "229,231,235",
  rowBg: "rgba(18,20,26,0.78)",
  rowBorder: "rgba(229,231,235,0.28)",
  panel: "#12141a",
  barBg: "rgba(5,5,7,0.92)",
};

const CSS = `
@keyframes bdm-spin { to { rotate: 360deg; } }
@keyframes bdm-facet { 0%,100% { opacity: .6; } 50% { opacity: 1; } }
@keyframes bdm-glint { 0%,100% { opacity: 0; scale: .2; } 50% { opacity: 1; scale: 1; } }
@keyframes bdm-sweep { from { translate: -800px 0; } to { translate: 800px 0; } }
.bdm-rays { transform-origin: 512px 600px; animation: bdm-spin 120s linear infinite; }
.bdm-facet { animation: bdm-facet 5s ease-in-out infinite; }
.bdm-glint { transform-box: fill-box; transform-origin: center; animation: bdm-glint 3.2s ease-in-out infinite; }
.bdm-sweep { animation: bdm-sweep 5.5s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .bdm-rays, .bdm-facet, .bdm-glint, .bdm-sweep { animation: none; } }
`;

const OUTLINE = "320,440 400,360 624,360 704,440 512,820";
const FACETS: [string, string][] = [
  ["320,440 400,360 432,440", "#6b7280"],
  ["400,360 624,360 592,440 432,440", "#e5e7eb"],
  ["624,360 704,440 592,440", "#4b5563"],
  ["320,440 432,440 512,820", "#374151"],
  ["432,440 592,440 512,820", "#9ca3af"],
  ["592,440 704,440 512,820", "#1f2937"],
];
const GLINTS: [number, number][] = [
  [400, 360],
  [624, 360],
  [320, 440],
  [704, 440],
  [512, 820],
];
const MINIS: [number, number, number][] = [
  [250, 300, 10],
  [780, 330, 12],
  [200, 700, 8],
  [830, 720, 10],
  [300, 1000, 10],
  [760, 980, 12],
];
const RAYS = Array.from({ length: 24 }, (_, i) => i * 15);

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >
    <defs>
      <radialGradient id="bdm-bg" cx="50%" cy="38%" r="70%">
        <stop offset="0" stopColor="#1c1f26" />
        <stop offset=".6" stopColor="#0a0b0e" />
        <stop offset="1" stopColor="#030304" />
      </radialGradient>
      <radialGradient id="bdm-glow">
        <stop offset="0" stopColor="#67e8f9" stopOpacity=".35" />
        <stop offset="1" stopColor="#67e8f9" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="bdm-shine" x1="0" x2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset=".5" stopColor="#fff" stopOpacity=".75" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <clipPath id="bdm-clip">
        <polygon points={OUTLINE} />
      </clipPath>
    </defs>
    <rect width="1024" height="1536" fill="url(#bdm-bg)" />
    <g className="bdm-rays">
      {RAYS.map((a) => (
        <line
          key={a}
          x1="512"
          y1="600"
          x2="512"
          y2="-300"
          stroke="#e5e7eb"
          strokeOpacity={a % 30 ? 0.05 : 0.12}
          strokeWidth="2"
          transform={`rotate(${a} 512 600)`}
        />
      ))}
    </g>
    <circle cx="512" cy="600" r="380" fill="url(#bdm-glow)" />
    {FACETS.map(([p, c], i) => (
      <polygon
        key={i}
        className="bdm-facet"
        style={{ animationDelay: `${i * 0.5}s` }}
        points={p}
        fill={c}
        stroke="#e5e7eb"
        strokeOpacity=".5"
        strokeWidth="1.4"
      />
    ))}
    <g clipPath="url(#bdm-clip)">
      <g className="bdm-sweep">
        <rect
          x="560"
          y="340"
          width="120"
          height="520"
          fill="url(#bdm-shine)"
          transform="skewX(-20)"
        />
      </g>
    </g>
    {GLINTS.map(([x, y], i) => (
      <path
        key={i}
        className="bdm-glint"
        style={{ animationDelay: `${i * 0.6}s` }}
        d={`M${x} ${y - 30}V${y + 30}M${x - 30} ${y}H${x + 30}`}
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
      />
    ))}
    {MINIS.map(([x, y, s], i) => (
      <rect
        key={i}
        className="bdm-glint"
        style={{ animationDelay: `${i * 0.8}s` }}
        x={x}
        y={y}
        width={s}
        height={s}
        fill="#67e8f9"
        transform={`rotate(45 ${x} ${y})`}
      />
    ))}
    <rect
      x="44"
      y="44"
      width="936"
      height="1448"
      fill="none"
      stroke="#e5e7eb"
      strokeWidth="1.4"
      opacity=".45"
    />
    <rect
      x="62"
      y="62"
      width="900"
      height="1412"
      fill="none"
      stroke="#e5e7eb"
      strokeWidth="1"
      opacity=".2"
    />
  </svg>
);

export const BlackDiamond: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);

export default BlackDiamond;
