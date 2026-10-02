"use client";

// src/components/template-previews/holo-prism.tsx
// Holo Prism - holographic colour-shifting card (premium)
// Slug: "holo-prism" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
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
  bg: "#0a0a14",
  text: "#f3f1ff",
  muted: "#a9a6cc",
  accent: "#a78bfa",
  accent2: "#22d3ee",
  glow: "167,139,250",
  rowBg: "rgba(20,18,44,0.7)",
  rowBorder: "rgba(167,139,250,0.32)",
  panel: "#14122c",
  barBg: "rgba(10,10,20,0.92)",
};

const CSS = `
@keyframes hp-hue   { to { filter: hue-rotate(360deg); } }
@keyframes hp-float { 0%,100% { translate: 0 0; } 50% { translate: 40px -60px; } }
@keyframes hp-spin  { to { rotate: 360deg; } }
.hp-hue   { animation: hp-hue 16s linear infinite; }
.hp-f1 { animation: hp-float 11s ease-in-out infinite; }
.hp-f2 { animation: hp-float 15s ease-in-out infinite reverse; }
.hp-f3 { animation: hp-float 13s ease-in-out infinite; animation-delay: -5s; }
.hp-tri { transform-box: fill-box; transform-origin: center; animation: hp-spin 50s linear infinite; }
.hp-tri2 { transform-box: fill-box; transform-origin: center; animation: hp-spin 70s linear infinite reverse; }
@media (prefers-reduced-motion: reduce) { .hp-hue, .hp-f1, .hp-f2, .hp-f3, .hp-tri, .hp-tri2 { animation: none; } }
`;

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >
    <defs>
      <radialGradient id="hp-o1">
        <stop offset="0" stopColor="#a78bfa" stopOpacity=".85" />
        <stop offset="1" stopColor="#a78bfa" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="hp-o2">
        <stop offset="0" stopColor="#22d3ee" stopOpacity=".8" />
        <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="hp-o3">
        <stop offset="0" stopColor="#f472b6" stopOpacity=".75" />
        <stop offset="1" stopColor="#f472b6" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="hp-edge" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#22d3ee" />
        <stop offset=".5" stopColor="#a78bfa" />
        <stop offset="1" stopColor="#f472b6" />
      </linearGradient>
    </defs>
    <rect width="1024" height="1536" fill="#0a0a14" />
    <g className="hp-hue">
      <circle className="hp-f1" cx="220" cy="300" r="380" fill="url(#hp-o1)" />
      <circle className="hp-f2" cx="860" cy="760" r="400" fill="url(#hp-o2)" />
      <circle className="hp-f3" cx="360" cy="1320" r="420" fill="url(#hp-o3)" />
      <polygon
        className="hp-tri"
        points="512,300 740,700 284,700"
        fill="none"
        stroke="url(#hp-edge)"
        strokeWidth="2.4"
      />
      <polygon
        className="hp-tri2"
        points="512,1000 700,1330 324,1330"
        fill="none"
        stroke="url(#hp-edge)"
        strokeWidth="1.6"
        opacity=".7"
      />
    </g>
    <rect
      x="44"
      y="44"
      width="936"
      height="1448"
      rx="30"
      fill="none"
      stroke="url(#hp-edge)"
      strokeWidth="2"
      opacity=".75"
    />
  </svg>
);

export const HoloPrism: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);
export default HoloPrism;
