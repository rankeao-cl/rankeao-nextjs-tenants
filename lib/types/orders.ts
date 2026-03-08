export interface OrderItem {
  id: string;
  product_id: string;
  product_name?: string;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: string;
  customer_name?: string;
  total_amount: number;
  items?: OrderItem[];
  status: string;
  created_at?: string;
}
