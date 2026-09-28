import type { ComponentType } from "react";

export interface SocialLink {
  id: string;
  platform: string;
  username: string;
  url: string;
  isVisible?: boolean;
  is_visible?: boolean | number; // backend may send snake_case
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  is_admin: boolean;
  avatar_url: string;
  display_name?: string;

  // ✅ add these two optional fields
  profile_image?: string;
  profile_image_url?: string;

  social_links?: SocialLink[];

  profile?: {
    avatar?: string;
    bio?: string;
    phone?: string;
    website?: string;
    location?: string;
    socialLinks?: SocialLink[];
  };
}

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
  tags?: any;
  is_popular: boolean;
  is_new: boolean;
  created_at?: string;
  updated_at?: string;
  downloads?: number;
  status?: "saved" | "bought" | string;

  // ✅ layout styles used by the generic TemplateCard
  social_style?: "circles" | "fullblock" | "default" | string;
  connection_style?: "list" | "compact" | "grid" | string;

  // ✅ custom preview component mapped per template (e.g. Infinitech)
  previewComponent?: ComponentType<any>;

  user?: User;

  unlocks?: number; // downloads
  saves?: number; // views
}
