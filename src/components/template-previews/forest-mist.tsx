"use client";

// src/components/template-previews/forest-mist.tsx
import React from "react";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

const THEME: CardTheme = {
  font: "'Lora', Georgia, serif",
  bg: "#06140e",
  text: "#eafbee",
  muted: "#9cc2a8",
  accent: "#22c55e",
  accent2: "#86efac",
  glow: "74,222,128",
  rowBg: "rgba(8,30,20,0.72)",
  rowBorder: "rgba(74,222,128,0.28)",
  panel: "#0a2418",
  barBg: "rgba(5,18,12,0.82)",
};

const CSS = `
@keyframes fm-mist  { 0%,100% { translate: -60px 0; opacity: .5; } 50% { translate: 60px 0; opacity: .85; } }
@keyframes fm-fly   {
  0%,100% { translate: 0 0; opacity: .1; }
  25% { translate: 14px -18px; opacity: 1; }
  50% { translate: -10px -30px; opacity: .3; }
  75% { translate: 12px -12px; opacity: .95; }
}
@keyframes fm-sway  { 0%,100% { rotate: -0.6deg; } 50% { rotate: 0.6deg; } }
.fm-mist { animation: fm-mist 16s ease-in-out infinite; }
.fm-fly  { animation: fm-fly 6s ease-in-out infinite; }
.fm-sway { animation: fm-sway 7s ease-in-out infinite; transform-box: fill-box; transform-origin: bottom center; }
@media (prefers-reduced-motion: reduce) { .fm-mist, .fm-fly, .fm-sway { animation: none; } }
`;

/* A simple stacked-triangle pine, base centred on x, bottom at y */
const Pine = ({
  x,
  y,
  s,
  fill,
  delay = 0,
}: {
  x: number;
  y: number;
  s: number;
  fill: string;
  delay?: number;
}) => (
  <g className="fm-sway" style={{ animationDelay: `${delay}s` }}>
    <polygon
      points={`${x},${y - 260 * s} ${x - 70 * s},${y - 110 * s} ${x + 70 * s},${y - 110 * s}`}
      fill={fill}
    />
    <polygon
      points={`${x},${y - 190 * s} ${x - 95 * s},${y - 40 * s} ${x + 95 * s},${y - 40 * s}`}
      fill={fill}
    />
    <polygon
      points={`${x},${y - 110 * s} ${x - 120 * s},${y} ${x + 120 * s},${y}`}
      fill={fill}
    />
  </g>
);

const FLIES: [number, number, number][] = [
  [140, 1220, 0],
  [310, 1330, 1.4],
  [520, 1270, 2.8],
  [700, 1350, 0.7],
  [860, 1240, 3.6],
  [420, 1150, 4.4],
  [920, 1370, 2.1],
];

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >
    <defs>
      <linearGradient id="fm-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0f3a28" />
        <stop offset="0.5" stopColor="#082217" />
        <stop offset="1" stopColor="#030b07" />
      </linearGradient>
      <radialGradient id="fm-moon" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#d9ffe6" stopOpacity="0.55" />
        <stop offset="1" stopColor="#d9ffe6" stopOpacity="0" />
      </radialGradient>
      <filter id="fm-blur" x="-30%" y="-80%" width="160%" height="260%">
        <feGaussianBlur stdDeviation="28" />
      </filter>
      <filter id="fm-glow" x="-300%" y="-300%" width="700%" height="700%">
        <feGaussianBlur stdDeviation="4" />
      </filter>
    </defs>

    <rect width="1024" height="1536" fill="url(#fm-bg)" />

    {/* moon glow */}
    <circle cx="820" cy="180" r="260" fill="url(#fm-moon)" />
    <circle cx="820" cy="180" r="46" fill="#eafff0" opacity="0.9" />

    {/* far hills */}
    <path
      d="M0 1180 L180 1060 L340 1150 L520 1020 L720 1140 L880 1050 L1024 1130 V1536 H0 Z"
      fill="#0b2a1c"
    />

    {/* pine rows */}
    <g>
      {[60, 250, 470, 690, 930].map((x, i) => (
        <Pine
          key={`b${x}`}
          x={x}
          y={1330}
          s={0.8}
          fill="#0a2418"
          delay={i * 0.7}
        />
      ))}
      {[-10, 170, 380, 600, 810, 1010].map((x, i) => (
        <Pine
          key={`f${x}`}
          x={x}
          y={1500}
          s={1.05}
          fill="#041109"
          delay={i * 0.5}
        />
      ))}
    </g>

    {/* drifting mist */}
    <g filter="url(#fm-blur)" fill="#bfeccd">
      <ellipse
        className="fm-mist"
        cx="300"
        cy="1180"
        rx="420"
        ry="46"
        opacity="0.5"
      />
      <ellipse
        className="fm-mist"
        cx="760"
        cy="1300"
        rx="460"
        ry="52"
        opacity="0.5"
        style={{ animationDelay: "-6s" }}
      />
      <ellipse
        className="fm-mist"
        cx="480"
        cy="520"
        rx="520"
        ry="40"
        opacity="0.28"
        style={{ animationDelay: "-10s" }}
      />
    </g>

    {/* fireflies */}
    {FLIES.map(([x, y, d], i) => (
      <g key={i}>
        <circle
          className="fm-fly"
          cx={x}
          cy={y}
          r="9"
          fill="#d9ff7a"
          filter="url(#fm-glow)"
          style={{ animationDelay: `${d}s` }}
        />
        <circle
          className="fm-fly"
          cx={x}
          cy={y}
          r="2.6"
          fill="#f4ffc2"
          style={{ animationDelay: `${d}s` }}
        />
      </g>
    ))}
  </svg>
);

export const ForestMist: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);

export default ForestMist;
