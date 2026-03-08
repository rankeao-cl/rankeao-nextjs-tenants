export interface AnalyticsData {
  total_sales?: number;
  total_revenue?: number;
  total_orders?: number;
  average_order_value?: number;
  [key: string]: unknown;
}
