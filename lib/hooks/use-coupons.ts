import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listCoupons, createCoupon, updateCoupon, deleteCoupon, getCouponUsages } from "@/lib/api/coupons";

export function useCoupons(params?: Record<string, string | number | undefined>) {
  return useQuery({
    queryKey: ["coupons", params],
    queryFn: () => listCoupons(params),
  });
}

export function useCreateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => createCoupon(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["coupons"] }),
  });
}

export function useUpdateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => updateCoupon(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["coupons"] }),
  });
}

export function useDeleteCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCoupon(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["coupons"] }),
  });
}

export function useCouponUsages(id: string | null) {
  return useQuery({
    queryKey: ["coupon-usages", id],
    queryFn: () => getCouponUsages(id!),
    enabled: !!id,
  });
}
