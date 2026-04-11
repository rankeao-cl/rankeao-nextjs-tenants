import { apiFetch, extractList, extractListMeta } from "./client";
import type { ListMeta } from "@/lib/types/api";

export interface Shipment {
  id: string;
  order_id: string;
  order_number: string;
  carrier: string;
  carrier_name?: string;
  tracking_number?: string;
  tracking_url?: string;
  status: string;
  to_city?: string;
  to_region?: string;
  estimated_delivery?: string;
  created_at: string;
}

export async function listShipments(params?: Record<string, string | number | boolean | undefined>): Promise<{ shipments: Shipment[]; meta: ListMeta }> {
  const payload = await apiFetch<unknown>("/store/panel/shipments", { params });
  const shipments = extractList<Shipment>(payload, ["shipments", "items"]);
  const meta = extractListMeta(payload, shipments.length);
  return { shipments, meta };
}

export async function updateShipment(id: string, data: Partial<Shipment>) {
  return apiFetch(`/store/panel/shipments/${id}`, { method: "PATCH", body: data });
}
