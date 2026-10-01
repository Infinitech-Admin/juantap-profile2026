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
  X,
} from "lucide-react";
import type { Template, User } from "@/types/template";

interface MidnightGoldProps {
  template?: Template;
  user?: User;
}

/* ---------- Palette: midnight + gold ---------- */
const BG = "#0b0f1a";
const SURFACE = "#131a2b";
const LINE = "#243049";
const GOLD = "#f5c451";
const GOLD_D = "#d99a1f";
const TEXT = "#f1f5f9";
const SOFT = "#cbd5e1";
const MUTED = "#94a3b8";

const FONT = "'Outfit', 'Segoe UI', Arial, sans-serif";

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

const MG_CSS = `
@keyframes mg-up    { from { opacity: 0; translate: 0 3cqw; } to { opacity: 1; translate: 0 0; } }
@keyframes mg-pop   { from { opacity: 0; scale: .9; } to { opacity: 1; scale: 1; } }
@keyframes mg-glow  { from { opacity: .7; scale: 1; } to { opacity: 1; scale: 1.08; } }
@keyframes mg-spin  { to { rotate: 360deg; } }
@keyframes mg-rise  { from { translate: 0 100%; } to { translate: 0 0; } }

.mg-glow {
  position: absolute; top: -20cqw; left: 50%; width: 110cqw; height: 80cqw; translate: -50% 0;
  background: radial-gradient(closest-side, rgba(245,196,81,.22), transparent 70%);
  animation: mg-glow 6s ease-in-out infinite alternate; pointer-events: none;
}
.mg-dots {
  position: absolute; inset: 0; opacity: .5; pointer-events: none;
  background-image: radial-gradient(rgba(255,255,255,.07) 1px, transparent 1.4px);
  background-size: 5cqw 5cqw;
  -webkit-mask-image: linear-gradient(180deg, #000, transparent 60%);
  mask-image: linear-gradient(180deg, #000, transparent 60%);
}
.mg-ring {
  position: absolute; inset: -1.6cqw; border-radius: 9999px;
  background: conic-gradient(from 0deg, ${GOLD}, transparent 30%, ${GOLD_D} 60%, transparent 85%, ${GOLD});
  animation: mg-spin 8s linear infinite;
}
.mg-up   { animation: mg-up .6s ease-out both; }
.mg-pop  { animation: mg-pop .5s cubic-bezier(.2,1.2,.4,1) both; }
.mg-bar  { animation: mg-rise .6s cubic-bezier(.2,.9,.3,1) .5s both; }

.mg-act { transition: translate .2s ease, background-color .2s ease, color .2s ease; }
.mg-act:hover { translate: 0 -.6cqw; background-color: ${GOLD} !important; color: ${BG} !important; }
.mg-row { transition: border-color .2s ease, translate .2s ease; }
.mg-row:hover { border-color: ${GOLD} !important; translate: 0 -.3cqw; }
.mg-soc { transition: translate .2s ease, background-color .2s ease, color .2s ease; }
.mg-soc:hover { translate: 0 -.5cqw; background-color: ${GOLD} !important; color: ${BG} !important; }

@media (prefers-reduced-motion: reduce) {
  .mg-glow, .mg-ring { animation: none; }
  .mg-up, .mg-pop, .mg-bar { animation: none; }
}
`;

const Divider = ({ label, delay = 0.5 }: { label: string; delay?: number }) => (
  <div
    className="mg-up flex items-center"
    style={{ animationDelay: `${delay}s`, gap: "3cqw" }}
  >
    <span style={{ flex: 1, height: 1, backgroundColor: LINE }} />
    <span
      style={{
        color: GOLD,
        fontWeight: 700,
        fontSize: "max(11px, 2.4cqw)",
        letterSpacing: "0.28em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
    <span style={{ flex: 1, height: 1, backgroundColor: LINE }} />
  </div>
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
      className="mg-row mg-up flex items-center"
      style={{
        animationDelay: `${0.55 + i * 0.07}s`,
        gap: "3.4cqw",
        padding: "2.6cqw 3.4cqw",
        borderRadius: "3cqw",
        backgroundColor: SURFACE,
        border: `1px solid ${LINE}`,
      }}
    >
      <span
        className="flex-shrink-0 flex items-center justify-center"
        style={{
          width: "9.4cqw",
          height: "9.4cqw",
          borderRadius: "999px",
          backgroundColor: "rgba(245,196,81,.14)",
          color: GOLD,
        }}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p
          style={{
            color: MUTED,
            fontSize: "max(10px, 2.1cqw)",
            letterSpacing: "0.14em",
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

export const MidnightGold: React.FC<MidnightGoldProps> = ({ user }) => {
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

  /* Round quick-action buttons (only the ones with data) */
  const actions: { label: string; href: string; icon: React.ReactNode }[] = [];
  if (phones[0])
    actions.push({
      label: "Call",
      href: `tel:${phones[0]}`,
      icon: <Phone size={19} />,
    });
  if (emails[0])
    actions.push({
      label: "Email",
      href: `mailto:${emails[0]}`,
      icon: <Mail size={19} />,
    });
  if (websites[0])
    actions.push({
      label: "Website",
      href: webHref(websites[0]),
      icon: <Globe size={19} />,
    });
  if (location)
    actions.push({ label: "Map", href: mapHref, icon: <MapPin size={19} /> });

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
    border: `1px solid ${LINE}`,
    color: GOLD,
    backgroundColor: SURFACE,
  };

  return (
    <div
      className="w-full flex justify-center"
      style={{ backgroundColor: "#05080f", minHeight: "100dvh" }}
    >
      <style>{MG_CSS}</style>

      {/* No overflow-hidden here: the card grows with its content.
          aspect-ratio only acts as the minimum height. */}
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
        {/* Background decoration (clipped in its own wrapper) */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <div className="mg-glow" />
          <div className="mg-dots" />
        </div>

        {/* Content */}
        <div
          className="relative flex flex-col flex-1"
          style={{
            fontSize: "max(13px, 3cqw)",
            lineHeight: 1.45,
            padding: "10cqw 6cqw 5cqw",
            gap: "5cqw",
            zIndex: 10,
          }}
        >
          {/* Identity (centered) */}
          <div
            className="mg-up flex flex-col items-center text-center"
            style={{ gap: "2cqw" }}
          >
            <div
              className="relative"
              style={{ width: "34cqw", height: "34cqw" }}
            >
              <span aria-hidden="true" className="mg-ring" />
              <div
                className="relative w-full h-full overflow-hidden flex items-center justify-center"
                style={{
                  borderRadius: "999px",
                  border: `1cqw solid ${BG}`,
                  backgroundColor: SURFACE,
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
                  <UserIcon size={46} style={{ color: MUTED }} />
                )}
              </div>
            </div>

            {displayName && (
              <h1
                style={{
                  marginTop: "3cqw",
                  color: TEXT,
                  fontWeight: 700,
                  fontSize: "max(22px, 7.4cqw)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.01em",
                  overflowWrap: "anywhere",
                }}
              >
                {displayName}
              </h1>
            )}
            {jobTitle && (
              <p
                style={{
                  color: GOLD,
                  fontWeight: 600,
                  fontSize: "max(12px, 2.8cqw)",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                }}
              >
                {jobTitle}
              </p>
            )}
            {company && (
              <p
                className="inline-flex items-center"
                style={{
                  gap: "1.6cqw",
                  color: SOFT,
                  fontSize: "max(13px, 3cqw)",
                }}
              >
                <Building2 size={14} style={{ color: MUTED }} />
                {company}
              </p>
            )}
          </div>

          {/* Quick actions */}
          {actions.length > 0 && (
            <div className="flex justify-center" style={{ gap: "5cqw" }}>
              {actions.map((a, i) => (
                <a
                  key={a.label}
                  href={a.href}
                  target={a.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={a.label}
                  title={a.label}
                  className="mg-act mg-pop flex flex-col items-center justify-center"
                  style={{
                    ...roundBtn,
                    width: "14cqw",
                    height: "14cqw",
                    animationDelay: `${0.25 + i * 0.07}s`,
                    textDecoration: "none",
                  }}
                >
                  {a.icon}
                </a>
              ))}
            </div>
          )}

          {/* Bio */}
          {bio && (
            <p
              className="mg-up text-center"
              style={{
                animationDelay: ".4s",
                color: SOFT,
                whiteSpace: "pre-line",
                padding: "0 3cqw",
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
              <Divider label="Contact" />
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
              <Divider label="Connect" delay={0.8} />
              <div
                className="flex flex-wrap justify-center"
                style={{ gap: "3cqw" }}
              >
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
                      className="mg-soc mg-pop flex items-center justify-center"
                      style={{
                        ...roundBtn,
                        animationDelay: `${0.85 + idx * 0.06}s`,
                      }}
                    >
                      {SOCIAL_ICONS[key] || <Globe size={18} />}
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* QR panel (white background so it scans reliably) */}
          {showQr && (
            <div
              className="mg-pop relative flex items-center"
              style={{
                marginTop: "auto",
                gap: "5cqw",
                padding: "4cqw",
                borderRadius: "3.4cqw",
                backgroundColor: "#ffffff",
                color: BG,
                boxShadow: "0 3cqw 8cqw rgba(0,0,0,.5)",
              }}
            >
              <button
                type="button"
                onClick={() => setShowQr(false)}
                aria-label="Close QR code"
                className="absolute hover:opacity-70"
                style={{ top: "2.4cqw", right: "2.4cqw", color: "#475569" }}
              >
                <X size={16} />
              </button>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=0&data=${encodeURIComponent(pageUrl)}`}
                alt="QR code"
                style={{ width: "30cqw", height: "30cqw", display: "block" }}
              />
              <div className="min-w-0">
                <p
                  style={{
                    color: GOLD_D,
                    fontWeight: 700,
                    fontSize: "max(10px, 2.2cqw)",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                  }}
                >
                  Scan to connect
                </p>
                {displayName && (
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: "max(15px, 4.2cqw)",
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

        {/* Bottom bar (sticky so it's always reachable) */}
        <div
          className="mg-bar w-full flex-shrink-0 flex items-center"
          style={{
            position: "sticky",
            bottom: 0,
            zIndex: 20,
            gap: "2.6cqw",
            padding: "3cqw 6cqw",
            backgroundColor: "rgba(11,15,26,.95)",
            backdropFilter: "blur(8px)",
            borderTop: `1px solid ${LINE}`,
          }}
        >
          <button
            type="button"
            onClick={handleSaveContact}
            className="flex-1 flex items-center justify-center hover:opacity-90"
            style={{
              gap: "2cqw",
              padding: "3.2cqw 0",
              borderRadius: "999px",
              color: BG,
              fontWeight: 700,
              fontSize: "max(13px, 3cqw)",
              background: `linear-gradient(135deg, ${GOLD_D}, ${GOLD})`,
              boxShadow: "0 2cqw 5cqw rgba(245,196,81,.25)",
            }}
          >
            <UserPlus size={18} /> Save Contact
          </button>
          <button
            type="button"
            onClick={() => setShowQr((s) => !s)}
            aria-label="Toggle QR code"
            aria-pressed={showQr}
            className="flex items-center justify-center hover:opacity-80"
            style={{
              ...roundBtn,
              backgroundColor: showQr ? "rgba(245,196,81,.18)" : SURFACE,
            }}
          >
            <QrCode size={18} />
          </button>
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share"
            className="flex items-center justify-center hover:opacity-80"
            style={roundBtn}
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MidnightGold;
