export interface CustomerOrder {
  id: string;
  total: number;
  date: string;
  status: string;
}

export interface Customer {
  id: string;
  username: string;
  email: string;
  segment: string;
  total_spent: number;
  order_count: number;
  is_vip: boolean;
  created_at: string;
  notes: string[];
  recent_orders: CustomerOrder[];
}
