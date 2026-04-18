import { useQuery } from "@tanstack/react-query";
import { listOrders, getOrderDetail } from "@/lib/api/orders";
import { useTenantQueryScope } from "./use-tenant-query-scope";

export function useOrders(params?: Record<string, string | number | undefined>) {
  const { tenantQueryKey } = useTenantQueryScope();
  return useQuery({
    queryKey: tenantQueryKey("orders", params),
    queryFn: () => listOrders(params),
  });
}

export function useOrderDetail(orderId: string | null) {
  const { tenantQueryKey } = useTenantQueryScope();
  return useQuery({
    queryKey: tenantQueryKey("order", orderId),
    queryFn: () => getOrderDetail(orderId!),
    enabled: !!orderId,
  });
}
