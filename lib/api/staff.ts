import { apiFetch, extractList } from "./client";
import type { StaffMember } from "@/lib/types/staff";

export async function listStaff(): Promise<StaffMember[]> {
  const payload = await apiFetch<unknown>("/tenants/me/staff");
  return extractList<StaffMember>(payload, ["staff", "items", "data"]);
}

export async function inviteStaff(data: { email: string; role: string }) {
  return apiFetch("/tenants/me/staff/invite", { method: "POST", body: data });
}

export async function cancelStaffInvitation(id: string) {
  return apiFetch(`/tenants/me/staff/${id}`, { method: "DELETE" });
}

export async function updateStaffRole(id: string, data: { role: string }) {
  return apiFetch(`/tenants/me/staff/${id}/role`, { method: "PATCH", body: data });
}

export async function transferOwnership(data: { new_owner_staff_id: number; password: string }) {
  return apiFetch("/tenants/me/transfer-ownership", { method: "POST", body: data });
}
