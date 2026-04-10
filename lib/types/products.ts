export interface Product {
  id: string;
  sku?: string;
  name: string;
  price: number;
  stock_quantity: number;
  status: string;
  image_url?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt_text?: string;
  sort_order?: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku?: string;
  price_diff?: number;
  stock?: number;
}

export interface ProductDetail extends Product {
  description?: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
}
