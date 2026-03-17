import { apiFetch, extractList, extractListMeta } from "./client";
import type { ListMeta } from "@/lib/types/api";

export async function getSubscription() {
  return apiFetch("/tenants/me/subscription");
}

export async function upgradeSubscription(data: { plan_slug: string; billing_cycle: string; payment_provider: string }) {
  return apiFetch("/tenants/me/subscription/upgrade", { method: "POST", body: data });
}

export async function downgradeSubscription(data: { plan_slug: string }) {
  return apiFetch("/tenants/me/subscription/downgrade", { method: "POST", body: data });
}

export async function cancelSubscription(reason?: string) {
  return apiFetch("/tenants/me/subscription/cancel", { method: "POST", body: reason ? { reason } : undefined });
}

export async function reactivateSubscription() {
  return apiFetch("/tenants/me/subscription/reactivate", { method: "POST" });
}

export async function listInvoices(params?: Record<string, string | number | boolean | undefined>): Promise<{ invoices: unknown[]; meta: ListMeta }> {
  const payload = await apiFetch<unknown>("/tenants/me/invoices", { params });
  const invoices = extractList<unknown>(payload, ["invoices", "items"]);
  const meta = extractListMeta(payload, invoices.length);
  return { invoices, meta };
}
