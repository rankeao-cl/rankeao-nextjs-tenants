export type DayOfWeek = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";

// ---------------------------------------------------------------------------
// Storefront Config Types
// ---------------------------------------------------------------------------

export interface CarouselSlide {
  image_url: string;
  link_url?: string;
  link_text?: string;
  alt_text?: string;
  title?: string;
  subtitle?: string;
}

export interface CategoryTile {
  image_url: string;
  link_url?: string;
  title?: string;
}

export interface TenantMenuSubItem {
  name: string;
  href: string;
}

export interface TenantMegaColumn {
  title: string;
  items: TenantMenuSubItem[];
}

export interface TenantMenuItem {
  label: string;
  href: string;
  type: "mega" | "dropdown" | "link";
  columns?: TenantMegaColumn[];
  items?: TenantMenuSubItem[];
}

export interface TenantHomeSections {
  categories?: { title?: string; subtitle?: string };
  featured?: { title?: string; subtitle?: string };
  sale?: { title?: string; subtitle?: string };
  new_arrivals?: { title?: string; subtitle?: string };
  cta?: {
    title?: string;
    subtitle?: string;
    catalog_button?: string;
    whatsapp_button?: string;
  };
}

export interface TenantStorefrontConfig {
  carousel_images?: CarouselSlide[];
  carousel_slides?: CarouselSlide[];
  category_tiles?: CategoryTile[];
  community_images?: CategoryTile[];
  menu_items?: TenantMenuItem[];
  home_sections?: TenantHomeSections;
  whatsapp_number?: string;
  contact_email?: string;
  google_maps_url?: string;
  payment_methods_image?: string;
  footer_logo_url?: string;
  about_html?: string;
  terms_html?: string;
  promo_bar_text?: string;
  social_links?: { instagram?: string; tiktok?: string; facebook?: string };
  operating_schedules?: { days: string; hours: string }[];
}

export interface ScheduleDay {
  day_of_week: DayOfWeek;
  opens_at: string;
  closes_at: string;
  is_closed: boolean;
}

export interface SocialLink {
  platform: string;
  url: string;
  is_active: boolean;
  sort_order: number;
  [key: string]: unknown;
}

export interface PaymentConfig {
  bank?: string;
  account_type?: string;
  account_number?: string;
  rut?: string;
  email?: string;
  instructions?: string;
  [key: string]: unknown;
}

export interface PaymentMethod {
  id: string;
  type: "WEBPAY" | "MERCADOPAGO" | "BANK_TRANSFER" | "CASH" | "DEBIT";
  label: string;
  is_active: boolean;
  config: PaymentConfig;
}
