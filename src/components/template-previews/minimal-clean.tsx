"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { fetchJson } from "@/lib/fetchJson";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Copy,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  Youtube,
  Music,
  Facebook,
  QrCode,
  Share2,
  Download,
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

interface SocialLink {
  id: string;
  username: string;
  platform: string; 
  url: string;
  isVisible: boolean;
}

interface ProfileData {
  username?: string;
  displayName?: string;
  location?: string;
  bio?: string;
  coverImage?: string;
  avatar?: string;
  website?: string;
  phone?: string;
  email?: string;
  socialLinks?: SocialLink[];
  template?: {
    backgroundColor?: string;
    textColor?: string;
    fontFamily?: string;
    gradientFrom?: string;
    gradientTo?: string;
    // ✅ ADD THESE NEW COLOR PROPERTIES
    titleColor?: string;
    descriptionColor?: string;
    iconColor?: string;
    borderColor?: string;
    nameBackground?: string;
    cardBackground?: string;
  };
}

export function MinimalClean() {
  const { username } = useParams<{ username?: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL || "";
  const frontendUrl =
    process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

  const profileUrl = profile?.username
    ? `${frontendUrl}/${profile.username}`
    : profile?.displayName
    ? `${frontendUrl}/${profile.displayName}`
    : frontendUrl; 

  const socialIconMap: Record<string, React.ReactNode> = {
    facebook: <Facebook size={16} />,
    instagram: <Instagram size={16} />,
    twitter: <Twitter size={16} />,
    linkedin: <Linkedin size={16} />,
    github: <Github size={16} />,
    youtube: <Youtube size={16} />,
    tiktok: <Music size={16} />,
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let endpoint = "";
        let headers: HeadersInit = { Accept: "application/json" };

        if (username) {
          endpoint = `${baseUrl}/profile/${username}`;
        } else {
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No authentication token found");
          endpoint = `${baseUrl}/user-profile`;
          headers = { ...headers, Authorization: `Bearer ${token}` };
        }

        const res = await fetch(endpoint, { headers });
        if (!res.ok) throw new Error("Failed to fetch profile");

        const data: any = await fetchJson(endpoint, { headers }, false);
        setProfile({
          username: data.username,
          displayName: data.display_name,
          location: data.profile?.location,
          bio: data.profile?.bio,
          coverImage:
            data.profile?.background_type === "image"
              ? `${baseUrl}${data.profile?.background_value}`
              : undefined,
          avatar: data.profile_image || undefined,
          website: data.profile?.website,
          phone: data.profile?.phone,
          email: data.email,
          socialLinks: data.profile?.socialLinks || [],
          template: {
            backgroundColor:
              data.profile?.background_type === "color"
                ? data.profile?.background_value
                : "#f9fafb",
            textColor: "#111827",
            fontFamily: data.profile?.font_style || "Inter, sans-serif",
            gradientFrom: data.profile?.gradientFrom,
            gradientTo: data.profile?.gradientTo,
            // ✅ ADD THESE NEW COLOR PROPERTIES FROM TEMPLATE
            titleColor: data.template?.colors?.title || "#FFFFFF",
            descriptionColor: data.template?.colors?.description || "#E5E5E5",
            iconColor: data.template?.colors?.icon || "#FFD700",
            borderColor: data.template?.colors?.border || "#FFD700",
            nameBackground: data.template?.colors?.nameBackground || "transparent",
            cardBackground: data.template?.colors?.background || "#1a1a1a",
          },
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, baseUrl]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check this out!",
          text: "Here's something interesting for you.",
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };

  const copyUrl = () => {
    if (!profileUrl) return;
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;
  if (!profile) return <p className="p-6 text-gray-500">No profile found.</p>;

  const { 
    backgroundColor, 
    textColor, 
    fontFamily, 
    gradientFrom, 
    gradientTo,
    // ✅ DESTRUCTURE NEW COLOR PROPERTIES
    titleColor = "#FFFFFF",
    descriptionColor = "#E5E5E5",
    iconColor = "#FFD700",
    borderColor = "#FFD700",
    nameBackground = "transparent",
    cardBackground = "#1a1a1a",
  } = profile.template || {};

  return (
    <div
      className="w-full flex justify-center p-5" 
      style={{
        background: cardBackground, // ✅ USE CARD BACKGROUND
        color: textColor,
        fontFamily,
      }}
    >
      <div 
        className="w-full max-w-lg shadow-lg rounded-2xl overflow-hidden flex flex-col"
        style={{
          backgroundColor: backgroundColor || "#ffffff",
        }}
      >
        {/* Cover */}
        <div
          className="w-full h-48"
          style={{
            background: !profile.coverImage
              ? `linear-gradient(135deg, ${gradientFrom || "#667eea"}, ${
                  gradientTo || "#764ba2"
                })` 
              : undefined,
          }}
        >
          {profile.coverImage && (
            <img
              src={profile.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            /> 
          )}
        </div>

        {/* Avatar & Bio */}
        <div className="relative flex flex-col items-center mt-6 px-6">
          {/* ✅ AVATAR WITH COLORED BORDER */}
          <div 
            className="w-28 h-28 rounded-full shadow-lg overflow-hidden bg-gray-200 flex items-center justify-center"
            style={{
              border: `4px solid ${borderColor}`, // ✅ APPLY BORDER COLOR
            }}
          >
            {profile.avatar ? (
              <img
                src={`${imageUrl}/storage/${profile.avatar}`}
                alt={profile.displayName || "Avatar"}
                className="w-full h-full object-cover"
              /> 
            ) : (
              <User size={32} className="text-gray-500" />
            )}
          </div>

          {/* ✅ NAME WITH TITLE COLOR */}
          <h1 
            className="mt-4 text-xl font-bold px-4 py-2 rounded-lg inline-block"
            style={{
              color: titleColor, // ✅ APPLY TITLE COLOR (WHITE)
              backgroundColor: nameBackground, // ✅ APPLY NAME BACKGROUND (MAROON)
            }}
          >
            {profile.displayName || "Display Name"}
          </h1> 

          {/* ✅ LOCATION & WEBSITE WITH DESCRIPTION COLOR AND ICON COLOR */}
          <div className="flex flex-wrap items-center gap-3 text-xs mt-2 justify-center">
            {profile.location && (
              <span 
                className="flex items-center gap-1"
                style={{ color: descriptionColor }} // ✅ APPLY DESCRIPTION COLOR
              >
                <MapPin 
                  size={12} 
                  style={{ color: iconColor }} // ✅ APPLY ICON COLOR (GOLD)
                /> 
                {profile.location}
              </span>
            )}
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1"
                style={{ color: descriptionColor }} // ✅ APPLY DESCRIPTION COLOR
              > 
                <Globe 
                  size={12}
                  style={{ color: iconColor }} // ✅ APPLY ICON COLOR (GOLD)
                /> 
                {profile.website}
              </a>
            )}
          </div>

          {/* ✅ BIO WITH DESCRIPTION COLOR */}
          {profile.bio && (
            <p 
              className="text-sm text-center mt-3 px-4 py-2 rounded-lg"
              style={{
                color: descriptionColor, // ✅ APPLY DESCRIPTION COLOR
                backgroundColor: "rgba(0,0,0,0.2)", // Subtle dark background for bio
              }}
            >
              {profile.bio}
            </p>
          )} 
        </div>

        {/* Contact */}
        <div className="p-6 space-y-4">
          {/* ✅ SECTION HEADER WITH TITLE COLOR */}
          <h2 
            className="text-sm font-semibold uppercase tracking-wide"
            style={{ color: titleColor }} // ✅ APPLY TITLE COLOR (WHITE)
          >
            Contact
          </h2>
           
          {profile.email && (
            <div 
              className="flex justify-between items-center rounded-lg p-3 text-sm"
              style={{
                backgroundColor: "rgba(255, 215, 0, 0.1)", // Subtle gold tint
                border: `1px solid ${borderColor}`, // ✅ APPLY BORDER COLOR
              }}
            >
              <div className="flex items-center gap-2">
                {/* ✅ ICON WITH ICON COLOR */}
                <Mail 
                  size={16}
                  style={{ color: iconColor }} // ✅ APPLY ICON COLOR (GOLD)
                />
                <span style={{ color: descriptionColor }}>{profile.email}</span>
              </div>
              <button
                className="hover:opacity-70 transition"
                onClick={() => navigator.clipboard.writeText(profile.email || "")}
                style={{ color: iconColor }} // ✅ APPLY ICON COLOR (GOLD)
              > 
                <Copy size={16} />
              </button>
            </div>
          )}
 
          {profile.phone && (
            <div 
              className="flex justify-between items-center rounded-lg p-3 text-sm"
              style={{
                backgroundColor: "rgba(255, 215, 0, 0.1)", // Subtle gold tint
                border: `1px solid ${borderColor}`, // ✅ APPLY BORDER COLOR
              }}
            >
              <div className="flex items-center gap-2">
                {/* ✅ ICON WITH ICON COLOR */}
                <Phone 
                  size={16}
                  style={{ color: iconColor }} // ✅ APPLY ICON COLOR (GOLD)
                />
                <span style={{ color: descriptionColor }}>{profile.phone}</span>
              </div>
              <button
                className="hover:opacity-70 transition"
                onClick={() => navigator.clipboard.writeText(profile.phone || "")}
                style={{ color: iconColor }} // ✅ APPLY ICON COLOR (GOLD)
              > 
                <Copy size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Social Links */}
        {profile.socialLinks?.length ? (
          <div className="px-6 pb-6">
            {/* ✅ SECTION HEADER WITH TITLE COLOR */}
            <h2 
              className="text-sm font-semibold uppercase tracking-wide mb-3"
              style={{ color: titleColor }} // ✅ APPLY TITLE COLOR (WHITE)
            >
              Connect with me
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {profile.socialLinks
                .filter((link) => link.isVisible)
                .map((link) => {
                  // normalize key: lowercase and trim
                  const platformKey = (link.platform || link.id || "")
                    .trim()
                    .toLowerCase();
                  const icon = socialIconMap[platformKey] || (
                    <Globe size={14} />
                  ); 
                  
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-lg p-2 text-sm hover:opacity-80 transition"
                      style={{
                        backgroundColor: "rgba(255, 215, 0, 0.1)", // Subtle gold tint
                        border: `1px solid ${borderColor}`, // ✅ APPLY BORDER COLOR
                        color: descriptionColor, // ✅ APPLY DESCRIPTION COLOR
                      }}
                    >
                      {/* ✅ CLONE ICON WITH ICON COLOR */}
                      <span style={{ color: iconColor }}>
                        {icon}
                      </span>
                      {link.username}
                    </a>
                  );
                })}
            </div>
          </div>
        ) : null}

        {/* Bottom Actions */}
        <div 
          className="flex justify-around border-t p-4"
          style={{
            borderColor: borderColor, // ✅ APPLY BORDER COLOR
            backgroundColor: "rgba(0,0,0,0.2)", // Subtle dark background
          }}
        >
          <button
            onClick={() => setIsQRModalOpen(true)}
            className="flex flex-col items-center text-sm hover:opacity-70 transition"
            style={{ color: descriptionColor }} // ✅ APPLY DESCRIPTION COLOR
          >
            <QrCode 
              className="w-5 h-5 mb-1"
              style={{ color: iconColor }} // ✅ APPLY ICON COLOR (GOLD)
            />
            QR Code
          </button>
          <button
            onClick={handleShare}
            className="flex flex-col items-center text-sm hover:opacity-70 transition"
            style={{ color: descriptionColor }} // ✅ APPLY DESCRIPTION COLOR
          >
            <Share2 
              className="w-5 h-5 mb-1"
              style={{ color: iconColor }} // ✅ APPLY ICON COLOR (GOLD)
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
              QR Code for {profile.displayName}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <QRCodeSVG value={profileUrl} size={256} />

            <a href={profileUrl} target="_blank" rel="noopener noreferrer">
              {profileUrl}
            </a>
            <div className="w-full p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Profile URL:</p>
              <div className="flex items-center justify-between">
                <code className="text-sm text-gray-800 truncate flex-1 mr-2">
                  {profileUrl}
                </code>
                <Button variant="ghost" size="sm" onClick={copyUrl}>
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>
            <div className="flex gap-2 w-full">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button onClick={() => setIsQRModalOpen(false)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
