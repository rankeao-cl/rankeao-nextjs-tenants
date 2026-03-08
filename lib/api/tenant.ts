import { apiFetch, extractList, extractRecord } from "./client";
import type { ScheduleDay, SocialLink, PaymentMethod } from "@/lib/types/tenant";
import type { Membership } from "@/lib/types/auth";

export async function fetchMyMemberships(): Promise<Membership[]> {
  const payload = await apiFetch<unknown>("/tenants/staff/mine");
  return extractList<Membership>(payload, ["memberships", "items", "data"]);
}

export async function getMyTenant(): Promise<Record<string, unknown>> {
  const payload = await apiFetch<unknown>("/tenants/me");
  return extractRecord(payload);
}

export async function updateMyTenant(data: Record<string, unknown>) {
  return apiFetch("/tenants/me", { method: "PUT", body: data });
}

export async function setTenantSlug(slug: string) {
  return apiFetch("/tenants/me/slug", { method: "PUT", body: { slug } });
}

export async function tenantGoPublic() {
  return apiFetch("/tenants/me/go-public", { method: "POST" });
}

export async function tenantGoPrivate() {
  return apiFetch("/tenants/me/go-private", { method: "POST" });
}

export async function setTenantLogo(url: string) {
  return apiFetch("/tenants/me/logo", { method: "PUT", body: { url } });
}

export async function setTenantBanner(url: string) {
  return apiFetch("/tenants/me/banner", { method: "PUT", body: { url } });
}

export async function getTenantSchedules(): Promise<ScheduleDay[]> {
  const payload = await apiFetch<unknown>("/tenants/me/schedules");
  return extractList<ScheduleDay>(payload, ["schedules", "items", "data"]);
}

export async function updateTenantSchedules(data: { schedules: ScheduleDay[] }) {
  return apiFetch("/tenants/me/schedules", { method: "PUT", body: data });
}

export async function getTenantSocialLinks(): Promise<SocialLink[]> {
  const payload = await apiFetch<unknown>("/tenants/me/social-links");
  return extractList<SocialLink>(payload, ["social_links", "items", "data"]);
}

export async function updateTenantSocialLinks(data: { social_links: SocialLink[] }) {
  return apiFetch("/tenants/me/social-links", { method: "PUT", body: data });
}

export async function listPaymentMethods(): Promise<PaymentMethod[]> {
  const payload = await apiFetch<unknown>("/tenants/me/payment-methods");
  return extractList<PaymentMethod>(payload, ["payment_methods", "items", "data"]);
}

export async function addPaymentMethod(data: Record<string, unknown>) {
  return apiFetch("/tenants/me/payment-methods", { method: "POST", body: data });
}

export async function updatePaymentMethod(id: string, data: Record<string, unknown>) {
  return apiFetch(`/tenants/me/payment-methods/${id}`, { method: "PUT", body: data });
}
