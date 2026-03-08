import { apiFetch, extractList, extractListMeta } from "./client";
import type { Coupon } from "@/lib/types/coupons";
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
