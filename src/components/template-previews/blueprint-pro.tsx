"use client";

// src/components/template-previews/blueprint-pro.tsx
// Blueprint Pro - Engineering blueprint with a measured grid, self-drawing circles and a sweeping radius arm (free)
// Slug: "blueprint-pro" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
// and in TemplateCard.tsx (PREVIEW_ASPECT).
import React from "react";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

const THEME: CardTheme = {
  font: "'IBM Plex Mono', 'Courier New', monospace",
  bg: "#0b3a6b",
  text: "#eaf4ff",
  muted: "#9cc3ea",
  accent: "#93c5fd",
  accent2: "#fde047",
  glow: "147,197,253",
  rowBg: "rgba(10,52,96,0.75)",
  rowBorder: "rgba(147,197,253,0.35)",
  panel: "#0d4580",
  barBg: "rgba(11,58,107,0.92)",
};

const CSS = `
@keyframes bpr-draw { from { stroke-dashoffset: 1000; } to { stroke-dashoffset: 0; } }
@keyframes bpr-spin { to { rotate: 360deg; } }
@keyframes bpr-blink { 0%,100% { opacity: .3; } 50% { opacity: 1; } }
.bpr-d1 { stroke-dasharray: 1000; animation: bpr-draw 3.4s ease-out .2s both; }
.bpr-d2 { stroke-dasharray: 1000; animation: bpr-draw 4.2s ease-out .8s both; }
.bpr-arm { transform-origin: 800px 300px; animation: bpr-spin 18s linear infinite; }
.bpr-arm2 { transform-origin: 220px 1240px; animation: bpr-spin 26s linear infinite reverse; }
.bpr-blink { animation: bpr-blink 2.4s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .bpr-d1, .bpr-d2, .bpr-arm, .bpr-arm2, .bpr-blink { animation: none; } }
`;

const TICKS = Array.from({ length: 24 }, (_, i) => i * 15);

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >

    <defs>
      <pattern id="bpr-minor" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#93c5fd" strokeWidth=".6" opacity=".18" /></pattern>
      <pattern id="bpr-major" width="160" height="160" patternUnits="userSpaceOnUse"><path d="M160 0H0V160" fill="none" stroke="#93c5fd" strokeWidth="1.2" opacity=".3" /></pattern>
    </defs>
    <rect width="1024" height="1536" fill="#0b3a6b" />
    <rect width="1024" height="1536" fill="url(#bpr-minor)" />
    <rect width="1024" height="1536" fill="url(#bpr-major)" />
    <g fill="none" stroke="#eaf4ff" strokeLinecap="round">
      <circle className="bpr-d1" pathLength={1000} cx="800" cy="300" r="190" strokeWidth="2" />
      <circle className="bpr-d2" pathLength={1000} cx="800" cy="300" r="130" strokeWidth="1.4" strokeOpacity=".7" />
      <circle className="bpr-d2" pathLength={1000} cx="220" cy="1240" r="220" strokeWidth="2" />
      <circle className="bpr-d1" pathLength={1000} cx="220" cy="1240" r="140" strokeWidth="1.4" strokeOpacity=".7" />
      <path className="bpr-d1" pathLength={1000} d="M40 700 H300 M40 690 V710 M300 690 V710" strokeWidth="1.6" stroke="#fde047" />
      <path className="bpr-d2" pathLength={1000} d="M980 1000 V1300 M970 1000 H990 M970 1300 H990" strokeWidth="1.6" stroke="#fde047" />
    </g>
    {TICKS.map((a) => (<line key={a} x1="800" y1="96" x2="800" y2={a % 45 ? 106 : 118} stroke="#eaf4ff" strokeOpacity=".7" transform={`rotate(${a} 800 300)`} />))}
    <g stroke="#eaf4ff" strokeOpacity=".4"><line x1="560" y1="300" x2="1040" y2="300" /><line x1="800" y1="60" x2="800" y2="540" /><line x1="-20" y1="1240" x2="460" y2="1240" /><line x1="220" y1="1000" x2="220" y2="1480" /></g>
    <g className="bpr-arm"><line x1="800" y1="300" x2="800" y2="110" stroke="#fde047" strokeWidth="2.4" /><circle cx="800" cy="110" r="7" fill="#fde047" /></g>
    <g className="bpr-arm2"><line x1="220" y1="1240" x2="220" y2="1020" stroke="#fde047" strokeWidth="2.4" /><circle cx="220" cy="1020" r="7" fill="#fde047" /></g>
    <circle className="bpr-blink" cx="800" cy="300" r="6" fill="#fde047" />
    <circle className="bpr-blink" style={{ animationDelay: "1s" }} cx="220" cy="1240" r="6" fill="#fde047" />
    <rect x="44" y="44" width="936" height="1448" fill="none" stroke="#eaf4ff" strokeWidth="2" opacity=".6" />
  </svg>
);

export const BlueprintPro: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);

export default BlueprintPro;
