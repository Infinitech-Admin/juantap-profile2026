"use client";

// src/components/template-previews/obsidian-copper.tsx
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

interface ObsidianCopperProps {
  template?: Template;
  user?: User;
}

/* ---------- Palette (taken from the artwork) ---------- */
const BG_TOP = "#14171c";
const BG_MID = "#0a0c10";
const BG_BOTTOM = "#050608";
const COPPER = "#c8844a"; // main copper line
const COPPER_LIGHT = "#e9b27a"; // highlights
const COPPER_DEEP = "#8a5632"; // shadows
const SLATE = "#1a1f27"; // corner panels
const STEEL = "#4a5260"; // faint grey circuit lines
const WHITE = "#f6f1ea";
const MUTED = "#a4a8b1";
const ROW_BG = "rgba(18,21,27,0.78)";
const ROW_BORDER = "rgba(200,132,74,0.38)";

const FONT = "Sora, Poppins, 'Segoe UI', Arial, sans-serif";

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

/* ---------- Animations ---------- */
const OC_CSS = `
@keyframes oc-flow     { from { stroke-dashoffset: 1000; } to { stroke-dashoffset: 0; } }
@keyframes oc-glow     { 0%,100% { opacity: .65; } 50% { opacity: 1; } }
@keyframes oc-spark    { 0%,100% { scale: 1; opacity: .3; } 50% { scale: 1.8; opacity: .85; } }
@keyframes oc-sweep    { from { translate: -320px -320px; } to { translate: 320px 320px; } }
@keyframes oc-float    {
  0%   { translate: 0 0; opacity: 0; }
  15%  { opacity: .8; }
  100% { translate: 24px -420px; opacity: 0; }
}
@keyframes oc-scan     { from { translate: 0 -20cqw; } to { translate: 0 160cqw; } }
@keyframes oc-up       { from { opacity: 0; translate: 0 3.5cqw; } to { opacity: 1; translate: 0 0; } }
@keyframes oc-slide    { from { opacity: 0; translate: -6cqw 0; } to { opacity: 1; translate: 0 0; } }
@keyframes oc-pop      { from { opacity: 0; scale: .6; } to { opacity: 1; scale: 1; } }
@keyframes oc-rise     { from { translate: 0 100%; } to { translate: 0 0; } }
@keyframes oc-draw     { from { scale: 0 1; } to { scale: 1 1; } }
@keyframes oc-spin     { to { rotate: 360deg; } }
@keyframes oc-spin-rev { to { rotate: -360deg; } }
@keyframes oc-avatar   {
  0%,100% { box-shadow: 0 0 3cqw rgba(200,132,74,.4), 0 0 0 1.2cqw rgba(200,132,74,.18); }
  50%     { box-shadow: 0 0 6cqw rgba(233,178,122,.8), 0 0 0 1.6cqw rgba(200,132,74,.32); }
}
@keyframes oc-text     {
  0%,100% { text-shadow: 0 0 1.6cqw rgba(200,132,74,.3); }
  50%     { text-shadow: 0 0 3.4cqw rgba(233,178,122,.8); }
}
@keyframes oc-shine    { from { translate: -120% 0; } to { translate: 320% 0; } }
@keyframes oc-bar      { from { translate: -100% 0; } to { translate: 300% 0; } }
@keyframes oc-fade     { from { opacity: 0; } to { opacity: 1; } }
@keyframes oc-zoom     { from { opacity: 0; scale: .85; } to { opacity: 1; scale: 1; } }

.oc-flow     { animation: oc-flow 3.6s linear infinite; }
.oc-glow     { animation: oc-glow 3.6s ease-in-out infinite; }
.oc-spark    { animation: oc-spark 3.4s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.oc-sweep    { animation: oc-sweep 4.2s ease-in-out infinite; }
.oc-float    { animation: oc-float 10s linear infinite; }
.oc-scan     { animation: oc-scan 8s linear infinite; }

.oc-up       { animation: oc-up .7s ease-out both; }
.oc-pop      { animation: oc-pop .7s cubic-bezier(.2,1.3,.4,1) both; }
.oc-name     { animation: oc-up .7s ease-out .35s both, oc-text 3.4s ease-in-out 1.2s infinite; }
.oc-line     { transform-origin: left center; animation: oc-draw .9s ease-out .7s both; }
.oc-ring     { animation: oc-spin 16s linear infinite; }
.oc-ring-rev { animation: oc-spin-rev 6s linear infinite; }
.oc-avatar   { animation: oc-avatar 3.4s ease-in-out infinite; }

.oc-row {
  position: relative; overflow: hidden;
  animation: oc-slide .6s ease-out both;
  transition: scale .2s ease, background-color .2s ease;
}
.oc-row:hover { scale: 1.015; background-color: rgba(30,34,42,.9) !important; }
.oc-row::after {
  content: ""; position: absolute; top: 0; bottom: 0; left: 0; width: 35%;
  background: linear-gradient(100deg, transparent, rgba(233,178,122,.16), transparent);
  animation: oc-shine 6s ease-in-out 2s infinite; pointer-events: none;
}

.oc-chip {
  animation: oc-pop .5s cubic-bezier(.2,1.3,.4,1) both;
  transition: translate .2s ease, box-shadow .2s ease;
}
.oc-chip:hover { translate: 0 -.6cqw; box-shadow: 0 0 3.4cqw rgba(200,132,74,.55) !important; }

.oc-bar { animation: oc-rise .7s cubic-bezier(.2,.9,.3,1) 1s both; }
.oc-bar-glow {
  position: absolute; top: 0; left: 0; height: 2px; width: 35%;
  background: linear-gradient(90deg, transparent, ${COPPER_LIGHT}, transparent);
  animation: oc-bar 3.6s ease-in-out infinite; pointer-events: none;
}
.oc-action svg { transition: translate .2s ease, scale .2s ease; }
.oc-action:hover svg { translate: 0 -.7cqw; scale: 1.2; }

.oc-overlay { animation: oc-fade .25s ease-out both; }
.oc-modal   { animation: oc-zoom .3s cubic-bezier(.2,1.2,.4,1) both; }

@media (prefers-reduced-motion: reduce) {
  .oc-flow, .oc-float, .oc-scan, .oc-sweep, .oc-bar-glow, .oc-row::after { display: none; }
  .oc-glow, .oc-spark, .oc-up, .oc-pop, .oc-name, .oc-line, .oc-ring,
  .oc-ring-rev, .oc-avatar, .oc-row, .oc-chip, .oc-bar, .oc-overlay,
  .oc-modal { animation: none; }
}
`;

/* ---------- Background artwork (recreated from the image, 1024 x 1536) ---------- */
const COPPER_PATHS: { d: string; w: number; dur: number; delay: number }[] = [
  // top-right circuit
  {
    d: "M943 0 V282 L977 316 V560 V683 L1024 733",
    w: 3,
    dur: 4.2,
    delay: 0,
  },
  // bottom-left circuit
  { d: "M0 1048 L68 1122 V1265", w: 3, dur: 3.2, delay: 1.1 },
  // long diagonals
  { d: "M410 0 L0 388", w: 3.5, dur: 4.6, delay: 0.5 },
  { d: "M1024 995 L462 1536", w: 3.5, dur: 5, delay: 1.6 },
];

const STEEL_PATHS: string[] = [
  "M965 0 V130 L995 158 V528",
  "M28 1132 V1380 L68 1420 V1536",
  "M80 1384 V1536",
];

/* faint streaks at the lower-right */
const STREAKS: [number, number, number, number][] = [
  [820, 1010, 1024, 785],
  [810, 1040, 1024, 815],
  [800, 1075, 1024, 850],
  [795, 1110, 1024, 885],
  [790, 1145, 1024, 920],
];

/* Fixed positions so server and client render identically */
const PARTICLES: {
  x: number;
  y: number;
  r: number;
  dur: number;
  delay: number;
}[] = [
  { x: 120, y: 1100, r: 2, dur: 10, delay: 0 },
  { x: 260, y: 900, r: 1.8, dur: 12, delay: 2 },
  { x: 400, y: 1250, r: 2.4, dur: 11, delay: 4 },
  { x: 520, y: 1000, r: 1.8, dur: 13, delay: 1 },
  { x: 640, y: 1350, r: 2.2, dur: 10.5, delay: 6 },
  { x: 760, y: 800, r: 1.8, dur: 14, delay: 3 },
  { x: 880, y: 1150, r: 2.4, dur: 11.5, delay: 5 },
  { x: 90, y: 600, r: 1.8, dur: 13, delay: 7 },
  { x: 330, y: 560, r: 2.2, dur: 12, delay: 8 },
  { x: 560, y: 640, r: 1.8, dur: 15, delay: 2.5 },
  { x: 800, y: 520, r: 2.2, dur: 11, delay: 9 },
  { x: 960, y: 700, r: 1.8, dur: 13.5, delay: 4.5 },
];

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >
    <defs>
      <linearGradient id="oc-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={BG_TOP} />
        <stop offset="0.45" stopColor={BG_MID} />
        <stop offset="1" stopColor={BG_BOTTOM} />
      </linearGradient>
      <linearGradient id="oc-panel" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#2a303a" />
        <stop offset="1" stopColor="#12151b" />
      </linearGradient>
      <linearGradient id="oc-copper" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={COPPER_LIGHT} />
        <stop offset="0.5" stopColor={COPPER} />
        <stop offset="1" stopColor={COPPER_DEEP} />
      </linearGradient>
      <linearGradient id="oc-shine" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#ffd9ad" stopOpacity="0" />
        <stop offset="0.5" stopColor="#ffd9ad" stopOpacity="0.75" />
        <stop offset="1" stopColor="#ffd9ad" stopOpacity="0" />
      </linearGradient>
      <clipPath id="oc-clip-tl">
        <polygon points="305,0 410,0 0,388 0,300" />
      </clipPath>
      <clipPath id="oc-clip-br">
        <polygon points="1024,995 1024,1060 520,1536 462,1536" />
      </clipPath>
      <filter id="oc-blur" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="oc-soft" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="12" />
      </filter>
    </defs>

    <rect width="1024" height="1536" fill="url(#oc-bg)" />

    {/* ---- top-left slate panel + dark band ---- */}
    <polygon points="0,0 305,0 0,300" fill="url(#oc-panel)" />
    <polygon points="305,0 410,0 0,388 0,300" fill="#07090c" opacity="0.9" />

    {/* ---- bottom-right slate panel ---- */}
    <polygon
      points="1024,1000 462,1536 1024,1536"
      fill="url(#oc-panel)"
      opacity="0.9"
    />

    {/* ---- faint steel circuit lines ---- */}
    <g fill="none" stroke={STEEL} strokeWidth="2" opacity="0.7">
      {STEEL_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </g>

    {/* ---- faint streaks ---- */}
    <g stroke={STEEL} strokeWidth="1.4" opacity="0.45">
      {STREAKS.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
      ))}
    </g>

    {/* ---- copper lines ---- */}
    <g fill="none" strokeLinejoin="round" strokeLinecap="round">
      {COPPER_PATHS.map((c, i) => (
        <g key={i}>
          <path
            className="oc-glow"
            d={c.d}
            stroke="url(#oc-copper)"
            strokeWidth={c.w}
            filter="url(#oc-blur)"
            style={{ animationDelay: `${c.delay}s` }}
          />
          {/* travelling highlight */}
          <path
            className="oc-flow"
            d={c.d}
            pathLength={1000}
            strokeDasharray="80 920"
            stroke="#ffe7c9"
            strokeWidth={c.w + 0.4}
            style={{
              animationDuration: `${c.dur}s`,
              animationDelay: `${c.delay}s`,
            }}
          />
        </g>
      ))}
    </g>

    {/* copper block, bottom-left */}
    <polygon
      className="oc-glow"
      points="68,1265 82,1272 82,1384 68,1376"
      fill="url(#oc-copper)"
      filter="url(#oc-blur)"
    />

    {/* light sweeps along the two diagonals */}
    <g clipPath="url(#oc-clip-tl)">
      <g className="oc-sweep">
        <rect
          x="-40"
          y="-400"
          width="80"
          height="800"
          fill="url(#oc-shine)"
          transform="translate(200 180) rotate(-45)"
        />
      </g>
    </g>
    <g clipPath="url(#oc-clip-br)">
      <g className="oc-sweep" style={{ animationDelay: "1.8s" }}>
        <rect
          x="-40"
          y="-400"
          width="80"
          height="800"
          fill="url(#oc-shine)"
          transform="translate(780 1260) rotate(-45)"
        />
      </g>
    </g>

    {/* soft glows at the corners of the copper lines */}
    <circle
      className="oc-spark"
      cx="977"
      cy="316"
      r="14"
      fill={COPPER_LIGHT}
      filter="url(#oc-soft)"
    />
    <circle
      className="oc-spark"
      cx="68"
      cy="1320"
      r="14"
      fill={COPPER_LIGHT}
      filter="url(#oc-soft)"
      style={{ animationDelay: "1.2s" }}
    />

    {/* ---- floating copper dust ---- */}
    <g>
      {PARTICLES.map((p, i) => (
        <circle
          key={i}
          className="oc-float"
          cx={p.x}
          cy={p.y}
          r={p.r}
          fill={COPPER_LIGHT}
          style={{
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </g>
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
      className="oc-row flex items-center justify-between"
      style={{
        backgroundColor: ROW_BG,
        borderRadius: "1.6cqw",
        border: `1px solid ${ROW_BORDER}`,
        borderLeft: `1cqw solid ${COPPER}`,
        padding: "2.4cqw 3.2cqw",
        gap: "2.4cqw",
        backdropFilter: "blur(4px)",
        animationDelay: `${0.75 + i * 0.12}s`,
      }}
    >
      <div className="flex items-center min-w-0" style={{ gap: "2.4cqw" }}>
        <span className="flex-shrink-0" style={{ color: COPPER_LIGHT }}>
          {icon}
        </span>
        {href ? (
          <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="truncate hover:opacity-70"
            style={{ color: WHITE, fontWeight: 500, textDecoration: "none" }}
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
        style={{ color: COPPER_LIGHT }}
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
    className="oc-up flex items-center"
    style={{
      animationDelay: `${delay}s`,
      color: WHITE,
      fontWeight: 700,
      fontSize: "max(13px, 3cqw)",
      letterSpacing: "0.04em",
      gap: "1.8cqw",
    }}
  >
    <span style={{ color: COPPER_LIGHT }}>{icon}</span>
    {children}
    <span
      aria-hidden="true"
      className="oc-line flex-1"
      style={{
        height: "1px",
        background: `linear-gradient(90deg, ${COPPER}, transparent)`,
      }}
    />
  </h2>
);

export const ObsidianCopper: React.FC<ObsidianCopperProps> = ({ user }) => {
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
      <style>{OC_CSS}</style>
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
          className="oc-scan absolute left-0 right-0 pointer-events-none"
          style={{
            top: 0,
            height: "18cqw",
            background:
              "linear-gradient(180deg, transparent, rgba(233,178,122,0.05), transparent)",
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
            className="oc-pop relative flex-shrink-0"
            style={{ width: "28cqw", height: "28cqw" }}
          >
            <div
              aria-hidden="true"
              className="oc-ring absolute rounded-full pointer-events-none"
              style={{
                inset: "-2.4cqw",
                border: `0.35cqw dashed rgba(233,178,122,0.65)`,
              }}
            />
            <div
              aria-hidden="true"
              className="oc-ring-rev absolute rounded-full pointer-events-none"
              style={{
                inset: "-4.4cqw",
                border: "0.4cqw solid transparent",
                borderTopColor: COPPER_LIGHT,
                borderRightColor: COPPER_DEEP,
              }}
            />
            <div
              className="oc-avatar overflow-hidden rounded-full w-full h-full flex items-center justify-center"
              style={{
                backgroundColor: SLATE,
                border: `0.8cqw solid ${COPPER}`,
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
                className="oc-name"
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
                className="oc-up"
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
                      className="oc-chip inline-flex items-center"
                      style={{
                        animationDelay: `${1 + idx * 0.1}s`,
                        backgroundColor: ROW_BG,
                        color: WHITE,
                        fontWeight: 600,
                        borderRadius: "999px",
                        border: `1px solid ${COPPER}`,
                        boxShadow: `0 0 2cqw rgba(200,132,74,0.3)`,
                        padding: "1.8cqw 3.4cqw",
                        gap: "2cqw",
                      }}
                    >
                      <span style={{ color: COPPER_LIGHT }}>
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
        <div className="oc-bar relative w-full flex-shrink-0">
          <div
            className="grid grid-cols-3 relative overflow-hidden"
            style={{
              backgroundColor: "rgba(6,7,9,0.78)",
              backdropFilter: "blur(6px)",
              borderTop: `1px solid ${COPPER}`,
              boxShadow: `0 -0.6cqw 3cqw rgba(200,132,74,0.28)`,
            }}
          >
            <span aria-hidden="true" className="oc-bar-glow" />
            <button
              type="button"
              onClick={() => setShowQr(true)}
              className="oc-action flex flex-col items-center hover:opacity-80"
              style={actionStyle}
            >
              <QrCode size={18} style={{ color: COPPER_LIGHT }} />
              <span style={actionLabel}>QR Code</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="oc-action flex flex-col items-center hover:opacity-80"
              style={actionStyle}
            >
              <Share2 size={18} style={{ color: COPPER_LIGHT }} />
              <span style={actionLabel}>Share</span>
            </button>
            <button
              type="button"
              onClick={handleSaveContact}
              className="oc-action flex flex-col items-center hover:opacity-80"
              style={actionStyle}
            >
              <UserPlus size={18} style={{ color: COPPER_LIGHT }} />
              <span style={actionLabel}>Save Contact</span>
            </button>
          </div>
        </div>

        {/* ---------- QR modal ---------- */}
        {showQr && (
          <div
            className="oc-overlay absolute inset-0 z-20 flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
            onClick={() => setShowQr(false)}
          >
            <div
              className="oc-modal relative rounded-2xl p-5 flex flex-col items-center gap-3"
              style={{
                backgroundColor: "#0d1015",
                border: `1px solid ${COPPER}`,
                boxShadow: `0 0 4cqw rgba(200,132,74,0.4)`,
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

export default ObsidianCopper;
