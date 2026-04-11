export interface CategoryEmbed {
  id: string;
  slug: string;
  name: string;
}

export interface GameEmbed {
  id: string;
  name: string;
}

export interface CardEmbed {
  id: string;
  name: string;
  number: string;
  set: string;
  rarity: string;
}

// ProductListItem — matches backend ProductListItem DTO
export interface Product {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  category_name?: string;
  category_slug?: string;
  game_name?: string;
  sku: string;
  price: number;
  compare_price?: number;
  stock: number;
  status: string;
  is_visible: boolean;
  is_public: boolean;
  is_featured: boolean;
  image_url: string;
  tags?: string[];
  views_count: number;
  sales_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: number;
  url: string;
  alt_text: string;
  sort_order: number;
  is_primary: boolean;
  width: number;
  height: number;
  created_at: string;
}

export interface ProductVariant {
  id: number;
  name: string;
  sku: string;
  price_diff: number;
  stock: number;
  image_url: string;
  sort_order: number;
  is_active: boolean;
}

// ProductDetail — matches backend Product DTO (panel full view)
export interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  category?: CategoryEmbed;
  game?: GameEmbed;
  card?: CardEmbed;
  card_condition?: string;
  card_language?: string;
  is_foil: boolean;
  is_first_edition: boolean;
  sku: string;
  barcode: string;
  price: number;
  compare_price?: number;
  cost?: number;
  currency: string;
  stock: number;
  low_stock_alert: number;
  track_inventory: boolean;
  allow_backorder: boolean;
  status: string;
  is_visible: boolean;
  is_public: boolean;
  is_featured: boolean;
  image_url: string;
  images: ProductImage[];
  variants: ProductVariant[];
  tags?: string[];
  views_count: number;
  sales_count: number;
  created_at: string;
  updated_at: string;
}
