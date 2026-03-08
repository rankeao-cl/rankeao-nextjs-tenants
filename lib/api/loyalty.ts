import { apiFetch, extractRecord } from "./client";
import type { LoyaltyProgram, LoyaltyAdjustment } from "@/lib/types/loyalty";

export async function getLoyaltyProgram(): Promise<LoyaltyProgram> {
  const payload = await apiFetch<unknown>("/store/panel/loyalty");
  const record = extractRecord(payload);
  const program = record.program ?? record;
  return program as unknown as LoyaltyProgram;
}

export async function updateLoyaltyProgram(data: Partial<LoyaltyProgram>) {
  return apiFetch("/store/panel/loyalty", { method: "PUT", body: data });
}

export async function adjustLoyaltyPoints(data: LoyaltyAdjustment) {
  return apiFetch("/store/panel/loyalty/adjust", { method: "POST", body: data });
}
