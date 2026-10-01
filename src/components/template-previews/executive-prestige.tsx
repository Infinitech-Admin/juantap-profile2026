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
  X,
} from "lucide-react";
import type { Template, User } from "@/types/template";

interface ExecutivePrestigeProps {
  template?: Template;
  user?: User;
}

/* ---------- Palette: onyx + ivory + champagne gold ---------- */
const ONYX = "#0e0f13";
const ONYX_2 = "#1a1c23";
const IVORY = "#faf8f3";
const PAPER = "#ffffff";
const GOLD = "#b8935a";
const GOLD_L = "#e2c892";
const TEXT = "#16181d";
const MUTED = "#5b6070";
const HAIR = "#e6e0d3";

const SERIF = "'Playfair Display', 'Cormorant Garamond', Georgia, serif";
const SANS = "'Inter', 'Segoe UI', Arial, sans-serif";

const TikTokIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06Z" />
  </svg>
);

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  facebook: <Facebook size={17} />,
  instagram: <Instagram size={17} />,
  twitter: <Twitter size={17} />,
  linkedin: <Linkedin size={17} />,
  github: <Github size={17} />,
  youtube: <Youtube size={17} />,
  tiktok: <TikTokIcon size={17} />,
  telegram: <Send size={17} />,
  viber: <MessageCircle size={17} />,
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

const EP_CSS = `
@keyframes ep-up   { from { opacity: 0; translate: 0 2.4cqw; } to { opacity: 1; translate: 0 0; } }
@keyframes ep-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes ep-rise { from { translate: 0 100%; } to { translate: 0 0; } }
@keyframes ep-shine { from { translate: -120% 0; } to { translate: 320% 0; } }

.ep-pattern {
  position: absolute; inset: 0; overflow: hidden; pointer-events: none;
  background:
    radial-gradient(70% 90% at 50% 0%, rgba(184,147,90,.22), transparent 65%),
    linear-gradient(180deg, ${ONYX_2}, ${ONYX});
}
.ep-pattern::before {
  content: ""; position: absolute; inset: 0; opacity: .5;
  background-image: repeating-linear-gradient(135deg, rgba(255,255,255,.035) 0 1px, transparent 1px 3.2cqw);
}
.ep-pattern::after {
  content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 1px;
  background: linear-gradient(90deg, transparent, ${GOLD}, transparent);
}

.ep-up   { animation: ep-up .7s ease-out both; }
.ep-fade { animation: ep-fade .9s ease-out both; }
.ep-bar  { animation: ep-rise .6s cubic-bezier(.2,.9,.3,1) .5s both; }

.ep-act { transition: translate .2s ease, background-color .2s ease, color .2s ease, border-color .2s ease; }
.ep-act:hover { translate: 0 -.5cqw; background-color: ${ONYX} !important; color: ${GOLD_L} !important; border-color: ${ONYX} !important; }
.ep-row { transition: background-color .2s ease; }
.ep-row:hover { background-color: rgba(184,147,90,.08); }
.ep-soc { transition: translate .2s ease, background-color .2s ease, color .2s ease; }
.ep-soc:hover { translate: 0 -.5cqw; background-color: ${ONYX} !important; color: ${GOLD_L} !important; }

.ep-save { position: relative; overflow: hidden; }
.ep-save::after {
  content: ""; position: absolute; top: 0; bottom: 0; width: 30%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent);
  animation: ep-shine 4s ease-in-out infinite; pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .ep-up, .ep-fade, .ep-bar { animation: none; }
  .ep-save::after { display: none; }
}
`;

/* Section title with diamond ornament */
const Title = ({
  children,
  delay = 0.5,
}: {
  children: React.ReactNode;
  delay?: number;
}) => (
  <div
    className="ep-up flex items-center justify-center"
    style={{ animationDelay: `${delay}s`, gap: "3cqw" }}
  >
    <span style={{ flex: 1, height: 1, backgroundColor: HAIR }} />
    <span
      style={{
        color: GOLD,
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: "max(11px, 2.3cqw)",
        letterSpacing: "0.32em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
    <span style={{ flex: 1, height: 1, backgroundColor: HAIR }} />
  </div>
);

const Row = ({
  icon,
  label,
  text,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  text: string;
  href?: string;
}) => {
  const inner = (
    <div
      className="ep-row flex items-center"
      style={{
        gap: "4cqw",
        padding: "3cqw 2cqw",
        borderBottom: `1px solid ${HAIR}`,
      }}
    >
      <span
        className="flex-shrink-0 flex items-center justify-center"
        style={{
          width: "9.6cqw",
          height: "9.6cqw",
          borderRadius: "999px",
          border: `1px solid ${GOLD}`,
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
            letterSpacing: "0.18em",
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

export const ExecutivePrestige: React.FC<ExecutivePrestigeProps> = ({
  user,
}) => {
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
      icon: <Phone size={18} />,
    });
  if (emails[0])
    actions.push({
      label: "Email",
      href: `mailto:${emails[0]}`,
      icon: <Mail size={18} />,
    });
  if (websites[0])
    actions.push({
      label: "Website",
      href: webHref(websites[0]),
      icon: <Globe size={18} />,
    });
  if (location)
    actions.push({ label: "Map", href: mapHref, icon: <MapPin size={18} /> });

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

  const squareBtn: React.CSSProperties = {
    width: "12cqw",
    height: "12cqw",
    borderRadius: "2.4cqw",
    border: `1px solid ${GOLD}`,
    color: ONYX,
    backgroundColor: PAPER,
  };

  return (
    <div
      className="w-full flex justify-center"
      style={{ backgroundColor: "#ece8de", minHeight: "100dvh" }}
    >
      <style>{EP_CSS}</style>

      {/* No overflow-hidden: grows with content. aspect-ratio = minimum height only. */}
      <div
        className="relative w-full max-w-lg flex flex-col"
        style={{
          aspectRatio: "632 / 957",
          containerType: "inline-size",
          fontFamily: SANS,
          backgroundColor: IVORY,
          color: TEXT,
          boxShadow: "0 0 60px rgba(14,15,19,.12)",
        }}
      >
        {/* ---------- Dark header with overlapping portrait ---------- */}
        <header
          className="relative flex flex-col items-center"
          style={{ padding: "8cqw 6cqw 0", zIndex: 5 }}
        >
          <div aria-hidden="true" className="ep-pattern" />

          <p
            className="relative ep-fade text-center"
            style={{
              color: GOLD_L,
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: "max(11px, 2.4cqw)",
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              minHeight: "3cqw",
              overflowWrap: "anywhere",
            }}
          >
            {company || "Executive Profile"}
          </p>

          {/* Arch portrait */}
          <div
            className="relative ep-up"
            style={{
              marginTop: "6cqw",
              marginBottom: "-22cqw",
              width: "38cqw",
              aspectRatio: "4 / 5",
              borderRadius: "19cqw 19cqw 3cqw 3cqw",
              overflow: "hidden",
              backgroundColor: ONYX_2,
              boxShadow: `0 0 0 1cqw ${IVORY}, 0 0 0 1.7cqw ${GOLD}, 0 4cqw 9cqw rgba(0,0,0,.35)`,
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
              <div className="w-full h-full flex items-center justify-center">
                <UserIcon size={48} style={{ color: "#8a8f9c" }} />
              </div>
            )}
          </div>
        </header>

        {/* ---------- Content ---------- */}
        <div
          className="relative flex flex-col flex-1"
          style={{
            fontSize: "max(13px, 3cqw)",
            lineHeight: 1.5,
            padding: "28cqw 6cqw 6cqw",
            gap: "5.4cqw",
            zIndex: 1,
          }}
        >
          {/* Name block */}
          <div className="ep-up text-center" style={{ animationDelay: ".15s" }}>
            {displayName && (
              <h1
                style={{
                  color: TEXT,
                  fontFamily: SERIF,
                  fontWeight: 600,
                  fontSize: "max(26px, 8cqw)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.005em",
                  overflowWrap: "anywhere",
                }}
              >
                {displayName}
              </h1>
            )}
            {jobTitle && (
              <p
                style={{
                  marginTop: "2.2cqw",
                  color: GOLD,
                  fontWeight: 700,
                  fontSize: "max(12px, 2.7cqw)",
                  letterSpacing: "0.26em",
                  textTransform: "uppercase",
                }}
              >
                {jobTitle}
              </p>
            )}
            {/* ornament */}
            <div
              className="flex items-center justify-center"
              style={{ gap: "2cqw", marginTop: "3.4cqw" }}
              aria-hidden="true"
            >
              <span
                style={{ width: "12cqw", height: 1, backgroundColor: GOLD }}
              />
              <span
                style={{
                  width: "1.8cqw",
                  height: "1.8cqw",
                  backgroundColor: GOLD,
                  rotate: "45deg",
                }}
              />
              <span
                style={{ width: "12cqw", height: 1, backgroundColor: GOLD }}
              />
            </div>
          </div>

          {/* Bio */}
          {bio && (
            <p
              className="ep-up text-center"
              style={{
                animationDelay: ".3s",
                color: MUTED,
                fontFamily: SERIF,
                fontStyle: "italic",
                fontSize: "max(14px, 3.4cqw)",
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

          {/* Quick actions */}
          {actions.length > 0 && (
            <div className="flex justify-center" style={{ gap: "4cqw" }}>
              {actions.map((a, i) => (
                <a
                  key={a.label}
                  href={a.href}
                  target={a.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={a.label}
                  title={a.label}
                  className="ep-act ep-up flex items-center justify-center"
                  style={{
                    ...squareBtn,
                    width: "14cqw",
                    height: "14cqw",
                    animationDelay: `${0.35 + i * 0.07}s`,
                    textDecoration: "none",
                  }}
                >
                  {a.icon}
                </a>
              ))}
            </div>
          )}

          {/* Contact */}
          {hasContact && (
            <div className="flex flex-col">
              <Title delay={0.5}>Contact</Title>
              <div style={{ marginTop: "2cqw" }}>
                {emails.map((e) => (
                  <Row
                    key={e}
                    icon={<Mail size={16} />}
                    label="Email"
                    text={e}
                    href={`mailto:${e}`}
                  />
                ))}
                {phones.map((ph) => (
                  <Row
                    key={ph}
                    icon={<Phone size={16} />}
                    label="Phone"
                    text={ph}
                    href={`tel:${ph}`}
                  />
                ))}
                {websites.map((w) => (
                  <Row
                    key={w}
                    icon={<Globe size={16} />}
                    label="Website"
                    text={w}
                    href={webHref(w)}
                  />
                ))}
                {location && (
                  <Row
                    icon={<MapPin size={16} />}
                    label="Office"
                    text={location}
                    href={mapHref}
                  />
                )}
              </div>
            </div>
          )}

          {/* Socials */}
          {socials.length > 0 && (
            <div className="flex flex-col" style={{ gap: "3.4cqw" }}>
              <Title delay={0.7}>Connect</Title>
              <div
                className="flex flex-wrap justify-center"
                style={{ gap: "3cqw" }}
              >
                {socials.map((link) => {
                  const key = String(link.platform ?? "").toLowerCase();
                  return (
                    <a
                      key={link.id ?? link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      title={link.username || link.platform}
                      aria-label={link.username || link.platform}
                      className="ep-soc flex items-center justify-center"
                      style={squareBtn}
                    >
                      {SOCIAL_ICONS[key] || <Globe size={17} />}
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* QR panel */}
          {showQr && (
            <div
              className="ep-up relative flex items-center"
              style={{
                marginTop: "auto",
                gap: "5cqw",
                padding: "4.4cqw",
                borderRadius: "3cqw",
                background: `linear-gradient(135deg, ${ONYX_2}, ${ONYX})`,
                border: `1px solid ${GOLD}`,
                boxShadow: "0 3cqw 8cqw rgba(14,15,19,.35)",
              }}
            >
              <button
                type="button"
                onClick={() => setShowQr(false)}
                aria-label="Close QR code"
                className="absolute hover:opacity-70"
                style={{ top: "2.4cqw", right: "2.4cqw", color: GOLD_L }}
              >
                <X size={16} />
              </button>
              <div
                style={{
                  padding: "2cqw",
                  borderRadius: "2cqw",
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
                    color: GOLD_L,
                    fontWeight: 700,
                    fontSize: "max(10px, 2.2cqw)",
                    letterSpacing: "0.26em",
                    textTransform: "uppercase",
                  }}
                >
                  Digital Card
                </p>
                {displayName && (
                  <p
                    style={{
                      marginTop: "1cqw",
                      color: "#fff",
                      fontFamily: SERIF,
                      fontWeight: 600,
                      fontSize: "max(16px, 4.6cqw)",
                      lineHeight: 1.15,
                    }}
                  >
                    {displayName}
                  </p>
                )}
                <p
                  style={{
                    marginTop: "1cqw",
                    color: "#cbd0db",
                    fontSize: "max(11px, 2.4cqw)",
                  }}
                >
                  Scan to save my details
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ---------- Sticky bottom bar ---------- */}
        <div
          className="ep-bar w-full flex-shrink-0 flex items-center"
          style={{
            position: "sticky",
            bottom: 0,
            zIndex: 20,
            gap: "2.6cqw",
            padding: "3cqw 6cqw",
            backgroundColor: "rgba(14,15,19,.96)",
            backdropFilter: "blur(8px)",
            borderTop: `1px solid ${GOLD}`,
          }}
        >
          <button
            type="button"
            onClick={handleSaveContact}
            className="ep-save flex-1 flex items-center justify-center hover:opacity-95"
            style={{
              gap: "2cqw",
              padding: "3.2cqw 0",
              borderRadius: "2.4cqw",
              color: ONYX,
              fontWeight: 700,
              fontSize: "max(13px, 3cqw)",
              letterSpacing: "0.06em",
              background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`,
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
              ...squareBtn,
              color: GOLD_L,
              backgroundColor: showQr ? "rgba(184,147,90,.25)" : "transparent",
            }}
          >
            <QrCode size={18} />
          </button>
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share"
            className="flex items-center justify-center hover:opacity-80"
            style={{
              ...squareBtn,
              color: GOLD_L,
              backgroundColor: "transparent",
            }}
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExecutivePrestige;
