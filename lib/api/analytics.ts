import { apiFetch, extractRecord } from "./client";
import type { AnalyticsData } from "@/lib/types/analytics";

export async function getSalesAnalytics(): Promise<AnalyticsData> {
  const payload = await apiFetch<unknown>("/store/panel/analytics/sales");
  return extractRecord(payload) as unknown as AnalyticsData;
}
