import { apiFetch, extractList, extractListMeta, extractRecord } from "./client";
import type { Order } from "@/lib/types/orders";
import type { ListMeta } from "@/lib/types/api";

export async function listOrders(
  params?: Record<string, string | number | undefined>
): Promise<{ items: Order[]; meta: ListMeta }> {
  const payload = await apiFetch<unknown>("/store/panel/orders", { params });
  const items = extractList<Order>(payload, ["orders", "items", "data"]);
  const meta = extractListMeta(payload, items.length);
  return { items, meta };
}

export async function getOrderDetail(orderId: string): Promise<Record<string, unknown>> {
  const payload = await apiFetch<unknown>(`/store/panel/orders/${orderId}`);
  return extractRecord(payload);
}
