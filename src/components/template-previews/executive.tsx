"use client";

// src/components/template-previews/executive.tsx
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
  Building2,
} from "lucide-react";
import type { Template, User } from "@/types/template";

interface ExecutiveProps {
  template?: Template;
  user?: User;
}

/* ---------- Palette: black & gold ---------- */
const BG = "#09090b";
const GOLD = "#c9a24b";
const GOLD_LIGHT = "#f1d98a";
const GOLD_DEEP = "#8a6a1f";
const TEXT = "#f5f1e8";
const MUTED = "#a39c8b";
const ROW_BG = "rgba(255,255,255,0.035)";
const ROW_BORDER = "rgba(201,162,75,0.28)";

const FONT = "Poppins, 'Segoe UI', Arial, sans-serif";
const FONT_TITLE = "'Playfair Display', Georgia, 'Times New Roman', serif";

const TikTokIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06Z" />
  </svg>
);

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  facebook: <Facebook size={16} />,
  instagram: <Instagram size={16} />,
  twitter: <Twitter size={16} />,
  linkedin: <Linkedin size={16} />,
  github: <Github size={16} />,
  youtube: <Youtube size={16} />,
  tiktok: <TikTokIcon size={16} />,
  telegram: <Send size={16} />,
  viber: <MessageCircle size={16} />,
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

/* ---------- vCard helper ---------- */
const vEsc = (s: string) =>
  s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");

const EX_CSS = `
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap");

@keyframes ex-up      { from { opacity: 0; translate: 0 3.5cqw; } to { opacity: 1; translate: 0 0; } }
@keyframes ex-slide   { from { opacity: 0; translate: -5cqw 0; } to { opacity: 1; translate: 0 0; } }
@keyframes ex-pop     { from { opacity: 0; scale: .8; } to { opacity: 1; scale: 1; } }
@keyframes ex-draw    { from { scale: 0 1; } to { scale: 1 1; } }
@keyframes ex-spin    { to { rotate: 360deg; } }
@keyframes ex-rise    { from { translate: 0 100%; } to { translate: 0 0; } }
@keyframes ex-fade    { from { opacity: 0; } to { opacity: 1; } }
@keyframes ex-zoom    { from { opacity: 0; scale: .9; } to { opacity: 1; scale: 1; } }
@keyframes ex-sheen   { from { background-position: 130% 0; } to { background-position: -130% 0; } }
@keyframes ex-drift-a { from { translate: -12cqw -6cqw; } to { translate: 14cqw 8cqw; } }
@keyframes ex-drift-b { from { translate: 14cqw 6cqw; } to { translate: -12cqw -8cqw; } }
@keyframes ex-bar     { from { translate: -100% 0; } to { translate: 300% 0; } }
@keyframes ex-shine   { from { translate: -120% 0; } to { translate: 320% 0; } }
@keyframes ex-glow    {
  0%,100% { box-shadow: 0 0 3cqw rgba(201,162,75,.25); }
  50%     { box-shadow: 0 0 6cqw rgba(241,217,138,.5); }
}

.ex-glow-a, .ex-glow-b {
  position: absolute; pointer-events: none; border-radius: 9999px;
  width: 80cqw; height: 80cqw; filter: blur(8cqw);
}
.ex-glow-a { top: -20cqw; left: -20cqw; background: rgba(201,162,75,.22); animation: ex-drift-a 14s ease-in-out infinite alternate; }
.ex-glow-b { bottom: 10cqw; right: -25cqw; background: rgba(138,106,31,.2); animation: ex-drift-b 18s ease-in-out infinite alternate; }

.ex-grid {
  position: absolute; inset: 0; pointer-events: none; opacity: .5;
  background-image:
    linear-gradient(rgba(201,162,75,.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(201,162,75,.06) 1px, transparent 1px);
  background-size: 8cqw 8cqw;
  -webkit-mask-image: radial-gradient(ellipse at 50% 30%, #000 20%, transparent 75%);
  mask-image: radial-gradient(ellipse at 50% 30%, #000 20%, transparent 75%);
}

.ex-topline {
  position: absolute; top: 0; left: 0; right: 0; height: 3px; overflow: hidden;
  background: linear-gradient(90deg, ${GOLD_DEEP}, ${GOLD_LIGHT}, ${GOLD_DEEP});
}

.ex-up      { animation: ex-up .7s ease-out both; }
.ex-pop     { animation: ex-pop .8s cubic-bezier(.2,1.2,.4,1) both; }
.ex-line    { transform-origin: left center; animation: ex-draw .9s ease-out .6s both; }
.ex-line-c  { transform-origin: center; animation: ex-draw 1s ease-out .5s both; }
.ex-ring    { animation: ex-spin 14s linear infinite; }
.ex-avatar  { animation: ex-glow 3.4s ease-in-out infinite; }

.ex-name {
  background: linear-gradient(100deg, ${TEXT} 35%, ${GOLD_LIGHT} 50%, ${TEXT} 65%);
  background-size: 250% 100%;
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; color: transparent;
  animation: ex-up .7s ease-out .3s both, ex-sheen 7s linear 1.2s infinite;
}

.ex-row {
  position: relative; overflow: hidden;
  animation: ex-slide .6s ease-out both;
  transition: scale .2s ease, background-color .2s ease, border-color .2s ease;
}
.ex-row:hover { scale: 1.012; background-color: rgba(201,162,75,.08) !important; border-color: ${GOLD} !important; }
.ex-row::after {
  content: ""; position: absolute; top: 0; bottom: 0; left: 0; width: 30%;
  background: linear-gradient(100deg, transparent, rgba(241,217,138,.12), transparent);
  animation: ex-shine 7s ease-in-out 2.5s infinite; pointer-events: none;
}

.ex-chip {
  animation: ex-pop .5s cubic-bezier(.2,1.2,.4,1) both;
  transition: translate .2s ease, background-color .2s ease, color .2s ease;
}
.ex-chip:hover { translate: 0 -.6cqw; background-color: ${GOLD} !important; color: ${BG} !important; }

.ex-bar { animation: ex-rise .7s cubic-bezier(.2,.9,.3,1) .9s both; }
.ex-bar-glow {
  position: absolute; top: 0; left: 0; height: 2px; width: 35%;
  background: linear-gradient(90deg, transparent, ${GOLD_LIGHT}, transparent);
  animation: ex-bar 3.6s ease-in-out infinite; pointer-events: none;
}
.ex-action svg { transition: translate .2s ease, scale .2s ease; }
.ex-action:hover svg { translate: 0 -.6cqw; scale: 1.15; }

.ex-overlay { animation: ex-fade .25s ease-out both; }
.ex-modal   { animation: ex-zoom .3s cubic-bezier(.2,1.2,.4,1) both; }

@media (prefers-reduced-motion: reduce) {
  .ex-glow-a, .ex-glow-b, .ex-bar-glow, .ex-row::after { display: none; }
  .ex-up, .ex-pop, .ex-line, .ex-line-c, .ex-ring, .ex-avatar, .ex-name,
  .ex-row, .ex-chip, .ex-bar, .ex-overlay, .ex-modal { animation: none; }
  .ex-name { -webkit-text-fill-color: ${TEXT}; color: ${TEXT}; background: none; }
}
`;

/* ---------- Contact row with copy button ---------- */
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
      className="ex-row flex items-center justify-between"
      style={{
        backgroundColor: ROW_BG,
        borderRadius: "1.6cqw",
        border: `1px solid ${ROW_BORDER}`,
        padding: "2.6cqw 3.4cqw",
        gap: "2.4cqw",
        animationDelay: `${0.7 + i * 0.1}s`,
      }}
    >
      <div className="flex items-center min-w-0" style={{ gap: "2.6cqw" }}>
        <span className="flex-shrink-0" style={{ color: GOLD }}>
          {icon}
        </span>
        {href ? (
          <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="truncate hover:opacity-70"
            style={{ color: TEXT, fontWeight: 500, textDecoration: "none" }}
          >
            {text}
          </a>
        ) : (
          <span className="truncate" style={{ color: TEXT, fontWeight: 500 }}>
            {text}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${text}`}
        className="flex-shrink-0 hover:opacity-70"
        style={{ color: GOLD }}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
};

const SectionLabel = ({
  children,
  delay = 0.6,
}: {
  children: React.ReactNode;
  delay?: number;
}) => (
  <h2
    className="ex-up flex items-center"
    style={{
      animationDelay: `${delay}s`,
      color: GOLD,
      fontWeight: 600,
      fontSize: "max(11px, 2.4cqw)",
      letterSpacing: "0.28em",
      textTransform: "uppercase",
      gap: "2.4cqw",
    }}
  >
    {children}
    <span
      aria-hidden="true"
      className="ex-line flex-1"
      style={{
        height: "1px",
        background: `linear-gradient(90deg, ${GOLD}, transparent)`,
      }}
    />
  </h2>
);

export const Executive: React.FC<ExecutiveProps> = ({ user }) => {
  const [showQr, setShowQr] = useState(false);

  const avatarUrl = user?.avatar_url || null;
  const p: any = user?.profile ?? {};
  const displayName =
    (user as any)?.display_name || user?.name || (user as any)?.username || "";

  // Optional company fields (hidden when not provided)
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

  /* Save to phone contacts (downloads a .vcf that the phone offers to import) */
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

  const actionStyle: React.CSSProperties = {
    padding: "2.8cqw 0",
    gap: "0.6cqw",
    color: TEXT,
  };
  const actionLabel: React.CSSProperties = {
    fontSize: "max(12px, 2.4cqw)",
    fontWeight: 600,
    letterSpacing: "0.04em",
  };

  return (
    <div
      className="w-full flex justify-center"
      style={{ backgroundColor: "#f9fafb", minHeight: "100dvh" }}
    >
      <style>{EX_CSS}</style>
      <div
        className="relative w-full max-w-lg overflow-clip flex flex-col"
        style={{
          minHeight: "100dvh",
          containerType: "inline-size",
          fontFamily: FONT,
          backgroundColor: BG,
        }}
      >
        {/* ---------- Atmosphere ---------- */}
        <span aria-hidden="true" className="ex-glow-a" />
        <span aria-hidden="true" className="ex-glow-b" />
        <span aria-hidden="true" className="ex-grid" />
        <span aria-hidden="true" className="ex-topline" />

        {/* ---------- Content ---------- */}
        <div
          className="relative flex flex-col items-center flex-1"
          style={{
            fontSize: "max(13px, 2.9cqw)",
            lineHeight: 1.45,
            padding: "12cqw 6cqw 6cqw",
            gap: "4.5cqw",
            zIndex: 10,
          }}
        >
          {/* Header: avatar, name, title, company */}
          <div className="flex flex-col items-center text-center w-full">
            <div className="ex-pop" style={{ width: "30cqw", height: "30cqw" }}>
              <div className="relative w-full h-full">
                <div
                  aria-hidden="true"
                  className="ex-ring absolute rounded-full pointer-events-none"
                  style={{
                    inset: "-1.6cqw",
                    background: `conic-gradient(from 0deg, ${GOLD_DEEP}, ${GOLD_LIGHT}, ${GOLD_DEEP}, ${GOLD_LIGHT}, ${GOLD_DEEP})`,
                    padding: "0.5cqw",
                    WebkitMask:
                      "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                />
                <div
                  className="ex-avatar overflow-hidden rounded-full w-full h-full flex items-center justify-center"
                  style={{
                    backgroundColor: "#16130c",
                    border: `0.7cqw solid ${GOLD}`,
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
                    <UserIcon size={52} style={{ color: MUTED }} />
                  )}
                </div>
              </div>
            </div>

            {displayName && (
              <h1
                className="ex-name"
                style={{
                  marginTop: "5cqw",
                  fontFamily: FONT_TITLE,
                  fontWeight: 700,
                  fontSize: "max(26px, 8cqw)",
                  lineHeight: 1.1,
                  letterSpacing: "0.01em",
                }}
              >
                {displayName}
              </h1>
            )}

            {jobTitle && (
              <p
                className="ex-up"
                style={{
                  animationDelay: "0.45s",
                  marginTop: "1.8cqw",
                  color: GOLD,
                  fontWeight: 600,
                  fontSize: "max(11px, 2.5cqw)",
                  letterSpacing: "0.26em",
                  textTransform: "uppercase",
                }}
              >
                {jobTitle}
              </p>
            )}

            {company && (
              <span
                className="ex-up inline-flex items-center"
                style={{
                  animationDelay: "0.55s",
                  marginTop: "3cqw",
                  gap: "1.6cqw",
                  color: TEXT,
                  fontWeight: 500,
                  border: `1px solid ${ROW_BORDER}`,
                  backgroundColor: ROW_BG,
                  borderRadius: "999px",
                  padding: "1.4cqw 3.6cqw",
                }}
              >
                <Building2 size={14} style={{ color: GOLD }} />
                {company}
              </span>
            )}

            <span
              aria-hidden="true"
              className="ex-line-c"
              style={{
                display: "block",
                width: "40cqw",
                height: "1px",
                marginTop: "5cqw",
                background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
              }}
            />

            {bio && (
              <p
                className="ex-up"
                style={{
                  animationDelay: "0.65s",
                  marginTop: "4cqw",
                  color: MUTED,
                  fontWeight: 400,
                  whiteSpace: "pre-line",
                  display: "-webkit-box",
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {bio}
              </p>
            )}
          </div>

          {/* Contact */}
          {hasContact && (
            <div className="w-full flex flex-col" style={{ gap: "2.2cqw" }}>
              <SectionLabel>Contact</SectionLabel>
              {emails.map((e, i) => (
                <ContactRow
                  i={i}
                  key={e}
                  icon={<Mail size={15} />}
                  text={e}
                  href={`mailto:${e}`}
                />
              ))}
              {phones.map((ph, i) => (
                <ContactRow
                  i={emails.length + i}
                  key={ph}
                  icon={<Phone size={15} />}
                  text={ph}
                  href={`tel:${ph}`}
                />
              ))}
              {websites.map((w, i) => (
                <ContactRow
                  i={emails.length + phones.length + i}
                  key={w}
                  icon={<Globe size={15} />}
                  text={w}
                  href={w.startsWith("http") ? w : `https://${w}`}
                />
              ))}
              {location && (
                <ContactRow
                  i={emails.length + phones.length + websites.length}
                  icon={<MapPin size={15} />}
                  text={location}
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
                />
              )}
            </div>
          )}

          {/* Connect */}
          {socials.length > 0 && (
            <div className="w-full flex flex-col" style={{ gap: "2.4cqw" }}>
              <SectionLabel delay={0.85}>Connect</SectionLabel>
              <div className="flex flex-wrap" style={{ gap: "2.2cqw" }}>
                {socials.map((link, idx) => {
                  const key = String(link.platform ?? "").toLowerCase();
                  return (
                    <a
                      key={link.id ?? link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="ex-chip inline-flex items-center"
                      style={{
                        animationDelay: `${0.95 + idx * 0.08}s`,
                        backgroundColor: ROW_BG,
                        color: TEXT,
                        fontWeight: 500,
                        borderRadius: "999px",
                        border: `1px solid ${ROW_BORDER}`,
                        padding: "1.8cqw 3.6cqw",
                        gap: "2cqw",
                        textDecoration: "none",
                      }}
                    >
                      <span style={{ color: "inherit" }}>
                        {SOCIAL_ICONS[key] || <Globe size={16} />}
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
        </div>

        {/* ---------- Bottom action bar ---------- */}
        <div
          className="ex-bar relative w-full flex-shrink-0"
          style={{ zIndex: 10 }}
        >
          <div
            className="grid grid-cols-3 relative overflow-hidden"
            style={{
              backgroundColor: "rgba(9,9,11,0.88)",
              backdropFilter: "blur(8px)",
              borderTop: `1px solid ${ROW_BORDER}`,
            }}
          >
            <span aria-hidden="true" className="ex-bar-glow" />
            <button
              type="button"
              onClick={() => setShowQr(true)}
              className="ex-action flex flex-col items-center hover:opacity-80"
              style={actionStyle}
            >
              <QrCode size={18} style={{ color: GOLD }} />
              <span style={actionLabel}>QR Code</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="ex-action flex flex-col items-center hover:opacity-80"
              style={actionStyle}
            >
              <Share2 size={18} style={{ color: GOLD }} />
              <span style={actionLabel}>Share</span>
            </button>
            <button
              type="button"
              onClick={handleSaveContact}
              className="ex-action flex flex-col items-center hover:opacity-80"
              style={actionStyle}
            >
              <UserPlus size={18} style={{ color: GOLD }} />
              <span style={actionLabel}>Save Contact</span>
            </button>
          </div>
        </div>

        {/* ---------- QR modal ---------- */}
        {showQr && (
          <div
            className="ex-overlay absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.75)", zIndex: 30 }}
            onClick={() => setShowQr(false)}
          >
            <div
              className="ex-modal relative rounded-2xl p-5 flex flex-col items-center gap-3"
              style={{
                backgroundColor: "#121110",
                border: `1px solid ${GOLD}`,
                boxShadow: `0 0 4cqw rgba(201,162,75,0.35)`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowQr(false)}
                className="absolute top-2 right-2 hover:opacity-70"
                style={{ color: TEXT }}
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
              <span className="text-sm font-medium" style={{ color: TEXT }}>
                {displayName}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Executive;
