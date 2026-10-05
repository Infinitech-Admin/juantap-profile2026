"use client";

// src/components/template-previews/macetro-art.tsx
// mACEtro Art School - Cream and navy with gold accents, watercolor splashes, colorful floating music notes and a video panel (premium)
// Slug: "macetro-art" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
// and in TemplateCard.tsx (PREVIEW_ASPECT).
import React, { useEffect, useRef, useState } from "react";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

const NAVY = "#0b1f5c";
const GOLD = "#c8921f";
const GOLD_LIGHT = "#e4b94d";
const CREAM = "#fbf6e8";

const THEME: CardTheme = {
  font: "'Playfair Display', 'Georgia', 'Times New Roman', serif",
  bg: CREAM,
  text: NAVY,
  muted: "#5b6486",
  accent: GOLD,
  accent2: GOLD_LIGHT,
  glow: "200,146,31",
  rowBg: "rgba(255,255,255,0.78)",
  rowBorder: "rgba(200,146,31,0.45)",
  panel: "#fffaf0",
  barBg: "rgba(251,246,232,0.96)",
};

// Colours from the banner's paint palette and music notes
const BLUE = "#2f6fd6";
const PURPLE = "#8a4fc7";
const TEAL = "#1fa6a0";
const ORANGE = "#f08a24";
const PINK = "#e0457b";
const GREEN = "#2aa73a";
const RED = "#e8212b";
const PALETTE = [RED, "#f6b40e", "#12a8f0", GREEN];

// Files live in /public, so they are served from the site root.
const VIDEOS = ["/macetro.mp4"];

const CSS = `
@keyframes mt-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes mt-twinkle { 0%,100% { opacity: .3; transform: scale(.65); } 50% { opacity: 1; transform: scale(1); } }
@keyframes mt-float { 0%,100% { translate: 0 0; } 50% { translate: 0 -12px; } }
.mt-star { transform-box: fill-box; transform-origin: center; animation: mt-twinkle 4.5s ease-in-out infinite; }
.mt-note { animation: mt-float 6s ease-in-out infinite; }
.mt-video { animation: mt-fade .8s ease .3s both; }
@media (prefers-reduced-motion: reduce) {
  .mt-star { animation: none; opacity: .85; }
  .mt-note, .mt-video { animation: none; }
}
`;

// Four-point sparkle path centred on 0,0
const star = (s: number) =>
  `M0 ${-s} Q${s * 0.14} ${-s * 0.14} ${s} 0 Q${s * 0.14} ${s * 0.14} 0 ${s} Q${-s * 0.14} ${s * 0.14} ${-s} 0 Q${-s * 0.14} ${-s * 0.14} 0 ${-s} Z`;

// [x, y, size, animation delay]
const SPARKLES: [number, number, number, number][] = [
  [130, 560, 30, 0],
  [880, 470, 26, 1.2],
  [250, 120, 20, 2.4],
  [940, 820, 22, 3.1],
  [90, 900, 18, 0.7],
  [800, 40, 16, 1.9],
];

// [x, y, scale, colour, double?, delay]
const NOTES: [number, number, number, string, boolean, number][] = [
  [840, 150, 1.5, BLUE, false, 0],
  [720, 230, 1.3, RED, true, 1.1],
  [930, 290, 1.4, GREEN, false, 2.2],
  [620, 130, 1.1, PURPLE, true, 3.0],
  [880, 400, 1.2, ORANGE, false, 1.7],
  [120, 1060, 1.2, PURPLE, true, 0.6],
  [200, 1180, 1.4, BLUE, false, 2.6],
];

const Note = ({ color, double }: { color: string; double: boolean }) => (
  <g fill={color} stroke={color} strokeLinecap="round" strokeLinejoin="round">
    <ellipse
      cx="0"
      cy="0"
      rx="10"
      ry="7"
      transform="rotate(-20)"
      stroke="none"
    />
    <path d="M9 -2 V-38" strokeWidth="3" fill="none" />
    {double ? (
      <>
        <ellipse
          cx="26"
          cy="-5"
          rx="10"
          ry="7"
          transform="rotate(-20 26 -5)"
          stroke="none"
        />
        <path d="M35 -7 V-43" strokeWidth="3" fill="none" />
        <path d="M9 -38 L35 -43 V-35 L9 -30 Z" stroke="none" />
      </>
    ) : (
      <path d="M9 -38 Q26 -30 22 -14" strokeWidth="3" fill="none" />
    )}
  </g>
);

/**
 * Plays video1 then video2, then loops back to video1.
 * Sits in the empty space below the socials.
 */
const MtVideo = () => {
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLVideoElement>(null);

  // Re-trigger play when the source changes (some browsers pause on src swap)
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.load();
    v.play().catch(() => {
      /* autoplay blocked - user can tap to play */
    });
  }, [index]);

  return (
    <div
      className="mt-video absolute overflow-hidden"
      style={{
        left: "8%",
        right: "8%",
        bottom: "14%",
        aspectRatio: "16 / 9",
        borderRadius: 14,
        background: "#000",
        border: `1px solid ${GOLD}`,
        // second thin gold ring, echoing the double circle in the logo
        boxShadow: `0 0 0 4px ${CREAM}, 0 0 0 5px rgba(200,146,31,.6), 0 12px 30px rgba(11,31,92,.28)`,
      }}
    >
      <video
        ref={ref}
        src={VIDEOS[index]}
        autoPlay
        muted
        playsInline
        preload="metadata"
        onEnded={() => setIndex((n) => (n + 1) % VIDEOS.length)}
        onClick={(e) => {
          const v = e.currentTarget;
          v.paused ? v.play() : v.pause();
        }}
        className="w-full h-full object-cover cursor-pointer"
      />
    </div>
  );
};

const Artwork = () => (
  <>
    <svg
      viewBox="0 0 1024 1536"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
    >
      <defs>
        <radialGradient id="mt-bg" cx=".5" cy=".35" r=".85">
          <stop offset="0" stopColor="#fffdf6" />
          <stop offset="1" stopColor={CREAM} />
        </radialGradient>
        <linearGradient id="mt-navy" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0d2468" />
          <stop offset="1" stopColor="#071642" />
        </linearGradient>
        <linearGradient id="mt-ring-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset=".7" stopColor="#fff" stopOpacity=".5" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="mt-ring-mask">
          <rect width="1024" height="1536" fill="url(#mt-ring-fade)" />
        </mask>
        {/* Soft, uneven edges so the blobs read as watercolor */}
        <filter
          id="mt-wc"
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency=".012"
            numOctaves="3"
            seed="4"
            result="n"
          />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="90" />
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      {/* Base */}
      <rect width="1024" height="1536" fill="url(#mt-bg)" />

      {/* Faint double gold ring, like the circle around the logo */}
      <g
        mask="url(#mt-ring-mask)"
        fill="none"
        stroke={GOLD}
        strokeWidth="2"
        opacity=".3"
      >
        <circle cx="512" cy="820" r="640" />
        <circle cx="512" cy="820" r="660" strokeWidth="1" />
      </g>

      {/* Watercolor splashes */}
      <g filter="url(#mt-wc)">
        {/* top right */}
        <ellipse
          cx="900"
          cy="130"
          rx="190"
          ry="150"
          fill={BLUE}
          opacity=".42"
        />
        <ellipse
          cx="985"
          cy="320"
          rx="120"
          ry="160"
          fill={PURPLE}
          opacity=".36"
        />
        <ellipse cx="740" cy="50" rx="150" ry="90" fill={TEAL} opacity=".32" />
        <ellipse
          cx="1000"
          cy="30"
          rx="110"
          ry="80"
          fill={ORANGE}
          opacity=".35"
        />
        {/* left edge */}
        <ellipse cx="40" cy="620" rx="100" ry="170" fill={BLUE} opacity=".28" />
        {/* bottom left */}
        <ellipse
          cx="80"
          cy="1280"
          rx="200"
          ry="150"
          fill={PURPLE}
          opacity=".38"
        />
        <ellipse
          cx="210"
          cy="1440"
          rx="190"
          ry="110"
          fill={BLUE}
          opacity=".38"
        />
        <ellipse
          cx="40"
          cy="1130"
          rx="110"
          ry="130"
          fill={ORANGE}
          opacity=".3"
        />
        {/* bottom right */}
        <ellipse
          cx="960"
          cy="1300"
          rx="170"
          ry="130"
          fill={ORANGE}
          opacity=".38"
        />
        <ellipse
          cx="880"
          cy="1450"
          rx="190"
          ry="100"
          fill={PINK}
          opacity=".3"
        />
        <ellipse
          cx="1010"
          cy="1160"
          rx="90"
          ry="120"
          fill={TEAL}
          opacity=".28"
        />
      </g>

      {/* Navy swoosh, top left, with gold edge lines */}
      <path d="M0 0 H520 C300 40 120 150 0 380 Z" fill="url(#mt-navy)" />
      <g fill="none" stroke={GOLD} strokeLinecap="round">
        <path d="M0 412 C140 172 320 64 560 22" strokeWidth="3" />
        <path
          d="M0 436 C150 196 335 84 585 40"
          strokeWidth="1.2"
          opacity=".7"
        />
      </g>

      {/* Navy swoosh, bottom right */}
      <path
        d="M1024 1536 H504 C724 1496 904 1386 1024 1156 Z"
        fill="url(#mt-navy)"
      />
      <g fill="none" stroke={GOLD} strokeLinecap="round">
        <path d="M1024 1124 C884 1364 704 1472 464 1514" strokeWidth="3" />
        <path
          d="M1024 1100 C874 1340 689 1452 439 1496"
          strokeWidth="1.2"
          opacity=".7"
        />
      </g>

      {/* Sweeping staff lines behind the notes */}
      <g fill="none" stroke={NAVY} strokeWidth="1.2" opacity=".22">
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M520 ${290 + i * 11} C680 ${130 + i * 11}, 840 ${340 + i * 11}, 1024 ${170 + i * 11}`}
          />
        ))}
      </g>

      {/* Floating music notes */}
      {NOTES.map(([x, y, s, c, dbl, d], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          <g className="mt-note" style={{ animationDelay: `${d}s` }}>
            <Note color={c} double={dbl} />
          </g>
        </g>
      ))}

      {/* Gold sparkles */}
      {SPARKLES.map(([x, y, s, d], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <path
            className="mt-star"
            d={star(s)}
            fill={i % 2 ? GOLD : GOLD_LIGHT}
            style={{ animationDelay: `${d}s` }}
          />
        </g>
      ))}

      {/* Double hairline gold frame */}
      <rect
        x="44"
        y="44"
        width="936"
        height="1448"
        rx="2"
        fill="none"
        stroke={GOLD}
        strokeWidth="1.2"
        opacity=".55"
      />
      <rect
        x="54"
        y="54"
        width="916"
        height="1428"
        rx="2"
        fill="none"
        stroke={GOLD}
        strokeWidth=".8"
        opacity=".3"
      />

      {/* Paint palette dots sitting on the top edge of the frame */}
      {PALETTE.map((c, i) => (
        <g key={c}>
          <circle cx={600 + i * 48} cy="44" r="11" fill={CREAM} />
          <circle cx={600 + i * 48} cy="44" r="7.5" fill={c} />
        </g>
      ))}
    </svg>

    {/* Video in the empty space below the socials */}
    <MtVideo />
  </>
);

export const MacetroArt: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);

export default MacetroArt;
