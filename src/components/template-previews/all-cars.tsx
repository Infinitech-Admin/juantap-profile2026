"use client";

// src/components/template-previews/all-cars.tsx
// All Cars - car trading card in the logo's black, gold and white.
// Photo slider is a "cars for sale" listing (price tag, specs, For sale ribbon),
// with a Buy / Sell / Trade-in strip, and a road with moving lane dashes as the artwork.
// Slug: "all-cars" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
// and in TemplateCard.tsx (PREVIEW_ASPECT).
//
// RESPONSIVE NOTE: everything inside the media section (AcMedia) is sized with
// cqw units. AcMedia is its own size container, so 1cqw = 1% of the media width.
// That makes text, buttons and spacing scale together with the card on every phone.
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Template, User } from "@/types/template";
import { CardShell, type CardTheme } from "./card-kit";

interface Props {
  template?: Template;
  user?: User;
}

const GOLD = "#d9b300"; // logo yellow
const GOLD_SOFT = "#f0cf2e";
const WHITE = "#ffffff";

const THEME: CardTheme = {
  font: "'Poppins', 'Segoe UI', Arial, sans-serif",
  bg: "#000000",
  text: "#ffffff",
  muted: "#b9b29a",
  accent: GOLD,
  accent2: GOLD_SOFT,
  glow: "217,179,0",
  rowBg: "rgba(18,16,8,0.85)",
  rowBorder: "rgba(217,179,0,0.4)",
  panel: "#0d0b04",
  barBg: "rgba(0,0,0,0.92)",
};

// Files live in /public, so they are served from the site root.
const VIDEOS = ["/all-cars/video1.mp4", "/all-cars/video2.mp4"];

// Images in /public/all-cars (car1 to car5). Change the extension if yours is not .jpg
const IMAGES = Array.from({ length: 5 }, (_, i) => `/all-cars/car${i + 1}.jpg`);

// Time each image stays on screen (keep at 2000 or more)
const SLIDE_MS = 3000;

// Shorter than before (was 4 / 3) so the section fits on short phones.
// The real value comes from the --ac-aspect CSS variable (see CSS below),
// so it gets shorter on small screens.
const MEDIA_ASPECT = "var(--ac-aspect, 16 / 10)";

// One listing per image above (same order). CHANGE these to your real cars.
type Listing = {
  name: string;
  price: number; // PHP
  year: number;
  mileage: string;
  trans: string;
  status?: "sale" | "sold";
};
const LISTINGS: Listing[] = [
  {
    name: "Toyota Fortuner 2.4 V",
    price: 1450000,
    year: 2021,
    mileage: "32,000 km",
    trans: "Automatic",
  },
  {
    name: "Honda Civic RS Turbo",
    price: 1090000,
    year: 2020,
    mileage: "41,500 km",
    trans: "CVT",
  },
  {
    name: "Mitsubishi Montero GLS",
    price: 1280000,
    year: 2019,
    mileage: "58,000 km",
    trans: "Automatic",
  },
  {
    name: "Ford Ranger Wildtrak",
    price: 1390000,
    year: 2022,
    mileage: "18,200 km",
    trans: "Automatic",
    status: "sold",
  },
  {
    name: "Toyota Vios XLE",
    price: 620000,
    year: 2020,
    mileage: "36,800 km",
    trans: "Manual",
  },
];

const peso = (n: number) =>
  "\u20B1" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// Panel with the same angled corners as the car-roof swoosh (corner size scales)
const PANEL_STYLE: React.CSSProperties = {
  background: "#000",
  border: `1px solid ${GOLD}`,
  clipPath:
    "polygon(0 0, calc(100% - 4cqw) 0, 100% 4cqw, 100% 100%, 4cqw 100%, 0 calc(100% - 4cqw))",
};

const CSS = `
@keyframes ac-fade  { from { opacity: 0; } to { opacity: 1; } }
@keyframes ac-lane  { to { stroke-dashoffset: -120; } }
.ac-lane { animation: ac-lane 1.6s linear infinite; }
.ac-stack { animation: ac-fade .8s ease .3s both; }
.ac-slide { transition: opacity .7s ease; }

/* Compact mode: smaller screens get a shorter photo/video panel */
.ac-stack { --ac-aspect: 16 / 10; }
@media (max-width: 400px), (max-height: 760px) {
  .ac-stack { --ac-aspect: 2 / 1; }
}

@media (prefers-reduced-motion: reduce) {
  .ac-lane, .ac-stack { animation: none; }
  .ac-slide { transition: none; }
}
`;

// Road at the bottom: vanishing point and lane lines
const ROAD_TOP = 1180;
const ROAD_BOTTOM = 1536;
const VP_X = 512;

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
      className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full text-white transition hover:scale-110 hover:bg-yellow-600"
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
      style={{ zIndex: 9999, background: "rgba(0,0,0,0.94)" }}
    >
      <img
        src={IMAGES[index]}
        alt=""
        draggable={false}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[88vh] max-w-[94vw] object-contain rounded-lg"
        style={{ boxShadow: "0 0 0 2px rgba(217,179,0,0.8)" }}
      />

      <button
        type="button"
        aria-label="Close"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 flex items-center justify-center rounded-full text-white hover:bg-yellow-600 transition"
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

      {LISTINGS[index] && (
        <div
          className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full px-4 py-1.5 text-sm font-bold text-black"
          style={{ background: GOLD, maxWidth: "70vw" }}
          onClick={(e) => e.stopPropagation()}
        >
          {LISTINGS[index].name} · {peso(LISTINGS[index].price)}
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

/** Corner ribbon: For sale (gold) or Sold (white). */
const Ribbon = ({ status = "sale" }: { status?: "sale" | "sold" }) => (
  <span
    className="absolute left-0 font-extrabold"
    style={{
      top: "3.5cqw",
      fontSize: "3.2cqw",
      lineHeight: 1.3,
      padding: "0.6cqw 4cqw 0.6cqw 3.5cqw",
      background: status === "sold" ? WHITE : GOLD,
      color: "#000",
      clipPath:
        "polygon(0 0, 100% 0, calc(100% - 2.3cqw) 50%, 100% 100%, 0 100%)",
    }}
  >
    {status === "sold" ? "Sold" : "For sale"}
  </span>
);

/** Name, spec chips and price shown over the photo. */
const ListingCaption = ({ item }: { item?: Listing }) => {
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
          className="truncate font-bold text-white"
          style={{ fontSize: "3.5cqw", lineHeight: 1.25 }}
        >
          {item.name}
        </p>
        <p
          className="truncate"
          style={{ fontSize: "2.9cqw", lineHeight: 1.25, color: "#d6cfb4" }}
        >
          {item.year} · {item.mileage} · {item.trans}
        </p>
      </div>
      <span
        className="shrink-0 font-extrabold"
        style={{
          fontSize: "3.8cqw",
          lineHeight: 1.2,
          padding: "0.6cqw 2.3cqw",
          borderRadius: "1.2cqw",
          background: GOLD,
          color: "#000",
        }}
      >
        {peso(item.price)}
      </span>
    </div>
  );
};

/** Auto-advancing listing slider with a crossfade, clickable dots and a full-size viewer. */
const AcSlider = ({ aspect = MEDIA_ASPECT }: { aspect?: string }) => {
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

  const item = LISTINGS[index];

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
            alt={LISTINGS[i]?.name ?? ""}
            draggable={false}
            loading={i === 0 ? "eager" : "lazy"}
            className="ac-slide absolute inset-0 w-full h-full object-cover"
            style={{ opacity: i === index ? 1 : 0 }}
          />
        ))}

        <Ribbon status={item?.status} />
        <ListingCaption item={item} />

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
                  background: i === index ? GOLD : "rgba(255,255,255,0.6)",
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
const AcVideo = ({ aspect = MEDIA_ASPECT }: { aspect?: string }) => {
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

/** One compact panel under the socials. Tabs switch between photos and videos. */
const AcMedia = () => {
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
        borderRadius: 999,
        background: tab === id ? GOLD : "rgba(18,16,8,0.9)",
        color: tab === id ? "#000" : "#b9b29a",
        border: `1px solid ${tab === id ? GOLD : "rgba(217,179,0,0.4)"}`,
      }}
    >
      {label}
    </button>
  );

  return (
    <div
      className="ac-stack flex flex-col"
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
        {tabBtn("photos", "Cars for sale")}
        {tabBtn("videos", "Walkarounds")}
      </div>

      {/* Only one is mounted at a time, so the video stops when you switch tabs */}
      {tab === "photos" ? <AcSlider /> : <AcVideo />}

      {/* What the dealer does */}
      <div className="ac-chips grid grid-cols-3" style={{ gap: "1.75cqw" }}>
        {["Buy", "Sell", "Trade-in"].map((t) => (
          <span
            key={t}
            className="text-center font-bold"
            style={{
              fontSize: "3.2cqw",
              lineHeight: 1.3,
              padding: "1.2cqw 0",
              borderRadius: "1.75cqw",
              color: GOLD,
              border: "1px solid rgba(217,179,0,0.4)",
              background: "rgba(18,16,8,0.85)",
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
};

/**
 * Background artwork. The two filled shapes are the logo's car-roofline swooshes
 * (gold roof, white hood), kept dim behind the content, above a road with moving lane dashes.
 * Logo coordinates are 2048 wide, so the group is scaled to fit the 1024 canvas.
 */
const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >
    <defs>
      <linearGradient id="ac-gold-fade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={GOLD} stopOpacity="0" />
        <stop offset=".5" stopColor={GOLD} stopOpacity=".9" />
        <stop offset="1" stopColor={GOLD} stopOpacity="0" />
      </linearGradient>
      <radialGradient id="ac-glow" cx=".5" cy="0" r=".8">
        <stop offset="0" stopColor={GOLD} stopOpacity=".12" />
        <stop offset="1" stopColor={GOLD} stopOpacity="0" />
      </radialGradient>
      <linearGradient id="ac-road-fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset=".35" stopColor="#fff" stopOpacity="1" />
        <stop offset="1" stopColor="#fff" stopOpacity="1" />
      </linearGradient>
      <mask id="ac-road-mask">
        <rect
          y={ROAD_TOP}
          width="1024"
          height={ROAD_BOTTOM - ROAD_TOP}
          fill="url(#ac-road-fade)"
        />
      </mask>
    </defs>

    {/* Base */}
    <rect width="1024" height="1536" fill="#000" />
    <rect width="1024" height="900" fill="url(#ac-glow)" />

    {/* Logo swooshes, dim, behind the media panel */}
    <g transform="translate(-40 700) scale(.55)" opacity=".1">
      <path
        fill={GOLD}
        d="M195 900 L295 590 C320 520 360 495 420 490 L945 465 C1050 455 1170 540 1240 690 L560 688 C700 678 1000 670 1140 658 C1125 600 1060 515 965 510 L490 522 C390 535 345 590 320 640 Z"
      />
      <path
        fill={WHITE}
        d="M1240 690 C1330 678 1450 668 1520 672 C1650 680 1740 770 1745 900 L1450 900 C1400 860 1370 825 1340 805 C1300 790 1250 790 1200 790 C1050 788 950 790 830 786 C1000 775 1150 765 1250 760 C1310 755 1340 765 1370 785 C1400 815 1430 855 1450 887 L1680 857 C1670 770 1620 710 1520 697 C1430 690 1330 692 1240 692 Z"
      />
    </g>

    {/* Price-tag ribbon, top right */}
    <g opacity=".9">
      <path d="M700 44 H980 V210 Z" fill={GOLD} opacity=".14" />
      <path d="M760 44 L980 270" stroke={GOLD} strokeWidth="1.5" opacity=".5" />
    </g>

    {/* Road: asphalt, edge lines and a dashed centre line that moves toward the viewer */}
    <g mask="url(#ac-road-mask)">
      <path
        d={`M${VP_X - 40} ${ROAD_TOP} L${VP_X + 40} ${ROAD_TOP} L1120 ${ROAD_BOTTOM} L-96 ${ROAD_BOTTOM} Z`}
        fill="#0b0a05"
      />
      <path
        d={`M${VP_X - 40} ${ROAD_TOP} L-96 ${ROAD_BOTTOM}`}
        stroke={WHITE}
        strokeWidth="2"
        opacity=".5"
      />
      <path
        d={`M${VP_X + 40} ${ROAD_TOP} L1120 ${ROAD_BOTTOM}`}
        stroke={WHITE}
        strokeWidth="2"
        opacity=".5"
      />
      <path
        className="ac-lane"
        d={`M${VP_X} ${ROAD_TOP} L${VP_X} ${ROAD_BOTTOM}`}
        stroke={GOLD}
        strokeWidth="8"
        strokeDasharray="60 60"
        opacity=".85"
      />
    </g>
    <rect y={ROAD_TOP - 1} width="1024" height="2" fill="url(#ac-gold-fade)" />

    {/* Angular corner brackets, gold top-left/bottom-right, white the other two */}
    <g strokeWidth="3" fill="none" strokeLinecap="square">
      <path d="M44 110 V44 H110" stroke={GOLD} />
      <path d="M914 44 H980 V110" stroke={WHITE} opacity=".7" />
      <path d="M44 1426 V1492 H110" stroke={WHITE} opacity=".7" />
      <path d="M914 1492 H980 V1426" stroke={GOLD} />
    </g>

    {/* Hairline frame */}
    <rect
      x="44"
      y="44"
      width="936"
      height="1448"
      fill="none"
      stroke={GOLD}
      strokeWidth="1"
      opacity=".2"
    />
  </svg>
);

export const AllCars: React.FC<Props> = ({ user }) => (
  <CardShell
    user={user}
    theme={THEME}
    artwork={<Artwork />}
    artworkCss={CSS}
    afterSocials={<AcMedia />}
    fitContent
  />
);

export default AllCars;
