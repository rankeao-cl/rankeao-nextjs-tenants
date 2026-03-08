import { apiFetch, extractList, extractListMeta, extractRecord } from "./client";
import type { Product, ProductDetail } from "@/lib/types/products";
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

export async function getProduct(id: string): Promise<ProductDetail> {
  const payload = await apiFetch<unknown>(`/store/panel/products/${id}`);
  return extractRecord(payload) as unknown as ProductDetail;
}

export async function updateProduct(id: string, data: Record<string, unknown>) {
  return apiFetch(`/store/panel/products/${id}`, { method: "PUT", body: data });
}

export async function deleteProduct(id: string) {
  return apiFetch(`/store/panel/products/${id}`, { method: "DELETE" });
}

export async function addProductImage(productId: string, data: { url: string; alt_text?: string }) {
  return apiFetch(`/store/panel/products/${productId}/images`, { method: "POST", body: data });
}

export async function deleteProductImage(productId: string, imageId: string) {
  return apiFetch(`/store/panel/products/${productId}/images/${imageId}`, { method: "DELETE" });
}

export async function addProductVariant(productId: string, data: Record<string, unknown>) {
  return apiFetch(`/store/panel/products/${productId}/variants`, { method: "POST", body: data });
}

export async function updateProductVariant(productId: string, variantId: string, data: Record<string, unknown>) {
  return apiFetch(`/store/panel/products/${productId}/variants/${variantId}`, { method: "PUT", body: data });
}

export async function deleteProductVariant(productId: string, variantId: string) {
  return apiFetch(`/store/panel/products/${productId}/variants/${variantId}`, { method: "DELETE" });
}
