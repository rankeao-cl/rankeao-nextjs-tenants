export interface OrderItem {
  id: string;
  product_id: string;
  product_name?: string;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: string;
  order_number?: string;
  customer_name?: string;
  customer_email?: string;
  total_amount: number;
  items?: OrderItem[];
  status: string;
  created_at?: string;
}

export interface OrderDetail extends Order {
  customer_phone?: string;
  shipping_address?: string;
  internal_notes?: string;
  carrier?: string;
  tracking_number?: string;
  refund_amount?: number;
  refund_reason?: string;
  cancel_reason?: string;
}
