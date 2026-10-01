"use client";

// src/components/template-previews/halloween.tsx
import React, { useEffect, useState } from "react";
import {
  User as UserIcon,
  Mail,
  Phone,
  Globe,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  Youtube,
  Send,
  MessageCircle,
  Copy,
  Check,
  QrCode,
  Share2,
  X,
  UserPlus,
  Ghost,
  Flame,
} from "lucide-react";
import type { Template, User } from "@/types/template";

interface HalloweenProps {
  template?: Template;
  user?: User;
}

/* ---------- Palette (taken from the artwork) ---------- */
const DARK = "#0b0604";
const ORANGE = "#ff8a1f";
const EMBER = "#ff5a0a";
const GLOW = "#ffb347";
const CREAM = "#ffe9d2";
const MUTED = "#d9a77a";
const ROW_BG = "rgba(14,6,2,0.78)";
const ROW_BORDER = "rgba(255,122,24,0.45)";

const FONT = "Poppins, 'Segoe UI', Arial, sans-serif";
const FONT_TITLE = "Creepster, Poppins, 'Segoe UI', Arial, sans-serif";

// Put the artwork in  public/images/halloween-bg.jpg
const BG_IMAGE = "/images/halloween-bg.jpg";

// How long the jump-scare ghost stays on screen (ms)
const GHOST_DURATION = 2600;

// Realistic ghost photo (transparent PNG/WebP works best, keep it small < 200KB).
// Put it in  public/images/ghost-scare.png
// If the file is missing, the cartoon ghost is shown instead.
const GHOST_IMAGE = "/images/ghost-scare.png";

// Optional scream sound, e.g. "/sounds/boo.mp3". Leave "" to disable.
// Note: some browsers block audio until the user taps once.
const GHOST_SOUND = "";

const TikTokIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06Z" />
  </svg>
);

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  facebook: <Facebook size={14} />,
  instagram: <Instagram size={14} />,
  twitter: <Twitter size={14} />,
  linkedin: <Linkedin size={14} />,
  github: <Github size={14} />,
  youtube: <Youtube size={14} />,
  tiktok: <TikTokIcon size={14} />,
  telegram: <Send size={14} />,
  viber: <MessageCircle size={14} />,
};

const splitList = (value?: string | null) =>
  value
    ? value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

const isVisible = (link: any) => {
  const v = link?.isVisible ?? link?.is_visible;
  return v === undefined || v === true || v === 1 || v === "1";
};

/* ---------- vCard helper ---------- */
const vEsc = (s: string) =>
  s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");

/* ---------- Animated overlays (positions are % of the 1024 x 1536 artwork) ---------- */

// Haunted-house windows: [x, y, w, h] in artwork pixels
const WINDOWS: [number, number, number, number][] = [
  [733, 545, 13, 40],
  [832, 600, 13, 42],
  [770, 684, 26, 58],
  [640, 765, 22, 78],
  [763, 797, 14, 36],
  [851, 788, 10, 30],
  [879, 725, 10, 28],
];

// Soft glows: x%, y%, size (cqw), colour, class, delay (s)
const GLOWS: {
  x: number;
  y: number;
  size: number;
  color: string;
  cls: string;
  delay: number;
}[] = [
  {
    x: 73.8,
    y: 20.5,
    size: 56,
    color: "rgba(255,140,30,0.55)",
    cls: "hw-moon",
    delay: 0,
  },
  {
    x: 22,
    y: 27.5,
    size: 22,
    color: "rgba(255,160,50,0.6)",
    cls: "hw-flicker",
    delay: 0.3,
  },
  {
    x: 47,
    y: 84.5,
    size: 20,
    color: "rgba(255,150,40,0.55)",
    cls: "hw-flicker",
    delay: 1.1,
  },
  {
    x: 24,
    y: 80,
    size: 48,
    color: "rgba(255,120,20,0.5)",
    cls: "hw-pumpkin",
    delay: 0,
  },
  {
    x: 88,
    y: 72,
    size: 20,
    color: "rgba(255,130,30,0.55)",
    cls: "hw-pumpkin",
    delay: 0.8,
  },
];

const BATS: {
  top: number;
  w: number;
  dur: number;
  delay: number;
  flap: number;
}[] = [
  { top: 10, w: 15, dur: 15, delay: -3, flap: 0.5 },
  { top: 22, w: 10, dur: 19, delay: -11, flap: 0.42 },
  { top: 34, w: 8, dur: 23, delay: -17, flap: 0.36 },
  { top: 5, w: 7, dur: 27, delay: -6, flap: 0.4 },
];

const LEAVES: {
  x: number;
  size: number;
  color: string;
  dur: number;
  delay: number;
  sway: number;
}[] = [
  { x: 6, size: 4.2, color: "#ff7a1a", dur: 17, delay: -2, sway: 3.2 },
  { x: 16, size: 3.4, color: "#c2410c", dur: 21, delay: -9, sway: 4 },
  { x: 29, size: 4.6, color: "#ff9a3c", dur: 19, delay: -14, sway: 3.6 },
  { x: 41, size: 3.2, color: "#8a3b0f", dur: 24, delay: -5, sway: 4.4 },
  { x: 55, size: 4, color: "#ff7a1a", dur: 18, delay: -11, sway: 3 },
  { x: 67, size: 3.6, color: "#c2410c", dur: 22, delay: -16, sway: 3.8 },
  { x: 78, size: 4.4, color: "#ff9a3c", dur: 20, delay: -7, sway: 3.4 },
  { x: 90, size: 3.4, color: "#8a3b0f", dur: 25, delay: -1, sway: 4.2 },
];

// Embers rising from the pumpkins and lanterns
const EMBERS: {
  x: number;
  y: number;
  s: number;
  dur: number;
  delay: number;
}[] = [
  { x: 14, y: 80, s: 1.1, dur: 6, delay: 0 },
  { x: 21, y: 78, s: 0.9, dur: 7.5, delay: 1.5 },
  { x: 28, y: 82, s: 1.3, dur: 6.5, delay: 3 },
  { x: 35, y: 79, s: 0.8, dur: 8, delay: 4.5 },
  { x: 46, y: 84, s: 1, dur: 7, delay: 0.8 },
  { x: 49, y: 83, s: 0.8, dur: 6, delay: 2.4 },
  { x: 86, y: 71, s: 0.9, dur: 7, delay: 1.2 },
  { x: 90, y: 72, s: 1.1, dur: 6.5, delay: 3.6 },
  { x: 22, y: 30, s: 0.8, dur: 8, delay: 2 },
  { x: 62, y: 92, s: 0.9, dur: 7.5, delay: 5 },
];

const HW_CSS = `
@import url("https://fonts.googleapis.com/css2?family=Creepster&display=swap");

@keyframes hw-flicker  {
  0%,100% { opacity: .9; } 8% { opacity: .5; } 14% { opacity: 1; } 22% { opacity: .65; }
  30% { opacity: 1; } 45% { opacity: .8; } 60% { opacity: 1; } 75% { opacity: .55; } 90% { opacity: .95; }
}
@keyframes hw-moon     { 0%,100% { scale: 1; opacity: .65; } 50% { scale: 1.12; opacity: 1; } }
@keyframes hw-pumpkin  { 0%,100% { scale: 1; opacity: .7; } 40% { scale: 1.08; opacity: 1; } 70% { scale: .96; opacity: .6; } }
@keyframes hw-fly      {
  0%   { translate: -22cqw 0; }
  25%  { translate: 4cqw -4cqw; }
  50%  { translate: 40cqw 3cqw; }
  75%  { translate: 80cqw -5cqw; }
  100% { translate: 125cqw 0; }
}
@keyframes hw-flap     { 0%,100% { scale: 1 1; } 50% { scale: 1 .4; } }
@keyframes hw-fall     {
  0%   { translate: 0 -12cqw; opacity: 0; }
  8%   { opacity: .95; }
  92%  { opacity: .95; }
  100% { translate: 0 165cqw; opacity: 0; }
}
@keyframes hw-sway     {
  0%   { translate: -4cqw 0; rotate: -35deg; }
  100% { translate: 4cqw 0;  rotate: 35deg; }
}
@keyframes hw-ember    {
  0%   { translate: 0 0; opacity: 0; }
  15%  { opacity: 1; }
  100% { translate: 5cqw -42cqw; opacity: 0; }
}
@keyframes hw-drift    { from { translate: -35cqw 0; } to { translate: 35cqw 0; } }

@keyframes hw-up       { from { opacity: 0; translate: 0 3.5cqw; } to { opacity: 1; translate: 0 0; } }
@keyframes hw-slide    { from { opacity: 0; translate: -6cqw 0; } to { opacity: 1; translate: 0 0; } }
@keyframes hw-pop      { from { opacity: 0; scale: .5; } to { opacity: 1; scale: 1; } }
@keyframes hw-rise     { from { translate: 0 100%; } to { translate: 0 0; } }
@keyframes hw-draw     { from { scale: 0 1; } to { scale: 1 1; } }
@keyframes hw-spin     { to { rotate: 360deg; } }
@keyframes hw-spin-rev { to { rotate: -360deg; } }
@keyframes hw-float    { 0%,100% { translate: 0 0; } 50% { translate: 0 -1.2cqw; } }
@keyframes hw-avatar   {
  0%,100% { box-shadow: 0 0 3cqw rgba(255,138,31,.55), 0 0 0 1cqw rgba(255,90,10,.3); }
  50%     { box-shadow: 0 0 6.5cqw rgba(255,160,50,.95), 0 0 0 1.5cqw rgba(255,90,10,.5); }
}
@keyframes hw-text     {
  0%,100% { text-shadow: 0 0 1.6cqw rgba(255,120,20,.55), 0 0 .3cqw #000; }
  50%     { text-shadow: 0 0 3.6cqw rgba(255,150,40,1),   0 0 .3cqw #000; }
}
@keyframes hw-row      {
  0%,100% { box-shadow: 0 0 1.6cqw rgba(255,90,10,.2); }
  50%     { box-shadow: 0 0 3.2cqw rgba(255,90,10,.55); }
}
@keyframes hw-shine    { from { translate: -120% 0; } to { translate: 320% 0; } }
@keyframes hw-bar      { from { translate: -100% 0; } to { translate: 300% 0; } }
@keyframes hw-fade     { from { opacity: 0; } to { opacity: 1; } }
@keyframes hw-zoom     { from { opacity: 0; scale: .85; } to { opacity: 1; scale: 1; } }

/* ---------- Jump-scare ghost ---------- */
@keyframes hw-scare-bg {
  0%   { opacity: 0; }
  6%   { opacity: 1; }
  10%  { opacity: .55; }
  14%  { opacity: 1; }
  82%  { opacity: 1; }
  100% { opacity: 0; }
}
@keyframes hw-scare-flash {
  0%   { opacity: 0; }
  5%   { opacity: .95; }
  20%  { opacity: 0; }
  100% { opacity: 0; }
}
@keyframes hw-boo {
  0%   { scale: .05; opacity: 0; translate: 0 22cqw; }
  10%  { scale: 1.25; opacity: 1; translate: 0 0; }
  16%  { scale: .95; }
  22%  { scale: 1.08; }
  28%  { scale: 1; }
  80%  { scale: 1.04; opacity: 1; translate: 0 -2cqw; }
  100% { scale: 1.9; opacity: 0; translate: 0 -8cqw; }
}
@keyframes hw-shake {
  0%,100% { rotate: 0deg; }
  10% { rotate: -5deg; } 20% { rotate: 5deg; } 30% { rotate: -4deg; }
  40% { rotate: 4deg; }  50% { rotate: -3deg; } 60% { rotate: 3deg; }
  70% { rotate: -2deg; } 80% { rotate: 2deg; }
}
@keyframes hw-eye-glow {
  0%,100% { opacity: .7; } 50% { opacity: 1; }
}
@keyframes hw-boo-text {
  0%,12%  { opacity: 0; scale: .3; }
  22%     { opacity: 1; scale: 1.25; }
  30%,80% { opacity: 1; scale: 1; }
  100%    { opacity: 0; scale: 1.5; }
}

.hw-scare {
  position: absolute; inset: 0; z-index: 60; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  animation: hw-scare-bg ${GHOST_DURATION}ms ease-out both;
  background: radial-gradient(circle at 50% 45%, rgba(40,10,0,.82), rgba(0,0,0,.97) 75%);
}
.hw-scare-flash {
  position: absolute; inset: 0; pointer-events: none;
  background: #fff3de;
  animation: hw-scare-flash ${GHOST_DURATION}ms linear both;
}
.hw-scare-ghost {
  position: relative; width: 78cqw; margin-top: -8cqw;
  animation: hw-boo ${GHOST_DURATION}ms cubic-bezier(.2,.9,.3,1) both;
  filter: drop-shadow(0 0 5cqw rgba(255,140,30,.85));
}
.hw-scare-ghost svg {
  display: block; width: 100%;
  animation: hw-shake .5s linear .25s 3;
}
.hw-scare-eye { animation: hw-eye-glow .25s ease-in-out infinite; }

/* Realistic photo version */
.hw-scare-ghost.hw-real { width: 94cqw; margin-top: -6cqw; }
.hw-scare-photo {
  display: block; width: 100%; height: auto;
  -webkit-mask-image: radial-gradient(ellipse at center, #000 50%, transparent 76%);
  mask-image: radial-gradient(ellipse at center, #000 50%, transparent 76%);
  filter: grayscale(.85) contrast(1.35) brightness(.95) sepia(.25);
  animation: hw-glitch .35s steps(2) .3s infinite;
}
@keyframes hw-glitch {
  0%   { translate: 0 0; }
  20%  { translate: -.8cqw .3cqw; }
  40%  { translate: .9cqw -.4cqw; }
  60%  { translate: -.4cqw -.6cqw; }
  80%  { translate: .6cqw .5cqw; }
  100% { translate: 0 0; }
}
.hw-scare-text {
  position: absolute; left: 0; right: 0; bottom: 14cqw; text-align: center;
  font-family: ${FONT_TITLE}; font-size: max(40px, 16cqw); letter-spacing: .08em;
  color: ${EMBER};
  text-shadow: 0 0 3cqw rgba(255,90,10,.95), 0 0 .6cqw #000;
  animation: hw-boo-text ${GHOST_DURATION}ms ease-out both;
  pointer-events: none;
}

.hw-abs     { position: absolute; pointer-events: none; }
.hw-glow    { position: absolute; pointer-events: none; translate: -50% -50%; border-radius: 9999px; mix-blend-mode: screen; }
.hw-moon    { animation: hw-moon 5s ease-in-out infinite; }
.hw-flicker { animation: hw-flicker 3.2s linear infinite; }
.hw-pumpkin { animation: hw-pumpkin 2.8s ease-in-out infinite; }

.hw-window {
  position: absolute; pointer-events: none; mix-blend-mode: screen;
  background: linear-gradient(180deg, #ffd27a, #ff8a1f);
  box-shadow: 0 0 1.6cqw 0.2cqw rgba(255,150,40,.9);
  animation: hw-flicker 2.6s linear infinite;
}

.hw-fog {
  position: absolute; left: 50%; width: 170cqw; height: 34cqw; margin-left: -85cqw;
  background: radial-gradient(ellipse at center, rgba(255,160,70,.2), transparent 68%);
  filter: blur(2.4cqw); pointer-events: none; mix-blend-mode: screen;
  animation: hw-drift 20s ease-in-out infinite alternate;
}

.hw-bat  { position: absolute; left: 0; pointer-events: none; animation: hw-fly 18s linear infinite; }
.hw-bat svg { display: block; width: 100%; filter: drop-shadow(0 0 .5cqw rgba(255,120,20,.7)); }

.hw-leaf   { position: absolute; top: 0; pointer-events: none; animation: hw-fall 20s linear infinite; }
.hw-leaf svg { display: block; width: 100%; animation: hw-sway 4s ease-in-out infinite alternate; }

.hw-ember {
  position: absolute; pointer-events: none; border-radius: 9999px; mix-blend-mode: screen;
  background: radial-gradient(circle, #fff1c2, #ff8a1f 55%, transparent 72%);
  animation: hw-ember 7s ease-out infinite; opacity: 0;
}

.hw-up     { animation: hw-up .7s ease-out both; }
.hw-pop    { animation: hw-pop .8s cubic-bezier(.2,1.3,.4,1) both; }
.hw-float  { animation: hw-float 4.5s ease-in-out 1s infinite; }
.hw-name   { animation: hw-up .7s ease-out .35s both, hw-text 2.8s ease-in-out 1.2s infinite; }
.hw-line   { transform-origin: left center; animation: hw-draw .9s ease-out .7s both; }
.hw-ring   { animation: hw-spin 16s linear infinite; }
.hw-ring-r { animation: hw-spin-rev 6s linear infinite; }
.hw-avatar { animation: hw-avatar 2.8s ease-in-out infinite; }

.hw-row {
  position: relative; overflow: hidden;
  animation: hw-slide .6s ease-out both, hw-row 3.2s ease-in-out 1s infinite;
  transition: scale .2s ease, background-color .2s ease;
}
.hw-row:hover { scale: 1.015; background-color: rgba(40,16,4,.9) !important; }
.hw-row::after {
  content: ""; position: absolute; top: 0; bottom: 0; left: 0; width: 35%;
  background: linear-gradient(100deg, transparent, rgba(255,160,50,.22), transparent);
  animation: hw-shine 5.5s ease-in-out 2s infinite; pointer-events: none;
}

.hw-chip {
  animation: hw-pop .5s cubic-bezier(.2,1.3,.4,1) both;
  transition: translate .2s ease, box-shadow .2s ease;
}
.hw-chip:hover { translate: 0 -.6cqw; box-shadow: 0 0 3.4cqw rgba(255,140,30,.7) !important; }

.hw-bar { animation: hw-rise .7s cubic-bezier(.2,.9,.3,1) 1s both; }
.hw-bar-glow {
  position: absolute; top: 0; left: 0; height: 2px; width: 35%;
  background: linear-gradient(90deg, transparent, ${GLOW}, transparent);
  animation: hw-bar 3.2s ease-in-out infinite; pointer-events: none;
}
.hw-action svg { transition: translate .2s ease, scale .2s ease; }
.hw-action:hover svg { translate: 0 -.7cqw; scale: 1.2; }

.hw-overlay { animation: hw-fade .25s ease-out both; }
.hw-modal   { animation: hw-zoom .3s cubic-bezier(.2,1.2,.4,1) both; }

@media (prefers-reduced-motion: reduce) {
  .hw-scare { display: none; }
  .hw-scare-photo { animation: none; }
  .hw-bat, .hw-leaf, .hw-ember, .hw-fog, .hw-bar-glow, .hw-row::after { display: none; }
  .hw-moon, .hw-flicker, .hw-pumpkin, .hw-window, .hw-up, .hw-pop, .hw-float,
  .hw-name, .hw-line, .hw-ring, .hw-ring-r, .hw-avatar, .hw-row, .hw-chip,
  .hw-bar, .hw-overlay, .hw-modal { animation: none; }
}
`;

/* Bat silhouette */
const BatSvg = () => (
  <svg viewBox="0 0 100 40" aria-hidden="true">
    <path
      d="M50 12 C46 4 38 2 30 6 C24 2 12 4 2 14 C12 12 20 16 26 22 C32 18 38 20 42 28 C46 24 48 24 50 30 C52 24 54 24 58 28 C62 20 68 18 74 22 C80 16 88 12 98 14 C88 4 76 2 70 6 C62 2 54 4 50 12 Z"
      fill="#050202"
    />
  </svg>
);

/* Jump-scare ghost */
const ScareGhostSvg = () => (
  <svg viewBox="0 0 200 250" aria-hidden="true">
    <defs>
      <linearGradient id="hw-ghost-body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#d7d2ce" />
      </linearGradient>
      <radialGradient id="hw-ghost-eye" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffb347" />
        <stop offset="100%" stopColor="#ff3d00" />
      </radialGradient>
    </defs>
    <path
      d="M100 8 C50 8 18 48 18 100 V224 L44 204 L72 230 L100 204 L128 230 L156 204 L182 224 V100 C182 48 150 8 100 8 Z"
      fill="url(#hw-ghost-body)"
    />
    {/* eyes */}
    <ellipse cx="68" cy="96" rx="19" ry="28" fill="#080202" />
    <ellipse cx="132" cy="96" rx="19" ry="28" fill="#080202" />
    <ellipse
      className="hw-scare-eye"
      cx="68"
      cy="100"
      rx="7"
      ry="10"
      fill="url(#hw-ghost-eye)"
    />
    <ellipse
      className="hw-scare-eye"
      cx="132"
      cy="100"
      rx="7"
      ry="10"
      fill="url(#hw-ghost-eye)"
    />
    {/* screaming mouth */}
    <ellipse cx="100" cy="166" rx="26" ry="40" fill="#080202" />
    <ellipse cx="100" cy="186" rx="14" ry="16" fill="#3a0a02" />
    {/* arms */}
    <path
      d="M20 120 C2 110 -6 130 6 146 C16 158 28 152 30 140 Z"
      fill="url(#hw-ghost-body)"
    />
    <path
      d="M180 120 C198 110 206 130 194 146 C184 158 172 152 170 140 Z"
      fill="url(#hw-ghost-body)"
    />
  </svg>
);

/* ---------- Contact row with copy button ---------- */
const ContactRow = ({
  icon,
  text,
  href,
  i = 0,
}: {
  icon: React.ReactNode;
  text: string;
  href?: string;
  i?: number;
}) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div
      className="hw-row flex items-center justify-between"
      style={{
        backgroundColor: ROW_BG,
        borderRadius: "1.6cqw",
        border: `1px solid ${ROW_BORDER}`,
        borderLeft: `1cqw solid ${ORANGE}`,
        padding: "2.4cqw 3.2cqw",
        gap: "2.4cqw",
        backdropFilter: "blur(4px)",
        animationDelay: `${0.75 + i * 0.12}s`,
      }}
    >
      <div className="flex items-center min-w-0" style={{ gap: "2.4cqw" }}>
        <span className="flex-shrink-0" style={{ color: ORANGE }}>
          {icon}
        </span>
        {href ? (
          <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="truncate hover:opacity-70"
            style={{ color: CREAM, fontWeight: 500, textDecoration: "none" }}
          >
            {text}
          </a>
        ) : (
          <span className="truncate" style={{ color: CREAM, fontWeight: 500 }}>
            {text}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${text}`}
        className="flex-shrink-0 hover:opacity-70"
        style={{ color: ORANGE }}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
};

const SectionLabel = ({
  children,
  icon,
  delay = 0.6,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  delay?: number;
}) => (
  <h2
    className="hw-up flex items-center"
    style={{
      animationDelay: `${delay}s`,
      color: CREAM,
      fontFamily: FONT_TITLE,
      fontWeight: 400,
      fontSize: "max(15px, 3.8cqw)",
      letterSpacing: "0.06em",
      gap: "1.8cqw",
      textShadow: "0 0 1.2cqw rgba(255,120,20,.7), 0 0 .3cqw #000",
    }}
  >
    <span style={{ color: ORANGE }}>{icon}</span>
    {children}
    <span
      aria-hidden="true"
      className="hw-line flex-1"
      style={{
        height: "1px",
        background: `linear-gradient(90deg, ${ORANGE}, transparent)`,
      }}
    />
  </h2>
);

export const Halloween: React.FC<HalloweenProps> = ({ user }) => {
  const [showQr, setShowQr] = useState(false);
  // Starts true so the ghost jumps out the moment the page opens / QR is scanned
  const [showGhost, setShowGhost] = useState(true);
  const [photoOk, setPhotoOk] = useState(Boolean(GHOST_IMAGE));

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      setShowGhost(false);
      return;
    }

    try {
      navigator.vibrate?.([120, 60, 200]);
    } catch {
      /* vibration unsupported */
    }

    if (GHOST_SOUND) {
      try {
        const audio = new Audio(GHOST_SOUND);
        audio.volume = 1;
        audio.play().catch(() => {
          /* autoplay blocked */
        });
      } catch {
        /* audio unsupported */
      }
    }

    const t = setTimeout(() => setShowGhost(false), GHOST_DURATION);
    return () => clearTimeout(t);
  }, []);

  const avatarUrl = user?.avatar_url || null;
  const p: any = user?.profile ?? {};
  const displayName =
    (user as any)?.display_name || user?.name || (user as any)?.username || "";
  const bio: string = (p.bio ?? "").trim();
  const emails = splitList(user?.email);
  const phones = splitList(p.phone);
  const websites = splitList(p.website);
  const location: string = (p.location ?? "").trim();
  const socials: any[] = (p.socialLinks ?? []).filter(isVisible);

  const hasContact =
    emails.length + phones.length + websites.length > 0 || !!location;

  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: displayName, url: pageUrl });
      } else {
        await navigator.clipboard.writeText(pageUrl);
      }
    } catch {
      /* user cancelled */
    }
  };

  /* Save to phone contacts (downloads a .vcf that the phone offers to import) */
  const handleSaveContact = () => {
    const name = (displayName || "Contact").trim();
    const parts = name.split(/\s+/);
    const family = parts.length > 1 ? parts[parts.length - 1] : "";
    const given = parts.length > 1 ? parts.slice(0, -1).join(" ") : name;

    const lines: string[] = ["BEGIN:VCARD", "VERSION:3.0"];

    lines.push(`FN:${vEsc(name)}`);
    lines.push(`N:${vEsc(family)};${vEsc(given)};;;`);

    phones.forEach((ph) => lines.push(`TEL;TYPE=CELL:${ph}`));

    emails.forEach((e, i) =>
      lines.push(`EMAIL;TYPE=INTERNET${i > 0 ? ",WORK" : ""}:${e}`),
    );

    websites.forEach((w) =>
      lines.push(`URL:${w.startsWith("http") ? w : `https://${w}`}`),
    );

    if (location) lines.push(`ADR;TYPE=WORK:;;${vEsc(location)};;;;`);

    if (bio) lines.push(`NOTE:${vEsc(bio)}`);

    socials.forEach((link) => {
      const type = String(link.platform ?? "").toLowerCase();
      if (link.url && type)
        lines.push(`X-SOCIALPROFILE;TYPE=${type}:${link.url}`);
    });

    if (pageUrl) lines.push(`URL:${pageUrl}`);

    lines.push("END:VCARD");

    const blob = new Blob([lines.join("\r\n")], {
      type: "text/vcard;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.replace(/\s+/g, "_")}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const actionStyle: React.CSSProperties = {
    padding: "2.6cqw 0",
    gap: "0.6cqw",
    color: CREAM,
  };
  const actionLabel: React.CSSProperties = {
    fontSize: "max(12px, 2.4cqw)",
    fontWeight: 600,
  };

  return (
    <div
      className="w-full flex justify-center"
      style={{ backgroundColor: "#f9fafb", minHeight: "100dvh" }}
    >
      <style>{HW_CSS}</style>
      <div
        className="relative w-full max-w-lg overflow-clip flex flex-col"
        style={{
          aspectRatio: "632 / 957",
          containerType: "inline-size",
          fontFamily: FONT,
          backgroundColor: DARK,
          backgroundImage: `url(${BG_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* ---------- Atmosphere ---------- */}
        <span className="hw-fog" style={{ top: "52%" }} />
        <span
          className="hw-fog"
          style={{
            top: "70%",
            animationDuration: "26s",
            animationDirection: "alternate-reverse",
          }}
        />

        {/* Moon / lantern / pumpkin glows */}
        {GLOWS.map((g, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={`hw-glow ${g.cls}`}
            style={{
              left: `${g.x}%`,
              top: `${g.y}%`,
              width: `${g.size}cqw`,
              height: `${g.size}cqw`,
              background: `radial-gradient(circle, ${g.color} 0%, transparent 65%)`,
              animationDelay: `${g.delay}s`,
            }}
          />
        ))}

        {/* Flickering house windows */}
        {WINDOWS.map(([x, y, w, h], i) => (
          <span
            key={i}
            aria-hidden="true"
            className="hw-window"
            style={{
              left: `${x / 10.24}%`,
              top: `${y / 15.36}%`,
              width: `${w / 10.24}%`,
              height: `${h / 15.36}%`,
              animationDuration: `${2.2 + (i % 4) * 0.7}s`,
              animationDelay: `${i * 0.37}s`,
            }}
          />
        ))}

        {/* Rising embers */}
        {EMBERS.map((e, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="hw-ember"
            style={{
              left: `${e.x}%`,
              top: `${e.y}%`,
              width: `${e.s}cqw`,
              height: `${e.s}cqw`,
              animationDuration: `${e.dur}s`,
              animationDelay: `${e.delay}s`,
            }}
          />
        ))}

        {/* Falling leaves */}
        {LEAVES.map((l, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="hw-leaf"
            style={{
              left: `${l.x}%`,
              width: `${l.size}cqw`,
              animationDuration: `${l.dur}s`,
              animationDelay: `${l.delay}s`,
            }}
          >
            <svg
              viewBox="0 0 20 28"
              style={{ animationDuration: `${l.sway}s` }}
              aria-hidden="true"
            >
              <path
                d="M10 0 C19 7 19 18 10 26 C1 18 1 7 10 0 Z"
                fill={l.color}
              />
              <path d="M10 4 V28" stroke="rgba(0,0,0,0.45)" strokeWidth="1" />
            </svg>
          </span>
        ))}

        {/* ---------- Content ---------- */}
        <div
          className="relative flex flex-col items-center flex-1"
          style={{
            fontSize: "max(12px, 2.6cqw)",
            lineHeight: 1.4,
            paddingTop: "50cqw",
            zIndex: 10,
          }}
        >
          {/* Avatar sits inside the moon */}
          <div
            className="hw-abs"
            style={{
              left: "61.3cqw",
              top: "18.5cqw",
              width: "25cqw",
              height: "25cqw",
              pointerEvents: "auto",
            }}
          >
            <div className="hw-pop w-full h-full">
              <div className="hw-float relative w-full h-full">
                <div
                  aria-hidden="true"
                  className="hw-ring absolute rounded-full pointer-events-none"
                  style={{
                    inset: "-1.4cqw",
                    border: `0.35cqw dashed rgba(255,170,70,0.8)`,
                  }}
                />
                <div
                  aria-hidden="true"
                  className="hw-ring-r absolute rounded-full pointer-events-none"
                  style={{
                    inset: "-2.6cqw",
                    border: "0.4cqw solid transparent",
                    borderTopColor: GLOW,
                    borderLeftColor: EMBER,
                  }}
                />
                <div
                  className="hw-avatar overflow-hidden rounded-full w-full h-full flex items-center justify-center"
                  style={{
                    backgroundColor: "#1a0b04",
                    border: `0.8cqw solid ${ORANGE}`,
                  }}
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName || "Profile photo"}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: "center top" }}
                    />
                  ) : (
                    <UserIcon size={52} style={{ color: MUTED }} />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Name + bio (top-left, above the lantern) */}
          <div
            className="hw-abs flex flex-col"
            style={{
              left: "6cqw",
              top: "9cqw",
              width: "50cqw",
              gap: "1.2cqw",
              pointerEvents: "auto",
            }}
          >
            {displayName && (
              <h1
                className="hw-name"
                style={{
                  color: CREAM,
                  fontFamily: FONT_TITLE,
                  fontWeight: 400,
                  fontSize: "max(22px, 7cqw)",
                  lineHeight: 1.05,
                  letterSpacing: "0.03em",
                }}
              >
                {displayName}
              </h1>
            )}
            {bio && (
              <p
                className="hw-up"
                style={{
                  animationDelay: "0.5s",
                  color: MUTED,
                  fontWeight: 500,
                  fontSize: "max(11px, 2.4cqw)",
                  whiteSpace: "pre-line",
                  textShadow: "0 0 .6cqw #000",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {bio}
              </p>
            )}
          </div>

          {/* Contact */}
          {hasContact && (
            <div
              className="w-full flex flex-col"
              style={{ padding: "0 5cqw", gap: "2cqw" }}
            >
              <SectionLabel icon={<Ghost size={16} />}>Contact</SectionLabel>
              {emails.map((e, i) => (
                <ContactRow
                  i={i}
                  key={e}
                  icon={<Mail size={14} />}
                  text={e}
                  href={`mailto:${e}`}
                />
              ))}
              {phones.map((ph, i) => (
                <ContactRow
                  i={emails.length + i}
                  key={ph}
                  icon={<Phone size={14} />}
                  text={ph}
                  href={`tel:${ph}`}
                />
              ))}
              {websites.map((w, i) => (
                <ContactRow
                  i={emails.length + phones.length + i}
                  key={w}
                  icon={<Globe size={14} />}
                  text={w}
                  href={w.startsWith("http") ? w : `https://${w}`}
                />
              ))}
              {location && (
                <ContactRow
                  i={emails.length + phones.length + websites.length}
                  icon={<MapPin size={14} />}
                  text={location}
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
                />
              )}
            </div>
          )}

          {/* Connect with me */}
          {socials.length > 0 && (
            <div
              className="w-full flex flex-col"
              style={{ padding: "0 5cqw", marginTop: "4cqw", gap: "2cqw" }}
            >
              <SectionLabel icon={<Flame size={16} />} delay={0.9}>
                Connect with me
              </SectionLabel>
              <div className="flex flex-wrap" style={{ gap: "2cqw" }}>
                {socials.map((link, idx) => {
                  const key = String(link.platform ?? "").toLowerCase();
                  return (
                    <a
                      key={link.id ?? link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="hw-chip inline-flex items-center"
                      style={{
                        animationDelay: `${1 + idx * 0.1}s`,
                        backgroundColor: ROW_BG,
                        color: CREAM,
                        fontWeight: 600,
                        borderRadius: "999px",
                        border: `1px solid ${ORANGE}`,
                        boxShadow: `0 0 2cqw rgba(255,90,10,0.35)`,
                        padding: "1.8cqw 3.4cqw",
                        gap: "2cqw",
                      }}
                    >
                      <span style={{ color: ORANGE }}>
                        {SOCIAL_ICONS[key] || <Globe size={14} />}
                      </span>
                      <span className="truncate" style={{ maxWidth: "45cqw" }}>
                        {link.username || link.platform}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ height: "6cqw" }} />
        </div>

        {/* ---------- Bats flying across the sky (in front of everything) ---------- */}
        {BATS.map((b, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="hw-bat"
            style={{
              top: `${b.top}%`,
              width: `${b.w}cqw`,
              animationDuration: `${b.dur}s`,
              animationDelay: `${b.delay}s`,
              zIndex: 12,
            }}
          >
            <span
              style={{
                display: "block",
                animation: `hw-flap ${b.flap}s ease-in-out infinite`,
                transformOrigin: "50% 50%",
              }}
            >
              <BatSvg />
            </span>
          </span>
        ))}

        {/* ---------- Bottom action bar ---------- */}
        <div
          className="hw-bar relative w-full flex-shrink-0"
          style={{ zIndex: 10 }}
        >
          <div
            className="grid grid-cols-3 relative overflow-hidden"
            style={{
              backgroundColor: "rgba(10,4,1,0.8)",
              backdropFilter: "blur(6px)",
              borderTop: `1px solid ${ORANGE}`,
              boxShadow: `0 -0.6cqw 3cqw rgba(255,90,10,0.35)`,
            }}
          >
            <span aria-hidden="true" className="hw-bar-glow" />
            <button
              type="button"
              onClick={() => setShowQr(true)}
              className="hw-action flex flex-col items-center hover:opacity-80"
              style={actionStyle}
            >
              <QrCode size={18} style={{ color: ORANGE }} />
              <span style={actionLabel}>QR Code</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="hw-action flex flex-col items-center hover:opacity-80"
              style={actionStyle}
            >
              <Share2 size={18} style={{ color: ORANGE }} />
              <span style={actionLabel}>Share</span>
            </button>
            <button
              type="button"
              onClick={handleSaveContact}
              className="hw-action flex flex-col items-center hover:opacity-80"
              style={actionStyle}
            >
              <UserPlus size={18} style={{ color: ORANGE }} />
              <span style={actionLabel}>Save Contact</span>
            </button>
          </div>
        </div>

        {/* ---------- QR modal ---------- */}
        {showQr && (
          <div
            className="hw-overlay absolute inset-0 z-20 flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.7)", zIndex: 30 }}
            onClick={() => setShowQr(false)}
          >
            <div
              className="hw-modal relative rounded-2xl p-5 flex flex-col items-center gap-3"
              style={{
                backgroundColor: "#140803",
                border: `1px solid ${ORANGE}`,
                boxShadow: `0 0 4cqw rgba(255,90,10,0.55)`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowQr(false)}
                className="absolute top-2 right-2 hover:opacity-70"
                style={{ color: CREAM }}
                aria-label="Close"
              >
                <X size={16} />
              </button>
              <div className="bg-white p-2 rounded-lg">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(pageUrl)}`}
                  alt="QR code"
                  width={220}
                  height={220}
                />
              </div>
              <span className="text-sm font-medium" style={{ color: CREAM }}>
                {displayName}
              </span>
            </div>
          </div>
        )}

        {/* ---------- Jump-scare ghost (plays instantly on open / scan) ---------- */}
        {showGhost && (
          <div
            className="hw-scare"
            role="presentation"
            onClick={() => setShowGhost(false)}
          >
            <span aria-hidden="true" className="hw-scare-flash" />
            <div className={`hw-scare-ghost${photoOk ? " hw-real" : ""}`}>
              {photoOk ? (
                <img
                  src={GHOST_IMAGE}
                  alt=""
                  className="hw-scare-photo"
                  draggable={false}
                  onError={() => setPhotoOk(false)}
                />
              ) : (
                <ScareGhostSvg />
              )}
            </div>
            <div aria-hidden="true" className="hw-scare-text">
              BOO!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Halloween;
