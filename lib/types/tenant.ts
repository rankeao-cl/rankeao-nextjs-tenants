export type DayOfWeek = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";

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
