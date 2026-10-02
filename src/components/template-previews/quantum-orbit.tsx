"use client";

// src/components/template-previews/quantum-orbit.tsx
// Quantum Orbit - Glowing atom model with electrons racing on tilted orbits, a pulsing nucleus and rising particles (premium)
// Slug: "quantum-orbit" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
// and in TemplateCard.tsx (PREVIEW_ASPECT).
import React from "react";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

const THEME: CardTheme = {
  font: "'Exo 2', 'Segoe UI', Arial, sans-serif",
  bg: "#02101a",
  text: "#e6faff",
  muted: "#8bc4d6",
  accent: "#38bdf8",
  accent2: "#fbbf24",
  glow: "56,189,248",
  rowBg: "rgba(4,28,44,0.72)",
  rowBorder: "rgba(56,189,248,0.3)",
  panel: "#062235",
  barBg: "rgba(2,16,26,0.92)",
};

const CSS = `
@keyframes qob-spin { to { rotate: 360deg; } }
@keyframes qob-ring { 0% { scale: .6; opacity: .8; } 100% { scale: 2.6; opacity: 0; } }
@keyframes qob-rise { 0% { translate: 0 0; opacity: 0; } 20% { opacity: .9; } 100% { translate: 20px -1500px; opacity: 0; } }
.qob-outer { transform-origin: 512px 560px; animation: qob-spin 70s linear infinite; }
.qob-ring { transform-box: fill-box; transform-origin: center; animation: qob-ring 3.6s ease-out infinite; }
.qob-p { animation: qob-rise 13s linear infinite; }
@media (prefers-reduced-motion: reduce) { .qob-outer, .qob-ring, .qob-p { animation: none; } }
`;

const ORBITS: [number, string, string, number][] = [
  [0, "#38bdf8", "6s", 0],
  [60, "#fbbf24", "8s", 1],
  [120, "#a78bfa", "7s", 2],
];
const PARTS = Array.from({ length: 18 }, (_, i) => ({
  x: 40 + ((i * 59) % 950),
  y: 1560 + ((i * 83) % 200),
  r: 1.5 + (i % 3),
  d: i * 0.8,
}));
const PATH = "M182 560 a330 120 0 1 0 660 0 a330 120 0 1 0 -660 0";

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >
    <defs>
      <radialGradient id="qob-bg" cx="50%" cy="37%" r="80%">
        <stop offset="0" stopColor="#06304a" />
        <stop offset=".6" stopColor="#02101a" />
        <stop offset="1" stopColor="#010609" />
      </radialGradient>
      <radialGradient id="qob-nuc">
        <stop offset="0" stopColor="#fff" />
        <stop offset=".5" stopColor="#7dd3fc" />
        <stop offset="1" stopColor="#0284c7" />
      </radialGradient>
      <pattern
        id="qob-dots"
        width="40"
        height="40"
        patternUnits="userSpaceOnUse"
      >
        <circle cx="2" cy="2" r="1.2" fill="#38bdf8" opacity=".2" />
      </pattern>
    </defs>
    <rect width="1024" height="1536" fill="url(#qob-bg)" />
    <rect width="1024" height="1536" fill="url(#qob-dots)" />
    <g className="qob-outer">
      <circle
        cx="512"
        cy="560"
        r="400"
        fill="none"
        stroke="#38bdf8"
        strokeWidth="1.4"
        strokeDasharray="4 14"
        opacity=".5"
      />
      <circle cx="912" cy="560" r="8" fill="#fbbf24" />
    </g>
    {ORBITS.map(([rot, color, dur, i]) => (
      <g key={rot} transform={`rotate(${rot} 512 560)`}>
        <ellipse
          cx="512"
          cy="560"
          rx="330"
          ry="120"
          fill="none"
          stroke={color}
          strokeWidth="2"
          opacity=".55"
        />
        <circle r="11" fill={color}>
          <animateMotion
            dur={dur}
            begin={`-${i * 2}s`}
            repeatCount="indefinite"
            path={PATH}
          />
        </circle>
      </g>
    ))}
    <circle
      className="qob-ring"
      cx="512"
      cy="560"
      r="34"
      fill="none"
      stroke="#7dd3fc"
      strokeWidth="2"
    />
    <circle
      className="qob-ring"
      style={{ animationDelay: "1.8s" }}
      cx="512"
      cy="560"
      r="34"
      fill="none"
      stroke="#7dd3fc"
      strokeWidth="2"
    />
    <circle cx="512" cy="560" r="30" fill="url(#qob-nuc)" />
    {PARTS.map((p, i) => (
      <circle
        key={i}
        className="qob-p"
        style={{ animationDelay: `${p.d}s` }}
        cx={p.x}
        cy={p.y}
        r={p.r}
        fill="#7dd3fc"
      />
    ))}
    <rect
      x="44"
      y="44"
      width="936"
      height="1448"
      rx="22"
      fill="none"
      stroke="#38bdf8"
      strokeWidth="1.2"
      opacity=".45"
    />
  </svg>
);

export const QuantumOrbit: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);

export default QuantumOrbit;
