"use client";

// src/components/template-previews/auto-prime.tsx
// Auto Prime - Black, white and red car trading card with an image slider and a video at the bottom (free)
// Slug: "auto-prime" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
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

// Put your images in /public/images (rename or add more here, any count works)
const IMAGES = ["/images/car1.jpg", "/images/car2.jpg", "/images/car3.jpg"];

// Time each image stays on screen (keep at 2000 or more)
const SLIDE_MS = 3000;

const PANEL_STYLE: React.CSSProperties = {
  background: "#000",
  border: "1px solid rgba(225,29,46,0.6)",
  boxShadow: "0 0 24px rgba(225,29,46,0.25)",
};

const CSS = `
@keyframes ap-fade { from { opacity: 0; } to { opacity: 1; } }
.ap-stack { animation: ap-fade .8s ease .4s both; }
.ap-slide { transition: opacity .7s ease; }
@media (prefers-reduced-motion: reduce) {
  .ap-stack { animation: none; }
  .ap-slide { transition: none; }
}
`;

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
        style={{ boxShadow: "0 0 40px rgba(225,29,46,0.35)" }}
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
const ApSlider = () => {
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
            className="ap-slide absolute inset-0 w-full h-full object-cover"
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
                  background: i === index ? RED : "rgba(255,255,255,0.6)",
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
const ApMedia = () => (
  <div
    className="ap-stack absolute flex flex-col gap-2"
    style={{
      left: "13%",
      right: "13%",
      bottom: "9%",
      // sit above the card content layer and receive clicks even if the artwork layer ignores them
      zIndex: 30,
      pointerEvents: "auto",
    }}
  >
    <ApSlider />
    <ApVideo />
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

    {/* Image slider + video in the empty space below the socials */}
    <ApMedia />
  </>
);

export const AutoPrime: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);

export default AutoPrime;
