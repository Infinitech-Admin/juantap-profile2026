"use client";

import type { ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { QRCodeCanvas } from "qrcode.react";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  Youtube,
  Music,
  Globe,
  User as UserIcon,
} from "lucide-react";

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  username?: string;
  isVisible: boolean;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  username: string;
  avatar_url?: string;
  profile_image?: string;
  profile?: {
    socialLinks?: SocialLink[];
  };
}

interface ProfilePreviewProps {
  user: UserData;
  imageUrl?: string;
}

const socialIconMap: Record<string, ReactElement> = {
  facebook: <Facebook size={14} />,
  instagram: <Instagram size={14} />,
  twitter: <Twitter size={14} />,
  linkedin: <Linkedin size={14} />,
  github: <Github size={14} />,
  youtube: <Youtube size={14} />,
  tiktok: <Music size={14} />,
};

export function ProfilePreview({ user, imageUrl }: ProfilePreviewProps) {
  const visibleLinks =
    user.profile?.socialLinks?.filter((link) => link.isVisible) || [];
  const avatarSrc = imageUrl ?? user.avatar_url;

  return (
    <div className="relative">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto border">
        {/* Profile image / default icon */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-16 h-16 rounded-full border flex items-center justify-center bg-gray-100 overflow-hidden">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={user.name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <UserIcon size={48} className="text-gray-400" />
            )}
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-lg text-gray-900">{user.name}</h3>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Social media links */}
        {visibleLinks.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {visibleLinks.map((link) => {
              const key = link.platform?.toLowerCase() || "";
              const icon = socialIconMap[key] || <Globe size={14} />;
              return (
                <Button
                  key={link.id}
                  variant="outline"
                  size="sm"
                  className="text-xs bg-transparent flex items-center gap-1"
                  onClick={() => window.open(link.url, "_blank")}
                >
                  {icon}
                  {link.platform}
                </Button>
              );
            })}
          </div>
        )}

        {/* QR code */}
        <div className="flex justify-center">
          <QRCodeCanvas
            value={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/${user.username}`}
            size={128}
          />
        </div>
      </div>
    </div>
  );
}
