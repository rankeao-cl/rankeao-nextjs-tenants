import { apiFetch, extractList } from "./client";
import type { StaffMember } from "@/lib/types/staff";

export async function listStaff(): Promise<StaffMember[]> {
  const payload = await apiFetch<unknown>("/store/panel/staff");
  return extractList<StaffMember>(payload, ["staff", "items", "data"]);
}

export async function inviteStaff(data: { email: string; role: string }) {
  return apiFetch("/store/panel/staff/invite", { method: "POST", body: data });
}

export async function cancelStaffInvitation(id: string) {
  return apiFetch(`/store/panel/staff/${id}`, { method: "DELETE" });
}

export async function updateStaffRole(id: string, data: { role: string }) {
  return apiFetch(`/store/panel/staff/${id}/role`, { method: "PUT", body: data });
}

export async function transferOwnership(data: { new_owner_id: string }) {
  return apiFetch("/store/panel/staff/transfer-ownership", { method: "POST", body: data });
}
