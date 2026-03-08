export interface Coupon {
  id: string;
  code: string;
  discount_type: "PERCENTAGE" | "FIXED";
  discount_value: number;
  min_purchase?: number;
  status: string;
}
