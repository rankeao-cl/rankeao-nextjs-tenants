export interface SalesSeriesPoint {
  date: string;
  orders_count: number;
  gross_revenue: number;
  net_revenue: number;
  items_sold: number;
  unique_customers: number;
}

export interface SalesTotals {
  orders_count: number;
  gross_revenue: number;
  net_revenue: number;
  items_sold: number;
  unique_customers: number;
  avg_order_value: number;
}

export interface AnalyticsData {
  series: SalesSeriesPoint[];
  totals: SalesTotals;
}

export interface AuditLogEntry {
  id: number;
  actor_id: number;
  action: string;
  entity_type: string;
  entity_id?: number;
  changes?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}
