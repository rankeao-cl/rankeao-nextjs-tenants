import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLoyaltyProgram, updateLoyaltyProgram, adjustLoyaltyPoints } from "@/lib/api/loyalty";
import type { LoyaltyProgram, LoyaltyAdjustment } from "@/lib/types/loyalty";
import { useTenantQueryScope } from "./use-tenant-query-scope";

export function useLoyaltyProgram() {
  const { tenantQueryKey } = useTenantQueryScope();
  return useQuery({
    queryKey: tenantQueryKey("loyalty-program"),
    queryFn: getLoyaltyProgram,
  });
}

export function useUpdateLoyaltyProgram() {
  const qc = useQueryClient();
  const { tenantQueryKey } = useTenantQueryScope();
  return useMutation({
    mutationFn: (data: Partial<LoyaltyProgram>) => updateLoyaltyProgram(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: tenantQueryKey("loyalty-program") }),
  });
}

export function useAdjustLoyaltyPoints() {
  return useMutation({
    mutationFn: (data: LoyaltyAdjustment) => adjustLoyaltyPoints(data),
  });
}
