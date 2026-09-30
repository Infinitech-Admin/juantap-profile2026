"use client";

// src/components/template-previews/nika.tsx
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
  Music,
  Music4,
  Palette,
  Mic,
} from "lucide-react";
import type { Template, User } from "@/types/template";

interface NikaProps {
  template?: Template;
  user?: User;
}

const MINT = "#ccffaa"; // page background (from logo)
const BLUE = "#0a4fa8"; // "NIKA" wordmark
const INK = "#000000";
const TEAL = "#4cc1b3";
const ORANGE = "#f7941d";
const PINK = "#ee2a7b";
const ROW_BG = "rgba(255,255,255,0.9)";

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

/* Animations. Uses the individual `translate` / `rotate` CSS properties so
   they never clash with the inline `transform` used for base positioning. */
const NIKA_CSS = `
@keyframes nika-sway {
  0%, 100% { rotate: -4deg; }
  50%      { rotate: 4deg; }
}
@keyframes nika-rise {
  0%   { translate: 0 0; opacity: 0; }
  20%  { opacity: 1; }
  100% { translate: 5cqw -14cqw; opacity: 0; }
}
@keyframes nika-bob {
  0%, 100% { translate: 0 0; }
  50%      { translate: 0 -1.6cqw; }
}
.nika-guitar { animation: nika-sway 3.6s ease-in-out infinite; transform-origin: 50% 85%; }
.nika-rise   { animation: nika-rise 3.2s ease-out infinite; opacity: 0; }
.nika-bob    { animation: nika-bob 3s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .nika-guitar, .nika-rise, .nika-bob { animation: none; }
  .nika-rise { opacity: 0.8; }
}
`;

/* Eighth note. Fixed viewBox, sized in cqw so it never gets stretched. */
const Note = ({
  color,
  width,
  rotate = 0,
  className,
  style,
}: {
  color: string;
  width: string;
  rotate?: number;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <svg
    viewBox="0 0 44 60"
    aria-hidden="true"
    className={`absolute pointer-events-none ${className ?? ""}`}
    style={{ width, transform: `rotate(${rotate}deg)`, ...style }}
  >
    <ellipse
      cx="12"
      cy="48"
      rx="11"
      ry="8"
      transform="rotate(-25 12 48)"
      fill={color}
    />
    <rect x="19" y="4" width="4.5" height="44" fill={color} />
    <path d="M22 4 C30 10 42 16 39 34 C36 24 30 22 22 20 Z" fill={color} />
  </svg>
);

/* Acoustic guitar (static strings) */
const Guitar = () => (
  <svg
    viewBox="0 0 60 160"
    aria-hidden="true"
    className="w-full block overflow-visible"
  >
    {/* headstock + pegs */}
    <rect x="23" y="0" width="14" height="18" rx="3" fill={INK} />
    {[4, 9, 14].map((y) => (
      <React.Fragment key={y}>
        <circle cx="20" cy={y} r="1.8" fill={ORANGE} />
        <circle cx="40" cy={y} r="1.8" fill={ORANGE} />
      </React.Fragment>
    ))}
    {/* neck */}
    <rect
      x="26"
      y="16"
      width="8"
      height="66"
      fill="#7a4a1e"
      stroke={INK}
      strokeWidth="1.2"
    />
    {[28, 38, 48, 58, 68].map((y) => (
      <line
        key={y}
        x1="26"
        x2="34"
        y1={y}
        y2={y}
        stroke="#e8d9b8"
        strokeWidth="0.8"
      />
    ))}
    {/* body */}
    <path
      d="M30 72 C44 72 50 82 47 92 C56 98 58 116 54 128 C50 146 38 150 30 150 C22 150 10 146 6 128 C2 116 4 98 13 92 C10 82 16 72 30 72 Z"
      fill={ORANGE}
      stroke={INK}
      strokeWidth="2"
    />
    {/* sound hole + rings */}
    <circle cx="30" cy="106" r="10" fill={INK} />
    <circle
      cx="30"
      cy="106"
      r="12.5"
      fill="none"
      stroke={BLUE}
      strokeWidth="1.6"
    />
    {/* bridge */}
    <rect x="21" y="130" width="18" height="4" rx="1.5" fill={INK} />
    {/* strings (static) */}
    {[26.6, 28.2, 29.4, 30.6, 31.8, 33.4].map((x) => (
      <line
        key={x}
        x1={x}
        x2={x}
        y1="16"
        y2="132"
        stroke="#ffffff"
        strokeWidth="0.9"
      />
    ))}
  </svg>
);

/* Round badges, kept few and fixed so server and client render the same. */
const SCATTER: {
  icon: React.ComponentType<any>;
  color: string;
  size: number;
  rotate: number;
  pos: React.CSSProperties;
}[] = [
  {
    icon: Music,
    color: BLUE,
    size: 9,
    rotate: -8,
    pos: { top: "3cqw", left: "46cqw" },
  },
  {
    icon: Palette,
    color: PINK,
    size: 8.5,
    rotate: 10,
    pos: { top: "18cqw", right: "6cqw" },
  },
  {
    icon: Mic,
    color: TEAL,
    size: 8,
    rotate: -12,
    pos: { bottom: "30cqw", right: "4cqw" },
  },
];

/* Piano keys: 14 white keys with black keys and a few colored "pressed" keys */
const PianoKeys = () => {
  const keys = 14;
  const w = 632 / keys;
  const pressed: Record<number, string> = { 2: TEAL, 7: ORANGE, 10: PINK };
  return (
    <svg viewBox="0 0 632 64" className="w-full block" aria-hidden="true">
      {Array.from({ length: keys }, (_, i) => (
        <rect
          key={`w${i}`}
          x={i * w}
          y="0"
          width={w}
          height="64"
          fill={pressed[i] ?? "#ffffff"}
          stroke={INK}
          strokeWidth="1.5"
        />
      ))}
      {Array.from({ length: keys - 1 }, (_, i) =>
        [0, 1, 3, 4, 5].includes(i % 7) ? (
          <rect
            key={`b${i}`}
            x={(i + 1) * w - 13}
            y="0"
            width="26"
            height="38"
            rx="3"
            fill={INK}
          />
        ) : null,
      )}
    </svg>
  );
};

/* ---------- Contact row with copy button ---------- */
const ContactRow = ({
  icon,
  text,
  href,
}: {
  icon: React.ReactNode;
  text: string;
  href?: string;
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
      className="flex items-center justify-between"
      style={{
        backgroundColor: ROW_BG,
        borderRadius: "2.4cqw",
        borderLeft: `1.2cqw solid ${BLUE}`,
        padding: "2.6cqw 3.2cqw",
        gap: "2.4cqw",
      }}
    >
      <div className="flex items-center min-w-0" style={{ gap: "2.4cqw" }}>
        <span className="flex-shrink-0" style={{ color: BLUE }}>
          {icon}
        </span>
        {href ? (
          <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="truncate hover:opacity-70"
            style={{
              color: INK,
              fontWeight: 500,
              textDecoration: href.startsWith("http") ? "underline" : "none",
            }}
          >
            {text}
          </a>
        ) : (
          <span className="truncate" style={{ color: INK, fontWeight: 500 }}>
            {text}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${text}`}
        className="flex-shrink-0 hover:opacity-70"
        style={{ color: BLUE }}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
};

const SectionLabel = ({
  children,
  icon,
  color,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  color: string;
}) => (
  <h2
    className="uppercase flex items-center"
    style={{
      color: BLUE,
      fontWeight: 800,
      fontSize: "max(13px, 3cqw)",
      letterSpacing: "0.03em",
      gap: "1.6cqw",
    }}
  >
    <span style={{ color }}>{icon}</span>
    {children}
  </h2>
);

export const Nika: React.FC<NikaProps> = ({ user }) => {
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

  return (
    <div
      className="w-full flex justify-center"
      style={{ backgroundColor: "#f9fafb", minHeight: "100dvh" }}
    >
      <style>{NIKA_CSS}</style>
      <div
        className="relative w-full max-w-lg overflow-clip flex flex-col"
        style={{
          aspectRatio: "632 / 957",
          containerType: "inline-size",
          fontFamily: FONT,
          backgroundColor: MINT,
        }}
      >
        {/* ---------- Header artwork ---------- */}
        {/* Animated guitar, left of the avatar */}
        <div
          aria-hidden="true"
          className="absolute pointer-events-none"
          style={{
            width: "17cqw",
            top: "5cqw",
            left: "7cqw",
            transform: "rotate(-18deg)",
          }}
        >
          <div className="nika-guitar">
            <Guitar />
          </div>
        </div>

        {/* Notes drifting out of the guitar */}
        <Note
          color={PINK}
          width="5cqw"
          rotate={-10}
          className="nika-rise"
          style={{ top: "20cqw", left: "18cqw" }}
        />
        <Note
          color={TEAL}
          width="4.5cqw"
          rotate={12}
          className="nika-rise"
          style={{ top: "22cqw", left: "22cqw", animationDelay: "1.6s" }}
        />

        {/* Gently bobbing note on the right */}
        <Note
          color={ORANGE}
          width="8cqw"
          rotate={12}
          className="nika-bob"
          style={{ top: "6cqw", right: "10cqw" }}
        />

        {/* Round badges (behind the content) */}
        {SCATTER.map(({ icon: Icon, color, size, rotate, pos }, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="absolute pointer-events-none flex items-center justify-center rounded-full"
            style={{
              width: `${size}cqw`,
              height: `${size}cqw`,
              backgroundColor: color,
              color: "#fff",
              transform: `rotate(${rotate}deg)`,
              ...pos,
            }}
          >
            <Icon
              style={{
                width: `${size * 0.53}cqw`,
                height: `${size * 0.53}cqw`,
              }}
            />
          </span>
        ))}

        {/* ---------- Content ---------- */}
        <div
          className="relative flex flex-col items-center flex-1"
          style={{
            fontSize: "max(12px, 2.6cqw)",
            lineHeight: 1.4,
            paddingTop: "12cqw",
          }}
        >
          {/* Avatar */}
          <div
            className="overflow-hidden rounded-full bg-white flex items-center justify-center flex-shrink-0"
            style={{
              width: "30cqw",
              height: "30cqw",
              border: `1.4cqw solid ${BLUE}`,
              boxShadow: `1.2cqw 1.2cqw 0 ${PINK}`,
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
              <UserIcon size={56} className="text-gray-400" />
            )}
          </div>

          {/* Name + bio */}
          <div
            className="w-full flex flex-col items-center text-center"
            style={{ padding: "0 7cqw", marginTop: "4cqw", gap: "1.4cqw" }}
          >
            {displayName && (
              <h1
                className="uppercase"
                style={{
                  color: BLUE,
                  fontWeight: 800,
                  fontSize: "max(20px, 5cqw)",
                  lineHeight: 1.1,
                  letterSpacing: "0.01em",
                }}
              >
                {displayName}
              </h1>
            )}
            {bio && (
              <p
                style={{
                  color: INK,
                  fontWeight: 600,
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
              style={{ padding: "0 5cqw", marginTop: "5cqw", gap: "2.2cqw" }}
            >
              <SectionLabel icon={<Music4 size={16} />} color={PINK}>
                Contact
              </SectionLabel>
              {emails.map((e) => (
                <ContactRow
                  key={e}
                  icon={<Mail size={14} />}
                  text={e}
                  href={`mailto:${e}`}
                />
              ))}
              {phones.map((ph) => (
                <ContactRow
                  key={ph}
                  icon={<Phone size={14} />}
                  text={ph}
                  href={`tel:${ph}`}
                />
              ))}
              {websites.map((w) => (
                <ContactRow
                  key={w}
                  icon={<Globe size={14} />}
                  text={w}
                  href={w.startsWith("http") ? w : `https://${w}`}
                />
              ))}
              {location && (
                <ContactRow
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
              style={{ padding: "0 5cqw", marginTop: "4.6cqw", gap: "2.2cqw" }}
            >
              <SectionLabel icon={<Palette size={16} />} color={ORANGE}>
                Connect with me
              </SectionLabel>
              <div className="flex flex-wrap" style={{ gap: "2cqw" }}>
                {socials.map((link) => {
                  const key = String(link.platform ?? "").toLowerCase();
                  return (
                    <a
                      key={link.id ?? link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center hover:opacity-80"
                      style={{
                        backgroundColor: BLUE,
                        color: "#fff",
                        fontWeight: 600,
                        borderRadius: "999px",
                        padding: "2cqw 3.6cqw",
                        gap: "2cqw",
                      }}
                    >
                      <span style={{ color: MINT }}>
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

        {/* ---------- Bottom: piano keys, then action bar ---------- */}
        <div className="relative w-full flex-shrink-0">
          <PianoKeys />

          <div
            className="grid grid-cols-2"
            style={{ backgroundColor: BLUE, borderTop: `1cqw solid ${INK}` }}
          >
            <button
              type="button"
              onClick={() => setShowQr(true)}
              className="flex flex-col items-center hover:opacity-80"
              style={{ padding: "2.6cqw 0", gap: "0.6cqw", color: "#fff" }}
            >
              <QrCode size={18} style={{ color: MINT }} />
              <span style={{ fontSize: "max(12px, 2.4cqw)", fontWeight: 600 }}>
                QR Code
              </span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="flex flex-col items-center hover:opacity-80"
              style={{ padding: "2.6cqw 0", gap: "0.6cqw", color: "#fff" }}
            >
              <Share2 size={18} style={{ color: MINT }} />
              <span style={{ fontSize: "max(12px, 2.4cqw)", fontWeight: 600 }}>
                Share
              </span>
            </button>
          </div>
        </div>

        {/* ---------- QR modal ---------- */}
        {showQr && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setShowQr(false)}
          >
            <div
              className="relative bg-white rounded-2xl p-5 flex flex-col items-center gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowQr(false)}
                className="absolute top-2 right-2 hover:opacity-70"
                aria-label="Close"
              >
                <X size={16} />
              </button>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(pageUrl)}`}
                alt="QR code"
                width={220}
                height={220}
              />
              <span className="text-sm font-medium">{displayName}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nika;
