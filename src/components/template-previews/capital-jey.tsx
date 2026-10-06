"use client";

// src/components/template-previews/capital-jey.tsx
// Capital Jey Car Trading - based on the logo: black, racing red and white, tire tread edge, red speed spikes (premium)
// Slug: "capital-jey" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
// and in TemplateCard.tsx (PREVIEW_ASPECT).
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

// Logo palette
const RED = "#ee1c25";
const RED_DARK = "#a30d14";
const WHITE = "#ffffff";

const THEME: CardTheme = {
  font: "'Orbitron', 'Rajdhani', 'Segoe UI', Arial, sans-serif",
  bg: "#000000",
  text: "#ffffff",
  muted: "#cfcfcf",
  accent: RED,
  accent2: "#ff4d55",
  glow: "238,28,37",
  rowBg: "rgba(20,20,20,0.85)",
  rowBorder: "rgba(238,28,37,0.55)",
  panel: "#0d0d0d",
  barBg: "rgba(0,0,0,0.94)",
};

// Files live in /public, so they are served from the site root.
const VIDEOS = ["/video1.mp4", "/video2.mp4"];

// Images in /public/capital-jey (car1 to car5). Change the extension if yours is not .jpg
const IMAGES = Array.from(
  { length: 5 },
  (_, i) => `/capital-jey/car${i + 1}.jpg`,
);

// Time each image stays on screen (keep at 2000 or more)
const SLIDE_MS = 3000;

const PANEL_STYLE: React.CSSProperties = {
  background: "#000",
  border: `2px solid ${RED}`,
  boxShadow: `0 0 22px rgba(238,28,37,0.45)`,
  // angled top-right and bottom-left corners, like the speed spikes in the logo
  clipPath:
    "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
};

const CSS = `
@keyframes cj-fade  { from { opacity: 0; } to { opacity: 1; } }
@keyframes cj-right { from { translate: -500px 0; } to { translate: 1400px 0; } }
@keyframes cj-pulse { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
@keyframes cj-tread { from { transform: translateY(0); } to { transform: translateY(40px); } }
.cj-right { animation: cj-right linear infinite; }
.cj-pulse { animation: cj-pulse 3.5s ease-in-out infinite; }
.cj-tread { animation: cj-tread 2.4s linear infinite; }
.cj-stack { animation: cj-fade .8s ease .3s both; }
.cj-slide { transition: opacity .7s ease; }
@media (prefers-reduced-motion: reduce) {
  .cj-right, .cj-pulse, .cj-tread, .cj-stack { animation: none; }
  .cj-slide { transition: none; }
  .cj-moving { display: none; }
}
`;

// Red speed lines that shoot left to right (deterministic so SSR matches the client)
const STREAKS = Array.from({ length: 6 }, (_, i) => ({
  y: 160 + ((i * 227) % 720),
  len: 220 + ((i * 83) % 200),
  h: i % 2 ? 2 : 3,
  dur: 3.5 + ((i * 3) % 5),
  delay: -((i * 5) % 9),
  white: i % 3 === 2,
}));

/** Full-screen viewer for the slider images (click outside, X or Esc to close). */
const Lightbox = ({
  index,
  onChange,
  onClose,
}: {
  index: number;
  onChange: (i: number) => void;
  onClose: () => void;
}) => {
  const count = IMAGES.length;
  const go = (d: number) => onChange((index + d + count) % count);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // lock page scroll while open
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={onClose}
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 9999, background: "rgba(0,0,0,0.95)" }}
    >
      <img
        src={IMAGES[index]}
        alt=""
        draggable={false}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[88vh] max-w-[94vw] object-contain rounded-lg"
        style={{
          border: `2px solid ${RED}`,
          boxShadow: "0 0 40px rgba(238,28,37,0.5)",
        }}
      />

      <button
        type="button"
        aria-label="Close"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 flex items-center justify-center rounded-full text-white hover:bg-red-600 transition"
        style={{
          width: 40,
          height: 40,
          background: "rgba(0,0,0,0.6)",
          border: "1px solid rgba(255,255,255,0.45)",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M6 6 L18 18 M18 6 L6 18" />
        </svg>
      </button>

      {count > 1 && (
        <>
          <ArrowButton dir="prev" onClick={() => go(-1)} />
          <ArrowButton dir="next" onClick={() => go(1)} />
          <span
            className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ background: RED }}
          >
            {index + 1} / {count}
          </span>
        </>
      )}
    </div>,
    document.body,
  );
};

/** Auto-advancing image slider with a crossfade, clickable dots and a full-size viewer. */
const CjSlider = () => {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  // Restarts on every change, so tapping a dot also resets the timer.
  // Paused while the full-size viewer is open.
  useEffect(() => {
    if (IMAGES.length < 2 || open) return;
    const t = setTimeout(
      () => setIndex((n) => (n + 1) % IMAGES.length),
      Math.max(SLIDE_MS, 2000),
    );
    return () => clearTimeout(t);
  }, [index, open]);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label="View image full size"
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setOpen(true);
        }}
        className="relative w-full overflow-hidden rounded-xl pointer-events-auto cursor-zoom-in"
        style={{ ...PANEL_STYLE, aspectRatio: "16 / 5.5" }}
      >
        {IMAGES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            draggable={false}
            loading={i === 0 ? "eager" : "lazy"}
            className="cj-slide absolute inset-0 w-full h-full object-cover"
            style={{ opacity: i === index ? 1 : 0 }}
          />
        ))}

        {IMAGES.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
            {IMAGES.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show image ${i + 1}`}
                onClick={(e) => {
                  e.stopPropagation(); // do not open the viewer
                  setIndex(i);
                }}
                className="rounded-full"
                style={{
                  width: i === index ? 18 : 6,
                  height: 6,
                  background: i === index ? RED : "rgba(255,255,255,0.75)",
                  transition: "width .3s ease, background .3s ease",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {open && (
        <Lightbox
          index={index}
          onChange={setIndex}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

const ARROW_STYLE: React.CSSProperties = {
  width: 28,
  height: 28,
  background: "rgba(0,0,0,0.65)",
  border: "1px solid rgba(255,255,255,0.55)",
  backdropFilter: "blur(4px)",
};

/** Round chevron button used for previous / next. */
const ArrowButton = ({
  dir,
  onClick,
}: {
  dir: "prev" | "next";
  onClick: () => void;
}) => (
  <button
    type="button"
    aria-label={dir === "next" ? "Next" : "Previous"}
    onClick={(e) => {
      e.stopPropagation(); // do not toggle play/pause or close viewer
      onClick();
    }}
    className={`absolute top-1/2 -translate-y-1/2 ${
      dir === "next" ? "right-2" : "left-2"
    } flex items-center justify-center rounded-full text-white transition hover:scale-110 hover:bg-red-600`}
    style={ARROW_STYLE}
  >
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={dir === "next" ? "M9 5 L16 12 L9 19" : "M15 5 L8 12 L15 19"} />
    </svg>
  </button>
);

/** Plays video1 then video2, then loops back to video1. */
const CjVideo = () => {
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

  const next = () => setIndex((n) => (n + 1) % VIDEOS.length);
  const prev = () => setIndex((n) => (n - 1 + VIDEOS.length) % VIDEOS.length);

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl"
      style={{ ...PANEL_STYLE, aspectRatio: "16 / 8.5" }}
    >
      <video
        ref={ref}
        src={VIDEOS[index]}
        autoPlay
        muted
        playsInline
        preload="metadata"
        onEnded={next}
        onClick={(e) => {
          const v = e.currentTarget;
          v.paused ? v.play() : v.pause();
        }}
        className="w-full h-full object-cover cursor-pointer"
      />

      {VIDEOS.length > 1 && (
        <>
          <ArrowButton dir="prev" onClick={prev} />
          <ArrowButton dir="next" onClick={next} />
          <span
            className="absolute bottom-2 right-3 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
            style={{ background: RED }}
          >
            {index + 1} / {VIDEOS.length}
          </span>
        </>
      )}
    </div>
  );
};

/** Image slider on top, video below, both in the empty space under the socials. */
const CjMedia = () => (
  <div
    className="cj-stack absolute flex flex-col gap-2"
    style={{
      left: "13%",
      right: "13%",
      bottom: "9%",
      // sit above the card content layer and receive clicks even if the artwork layer ignores them
      zIndex: 30,
      pointerEvents: "auto",
    }}
  >
    <CjSlider />
    <CjVideo />
  </div>
);

const Artwork = () => (
  <>
    <svg
      viewBox="0 0 1024 1536"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
    >
      <defs>
        {/* Black base with a red glow coming from the left, where the tire sits in the logo */}
        <linearGradient id="cj-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a0a0a" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <radialGradient id="cj-glow" cx="0" cy=".22" r=".8">
          <stop offset="0" stopColor={RED} stopOpacity=".38" />
          <stop offset="1" stopColor={RED} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cj-glow2" cx="1" cy=".92" r=".7">
          <stop offset="0" stopColor={RED} stopOpacity=".22" />
          <stop offset="1" stopColor={RED} stopOpacity="0" />
        </radialGradient>

        {/* Spike: tapers to a point on the right, like the C swoosh */}
        <linearGradient id="cj-spike" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={RED} stopOpacity="1" />
          <stop offset="1" stopColor={RED} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="cj-trail" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={RED} stopOpacity="0" />
          <stop offset="1" stopColor="#ff4d55" stopOpacity=".95" />
        </linearGradient>
        <linearGradient id="cj-trail-w" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={WHITE} stopOpacity="0" />
          <stop offset="1" stopColor={WHITE} stopOpacity=".9" />
        </linearGradient>

        {/* Tire tread: white zigzag chevrons */}
        <pattern
          id="cj-tread-pat"
          width="64"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 4 L32 22 L64 4 M0 24 L32 42 L64 24"
            fill="none"
            stroke={WHITE}
            strokeWidth="5"
            strokeLinejoin="miter"
          />
        </pattern>
        <linearGradient id="cj-tread-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="cj-tread-mask">
          <rect width="150" height="1536" fill="url(#cj-tread-fade)" />
        </mask>
        <linearGradient id="cj-hline" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={RED} stopOpacity="0" />
          <stop offset=".5" stopColor={RED} stopOpacity="1" />
          <stop offset="1" stopColor={RED} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Base */}
      <rect width="1024" height="1536" fill="url(#cj-bg)" />
      <rect width="1024" height="1536" fill="url(#cj-glow)" />
      <rect width="1024" height="1536" fill="url(#cj-glow2)" />

      {/* Tire tread band down the left edge, moving slowly like a rolling wheel */}
      <g mask="url(#cj-tread-mask)" opacity=".4">
        <g className="cj-tread">
          <rect
            x="0"
            y="-80"
            width="150"
            height="1700"
            fill="url(#cj-tread-pat)"
          />
        </g>
      </g>
      {/* Solid white tire edge line */}
      <rect x="0" y="0" width="8" height="1536" fill={WHITE} opacity=".85" />
      <rect x="8" y="0" width="5" height="1536" fill={RED} />

      {/* Red "C" arc with speed spikes, top left (from the logo) */}
      <path
        d="M110 330 C40 330 30 150 130 100 C190 70 300 70 360 80"
        fill="none"
        stroke={RED}
        strokeWidth="26"
        strokeLinecap="butt"
        opacity=".9"
      />
      <path d="M340 62 L760 92 L340 108 Z" fill="url(#cj-spike)" />
      <path
        d="M300 128 L620 150 L300 150 Z"
        fill="url(#cj-spike)"
        opacity=".8"
      />
      <path
        d="M120 350 L480 372 L120 378 Z"
        fill="url(#cj-spike)"
        opacity=".6"
      />

      {/* Mirrored spikes, bottom right */}
      <g transform="translate(1024 1536) scale(-1 -1)" opacity=".85">
        <path d="M340 62 L760 92 L340 108 Z" fill="url(#cj-spike)" />
        <path
          d="M300 128 L620 150 L300 150 Z"
          fill="url(#cj-spike)"
          opacity=".8"
        />
      </g>

      {/* Red speed lines */}
      {STREAKS.map((s, i) => (
        <g
          key={i}
          className="cj-moving"
          transform={`translate(0 ${s.y})`}
          opacity=".5"
        >
          <g
            className="cj-right"
            style={{
              animationDuration: `${s.dur}s`,
              animationDelay: `${s.delay}s`,
            }}
          >
            <rect
              x="0"
              y="0"
              width={s.len}
              height={s.h}
              fill={s.white ? "url(#cj-trail-w)" : "url(#cj-trail)"}
            />
          </g>
        </g>
      ))}

      {/* Red glow line above the media area */}
      <rect
        className="cj-pulse"
        x="80"
        y="1086"
        width="864"
        height="3"
        fill="url(#cj-hline)"
      />

      {/* Angular corner brackets (right side only, the left is the tire) */}
      <g stroke={RED} strokeWidth="4" fill="none" strokeLinecap="square">
        <path d="M914 44 H980 V110" />
        <path d="M914 1492 H980 V1426" />
      </g>
      <g stroke={WHITE} strokeWidth="1.5" fill="none" opacity=".6">
        <path d="M924 56 H968 V100" />
        <path d="M924 1480 H968 V1436" />
      </g>

      {/* Hairline frame */}
      <rect
        x="44"
        y="44"
        width="936"
        height="1448"
        fill="none"
        stroke={WHITE}
        strokeWidth="1"
        opacity=".14"
      />
    </svg>

    {/* Image slider + video in the empty space below the socials */}
    <CjMedia />
  </>
);

export const CapitalJey: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);

export default CapitalJey;
