import { apiFetch, extractList, extractListMeta } from "./client";
import type { Product } from "@/lib/types/products";
import type { ListMeta } from "@/lib/types/api";

export async function listProducts(
  params?: Record<string, string | number | undefined>
): Promise<{ items: Product[]; meta: ListMeta }> {
  const payload = await apiFetch<unknown>("/store/panel/products", { params });
  const items = extractList<Product>(payload, ["products", "items", "data"]);
  const meta = extractListMeta(payload, items.length);
  return { items, meta };
}

export async function createProduct(data: Record<string, unknown>) {
  return apiFetch("/store/panel/products", { method: "POST", body: data });
}
