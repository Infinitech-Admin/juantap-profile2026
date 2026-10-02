"use client";

// src/components/template-previews/gold-luxe.tsx
import React from "react";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

const THEME: CardTheme = {
  font: "'Cinzel', 'Times New Roman', serif",
  bg: "#0a0805",
  text: "#fbf3dc",
  muted: "#b9a97e",
  accent: "#d4af37",
  accent2: "#f1d98b",
  glow: "212,175,55",
  rowBg: "rgba(20,16,8,0.78)",
  rowBorder: "rgba(212,175,55,0.35)",
  panel: "#14100a",
  barBg: "rgba(10,8,4,0.85)",
};

const CSS = `
@keyframes gl-flow   { from { stroke-dashoffset: 1000; } to { stroke-dashoffset: 0; } }
@keyframes gl-sweep  { from { translate: -700px 0; } to { translate: 700px 0; } }
@keyframes gl-dust   { 0% { translate: 0 0; opacity: 0; } 20% { opacity: .8; } 100% { translate: 16px -380px; opacity: 0; } }
@keyframes gl-gem    { 0%,100% { opacity: .55; scale: 1; } 50% { opacity: 1; scale: 1.25; } }
.gl-flow  { animation: gl-flow 9s linear infinite; }
.gl-sweep { animation: gl-sweep 7s ease-in-out infinite; }
.gl-dust  { animation: gl-dust 11s linear infinite; }
.gl-gem   { animation: gl-gem 3.2s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
@media (prefers-reduced-motion: reduce) { .gl-flow, .gl-sweep, .gl-dust, .gl-gem { animation: none; } }
`;

const DUST: [number, number, number, number][] = [
  [140, 1300, 2, 0],
  [300, 1180, 1.6, 3],
  [470, 1400, 2.2, 6],
  [640, 1240, 1.6, 1.5],
  [800, 1360, 2, 4.5],
  [900, 1150, 1.6, 8],
  [220, 900, 1.6, 9],
  [720, 980, 2, 2.5],
];

const CORNERS: [number, number][] = [
  [44, 44],
  [980, 44],
  [44, 1492],
  [980, 1492],
];

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >
    <defs>
      <linearGradient id="gl-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#1b1409" />
        <stop offset="0.5" stopColor="#0a0805" />
        <stop offset="1" stopColor="#15100a" />
      </linearGradient>
      <linearGradient id="gl-gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f6e6a6" />
        <stop offset="0.5" stopColor="#d4af37" />
        <stop offset="1" stopColor="#8f6f1c" />
      </linearGradient>
      <linearGradient id="gl-shine" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff2c2" stopOpacity="0" />
        <stop offset="0.5" stopColor="#fff2c2" stopOpacity="0.12" />
        <stop offset="1" stopColor="#fff2c2" stopOpacity="0" />
      </linearGradient>
      <clipPath id="gl-clip">
        <rect width="1024" height="1536" />
      </clipPath>
    </defs>

    <rect width="1024" height="1536" fill="url(#gl-bg)" />

    {/* fan of faint rays from the top centre */}
    <g stroke="url(#gl-gold)" strokeWidth="1" opacity="0.14">
      {Array.from({ length: 11 }, (_, i) => (
        <line key={i} x1="512" y1="-60" x2={-300 + i * 165} y2="1000" />
      ))}
    </g>

    {/* shimmering band */}
    <g clipPath="url(#gl-clip)">
      <rect
        className="gl-sweep"
        x="500"
        y="-100"
        width="260"
        height="1800"
        fill="url(#gl-shine)"
        transform="rotate(18 512 768)"
      />
    </g>

    {/* double frame */}
    <rect
      x="44"
      y="44"
      width="936"
      height="1448"
      fill="none"
      stroke="url(#gl-gold)"
      strokeWidth="2.5"
    />
    <rect
      x="64"
      y="64"
      width="896"
      height="1408"
      fill="none"
      stroke="url(#gl-gold)"
      strokeWidth="1"
      opacity="0.6"
    />
    <rect
      className="gl-flow"
      x="44"
      y="44"
      width="936"
      height="1448"
      pathLength={1000}
      strokeDasharray="90 910"
      fill="none"
      stroke="#fff2c2"
      strokeWidth="3"
    />

    {/* corner gems */}
    {CORNERS.map(([x, y], i) => (
      <g key={i}>
        <rect
          x={x - 14}
          y={y - 14}
          width="28"
          height="28"
          transform={`rotate(45 ${x} ${y})`}
          fill="#0a0805"
          stroke="url(#gl-gold)"
          strokeWidth="2.5"
        />
        <rect
          className="gl-gem"
          x={x - 6}
          y={y - 6}
          width="12"
          height="12"
          transform={`rotate(45 ${x} ${y})`}
          fill="#f1d98b"
          style={{ animationDelay: `${i * 0.7}s` }}
        />
      </g>
    ))}

    {/* gold dust */}
    {DUST.map(([x, y, r, d], i) => (
      <circle
        key={i}
        className="gl-dust"
        cx={x}
        cy={y}
        r={r}
        fill="#f1d98b"
        style={{ animationDelay: `${d}s` }}
      />
    ))}
  </svg>
);

export const GoldLuxe: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);

export default GoldLuxe;
