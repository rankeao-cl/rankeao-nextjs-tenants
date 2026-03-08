import { useQuery } from "@tanstack/react-query";
import { listCoupons } from "@/lib/api/coupons";

export function useCoupons(params?: Record<string, string | number | undefined>) {
  return useQuery({
    queryKey: ["coupons", params],
    queryFn: () => listCoupons(params),
  });
}
