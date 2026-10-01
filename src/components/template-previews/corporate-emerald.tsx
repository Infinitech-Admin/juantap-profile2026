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
  ChevronRight,
  X,
} from "lucide-react";
import type { Template, User } from "@/types/template";

interface CorporateEmeraldProps {
  template?: Template;
  user?: User;
}

/* ---------- Palette: charcoal + emerald ---------- */
const INK = "#0f172a";
const INK_2 = "#064e3b";
const EMERALD = "#10b981";
const EMERALD_D = "#047857";
const MINT = "#d1fae5";
const BG = "#f8fafc";
const CARD = "#ffffff";
const TEXT = "#0f172a";
const MUTED = "#475569";
const BORDER = "#e2e8f0";

const FONT = "'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif";

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

const CE_CSS = `
@keyframes ce-up    { from { opacity: 0; translate: 0 3cqw; } to { opacity: 1; translate: 0 0; } }
@keyframes ce-pop   { from { opacity: 0; scale: .9; } to { opacity: 1; scale: 1; } }
@keyframes ce-float { from { translate: 0 0; } to { translate: -3cqw 3cqw; } }
@keyframes ce-rise  { from { translate: 0 100%; } to { translate: 0 0; } }

.ce-head {
  position: absolute; top: 0; left: 0; right: 0; height: 58cqw; overflow: hidden;
  clip-path: polygon(0 0, 100% 0, 100% 90%, 0 100%);
  background:
    radial-gradient(80% 100% at 0% 0%, rgba(16,185,129,.30), transparent 60%),
    linear-gradient(160deg, ${INK}, ${INK_2});
}
.ce-grid {
  position: absolute; inset: 0; opacity: .5;
  background-image:
    linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px);
  background-size: 6cqw 6cqw;
}
.ce-orb {
  position: absolute; width: 44cqw; height: 44cqw; border-radius: 9999px;
  right: -14cqw; top: -16cqw; border: 1px solid rgba(255,255,255,.12);
  background: radial-gradient(circle at 30% 30%, rgba(16,185,129,.35), transparent 70%);
  animation: ce-float 10s ease-in-out infinite alternate;
}
.ce-up   { animation: ce-up .6s ease-out both; }
.ce-pop  { animation: ce-pop .5s cubic-bezier(.2,1.2,.4,1) both; }
.ce-bar  { animation: ce-rise .6s cubic-bezier(.2,.9,.3,1) .6s both; }

.ce-tile { transition: translate .2s ease, box-shadow .2s ease, background-color .2s ease, color .2s ease; }
.ce-tile:hover { translate: 0 -.6cqw; background-color: ${EMERALD_D} !important; color: #fff !important; }
.ce-line { transition: background-color .2s ease; }
.ce-line:hover { background-color: ${MINT}; }
.ce-soc { transition: translate .2s ease, background-color .2s ease, color .2s ease; }
.ce-soc:hover { translate: 0 -.5cqw; background-color: ${INK} !important; color: #fff !important; }

@media (prefers-reduced-motion: reduce) {
  .ce-orb { animation: none; }
  .ce-up, .ce-pop, .ce-bar { animation: none; }
}
`;

const Heading = ({
  children,
  delay = 0.5,
}: {
  children: React.ReactNode;
  delay?: number;
}) => (
  <h2
    className="ce-up"
    style={{
      animationDelay: `${delay}s`,
      color: INK,
      fontWeight: 800,
      fontSize: "max(12px, 2.6cqw)",
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      marginBottom: "1cqw",
    }}
  >
    <span style={{ color: EMERALD_D }}>/</span> {children}
  </h2>
);

const ContactLine = ({
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
      className="ce-line flex items-center"
      style={{
        gap: "3.4cqw",
        padding: "2.2cqw 2cqw",
        borderRadius: "2cqw",
        borderBottom: `1px solid ${BORDER}`,
      }}
    >
      <span
        className="flex-shrink-0 flex items-center justify-center"
        style={{
          width: "9cqw",
          height: "9cqw",
          borderRadius: "2.4cqw",
          backgroundColor: MINT,
          color: EMERALD_D,
        }}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p
          style={{
            color: MUTED,
            fontSize: "max(10px, 2.1cqw)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          {label}
        </p>
        <p
          className="truncate"
          style={{
            color: TEXT,
            fontWeight: 600,
            fontSize: "max(14px, 3.3cqw)",
          }}
        >
          {text}
        </p>
      </div>
      {href && <ChevronRight size={16} style={{ color: MUTED }} />}
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

export const CorporateEmerald: React.FC<CorporateEmeraldProps> = ({ user }) => {
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

  const tiles: { label: string; href: string; icon: React.ReactNode }[] = [];
  if (phones[0])
    tiles.push({
      label: "Call",
      href: `tel:${phones[0]}`,
      icon: <Phone size={18} />,
    });
  if (emails[0])
    tiles.push({
      label: "Email",
      href: `mailto:${emails[0]}`,
      icon: <Mail size={18} />,
    });
  if (websites[0])
    tiles.push({
      label: "Website",
      href: webHref(websites[0]),
      icon: <Globe size={18} />,
    });
  if (location)
    tiles.push({
      label: "Map",
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`,
      icon: <MapPin size={18} />,
    });

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

  return (
    <div
      className="w-full flex justify-center"
      style={{ backgroundColor: "#f1f5f9", minHeight: "100dvh" }}
    >
      <style>{CE_CSS}</style>
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
        {/* Header background */}
        <div aria-hidden="true" className="ce-head">
          <span className="ce-grid" />
          <span className="ce-orb" />
        </div>

        {/* Content */}
        <div
          className="relative flex flex-col flex-1"
          style={{
            fontSize: "max(13px, 3cqw)",
            lineHeight: 1.45,
            padding: "9cqw 6cqw 5cqw",
            gap: "5cqw",
            zIndex: 10,
          }}
        >
          {/* Identity: everything sits INSIDE the dark header, in white */}
          <div
            className="ce-up flex items-center"
            style={{ gap: "4.6cqw", minHeight: "32cqw" }}
          >
            <div
              className="flex-shrink-0 overflow-hidden flex items-center justify-center"
              style={{
                width: "30cqw",
                height: "30cqw",
                borderRadius: "5cqw",
                border: `1cqw solid ${CARD}`,
                backgroundColor: "#e2e8f0",
                boxShadow: "0 3cqw 7cqw rgba(0,0,0,.35)",
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
                <UserIcon size={44} style={{ color: "#94a3b8" }} />
              )}
            </div>

            <div className="min-w-0 flex flex-col" style={{ gap: "1.6cqw" }}>
              {company && (
                <span
                  className="inline-flex items-center self-start"
                  style={{
                    gap: "1.4cqw",
                    padding: "0.9cqw 2.6cqw",
                    borderRadius: "999px",
                    backgroundColor: "rgba(16,185,129,.25)",
                    border: "1px solid rgba(110,231,183,.6)",
                    color: "#d1fae5",
                    fontSize: "max(10px, 2.2cqw)",
                    fontWeight: 600,
                  }}
                >
                  <Building2 size={12} />
                  <span className="truncate" style={{ maxWidth: "34cqw" }}>
                    {company}
                  </span>
                </span>
              )}
              {displayName && (
                <h1
                  style={{
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: "max(20px, 6.2cqw)",
                    lineHeight: 1.1,
                    letterSpacing: "-0.01em",
                    textShadow: "0 1px 6px rgba(0,0,0,.35)",
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
                    color: "#6ee7b7",
                    fontWeight: 700,
                    fontSize: "max(11px, 2.5cqw)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  {jobTitle}
                </p>
              )}
            </div>
          </div>

          {/* Quick actions (float over the header edge) */}
          {tiles.length > 0 && (
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${tiles.length}, minmax(0, 1fr))`,
                gap: "2.6cqw",
                marginTop: "2cqw",
              }}
            >
              {tiles.map((t, i) => (
                <a
                  key={t.label}
                  href={t.href}
                  target={t.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="ce-tile ce-pop flex flex-col items-center"
                  style={{
                    animationDelay: `${0.3 + i * 0.07}s`,
                    gap: "1cqw",
                    padding: "3.2cqw 0",
                    borderRadius: "3cqw",
                    backgroundColor: CARD,
                    color: INK,
                    border: `1px solid ${BORDER}`,
                    boxShadow: "0 2cqw 5cqw rgba(15,23,42,.18)",
                    textDecoration: "none",
                    fontWeight: 700,
                    fontSize: "max(12px, 2.6cqw)",
                  }}
                >
                  {t.icon}
                  {t.label}
                </a>
              ))}
            </div>
          )}

          {/* Bio */}
          {bio && (
            <p
              className="ce-up"
              style={{
                animationDelay: ".4s",
                color: MUTED,
                whiteSpace: "pre-line",
                borderLeft: `1cqw solid ${EMERALD}`,
                paddingLeft: "3.4cqw",
                fontSize: "max(13px, 3cqw)",
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {bio}
            </p>
          )}

          {/* Contact details */}
          {hasContact && (
            <div className="flex flex-col">
              <Heading delay={0.5}>Details</Heading>
              {emails.map((e) => (
                <ContactLine
                  key={e}
                  icon={<Mail size={16} />}
                  label="Email"
                  text={e}
                  href={`mailto:${e}`}
                />
              ))}
              {phones.map((ph) => (
                <ContactLine
                  key={ph}
                  icon={<Phone size={16} />}
                  label="Phone"
                  text={ph}
                  href={`tel:${ph}`}
                />
              ))}
              {websites.map((w) => (
                <ContactLine
                  key={w}
                  icon={<Globe size={16} />}
                  label="Website"
                  text={w}
                  href={webHref(w)}
                />
              ))}
              {location && (
                <ContactLine
                  icon={<MapPin size={16} />}
                  label="Location"
                  text={location}
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
                />
              )}
            </div>
          )}

          {/* Socials */}
          {socials.length > 0 && (
            <div className="flex flex-col" style={{ gap: "2.4cqw" }}>
              <Heading delay={0.7}>Follow</Heading>
              <div className="flex flex-wrap" style={{ gap: "2.6cqw" }}>
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
                      className="ce-soc ce-pop flex items-center justify-center"
                      style={{
                        animationDelay: `${0.75 + idx * 0.06}s`,
                        width: "11.5cqw",
                        height: "11.5cqw",
                        borderRadius: "3cqw",
                        backgroundColor: MINT,
                        color: EMERALD_D,
                      }}
                    >
                      {SOCIAL_ICONS[key] || <Globe size={18} />}
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* QR panel */}
          {showQr && (
            <div
              className="ce-pop relative flex items-center"
              style={{
                marginTop: "auto",
                gap: "5cqw",
                padding: "4cqw",
                borderRadius: "3.4cqw",
                backgroundColor: CARD,
                border: `1px solid ${BORDER}`,
                boxShadow: "0 3cqw 8cqw rgba(15,23,42,.15)",
              }}
            >
              <button
                type="button"
                onClick={() => setShowQr(false)}
                aria-label="Close QR code"
                className="absolute hover:opacity-70"
                style={{ top: "2.4cqw", right: "2.4cqw", color: MUTED }}
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
                    color: EMERALD_D,
                    fontWeight: 800,
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
                      color: INK,
                      fontWeight: 800,
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

        {/* Bottom bar */}
        <div
          className="ce-bar relative w-full flex-shrink-0 flex items-center"
          style={{
            zIndex: 10,
            gap: "2.6cqw",
            padding: "3cqw 6cqw",
            backgroundColor: "rgba(255,255,255,.96)",
            backdropFilter: "blur(8px)",
            borderTop: `1px solid ${BORDER}`,
            boxShadow: "0 -1cqw 4cqw rgba(15,23,42,.08)",
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
              color: "#fff",
              fontWeight: 700,
              fontSize: "max(13px, 3cqw)",
              background: `linear-gradient(135deg, ${EMERALD_D}, ${EMERALD})`,
              boxShadow: "0 2cqw 4cqw rgba(16,185,129,.35)",
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
              width: "12cqw",
              height: "12cqw",
              borderRadius: "999px",
              border: `1px solid ${BORDER}`,
              color: INK,
              backgroundColor: showQr ? MINT : CARD,
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
              width: "12cqw",
              height: "12cqw",
              borderRadius: "999px",
              border: `1px solid ${BORDER}`,
              color: INK,
              backgroundColor: CARD,
            }}
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CorporateEmerald;
