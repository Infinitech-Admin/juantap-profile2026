"use client";

// src/components/template-previews/card-kit.tsx
// Shared building blocks for themed profile-card templates.
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
  UserPlus,
  Contact,
  Link2,
} from "lucide-react";
import type { User } from "@/types/template";

export interface CardTheme {
  font: string;
  bg: string; // fallback background colour
  text: string;
  muted: string;
  accent: string;
  accent2: string;
  glow: string; // "r,g,b" triple used for glows, e.g. "45,212,191"
  rowBg: string;
  rowBorder: string;
  panel: string; // avatar bg + modal bg
  barBg: string; // bottom action bar
}

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

const vEsc = (s: string) =>
  s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");

/* ---------- Shared animations (driven by CSS variables from the theme) ---------- */
const KIT_CSS = `
@keyframes ck-up      { from { opacity: 0; translate: 0 3.5cqw; } to { opacity: 1; translate: 0 0; } }
@keyframes ck-slide   { from { opacity: 0; translate: -6cqw 0; } to { opacity: 1; translate: 0 0; } }
@keyframes ck-pop     { from { opacity: 0; scale: .6; } to { opacity: 1; scale: 1; } }
@keyframes ck-rise    { from { translate: 0 100%; } to { translate: 0 0; } }
@keyframes ck-draw    { from { scale: 0 1; } to { scale: 1 1; } }
@keyframes ck-spin    { to { rotate: 360deg; } }
@keyframes ck-spin-rev{ to { rotate: -360deg; } }
@keyframes ck-avatar  {
  0%,100% { box-shadow: 0 0 3cqw rgba(var(--glow),.4), 0 0 0 1.2cqw rgba(var(--glow),.16); }
  50%     { box-shadow: 0 0 6cqw rgba(var(--glow),.8), 0 0 0 1.6cqw rgba(var(--glow),.3); }
}
@keyframes ck-text    {
  0%,100% { text-shadow: 0 0 1.6cqw rgba(var(--glow),.25); }
  50%     { text-shadow: 0 0 3.4cqw rgba(var(--glow),.7); }
}
@keyframes ck-shine   { from { translate: -120% 0; } to { translate: 320% 0; } }
@keyframes ck-bar     { from { translate: -100% 0; } to { translate: 300% 0; } }
@keyframes ck-fade    { from { opacity: 0; } to { opacity: 1; } }
@keyframes ck-zoom    { from { opacity: 0; scale: .85; } to { opacity: 1; scale: 1; } }

.ck-up       { animation: ck-up .7s ease-out both; }
.ck-pop      { animation: ck-pop .7s cubic-bezier(.2,1.3,.4,1) both; }
.ck-name     { animation: ck-up .7s ease-out .35s both, ck-text 3.4s ease-in-out 1.2s infinite; }
.ck-line     { transform-origin: left center; animation: ck-draw .9s ease-out .7s both; }
.ck-ring     { animation: ck-spin 16s linear infinite; }
.ck-ring-rev { animation: ck-spin-rev 6s linear infinite; }
.ck-avatar   { animation: ck-avatar 3.4s ease-in-out infinite; }

.ck-row {
  position: relative; overflow: hidden;
  animation: ck-slide .6s ease-out both;
  transition: scale .2s ease;
}
.ck-row:hover { scale: 1.015; }
.ck-row::after {
  content: ""; position: absolute; top: 0; bottom: 0; left: 0; width: 35%;
  background: linear-gradient(100deg, transparent, rgba(var(--glow),.16), transparent);
  animation: ck-shine 6s ease-in-out 2s infinite; pointer-events: none;
}
.ck-chip {
  animation: ck-pop .5s cubic-bezier(.2,1.3,.4,1) both;
  transition: translate .2s ease, box-shadow .2s ease;
}
.ck-chip:hover { translate: 0 -.6cqw; box-shadow: 0 0 3.4cqw rgba(var(--glow),.55) !important; }

.ck-bar { animation: ck-rise .7s cubic-bezier(.2,.9,.3,1) 1s both; }
.ck-bar-glow {
  position: absolute; top: 0; left: 0; height: 2px; width: 35%;
  background: linear-gradient(90deg, transparent, var(--accent2), transparent);
  animation: ck-bar 3.6s ease-in-out infinite; pointer-events: none;
}
.ck-action svg { transition: translate .2s ease, scale .2s ease; }
.ck-action:hover svg { translate: 0 -.7cqw; scale: 1.2; }

.ck-overlay { animation: ck-fade .25s ease-out both; }
.ck-modal   { animation: ck-zoom .3s cubic-bezier(.2,1.2,.4,1) both; }

@media (prefers-reduced-motion: reduce) {
  .ck-bar-glow, .ck-row::after { display: none; }
  .ck-up, .ck-pop, .ck-name, .ck-line, .ck-ring, .ck-ring-rev, .ck-avatar,
  .ck-row, .ck-chip, .ck-bar, .ck-overlay, .ck-modal { animation: none; }
}
`;

/* ---------- Pieces ---------- */
const ContactRow = ({
  icon,
  text,
  href,
  i = 0,
}: {
  icon: React.ReactNode;
  text: string;
  href?: string;
  i?: number;
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
      className="ck-row flex items-center justify-between"
      style={{
        backgroundColor: "var(--row-bg)",
        borderRadius: "1.6cqw",
        border: "1px solid var(--row-border)",
        borderLeft: "1cqw solid var(--accent)",
        padding: "2.4cqw 3.2cqw",
        gap: "2.4cqw",
        backdropFilter: "blur(4px)",
        animationDelay: `${0.75 + i * 0.12}s`,
      }}
    >
      <div className="flex items-center min-w-0" style={{ gap: "2.4cqw" }}>
        <span className="flex-shrink-0" style={{ color: "var(--accent2)" }}>
          {icon}
        </span>
        {href ? (
          <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="truncate hover:opacity-70"
            style={{
              color: "var(--text)",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            {text}
          </a>
        ) : (
          <span
            className="truncate"
            style={{ color: "var(--text)", fontWeight: 500 }}
          >
            {text}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${text}`}
        className="flex-shrink-0 hover:opacity-70"
        style={{ color: "var(--accent2)" }}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
};

const SectionLabel = ({
  children,
  icon,
  delay = 0.6,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  delay?: number;
}) => (
  <h2
    className="ck-up flex items-center"
    style={{
      animationDelay: `${delay}s`,
      color: "var(--text)",
      fontWeight: 700,
      fontSize: "max(13px, 3cqw)",
      letterSpacing: "0.04em",
      gap: "1.8cqw",
    }}
  >
    <span style={{ color: "var(--accent2)" }}>{icon}</span>
    {children}
    <span
      aria-hidden="true"
      className="ck-line flex-1"
      style={{
        height: "1px",
        background: "linear-gradient(90deg, var(--accent), transparent)",
      }}
    />
  </h2>
);

/* ---------- The card ---------- */
interface CardShellProps {
  user?: User;
  theme: CardTheme;
  /** Absolutely-positioned background (usually an <svg>) */
  artwork: React.ReactNode;
  /** Extra CSS for the artwork's own animations */
  artworkCss?: string;
}

export const CardShell: React.FC<CardShellProps> = ({
  user,
  theme,
  artwork,
  artworkCss,
}) => {
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

  const handleSaveContact = () => {
    const name = (displayName || "Contact").trim();
    const parts = name.split(/\s+/);
    const family = parts.length > 1 ? parts[parts.length - 1] : "";
    const given = parts.length > 1 ? parts.slice(0, -1).join(" ") : name;

    const lines: string[] = ["BEGIN:VCARD", "VERSION:3.0"];
    lines.push(`FN:${vEsc(name)}`);
    lines.push(`N:${vEsc(family)};${vEsc(given)};;;`);
    phones.forEach((ph) => lines.push(`TEL;TYPE=CELL:${ph}`));
    emails.forEach((e, i) =>
      lines.push(`EMAIL;TYPE=INTERNET${i > 0 ? ",WORK" : ""}:${e}`),
    );
    websites.forEach((w) =>
      lines.push(`URL:${w.startsWith("http") ? w : `https://${w}`}`),
    );
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

  const cssVars = {
    "--accent": theme.accent,
    "--accent2": theme.accent2,
    "--text": theme.text,
    "--muted": theme.muted,
    "--glow": theme.glow,
    "--row-bg": theme.rowBg,
    "--row-border": theme.rowBorder,
    "--panel": theme.panel,
  } as React.CSSProperties;

  const actionStyle: React.CSSProperties = {
    padding: "2.6cqw 0",
    gap: "0.6cqw",
    color: theme.text,
  };
  const actionLabel: React.CSSProperties = {
    fontSize: "max(12px, 2.4cqw)",
    fontWeight: 600,
  };

  return (
    <div
      className="w-full flex justify-center"
      style={{ backgroundColor: "#f9fafb", minHeight: "100dvh" }}
    >
      <style>{KIT_CSS + (artworkCss ?? "")}</style>
      <div
        className="relative w-full max-w-lg overflow-clip flex flex-col"
        style={{
          ...cssVars,
          aspectRatio: "632 / 957",
          containerType: "inline-size",
          fontFamily: theme.font,
          backgroundColor: theme.bg,
        }}
      >
        {artwork}

        {/* ---------- Content ---------- */}
        <div
          className="relative flex flex-col items-center flex-1"
          style={{
            fontSize: "max(12px, 2.6cqw)",
            lineHeight: 1.4,
            paddingTop: "13cqw",
          }}
        >
          {/* Avatar */}
          <div
            className="ck-pop relative flex-shrink-0"
            style={{ width: "28cqw", height: "28cqw" }}
          >
            <div
              aria-hidden="true"
              className="ck-ring absolute rounded-full pointer-events-none"
              style={{
                inset: "-2.4cqw",
                border: "0.35cqw dashed rgba(var(--glow),0.6)",
              }}
            />
            <div
              aria-hidden="true"
              className="ck-ring-rev absolute rounded-full pointer-events-none"
              style={{
                inset: "-4.4cqw",
                border: "0.4cqw solid transparent",
                borderTopColor: theme.accent2,
                borderRightColor: theme.accent,
              }}
            />
            <div
              className="ck-avatar overflow-hidden rounded-full w-full h-full flex items-center justify-center"
              style={{
                backgroundColor: theme.panel,
                border: `0.8cqw solid ${theme.accent}`,
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
                <UserIcon size={56} style={{ color: theme.muted }} />
              )}
            </div>
          </div>

          {/* Name + bio */}
          <div
            className="w-full flex flex-col items-center text-center"
            style={{ padding: "0 8cqw", marginTop: "5cqw", gap: "1.4cqw" }}
          >
            {displayName && (
              <h1
                className="ck-name"
                style={{
                  color: theme.text,
                  fontWeight: 700,
                  fontSize: "max(20px, 5cqw)",
                  lineHeight: 1.1,
                }}
              >
                {displayName}
              </h1>
            )}
            {bio && (
              <p
                className="ck-up"
                style={{
                  animationDelay: "0.5s",
                  color: theme.muted,
                  fontWeight: 500,
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
              style={{ padding: "0 7cqw", marginTop: "5cqw", gap: "2cqw" }}
            >
              <SectionLabel icon={<Contact size={16} />}>Contact</SectionLabel>
              {emails.map((e, i) => (
                <ContactRow
                  i={i}
                  key={e}
                  icon={<Mail size={14} />}
                  text={e}
                  href={`mailto:${e}`}
                />
              ))}
              {phones.map((ph, i) => (
                <ContactRow
                  i={emails.length + i}
                  key={ph}
                  icon={<Phone size={14} />}
                  text={ph}
                  href={`tel:${ph}`}
                />
              ))}
              {websites.map((w, i) => (
                <ContactRow
                  i={emails.length + phones.length + i}
                  key={w}
                  icon={<Globe size={14} />}
                  text={w}
                  href={w.startsWith("http") ? w : `https://${w}`}
                />
              ))}
              {location && (
                <ContactRow
                  i={emails.length + phones.length + websites.length}
                  icon={<MapPin size={14} />}
                  text={location}
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
                />
              )}
            </div>
          )}

          {/* Socials */}
          {socials.length > 0 && (
            <div
              className="w-full flex flex-col"
              style={{ padding: "0 7cqw", marginTop: "4.4cqw", gap: "2cqw" }}
            >
              <SectionLabel icon={<Link2 size={16} />} delay={0.9}>
                Connect with me
              </SectionLabel>
              <div className="flex flex-wrap" style={{ gap: "2cqw" }}>
                {socials.map((link, idx) => {
                  const key = String(link.platform ?? "").toLowerCase();
                  return (
                    <a
                      key={link.id ?? link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="ck-chip inline-flex items-center"
                      style={{
                        animationDelay: `${1 + idx * 0.1}s`,
                        backgroundColor: theme.rowBg,
                        color: theme.text,
                        fontWeight: 600,
                        borderRadius: "999px",
                        border: `1px solid ${theme.accent}`,
                        boxShadow: "0 0 2cqw rgba(var(--glow),0.3)",
                        padding: "1.8cqw 3.4cqw",
                        gap: "2cqw",
                      }}
                    >
                      <span style={{ color: theme.accent2 }}>
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

        {/* ---------- Action bar ---------- */}
        <div className="ck-bar relative w-full flex-shrink-0">
          <div
            className="grid grid-cols-3 relative overflow-hidden"
            style={{
              backgroundColor: theme.barBg,
              backdropFilter: "blur(6px)",
              borderTop: `1px solid ${theme.accent}`,
              boxShadow: "0 -0.6cqw 3cqw rgba(var(--glow),0.25)",
            }}
          >
            <span aria-hidden="true" className="ck-bar-glow" />
            <button
              type="button"
              onClick={() => setShowQr(true)}
              className="ck-action flex flex-col items-center hover:opacity-80"
              style={actionStyle}
            >
              <QrCode size={18} style={{ color: theme.accent2 }} />
              <span style={actionLabel}>QR Code</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="ck-action flex flex-col items-center hover:opacity-80"
              style={actionStyle}
            >
              <Share2 size={18} style={{ color: theme.accent2 }} />
              <span style={actionLabel}>Share</span>
            </button>
            <button
              type="button"
              onClick={handleSaveContact}
              className="ck-action flex flex-col items-center hover:opacity-80"
              style={actionStyle}
            >
              <UserPlus size={18} style={{ color: theme.accent2 }} />
              <span style={actionLabel}>Save Contact</span>
            </button>
          </div>
        </div>

        {/* ---------- QR modal ---------- */}
        {showQr && (
          <div
            className="ck-overlay absolute inset-0 z-20 flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
            onClick={() => setShowQr(false)}
          >
            <div
              className="ck-modal relative rounded-2xl p-5 flex flex-col items-center gap-3"
              style={{
                backgroundColor: theme.panel,
                border: `1px solid ${theme.accent}`,
                boxShadow: "0 0 4cqw rgba(var(--glow),0.4)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowQr(false)}
                className="absolute top-2 right-2 hover:opacity-70"
                style={{ color: theme.text }}
                aria-label="Close"
              >
                <X size={16} />
              </button>
              <div className="bg-white p-2 rounded-lg">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(pageUrl)}`}
                  alt="QR code"
                  width={220}
                  height={220}
                />
              </div>
              <span
                className="text-sm font-medium"
                style={{ color: theme.text }}
              >
                {displayName}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
