import { useQuery } from "@tanstack/react-query";
import { listOrders, getOrderDetail } from "@/lib/api/orders";

export function useOrders(params?: Record<string, string | number | undefined>) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => listOrders(params),
  });
}

export function useOrderDetail(orderId: string | null) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderDetail(orderId!),
    enabled: !!orderId,
  });
}
