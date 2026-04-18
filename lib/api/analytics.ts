import { useAuthStore } from "@/lib/stores/auth-store";
import { apiFetch, extractList, extractListMeta, extractRecord, getApiBaseUrl } from "./client";
import type { AnalyticsData, AuditLogEntry } from "@/lib/types/analytics";
import type { ListMeta } from "@/lib/types/api";

export async function getSalesAnalytics(): Promise<AnalyticsData> {
  const payload = await apiFetch<unknown>("/tenants/me/analytics/sales");
  const data = extractRecord(payload) as unknown as AnalyticsData;
  return {
    series: data.series ?? [],
    totals: data.totals ?? {
      orders_count: 0,
      gross_revenue: 0,
      net_revenue: 0,
      items_sold: 0,
      unique_customers: 0,
      avg_order_value: 0,
    },
  };
}

export async function getAuditLog(params?: {
  page?: number;
  per_page?: number;
  action?: string;
}): Promise<{ items: AuditLogEntry[]; meta: ListMeta }> {
  const payload = await apiFetch<unknown>("/tenants/me/audit-log", { params });
  const items = extractList<AuditLogEntry>(payload, ["entries", "items", "data"]);
  const meta = extractListMeta(payload, items.length, params?.per_page ?? 20);
  return { items, meta };
}

export async function exportAnalytics() {
  const token = useAuthStore.getState().accessToken;
  const tenantId = useAuthStore.getState().user?.tenant_id;
  const res = await fetch(`${getApiBaseUrl()}/tenants/me/analytics/export`, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(tenantId ? { "X-Tenant-ID": tenantId } : {}),
    },
  });
  if (!res.ok) {
    throw new Error("No se pudo exportar analytics");
  }
  const disposition = res.headers.get("Content-Disposition") ?? "";
  const filenameMatch = disposition.match(/filename="(.+)"/i);
  const filename = filenameMatch?.[1] ?? "analytics.csv";
  const blob = await res.blob();
  return { blob, filename };
}
