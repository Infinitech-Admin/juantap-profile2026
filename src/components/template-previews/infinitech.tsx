"use client";

// src/components/template-previews/infinitech.tsx
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
} from "lucide-react";
import type { Template, User } from "@/types/template";

interface InfinitechProps {
  template?: Template;
  user?: User;
}

const hex = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");

const TEAL = "#2f7f9c";
const CYAN = "#6ecff0";
const NAVY = "#0a2650";
const PURPLE = "#2e0096"; // icon accent (from reference design)
const YELLOW = "#FFD400"; // avatar ring
const ROW_BG = "#e4e1ec"; // row / pill background
const BAR_BG = "#e0dde8"; // footer bar

const TikTokIcon = ({ size = 14 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
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

const FONT = "Poppins, 'Segoe UI', Arial, sans-serif";

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
        padding: "2.6cqw 3.2cqw",
        gap: "2.4cqw",
      }}
    >
      <div className="flex items-center min-w-0" style={{ gap: "2.4cqw" }}>
        <span className="flex-shrink-0" style={{ color: PURPLE }}>
          {icon}
        </span>
        {href ? (
          <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="truncate hover:opacity-70"
            style={{
              color: "#000",
              textDecoration: href.startsWith("http") ? "underline" : "none",
            }}
          >
            {text}
          </a>
        ) : (
          <span className="truncate" style={{ color: "#000" }}>
            {text}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${text}`}
        className="flex-shrink-0 hover:opacity-70"
        style={{ color: PURPLE }}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <h2
    className="font-semibold uppercase"
    style={{
      color: "#000",
      fontSize: "max(12px, 2.6cqw)",
      letterSpacing: "0.02em",
    }}
  >
    {children}
  </h2>
);

export const Infinitech: React.FC<InfinitechProps> = ({ user }) => {
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
      {/*
        aspect-ratio acts as a minimum height: the card keeps the design's
        proportions but grows when there is more data. flex-col + flex-1 on the
        content pushes the footer to the very bottom.
      */}
      <div
        className="relative w-full max-w-lg overflow-clip bg-white flex flex-col"
        style={{
          aspectRatio: "632 / 957",
          containerType: "inline-size",
          fontFamily: FONT,
        }}
      >
        {/* ---------- Artwork: top-left hexagons ---------- */}
        <svg
          viewBox="0 0 632 380"
          className="absolute top-0 left-0 w-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <g fill="none" strokeWidth="2.2">
            <polygon points={hex(12, 192, 19)} stroke={TEAL} />
            <polygon points={hex(48, 262, 19)} stroke={TEAL} strokeWidth="3" />
            <polygon points={hex(12, 262, 17)} stroke={TEAL} />
            <polygon points={hex(30, 228, 17)} stroke={CYAN} />
            <polygon points={hex(0, 296, 12)} stroke={TEAL} />
            <polygon points={hex(44, 177, 7)} stroke="#8aa" strokeWidth="1" />
            <polygon points={hex(95, 252, 5)} stroke="#8aa" strokeWidth="1" />
            <polygon points={hex(24, 313, 5)} stroke="#8aa" strokeWidth="1" />
            <polygon points={hex(75, 295, 8)} stroke={TEAL} strokeWidth="1" />
            <line x1="22" y1="194" x2="90" y2="194" stroke={TEAL} />
            <line x1="46" y1="228" x2="104" y2="228" stroke={CYAN} />
            <line x1="51" y1="280" x2="51" y2="364" stroke={TEAL} />
          </g>
          <circle cx="91" cy="194" r="4" fill={TEAL} />
          <circle cx="105" cy="228" r="3.5" fill={CYAN} />
          <circle cx="51" cy="365" r="3.5" fill={TEAL} />
          <polygon points={hex(40, 153, 6)} fill={TEAL} />
          <polygon points={hex(76, 177, 6)} fill={CYAN} />
          <polygon points={hex(66, 208, 9)} fill={CYAN} />
          <polygon points={hex(81, 288, 11)} fill={TEAL} opacity="0.9" />
          <circle cx="58" cy="181" r="3" fill={CYAN} />
          <circle cx="66" cy="240" r="2" fill={CYAN} />
        </svg>

        {/* ---------- Logo (PNG, may name na) ---------- */}
        <img
          src="/infinitech-logo.png"
          alt="Infinitech Advertising Corporation"
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ top: "3cqw", width: "40cqw", height: "auto" }}
        />

        {/* ---------- Artwork: right hexagon cluster (behind content) ---------- */}
        <svg
          viewBox="540 555 92 200"
          className="absolute right-0 pointer-events-none"
          style={{ width: "14.5cqw", bottom: "28cqw", opacity: 0.85 }}
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <g fill="none" strokeWidth="2.2">
            <polygon
              points={hex(607, 581, 11)}
              stroke={TEAL}
              strokeWidth="1.2"
            />
            <polygon points={hex(606, 648, 18)} stroke={TEAL} strokeWidth="3" />
            <polygon points={hex(632, 611, 17)} stroke={CYAN} />
            <polygon points={hex(586, 682, 18)} stroke={TEAL} strokeWidth="3" />
            <polygon points={hex(632, 680, 18)} stroke={TEAL} strokeWidth="3" />
            <polygon
              points={hex(550, 729, 9)}
              stroke={TEAL}
              strokeWidth="1.2"
            />
            <polygon points={hex(556, 626, 7)} stroke="#8aa" strokeWidth="1" />
            <polygon points={hex(620, 563, 5)} stroke="#8aa" strokeWidth="1" />
            <polygon points={hex(632, 715, 14)} stroke={CYAN} />
            <line x1="556" y1="648" x2="588" y2="648" stroke={TEAL} />
            <line x1="582" y1="613" x2="614" y2="613" stroke={CYAN} />
            <line x1="586" y1="700" x2="586" y2="745" stroke={TEAL} />
          </g>
          <circle cx="555" cy="648" r="3.5" fill={TEAL} />
          <circle cx="581" cy="613" r="3" fill={CYAN} />
          <circle cx="586" cy="746" r="3.5" fill={TEAL} />
          <circle cx="549" cy="693" r="3" fill={CYAN} />
          <polygon points={hex(561, 628, 7)} fill={CYAN} opacity="0.8" />
          <polygon points={hex(571, 727, 6)} fill={TEAL} />
          <polygon points={hex(604, 712, 5)} fill={CYAN} />
          <polygon points={hex(584, 589, 5)} fill={CYAN} />
        </svg>

        {/* ---------- Content (grows to fill the card) ---------- */}
        <div
          className="relative flex flex-col items-center flex-1"
          style={{
            paddingTop: "38cqw", // dating 27cqw
            fontSize: "max(12px, 2.6cqw)",
            lineHeight: 1.4,
          }}
        >
          {/* Circular avatar with yellow ring */}
          <div
            className="overflow-hidden rounded-full bg-white flex items-center justify-center flex-shrink-0"
            style={{
              width: "31cqw",
              height: "31cqw",
              border: `1.3cqw solid ${YELLOW}`,
              boxShadow: "0 0.6cqw 2cqw rgba(0,0,0,0.15)",
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
            style={{ padding: "0 7cqw", marginTop: "3.6cqw", gap: "1.6cqw" }}
          >
            {displayName && (
              <h1
                className="font-bold"
                style={{
                  color: "#000",
                  fontSize: "max(20px, 4.2cqw)",
                  lineHeight: 1.2,
                }}
              >
                {displayName}
              </h1>
            )}
            {bio && (
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "max(12px, 2.4cqw)",
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
              <SectionLabel>Contact</SectionLabel>
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
              <SectionLabel>Connect with me</SectionLabel>
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
                        backgroundColor: ROW_BG,
                        color: "#000",
                        borderRadius: "2.4cqw",
                        padding: "2.2cqw 3.2cqw",
                        gap: "2cqw",
                      }}
                    >
                      <span style={{ color: PURPLE }}>
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

          {/* Spacer so there is always a gap above the swooshes */}
          <div style={{ height: "6cqw" }} />
        </div>

        {/* ---------- Bottom: swooshes, then footer bar at the very bottom ---------- */}
        <div className="relative w-full flex-shrink-0">
          <svg
            viewBox="0 857 632 100"
            className="w-full block"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <polygon points="0,857 385,957 0,957" fill="#1657b5" />
            <polygon points="0,888 322,957 0,957" fill="#ffffff" />
            <polygon points="0,900 378,957 0,957" fill="#143a75" />
            <polygon points="632,830 632,957 372,957" fill={NAVY} />
          </svg>

          <div
            className="grid grid-cols-2"
            style={{
              backgroundColor: BAR_BG,
              borderTop: "1px solid #cfcbd9",
            }}
          >
            <button
              type="button"
              onClick={() => setShowQr(true)}
              className="flex flex-col items-center hover:opacity-70"
              style={{ padding: "2.6cqw 0", gap: "0.6cqw", color: "#000" }}
            >
              <QrCode size={18} style={{ color: PURPLE }} />
              <span style={{ fontSize: "max(12px, 2.4cqw)" }}>QR Code</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="flex flex-col items-center hover:opacity-70"
              style={{ padding: "2.6cqw 0", gap: "0.6cqw", color: "#000" }}
            >
              <Share2 size={18} style={{ color: PURPLE }} />
              <span style={{ fontSize: "max(12px, 2.4cqw)" }}>Share</span>
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

export default Infinitech;
