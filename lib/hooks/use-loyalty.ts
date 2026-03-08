import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLoyaltyProgram, updateLoyaltyProgram, adjustLoyaltyPoints } from "@/lib/api/loyalty";
import type { LoyaltyProgram, LoyaltyAdjustment } from "@/lib/types/loyalty";

export function useLoyaltyProgram() {
  return useQuery({
    queryKey: ["loyalty-program"],
    queryFn: getLoyaltyProgram,
  });
}

export function useUpdateLoyaltyProgram() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<LoyaltyProgram>) => updateLoyaltyProgram(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["loyalty-program"] }),
  });
}

export function useAdjustLoyaltyPoints() {
  return useMutation({
    mutationFn: (data: LoyaltyAdjustment) => adjustLoyaltyPoints(data),
  });
}
