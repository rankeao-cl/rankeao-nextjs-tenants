import { apiFetch, extractList, extractListMeta, extractRecord } from "./client";
import type { Order, OrderDetail } from "@/lib/types/orders";
import type { ListMeta } from "@/lib/types/api";

export async function listOrders(
  params?: Record<string, string | number | undefined>
): Promise<{ items: Order[]; meta: ListMeta }> {
  const payload = await apiFetch<unknown>("/store/panel/orders", { params });
  const items = extractList<Order>(payload, ["orders", "items", "data"]);
  const meta = extractListMeta(payload, items.length);
  return { items, meta };
}

export async function getOrderDetail(orderId: string): Promise<OrderDetail> {
  const payload = await apiFetch<unknown>(`/store/panel/orders/${orderId}`);
  return extractRecord(payload) as unknown as OrderDetail;
}

export async function processOrder(orderId: string) {
  return apiFetch(`/store/panel/orders/${orderId}/process`, { method: "POST" });
}

export async function readyOrder(orderId: string) {
  return apiFetch(`/store/panel/orders/${orderId}/ready`, { method: "POST" });
}

export async function shipOrder(orderId: string, data: { carrier: string; tracking_number: string }) {
  return apiFetch(`/store/panel/orders/${orderId}/ship`, { method: "POST", body: data });
}

export async function completeOrder(orderId: string) {
  return apiFetch(`/store/panel/orders/${orderId}/complete`, { method: "POST" });
}

export async function cancelOrder(orderId: string, data: { reason: string }) {
  return apiFetch(`/store/panel/orders/${orderId}/cancel`, { method: "POST", body: data });
}

export async function refundOrder(orderId: string, data: { amount: number; reason: string }) {
  return apiFetch(`/store/panel/orders/${orderId}/refund`, { method: "POST", body: data });
}

export async function updateOrderNotes(orderId: string, data: { internal_notes: string }) {
  return apiFetch(`/store/panel/orders/${orderId}/notes`, { method: "PATCH", body: data });
}
