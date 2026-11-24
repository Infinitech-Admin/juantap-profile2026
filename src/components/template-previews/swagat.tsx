"use client";

// src/components/template-previews/swagat.tsx
// Swagat - Indian restaurant card in the website's charcoal, saffron-orange and cream.
// Photo slider is a "signature dishes" menu (price tag, spice level, veg / non-veg mark,
// Chef's pick ribbon), with a Dine-in / Takeaway / Catering strip. The artwork is a row of
// warm lit arches (like the dining room) with softly glowing pendant lamps.
// Slug: "swagat" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
// and in TemplateCard.tsx (PREVIEW_ASPECT).
//
// RESPONSIVE NOTE: everything inside the media section (SwMedia) is sized with
// cqw units. SwMedia is its own size container, so 1cqw = 1% of the media width.
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

// Colours taken from the Swagat website
const BG = "#0f0e0d"; // charcoal
const ORANGE = "#ff9800"; // saffron / CTA orange
const ORANGE_SOFT = "#ffb133";
const CREAM = "#f2efe6"; // headline cream
const MUTED = "#b8afa0";
const VEG = "#3fa34d";
const NONVEG = "#d8452f";

const SERIF = "'Lora', 'Playfair Display', Georgia, 'Times New Roman', serif";

const THEME: CardTheme = {
  font: "'Inter', 'Segoe UI', Arial, sans-serif",
  bg: BG,
  text: CREAM,
  muted: MUTED,
  accent: ORANGE,
  accent2: ORANGE_SOFT,
  glow: "255,152,0",
  rowBg: "rgba(24,20,15,0.85)",
  rowBorder: "rgba(255,152,0,0.4)",
  panel: "#151210",
  barBg: "rgba(10,9,8,0.92)",
};

// Files live in /public, so they are served from the site root.
const VIDEOS = ["/swagat/video1.mp4", "/swagat/video2.mp4"];

// Images in /public/swagat (dish1 to dish5). Change the extension if yours is not .jpg
const IMAGES = Array.from({ length: 5 }, (_, i) => `/swagat/dish${i + 1}.jpg`);

// Time each image stays on screen (keep at 2000 or more)
const SLIDE_MS = 3000;

// The real value comes from the --sw-aspect CSS variable (see CSS below),
// so it gets shorter on small screens.
const MEDIA_ASPECT = "var(--sw-aspect, 16 / 10)";

// One dish per image above (same order). CHANGE these to your real menu.
type Dish = {
  name: string;
  price: number; // PHP
  note: string;
  spice: 0 | 1 | 2 | 3; // 0 = mild, 3 = hot
  veg: boolean;
  tag?: string; // ribbon text, e.g. "Chef's pick"
  soldOut?: boolean;
};
const DISHES: Dish[] = [
  {
    name: "Butter Chicken",
    price: 420,
    note: "Tandoori chicken, tomato and cream",
    spice: 1,
    veg: false,
    tag: "Chef's pick",
  },
  {
    name: "Paneer Tikka",
    price: 360,
    note: "Clay-oven cottage cheese, mint chutney",
    spice: 2,
    veg: true,
    tag: "Bestseller",
  },
  {
    name: "Lamb Biryani",
    price: 520,
    note: "Dum-cooked basmati, saffron, raita",
    spice: 2,
    veg: false,
  },
  {
    name: "Dal Makhani",
    price: 310,
    note: "Black lentils, slow-simmered overnight",
    spice: 0,
    veg: true,
  },
  {
    name: "Gulab Jamun",
    price: 190,
    note: "Warm milk dumplings in rose syrup",
    spice: 0,
    veg: true,
    tag: "New",
  },
];

const peso = (n: number) =>
  "\u20B1" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// Sharp-cornered panel with a thin orange outline, like the site's buttons
const PANEL_STYLE: React.CSSProperties = {
  background: "#000",
  border: `1px solid ${ORANGE}`,
};

const CSS = `
@keyframes sw-fade  { from { opacity: 0; } to { opacity: 1; } }
@keyframes sw-lamp  { 0%, 100% { opacity: .55; } 50% { opacity: 1; } }
@keyframes sw-arch  { 0%, 100% { opacity: .55; } 50% { opacity: .9; } }
.sw-lamp { animation: sw-lamp 3.2s ease-in-out infinite; }
.sw-lamp-2 { animation-delay: .9s; }
.sw-lamp-3 { animation-delay: 1.8s; }
.sw-arch { animation: sw-arch 5s ease-in-out infinite; }
.sw-stack { animation: sw-fade .8s ease .3s both; }
.sw-slide { transition: opacity .7s ease; }

/* Compact mode: smaller screens get a shorter photo/video panel */
.sw-stack { --sw-aspect: 16 / 10; }
@media (max-width: 400px), (max-height: 760px) {
  .sw-stack { --sw-aspect: 2 / 1; }
}

@media (prefers-reduced-motion: reduce) {
  .sw-lamp, .sw-arch, .sw-stack { animation: none; }
  .sw-slide { transition: none; }
}
`;

// Arches along the bottom of the artwork
const ARCH_BASE = 1500;
const ARCH_TOP = 1230;
const ARCH_COUNT = 5;
const ARCH_W = 1024 / ARCH_COUNT;

/**
 * Round chevron button used for previous / next.
 * inCard: sizes scale with the card (cqw). Otherwise fixed px (full-screen viewer,
 * which is rendered in a portal outside the card).
 */
const ArrowButton = ({
  dir,
  onClick,
  inCard = false,
}: {
  dir: "prev" | "next";
  onClick: () => void;
  inCard?: boolean;
}) => {
  const size = inCard ? "max(8cqw, 24px)" : "40px";
  const edge = inCard ? "2.3cqw" : "12px";

  return (
    <button
      type="button"
      aria-label={dir === "next" ? "Next" : "Previous"}
      onClick={(e) => {
        e.stopPropagation(); // do not toggle play/pause or close the viewer
        onClick();
      }}
      className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full text-white transition hover:scale-110 hover:bg-orange-500"
      style={{
        width: size,
        height: size,
        [dir === "next" ? "right" : "left"]: edge,
        background: "rgba(0,0,0,0.6)",
        border: "1px solid rgba(255,255,255,0.35)",
        backdropFilter: "blur(4px)",
      }}
    >
      <svg
        width="55%"
        height="55%"
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
};

/** Little chilli-dot meter: filled dots = spice level. */
const Spice = ({
  level,
  fixed = false,
}: {
  level: number;
  fixed?: boolean;
}) => {
  if (level === 0) return <span>Mild</span>;
  const dot = fixed ? 8 : "1.8cqw";
  return (
    <span
      className="inline-flex items-center"
      style={{ gap: fixed ? 4 : "0.8cqw" }}
    >
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          style={{
            width: dot,
            height: dot,
            borderRadius: 999,
            background: n <= level ? ORANGE : "rgba(255,255,255,0.25)",
          }}
        />
      ))}
    </span>
  );
};

/** Veg / non-veg square mark (green or red), as used on Indian menus. */
const DietMark = ({ veg, size }: { veg: boolean; size: string | number }) => (
  <span
    aria-label={veg ? "Vegetarian" : "Non-vegetarian"}
    className="inline-flex shrink-0 items-center justify-center"
    style={{
      width: size,
      height: size,
      border: `1.5px solid ${veg ? VEG : NONVEG}`,
      background: CREAM,
    }}
  >
    <span
      style={{
        width: "50%",
        height: "50%",
        borderRadius: 999,
        background: veg ? VEG : NONVEG,
      }}
    />
  </span>
);

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

  const dish = DISHES[index];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={onClose}
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 9999, background: "rgba(0,0,0,0.94)" }}
    >
      <img
        src={IMAGES[index]}
        alt={dish?.name ?? ""}
        draggable={false}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[88vh] max-w-[94vw] object-contain"
        style={{ boxShadow: "0 0 0 2px rgba(255,152,0,0.8)" }}
      />

      <button
        type="button"
        aria-label="Close"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 flex items-center justify-center rounded-full text-white hover:bg-orange-500 transition"
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

      {dish && (
        <div
          className="absolute left-1/2 top-4 flex -translate-x-1/2 items-center gap-2 px-4 py-1.5 text-sm font-bold text-black"
          style={{ background: ORANGE, maxWidth: "70vw" }}
          onClick={(e) => e.stopPropagation()}
        >
          <DietMark veg={dish.veg} size={14} />
          <span className="truncate">
            {dish.name} · {peso(dish.price)}
          </span>
        </div>
      )}

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

/** Corner ribbon: Chef's pick / Bestseller / New (orange) or Sold out (cream). */
const Ribbon = ({ dish }: { dish?: Dish }) => {
  const label = dish?.soldOut ? "Sold out" : dish?.tag;
  if (!label) return null;
  return (
    <span
      className="absolute left-0 font-extrabold"
      style={{
        top: "3.5cqw",
        fontSize: "3.2cqw",
        lineHeight: 1.3,
        padding: "0.6cqw 4cqw 0.6cqw 3.5cqw",
        background: dish?.soldOut ? CREAM : ORANGE,
        color: "#000",
        clipPath:
          "polygon(0 0, 100% 0, calc(100% - 2.3cqw) 50%, 100% 100%, 0 100%)",
      }}
    >
      {label}
    </span>
  );
};

/** Dish name, short note, spice level and price shown over the photo. */
const DishCaption = ({ item }: { item?: Dish }) => {
  if (!item) return null;
  return (
    <div
      className="absolute inset-x-0 bottom-0 flex items-end justify-between"
      style={{
        gap: "2.3cqw",
        padding: "9cqw 3.5cqw 6cqw",
        background:
          "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0) 100%)",
      }}
    >
      <div className="min-w-0">
        <p
          className="flex items-center font-bold"
          style={{
            gap: "1.8cqw",
            fontFamily: SERIF,
            fontSize: "4cqw",
            lineHeight: 1.25,
            color: CREAM,
          }}
        >
          <DietMark veg={item.veg} size="3.2cqw" />
          <span className="truncate">{item.name}</span>
        </p>
        <p
          className="flex items-center"
          style={{
            gap: "1.8cqw",
            fontSize: "2.9cqw",
            lineHeight: 1.3,
            color: "#d9d2c0",
          }}
        >
          <span className="truncate">{item.note}</span>
          <Spice level={item.spice} />
        </p>
      </div>
      <span
        className="shrink-0 font-extrabold"
        style={{
          fontSize: "3.8cqw",
          lineHeight: 1.2,
          padding: "0.6cqw 2.3cqw",
          background: ORANGE,
          color: "#000",
        }}
      >
        {peso(item.price)}
      </span>
    </div>
  );
};

/** Auto-advancing dish slider with a crossfade, clickable dots and a full-size viewer. */
const SwSlider = ({ aspect = MEDIA_ASPECT }: { aspect?: string }) => {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const next = () => setIndex((n) => (n + 1) % IMAGES.length);
  const prev = () => setIndex((n) => (n - 1 + IMAGES.length) % IMAGES.length);

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

  const item = DISHES[index];

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
        className="relative w-full overflow-hidden pointer-events-auto cursor-zoom-in"
        style={{ ...PANEL_STYLE, aspectRatio: aspect }}
      >
        {IMAGES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={DISHES[i]?.name ?? ""}
            draggable={false}
            loading={i === 0 ? "eager" : "lazy"}
            className="sw-slide absolute inset-0 w-full h-full object-cover"
            style={{ opacity: i === index ? 1 : 0 }}
          />
        ))}

        <Ribbon dish={item} />
        <DishCaption item={item} />

        {IMAGES.length > 1 && (
          <>
            <ArrowButton dir="prev" onClick={prev} inCard />
            <ArrowButton dir="next" onClick={next} inCard />
          </>
        )}

        {IMAGES.length > 1 && (
          <div
            className="absolute left-0 right-0 flex justify-center"
            style={{ bottom: "2cqw", gap: "1.75cqw" }}
          >
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
                  width: i === index ? "5.2cqw" : "1.75cqw",
                  height: "1.75cqw",
                  minHeight: 4,
                  background: i === index ? ORANGE : "rgba(255,255,255,0.6)",
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

/** Plays video1 then video2, then loops back to video1. */
const SwVideo = ({ aspect = MEDIA_ASPECT }: { aspect?: string }) => {
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
      className="relative w-full overflow-hidden"
      style={{ ...PANEL_STYLE, aspectRatio: aspect }}
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
          if (v.paused) v.play();
          else v.pause();
        }}
        className="w-full h-full object-cover cursor-pointer"
      />

      {VIDEOS.length > 1 && (
        <>
          <ArrowButton dir="prev" onClick={prev} inCard />
          <ArrowButton dir="next" onClick={next} inCard />
          <span
            className="absolute font-semibold text-white"
            style={{
              bottom: "2cqw",
              right: "3.5cqw",
              fontSize: "2.9cqw",
              padding: "0.6cqw 2.3cqw",
              borderRadius: 999,
              background: "rgba(0,0,0,0.55)",
            }}
          >
            {index + 1} / {VIDEOS.length}
          </span>
        </>
      )}
    </div>
  );
};

/** One compact panel under the socials. Tabs switch between dishes and videos. */
const SwMedia = () => {
  const [tab, setTab] = useState<"photos" | "videos">("photos");

  const tabBtn = (id: "photos" | "videos", label: string) => (
    <button
      type="button"
      onClick={() => setTab(id)}
      aria-pressed={tab === id}
      className="flex-1 font-bold transition"
      style={{
        fontSize: "3.2cqw",
        lineHeight: 1.3,
        padding: "1.2cqw 0",
        letterSpacing: "0.08em",
        background: tab === id ? ORANGE : "rgba(24,20,15,0.9)",
        color: tab === id ? "#000" : MUTED,
        border: `1px solid ${tab === id ? ORANGE : "rgba(255,152,0,0.4)"}`,
      }}
    >
      {label}
    </button>
  );

  return (
    <div
      className="sw-stack flex flex-col"
      style={
        {
          width: "86%",
          maxWidth: "100%",
          alignSelf: "center",
          // Own size container: all cqw units inside are relative to THIS width,
          // so the section scales with the card on every phone.
          containerType: "inline-size",
          gap: "1.75cqw",
          marginTop: "3cqw",
          pointerEvents: "auto",
        } as React.CSSProperties
      }
    >
      <div className="flex" style={{ gap: "2.3cqw" }}>
        {tabBtn("photos", "Our dishes")}
        {tabBtn("videos", "The room")}
      </div>

      {/* Only one is mounted at a time, so the video stops when you switch tabs */}
      {tab === "photos" ? <SwSlider /> : <SwVideo />}

      {/* How guests can enjoy Swagat */}
      <div className="grid grid-cols-3" style={{ gap: "1.75cqw" }}>
        {["Dine-in", "Takeaway", "Catering"].map((t) => (
          <span
            key={t}
            className="text-center font-bold"
            style={{
              fontSize: "3.2cqw",
              lineHeight: 1.3,
              padding: "1.2cqw 0",
              letterSpacing: "0.08em",
              color: ORANGE,
              border: "1px solid rgba(255,152,0,0.4)",
              background: "rgba(24,20,15,0.85)",
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
};

/** A pointed-top arch path (Mughal style) between x0 and x1. */
const archPath = (x0: number, x1: number) => {
  const mid = (x0 + x1) / 2;
  const shoulder = ARCH_TOP + (x1 - x0) * 0.55;
  return `M${x0} ${ARCH_BASE} V${shoulder} C${x0} ${shoulder - 110} ${mid - 30} ${ARCH_TOP + 50} ${mid} ${ARCH_TOP} C${mid + 30} ${ARCH_TOP + 50} ${x1} ${shoulder - 110} ${x1} ${shoulder} V${ARCH_BASE}`;
};

/**
 * Background artwork: a charcoal base with a warm saffron glow, three pendant lamps that
 * pulse softly at the top, and a row of arches along the bottom (the dining room's arches).
 */
const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >
    <defs>
      <radialGradient id="sw-glow" cx=".5" cy="0" r=".85">
        <stop offset="0" stopColor={ORANGE} stopOpacity=".16" />
        <stop offset="1" stopColor={ORANGE} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="sw-lamp-glow" cx=".5" cy=".5" r=".5">
        <stop offset="0" stopColor={ORANGE_SOFT} stopOpacity=".55" />
        <stop offset="1" stopColor={ORANGE} stopOpacity="0" />
      </radialGradient>
      <linearGradient id="sw-arch-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={ORANGE} stopOpacity=".2" />
        <stop offset="1" stopColor={ORANGE} stopOpacity="0" />
      </linearGradient>
      <linearGradient id="sw-line-fade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={ORANGE} stopOpacity="0" />
        <stop offset=".5" stopColor={ORANGE} stopOpacity=".9" />
        <stop offset="1" stopColor={ORANGE} stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* Base */}
    <rect width="1024" height="1536" fill={BG} />
    <rect width="1024" height="900" fill="url(#sw-glow)" />

    {/* Pendant lamps */}
    {[
      { x: 220, y: 150, cls: "sw-lamp" },
      { x: 512, y: 110, cls: "sw-lamp sw-lamp-2" },
      { x: 804, y: 160, cls: "sw-lamp sw-lamp-3" },
    ].map((l) => (
      <g key={l.x} className={l.cls}>
        <line
          x1={l.x}
          y1="0"
          x2={l.x}
          y2={l.y}
          stroke={ORANGE}
          strokeWidth="1.5"
          opacity=".5"
        />
        <circle cx={l.x} cy={l.y + 28} r="70" fill="url(#sw-lamp-glow)" />
        <path
          d={`M${l.x - 22} ${l.y + 36} Q${l.x - 22} ${l.y} ${l.x} ${l.y} Q${l.x + 22} ${l.y} ${l.x + 22} ${l.y + 36} Z`}
          fill={ORANGE}
          opacity=".85"
        />
      </g>
    ))}

    {/* Arches along the bottom */}
    <g>
      {Array.from({ length: ARCH_COUNT }, (_, i) => {
        const x0 = i * ARCH_W + 14;
        const x1 = (i + 1) * ARCH_W - 14;
        return (
          <g
            key={i}
            className="sw-arch"
            style={{ animationDelay: `${i * 0.7}s` }}
          >
            <path d={archPath(x0, x1)} fill="url(#sw-arch-fill)" />
            <path
              d={archPath(x0, x1)}
              fill="none"
              stroke={ORANGE}
              strokeWidth="2"
              opacity=".65"
            />
            <path
              d={archPath(x0 + 22, x1 - 22)}
              fill="none"
              stroke={CREAM}
              strokeWidth="1"
              opacity=".25"
            />
          </g>
        );
      })}
    </g>
    <rect y={ARCH_BASE - 1} width="1024" height="2" fill="url(#sw-line-fade)" />

    {/* Angular corner brackets, orange top-left/bottom-right, cream the other two */}
    <g strokeWidth="3" fill="none" strokeLinecap="square">
      <path d="M44 110 V44 H110" stroke={ORANGE} />
      <path d="M914 44 H980 V110" stroke={CREAM} opacity=".7" />
      <path d="M44 1426 V1492 H110" stroke={CREAM} opacity=".7" />
      <path d="M914 1492 H980 V1426" stroke={ORANGE} />
    </g>

    {/* Hairline frame */}
    <rect
      x="44"
      y="44"
      width="936"
      height="1448"
      fill="none"
      stroke={ORANGE}
      strokeWidth="1"
      opacity=".2"
    />
  </svg>
);

export const Swagat: React.FC<Props> = ({ user }) => (
  <CardShell
    user={user}
    theme={THEME}
    artwork={<Artwork />}
    artworkCss={CSS}
    afterSocials={<SwMedia />}
    fitContent
  />
);

export default Swagat;
