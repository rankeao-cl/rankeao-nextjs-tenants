import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyTenant, updateMyTenant, listPaymentMethods } from "@/lib/api/tenant";

export function useMyTenant() {
  return useQuery({
    queryKey: ["my-tenant"],
    queryFn: getMyTenant,
  });
}

export function useUpdateMyTenant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => updateMyTenant(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-tenant"] }),
  });
}

export function usePaymentMethods() {
  return useQuery({
    queryKey: ["payment-methods"],
    queryFn: listPaymentMethods,
  });
}
