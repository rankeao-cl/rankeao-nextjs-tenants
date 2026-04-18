import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listCoupons, createCoupon, updateCoupon, deleteCoupon, getCouponUsages } from "@/lib/api/coupons";
import { useTenantQueryScope } from "./use-tenant-query-scope";

export function useCoupons(params?: Record<string, string | number | undefined>) {
  const { tenantQueryKey } = useTenantQueryScope();
  return useQuery({
    queryKey: tenantQueryKey("coupons", params),
    queryFn: () => listCoupons(params),
  });
}

export function useCreateCoupon() {
  const qc = useQueryClient();
  const { tenantQueryKey } = useTenantQueryScope();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => createCoupon(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: tenantQueryKey("coupons") }),
  });
}

export function useUpdateCoupon() {
  const qc = useQueryClient();
  const { tenantQueryKey } = useTenantQueryScope();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => updateCoupon(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: tenantQueryKey("coupons") }),
  });
}

export function useDeleteCoupon() {
  const qc = useQueryClient();
  const { tenantQueryKey } = useTenantQueryScope();
  return useMutation({
    mutationFn: (id: string) => deleteCoupon(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: tenantQueryKey("coupons") }),
  });
}

export function useCouponUsages(id: string | null) {
  const { tenantQueryKey } = useTenantQueryScope();
  return useQuery({
    queryKey: tenantQueryKey("coupon-usages", id),
    queryFn: () => getCouponUsages(id!),
    enabled: !!id,
  });
}
