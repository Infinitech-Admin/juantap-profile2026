"use client";

// src/components/template-previews/tech.tsx
import React, { useState } from "react";
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
  Contact,
  Link2,
} from "lucide-react";
import type { Template, User } from "@/types/template";

interface TechProps {
  template?: Template;
  user?: User;
}

/* ---------- Palette (taken from the artwork) ---------- */
const BG_TOP = "#070b13";
const BG_BOTTOM = "#000000";
const BLUE = "#0a5cff"; // bright neon bar
const BLUE_LINE = "#1b7bff"; // circuit lines
const CYAN = "#19d3ff"; // glow highlights
const PANEL = "#1b222c"; // dark grey panels
const WHITE = "#ffffff";
const MUTED = "#a9b8cf";
const ROW_BG = "rgba(10,18,32,0.72)";
const ROW_BORDER = "rgba(27,123,255,0.45)";

const FONT = "Poppins, 'Segoe UI', Arial, sans-serif";

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

/* ---------- vCard helpers ---------- */
const vEsc = (s: string) =>
  s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");

/* ---------- Animations ----------
   Individual `translate` / `scale` / `rotate` properties are used so they
   never clash with inline `transform`. */
const TECH_CSS = `
@keyframes tech-flow     { from { stroke-dashoffset: 1000; } to { stroke-dashoffset: 0; } }
@keyframes tech-flow-rev { from { stroke-dashoffset: 0; } to { stroke-dashoffset: 1000; } }
@keyframes tech-pulse    { 0%,100% { opacity: .7; } 50% { opacity: 1; } }
@keyframes tech-breathe  { 0%,100% { opacity: .82; } 50% { opacity: 1; } }
@keyframes tech-spark    { 0%,100% { scale: 1; opacity: .35; } 50% { scale: 1.9; opacity: .9; } }
@keyframes tech-ping     { 0% { scale: 1; opacity: .9; } 100% { scale: 3.4; opacity: 0; } }
@keyframes tech-blink    { 0%,100% { opacity: .2; } 50% { opacity: 1; } }
@keyframes tech-sweep    { from { translate: -320px -320px; } to { translate: 320px 320px; } }
@keyframes tech-float    {
  0%   { translate: 0 0; opacity: 0; }
  15%  { opacity: .85; }
  100% { translate: 28px -420px; opacity: 0; }
}
@keyframes tech-scan     { from { translate: 0 -20cqw; } to { translate: 0 160cqw; } }
@keyframes tech-up       { from { opacity: 0; translate: 0 3.5cqw; } to { opacity: 1; translate: 0 0; } }
@keyframes tech-slide    { from { opacity: 0; translate: -6cqw 0; } to { opacity: 1; translate: 0 0; } }
@keyframes tech-pop      { from { opacity: 0; scale: .6; } to { opacity: 1; scale: 1; } }
@keyframes tech-rise     { from { translate: 0 100%; } to { translate: 0 0; } }
@keyframes tech-draw     { from { scale: 0 1; } to { scale: 1 1; } }
@keyframes tech-spin     { to { rotate: 360deg; } }
@keyframes tech-spin-rev { to { rotate: -360deg; } }
@keyframes tech-avatar   {
  0%,100% { box-shadow: 0 0 3cqw rgba(25,211,255,.45), 0 0 0 1.2cqw rgba(10,92,255,.3); }
  50%     { box-shadow: 0 0 6cqw rgba(25,211,255,.9),  0 0 0 1.6cqw rgba(10,92,255,.5); }
}
@keyframes tech-text     {
  0%,100% { text-shadow: 0 0 1.6cqw rgba(25,211,255,.4); }
  50%     { text-shadow: 0 0 3.6cqw rgba(25,211,255,.95); }
}
@keyframes tech-row      {
  0%,100% { box-shadow: 0 0 1.6cqw rgba(10,92,255,.2); }
  50%     { box-shadow: 0 0 3.2cqw rgba(10,92,255,.5); }
}
@keyframes tech-shine    { from { translate: -120% 0; } to { translate: 320% 0; } }
@keyframes tech-bar      { from { translate: -100% 0; } to { translate: 300% 0; } }
@keyframes tech-fade     { from { opacity: 0; } to { opacity: 1; } }
@keyframes tech-zoom     { from { opacity: 0; scale: .85; } to { opacity: 1; scale: 1; } }

.tech-flow     { animation: tech-flow 3.2s linear infinite; }
.tech-flow.rev { animation-name: tech-flow-rev; }
.tech-pulse    { animation: tech-pulse 3.4s ease-in-out infinite; }
.tech-breathe  { animation: tech-breathe 2.8s ease-in-out infinite; }
.tech-spark    { animation: tech-spark 3s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.tech-ping     { animation: tech-ping 2.4s ease-out infinite; transform-box: fill-box; transform-origin: center; }
.tech-blink    { animation: tech-blink 1.6s ease-in-out infinite; }
.tech-sweep    { animation: tech-sweep 3.6s ease-in-out infinite; }
.tech-float    { animation: tech-float 9s linear infinite; }
.tech-scan     { animation: tech-scan 7s linear infinite; }

.tech-up       { animation: tech-up .7s ease-out both; }
.tech-pop      { animation: tech-pop .7s cubic-bezier(.2,1.3,.4,1) both; }
.tech-name     { animation: tech-up .7s ease-out .35s both, tech-text 3s ease-in-out 1.2s infinite; }
.tech-line     { transform-origin: left center; animation: tech-draw .9s ease-out .7s both; }
.tech-ring     { animation: tech-spin 14s linear infinite; }
.tech-ring-rev { animation: tech-spin-rev 5s linear infinite; }
.tech-avatar   { animation: tech-avatar 3s ease-in-out infinite; }

.tech-row {
  position: relative; overflow: hidden;
  animation: tech-slide .6s ease-out both, tech-row 3.2s ease-in-out 1s infinite;
  transition: scale .2s ease, background-color .2s ease;
}
.tech-row:hover { scale: 1.015; background-color: rgba(18,34,60,.85) !important; }
.tech-row::after {
  content: ""; position: absolute; top: 0; bottom: 0; left: 0; width: 35%;
  background: linear-gradient(100deg, transparent, rgba(25,211,255,.2), transparent);
  animation: tech-shine 5s ease-in-out 2s infinite; pointer-events: none;
}

.tech-chip {
  animation: tech-pop .5s cubic-bezier(.2,1.3,.4,1) both;
  transition: translate .2s ease, box-shadow .2s ease;
}
.tech-chip:hover { translate: 0 -.6cqw; box-shadow: 0 0 3.4cqw rgba(25,211,255,.6) !important; }

.tech-bar { animation: tech-rise .7s cubic-bezier(.2,.9,.3,1) 1s both; }
.tech-bar-glow {
  position: absolute; top: 0; left: 0; height: 2px; width: 35%;
  background: linear-gradient(90deg, transparent, ${CYAN}, transparent);
  animation: tech-bar 3.2s ease-in-out infinite; pointer-events: none;
}
.tech-action svg { transition: translate .2s ease, scale .2s ease; }
.tech-action:hover svg { translate: 0 -.7cqw; scale: 1.2; }

.tech-overlay { animation: tech-fade .25s ease-out both; }
.tech-modal   { animation: tech-zoom .3s cubic-bezier(.2,1.2,.4,1) both; }

@media (prefers-reduced-motion: reduce) {
  .tech-flow, .tech-ping, .tech-float, .tech-scan, .tech-sweep, .tech-bar-glow,
  .tech-row::after { display: none; }
  .tech-pulse, .tech-breathe, .tech-spark, .tech-blink, .tech-up, .tech-pop,
  .tech-name, .tech-line, .tech-ring, .tech-ring-rev, .tech-avatar, .tech-row,
  .tech-chip, .tech-bar, .tech-overlay, .tech-modal { animation: none; }
}
`;

/* ---------- Background artwork (recreated from the image, 1024 x 1536) ---------- */
const CIRCUITS: {
  d: string;
  w: number;
  color: string;
  bright?: boolean;
  rev?: boolean; // signal travels toward the node instead of away from it
  dur: number;
  delay: number;
}[] = [
  {
    d: "M626 1192 V1328 L490 1462 V1536",
    w: 3,
    color: BLUE_LINE,
    rev: true,
    dur: 3.4,
    delay: 0,
  },
  {
    d: "M923 897 V995 L757 1160 V1240 L595 1400 V1450 L518 1536",
    w: 3,
    color: "#16a5ff",
    rev: true,
    dur: 3.8,
    delay: 0.6,
  },
  {
    d: "M1024 845 L965 903 V1015 L798 1182 V1262 L635 1425 V1480 L580 1536",
    w: 4,
    color: CYAN,
    bright: true,
    dur: 2.8,
    delay: 0.2,
  },
  {
    d: "M1024 915 L987 950 V1055 L840 1200 V1285 L683 1440 V1536",
    w: 3,
    color: BLUE_LINE,
    dur: 3.6,
    delay: 1.1,
  },
  {
    d: "M1024 1075 L886 1215 V1308 L732 1460 V1536",
    w: 3,
    color: "#16a5ff",
    dur: 3,
    delay: 0.4,
  },
  {
    d: "M965 1210 V1298 L781 1480 V1536",
    w: 3,
    color: "#16a5ff",
    rev: true,
    dur: 2.6,
    delay: 1.4,
  },
  {
    d: "M1024 1320 L900 1440 V1536",
    w: 3,
    color: BLUE_LINE,
    dur: 2.4,
    delay: 0.9,
  },
];

const NODES: [number, number][] = [
  [626, 1192],
  [923, 896],
  [965, 1210],
];

const DOTS: [number, number][] = [
  [732, 1190],
  [732, 1207],
  [732, 1224],
  [850, 1468],
  [850, 1484],
  [850, 1500],
];

/* Fixed positions so server and client render identically */
const PARTICLES: {
  x: number;
  y: number;
  r: number;
  dur: number;
  delay: number;
}[] = [
  { x: 120, y: 1100, r: 2.5, dur: 9, delay: 0 },
  { x: 260, y: 900, r: 2, dur: 11, delay: 2 },
  { x: 400, y: 1250, r: 3, dur: 10, delay: 4 },
  { x: 520, y: 1000, r: 2, dur: 12, delay: 1 },
  { x: 640, y: 1350, r: 2.5, dur: 9.5, delay: 6 },
  { x: 760, y: 800, r: 2, dur: 13, delay: 3 },
  { x: 880, y: 1150, r: 3, dur: 10.5, delay: 5 },
  { x: 90, y: 600, r: 2, dur: 12, delay: 7 },
  { x: 330, y: 560, r: 2.5, dur: 11, delay: 8 },
  { x: 560, y: 640, r: 2, dur: 14, delay: 2.5 },
  { x: 800, y: 520, r: 2.5, dur: 10, delay: 9 },
  { x: 960, y: 700, r: 2, dur: 12.5, delay: 4.5 },
];

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >
    <defs>
      <linearGradient id="nk-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={BG_TOP} />
        <stop offset="1" stopColor={BG_BOTTOM} />
      </linearGradient>
      <linearGradient id="nk-bar-tr" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={BLUE} />
        <stop offset="1" stopColor="#1fa8ff" />
      </linearGradient>
      <linearGradient id="nk-bar-bl" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={BLUE} />
        <stop offset="0.8" stopColor="#12c4ff" />
        <stop offset="1" stopColor="#10e5ff" />
      </linearGradient>
      <linearGradient id="nk-panel" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#2a313b" />
        <stop offset="1" stopColor="#10151c" />
      </linearGradient>
      <linearGradient id="nk-shine" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.5" stopColor="#fff" stopOpacity="0.85" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <clipPath id="nk-clip-tr">
        <polygon points="745,0 800,0 1024,222 1024,290" />
      </clipPath>
      <clipPath id="nk-clip-bl">
        <polygon points="0,1125 0,1200 290,1536 390,1536" />
      </clipPath>
      <filter id="nk-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="5" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="nk-soft" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="14" />
      </filter>
    </defs>

    <rect width="1024" height="1536" fill="url(#nk-bg)" />

    {/* ---- top-right corner ---- */}
    <polygon points="860,0 1024,0 1024,165" fill={PANEL} opacity="0.9" />
    <polygon points="630,0 745,0 895,150 895,262" fill="url(#nk-panel)" />
    <polygon points="895,170 1024,290 1024,500 895,372" fill="#171d26" />
    <polyline
      points="895,372 1024,500"
      fill="none"
      stroke={BLUE_LINE}
      strokeWidth="2.5"
      filter="url(#nk-glow)"
    />
    <g className="tech-breathe">
      <polygon
        points="745,0 800,0 1024,222 1024,290"
        fill="url(#nk-bar-tr)"
        filter="url(#nk-glow)"
      />
    </g>
    {/* light sweeping along the bar */}
    <g clipPath="url(#nk-clip-tr)">
      <g className="tech-sweep">
        <rect
          x="-40"
          y="-400"
          width="80"
          height="800"
          fill="url(#nk-shine)"
          transform="translate(900 120) rotate(45)"
        />
      </g>
    </g>
    <polyline
      points="578,0 893,313"
      fill="none"
      stroke={BLUE}
      strokeWidth="3.5"
      filter="url(#nk-glow)"
    />
    <polyline
      className="tech-flow"
      points="578,0 893,313"
      pathLength={1000}
      strokeDasharray="70 930"
      fill="none"
      stroke="#bfe9ff"
      strokeWidth="3"
      strokeLinecap="round"
      style={{ animationDuration: "3.4s" }}
    />
    <circle
      className="tech-spark"
      cx="735"
      cy="150"
      r="9"
      fill={CYAN}
      filter="url(#nk-soft)"
    />

    {/* ---- bottom-left corner ---- */}
    <polygon points="0,1240 280,1536 0,1536" fill="url(#nk-panel)" />
    <polygon
      points="0,1030 0,1125 390,1536 492,1536 240,1297 178,1297"
      fill="url(#nk-panel)"
    />
    <g className="tech-breathe" style={{ animationDelay: "1s" }}>
      <polygon
        points="0,1125 0,1200 290,1536 390,1536"
        fill="url(#nk-bar-bl)"
        filter="url(#nk-glow)"
      />
    </g>
    <g clipPath="url(#nk-clip-bl)">
      <g className="tech-sweep" style={{ animationDelay: "1.6s" }}>
        <rect
          x="-40"
          y="-400"
          width="80"
          height="800"
          fill="url(#nk-shine)"
          transform="translate(190 1340) rotate(45)"
        />
      </g>
    </g>
    <polyline
      points="0,1025 492,1530"
      fill="none"
      stroke={BLUE}
      strokeWidth="3.5"
      filter="url(#nk-glow)"
    />
    <polyline
      className="tech-flow"
      points="0,1025 492,1530"
      pathLength={1000}
      strokeDasharray="70 930"
      fill="none"
      stroke="#bfe9ff"
      strokeWidth="3"
      strokeLinecap="round"
      style={{ animationDuration: "3.8s", animationDelay: "1.2s" }}
    />
    <circle
      className="tech-spark"
      cx="290"
      cy="1450"
      r="18"
      fill={CYAN}
      filter="url(#nk-soft)"
      style={{ animationDelay: "1.2s" }}
    />

    {/* ---- floating particles ---- */}
    <g>
      {PARTICLES.map((p, i) => (
        <circle
          key={i}
          className="tech-float"
          cx={p.x}
          cy={p.y}
          r={p.r}
          fill={CYAN}
          style={{
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </g>

    {/* ---- bottom-right circuit lines ---- */}
    <g fill="none" strokeLinejoin="round" strokeLinecap="round">
      {CIRCUITS.map((c, i) => (
        <g key={i}>
          {/* base line */}
          <path
            className="tech-pulse"
            d={c.d}
            stroke={c.color}
            strokeWidth={c.w}
            filter={c.bright ? "url(#nk-glow)" : undefined}
            style={{ animationDelay: `${c.delay}s` }}
          />
          {/* travelling signal */}
          <path
            className={`tech-flow${c.rev ? " rev" : ""}`}
            d={c.d}
            pathLength={1000}
            strokeDasharray="90 910"
            stroke="#d9f6ff"
            strokeWidth={c.w + 0.6}
            style={{
              animationDuration: `${c.dur}s`,
              animationDelay: `${c.delay}s`,
            }}
          />
        </g>
      ))}
    </g>

    {/* nodes with expanding rings */}
    {NODES.map(([x, y], i) => (
      <g key={`${x}-${y}`}>
        <circle
          className="tech-ping"
          cx={x}
          cy={y}
          r="8"
          fill="none"
          stroke={CYAN}
          strokeWidth="2"
          style={{ animationDelay: `${i * 0.7}s` }}
        />
        <circle
          className="tech-ping"
          cx={x}
          cy={y}
          r="8"
          fill="none"
          stroke={CYAN}
          strokeWidth="2"
          style={{ animationDelay: `${i * 0.7 + 1.2}s` }}
        />
        <circle cx={x} cy={y} r="8" stroke={CYAN} strokeWidth="3" fill="#000" />
      </g>
    ))}

    {/* blinking indicator dots (sequential) */}
    {DOTS.map(([x, y], i) => (
      <circle
        key={`d${x}-${y}`}
        className="tech-blink"
        cx={x}
        cy={y}
        r="4"
        fill="#139bff"
        style={{ animationDelay: `${(i % 3) * 0.25}s` }}
      />
    ))}
    <circle
      className="tech-spark"
      cx="870"
      cy="1105"
      r="12"
      fill={CYAN}
      filter="url(#nk-soft)"
      style={{ animationDelay: "0.6s" }}
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
      className="tech-row flex items-center justify-between"
      style={{
        backgroundColor: ROW_BG,
        borderRadius: "1.6cqw",
        border: `1px solid ${ROW_BORDER}`,
        borderLeft: `1cqw solid ${BLUE}`,
        padding: "2.4cqw 3.2cqw",
        gap: "2.4cqw",
        backdropFilter: "blur(4px)",
        animationDelay: `${0.75 + i * 0.12}s`,
      }}
    >
      <div className="flex items-center min-w-0" style={{ gap: "2.4cqw" }}>
        <span className="flex-shrink-0" style={{ color: CYAN }}>
          {icon}
        </span>
        {href ? (
          <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="truncate hover:opacity-70"
            style={{
              color: WHITE,
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            {text}
          </a>
        ) : (
          <span className="truncate" style={{ color: WHITE, fontWeight: 500 }}>
            {text}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${text}`}
        className="flex-shrink-0 hover:opacity-70"
        style={{ color: CYAN }}
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
    className="tech-up flex items-center"
    style={{
      animationDelay: `${delay}s`,
      color: WHITE,
      fontWeight: 700,
      fontSize: "max(13px, 3cqw)",
      letterSpacing: "0.04em",
      gap: "1.8cqw",
    }}
  >
    <span style={{ color: CYAN }}>{icon}</span>
    {children}
    <span
      aria-hidden="true"
      className="tech-line flex-1"
      style={{
        height: "1px",
        background: `linear-gradient(90deg, ${BLUE_LINE}, transparent)`,
      }}
    />
  </h2>
);

export const Tech: React.FC<TechProps> = ({ user }) => {
  const [showQr, setShowQr] = useState(false);

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
    color: WHITE,
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
      <style>{TECH_CSS}</style>
      <div
        className="relative w-full max-w-lg overflow-clip flex flex-col"
        style={{
          aspectRatio: "632 / 957",
          containerType: "inline-size",
          fontFamily: FONT,
          backgroundColor: BG_BOTTOM,
        }}
      >
        {/* ---------- Background artwork ---------- */}
        <Artwork />

        {/* Slow scan line drifting down the card */}
        <div
          aria-hidden="true"
          className="tech-scan absolute left-0 right-0 pointer-events-none"
          style={{
            top: 0,
            height: "18cqw",
            background:
              "linear-gradient(180deg, transparent, rgba(25,211,255,0.07), transparent)",
          }}
        />

        {/* ---------- Content ---------- */}
        <div
          className="relative flex flex-col items-center flex-1"
          style={{
            fontSize: "max(12px, 2.6cqw)",
            lineHeight: 1.4,
            paddingTop: "13cqw",
          }}
        >
          {/* Avatar with orbiting rings */}
          <div
            className="tech-pop relative flex-shrink-0"
            style={{ width: "28cqw", height: "28cqw" }}
          >
            <div
              aria-hidden="true"
              className="tech-ring absolute rounded-full pointer-events-none"
              style={{
                inset: "-2.4cqw",
                border: `0.35cqw dashed rgba(25,211,255,0.7)`,
              }}
            />
            <div
              aria-hidden="true"
              className="tech-ring-rev absolute rounded-full pointer-events-none"
              style={{
                inset: "-4.4cqw",
                border: "0.4cqw solid transparent",
                borderTopColor: CYAN,
                borderRightColor: BLUE,
              }}
            />
            <div
              className="tech-avatar overflow-hidden rounded-full w-full h-full flex items-center justify-center"
              style={{
                backgroundColor: PANEL,
                border: `0.8cqw solid ${CYAN}`,
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
                <UserIcon size={56} style={{ color: MUTED }} />
              )}
            </div>
          </div>

          {/* Name + bio */}
          <div
            className="w-full flex flex-col items-center text-center"
            style={{ padding: "0 8cqw", marginTop: "5cqw", gap: "1.4cqw" }}
          >
            {displayName && (
              <h1
                className="tech-name"
                style={{
                  color: WHITE,
                  fontWeight: 700,
                  fontSize: "max(20px, 5cqw)",
                  lineHeight: 1.1,
                }}
              >
                {displayName}
              </h1>
            )}
            {bio && (
              <p
                className="tech-up"
                style={{
                  animationDelay: "0.5s",
                  color: MUTED,
                  fontWeight: 500,
                  fontSize: "max(12px, 2.6cqw)",
                  whiteSpace: "pre-line",
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
              style={{ padding: "0 7cqw", marginTop: "5cqw", gap: "2cqw" }}
            >
              <SectionLabel icon={<Contact size={16} />}>Contact</SectionLabel>
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
              style={{ padding: "0 7cqw", marginTop: "4.4cqw", gap: "2cqw" }}
            >
              <SectionLabel icon={<Link2 size={16} />} delay={0.9}>
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
                      className="tech-chip inline-flex items-center"
                      style={{
                        animationDelay: `${1 + idx * 0.1}s`,
                        backgroundColor: ROW_BG,
                        color: WHITE,
                        fontWeight: 600,
                        borderRadius: "999px",
                        border: `1px solid ${BLUE_LINE}`,
                        boxShadow: `0 0 2cqw rgba(10,92,255,0.35)`,
                        padding: "1.8cqw 3.4cqw",
                        gap: "2cqw",
                      }}
                    >
                      <span style={{ color: CYAN }}>
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

          <div style={{ height: "8cqw" }} />
        </div>

        {/* ---------- Bottom action bar ---------- */}
        <div className="tech-bar relative w-full flex-shrink-0">
          <div
            className="grid grid-cols-3 relative overflow-hidden"
            style={{
              backgroundColor: "rgba(3,8,16,0.72)",
              backdropFilter: "blur(6px)",
              borderTop: `1px solid ${BLUE_LINE}`,
              boxShadow: `0 -0.6cqw 3cqw rgba(10,92,255,0.35)`,
            }}
          >
            <span aria-hidden="true" className="tech-bar-glow" />
            <button
              type="button"
              onClick={() => setShowQr(true)}
              className="tech-action flex flex-col items-center hover:opacity-80"
              style={actionStyle}
            >
              <QrCode size={18} style={{ color: CYAN }} />
              <span style={actionLabel}>QR Code</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="tech-action flex flex-col items-center hover:opacity-80"
              style={actionStyle}
            >
              <Share2 size={18} style={{ color: CYAN }} />
              <span style={actionLabel}>Share</span>
            </button>
            <button
              type="button"
              onClick={handleSaveContact}
              className="tech-action flex flex-col items-center hover:opacity-80"
              style={actionStyle}
            >
              <UserPlus size={18} style={{ color: CYAN }} />
              <span style={actionLabel}>Save Contact</span>
            </button>
          </div>
        </div>

        {/* ---------- QR modal ---------- */}
        {showQr && (
          <div
            className="tech-overlay absolute inset-0 z-20 flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
            onClick={() => setShowQr(false)}
          >
            <div
              className="tech-modal relative rounded-2xl p-5 flex flex-col items-center gap-3"
              style={{
                backgroundColor: "#0b1220",
                border: `1px solid ${BLUE_LINE}`,
                boxShadow: `0 0 4cqw rgba(10,92,255,0.5)`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowQr(false)}
                className="absolute top-2 right-2 hover:opacity-70"
                style={{ color: WHITE }}
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
              <span className="text-sm font-medium" style={{ color: WHITE }}>
                {displayName}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tech;
