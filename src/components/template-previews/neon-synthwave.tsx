"use client";

// src/components/template-previews/neon-synthwave.tsx
import React from "react";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

const THEME: CardTheme = {
  font: "'Orbitron', 'Rajdhani', 'Segoe UI', Arial, sans-serif",
  bg: "#0b0220",
  text: "#ffffff",
  muted: "#c4b5e8",
  accent: "#ff3cac",
  accent2: "#29d9ff",
  glow: "255,60,172",
  rowBg: "rgba(24,6,52,0.72)",
  rowBorder: "rgba(41,217,255,0.35)",
  panel: "#160536",
  barBg: "rgba(12,2,32,0.82)",
};

const CSS = `
@keyframes sw-twinkle { 0%,100% { opacity: .2; } 50% { opacity: 1; } }
@keyframes sw-sun     { 0%,100% { scale: 1; opacity: .92; } 50% { scale: 1.035; opacity: 1; } }
@keyframes sw-grid    { from { translate: 0 0; } to { translate: 0 60px; } }
@keyframes sw-horizon { 0%,100% { opacity: .6; } 50% { opacity: 1; } }
.sw-star    { animation: sw-twinkle 3s ease-in-out infinite; }
.sw-sun     { animation: sw-sun 5s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.sw-grid    { animation: sw-grid 2.4s linear infinite; }
.sw-horizon { animation: sw-horizon 3s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .sw-star, .sw-sun, .sw-grid, .sw-horizon { animation: none; } }
`;

const STARS: [number, number, number][] = [
  [90, 90, 2.2],
  [210, 240, 1.6],
  [340, 60, 2],
  [480, 170, 1.5],
  [620, 80, 2.4],
  [760, 210, 1.7],
  [900, 110, 2.1],
  [960, 330, 1.5],
  [60, 420, 1.8],
  [180, 560, 1.4],
  [820, 520, 1.8],
  [940, 640, 1.5],
];

const HORIZON = 1180;

/* Horizontal grid lines get closer together towards the horizon (perspective) */
const H_LINES = [0, 1, 2, 3, 4, 5, 6, 7].map(
  (i) => HORIZON + Math.pow(i / 7, 1.8) * (1536 - HORIZON + 60),
);
const V_LINES = Array.from({ length: 17 }, (_, i) => -1536 + i * 224);

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >
    <defs>
      <linearGradient id="sw-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#07011a" />
        <stop offset="0.6" stopColor="#1c0745" />
        <stop offset="1" stopColor="#3a0b5c" />
      </linearGradient>
      <linearGradient id="sw-sun" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffe14d" />
        <stop offset="0.5" stopColor="#ff7a45" />
        <stop offset="1" stopColor="#ff2d95" />
      </linearGradient>
      <linearGradient id="sw-floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2a0a52" />
        <stop offset="1" stopColor="#0b0220" />
      </linearGradient>
      <mask id="sw-sun-mask">
        <rect width="1024" height="1536" fill="#fff" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect
            key={i}
            x="0"
            y={1040 + i * 26}
            width="1024"
            height={4 + i * 2.6}
            fill="#000"
          />
        ))}
      </mask>
      <clipPath id="sw-floor-clip">
        <rect x="0" y={HORIZON} width="1024" height={1536 - HORIZON} />
      </clipPath>
      <filter id="sw-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="6" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <rect width="1024" height="1536" fill="url(#sw-bg)" />

    {STARS.map(([x, y, r], i) => (
      <circle
        key={i}
        className="sw-star"
        cx={x}
        cy={y}
        r={r}
        fill="#fff"
        style={{ animationDelay: `${(i % 6) * 0.5}s` }}
      />
    ))}

    {/* sun (with scanline cut-outs) */}
    <g mask="url(#sw-sun-mask)">
      <circle
        className="sw-sun"
        cx="512"
        cy={HORIZON}
        r="280"
        fill="url(#sw-sun)"
        filter="url(#sw-glow)"
      />
    </g>

    {/* floor */}
    <rect
      x="0"
      y={HORIZON}
      width="1024"
      height={1536 - HORIZON}
      fill="url(#sw-floor)"
    />
    <g
      clipPath="url(#sw-floor-clip)"
      stroke="#ff3cac"
      strokeWidth="2"
      opacity="0.85"
    >
      {V_LINES.map((x, i) => (
        <line
          key={i}
          x1={512 + (x - 512) * 0.08}
          y1={HORIZON}
          x2={x + 512}
          y2="1536"
        />
      ))}
      <g className="sw-grid">
        {H_LINES.map((y, i) => (
          <line key={i} x1="0" y1={y - 60} x2="1024" y2={y - 60} />
        ))}
      </g>
    </g>

    {/* horizon glow line */}
    <line
      className="sw-horizon"
      x1="0"
      y1={HORIZON}
      x2="1024"
      y2={HORIZON}
      stroke="#29d9ff"
      strokeWidth="3"
      filter="url(#sw-glow)"
    />
  </svg>
);

export const NeonSynthwave: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);

export default NeonSynthwave;
