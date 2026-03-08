import { useQuery } from "@tanstack/react-query";
import { listOrders } from "@/lib/api/orders";

export function useOrders(params?: Record<string, string | number | undefined>) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => listOrders(params),
  });
}
