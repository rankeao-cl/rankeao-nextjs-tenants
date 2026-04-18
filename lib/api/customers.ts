import { apiFetch, extractList, extractListMeta, extractRecord } from "./client";
import type { ListMeta } from "@/lib/types/api";
import type { Customer } from "@/lib/types/customers";

export async function listCustomers(params?: Record<string, string | number | boolean | undefined>): Promise<{ customers: unknown[]; meta: ListMeta }> {
  const payload = await apiFetch<unknown>("/tenants/me/customers", { params });
  const customers = extractList<unknown>(payload, ["customers", "items"]);
  const meta = extractListMeta(payload, customers.length);
  return { customers, meta };
}

export async function getCustomerDetail(id: string): Promise<Customer> {
  const payload = await apiFetch<unknown>(`/tenants/me/customers/${id}`);
  return extractRecord(payload) as unknown as Customer;
}

export async function updateCustomer(id: string, data: Record<string, unknown>) {
  return apiFetch(`/tenants/me/customers/${id}`, { method: "PATCH", body: data });
}

export async function addCustomerNote(customerId: string, data: { content: string; note_type: string; is_pinned?: boolean }) {
  return apiFetch(`/tenants/me/customers/${customerId}/notes`, { method: "POST", body: data });
}
