"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { ArrowLeft } from "lucide-react";
import { MinimalClean } from "@/components/template-previews/minimal-clean-template-edit";

interface TemplateData {
  id: string | number;
  slug: string;
  name: string;
  description: string;
  description_font: string;
  description_font_size: number;
  description_bg: string;
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
  profile_style: "left-all" | "centered-all" | "right-all" | "left-profile" | "right-profile";
  profile_shape: "circle" | "square" | "rounded";
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
  description_bg: "#f3f4f6",
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
    primary: "#1f2937",
    secondary: "#6b7280",
    accent: "#3b82f6",
    coverBackground: "#f3f4f6",
    icon: "#3b82f6",
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
  profile_shape: "circle",
  profile_border: 2,
  profile_size: 120,
  card_height: 180,
  card_width: 512,
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
  | "tags"
> & {
  id?: number | string;
  features: string;
  colors: string;
  fonts: string;
  social_style: string;
  connect_style: string;
  tags: string;
};

export default function TemplateEditorPage() {
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const router = useRouter();

  const [template, setTemplate] = useState<TemplateData>(defaultTemplate);
  const [newFeature, setNewFeature] = useState("");
  const [newTag, setNewTag] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!slug);
  const [cardHeight, setCardHeight] = useState(180);
  const [cardWidth, setCardWidth] = useState(512);

  const isEditMode = !!slug;

  // Fetch template data if in edit mode
  useEffect(() => {
    if (!slug) return;

    const fetchTemplate = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/templates/${slug}`
        );

        const data = res.data as TemplateData;

        // Parse JSON strings if needed
        const parsedData = {
          ...data,
          colors: typeof data.colors === 'string' ? JSON.parse(data.colors) : data.colors || {},
          fonts: typeof data.fonts === 'string' ? JSON.parse(data.fonts) : data.fonts || {},
          features: typeof data.features === 'string' ? JSON.parse(data.features) : data.features || [],
          tags: typeof data.tags === 'string' ? JSON.parse(data.tags) : data.tags || [],
        };

        setTemplate(parsedData);
        setCardHeight(parsedData.card_height || 180);
        setCardWidth(parsedData.card_width || 512);
      } catch (err) {
        console.error("❌ Failed to fetch template:", err);
        alert("Failed to load template.");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [slug]);

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
    const family = fontName.replace(/\s+/g, "+");
    const href = `https://fonts.googleapis.com/css2?family=${family}:wght@400;700&display=swap`;

    if (document.querySelector(`link[data-google-font="${fontName}"]`)) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.setAttribute("data-google-font", fontName);
    document.head.appendChild(link);
  };

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

  const updateprofile_border = (value: number) => {
    setTemplate((prev) => ({
      ...prev,
      profile_border: value,
      updated_at: new Date().toISOString(),
    }));
  };

  const updateprofile_size = (value: number) => {
    setTemplate((prev) => ({
      ...prev,
      profile_size: value,
      updated_at: new Date().toISOString(),
    }));
  };

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
    if (!isEditMode && !template.id) {
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
        slug,
        created_at: template.created_at || now,
        updated_at: now,
        features: JSON.stringify(template.features),
        colors: JSON.stringify(template.colors),
        fonts: JSON.stringify(template.fonts),
        tags: JSON.stringify(template.tags),
        social_style: JSON.stringify(template.social_style),
        connect_style: JSON.stringify(template.connect_style),
        profile_cover: JSON.stringify(template.profile_cover),
        profile_image: JSON.stringify(template.profile_image),
      };

      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      let response;
      if (isEditMode && template.id) {
        // Update existing template
        response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/templates/${template.id}`,
          payload,
          { headers }
        );
        console.log("[v2] Template updated:", response.data);
        alert("Template updated successfully!");
      } else {
        // Create new template
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/templates/store`,
          payload,
          { headers }
        );
        console.log("[v2] Template created:", response.data);
        alert("Template saved successfully!");
      }

      router.push("/admin/templates");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const contentType = error.response?.headers["content-type"];

        if (contentType?.includes("text/html")) {
          console.error("[v2] Server returned HTML instead of JSON");
          console.error("Response data:", error.response?.data);
          alert(
            "Server error: The API endpoint returned an HTML error page. Check the console for details."
          );
        } else if (error.response) {
          console.error("[v2] Server error:", error.response.status);
          console.error("Error data:", error.response.data);
          alert(
            `Error ${error.response.status}: ${error.response.data.message || "Failed to save template"
            }`
          );
        } else if (error.request) {
          console.error("[v2] No response received:", error.request);
          alert(
            "No response from server. Please check your network connection."
          );
        } else {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg">Loading template...</p>
      </div>
    );
  }

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
              <p className="text-xs text-gray-500">
                {isEditMode ? "Edit Template" : "Create New Template"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={template.is_premium ? "default" : "secondary"}>
              {template.is_premium ? "Premium" : "Free"}
            </Badge>
            <Button onClick={saveTemplate} disabled={saving} size="sm">
              {saving ? "Saving..." : isEditMode ? "Update Template" : "Save Template"}
            </Button>
          </div>
        </div>
      </div>

      {/* Ribbon Toolbar - Word Style */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2">
          {/* Tab Headers */}
          <div className="flex gap-1 border-b">
            <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
              Home
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
              Design
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
              Layout
            </button>
          </div>
          {/* Toolbar Sections */}
          <div className="py-2 flex items-center gap-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {/* Typography Section */}
            <div className="flex flex-col gap-1 min-w-fit">
              <span className="text-xs text-gray-500 font-medium">
                Typography
              </span>
              <div className="flex items-center gap-2">
                <Select
                  value={template.fonts.title}
                  onValueChange={(value) => updateFonts("title", value)}
                >
                  <SelectTrigger className="h-8 w-32 text-xs">
                    <SelectValue placeholder="Title font" />
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
                  <SelectTrigger className="h-8 w-20 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 44, 46, 48].map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size}px
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={template.fonts.description}
                  onValueChange={(value) => updateFonts("description", value)}
                >
                  <SelectTrigger className="h-8 w-32 text-xs">
                    <SelectValue placeholder="Desc font" />
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
                  value={(template.fontSizes?.description || 6).toString()}
                  onValueChange={(value) =>
                    updateFontSize("description", Number(value))
                  }
                >
                  <SelectTrigger className="h-8 w-20 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 44].map(
                      (size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}px
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-l h-12"></div>

            {/* Style Section */}
            <div className="flex flex-col gap-1 min-w-fit">
              <span className="text-xs text-gray-500 font-medium">Style</span>
              <div className="flex items-center gap-2">
                <Select
                  value={template.profile_style}
                  onValueChange={(value) =>
                    updateTemplate("profile_style", value as any)
                  }
                >
                  <SelectTrigger className="h-8 w-32 text-xs">
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

                <Select
                  value={template.social_style}
                  onValueChange={(value) =>
                    updateTemplate("social_style", value as any)
                  }
                >
                  <SelectTrigger className="h-8 w-28 text-xs">
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
                    updateTemplate(
                      "connect_style",
                      value as "grid" | "list" | "compact"
                    )
                  }
                >
                  <SelectTrigger className="h-8 w-28 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grid</SelectItem>
                    <SelectItem value="list">List</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-l h-12"></div>

            {/* Size Section */}
            <div className="flex flex-col gap-1 min-w-fit">
              <span className="text-xs text-gray-500 font-medium">Size</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600">H:</span>
                  <Input
                    type="number"
                    value={cardHeight}
                    onChange={(e) => setCardHeight(Number(e.target.value))}
                    className="h-8 w-16 text-xs"
                    min="80"
                    max="300"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600">W:</span>
                  <Input
                    type="number"
                    value={cardWidth}
                    onChange={(e) => setCardWidth(Number(e.target.value))}
                    className="h-8 w-16 text-xs"
                    min="320"
                    max="768"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Properties Panel */}
          <div className="lg:col-span-1 space-y-4 overflow-y-auto max-h-[calc(100vh-240px)]">
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
                  <Label className="mb-1 text-xs" htmlFor="slug">
                    Slug {isEditMode && "(auto-generated)"}
                  </Label>
                  <Input
                    id="slug"
                    value={template.slug}
                    onChange={(e) => updateTemplate("slug", e.target.value)}
                    placeholder="minimal-clean"
                    className="h-8 text-sm"
                    disabled={isEditMode}
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

                {/* Category, Layout Row */}
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

                {/* Visibility and Status Options */}
                <div className="flex flex-col gap-2 pt-3 border-t">
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
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="is_hidden"
                      checked={template.is_hidden}
                      onCheckedChange={(checked) =>
                        updateTemplate("is_hidden", Boolean(checked))
                      }
                    />
                    <Label htmlFor="is_hidden" className="text-xs">
                      Hide Template
                    </Label>
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
                    max="150"
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
                    min="80"
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
                    profileBorder={template.profile_border} // ✅ Match existing camelCase prop
                    profileSize={template.profile_size} // ✅ Match existing camelCase prop
                    cardHeight={cardHeight}
                    cardWidth={cardWidth}
                    description_bg={template.description_bg}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
