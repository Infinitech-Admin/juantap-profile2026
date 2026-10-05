"use client";

// src/components/template-previews/neon-garage.tsx
// Neon Garage - Dark automotive look in neon green: fine hex mesh, perspective grid floor, thin speed lines and a video panel (premium)
// Slug: "neon-garage" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
// and in TemplateCard.tsx (PREVIEW_ASPECT).
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

const THEME: CardTheme = {
  font: "'Rajdhani', 'Segoe UI', Arial, sans-serif",
  bg: "#030806",
  text: "#eaffe8",
  muted: "#8fb89a",
  accent: "#39ff14",
  accent2: "#b6ff3b",
  glow: "57,255,20",
  rowBg: "rgba(6,20,12,0.78)",
  rowBorder: "rgba(57,255,20,0.35)",
  panel: "#08180f",
  barBg: "rgba(3,8,6,0.92)",
};

const GREEN = "#39ff14";

// Files live in /public, so they are served from the site root.
const VIDEOS = ["/video1.mp4", "/video2.mp4"];

// Images in /public/mikmik (car1 to car5). Change the extension if yours is not .jpg
const IMAGES = Array.from({ length: 5 }, (_, i) => `/mikmik/car${i + 1}.jpg`);

// Time each image stays on screen (keep at 2000 or more)
const SLIDE_MS = 3000;

const PANEL_STYLE: React.CSSProperties = {
  background: "#000",
  border: "1px solid rgba(57,255,20,0.55)",
  // angled top-right and bottom-left corners for a sharper, techy look
  clipPath:
    "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
};

const CSS = `
@keyframes ng-fade  { from { opacity: 0; } to { opacity: 1; } }
@keyframes ng-right { from { translate: -400px 0; } to { translate: 1400px 0; } }
@keyframes ng-left  { from { translate: 1400px 0; } to { translate: -400px 0; } }
@keyframes ng-pulse { 0%,100% { opacity: .45; } 50% { opacity: 1; } }
.ng-right { animation: ng-right linear infinite; }
.ng-left  { animation: ng-left linear infinite; }
.ng-pulse { animation: ng-pulse 5s ease-in-out infinite; }
.ng-stack { animation: ng-fade .8s ease .3s both; }
.ng-slide { transition: opacity .7s ease; }
@media (prefers-reduced-motion: reduce) {
  .ng-right, .ng-left, .ng-pulse, .ng-stack { animation: none; }
  .ng-slide { transition: none; }
  .ng-moving { display: none; }
}
`;

// Horizon and perspective grid
const HORIZON = 1060;
const VP_X = 512;
const BOTTOM = 1536;

// Horizontal grid lines get closer together near the horizon
const H_LINES = Array.from({ length: 9 }, (_, i) => {
  const t = (i + 1) / 9;
  return HORIZON + (BOTTOM - HORIZON) * t * t;
});

// Lines fanning out from the vanishing point
const V_LINES = Array.from({ length: 15 }, (_, i) => (i - 7) * 190);

// A few thin, sparse speed lines (deterministic so SSR matches the client)
const STREAKS = Array.from({ length: 5 }, (_, i) => ({
  y: 150 + ((i * 263) % 760),
  len: 180 + ((i * 71) % 160),
  dir: i % 2 ? "left" : "right",
  dur: 5 + ((i * 3) % 5),
  delay: -((i * 7) % 11),
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
      style={{ zIndex: 9999, background: "rgba(0,0,0,0.92)" }}
    >
      <img
        src={IMAGES[index]}
        alt=""
        draggable={false}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[88vh] max-w-[94vw] object-contain rounded-lg"
        style={{ boxShadow: "0 0 40px rgba(57,255,20,0.35)" }}
      />

      <button
        type="button"
        aria-label="Close"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 flex items-center justify-center rounded-full text-white hover:bg-green-600 transition"
        style={{
          width: 40,
          height: 40,
          background: "rgba(0,0,0,0.6)",
          border: "1px solid rgba(255,255,255,0.35)",
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
            style={{ background: "rgba(0,0,0,0.6)" }}
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
const NgSlider = () => {
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
            className="ng-slide absolute inset-0 w-full h-full object-cover"
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
                  background: i === index ? GREEN : "rgba(255,255,255,0.6)",
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
  background: "rgba(0,0,0,0.55)",
  border: "1px solid rgba(255,255,255,0.35)",
  backdropFilter: "blur(4px)",
};

/** Round chevron button used for previous / next video. */
const ArrowButton = ({
  dir,
  onClick,
}: {
  dir: "prev" | "next";
  onClick: () => void;
}) => (
  <button
    type="button"
    aria-label={dir === "next" ? "Next video" : "Previous video"}
    onClick={(e) => {
      e.stopPropagation(); // do not toggle play/pause
      onClick();
    }}
    className={`absolute top-1/2 -translate-y-1/2 ${
      dir === "next" ? "right-2" : "left-2"
    } flex items-center justify-center rounded-full text-white transition hover:scale-110 hover:bg-green-600`}
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
const NgVideo = () => {
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
            style={{ background: "rgba(0,0,0,0.55)" }}
          >
            {index + 1} / {VIDEOS.length}
          </span>
        </>
      )}
    </div>
  );
};

/** Image slider on top, video below, both in the empty space under the socials. */
const NgMedia = () => (
  <div
    className="ng-stack absolute flex flex-col gap-2"
    style={{
      left: "13%",
      right: "13%",
      bottom: "9%",
      // sit above the card content layer and receive clicks even if the artwork layer ignores them
      zIndex: 30,
      pointerEvents: "auto",
    }}
  >
    <NgSlider />
    <NgVideo />
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
        <linearGradient id="ng-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#040b07" />
          <stop offset=".6" stopColor="#050f09" />
          <stop offset="1" stopColor="#020604" />
        </linearGradient>
        <radialGradient id="ng-glow-top" cx=".5" cy="0" r=".7">
          <stop offset="0" stopColor={GREEN} stopOpacity=".16" />
          <stop offset="1" stopColor={GREEN} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ng-horizon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={GREEN} stopOpacity="0" />
          <stop offset="1" stopColor={GREEN} stopOpacity=".22" />
        </linearGradient>
        <linearGradient id="ng-hline" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={GREEN} stopOpacity="0" />
          <stop offset=".5" stopColor={GREEN} stopOpacity=".9" />
          <stop offset="1" stopColor={GREEN} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ng-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ng-floor-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".25" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity=".5" />
        </linearGradient>
        <mask id="ng-mesh-mask">
          <rect width="1024" height="1100" fill="url(#ng-fade)" />
        </mask>
        <mask id="ng-floor-mask">
          <rect
            y={HORIZON}
            width="1024"
            height={BOTTOM - HORIZON}
            fill="url(#ng-floor-fade)"
          />
        </mask>
        <pattern
          id="ng-mesh"
          width="24"
          height="21"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M12 0 L24 6 V15 L12 21 L0 15 V6Z"
            fill="none"
            stroke={GREEN}
            strokeWidth="1"
          />
        </pattern>
        <linearGradient id="ng-trail" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={GREEN} stopOpacity="0" />
          <stop offset="1" stopColor={GREEN} stopOpacity=".9" />
        </linearGradient>
      </defs>

      {/* Base */}
      <rect width="1024" height="1536" fill="url(#ng-bg)" />
      <rect width="1024" height="800" fill="url(#ng-glow-top)" />
      <rect
        width="1024"
        height="1100"
        fill="url(#ng-mesh)"
        opacity=".07"
        mask="url(#ng-mesh-mask)"
      />

      {/* Two slanted hairlines, a quiet racing-stripe nod */}
      <g stroke={GREEN} strokeWidth="1.2" opacity=".22" fill="none">
        <path d="M760 44 L980 330" />
        <path d="M800 44 L980 278" />
      </g>

      {/* Sparse speed lines */}
      {STREAKS.map((s, i) => (
        <g
          key={i}
          className="ng-moving"
          transform={`translate(0 ${s.y})`}
          opacity=".35"
        >
          <g
            className={s.dir === "left" ? "ng-left" : "ng-right"}
            style={{
              animationDuration: `${s.dur}s`,
              animationDelay: `${s.delay}s`,
            }}
          >
            <rect
              x="0"
              y="0"
              width={s.len}
              height="1.5"
              fill="url(#ng-trail)"
              transform={
                s.dir === "left"
                  ? `translate(${s.len} 0) scale(-1 1)`
                  : undefined
              }
            />
          </g>
        </g>
      ))}

      {/* Horizon glow */}
      <rect
        y={HORIZON - 160}
        width="1024"
        height="160"
        fill="url(#ng-horizon)"
      />
      <rect
        className="ng-pulse"
        x="60"
        y={HORIZON - 1}
        width="904"
        height="2"
        fill="url(#ng-hline)"
      />

      {/* Perspective grid floor */}
      <g mask="url(#ng-floor-mask)" stroke={GREEN} fill="none">
        {H_LINES.map((y, i) => (
          <path key={i} d={`M0 ${y} H1024`} strokeWidth="1" opacity=".28" />
        ))}
        {V_LINES.map((dx, i) => (
          <path
            key={i}
            d={`M${VP_X} ${HORIZON} L${VP_X + dx * 3.2} ${BOTTOM}`}
            strokeWidth="1"
            opacity=".22"
          />
        ))}
      </g>

      {/* Angular corner brackets */}
      <g
        stroke={GREEN}
        strokeWidth="3"
        fill="none"
        strokeLinecap="square"
        opacity=".85"
      >
        <path d="M44 110 V44 H110" />
        <path d="M914 44 H980 V110" />
        <path d="M44 1426 V1492 H110" />
        <path d="M914 1492 H980 V1426" />
      </g>

      {/* Hairline frame */}
      <rect
        x="44"
        y="44"
        width="936"
        height="1448"
        fill="none"
        stroke={GREEN}
        strokeWidth="1"
        opacity=".18"
      />
    </svg>

    {/* Image slider + video in the empty space below the socials */}
    <NgMedia />
  </>
);

export const NeonGarage: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);

export default NeonGarage;
