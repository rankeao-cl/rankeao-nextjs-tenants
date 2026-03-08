import { apiFetch, extractList, extractListMeta, extractRecord } from "./client";
import type { InventoryMovement, InventoryValuation, InventoryAlert } from "@/lib/types/inventory";
import type { ListMeta } from "@/lib/types/api";

export async function getInventoryValuation(): Promise<InventoryValuation> {
  const payload = await apiFetch<unknown>("/store/panel/inventory/valuation");
  return extractRecord(payload) as unknown as InventoryValuation;
}

export async function listInventoryMovements(
  params?: Record<string, string | number | undefined>
): Promise<{ items: InventoryMovement[]; meta: ListMeta }> {
  const payload = await apiFetch<unknown>("/store/panel/inventory/movements", { params });
  const items = extractList<InventoryMovement>(payload, ["movements", "items", "data"]);
  const meta = extractListMeta(payload, items.length);
  return { items, meta };
}

export async function createInventoryMovement(data: Record<string, unknown>) {
  return apiFetch("/store/panel/inventory/movements", { method: "POST", body: data });
}

export async function getInventoryAlerts(): Promise<InventoryAlert[]> {
  const payload = await apiFetch<unknown>("/store/panel/inventory/alerts");
  return extractList<InventoryAlert>(payload, ["alerts", "items", "data"]);
}
