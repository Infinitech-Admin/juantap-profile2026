"use client";

// src/components/template-previews/auto-prime.tsx
// Auto Prime - Black, white and red car trading card with a video at the bottom (free)
// Slug: "auto-prime" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
// and in TemplateCard.tsx (PREVIEW_ASPECT).
import React, { useEffect, useRef, useState } from "react";
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

// Files live in /public, so they are served from the site root.
const VIDEOS = ["/videos/video1.mp4", "/videos/video2.mp4"];

const CSS = `
@keyframes ap-fade { from { opacity: 0; } to { opacity: 1; } }
.ap-video { animation: ap-fade .8s ease .4s both; }
@media (prefers-reduced-motion: reduce) {
  .ap-video { animation: none; }
}
`;

/**
 * Plays video1 then video2, then loops back to video1.
 * Sits in the empty space below the socials.
 */
const ApVideo = () => {
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
      className="ap-video absolute overflow-hidden rounded-xl"
      style={{
        left: "8%",
        right: "8%",
        bottom: "14%",
        aspectRatio: "16 / 9",
        background: "#000",
        border: "1px solid rgba(225,29,46,0.6)",
        boxShadow: "0 0 24px rgba(225,29,46,0.25)",
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
        <radialGradient id="ap-vignette" cx=".5" cy="0" r=".8">
          <stop offset="0" stopColor="#26262c" stopOpacity=".9" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Base */}
      <rect width="1024" height="1536" fill="#000" />
      <rect width="1024" height="800" fill="url(#ap-vignette)" />

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

    {/* Video in the empty space below the socials */}
    <ApVideo />
  </>
);

export const AutoPrime: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);

export default AutoPrime;
