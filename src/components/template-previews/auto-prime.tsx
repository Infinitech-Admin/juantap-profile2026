"use client";

// src/components/template-previews/auto-prime.tsx
// Auto Prime - Black, white and red car trading card. A line-art sports car draws itself at the bottom (free)
// Slug: "auto-prime" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
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
  bg: "#000000",
  text: "#ffffff",
  muted: "#9a9aa3",
  accent: "#e11d2e",
  accent2: "#ffffff",
  glow: "225,29,46",
  rowBg: "rgba(12,12,14,0.8)",
  rowBorder: "rgba(255,255,255,0.18)",
  panel: "#111113",
  barBg: "rgba(0,0,0,0.92)",
};

const RED = "#e11d2e";

const CSS = `
@keyframes ap-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes ap-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes ap-tail { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
@keyframes ap-glint { 0%,70%,100% { opacity: 0; } 80% { opacity: 1; } }
.ap-line { stroke-dasharray: 1; stroke-dashoffset: 0; animation: ap-draw 2.4s cubic-bezier(.6,.05,.3,1) both; }
.ap-line2 { stroke-dasharray: 1; stroke-dashoffset: 0; animation: ap-draw 2s cubic-bezier(.6,.05,.3,1) .5s both; }
.ap-red { animation: ap-fade .6s ease 2.2s both, ap-tail 2.6s ease-in-out 3s infinite; }
.ap-glint { animation: ap-glint 6s ease-in-out 3.2s infinite; }
.ap-ground { animation: ap-fade 1.2s ease 1.6s both; }
@media (prefers-reduced-motion: reduce) {
  .ap-line, .ap-line2, .ap-red, .ap-glint, .ap-ground { animation: none; }
  .ap-glint { opacity: 0; }
}
`;

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >
    <defs>
      <radialGradient id="ap-vignette" cx=".5" cy="0" r=".8">
        <stop offset="0" stopColor="#26262c" stopOpacity=".9" />
        <stop offset="1" stopColor="#000" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="ap-floor" cx=".5" cy=".5" r=".5">
        <stop offset="0" stopColor={RED} stopOpacity=".35" />
        <stop offset="1" stopColor={RED} stopOpacity="0" />
      </radialGradient>
      <linearGradient id="ap-rule" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset=".5" stopColor="#fff" stopOpacity=".7" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* Base */}
    <rect width="1024" height="1536" fill="#000" />
    <rect width="1024" height="800" fill="url(#ap-vignette)" />

    {/* Red glow on the floor under the car */}
    <ellipse cx="512" cy="1440" rx="420" ry="70" fill="url(#ap-floor)" />

    {/* Thin ground line, like the dashes beside the logo tagline */}
    <rect
      className="ap-ground"
      x="132"
      y="1428"
      width="760"
      height="2"
      fill="url(#ap-rule)"
    />

    {/* Line-art sports car (drawn in logo coordinates, scaled to fit) */}
    <g
      transform="translate(140 1290) scale(2.1) translate(-75 -185)"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* roofline and body */}
      <path
        className="ap-line"
        pathLength={1}
        d="M80 206 L138 196 L195 187 Q230 185 262 192 L300 204 L343 214 Q372 220 395 228 L425 240"
        stroke="#fff"
        strokeWidth="1.8"
      />
      {/* cabin glass */}
      <path
        className="ap-line2"
        pathLength={1}
        d="M172 212 L225 200 L282 207 L310 220"
        stroke="#fff"
        strokeWidth="1.4"
      />
      {/* door cut and sill */}
      <path
        className="ap-line2"
        pathLength={1}
        d="M172 212 Q186 232 205 248 L335 253"
        stroke="#fff"
        strokeWidth="1.4"
      />
      {/* wheel arches */}
      <path
        className="ap-line2"
        pathLength={1}
        d="M105 238 Q128 214 152 238"
        stroke="#fff"
        strokeWidth="1.6"
      />
      <path
        className="ap-line2"
        pathLength={1}
        d="M332 240 Q356 214 381 240"
        stroke="#fff"
        strokeWidth="1.6"
      />
      {/* rear and front lower body */}
      <path
        className="ap-line2"
        pathLength={1}
        d="M80 206 L80 222 L105 238"
        stroke="#fff"
        strokeWidth="1.4"
      />
      <path
        className="ap-line2"
        pathLength={1}
        d="M381 240 L425 240"
        stroke="#fff"
        strokeWidth="1.4"
      />
      {/* mirror */}
      <path
        className="ap-line2"
        pathLength={1}
        d="M284 208 L292 212"
        stroke="#fff"
        strokeWidth="1.6"
      />

      {/* red tail and head light accents */}
      <path
        className="ap-red"
        d="M80 208 L84 226"
        stroke={RED}
        strokeWidth="2.6"
      />
      <path
        className="ap-red"
        d="M392 232 L410 244"
        stroke={RED}
        strokeWidth="2.6"
      />
      {/* headlight glint */}
      <circle className="ap-glint" cx="424" cy="240" r="3" fill="#fff" />
    </g>

    {/* Corner brackets */}
    <g
      stroke={RED}
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
      opacity=".85"
    >
      <path d="M44 100 V44 H100" />
      <path d="M924 44 H980 V100" />
      <path d="M44 1436 V1492 H100" />
      <path d="M924 1492 H980 V1436" />
    </g>

    {/* Hairline frame */}
    <rect
      x="44"
      y="44"
      width="936"
      height="1448"
      rx="2"
      fill="none"
      stroke="#fff"
      strokeWidth="1"
      opacity=".14"
    />
  </svg>
);

export const AutoPrime: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);

export default AutoPrime;
