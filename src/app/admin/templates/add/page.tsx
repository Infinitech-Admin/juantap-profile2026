"use client";

import { useState, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, X, ChevronRight, ChevronLeft, Camera } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { MinimalClean } from "@/components/template-previews/minimal-clean-template-add";

interface TemplateData {
  id: string;
  slug: string;
  name: string;
  description: string;
  description_font: string;
  description_font_size: number;
  description_bg: string; // MISSING - ADD THIS
  preview_url: string;
  thumbnail_url: string;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
  category: "free" | "premium";
  price: number;
  original_price?: number;
  discount?: number;
  features: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    coverBackground: string;
    icon: string;
    nameBackground: string;
    border: string;
    background: string;
    title: string;
    description: string;
  };
  fonts: {
    title: string;
    description: string;
  };
  title_font: string;
  font_size: number;
  fontSizes?: {
    title: number;
    description: number;
  };
  layout: "minimal" | "modern" | "creative" | "professional" | "artistic";
  hide_header: boolean;
  hide_footer: boolean;
  profile_cover: string;
  profile_image: string;
  profile_style: "left-all" | "centered-all" | "right-all" | "left-profile" | "right-profile"; // FIXED
  profile_shape: "rounded" | "square" | "rectangle"; // FIXED
  profile_border: number;
  profile_size: number;
  card_height: number;
  card_width: number;
  card_background: string;
  social_style: "default" | "circles" | "fullblock";
  connect_style: "grid" | "list" | "compact";
  tags: string[];
  is_new: boolean;
  is_popular: boolean;
  downloads: number;
  is_hidden: boolean;
}

const defaultTemplate: TemplateData = {
  id: "",
  slug: "",
  name: "",
  description: "",
  description_font: "Inter",
  description_font_size: 14,
  description_bg: "#f3f4f6", // ADD THIS
  preview_url: "/placeholder.svg",
  thumbnail_url: "/placeholder.svg",
  is_premium: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  category: "free",
  price: 0,
  original_price: 0,
  discount: 0,
  features: [],
  colors: {
    primary: "#f3f4f6",
    secondary: "#f3f4f6",
    accent: "#f3f4f6",
    coverBackground: "#f3f4f6",
    icon: "#33425b",
    nameBackground: "#f3f4f6",
    border: "#f3f4f6",
    background: "#ffffff",
    title: "#111827",
    description: "#6b7280",
  },
  fonts: { title: "Inter", description: "Inter" },
  title_font: "Inter",
  font_size: 22,
  fontSizes: { title: 22, description: 12 },
  layout: "minimal",
  hide_header: false,
  hide_footer: false,
  profile_cover: "",
  profile_image: "",
  profile_style: "centered-all",
  profile_shape: "rounded",
  profile_border: 2,
  profile_size: 120,
  card_height: 120,
  card_width: 300,
  card_background: "#ffffff",
  social_style: "default",
  connect_style: "grid",
  tags: [],
  is_new: false,
  is_popular: false,
  downloads: 0,
  is_hidden: false,
};

type TemplatePayload = Omit<
  TemplateData,
  | "id"
  | "features"
  | "colors"
  | "fonts"
  | "social_style"
  | "connect_style"
  | "card_background"
  | "tags"
> & {
  features: string;
  colors: string;
  fonts: string;
  social_style: string;
  connect_style: string;
  card_background: string;
  tags: string;
};

export default function AddTemplatePage() {
  const [template, setTemplate] = useState<TemplateData>(defaultTemplate);
  const [newFeature, setNewFeature] = useState("");
  const [newTag, setNewTag] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [cardHeight, setCardHeight] = useState(180);
  const [cardWidth, setCardWidth] = useState(512); // Default 512px (max-w-lg)

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"Home" | "Design" | "Layout">("Home");
  const [cardBackgroundImage, setCardBackgroundImage] = useState<string | null>(template.card_background || null);

  const cardBgInputRef = useRef<HTMLInputElement>(null);


  const handleCardBgClick = () => {
    cardBgInputRef.current?.click();
  };

  const handleCardBgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;

        // Save the image data
        setCardBackgroundImage(result);
        updateTemplate("card_background", result);

        // Save the original filename
        updateTemplate("card_background", `${process.env.NEXT_PUBLIC_IMAGE_URL}/storage/${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  };



  const updateTemplate = <K extends keyof TemplateData>(
    field: K,
    value: TemplateData[K]
  ) => {
    setTemplate((prev) => ({
      ...prev,
      [field]: value,
      updated_at: new Date().toISOString(),
    }));
  };

  const updateColors = (colorKey: string, value: string) => {
    setTemplate((prev) => ({
      ...prev,
      colors: { ...prev.colors, [colorKey]: value },
      updated_at: new Date().toISOString(),
    }));
  };

  const updateFonts = (fontKey: string, value: string) => {
    // Ensure selected font is loaded (Google Fonts)
    loadGoogleFont(value);

    setTemplate((prev) => ({
      ...prev,
      fonts: { ...prev.fonts, [fontKey]: value },
      updated_at: new Date().toISOString(),
    }));
  };

  const fontOptions = [
    "Inter",
    "Poppins",
    "Roboto",
    "Playfair Display",
    "Merriweather",
    "Open Sans",
    "Lato",
    "Source Sans Pro",
    "Nunito",
  ];

  const loadGoogleFont = (fontName: string) => {
    if (!fontName) return;
    // Convert to Google Fonts family param (spaces -> +)
    const family = fontName.replace(/\s+/g, "+");
    const href = `https://fonts.googleapis.com/css2?family=${family}:wght@400;700&display=swap`;

    // Avoid injecting duplicate links
    if (document.querySelector(`link[data-google-font="${fontName}"]`)) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.setAttribute("data-google-font", fontName);
    document.head.appendChild(link);
  };

  const renderFontSelect = (
    label: string,
    fontKey: "title" | "description"
  ) => (
    <div>
      <Label htmlFor={fontKey}>{label}</Label>
      <Select
        value={template.fonts[fontKey]}
        onValueChange={(value) => updateFonts(fontKey, value)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {fontOptions.map((f) => (
            <SelectItem key={f} value={f}>
              {f}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const updateFontSize = (fontKey: "title" | "description", value: number) => {
    setTemplate((prev) => ({
      ...prev,
      fontSizes: {
        title: prev.fontSizes?.title ?? 22,
        description: prev.fontSizes?.description ?? 12,
        [fontKey]: value,
      },
      updated_at: new Date().toISOString(),
    }));
  };

  const renderFontSizeSelect = (
    label: string,
    fontKey: "title" | "description",
    min = 12,
    max = 48
  ) => (
    <div className="mb-3">
      <Label>
        {label}
        <span className="text-xs text-gray-500 ml-2">
          ({template.fontSizes?.[fontKey] || (fontKey === "title" ? 22 : 12)}px)
        </span>
      </Label>

      <Select
        value={(
          template.fontSizes?.[fontKey] || (fontKey === "title" ? 22 : 12)
        ).toString()}
        onValueChange={(value) => updateFontSize(fontKey, Number(value))}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {(() => {
            const start = min % 2 === 0 ? min : min + 1;
            const count = Math.floor((max - start) / 2) + 1;
            return Array.from({ length: count }, (_, i) => start + i * 2).map(
              (size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}px
                </SelectItem>
              )
            );
          })()}
        </SelectContent>
      </Select>
    </div>
  );

  const updateprofile_border = (value: number) => {
    setTemplate((prev) => ({
      ...prev,
      profile_border: value,
      updated_at: new Date().toISOString(),
    }));
  };

  const renderprofile_borderSelect = (
    label: string,
    key: string,
    min = 6,
    max = 15
  ) => (
    <div className="mb-3">
      <Label>
        {label}
        <span className="text-xs text-gray-500 ml-2">
          ({template.profile_border ?? 2}px)
        </span>
      </Label>

      <Select
        value={(template.profile_border ?? 2).toString()}
        onValueChange={(value) => updateprofile_border(Number(value))}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: max - min + 1 }, (_, i) => min + i).map(
            (size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}px
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>
    </div>
  );

  const updateprofile_size = (value: number) => {
    setTemplate((prev) => ({
      ...prev,
      profile_size: value,
      updated_at: new Date().toISOString(),
    }));
  };

  const renderprofile_sizeSelect = (
    label: string,
    key: string,
    min = 6,
    max = 15
  ) => (
    <div className="mb-3">
      <Label>
        {label}
        <span className="text-xs text-gray-500 ml-2">
          ({template.profile_size ?? 2}px)
        </span>
      </Label>

      <Select
        value={(template.profile_size ?? 2).toString()}
        onValueChange={(value) => updateprofile_size(Number(value))}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: max - min + 1 }, (_, i) => min + i).map(
            (size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}px
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>
    </div>
  );

  const addFeature = () => {
    if (newFeature.trim()) {
      setTemplate((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setTemplate((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    if (newTag.trim()) {
      setTemplate((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setTemplate((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (name: string) => {
    updateTemplate("name", name);
    if (!template.id) {
      const slug = generateSlug(name);
      updateTemplate("slug", slug);
      updateTemplate("id", slug);
    }
  };

  const saveTemplate = async () => {
    if (!template.name || !template.description) {
      alert("Name and description are required!");
      return;
    }

    setSaving(true);

    try {
      const slug = template.slug || generateSlug(template.name);
      const now = new Date().toISOString();

      const payload: TemplatePayload = {
        ...template,
        slug: template.slug,
        name: template.name,
        description: template.description,

        // FIX: Save font data to individual fields
        description_font: template.fonts.description || "Inter",
        description_font_size: parseInt(String(template.fontSizes?.description || 14)),
        description_bg: template.description_bg || "#f3f4f6",

        preview_url: template?.preview_url
          ? `${template.preview_url}`
          : "/placeholder.svg",
        thumbnail_url: template?.thumbnail_url
          ? `${template.thumbnail_url}`
          : "/placeholder.svg",

        is_premium: Boolean(template.is_premium),
        is_popular: Boolean(template.is_popular),
        is_new: Boolean(template.is_new),
        is_hidden: Boolean(template.is_hidden),

        created_at: template.created_at,
        updated_at: new Date().toISOString(),

        category: template.category,
        price: parseFloat(String(template.price)) || 0,
        original_price: parseFloat(String(template.original_price)) || 0,
        discount: parseFloat(String(template.discount)) || 0,

        downloads: parseInt(String(template.downloads)) || 0,

        features: JSON.stringify(template.features || []),
        colors: JSON.stringify(template.colors || {}),
        fonts: JSON.stringify(template.fonts || {}), // Keep this for backward compatibility
        tags: JSON.stringify(template.tags || []),

        // FIX: Save to individual font fields that Laravel expects
        title_font: template.fonts.title || "Inter",
        font_size: parseInt(String(template.fontSizes?.title || 22)),

        layout: template.layout || "minimal",

        hide_header: Boolean(template.hide_header),
        hide_footer: Boolean(template.hide_footer),

        profile_cover: template?.profile_cover
          ? `${template.profile_cover}`
          : "/placeholder.svg",
        profile_image: template?.profile_image
          ? `${template.profile_image}`
          : "/placeholder.svg",
        profile_style: template.profile_style || "centered-all",
        profile_shape: template.profile_shape || "rounded",

        profile_border: parseInt(String(template.profile_border)) || 2,
        profile_size: parseInt(String(template.profile_size)) || 120,

        card_height: parseInt(String(cardHeight)) || 180,
        card_width: parseInt(String(cardWidth)) || 512,
        card_background: template?.card_background
          ? `${template.card_background}`
          : "/placeholder.svg",

        social_style: String(template.social_style || "default"),
        connect_style: String(template.connect_style || "grid"),
      };

      console.log("[v2] Sending template data to Laravel backend:", payload);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/templates/store`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("[v2] Backend response:", response.data);

      setTemplate({
        ...defaultTemplate,
        created_at: now,
        updated_at: now,
      });

      alert("Template saved successfully!");
      router.push("/admin/templates");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Check if we got an HTML response instead of JSON
        const contentType = error.response?.headers["content-type"];

        if (contentType?.includes("text/html")) {
          console.error("[v2] Server returned HTML instead of JSON");
          console.error("Response data:", error.response?.data);
          alert(
            "Server error: The API endpoint returned an HTML error page. Check the console for details."
          );
        } else if (error.response) {
          // The request was made and the server responded with a status code
          console.error("[v2] Server error:", error.response.status);
          console.error("Error data:", error.response.data);
          alert(
            `Error ${error.response.status}: ${error.response.data.message || "Failed to save template"
            }`
          );
        } else if (error.request) {
          // The request was made but no response was received
          console.error("[v2] No response received:", error.request);
          alert(
            "No response from server. Please check your network connection."
          );
        } else {
          // Something happened in setting up the request
          console.error("[v2] Request setup error:", error.message);
          alert(`Error: ${error.message}`);
        }
      } else if (error instanceof Error) {
        console.error("[v2] Error saving template:", error.message);
        alert(error.message);
      } else {
        console.error("[v2] Unknown error saving template:", error);
        alert("Failed to save template. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/templates">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="border-l h-6"></div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {template.name || "Untitled Template"}
              </h1>
              <p className="text-xs text-gray-500">Template Editor</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={template.is_premium ? "default" : "secondary"}>
              {template.is_premium ? "Premium" : "Free"}
            </Badge>
            <Button onClick={saveTemplate} disabled={saving} size="sm">
              {saving ? "Saving..." : "Save Template"}
            </Button>
          </div>
        </div>
      </div>

      {/* Ribbon Toolbar */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-1">
          {/* Tab Headers */}
          <div className="flex flex-wrap sm:flex-nowrap gap-1 border-b">
            {["Home", "Design", "Layout"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium ${activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="py-2 flex flex-wrap items-center gap-2 sm:gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {activeTab === "Home" && (
              <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
                {/* Title Section */}
                <div className="flex flex-col gap-1 min-w-[180px] flex-shrink-0">
                  <span className="text-xs text-gray-500 font-medium">Title</span>
                  <div className="flex flex-wrap sm:flex-nowrap gap-2">
                    <Select
                      value={template.fonts.title}
                      onValueChange={(value) => updateFonts("title", value)}
                    >
                      <SelectTrigger className="h-8 w-full text-xs">
                        <SelectValue placeholder="Title Font" />
                      </SelectTrigger>
                      <SelectContent>
                        {fontOptions.map((f) => (
                          <SelectItem key={f} value={f}>
                            {f}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={(template.fontSizes?.title || 22).toString()}
                      onValueChange={(value) =>
                        updateFontSize("title", Number(value))
                      }
                    >
                      <SelectTrigger className="h-8 w-full text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[12, 14, 16, 18, 20, 22, 24, 26, 28, 30].map((size) => (
                          <SelectItem key={size} value={size.toString()}>
                            {size}px
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <h1 className="text-sm mt-1 font-semibold">Title</h1>
                </div>

                {/* Description Section */}
                <div className="flex flex-col gap-1 min-w-[180px] flex-shrink-0">
                  <span className="text-xs text-gray-500 font-medium">Description</span>
                  <div className="flex flex-wrap sm:flex-nowrap gap-2">
                    <Select
                      value={template.fonts.description}
                      onValueChange={(value) => updateFonts("description", value)}
                    >
                      <SelectTrigger className="h-8 w-full text-xs">
                        <SelectValue placeholder="Desc Font" />
                      </SelectTrigger>
                      <SelectContent>
                        {fontOptions.map((f) => (
                          <SelectItem key={f} value={f}>
                            {f}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={(template.fontSizes?.description || 12).toString()}
                      onValueChange={(value) =>
                        updateFontSize("description", Number(value))
                      }
                    >
                      <SelectTrigger className="h-8 w-full text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[12, 14, 16, 18, 20, 22, 24, 26, 28, 30].map((size) => (
                          <SelectItem key={size} value={size.toString()}>
                            {size}px
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <h1 className="text-sm mt-1 font-semibold">Description</h1>
                </div>
              </div>
            )}

            {activeTab === "Design" && (
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
                {/* Image Shape */}
                <div className="flex flex-col gap-1 min-w-[180px] flex-shrink-0">
                  <span className="text-xs text-gray-500 font-medium">Image Shape</span>
                  <Select
                    value={template.profile_shape}
                    onValueChange={(value) =>
                      updateTemplate("profile_shape", value as any)
                    }
                  >
                    <SelectTrigger className="h-8 w-full text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rounded">Rounded</SelectItem>
                      <SelectItem value="square">2x2</SelectItem>
                      <SelectItem value="rectangle">Passport</SelectItem>
                    </SelectContent>
                  </Select>
                  <h1 className="text-sm mt-1 font-semibold">Image Shape</h1>
                </div>

                {/* Card Background Upload */}
                <div className="flex flex-col gap-1 min-w-[180px] flex-shrink-0">
                  <span className="text-xs text-gray-500 font-medium">Card Background</span>
                  <label
                    className="cursor-pointer flex items-center gap-2 px-3 py-2 border rounded hover:bg-gray-100"
                    onClick={handleCardBgClick}
                  >
                    <Camera size={16} className="text-gray-500" />
                    <span className="text-xs text-gray-600">Upload Background</span>
                  </label>

                  {cardBackgroundImage && (
                    <img
                      src={cardBackgroundImage}
                      alt="Card Background Preview"
                      className="mt-2 h-20 w-full object-cover rounded"
                    />
                  )}

                  <input
                    ref={cardBgInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCardBgChange}
                    className="hidden"
                  />
                </div>

              </div>
            )}


            {activeTab === "Layout" && (
              <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
                {/* Wrap Profile */}
                <div className="flex flex-col gap-3 min-w-[180px] flex-shrink-0">
                  <span className="text-xs text-gray-500 font-medium">Wrap Profile</span>
                  <Select
                    value={template.profile_style}
                    onValueChange={(value) =>
                      updateTemplate("profile_style", value as any)
                    }
                  >
                    <SelectTrigger className="h-8 w-full text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left-all">Left All</SelectItem>
                      <SelectItem value="centered-all">Centered All</SelectItem>
                      <SelectItem value="right-all">Right All</SelectItem>
                      <SelectItem value="left-profile">Left Profile</SelectItem>
                      <SelectItem value="right-profile">Right Profile</SelectItem>
                    </SelectContent>
                  </Select>
                  <h1 className="text-sm mt-1 font-semibold">Wrap Profile</h1>
                </div>

                {/* Wrap Links */}
                <div className="flex flex-col gap-3 min-w-[180px] flex-shrink-0">
                  <span className="text-xs text-gray-500 font-medium">Wrap Links</span>
                  <div className="flex flex-row gap-2">
                    <Select
                      value={template.social_style}
                      onValueChange={(value) =>
                        updateTemplate("social_style", value as any)
                      }
                    >
                      <SelectTrigger className="h-8 w-full text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="circles">Circles</SelectItem>
                        <SelectItem value="fullblock">Full Block</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={template.connect_style}
                      onValueChange={(value) =>
                        updateTemplate("connect_style", value as any)
                      }
                    >
                      <SelectTrigger className="h-8 w-full text-xs flex-1 min-w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grid">Grid</SelectItem>
                        <SelectItem value="list">List</SelectItem>
                        <SelectItem value="compact">Compact</SelectItem>
                      </SelectContent>
                    </Select>

                  </div>
                  <h1 className="text-sm mt-1 font-semibold">Wrap Links</h1>
                </div>
              </div>
            )}



          </div>
        </div>
      </div>



      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Properties Panel */}
          <div className="lg:col-span-1 space-y-4 overflow-y-auto max-h-[calc(100vh-140px)] custom-scrollbar">
            {/* Basic Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs">Template Name</Label>
                  <Input
                    value={template.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g., Minimal Clean"
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="mb-1" htmlFor="slug">
                    Slug (auto-generated)
                  </Label>
                  <Input
                    id="slug"
                    value={template.slug}
                    onChange={(e) => updateTemplate("slug", e.target.value)}
                    placeholder="minimal-clean"
                  />
                </div>
                <div>
                  <Label className="text-xs">Description</Label>
                  <Textarea
                    value={template.description}
                    onChange={(e) =>
                      updateTemplate("description", e.target.value)
                    }
                    placeholder="Template description..."
                    className="text-sm min-h-[60px]"
                  />
                </div>

                {/* Category, Layout, Checkboxes Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Category</Label>
                    <Select
                      value={template.category}
                      onValueChange={(value) => {
                        updateTemplate("category", value as "free" | "premium");
                        updateTemplate("is_premium", value === "premium");
                      }}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs">Layout</Label>
                    <Select
                      value={template.layout}
                      onValueChange={(value) =>
                        updateTemplate("layout", value as any)
                      }
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                        <SelectItem value="professional">
                          Professional
                        </SelectItem>
                        <SelectItem value="artistic">Artistic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Premium Pricing */}
                {template.category === "premium" && (
                  <div className="pt-3 border-t">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label className="text-xs">Price (auto)</Label>
                        <Input
                          type="number"
                          value={template.price}
                          disabled
                          className="h-8 text-xs bg-gray-50"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Original</Label>
                        <Input
                          type="number"
                          value={template.original_price || ""}
                          onChange={(e) => {
                            const original = Number(e.target.value) || 0;
                            updateTemplate("original_price", original);
                            const calculated =
                              original -
                              (original * (template.discount || 0)) / 100;
                            updateTemplate("price", calculated);
                          }}
                          placeholder="399"
                          className="h-8 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Discount %</Label>
                        <Input
                          type="number"
                          value={template.discount || ""}
                          onChange={(e) => {
                            const discount = Number(e.target.value) || 0;
                            updateTemplate("discount", discount);
                            const calculated =
                              (template.original_price || 0) -
                              ((template.original_price || 0) * discount) / 100;
                            updateTemplate("price", calculated);
                          }}
                          placeholder="0"
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-4 mt-5">
                  {/* Basic Info Section */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="is_popular"
                        checked={template.is_popular}
                        onCheckedChange={(checked) =>
                          updateTemplate("is_popular", Boolean(checked))
                        }
                      />
                      <Label htmlFor="is_popular" className="text-xs">
                        Mark as Popular
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="is_new"
                        checked={template.is_new}
                        onCheckedChange={(checked) =>
                          updateTemplate("is_new", Boolean(checked))
                        }
                      />
                      <Label htmlFor="is_new" className="text-xs">
                        Mark as New
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Color Palette */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Colors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs mb-1 block">Primary Color</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="color"
                        value={template.colors.coverBackground}
                        onChange={(e) =>
                          updateColors("coverBackground", e.target.value)
                        }
                        className="w-10 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={template.colors.coverBackground}
                        onChange={(e) =>
                          updateColors("coverBackground", e.target.value)
                        }
                        className="h-8 text-xs flex-1"
                        placeholder="#bc8f8f"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs mb-1 block">
                      Secondary Color
                    </Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="color"
                        value={template.colors.accent}
                        onChange={(e) => updateColors("accent", e.target.value)}
                        className="w-10 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={template.colors.accent}
                        onChange={(e) => updateColors("accent", e.target.value)}
                        className="h-8 text-xs flex-1"
                        placeholder="#993838"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs mb-1 block">
                      Background Color
                    </Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="color"
                        value={template.colors.background}
                        onChange={(e) =>
                          updateColors("background", e.target.value)
                        }
                        className="w-10 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={template.colors.background}
                        onChange={(e) =>
                          updateColors("background", e.target.value)
                        }
                        className="h-8 text-xs flex-1"
                        placeholder="#a59c9c"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs mb-1 block">Name Background</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="color"
                        value={template.colors.nameBackground}
                        onChange={(e) => updateColors("nameBackground", e.target.value)}
                        className="w-10 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={template.colors.nameBackground}
                        onChange={(e) => updateColors("nameBackground", e.target.value)}
                        className="h-8 text-xs flex-1"
                        placeholder="#c1f1f1"
                      />
                    </div>
                  </div>



                  <div>
                    <Label className="text-xs mb-1 block">
                      Border Color
                    </Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="color"
                        value={template.colors.border}
                        onChange={(e) =>
                          updateColors("border", e.target.value)
                        }
                        className="w-10 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={template.colors.border}
                        onChange={(e) =>
                          updateColors("border", e.target.value)
                        }
                        className="h-8 text-xs flex-1"
                        placeholder="#244ac6"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs mb-1 block">Icon Color</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="color"
                        value={template.colors.icon}
                        onChange={(e) => updateColors("icon", e.target.value)}
                        className="w-10 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={template.colors.icon}
                        onChange={(e) => updateColors("icon", e.target.value)}
                        className="h-8 text-xs flex-1"
                        placeholder="#a72f2f"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs mb-1 block">Title Color</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="color"
                        value={template.colors.title}
                        onChange={(e) => updateColors("title", e.target.value)}
                        className="w-10 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={template.colors.title}
                        onChange={(e) => updateColors("title", e.target.value)}
                        className="h-8 text-xs flex-1"
                        placeholder="#c1f1f1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs mb-1 block">
                      Description Color
                    </Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="color"
                        value={template.colors.description}
                        onChange={(e) =>
                          updateColors("description", e.target.value)
                        }
                        className="w-10 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={template.colors.description}
                        onChange={(e) =>
                          updateColors("description", e.target.value)
                        }
                        className="h-8 text-xs flex-1"
                        placeholder="#c62424"
                      />
                    </div>
                  </div>


                </div>
              </CardContent>
            </Card>

            {/* Advanced Styling */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">
                  Advanced Styling
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs">
                    Profile Border ({template.profile_border ?? 2}px)
                  </Label>
                  <Input
                    type="range"
                    min="0"
                    max="8"
                    value={template.profile_border ?? 2}
                    onChange={(e) =>
                      updateprofile_border(Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="text-xs">
                    Profile Size ({template.profile_size ?? 120}px)
                  </Label>
                  <Input
                    type="range"
                    min="120"
                    max="250"
                    value={template.profile_size ?? 120}
                    onChange={(e) => updateprofile_size(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="text-xs">
                    Card Height ({cardHeight}px)
                  </Label>
                  <Input
                    type="range"
                    min="50"
                    max="300"
                    value={cardHeight}
                    onChange={(e) => setCardHeight(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="text-xs">Card Width ({cardWidth}px)</Label>
                  <Input
                    type="range"
                    min="320"
                    max="768"
                    value={cardWidth}
                    onChange={(e) => setCardWidth(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right - Preview Area */}
          <div className="lg:col-span-2">
            <Card className="sticky top-6">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">
                    Live Preview
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {cardWidth} × {cardHeight}px
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-8 rounded-lg flex items-center justify-center min-h-[600px]">
                  <MinimalClean
                    social_style={template.social_style}
                    connect_style={template.connect_style}
                    profile_style={template.profile_style}
                    profile_shape={template.profile_shape}
                    colors={template.colors}
                    fonts={template.fonts}
                    fontSizes={template.fontSizes}
                    hide_header={template.hide_header}
                    hide_footer={template.hide_footer}
                    profileBorder={template.profile_border}
                    profileSize={template.profile_size}
                    cardHeight={cardHeight}
                    cardWidth={cardWidth}
                    description_bg={template.description_bg}
                    card_background={cardBackgroundImage || template.card_background}

                    onHideHeaderChange={(value) => updateTemplate("hide_header", value)}
                    onHideFooterChange={(value) => updateTemplate("hide_footer", value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div >
  );
}
