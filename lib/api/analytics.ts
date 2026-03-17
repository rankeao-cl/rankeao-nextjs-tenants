import { apiFetch, extractRecord } from "./client";
import type { AnalyticsData } from "@/lib/types/analytics";

export async function getSalesAnalytics(): Promise<AnalyticsData> {
  const payload = await apiFetch<unknown>("/tenants/me/analytics/sales");
  return extractRecord(payload) as unknown as AnalyticsData;
}

export async function getAuditLog() {
  const payload = await apiFetch<{ entries: unknown[] }>("/tenants/me/audit-log");
  return payload.entries ?? [];
}

export async function exportAnalytics() {
  return apiFetch("/tenants/me/analytics/export");
}
