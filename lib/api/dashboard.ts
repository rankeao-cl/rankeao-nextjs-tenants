import { apiFetch, extractRecord } from "./client";
import type { DashboardSummary } from "@/lib/types/dashboard";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const payload = await apiFetch<unknown>("/tenants/me/dashboard");
  return extractRecord(payload) as unknown as DashboardSummary;
}
