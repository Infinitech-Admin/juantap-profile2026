"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  MapPin,
  Globe,
  Copy,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  Youtube,
  Music,
  QrCode,
  Share2,
  Download,
  Phone,
  User,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Template } from "@/types/template";

interface SocialLink {
  id: string;
  platform: string;
  username: string;
  url: string;
  is_visible?: boolean | number;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  avatar_url: string;
  profile?: {
    avatar?: string;
    bio?: string;
    phone?: string;
    website?: string;
    location?: string;
    socialLinks?: SocialLink[];
  };
}

interface TemplateCardProps {
  template: Template;
  user: UserData | null;
  slug: string;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  user,
  slug,
}) => {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const profileUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${
    user?.username || ""
  }`;

  const socialIconMap: Record<string, React.ReactNode> = {
    facebook: <Facebook size={16} />,
    instagram: <Instagram size={16} />,
    twitter: <Twitter size={16} />,
    linkedin: <Linkedin size={16} />,
    github: <Github size={16} />,
    youtube: <Youtube size={16} />,
    tiktok: <Music size={16} />,
  };

  const author = user
    ? {
        displayName: user.name,
        avatar: user.profile?.avatar || user.avatar_url || null,
        email: user.email ?? null,
        phone: user.profile?.phone ?? null,
        website: user.profile?.website ?? null,
        location: user.profile?.location ?? null,
        bio: user.profile?.bio ?? null,
        socialLinks: user.profile?.socialLinks ?? [],
      }
    : {
        displayName: "Anonymous",
        avatar: null,
        email: null,
        phone: null,
        website: null,
        location: null,
        bio: null,
        socialLinks: [],
      };

  // Parse colors if stored as JSON string
  const colors = typeof template?.colors === 'string' 
    ? JSON.parse(template.colors) 
    : template?.colors || {};

  const getConnectGridClass = () => {
    switch (template.connection_style) {
      case "list":
        return "flex flex-col gap-2";
      case "compact":
        return "flex flex-wrap gap-2";
      default:
        return "grid grid-cols-1 gap-3";
    }
  };

  const getSocialLinkClass = () => {
    switch (template.social_style) {
      case "circles":
        return "flex w-10 h-10 items-center justify-center rounded-full hover:opacity-80 transition";
      case "fullblock":
        return "flex w-full h-full items-center gap-3 rounded-lg p-4 text-sm hover:opacity-80 transition w-full";
      default:
        return "flex w-full h-full items-center gap-2 rounded-lg p-2 text-sm hover:opacity-80 transition";
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: template?.name ?? "My Profile",
          text: template?.description ?? "",
          url: profileUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="w-full flex justify-center p-6"
      style={{ backgroundColor: "transparent" }}
    >
      <div
        className="w-full max-w-lg shadow-lg rounded-2xl overflow-hidden flex flex-col"
        style={{
          backgroundColor: colors?.background || template?.colors?.background || "#ffffff",
          fontFamily: template?.fonts?.body,
        }}
      >
        {/* Banner */}
        <div
          className="w-full h-32"
          style={{
            background: colors?.coverBackground 
              ? `linear-gradient(135deg, ${colors.coverBackground}, ${colors?.accent || colors?.primary})`
              : `linear-gradient(135deg, ${template?.colors?.accent || "#3b82f6"}, ${template?.colors?.primary || "#1f2937"})`,
          }}
        />

        {/* Avatar & Bio */}
        <div className="relative flex flex-col items-center mt-6 px-6">
          <div 
            className="w-24 h-24 rounded-full shadow-lg overflow-hidden bg-white/20 -mt-12"
            style={{
              border: `4px solid ${colors?.border || template?.colors?.border || "#ffffff"}`,
            }}
          >
            {author.avatar && !avatarError ? (
              <img
                src={author.avatar}
                alt={author.displayName}
                className="w-full h-full object-cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-white/20">
                <User size={64} className="text-gray-400" />
              </div>
            )}
          </div>

          {/* ✅ NAME - FORCE WHITE WITH !important */}
          <h1
            className="mt-4 text-xl font-bold"
            style={{
              fontFamily: template?.fonts?.heading,
              color: `${colors?.title || template?.colors?.title || "#FFFFFF"} !important`,
            }}
          >
            {author.displayName}
          </h1>

          {/* BIO */}
          {author.bio && (
            <p
              className="text-sm text-center mt-1"
              style={{
                color: colors?.description || template?.colors?.description || "#E5E5E5",
                fontFamily: template?.fonts?.body,
              }}
            >
              {author.bio}
            </p>
          )}
        </div>

        {/* Contact */}
        {(author.email ||
          author.phone ||
          author.website ||
          author.location) && (
          <div className="p-6 space-y-4">
            <h2
              className="text-sm font-semibold uppercase"
              style={{
                color: colors?.title || template?.colors?.title || "#FFFFFF",
                fontFamily: template?.fonts?.heading,
              }}
            >
              Contact
            </h2>

            {/* Email */}
            {author.email && (
              <div
                className="flex justify-between items-center rounded-lg p-3 text-sm"
                style={{
                  backgroundColor: `${colors?.primary || template?.colors?.primary || "#1f2937"}10`,
                  fontFamily: template?.fonts?.body,
                }}
              >
                <div
                  className="flex items-center gap-2"
                  style={{ color: colors?.description || template?.colors?.description || "#E5E5E5" }}
                >
                  <Mail size={16} style={{ color: colors?.icon || template?.colors?.icon || template?.colors?.accent || "#FFD700" }} />
                  {author.email}
                </div>
                <button
                  className="hover:opacity-70"
                  style={{ color: colors?.icon || template?.colors?.icon || template?.colors?.accent || "#FFD700" }}
                  onClick={() => navigator.clipboard.writeText(author.email!)}
                >
                  <Copy size={16} />
                </button>
              </div>
            )}

            {/* Phone */}
            {author.phone && (
              <div
                className="flex items-center gap-2 rounded-lg p-3 text-sm"
                style={{
                  backgroundColor: `${colors?.primary || template?.colors?.primary || "#1f2937"}10`,
                  color: colors?.description || template?.colors?.description || "#E5E5E5",
                  fontFamily: template?.fonts?.body,
                }}
              >
                <Phone size={16} style={{ color: colors?.icon || template?.colors?.icon || template?.colors?.accent || "#FFD700" }} />
                {author.phone}
              </div>
            )}

            {/* Website */}
            {author.website && (
              <a
                href={author.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg p-3 text-sm hover:opacity-80 transition"
                style={{
                  backgroundColor: `${colors?.primary || template?.colors?.primary || "#1f2937"}10`,
                  color: colors?.description || template?.colors?.description || "#E5E5E5",
                  fontFamily: template?.fonts?.body,
                }}
              >
                <Globe size={16} style={{ color: colors?.icon || template?.colors?.icon || template?.colors?.accent || "#FFD700" }} />
                {author.website}
              </a>
            )}

            {/* Location */}
            {author.location && (
              <div
                className="flex items-center gap-2 rounded-lg p-3 text-sm"
                style={{
                  backgroundColor: `${colors?.primary || template?.colors?.primary || "#1f2937"}10`,
                  color: colors?.description || template?.colors?.description || "#E5E5E5",
                  fontFamily: template?.fonts?.body,
                }}
              >
                <MapPin size={16} style={{ color: colors?.icon || template?.colors?.icon || template?.colors?.accent || "#FFD700" }} />
                {author.location}
              </div>
            )}
          </div>
        )}

        {/* Social Links */}
        {author.socialLinks?.length > 0 && (
          <div className="px-6 pb-6">
            <h2
              className="text-sm font-semibold uppercase mb-3 w-auto"
              style={{
                color: colors?.title || template?.colors?.title || "#FFFFFF",
                fontFamily: template?.fonts?.heading,
              }}
            >
              Connect with me
            </h2>
            <div className={getConnectGridClass()}>
              {author.socialLinks.map((link: SocialLink) => {
                const platformKey = link.platform?.toLowerCase();
                const icon = socialIconMap[platformKey] || <Globe size={14} />;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className={getSocialLinkClass()}
                    style={{
                      backgroundColor: `${colors?.accent || template?.colors?.accent || "#3b82f6"}15`,
                      color: colors?.description || template?.colors?.description || "#E5E5E5",
                      fontFamily: template?.fonts?.body,
                    }}
                  >
                    <span style={{ color: colors?.icon || template?.colors?.icon || template?.colors?.accent || "#FFD700" }}>
                      {icon}
                    </span>
                    <span
                      className={`text-xs ${
                        template.social_style === "circles"
                          ? "hidden"
                          : "inline-block"
                      }`}
                    >
                      {link.username}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div
          className="flex justify-around border-t p-4"
          style={{
            backgroundColor: `${colors?.primary || template?.colors?.primary || "#1f2937"}08`,
            borderColor: `${colors?.primary || template?.colors?.primary || "#1f2937"}20`,
            fontFamily: template?.fonts?.body,
          }}
        >
          <button
            onClick={() => setIsQRModalOpen(true)}
            className="flex flex-col items-center text-sm hover:opacity-70"
            style={{ color: colors?.description || template?.colors?.description || "#E5E5E5" }}
          >
            <QrCode
              className="w-5 h-5 mb-1"
              style={{ color: colors?.icon || template?.colors?.icon || template?.colors?.accent || "#FFD700" }}
            />
            QR Code
          </button>
          <button
            onClick={handleShare}
            className="flex flex-col items-center text-sm hover:opacity-70"
            style={{ color: colors?.description || template?.colors?.description || "#E5E5E5" }}
          >
            <Share2
              className="w-5 h-5 mb-1"
              style={{ color: colors?.icon || template?.colors?.icon || template?.colors?.accent || "#FFD700" }}
            />
            Share
          </button>
        </div>
      </div>

      {/* QR Modal */}
      <Dialog open={isQRModalOpen} onOpenChange={setIsQRModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              QR Code for {author.displayName}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 w-full">
            <div className="w-full flex justify-center">
              <QRCodeSVG
                value={profileUrl}
                size={200}
                className="w-full max-w-[220px] h-auto"
              />
            </div>
            <div className="w-full p-3 bg-gray-50 rounded-lg text-xs sm:text-sm">
              <p className="text-gray-600 mb-2">Profile URL:</p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <code className="text-gray-800 truncate flex-1">
                  {profileUrl}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyUrl}
                  className="self-end sm:self-auto"
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Button variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                onClick={() => setIsQRModalOpen(false)}
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
