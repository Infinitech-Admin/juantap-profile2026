"use client"

import React, { useState } from "react"
import {
  Mail,
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
  Send,
  MessageCircle,
  MapPin,
  Phone,
} from "lucide-react"
import { User as UserIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { QRCodeSVG } from "qrcode.react"
import type { Template, User } from "@/types/template"
import { toast } from "sonner"

interface SocialLink {
  id: string
  platform: string
  username: string
  url: string
  isVisible?: boolean | number
}

interface PreviewRendererProps {
  template: Template
  user?: User
}

export const PreviewRenderer: React.FC<PreviewRendererProps> = ({ template, user }) => {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [avatarError, setAvatarError] = useState(false)
  const profileUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${user?.username || ""}`

  const downloadQR = () => {
    const svg = document.querySelector<SVGSVGElement>("#qr-code-svg")
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const link = document.createElement("a")
      link.download = `${user?.username || "profile"}-qr.jpg`
      link.href = canvas.toDataURL("image/jpeg")
      link.click()
    }
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`
  }

  const socialIconMap: Record<string, React.ReactNode> = {
    facebook: <Facebook size={16} />,
    instagram: <Instagram size={16} />,
    twitter: <Twitter size={16} />,
    linkedin: <Linkedin size={16} />,
    github: <Github size={16} />,
    youtube: <Youtube size={16} />,
    tiktok: <Music size={16} />,
    telegram: <Send size={16} />,
    viber: <MessageCircle size={16} />,
  }

  const copyUrl = () => {
    navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied!")
  }

  const avatarUrl = user?.avatar_url || null

  return (
    <div className="w-full flex justify-center p-5" style={{ backgroundColor: "#f9fafb" }}>
      <div
        className="w-full max-w-lg shadow-lg rounded-2xl overflow-hidden flex flex-col"
        style={{
          // ✅ FIXED: Use background color from database
          backgroundColor: template?.colors?.background || "#ffffff",
          fontFamily: template?.fonts?.body,
        }}
      >
        {/* Banner */}
        <div
          className="w-full h-32"
          style={{
            // ✅ FIXED: Use coverBackground instead of mixing accent + primary
            background: template?.colors?.coverBackground || `linear-gradient(135deg, ${template?.colors?.accent}, ${template?.colors?.primary})`,
          }}
        />

        {/* Avatar & Bio */}
        <div className="relative flex flex-col items-center mt-6 px-6">
          <div 
            className="border-4 shadow-lg overflow-hidden bg-white/20 -mt-16 flex items-center justify-center"
            style={{
              // ✅ FIXED: Use profile size from template
              width: `${template?.profile_size || 224}px`,
              height: `${(template?.profile_size || 224) * 1.3}px`, // Keep the 1.3 ratio for portrait
              borderColor: template?.colors?.border || "#ffffff",
              borderRadius: template?.profile_shape === "rounded" ? "0.5rem" : "0",
            }}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl || user?.avatar_url}
                alt={template?.user?.name || "Author"}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <UserIcon size={48} className="text-gray-400" />
            )}
          </div>

          <h1
            className="mt-4 text-xl font-bold"
            style={{
              fontFamily: template?.fonts?.heading || template?.fonts?.title,
              // ✅ FIXED: Use title color from database
              color: template?.colors?.title || "#000000",
            }}
          >
            {user?.display_name || user?.name || user?.username || "Anonymous"}
          </h1>

          {user?.profile?.bio && (
            <p
              className="text-sm text-center mt-1"
              style={{
                // ✅ FIXED: Use description color from database
                color: template?.colors?.description || "#6b7280",
                fontFamily: template?.fonts?.body || template?.fonts?.description,
              }}
            >
              {user.profile.bio}
            </p>
          )}
        </div>

        {/* Contact */}
        <div className="p-6 space-y-4">
          <h2
            className="text-sm font-semibold uppercase"
            style={{
              // ✅ FIXED: Use title color for section headers
              color: template?.colors?.title || "#000000",
              fontFamily: template?.fonts?.heading || template?.fonts?.title,
            }}
          >
            Contact
          </h2>

          {/* Email */}
          {user?.email && (
            <>
              {user.email.split(',').map((email: string, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center rounded-lg p-3 text-sm"
                  style={{
                    backgroundColor: `${template?.colors?.primary}10`,
                    fontFamily: template?.fonts?.body || template?.fonts?.description,
                  }}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0" style={{ 
                    // ✅ FIXED: Use description color for contact text
                    color: template?.colors?.description || "#000000" 
                  }}>
                    <Mail size={16} className="flex-shrink-0" style={{ color: template?.colors?.icon || template?.colors?.accent }} />
                    <span className="truncate">{email.trim()}</span>
                  </div>
                  <button 
                    className="hover:opacity-70 ml-3 flex-shrink-0" 
                    style={{ color: template?.colors?.icon || template?.colors?.accent }} 
                    onClick={() => handleCopy(email.trim())}
                    aria-label={`Copy ${email.trim()}`}
                  >
                    <Copy size={16} />
                  </button>
                </div>
              ))}
            </>
          )}

          {/* Phone */}
          {user?.profile?.phone && (
            <>
              {user.profile.phone.split(',').map((phone: string, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center rounded-lg p-3 text-sm"
                  style={{
                    backgroundColor: `${template?.colors?.primary}10`,
                    fontFamily: template?.fonts?.body || template?.fonts?.description,
                  }}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0" style={{ 
                    color: template?.colors?.description || "#000000" 
                  }}>
                    <Phone size={16} className="flex-shrink-0" style={{ color: template?.colors?.icon || template?.colors?.accent }} />
                    <span className="truncate">{phone.trim()}</span>
                  </div>
                  <button 
                    className="hover:opacity-70 ml-3 flex-shrink-0" 
                    style={{ color: template?.colors?.icon || template?.colors?.accent }} 
                    onClick={() => handleCopy(phone.trim())}
                    aria-label={`Copy ${phone.trim()}`}
                  >
                    <Copy size={16} />
                  </button>
                </div>
              ))}
            </>
          )}

          {/* Website */}
          {user?.profile?.website && (
            <>
              {user.profile.website.split(',').map((website: string, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center rounded-lg p-3 text-sm"
                  style={{
                    backgroundColor: `${template?.colors?.primary}10`,
                    fontFamily: template?.fonts?.body || template?.fonts?.description,
                  }}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0" style={{ 
                    color: template?.colors?.description || "#000000" 
                  }}>
                    <Globe size={16} className="flex-shrink-0" style={{ color: template?.colors?.icon || template?.colors?.accent }} />
                    <a 
                      href={website.trim()} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="underline hover:opacity-70 truncate"
                    >
                      {website.trim()}
                    </a>
                  </div>
                  <button 
                    className="hover:opacity-70 ml-3 flex-shrink-0" 
                    style={{ color: template?.colors?.icon || template?.colors?.accent }} 
                    onClick={() => handleCopy(website.trim())}
                    aria-label={`Copy ${website.trim()}`}
                  >
                    <Copy size={16} />
                  </button>
                </div>
              ))}
            </>
          )}

          {/* Location */}
          {user?.profile?.location && (
            <div
              className="flex justify-between items-center rounded-lg p-3 text-sm"
              style={{
                backgroundColor: `${template?.colors?.primary}10`,
                fontFamily: template?.fonts?.body || template?.fonts?.description,
              }}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0" style={{ 
                color: template?.colors?.description || "#000000" 
              }}>
                <MapPin size={16} className="flex-shrink-0" style={{ color: template?.colors?.icon || template?.colors?.accent }} />
                <span className="truncate">{user.profile.location}</span>
              </div>
              <button 
                className="hover:opacity-70 ml-3 flex-shrink-0" 
                style={{ color: template?.colors?.icon || template?.colors?.accent }} 
                onClick={() => handleCopy(user.profile.location)}
                aria-label={`Copy ${user.profile.location}`}
              >
                <Copy size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Social Links */}
        {user?.profile?.socialLinks && user?.profile?.socialLinks?.length > 0 && (
          <div className="px-6 pb-6">
            <h2
              className="text-sm font-semibold uppercase mb-3"
              style={{
                // ✅ FIXED: Use title color for section headers
                color: template?.colors?.title || "#000000",
                fontFamily: template?.fonts?.heading || template?.fonts?.title,
              }}
            >
              Connect with me
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {user?.profile?.socialLinks
                ?.filter((link: SocialLink) => link.isVisible === true || link.isVisible === 1)
                .map((link: SocialLink) => {
                  const platformKey = link.platform?.toLowerCase()
                  const icon = socialIconMap[platformKey] || <Globe size={14} />
                  return (
                    
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-lg p-2 text-sm hover:opacity-80 transition"
                      style={{
                        backgroundColor: `${template?.colors?.accent}15`,
                        // ✅ FIXED: Use description color for social link text
                        color: template?.colors?.description || "#000000",
                        fontFamily: template?.fonts?.body || template?.fonts?.description,
                      }}
                    >
                      <span style={{ color: template?.colors?.icon || template?.colors?.accent }}>{icon}</span>
                      <span>{link.username}</span>
                    </a>
                  )
                })}
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div
          className="flex justify-around border-t p-4"
          style={{
            backgroundColor: `${template?.colors?.primary}10`,
            borderColor: `${template?.colors?.border || template?.colors?.primary}20`,
            fontFamily: template?.fonts?.body || template?.fonts?.description,
          }}
        >
          <button
            onClick={() => setIsQRModalOpen(true)}
            className="flex flex-col items-center text-sm hover:opacity-70"
            style={{ 
              // ✅ FIXED: Use description color for button text
              color: template?.colors?.description || "#000000" 
            }}
          >
            <QrCode className="w-5 h-5 mb-1" style={{ color: template?.colors?.icon || template?.colors?.accent }} /> QR Code
          </button>

          <button
            onClick={() =>
              navigator.share?.({
                title: template?.name ?? "My Profile",
                text: template?.description ?? "",
                url: profileUrl,
              })
            }
            className="flex flex-col items-center text-sm hover:opacity-70"
            style={{ 
              color: template?.colors?.description || "#000000" 
            }}
          >
            <Share2 className="w-5 h-5 mb-1" style={{ color: template?.colors?.icon || template?.colors?.accent }} /> Share
          </button>
        </div>
      </div>

      {/* QR Modal */}
      <Dialog open={isQRModalOpen} onOpenChange={setIsQRModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" /> QR Code for {user?.name || "Anonymous"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-4">
            <QRCodeSVG id="qr-code-svg" value={profileUrl} size={256} />
            <a href={profileUrl} target="_blank" rel="noopener noreferrer">
              {profileUrl}
            </a>

            <div className="w-full p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Profile URL:</p>

              <div className="flex items-center justify-between">
                <code className="text-sm text-gray-800 truncate flex-1 mr-2">{profileUrl}</code>

                <Button variant="ghost" size="sm" onClick={copyUrl}>
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>

            <div className="flex gap-2 w-full">
              <Button variant="outline" onClick={downloadQR}>
                <Download className="w-4 h-4 mr-2" /> Download
              </Button>

              <Button onClick={() => setIsQRModalOpen(false)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
