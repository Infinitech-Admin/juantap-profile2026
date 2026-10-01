"use client";

// src/components/template-previews/corporate-blue.tsx
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
  UserPlus,
  Building2,
  RotateCw,
} from "lucide-react";
import type { Template, User } from "@/types/template";

interface CorporateBlueProps {
  template?: Template;
  user?: User;
}

/* ---------- Palette: navy, blue, clean white ---------- */
const NAVY = "#0b2545";
const NAVY_2 = "#13315c";
const BLUE = "#1d4ed8";
const SKY = "#38bdf8";
const BG = "#f4f6fa";
const CARD = "#ffffff";
const TEXT = "#0f172a";
const MUTED = "#64748b";
const BORDER = "#e2e8f0";

const FONT = "Poppins, 'Segoe UI', Arial, sans-serif";

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

const CB_CSS = `
@keyframes cb-up      { from { opacity: 0; translate: 0 3.5cqw; } to { opacity: 1; translate: 0 0; } }
@keyframes cb-slide   { from { opacity: 0; translate: -5cqw 0; } to { opacity: 1; translate: 0 0; } }
@keyframes cb-pop     { from { opacity: 0; scale: .85; } to { opacity: 1; scale: 1; } }
@keyframes cb-draw    { from { scale: 0 1; } to { scale: 1 1; } }
@keyframes cb-rise    { from { translate: 0 100%; } to { translate: 0 0; } }
@keyframes cb-drop    { from { opacity: 0; translate: 0 -8cqw; } to { opacity: 1; translate: 0 0; } }
@keyframes cb-shape-a { from { translate: -4cqw 0; rotate: 18deg; } to { translate: 6cqw 3cqw; rotate: 30deg; } }
@keyframes cb-shape-b { from { translate: 5cqw 2cqw; rotate: -12deg; } to { translate: -6cqw -2cqw; rotate: -24deg; } }
@keyframes cb-bar     { from { translate: -100% 0; } to { translate: 300% 0; } }
@keyframes cb-hint    { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
@keyframes cb-nudge   {
  0%,100% { transform: rotateY(0deg); }
  30%     { transform: rotateY(-16deg); }
  60%     { transform: rotateY(9deg); }
  80%     { transform: rotateY(-3deg); }
}

.cb-band {
  position: absolute; top: 0; left: 0; right: 0; height: 46cqw; overflow: hidden;
  background:
    radial-gradient(120% 120% at 100% 0%, rgba(56,189,248,.35), transparent 55%),
    linear-gradient(135deg, ${NAVY}, ${NAVY_2});
}
.cb-band-dots {
  position: absolute; inset: 0; opacity: .5;
  background-image: radial-gradient(rgba(255,255,255,.18) 1px, transparent 1.4px);
  background-size: 4cqw 4cqw;
}
.cb-shape-a, .cb-shape-b {
  position: absolute; border-radius: 4cqw; pointer-events: none;
  border: 1px solid rgba(255,255,255,.18);
  background: linear-gradient(135deg, rgba(255,255,255,.1), rgba(255,255,255,0));
}
.cb-shape-a { width: 38cqw; height: 38cqw; top: -14cqw; right: -8cqw; animation: cb-shape-a 12s ease-in-out infinite alternate; }
.cb-shape-b { width: 26cqw; height: 26cqw; top: 16cqw; left: -10cqw; animation: cb-shape-b 15s ease-in-out infinite alternate; }

/* Page background decoration (lower part) */
@keyframes cb-ring { from { translate: 0 0; scale: 1; } to { translate: -4cqw -3cqw; scale: 1.06; } }
.cb-bg { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
.cb-bg::before {
  content: ""; position: absolute; inset: 0;
  background:
    radial-gradient(60% 40% at 100% 85%, rgba(56,189,248,.20), transparent 70%),
    radial-gradient(50% 35% at 0% 55%, rgba(29,78,216,.10), transparent 70%);
}
.cb-bg-dots {
  position: absolute; top: 46cqw; left: 0; right: 0; bottom: 0; opacity: .6;
  background-image: radial-gradient(rgba(11,37,69,.10) 1px, transparent 1.4px);
  background-size: 4cqw 4cqw;
  -webkit-mask-image: linear-gradient(180deg, transparent, #000 20%, #000 75%, transparent);
  mask-image: linear-gradient(180deg, transparent, #000 20%, #000 75%, transparent);
}
.cb-ring-a, .cb-ring-b { position: absolute; border-radius: 9999px; border: 1px solid rgba(29,78,216,.16); }
.cb-ring-a { width: 70cqw; height: 70cqw; right: -30cqw; bottom: 8cqw; animation: cb-ring 16s ease-in-out infinite alternate; }
.cb-ring-b { width: 44cqw; height: 44cqw; right: -14cqw; bottom: 22cqw; border-color: rgba(56,189,248,.28); animation: cb-ring 12s ease-in-out infinite alternate-reverse; }

/* "Let's connect" banner */
.cb-cta {
  position: relative; overflow: hidden; border-radius: 3cqw; padding: 5cqw; color: #fff;
  background:
    radial-gradient(100% 140% at 100% 0%, rgba(56,189,248,.35), transparent 60%),
    linear-gradient(135deg, ${NAVY_2}, ${NAVY});
  box-shadow: 0 2.4cqw 6cqw rgba(11,37,69,.25);
}
.cb-cta::before {
  content: ""; position: absolute; width: 34cqw; height: 34cqw; border-radius: 4cqw;
  top: -14cqw; right: -8cqw; border: 1px solid rgba(255,255,255,.18);
  background: linear-gradient(135deg, rgba(255,255,255,.1), transparent);
  animation: cb-shape-a 12s ease-in-out infinite alternate;
}
.cb-cta-btn {
  background: #fff; color: ${NAVY}; font-weight: 700; border-radius: 999px;
  padding: 2.4cqw 4.4cqw; white-space: nowrap; flex-shrink: 0;
  transition: translate .2s ease, box-shadow .2s ease;
}
.cb-cta-btn:hover { translate: 0 -.5cqw; box-shadow: 0 1.6cqw 4cqw rgba(0,0,0,.25); }

.cb-card-wrap { perspective: 220cqw; animation: cb-drop .8s cubic-bezier(.2,1,.3,1) .1s both; }
.cb-nudge     { animation: cb-nudge 1.4s ease-in-out 1.3s 1; }
.cb-flip      {
  position: relative; width: 100%; aspect-ratio: 1.75 / 1;
  transform-style: preserve-3d; -webkit-transform-style: preserve-3d;
  transition: transform .85s cubic-bezier(.2,.8,.2,1);
  cursor: pointer; outline: none; -webkit-tap-highlight-color: transparent;
}
.cb-face {
  position: absolute; inset: 0; border-radius: 3cqw; overflow: hidden;
  backface-visibility: hidden; -webkit-backface-visibility: hidden;
  outline: 1px solid transparent;
  box-shadow: 0 3cqw 8cqw rgba(11,37,69,.28), 0 .6cqw 1.6cqw rgba(11,37,69,.18);
}
.cb-front {
  background:
    radial-gradient(90% 120% at 100% 0%, rgba(56,189,248,.28), transparent 60%),
    linear-gradient(135deg, #0f3a73, ${NAVY});
  color: #fff;
  border: 1px solid rgba(255,255,255,.14);
  box-sizing: border-box;
}
.cb-back { transform: rotateY(180deg); background: ${CARD}; }

.cb-up    { animation: cb-up .7s ease-out both; }
.cb-pop   { animation: cb-pop .6s cubic-bezier(.2,1.2,.4,1) both; }
.cb-line  { transform-origin: left center; animation: cb-draw .9s ease-out .6s both; }
.cb-hint  { animation: cb-hint 2.4s ease-in-out infinite; }

.cb-row {
  position: relative; overflow: hidden;
  animation: cb-slide .6s ease-out both;
  transition: translate .2s ease, box-shadow .2s ease, border-color .2s ease;
}
.cb-row:hover { translate: 0 -.4cqw; box-shadow: 0 1.6cqw 4cqw rgba(11,37,69,.12); border-color: ${SKY} !important; }

.cb-chip {
  animation: cb-pop .5s cubic-bezier(.2,1.2,.4,1) both;
  transition: translate .2s ease, background-color .2s ease, color .2s ease, border-color .2s ease;
}
.cb-chip:hover { translate: 0 -.6cqw; background-color: ${NAVY} !important; color: #fff !important; border-color: ${NAVY} !important; }

.cb-bar { animation: cb-rise .7s cubic-bezier(.2,.9,.3,1) .9s both; }
.cb-bar-glow {
  position: absolute; top: 0; left: 0; height: 2px; width: 35%;
  background: linear-gradient(90deg, transparent, ${SKY}, transparent);
  animation: cb-bar 3.4s ease-in-out infinite; pointer-events: none;
}
.cb-action svg { transition: translate .2s ease, scale .2s ease; }
.cb-action:hover svg { translate: 0 -.6cqw; scale: 1.15; }

@media (prefers-reduced-motion: reduce) {
  .cb-shape-a, .cb-shape-b, .cb-bar-glow, .cb-ring-a, .cb-ring-b { display: none; }
  .cb-cta::before { animation: none; }
  .cb-card-wrap, .cb-nudge, .cb-up, .cb-pop, .cb-line, .cb-hint,
  .cb-row, .cb-chip, .cb-bar { animation: none; }
  .cb-flip { transition: none; }
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
      className="cb-row flex items-center justify-between"
      style={{
        backgroundColor: CARD,
        borderRadius: "2cqw",
        border: `1px solid ${BORDER}`,
        padding: "2.4cqw 3.2cqw 2.4cqw 4.4cqw",
        gap: "2.4cqw",
        boxShadow: "0 .4cqw 1.2cqw rgba(11,37,69,.05)",
        animationDelay: `${0.8 + i * 0.1}s`,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "1.1cqw",
          background: `linear-gradient(180deg, ${BLUE}, ${SKY})`,
        }}
      />
      <div className="flex items-center min-w-0" style={{ gap: "3cqw" }}>
        <span
          className="flex-shrink-0 flex items-center justify-center"
          style={{
            width: "8.4cqw",
            height: "8.4cqw",
            borderRadius: "2cqw",
            background: `linear-gradient(135deg, ${BLUE}, ${SKY})`,
            color: "#fff",
            boxShadow: "0 .8cqw 2cqw rgba(29,78,216,.28)",
          }}
        >
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
        style={{ color: MUTED }}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
};

const SectionLabel = ({
  children,
  delay = 0.7,
}: {
  children: React.ReactNode;
  delay?: number;
}) => (
  <h2
    className="cb-up flex items-center"
    style={{
      animationDelay: `${delay}s`,
      color: NAVY,
      fontWeight: 700,
      fontSize: "max(11px, 2.4cqw)",
      letterSpacing: "0.24em",
      textTransform: "uppercase",
      gap: "2.4cqw",
    }}
  >
    {children}
    <span
      aria-hidden="true"
      className="cb-line flex-1"
      style={{
        height: "1px",
        background: `linear-gradient(90deg, ${BLUE}, transparent)`,
      }}
    />
  </h2>
);

export const CorporateBlue: React.FC<CorporateBlueProps> = ({ user }) => {
  // false = front of the business card, true = back (QR code)
  const [flipped, setFlipped] = useState(false);

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

  const primaryAction: {
    label: string;
    href: string;
    icon: React.ReactNode;
    external?: boolean;
  } | null = emails[0]
    ? {
        label: "Email Me",
        href: `mailto:${emails[0]}`,
        icon: <Mail size={15} />,
      }
    : phones[0]
      ? {
          label: "Call Now",
          href: `tel:${phones[0]}`,
          icon: <Phone size={15} />,
        }
      : websites[0]
        ? {
            label: "Visit Website",
            href: websites[0].startsWith("http")
              ? websites[0]
              : `https://${websites[0]}`,
            icon: <Globe size={15} />,
            external: true,
          }
        : null;

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

  const toggleFlip = () => setFlipped((f) => !f);

  const actionStyle: React.CSSProperties = {
    padding: "2.8cqw 0",
    gap: "0.6cqw",
    color: NAVY,
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
      <style>{CB_CSS}</style>
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
        {/* ---------- Background decoration ---------- */}
        <div aria-hidden="true" className="cb-bg">
          <span className="cb-bg-dots" />
          <span className="cb-ring-a" />
          <span className="cb-ring-b" />
        </div>

        {/* ---------- Header band ---------- */}
        <div aria-hidden="true" className="cb-band">
          <span
            className="cb-band-dots"
            style={{ position: "absolute", inset: 0 }}
          />
          <span className="cb-shape-a" />
          <span className="cb-shape-b" />
        </div>

        {/* ---------- Content ---------- */}
        <div
          className="relative flex flex-col flex-1"
          style={{
            fontSize: "max(13px, 2.9cqw)",
            lineHeight: 1.45,
            padding: "10cqw 6cqw 6cqw",
            gap: "5cqw",
            zIndex: 10,
          }}
        >
          {/* Flip business card */}
          <div className="cb-card-wrap w-full">
            <div className="cb-nudge">
              <div
                className="cb-flip"
                role="button"
                tabIndex={0}
                aria-pressed={flipped}
                aria-label={
                  flipped ? "Show business card" : "Show QR code on the back"
                }
                onClick={toggleFlip}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleFlip();
                  }
                }}
                style={{
                  transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* Front */}
                <div className="cb-face cb-front">
                  <div
                    className="flex items-center h-full"
                    style={{ padding: "0 5cqw", gap: "4.4cqw" }}
                  >
                    <div
                      className="flex-shrink-0 overflow-hidden flex items-center justify-center"
                      style={{
                        width: "22cqw",
                        height: "22cqw",
                        borderRadius: "3.4cqw",
                        border: "0.5cqw solid rgba(255,255,255,.85)",
                        backgroundColor: "rgba(255,255,255,.12)",
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
                        <UserIcon size={40} style={{ color: "#cbd5e1" }} />
                      )}
                    </div>

                    <div
                      className="min-w-0 flex flex-col"
                      style={{ gap: "1.2cqw" }}
                    >
                      {displayName && (
                        <h1
                          style={{
                            fontWeight: 700,
                            fontSize: "max(17px, 5.2cqw)",
                            lineHeight: 1.12,
                            letterSpacing: "0.005em",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {displayName}
                        </h1>
                      )}
                      {jobTitle && (
                        <p
                          className="truncate"
                          style={{
                            color: SKY,
                            fontWeight: 600,
                            fontSize: "max(10px, 2.3cqw)",
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                          }}
                        >
                          {jobTitle}
                        </p>
                      )}
                      {company && (
                        <p
                          className="flex items-center truncate"
                          style={{
                            gap: "1.4cqw",
                            color: "#dbeafe",
                            fontWeight: 500,
                            fontSize: "max(11px, 2.6cqw)",
                          }}
                        >
                          <Building2 size={13} style={{ flexShrink: 0 }} />
                          <span className="truncate">{company}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <span
                    aria-hidden="true"
                    className="cb-hint flex items-center absolute"
                    style={{
                      right: "3.4cqw",
                      bottom: "2.6cqw",
                      gap: "1cqw",
                      color: "rgba(255,255,255,.75)",
                      fontSize: "max(9px, 2cqw)",
                      letterSpacing: "0.08em",
                    }}
                  >
                    <RotateCw size={11} /> Tap to flip
                  </span>
                </div>

                {/* Back */}
                <div className="cb-face cb-back">
                  <div
                    className="flex items-center justify-center h-full"
                    style={{ gap: "5cqw", padding: "0 5cqw" }}
                  >
                    <div
                      className="flex-shrink-0"
                      style={{
                        padding: "1.6cqw",
                        borderRadius: "2.4cqw",
                        border: `1px solid ${BORDER}`,
                        backgroundColor: "#fff",
                      }}
                    >
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=0&data=${encodeURIComponent(pageUrl)}`}
                        alt="QR code"
                        style={{
                          width: "30cqw",
                          height: "30cqw",
                          display: "block",
                        }}
                      />
                    </div>
                    <div
                      className="min-w-0 flex flex-col"
                      style={{ gap: "1.2cqw" }}
                    >
                      <span
                        style={{
                          color: BLUE,
                          fontWeight: 700,
                          fontSize: "max(10px, 2.2cqw)",
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                        }}
                      >
                        Scan to connect
                      </span>
                      {displayName && (
                        <span
                          style={{
                            color: NAVY,
                            fontWeight: 700,
                            fontSize: "max(15px, 4.2cqw)",
                            lineHeight: 1.15,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {displayName}
                        </span>
                      )}
                      {company && (
                        <span
                          className="truncate"
                          style={{
                            color: MUTED,
                            fontSize: "max(11px, 2.5cqw)",
                          }}
                        >
                          {company}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          {bio && (
            <p
              className="cb-up"
              style={{
                animationDelay: "0.7s",
                color: MUTED,
                whiteSpace: "pre-line",
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textAlign: "center",
                padding: "0 2cqw",
              }}
            >
              {bio}
            </p>
          )}

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
              <SectionLabel delay={0.95}>Connect</SectionLabel>
              <div className="flex flex-wrap" style={{ gap: "2.2cqw" }}>
                {socials.map((link, idx) => {
                  const key = String(link.platform ?? "").toLowerCase();
                  return (
                    <a
                      key={link.id ?? link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="cb-chip inline-flex items-center"
                      style={{
                        animationDelay: `${1 + idx * 0.08}s`,
                        backgroundColor: CARD,
                        color: NAVY,
                        fontWeight: 500,
                        borderRadius: "999px",
                        border: `1px solid ${BORDER}`,
                        padding: "1.2cqw 3.8cqw 1.2cqw 1.2cqw",
                        gap: "2cqw",
                        textDecoration: "none",
                      }}
                    >
                      <span
                        className="flex items-center justify-center flex-shrink-0"
                        style={{
                          width: "7cqw",
                          height: "7cqw",
                          borderRadius: "999px",
                          background: `linear-gradient(135deg, ${BLUE}, ${SKY})`,
                          color: "#fff",
                        }}
                      >
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

          {/* Get in touch banner (hidden when there is nothing to act on) */}
          {primaryAction && (
            <div
              className="cb-cta cb-up"
              style={{ animationDelay: "1.1s", marginTop: "auto" }}
            >
              <div
                className="relative flex items-center justify-between"
                style={{ gap: "3cqw" }}
              >
                <div className="min-w-0">
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: "max(16px, 4.4cqw)",
                      lineHeight: 1.15,
                    }}
                  >
                    Let&apos;s work together
                  </p>
                  <p
                    style={{
                      marginTop: "1cqw",
                      color: "#bfdbfe",
                      fontSize: "max(11px, 2.5cqw)",
                    }}
                  >
                    Have a project or question? Get in touch.
                  </p>
                </div>
                <a
                  href={primaryAction.href}
                  target={primaryAction.external ? "_blank" : undefined}
                  rel={
                    primaryAction.external ? "noopener noreferrer" : undefined
                  }
                  className="cb-cta-btn flex items-center"
                  style={{
                    gap: "1.6cqw",
                    fontSize: "max(12px, 2.7cqw)",
                    textDecoration: "none",
                  }}
                >
                  {primaryAction.icon}
                  {primaryAction.label}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* ---------- Bottom action bar ---------- */}
        <div
          className="cb-bar relative w-full flex-shrink-0"
          style={{ zIndex: 10 }}
        >
          <div
            className="grid grid-cols-3 relative overflow-hidden"
            style={{
              backgroundColor: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(8px)",
              borderTop: `1px solid ${BORDER}`,
              boxShadow: "0 -1cqw 4cqw rgba(11,37,69,.08)",
            }}
          >
            <span aria-hidden="true" className="cb-bar-glow" />
            <button
              type="button"
              onClick={toggleFlip}
              className="cb-action flex flex-col items-center hover:opacity-80"
              style={actionStyle}
            >
              <QrCode size={18} style={{ color: BLUE }} />
              <span style={actionLabel}>
                {flipped ? "Show Card" : "QR Code"}
              </span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="cb-action flex flex-col items-center hover:opacity-80"
              style={actionStyle}
            >
              <Share2 size={18} style={{ color: BLUE }} />
              <span style={actionLabel}>Share</span>
            </button>
            <button
              type="button"
              onClick={handleSaveContact}
              className="cb-action flex flex-col items-center hover:opacity-80"
              style={actionStyle}
            >
              <UserPlus size={18} style={{ color: BLUE }} />
              <span style={actionLabel}>Save Contact</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorporateBlue;
