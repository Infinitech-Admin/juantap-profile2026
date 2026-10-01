"use client";

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
  QrCode,
  Share2,
  UserPlus,
  Building2,
  ArrowUpRight,
  X,
} from "lucide-react";
import type { Template, User } from "@/types/template";

interface AuroraGlassProps {
  template?: Template;
  user?: User;
}

/* ---------- Palette: deep navy + aurora (teal / violet / pink) ---------- */
const BG = "#070b17";
const TEXT = "#f8fafc";
const SOFT = "#d5dcea";
const MUTED = "#9aa7bf";
const TEAL = "#2dd4bf";
const VIOLET = "#a78bfa";
const PINK = "#f472b6";
const GLASS = "rgba(255,255,255,.07)";
const GLASS_BORDER = "rgba(255,255,255,.16)";

const FONT = "'Sora', 'Segoe UI', Arial, sans-serif";

const TikTokIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06Z" />
  </svg>
);

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  facebook: <Facebook size={18} />,
  instagram: <Instagram size={18} />,
  twitter: <Twitter size={18} />,
  linkedin: <Linkedin size={18} />,
  github: <Github size={18} />,
  youtube: <Youtube size={18} />,
  tiktok: <TikTokIcon size={18} />,
  telegram: <Send size={18} />,
  viber: <MessageCircle size={18} />,
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

const vEsc = (s: string) =>
  s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");

const AG_CSS = `
@keyframes ag-up      { from { opacity: 0; translate: 0 4cqw; } to { opacity: 1; translate: 0 0; } }
@keyframes ag-pop     { from { opacity: 0; scale: .85; } to { opacity: 1; scale: 1; } }
@keyframes ag-spin    { to { rotate: 360deg; } }
@keyframes ag-drift-a { from { translate: -6cqw -4cqw; scale: 1; }   to { translate: 14cqw 10cqw; scale: 1.25; } }
@keyframes ag-drift-b { from { translate: 8cqw 6cqw; scale: 1.15; }  to { translate: -12cqw -8cqw; scale: .95; } }
@keyframes ag-drift-c { from { translate: 0 0; scale: 1; }           to { translate: -10cqw 12cqw; scale: 1.3; } }
@keyframes ag-float   { 0%,100% { translate: 0 0; opacity: .25; } 50% { translate: 0 -5cqw; opacity: .8; } }
@keyframes ag-text    { from { background-position: 0% 50%; } to { background-position: 200% 50%; } }
@keyframes ag-pulse   { 0% { box-shadow: 0 0 0 0 rgba(45,212,191,.55); } 100% { box-shadow: 0 0 0 3.4cqw rgba(45,212,191,0); } }
@keyframes ag-shine   { from { translate: -130% 0; } to { translate: 330% 0; } }
@keyframes ag-rise    { from { translate: 0 100%; } to { translate: 0 0; } }

.ag-blob { position: absolute; border-radius: 9999px; filter: blur(14cqw); opacity: .55; }
.ag-blob-a { width: 80cqw; height: 80cqw; top: -22cqw; left: -24cqw; background: ${TEAL};   animation: ag-drift-a 14s ease-in-out infinite alternate; }
.ag-blob-b { width: 74cqw; height: 74cqw; top: 26cqw;  right: -30cqw; background: ${VIOLET}; animation: ag-drift-b 17s ease-in-out infinite alternate; }
.ag-blob-c { width: 70cqw; height: 70cqw; bottom: 8cqw; left: -22cqw; background: ${PINK};   opacity: .38; animation: ag-drift-c 19s ease-in-out infinite alternate; }

.ag-grid {
  position: absolute; inset: 0; opacity: .5;
  background-image:
    linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px);
  background-size: 8cqw 8cqw;
  -webkit-mask-image: radial-gradient(70% 55% at 50% 22%, #000, transparent);
  mask-image: radial-gradient(70% 55% at 50% 22%, #000, transparent);
}
.ag-dot { position: absolute; width: 1.1cqw; height: 1.1cqw; border-radius: 9999px; background: #fff; animation: ag-float 6s ease-in-out infinite; }

.ag-ring {
  position: absolute; inset: -1.8cqw; border-radius: 9999px;
  background: conic-gradient(from 0deg, ${TEAL}, ${VIOLET}, ${PINK}, ${TEAL});
  animation: ag-spin 6s linear infinite;
}
.ag-ring-glow {
  position: absolute; inset: -1.8cqw; border-radius: 9999px; filter: blur(3cqw); opacity: .7;
  background: conic-gradient(from 0deg, ${TEAL}, ${VIOLET}, ${PINK}, ${TEAL});
  animation: ag-spin 6s linear infinite;
}

.ag-name {
  background: linear-gradient(90deg, #ffffff, #99f6e4, #ddd6fe, #fbcfe8, #ffffff);
  background-size: 200% 100%;
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; color: #fff;
  animation: ag-text 6s linear infinite;
}

.ag-up   { animation: ag-up .7s cubic-bezier(.2,.8,.2,1) both; }
.ag-pop  { animation: ag-pop .55s cubic-bezier(.2,1.2,.4,1) both; }
.ag-bar  { animation: ag-rise .6s cubic-bezier(.2,.9,.3,1) .6s both; }

.ag-glass {
  background: ${GLASS};
  border: 1px solid ${GLASS_BORDER};
  -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
  box-shadow: 0 2cqw 6cqw rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.12);
}

.ag-tile { transition: translate .25s ease, background-color .25s ease, border-color .25s ease; }
.ag-tile:hover { translate: 0 -.8cqw; background-color: rgba(255,255,255,.14); border-color: ${TEAL}; }
.ag-tile-pulse { animation: ag-pulse 2s ease-out infinite; }
.ag-row { transition: translate .25s ease, border-color .25s ease, background-color .25s ease; }
.ag-row:hover { translate: 1cqw 0; border-color: ${VIOLET}; background-color: rgba(255,255,255,.12); }
.ag-soc { transition: translate .25s ease, background-color .25s ease, color .25s ease; }
.ag-soc:hover { translate: 0 -.8cqw; background-color: #fff !important; color: ${BG} !important; }

.ag-save { position: relative; overflow: hidden; }
.ag-save::after {
  content: ""; position: absolute; top: 0; bottom: 0; width: 28%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent);
  animation: ag-shine 3.6s ease-in-out infinite; pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .ag-blob, .ag-dot, .ag-ring, .ag-ring-glow, .ag-name, .ag-tile-pulse { animation: none; }
  .ag-up, .ag-pop, .ag-bar { animation: none; }
  .ag-save::after { display: none; }
}
`;

const Label = ({
  children,
  delay = 0.5,
}: {
  children: React.ReactNode;
  delay?: number;
}) => (
  <h2
    className="ag-up flex items-center"
    style={{
      animationDelay: `${delay}s`,
      gap: "3cqw",
      color: SOFT,
      fontWeight: 700,
      fontSize: "max(11px, 2.4cqw)",
      letterSpacing: "0.26em",
      textTransform: "uppercase",
    }}
  >
    <span
      aria-hidden="true"
      style={{
        width: "7cqw",
        height: 2,
        borderRadius: 2,
        background: `linear-gradient(90deg, ${TEAL}, ${VIOLET})`,
      }}
    />
    {children}
  </h2>
);

const InfoRow = ({
  icon,
  label,
  text,
  href,
  i = 0,
}: {
  icon: React.ReactNode;
  label: string;
  text: string;
  href?: string;
  i?: number;
}) => {
  const inner = (
    <div
      className="ag-glass ag-row ag-up flex items-center"
      style={{
        animationDelay: `${0.6 + i * 0.08}s`,
        gap: "3.6cqw",
        padding: "2.8cqw 3.6cqw",
        borderRadius: "3.4cqw",
      }}
    >
      <span
        className="flex-shrink-0 flex items-center justify-center"
        style={{
          width: "10cqw",
          height: "10cqw",
          borderRadius: "3cqw",
          background: `linear-gradient(135deg, ${TEAL}, ${VIOLET})`,
          color: BG,
        }}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p
          style={{
            color: MUTED,
            fontSize: "max(10px, 2.1cqw)",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          {label}
        </p>
        <p
          className="truncate"
          style={{
            color: TEXT,
            fontWeight: 500,
            fontSize: "max(14px, 3.3cqw)",
          }}
        >
          {text}
        </p>
      </div>
      {href && (
        <ArrowUpRight size={16} style={{ color: MUTED, flexShrink: 0 }} />
      )}
    </div>
  );

  return href ? (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      {inner}
    </a>
  ) : (
    inner
  );
};

export const AuroraGlass: React.FC<AuroraGlassProps> = ({ user }) => {
  const [showQr, setShowQr] = useState(false);

  const avatarUrl = user?.avatar_url || null;
  const p: any = user?.profile ?? {};
  const displayName =
    (user as any)?.display_name || user?.name || (user as any)?.username || "";

  const jobTitle: string = String(
    p.job_title ?? p.jobTitle ?? p.position ?? p.title ?? "",
  ).trim();
  const company: string = String(
    p.company ?? p.company_name ?? p.organization ?? "",
  ).trim();

  const bio: string = (p.bio ?? "").trim();
  const emails = splitList(user?.email);
  const phones = splitList(p.phone);
  const websites = splitList(p.website);
  const location: string = (p.location ?? "").trim();
  const socials: any[] = (p.socialLinks ?? []).filter(isVisible);

  const hasContact =
    emails.length + phones.length + websites.length > 0 || !!location;

  const webHref = (w: string) => (w.startsWith("http") ? w : `https://${w}`);
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;

  const actions: { label: string; href: string; icon: React.ReactNode }[] = [];
  if (phones[0])
    actions.push({
      label: "Call",
      href: `tel:${phones[0]}`,
      icon: <Phone size={20} />,
    });
  if (emails[0])
    actions.push({
      label: "Email",
      href: `mailto:${emails[0]}`,
      icon: <Mail size={20} />,
    });
  if (websites[0])
    actions.push({
      label: "Website",
      href: webHref(websites[0]),
      icon: <Globe size={20} />,
    });
  if (location)
    actions.push({ label: "Map", href: mapHref, icon: <MapPin size={20} /> });

  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: displayName, url: pageUrl });
      } else {
        await navigator.clipboard.writeText(pageUrl);
      }
    } catch {
      /* cancelled */
    }
  };

  const handleSaveContact = () => {
    const name = (displayName || "Contact").trim();
    const parts = name.split(/\s+/);
    const family = parts.length > 1 ? parts[parts.length - 1] : "";
    const given = parts.length > 1 ? parts.slice(0, -1).join(" ") : name;

    const lines: string[] = ["BEGIN:VCARD", "VERSION:3.0"];
    lines.push(`FN:${vEsc(name)}`);
    lines.push(`N:${vEsc(family)};${vEsc(given)};;;`);
    if (company) lines.push(`ORG:${vEsc(company)}`);
    if (jobTitle) lines.push(`TITLE:${vEsc(jobTitle)}`);
    phones.forEach((ph) => lines.push(`TEL;TYPE=CELL:${ph}`));
    emails.forEach((e, i) =>
      lines.push(`EMAIL;TYPE=INTERNET${i > 0 ? ",WORK" : ""}:${e}`),
    );
    websites.forEach((w) => lines.push(`URL:${webHref(w)}`));
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

  const roundBtn: React.CSSProperties = {
    width: "12cqw",
    height: "12cqw",
    borderRadius: "999px",
    color: TEXT,
  };

  return (
    <div
      className="w-full flex justify-center"
      style={{ backgroundColor: "#03050c", minHeight: "100dvh" }}
    >
      <style>{AG_CSS}</style>

      {/* No overflow-hidden: grows with content. aspect-ratio = minimum height only. */}
      <div
        className="relative w-full max-w-lg flex flex-col"
        style={{
          aspectRatio: "632 / 957",
          containerType: "inline-size",
          fontFamily: FONT,
          backgroundColor: BG,
          color: TEXT,
        }}
      >
        {/* Animated aurora background (clipped in its own wrapper) */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <span className="ag-blob ag-blob-a" />
          <span className="ag-blob ag-blob-b" />
          <span className="ag-blob ag-blob-c" />
          <span className="ag-grid" />
          <span
            className="ag-dot"
            style={{ top: "14cqw", left: "12cqw", animationDelay: "0s" }}
          />
          <span
            className="ag-dot"
            style={{ top: "30cqw", right: "14cqw", animationDelay: "1.2s" }}
          />
          <span
            className="ag-dot"
            style={{ top: "52cqw", left: "8cqw", animationDelay: "2.4s" }}
          />
          <span
            className="ag-dot"
            style={{ top: "8cqw", right: "34cqw", animationDelay: "3.2s" }}
          />
          <span
            className="ag-dot"
            style={{ top: "64cqw", right: "9cqw", animationDelay: "4s" }}
          />
        </div>

        {/* Content */}
        <div
          className="relative flex flex-col flex-1"
          style={{
            fontSize: "max(13px, 3cqw)",
            lineHeight: 1.45,
            padding: "11cqw 6cqw 6cqw",
            gap: "5.4cqw",
            zIndex: 10,
          }}
        >
          {/* Identity */}
          <div
            className="flex flex-col items-center text-center"
            style={{ gap: "2cqw" }}
          >
            <div
              className="ag-pop relative"
              style={{ width: "36cqw", height: "36cqw" }}
            >
              <span aria-hidden="true" className="ag-ring-glow" />
              <span aria-hidden="true" className="ag-ring" />
              <div
                className="relative w-full h-full overflow-hidden flex items-center justify-center"
                style={{
                  borderRadius: "999px",
                  border: `1.2cqw solid ${BG}`,
                  backgroundColor: "#111827",
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
                  <UserIcon size={48} style={{ color: MUTED }} />
                )}
              </div>
            </div>

            {displayName && (
              <h1
                className="ag-name ag-up"
                style={{
                  animationDelay: ".2s",
                  marginTop: "4cqw",
                  fontWeight: 800,
                  fontSize: "max(24px, 8cqw)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.015em",
                  overflowWrap: "anywhere",
                }}
              >
                {displayName}
              </h1>
            )}

            {jobTitle && (
              <p
                className="ag-up"
                style={{
                  animationDelay: ".3s",
                  color: "#99f6e4",
                  fontWeight: 600,
                  fontSize: "max(12px, 2.8cqw)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                {jobTitle}
              </p>
            )}

            {company && (
              <span
                className="ag-glass ag-up inline-flex items-center"
                style={{
                  animationDelay: ".4s",
                  marginTop: "1cqw",
                  gap: "1.8cqw",
                  padding: "1.6cqw 4cqw",
                  borderRadius: "999px",
                  color: TEXT,
                  fontWeight: 500,
                  fontSize: "max(12px, 2.8cqw)",
                }}
              >
                <Building2 size={14} style={{ color: TEAL }} />
                {company}
              </span>
            )}
          </div>

          {/* Quick actions */}
          {actions.length > 0 && (
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${Math.min(actions.length, 4)}, minmax(0, 1fr))`,
                gap: "2.6cqw",
              }}
            >
              {actions.map((a, i) => (
                <a
                  key={a.label}
                  href={a.href}
                  target={a.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="ag-glass ag-tile ag-pop flex flex-col items-center"
                  style={{
                    animationDelay: `${0.45 + i * 0.08}s`,
                    gap: "1.2cqw",
                    padding: "3.4cqw 0",
                    borderRadius: "3.4cqw",
                    color: TEXT,
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "max(12px, 2.6cqw)",
                  }}
                >
                  <span
                    className={`flex items-center justify-center ${i === 0 ? "ag-tile-pulse" : ""}`}
                    style={{
                      color: TEAL,
                      borderRadius: "999px",
                      padding: "1.2cqw",
                    }}
                  >
                    {a.icon}
                  </span>
                  {a.label}
                </a>
              ))}
            </div>
          )}

          {/* Bio */}
          {bio && (
            <p
              className="ag-glass ag-up"
              style={{
                animationDelay: ".6s",
                color: SOFT,
                whiteSpace: "pre-line",
                padding: "3.6cqw 4.4cqw",
                borderRadius: "3.4cqw",
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {bio}
            </p>
          )}

          {/* Contact */}
          {hasContact && (
            <div className="flex flex-col" style={{ gap: "2.4cqw" }}>
              <Label delay={0.6}>Contact</Label>
              {emails.map((e, i) => (
                <InfoRow
                  key={e}
                  i={i}
                  icon={<Mail size={17} />}
                  label="Email"
                  text={e}
                  href={`mailto:${e}`}
                />
              ))}
              {phones.map((ph, i) => (
                <InfoRow
                  key={ph}
                  i={emails.length + i}
                  icon={<Phone size={17} />}
                  label="Phone"
                  text={ph}
                  href={`tel:${ph}`}
                />
              ))}
              {websites.map((w, i) => (
                <InfoRow
                  key={w}
                  i={emails.length + phones.length + i}
                  icon={<Globe size={17} />}
                  label="Website"
                  text={w}
                  href={webHref(w)}
                />
              ))}
              {location && (
                <InfoRow
                  i={emails.length + phones.length + websites.length}
                  icon={<MapPin size={17} />}
                  label="Location"
                  text={location}
                  href={mapHref}
                />
              )}
            </div>
          )}

          {/* Socials */}
          {socials.length > 0 && (
            <div className="flex flex-col" style={{ gap: "3cqw" }}>
              <Label delay={0.9}>Connect</Label>
              <div className="flex flex-wrap" style={{ gap: "3cqw" }}>
                {socials.map((link, idx) => {
                  const key = String(link.platform ?? "").toLowerCase();
                  return (
                    <a
                      key={link.id ?? link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      title={link.username || link.platform}
                      aria-label={link.username || link.platform}
                      className="ag-glass ag-soc ag-pop flex items-center justify-center"
                      style={{
                        ...roundBtn,
                        animationDelay: `${0.95 + idx * 0.06}s`,
                      }}
                    >
                      {SOCIAL_ICONS[key] || <Globe size={18} />}
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* QR panel (white tile so it always scans) */}
          {showQr && (
            <div
              className="ag-glass ag-pop relative flex items-center"
              style={{
                marginTop: "auto",
                gap: "5cqw",
                padding: "4.4cqw",
                borderRadius: "4cqw",
              }}
            >
              <button
                type="button"
                onClick={() => setShowQr(false)}
                aria-label="Close QR code"
                className="absolute hover:opacity-70"
                style={{ top: "2.4cqw", right: "2.4cqw", color: SOFT }}
              >
                <X size={16} />
              </button>
              <div
                style={{
                  padding: "2cqw",
                  borderRadius: "2.4cqw",
                  backgroundColor: "#fff",
                  flexShrink: 0,
                }}
              >
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=0&data=${encodeURIComponent(pageUrl)}`}
                  alt="QR code"
                  style={{ width: "28cqw", height: "28cqw", display: "block" }}
                />
              </div>
              <div className="min-w-0">
                <p
                  style={{
                    color: TEAL,
                    fontWeight: 700,
                    fontSize: "max(10px, 2.2cqw)",
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                  }}
                >
                  Scan to connect
                </p>
                {displayName && (
                  <p
                    style={{
                      marginTop: "1cqw",
                      color: TEXT,
                      fontWeight: 700,
                      fontSize: "max(16px, 4.4cqw)",
                      lineHeight: 1.15,
                    }}
                  >
                    {displayName}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sticky bottom bar */}
        <div
          className="ag-bar w-full flex-shrink-0 flex items-center"
          style={{
            position: "sticky",
            bottom: 0,
            zIndex: 20,
            gap: "2.6cqw",
            padding: "3cqw 6cqw",
            backgroundColor: "rgba(7,11,23,.82)",
            WebkitBackdropFilter: "blur(14px)",
            backdropFilter: "blur(14px)",
            borderTop: `1px solid ${GLASS_BORDER}`,
          }}
        >
          <button
            type="button"
            onClick={handleSaveContact}
            className="ag-save flex-1 flex items-center justify-center hover:opacity-95"
            style={{
              gap: "2cqw",
              padding: "3.2cqw 0",
              borderRadius: "999px",
              color: BG,
              fontWeight: 800,
              fontSize: "max(13px, 3cqw)",
              background: `linear-gradient(120deg, ${TEAL}, ${VIOLET}, ${PINK})`,
              boxShadow: "0 2cqw 6cqw rgba(167,139,250,.35)",
            }}
          >
            <UserPlus size={18} /> Save Contact
          </button>
          <button
            type="button"
            onClick={() => setShowQr((s) => !s)}
            aria-label="Toggle QR code"
            aria-pressed={showQr}
            className="ag-glass flex items-center justify-center hover:opacity-80"
            style={{
              ...roundBtn,
              backgroundColor: showQr ? "rgba(45,212,191,.25)" : GLASS,
            }}
          >
            <QrCode size={18} />
          </button>
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share"
            className="ag-glass flex items-center justify-center hover:opacity-80"
            style={roundBtn}
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuroraGlass;
