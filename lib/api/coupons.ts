import { apiFetch, extractList, extractListMeta } from "./client";
import type { Coupon, CouponUsage } from "@/lib/types/coupons";
import type { ListMeta } from "@/lib/types/api";

export async function listCoupons(
  params?: Record<string, string | number | undefined>
): Promise<{ items: Coupon[]; meta: ListMeta }> {
  const payload = await apiFetch<unknown>("/store/panel/coupons", { params });
  const items = extractList<Coupon>(payload, ["coupons", "items", "data"]);
  const meta = extractListMeta(payload, items.length);
  return { items, meta };
}

export async function createCoupon(data: Record<string, unknown>) {
  return apiFetch("/store/panel/coupons", { method: "POST", body: data });
}

export async function updateCoupon(id: string, data: Record<string, unknown>) {
  return apiFetch(`/store/panel/coupons/${id}`, { method: "PATCH", body: data });
}

export async function deleteCoupon(id: string) {
  return apiFetch(`/store/panel/coupons/${id}`, { method: "DELETE" });
}

export async function getCouponUsages(id: string): Promise<CouponUsage[]> {
  const payload = await apiFetch<unknown>(`/store/panel/coupons/${id}/usages`);
  return extractList<CouponUsage>(payload, ["usages", "items", "data"]);
}
