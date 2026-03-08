export interface Coupon {
  id: string;
  code: string;
  discount_type: "PERCENTAGE" | "FIXED";
  discount_value: number;
  min_purchase?: number;
  status: string;
}

export interface CouponUsage {
  order_id: string;
  user_id: string;
  used_at: string;
}
