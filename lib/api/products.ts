import { apiFetch, extractList, extractListMeta, extractRecord } from "./client";
import type { Product, ProductDetail, ProductVariant } from "@/lib/types/products";
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
  return apiFetch(`/store/panel/products/${id}`, { method: "PATCH", body: data });
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
  return apiFetch(`/store/panel/products/${productId}/variants/${variantId}`, { method: "PATCH", body: data });
}

export async function deleteProductVariant(productId: string, variantId: string) {
  return apiFetch(`/store/panel/products/${productId}/variants/${variantId}`, { method: "DELETE" });
}

export async function bulkProductAction(data: { product_ids: string[]; action: string }) {
  const payload = await apiFetch<unknown>("/store/panel/products/bulk-action", { method: "POST", body: data });
  return extractRecord(payload) as unknown as { success_count: number; failed_count: number; failures?: unknown[] };
}

export async function reorderProductImages(productId: string, imageIds: string[]) {
  return apiFetch(`/store/panel/products/${productId}/images/reorder`, { method: "PUT", body: { image_ids: imageIds } });
}

export async function updateProductImage(productId: string, imageId: string, data: Record<string, unknown>) {
  return apiFetch(`/store/panel/products/${productId}/images/${imageId}`, { method: "PATCH", body: data });
}

export async function listVariants(productId: string): Promise<ProductVariant[]> {
  const payload = await apiFetch<unknown>(`/store/panel/products/${productId}/variants`);
  return extractList<ProductVariant>(payload, ["variants", "items", "data"]);
}
