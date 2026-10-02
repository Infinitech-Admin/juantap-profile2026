"use client";

// src/components/template-previews/ocean-depth.tsx
import React from "react";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

const THEME: CardTheme = {
  font: "'Outfit', 'Segoe UI', Arial, sans-serif",
  bg: "#031a24",
  text: "#e8fbff",
  muted: "#8fb8c2",
  accent: "#14b8a6",
  accent2: "#5eead4",
  glow: "45,212,191",
  rowBg: "rgba(4,38,52,0.7)",
  rowBorder: "rgba(45,212,191,0.3)",
  panel: "#062a37",
  barBg: "rgba(3,22,31,0.8)",
};

/* Each wave path is 2 wavelengths wide (2048) and slides exactly one wavelength (1024) for a seamless loop */
const CSS = `
@keyframes oc2-wave   { from { translate: -1024px 0; } to { translate: 0 0; } }
@keyframes oc2-wave-r { from { translate: 0 0; } to { translate: -1024px 0; } }
@keyframes oc2-bubble {
  0%   { translate: 0 0; opacity: 0; }
  15%  { opacity: .7; }
  100% { translate: 18px -900px; opacity: 0; }
}
@keyframes oc2-ray    { 0%,100% { opacity: .08; } 50% { opacity: .2; } }
.oc2-w1 { animation: oc2-wave 14s linear infinite; }
.oc2-w2 { animation: oc2-wave-r 20s linear infinite; }
.oc2-w3 { animation: oc2-wave 28s linear infinite; }
.oc2-bubble { animation: oc2-bubble 12s linear infinite; }
.oc2-ray { animation: oc2-ray 6s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .oc2-w1, .oc2-w2, .oc2-w3, .oc2-bubble, .oc2-ray { animation: none; } }
`;

const WAVE = (y: number, amp: number) =>
  `M0 ${y} Q256 ${y - amp} 512 ${y} T1024 ${y} T1536 ${y} T2048 ${y} V1536 H0 Z`;

const BUBBLES: {
  x: number;
  y: number;
  r: number;
  dur: number;
  delay: number;
}[] = [
  { x: 120, y: 1500, r: 6, dur: 11, delay: 0 },
  { x: 260, y: 1480, r: 4, dur: 13, delay: 3 },
  { x: 420, y: 1520, r: 8, dur: 10, delay: 6 },
  { x: 600, y: 1490, r: 5, dur: 14, delay: 1.5 },
  { x: 760, y: 1510, r: 7, dur: 12, delay: 4.5 },
  { x: 900, y: 1495, r: 4, dur: 15, delay: 8 },
  { x: 340, y: 1500, r: 3, dur: 16, delay: 9 },
];

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >
    <defs>
      <linearGradient id="oc2-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0a4a5c" />
        <stop offset="0.45" stopColor="#053344" />
        <stop offset="1" stopColor="#021219" />
      </linearGradient>
      <linearGradient id="oc2-w1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#14b8a6" stopOpacity="0.38" />
        <stop offset="1" stopColor="#14b8a6" stopOpacity="0.02" />
      </linearGradient>
      <linearGradient id="oc2-w2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#38bdf8" stopOpacity="0.3" />
        <stop offset="1" stopColor="#38bdf8" stopOpacity="0.02" />
      </linearGradient>
      <linearGradient id="oc2-ray" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#b6fff3" stopOpacity="0.9" />
        <stop offset="1" stopColor="#b6fff3" stopOpacity="0" />
      </linearGradient>
    </defs>

    <rect width="1024" height="1536" fill="url(#oc2-bg)" />

    {/* light rays from the surface */}
    <g>
      <polygon
        className="oc2-ray"
        points="180,0 300,0 560,900 380,900"
        fill="url(#oc2-ray)"
      />
      <polygon
        className="oc2-ray"
        points="520,0 600,0 900,800 760,800"
        fill="url(#oc2-ray)"
        style={{ animationDelay: "2s" }}
      />
      <polygon
        className="oc2-ray"
        points="760,0 840,0 1024,520 940,520"
        fill="url(#oc2-ray)"
        style={{ animationDelay: "4s" }}
      />
    </g>

    {/* layered waves, top and bottom */}
    <g>
      <path
        className="oc2-w3"
        d={WAVE(120, 50)}
        fill="url(#oc2-w2)"
        transform="scale(1 -1) translate(0 -240)"
      />
      <path className="oc2-w1" d={WAVE(1180, 70)} fill="url(#oc2-w1)" />
      <path className="oc2-w2" d={WAVE(1260, 60)} fill="url(#oc2-w2)" />
      <path className="oc2-w3" d={WAVE(1350, 50)} fill="url(#oc2-w1)" />
    </g>

    {/* bubbles */}
    <g fill="none" stroke="#9ff3e6" strokeWidth="1.6">
      {BUBBLES.map((b, i) => (
        <circle
          key={i}
          className="oc2-bubble"
          cx={b.x}
          cy={b.y}
          r={b.r}
          style={{
            animationDuration: `${b.dur}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </g>
  </svg>
);

export const OceanDepth: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);

export default OceanDepth;
