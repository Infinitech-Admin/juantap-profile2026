// src/lib/template-data.ts
import axios from "axios";
import { User } from "@/types/template";
import React from "react";

// Import template components
import { PreviewRenderer } from "@/components/templates/PreviewRenderer";
import { MinimalClean } from "@/components/template-previews/minimal-clean";
import { Infinitech } from "@/components/template-previews/infinitech";
import { Nika } from "@/components/template-previews/nika";
import { Tech } from "@/components/template-previews/tech";
import { Halloween } from "@/components/template-previews/halloween";
import { Executive } from "@/components/template-previews/executive";
import { CorporateBlue } from "@/components/template-previews/corporate-blue"; // NEW
import { CorporateEmerald } from "@/components/template-previews/corporate-emerald"; // NEW
import { MidnightGold } from "@/components/template-previews/midnight-gold"; // NEW
import { ExecutivePrestige } from "@/components/template-previews/executive-prestige"; // NEW
// Add more template imports as you create them

export interface Template {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  is_premium: boolean;
  price: number | null;
  original_price?: number | null;
  discount?: number | null;
  preview_url: string;
  thumbnail_url: string;
  features?: any;
  colors?: any;
  fonts?: any;
  layout?: string;
  social_style?: string;
  connect_style?: string;
  tags?: any;
  is_popular: boolean;
  is_new: boolean;
  created_at?: string;
  updated_at?: string;
  downloads?: number;
  status?: "saved" | "bought" | string;

  user?: User;

  unlocks?: number; // downloads
  saves?: number; // views

  isActive: boolean;
  isNew?: boolean;
  isPopular: boolean;
  createdAt?: string;

  // For component mapping
  previewComponent?: React.ComponentType<any>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL!;
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL!;

// Map template slugs to their React components
const TEMPLATE_COMPONENTS: Record<string, React.ComponentType<any>> = {
  "brotherhood-legacy": PreviewRenderer,
  "minimal-clean": MinimalClean,
  infinitech: Infinitech, // must match the slug in your database
  nika: Nika, // must match the slug in your database
  tech: Tech, // must match the slug in your database
  halloween: Halloween, // must match the slug in your database
  executive: Executive, // must match the slug in your database
  "corporate-blue": CorporateBlue, // NEW - must match the slug in your database
  "corporate-emerald": CorporateEmerald, // NEW - must match the slug in your database
  "midnight-gold": MidnightGold, // NEW - must match the slug in your database
  "executive-prestige": ExecutivePrestige, // NEW - must match the slug in your database
  // Add more template mappings here as you create them
  // "sunset-gradient": SunsetGradient,
  // "professional-dark": ProfessionalDark,
};

// Get the preview component for a slug (use this in pages that fetch templates on their own)
export const getPreviewComponent = (slug: string): React.ComponentType<any> =>
  TEMPLATE_COMPONENTS[slug] || PreviewRenderer;

// Attach the preview component to a template based on its slug
const withComponent = (tpl: Template): Template => ({
  ...tpl,
  previewComponent: TEMPLATE_COMPONENTS[tpl.slug] || PreviewRenderer,
});

// Fetch templates (authenticated if token exists)
export async function fetchTemplates(): Promise<Template[]> {
  try {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const response = await axios.get(`${API_URL}/templates`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    // Adjust this depending on backend response
    const templates = response.data.templates ?? response.data;

    return templates.map(withComponent);
  } catch (error) {
    console.error("Error fetching templates:", error);
    return [];
  }
}

// Fetch all templates (no auth)
export async function getAllTemplates(): Promise<Template[]> {
  const res = await fetch(`${API_URL}/templates`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch templates");
  const data = await res.json();
  const templates = data.templates ?? data;

  return templates.map(withComponent);
}

// Fetch template by slug
export async function getTemplateBySlug(slug: string): Promise<Template> {
  const res = await fetch(`${API_URL}/templates/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Template not found");
  const data = await res.json();

  return withComponent(data);
}

// Fetch template by ID
export async function getTemplateById(id: string): Promise<Template> {
  const res = await fetch(`${API_URL}/templates/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Template not found");
  const data = await res.json();

  return withComponent(data);
}

// Get current user (with profile + socials, normalized avatar URL)
export async function getCurrentUser(): Promise<User | null> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/user-profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();

    // Normalize avatar URL
    let avatarUrl = "/default-avatar.png";
    if (data.profile_image) {
      const cleanPath = data.profile_image.replace(/^storage\//, "");
      avatarUrl = `${IMAGE_URL.replace(/\/$/, "")}/storage/${cleanPath}`;
    }

    return {
      id: data.id,
      name: data.name,
      username: data.username,
      email: data.email,
      is_admin: data.is_admin,
      avatar_url: avatarUrl,
      display_name: data.display_name ?? data.name,
      profile: {
        bio: data.profile?.bio ?? "",
        phone: data.profile?.phone ?? "",
        website: data.profile?.website ?? "",
        location: data.profile?.location ?? "",
        socialLinks: data.profile?.socialLinks ?? [],
      },
    };
  } catch (err) {
    console.error("Error fetching current user:", err);
    return null;
  }
}

export async function getUserTemplatesWithStatus(): Promise<Template[]> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) return [];

  try {
    const res = await fetch(`${API_URL}/templates2`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok)
      throw new Error("Failed to fetch user's templates with status");

    const templates = await res.json();

    return templates.map(withComponent);
  } catch (err) {
    console.error("Error fetching templates with status:", err);
    return [];
  }
}

export async function fetchTemplatesWithStats(): Promise<Template[]> {
  try {
    const [templatesRes, statsRes] = await Promise.all([
      fetch(`${API_URL}/templates`, { cache: "no-store" }),
      fetch(`${API_URL}/stats/top-templates`, { cache: "no-store" }),
    ]);

    if (!templatesRes.ok || !statsRes.ok) {
      throw new Error("Failed to fetch templates or stats");
    }

    const templates: Template[] = await templatesRes.json();
    const stats: any[] = await statsRes.json();

    return templates.map((tpl) => {
      const stat = stats.find((s) => s.id === tpl.id);
      return {
        ...withComponent(tpl),
        unlocks: stat?.unlocks ?? 0,
        saves: stat?.saves ?? 0,
        revenue: stat?.revenue ?? 0,
      };
    });
  } catch (err) {
    console.error("Error fetching templates with stats:", err);
    return [];
  }
}

// Get saved templates
export async function getSavedTemplates(): Promise<Template[]> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) return [];

  try {
    const res = await fetch(`${API_URL}/templates1/saved`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch saved templates");

    const data = await res.json();
    const templates = Array.isArray(data) ? data : [];

    return templates.map(withComponent);
  } catch (err) {
    console.error("Error fetching saved templates:", err);
    return [];
  }
}

// Get bought templates
export async function getBoughtTemplates(): Promise<Template[]> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) return [];

  try {
    const res = await fetch(`${API_URL}/templates1/boughted`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch bought templates");

    const data = await res.json();
    const templates = Array.isArray(data?.data) ? data.data : [];

    return templates.map(withComponent);
  } catch (err) {
    console.error("Error fetching bought templates:", err);
    return [];
  }
}

// Export constants (in case you need them in components)
export { API_URL, IMAGE_URL, FRONTEND_URL };
