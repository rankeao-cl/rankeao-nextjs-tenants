// PanelOrderListItem — matches backend PanelOrderListItem DTO
export interface Order {
  id: string;
  order_number: string;
  status: string;
  subtotal: number;
  discount: number;
  shipping_cost: number;
  platform_fee: number;
  total: number;
  seller_payout: number;
  currency: string;
  delivery_method: string;
  item_summary?: string;
  buyer_username: string;
  created_at: string;
  paid_at?: string;
  completed_at?: string;
}

export interface OrderItem {
  id: number;
  product_id: string;
  variant_id?: number;
  product_name: string;
  product_sku?: string;
  product_image_url?: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface OrderShipping {
  name: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  postal_code: string;
  country: string;
}

export interface ShipmentEvent {
  id: number;
  status: string;
  location?: string;
  description?: string;
  occurred_at: string;
}

export interface ShipmentInfo {
  id: string;
  carrier: string;
  carrier_name?: string;
  tracking_number?: string;
  tracking_url?: string;
  status: string;
  from_city?: string;
  from_region?: string;
  to_city?: string;
  to_region?: string;
  label_created_at?: string;
  picked_up_at?: string;
  in_transit_at?: string;
  delivered_at?: string;
  estimated_delivery?: string;
  notes?: string;
  events?: ShipmentEvent[];
}

export interface PaymentInfo {
  id: string;
  type: string;
  provider: string;
  status: string;
  amount: number;
  currency: string;
  provider_fee?: number;
  provider_tx_id?: string;
  provider_status?: string;
  provider_url?: string;
  description?: string;
  initiated_at?: string;
  completed_at?: string;
  failed_at?: string;
  failure_reason?: string;
}

export interface OrderReview {
  id: string;
  order_id: string;
  role: string;
  overall_rating: number;
  condition_accuracy?: number;
  shipping_speed?: number;
  communication?: number;
  packaging?: number;
  comment?: string;
  is_anonymous: boolean;
  reviewer_username?: string;
  created_at: string;
}

export interface StatusHistoryEntry {
  id: number;
  from_status: string;
  to_status: string;
  changed_by?: number;
  reason?: string;
  created_at: string;
}

// PanelOrderDetail — matches backend PanelOrderDetail DTO
export interface OrderDetail {
  id: string;
  order_number: string;
  order_type: string;
  status: string;
  subtotal: number;
  discount: number;
  shipping_cost: number;
  platform_fee: number;
  total: number;
  seller_payout: number;
  currency: string;
  coupon_code?: string;
  coupon_discount?: number;
  delivery_method: string;
  delivery_notes?: string;
  buyer_username: string;
  seller_username: string;
  buyer_notes?: string;
  seller_notes?: string;
  internal_notes?: string;
  item_summary?: string;
  cancel_reason?: string;
  auto_complete_at?: string;

  // Shipping address (flat fields)
  shipping_name?: string;
  shipping_phone?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_region?: string;
  shipping_postal?: string;
  shipping_country?: string;

  // Meetup
  meetup_location?: string;
  meetup_date?: string;

  // Timestamps
  created_at: string;
  updated_at: string;
  paid_at?: string;
  processing_at?: string;
  shipped_at?: string;
  delivered_at?: string;
  completed_at?: string;
  cancelled_at?: string;

  // Sub-resources
  items: OrderItem[];
  shipping?: OrderShipping;
  shipment?: ShipmentInfo;
  payment?: PaymentInfo;
  status_history: StatusHistoryEntry[];
  review?: OrderReview;
}
