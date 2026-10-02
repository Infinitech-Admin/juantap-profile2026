"use client";

// src/components/template-previews/sunset-blaze.tsx
import React from "react";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

const THEME: CardTheme = {
  font: "'Poppins', 'Segoe UI', Arial, sans-serif",
  bg: "#2a0f3d",
  text: "#fff7f0",
  muted: "#ffd6c2",
  accent: "#ff7a45",
  accent2: "#ffd29a",
  glow: "255,122,69",
  rowBg: "rgba(58,16,64,0.55)",
  rowBorder: "rgba(255,210,154,0.35)",
  panel: "#3a1045",
  barBg: "rgba(42,12,56,0.78)",
};

const CSS = `
@keyframes sb-pulse { 0%,100% { scale: 1; opacity: .85; } 50% { scale: 1.06; opacity: 1; } }
@keyframes sb-cloud { from { translate: -420px 0; } to { translate: 1200px 0; } }
@keyframes sb-bird  { 0%,100% { scale: 1 1; } 50% { scale: 1 .55; } }
@keyframes sb-fly   { from { translate: -120px 0; } to { translate: 1200px -90px; } }
.sb-sun   { animation: sb-pulse 6s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.sb-cloud { animation: sb-cloud 60s linear infinite; }
.sb-fly   { animation: sb-fly 26s linear infinite; }
.sb-bird  { animation: sb-bird .9s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
@media (prefers-reduced-motion: reduce) { .sb-sun, .sb-cloud, .sb-fly, .sb-bird { animation: none; } }
`;

const Cloud = ({
  x,
  y,
  s,
  o,
  delay,
}: {
  x: number;
  y: number;
  s: number;
  o: number;
  delay: number;
}) => (
  <g
    className="sb-cloud"
    style={{
      animationDelay: `${delay}s`,
      animationDuration: `${50 + s * 20}s`,
    }}
    opacity={o}
  >
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#ffd9c8">
      <ellipse cx="0" cy="0" rx="120" ry="22" />
      <ellipse cx="-40" cy="-16" rx="52" ry="26" />
      <ellipse cx="30" cy="-22" rx="62" ry="30" />
    </g>
  </g>
);

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >
    <defs>
      <linearGradient id="sb-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2a0f3d" />
        <stop offset="0.38" stopColor="#8a2d6b" />
        <stop offset="0.62" stopColor="#ff6b4a" />
        <stop offset="0.8" stopColor="#ffb065" />
        <stop offset="1" stopColor="#ffd9a0" />
      </linearGradient>
      <radialGradient id="sb-sun" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#fff3c4" />
        <stop offset="0.35" stopColor="#ffc46b" />
        <stop offset="1" stopColor="#ff6b4a" stopOpacity="0" />
      </radialGradient>
    </defs>

    <rect width="1024" height="1536" fill="url(#sb-bg)" />

    {/* sun */}
    <circle className="sb-sun" cx="512" cy="1080" r="420" fill="url(#sb-sun)" />

    {/* clouds */}
    <Cloud x={0} y={260} s={1.3} o={0.35} delay={-8} />
    <Cloud x={0} y={470} s={0.9} o={0.3} delay={-30} />
    <Cloud x={0} y={720} s={1.1} o={0.4} delay={-18} />

    {/* birds */}
    <g
      className="sb-fly"
      fill="none"
      stroke="#3a1045"
      strokeWidth="3"
      strokeLinecap="round"
    >
      <g transform="translate(0 600)">
        <path className="sb-bird" d="M0 0 Q14 -14 28 0 Q42 -14 56 0" />
      </g>
      <g transform="translate(-70 640)">
        <path
          className="sb-bird"
          d="M0 0 Q10 -10 20 0 Q30 -10 40 0"
          style={{ animationDelay: ".3s" }}
        />
      </g>
    </g>

    {/* hill layers */}
    <path
      d="M0 1230 Q260 1130 520 1210 T1024 1180 V1536 H0 Z"
      fill="#7a2a68"
      opacity="0.85"
    />
    <path d="M0 1320 Q300 1230 600 1310 T1024 1290 V1536 H0 Z" fill="#4a1a5a" />
    <path d="M0 1420 Q240 1350 520 1410 T1024 1390 V1536 H0 Z" fill="#2a0f3d" />
  </svg>
);

export const SunsetBlaze: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);

export default SunsetBlaze;
