"use client";

// src/components/template-previews/boss-auto-exchange.tsx
// Boss Auto Exchange - based on the logo: royal-blue glow, white outlines, racing red, tire tread, road lines (premium)
// Slug: "boss-auto-exchange" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
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
const RED = "#d42027";
const RED_LIGHT = "#ff3b43";
const NAVY = "#0b2a5b";
const BLUE = "#0a5fa8";
const WHITE = "#ffffff";

const THEME: CardTheme = {
  font: "'Rajdhani', 'Segoe UI', Arial, sans-serif",
  bg: "#031a3d",
  text: "#ffffff",
  muted: "#b9d3f2",
  accent: RED,
  accent2: RED_LIGHT,
  glow: "212,32,39",
  rowBg: "rgba(5,32,74,0.82)",
  rowBorder: "rgba(255,255,255,0.55)",
  panel: "#06285a",
  barBg: "rgba(3,26,61,0.94)",
};

// Files live in /public, so they are served from the site root.
const VIDEOS = ["/video1.mp4", "/video2.mp4"];

// Images in /public/boss (car1 to car5). Change the extension if yours is not .jpg
const IMAGES = Array.from({ length: 5 }, (_, i) => `/boss/car${i + 1}.jpg`);

// Time each image stays on screen (keep at 2000 or more)
const SLIDE_MS = 3000;

const PANEL_STYLE: React.CSSProperties = {
  background: "#000",
  border: `2px solid ${WHITE}`,
  boxShadow: `0 4px 0 ${RED}, 0 0 24px rgba(10,95,168,0.55)`,
  // angled top-right and bottom-left corners, like the logo letters
  clipPath:
    "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
};

const CSS = `
@keyframes ba-fade  { from { opacity: 0; } to { opacity: 1; } }
@keyframes ba-right { from { translate: -400px 0; } to { translate: 1400px 0; } }
@keyframes ba-left  { from { translate: 1400px 0; } to { translate: -400px 0; } }
@keyframes ba-pulse { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
@keyframes ba-road  { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -80; } }
@keyframes ba-spin  { from { rotate: 0deg; } to { rotate: 360deg; } }
.ba-right { animation: ba-right linear infinite; }
.ba-left  { animation: ba-left linear infinite; }
.ba-pulse { animation: ba-pulse 4s ease-in-out infinite; }
.ba-road  { animation: ba-road 1.4s linear infinite; }
.ba-tire  { transform-box: fill-box; transform-origin: center; animation: ba-spin 60s linear infinite; }
.ba-stack { animation: ba-fade .8s ease .3s both; }
.ba-slide { transition: opacity .7s ease; }
@media (prefers-reduced-motion: reduce) {
  .ba-right, .ba-left, .ba-pulse, .ba-road, .ba-tire, .ba-stack { animation: none; }
  .ba-slide { transition: none; }
  .ba-moving { display: none; }
}
`;

// Road perspective at the bottom of the card
const HORIZON = 1100;
const VP_X = 512;
const BOTTOM = 1536;

// A few thin speed lines (deterministic so SSR matches the client)
const STREAKS = Array.from({ length: 6 }, (_, i) => ({
  y: 140 + ((i * 263) % 780),
  len: 200 + ((i * 71) % 180),
  dir: i % 2 ? "left" : "right",
  dur: 4 + ((i * 3) % 5),
  delay: -((i * 7) % 11),
  red: i % 3 === 0,
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
      style={{ zIndex: 9999, background: "rgba(2,14,36,0.94)" }}
    >
      <img
        src={IMAGES[index]}
        alt=""
        draggable={false}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[88vh] max-w-[94vw] object-contain rounded-lg"
        style={{
          border: `2px solid ${WHITE}`,
          boxShadow: `0 0 40px rgba(10,95,168,0.6), 0 6px 0 ${RED}`,
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
const BaSlider = () => {
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
            className="ba-slide absolute inset-0 w-full h-full object-cover"
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
  background: "rgba(3,26,61,0.7)",
  border: "1px solid rgba(255,255,255,0.6)",
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
const BaVideo = () => {
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
const BaMedia = () => (
  <div
    className="ba-stack absolute flex flex-col gap-2"
    style={{
      left: "13%",
      right: "13%",
      bottom: "9%",
      // sit above the card content layer and receive clicks even if the artwork layer ignores them
      zIndex: 30,
      pointerEvents: "auto",
    }}
  >
    <BaSlider />
    <BaVideo />
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
        {/* Logo background: bright blue glow in the middle fading to deep navy */}
        <radialGradient id="ba-bg" cx=".5" cy=".38" r=".85">
          <stop offset="0" stopColor={BLUE} />
          <stop offset=".45" stopColor="#06336b" />
          <stop offset="1" stopColor="#020f2a" />
        </radialGradient>
        <linearGradient id="ba-red" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={RED} stopOpacity="0" />
          <stop offset=".5" stopColor={RED_LIGHT} stopOpacity=".95" />
          <stop offset="1" stopColor={RED} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ba-trail" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={WHITE} stopOpacity="0" />
          <stop offset="1" stopColor={WHITE} stopOpacity=".9" />
        </linearGradient>
        <linearGradient id="ba-trail-red" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={RED} stopOpacity="0" />
          <stop offset="1" stopColor={RED_LIGHT} stopOpacity=".95" />
        </linearGradient>
        <linearGradient id="ba-road-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".3" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity=".55" />
        </linearGradient>
        <mask id="ba-road-mask">
          <rect
            y={HORIZON}
            width="1024"
            height={BOTTOM - HORIZON}
            fill="url(#ba-road-fade)"
          />
        </mask>
        <linearGradient id="ba-tread-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="ba-tread-mask">
          <rect width="1024" height="1536" fill="url(#ba-tread-fade)" />
        </mask>
      </defs>

      {/* Base */}
      <rect width="1024" height="1536" fill="url(#ba-bg)" />

      {/* Big tire watermark (tread blocks + rim rings), slowly rotating */}
      <g mask="url(#ba-tread-mask)" opacity=".10">
        <g className="ba-tire">
          <circle
            cx="512"
            cy="560"
            r="430"
            fill="none"
            stroke={WHITE}
            strokeWidth="70"
            strokeDasharray="22 14"
          />
          <circle
            cx="512"
            cy="560"
            r="380"
            fill="none"
            stroke={WHITE}
            strokeWidth="3"
          />
          <circle
            cx="512"
            cy="560"
            r="250"
            fill="none"
            stroke={WHITE}
            strokeWidth="3"
          />
          <circle
            cx="512"
            cy="560"
            r="190"
            fill="none"
            stroke={WHITE}
            strokeWidth="18"
            strokeDasharray="60 30"
          />
        </g>
      </g>

      {/* Red and white racing stripes, top right (echoes the slanted logo) */}
      <g fill="none" strokeLinecap="butt">
        <path d="M700 44 L980 400" stroke={RED} strokeWidth="14" opacity=".9" />
        <path
          d="M740 44 L980 350"
          stroke={WHITE}
          strokeWidth="4"
          opacity=".85"
        />
        <path d="M770 44 L980 312" stroke={RED} strokeWidth="3" opacity=".7" />
      </g>
      {/* Mirrored stripes, bottom left */}
      <g fill="none" strokeLinecap="butt">
        <path
          d="M324 1492 L44 1136"
          stroke={RED}
          strokeWidth="14"
          opacity=".9"
        />
        <path
          d="M284 1492 L44 1186"
          stroke={WHITE}
          strokeWidth="4"
          opacity=".85"
        />
        <path
          d="M254 1492 L44 1224"
          stroke={RED}
          strokeWidth="3"
          opacity=".7"
        />
      </g>

      {/* Speed lines */}
      {STREAKS.map((s, i) => (
        <g
          key={i}
          className="ba-moving"
          transform={`translate(0 ${s.y})`}
          opacity=".5"
        >
          <g
            className={s.dir === "left" ? "ba-left" : "ba-right"}
            style={{
              animationDuration: `${s.dur}s`,
              animationDelay: `${s.delay}s`,
            }}
          >
            <rect
              x="0"
              y="0"
              width={s.len}
              height={s.red ? 3 : 2}
              fill={s.red ? "url(#ba-trail-red)" : "url(#ba-trail)"}
              transform={
                s.dir === "left"
                  ? `translate(${s.len} 0) scale(-1 1)`
                  : undefined
              }
            />
          </g>
        </g>
      ))}

      {/* Horizon red glow line */}
      <rect
        className="ba-pulse"
        x="60"
        y={HORIZON - 2}
        width="904"
        height="4"
        fill="url(#ba-red)"
      />

      {/* Road: edge lines and animated dashed centre line */}
      <g mask="url(#ba-road-mask)" fill="none">
        <path
          d={`M${VP_X - 40} ${HORIZON} L-300 ${BOTTOM}`}
          stroke={WHITE}
          strokeWidth="3"
          opacity=".55"
        />
        <path
          d={`M${VP_X + 40} ${HORIZON} L1324 ${BOTTOM}`}
          stroke={WHITE}
          strokeWidth="3"
          opacity=".55"
        />
        <path
          className="ba-road"
          d={`M${VP_X} ${HORIZON} L${VP_X} ${BOTTOM}`}
          stroke={RED_LIGHT}
          strokeWidth="6"
          strokeDasharray="40 40"
          opacity=".8"
        />
      </g>

      {/* Angular corner brackets: white with a red inner edge, like the logo outline */}
      <g strokeLinecap="square" fill="none">
        <g stroke={WHITE} strokeWidth="5">
          <path d="M44 120 V44 H120" />
          <path d="M904 44 H980 V120" />
          <path d="M44 1416 V1492 H120" />
          <path d="M904 1492 H980 V1416" />
        </g>
        <g stroke={RED} strokeWidth="3">
          <path d="M56 120 V56 H120" />
          <path d="M904 56 H968 V120" />
          <path d="M56 1416 V1480 H120" />
          <path d="M904 1480 H968 V1416" />
        </g>
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
        opacity=".22"
      />
    </svg>

    {/* Image slider + video in the empty space below the socials */}
    <BaMedia />
  </>
);

export const BossAutoExchange: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);

export default BossAutoExchange;
