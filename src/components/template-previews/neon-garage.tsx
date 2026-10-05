"use client";

// src/components/template-previews/neon-garage.tsx
// Neon Garage - Dark automotive look in neon green: hex-mesh texture, night skyline, sleek line-art cars and speed streaks (premium)
// Slug: "neon-garage" - register in src/lib/template-data.ts (TEMPLATE_COMPONENTS)
// and in TemplateCard.tsx (PREVIEW_ASPECT).
import React from "react";
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
const LIME = "#b6ff3b";

const CSS = `
@keyframes ng-right { from { translate: -260px 0; } to { translate: 1300px 0; } }
@keyframes ng-left  { from { translate: 1300px 0; } to { translate: -260px 0; } }
@keyframes ng-lane  { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -140; } }
@keyframes ng-pulse { 0%,100% { opacity: .35; } 50% { opacity: .8; } }
@keyframes ng-glint { 0%,100% { opacity: .15; translate: 0 0; } 50% { opacity: .7; translate: 20px 0; } }
.ng-right { animation: ng-right linear infinite; }
.ng-left  { animation: ng-left linear infinite; }
.ng-lane  { animation: ng-lane 1s linear infinite; }
.ng-pulse { animation: ng-pulse 5s ease-in-out infinite; }
.ng-glint { animation: ng-glint 5s ease-in-out infinite; }
.ng-car { filter: drop-shadow(0 0 4px currentColor); }
@media (prefers-reduced-motion: reduce) {
  .ng-right, .ng-left, .ng-lane, .ng-pulse, .ng-glint { animation: none; }
  .ng-moving { display: none; }
}
`;

// Skyline silhouettes: [x, width, top]
const SKYLINE: [number, number, number][] = [
  [0, 120, 900],
  [110, 90, 820],
  [190, 130, 950],
  [310, 100, 860],
  [400, 140, 980],
  [530, 90, 840],
  [610, 130, 920],
  [730, 100, 810],
  [820, 110, 950],
  [920, 104, 870],
];

const WINDOWS = SKYLINE.flatMap(([x, w, top], b) =>
  Array.from({ length: 5 }, (_, k) => ({
    x: x + 14 + ((k * 29 + b * 13) % Math.max(20, w - 30)),
    y: top + 30 + ((k * 53 + b * 17) % 180),
    o: 0.15 + ((b + k) % 4) * 0.1,
  })),
);

// Cars drive across at varied heights, speeds and directions (deterministic, so SSR matches the client)
const CARS = Array.from({ length: 7 }, (_, i) => ({
  y: 120 + ((i * 397) % 1250),
  dir: (i * 5) % 3 === 0 ? "left" : "right",
  dur: 9 + ((i * 5) % 10),
  delay: -((i * 29) % 19),
  scale: 0.6 + (i % 3) * 0.25,
  opacity: 0.35 + (i % 3) * 0.2,
}));

// Thin speed streaks
const STREAKS = Array.from({ length: 8 }, (_, i) => ({
  y: 80 + ((i * 211) % 1400),
  len: 120 + ((i * 53) % 200),
  dir: i % 2 ? "left" : "right",
  dur: 3 + ((i * 3) % 5),
  delay: -((i * 13) % 9),
}));

const Artwork = () => (
  <svg
    viewBox="0 0 1024 1536"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >
    <defs>
      <linearGradient id="ng-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#040b07" />
        <stop offset=".55" stopColor="#06140c" />
        <stop offset="1" stopColor="#020604" />
      </linearGradient>
      <radialGradient id="ng-glow-top" cx=".5" cy="0" r=".7">
        <stop offset="0" stopColor={GREEN} stopOpacity=".18" />
        <stop offset="1" stopColor={GREEN} stopOpacity="0" />
      </radialGradient>
      <linearGradient id="ng-horizon" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={GREEN} stopOpacity="0" />
        <stop offset="1" stopColor={GREEN} stopOpacity=".28" />
      </linearGradient>
      <linearGradient id="ng-road" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#07140c" />
        <stop offset="1" stopColor="#020604" />
      </linearGradient>
      <linearGradient id="ng-fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="1" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <mask id="ng-mesh-mask">
        <rect width="1024" height="1000" fill="url(#ng-fade)" />
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
        <stop offset="0" stopColor="currentColor" stopOpacity="0" />
        <stop offset="1" stopColor="currentColor" stopOpacity=".9" />
      </linearGradient>

      {/* Sleek line-art sports car, faces right. Colour from currentColor */}
      <symbol id="ng-icon" viewBox="0 0 160 40" overflow="visible">
        <path
          d="M4 31 L10 25 L50 19 L74 6 Q78 4 84 4 H108 L136 18 L154 23 Q158 25 158 29 V31 Z"
          fill="currentColor"
          fillOpacity=".14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M80 8 H106 L128 18 H64Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M2 14 H30 M2 14 L8 25"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle
          cx="38"
          cy="31"
          r="7"
          fill="#030806"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle
          cx="124"
          cy="31"
          r="7"
          fill="#030806"
          stroke="currentColor"
          strokeWidth="2"
        />
        <rect x="148" y="21" width="9" height="3" rx="1.5" fill="#fff" />
      </symbol>
    </defs>

    {/* Base */}
    <rect width="1024" height="1536" fill="url(#ng-bg)" />
    <rect width="1024" height="800" fill="url(#ng-glow-top)" />
    <rect
      width="1024"
      height="1000"
      fill="url(#ng-mesh)"
      opacity=".1"
      mask="url(#ng-mesh-mask)"
    />

    {/* Skyline */}
    <rect y="800" width="1024" height="380" fill="url(#ng-horizon)" />
    {SKYLINE.map(([x, w, top], i) => (
      <g key={i}>
        <rect
          x={x}
          y={top}
          width={w}
          height={1180 - top}
          fill={i % 2 ? "#071a0f" : "#05110a"}
        />
        <path
          d={`M${x} ${top} H${x + w}`}
          stroke={GREEN}
          strokeWidth="1.5"
          opacity=".5"
        />
      </g>
    ))}
    {WINDOWS.map((w, i) => (
      <rect
        key={i}
        x={w.x}
        y={w.y}
        width="8"
        height="12"
        rx="1.5"
        fill={i % 5 === 0 ? "#fff" : GREEN}
        opacity={w.o}
      />
    ))}

    {/* Road */}
    <rect y="1180" width="1024" height="356" fill="url(#ng-road)" />
    <path d="M0 1180 H1024" stroke={GREEN} strokeWidth="2" opacity=".6" />
    <path
      d="M512 1180 L260 1536 M512 1180 L764 1536"
      stroke={GREEN}
      strokeWidth="1.5"
      opacity=".18"
    />
    <path
      className="ng-lane"
      d="M0 1310 H1024"
      stroke={GREEN}
      strokeWidth="3"
      strokeDasharray="70 70"
      opacity=".4"
    />
    <path
      className="ng-lane"
      d="M0 1430 H1024"
      stroke={LIME}
      strokeWidth="3"
      strokeDasharray="70 70"
      opacity=".25"
    />
    {[140, 360, 580, 800].map((x, i) => (
      <rect
        key={x}
        className="ng-glint"
        style={{ animationDelay: `${i * 0.9}s` }}
        x={x}
        y={1240 + (i % 2) * 80}
        width="90"
        height="2.5"
        rx="1.2"
        fill={GREEN}
      />
    ))}

    {/* Speed streaks */}
    {STREAKS.map((s, i) => (
      <g
        key={i}
        className="ng-moving"
        transform={`translate(0 ${s.y})`}
        opacity=".5"
      >
        <g
          className={s.dir === "left" ? "ng-left" : "ng-right"}
          style={{
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
            color: i % 3 === 0 ? LIME : GREEN,
          }}
        >
          <rect
            x={s.dir === "left" ? 0 : -s.len}
            y="0"
            width={s.len}
            height="2"
            fill="url(#ng-trail)"
            transform={
              s.dir === "left" ? `translate(${s.len} 0) scale(-1 1)` : undefined
            }
          />
        </g>
      </g>
    ))}

    {/* Sleek driving cars */}
    {CARS.map((c, i) => (
      <g
        key={i}
        className="ng-moving"
        transform={`translate(0 ${c.y})`}
        opacity={c.opacity}
      >
        <g
          className={c.dir === "left" ? "ng-left" : "ng-right"}
          style={{
            animationDuration: `${c.dur}s`,
            animationDelay: `${c.delay}s`,
            color: i % 4 === 0 ? LIME : GREEN,
          }}
        >
          <g
            transform={`scale(${c.dir === "left" ? -c.scale : c.scale} ${c.scale})`}
          >
            <rect
              x="-170"
              y="21"
              width="170"
              height="3"
              fill="url(#ng-trail)"
            />
            <rect
              x="-120"
              y="27"
              width="120"
              height="2"
              fill="url(#ng-trail)"
              opacity=".6"
            />
            <g className="ng-car">
              <use href="#ng-icon" width="160" height="40" />
            </g>
          </g>
        </g>
      </g>
    ))}

    {/* Frame */}
    <rect
      x="44"
      y="44"
      width="936"
      height="1448"
      rx="22"
      fill="none"
      stroke={GREEN}
      strokeWidth="1.2"
      opacity=".4"
    />
  </svg>
);

export const NeonGarage: React.FC<Props> = ({ user }) => (
  <CardShell user={user} theme={THEME} artwork={<Artwork />} artworkCss={CSS} />
);

export default NeonGarage;
