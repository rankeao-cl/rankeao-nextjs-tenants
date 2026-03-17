import { apiFetch, extractRecord } from "./client";
import type { LoyaltyProgram, LoyaltyAdjustment } from "@/lib/types/loyalty";

export async function getLoyaltyProgram(): Promise<LoyaltyProgram> {
  const payload = await apiFetch<unknown>("/tenants/me/loyalty");
  const record = extractRecord(payload);
  const program = record.program ?? record;
  return program as unknown as LoyaltyProgram;
}

export async function updateLoyaltyProgram(data: Partial<LoyaltyProgram>) {
  return apiFetch("/tenants/me/loyalty", { method: "PUT", body: data });
}

export async function adjustLoyaltyPoints(data: LoyaltyAdjustment) {
  return apiFetch("/tenants/me/loyalty/adjust", { method: "POST", body: data });
}
