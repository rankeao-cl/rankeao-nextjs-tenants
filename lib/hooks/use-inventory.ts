import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getInventoryValuation,
  listInventoryMovements,
  getInventoryAlerts,
  createInventoryMovement,
} from "@/lib/api/inventory";
import { useTenantQueryScope } from "./use-tenant-query-scope";

export function useInventoryValuation() {
  const { tenantQueryKey } = useTenantQueryScope();
  return useQuery({
    queryKey: tenantQueryKey("inventory-valuation"),
    queryFn: getInventoryValuation,
  });
}

export function useInventoryMovements(params?: Record<string, string | number | undefined>) {
  const { tenantQueryKey } = useTenantQueryScope();
  return useQuery({
    queryKey: tenantQueryKey("inventory-movements", params),
    queryFn: () => listInventoryMovements(params),
  });
}

export function useInventoryAlerts(enabled = true) {
  const { tenantQueryKey } = useTenantQueryScope();
  return useQuery({
    queryKey: tenantQueryKey("inventory-alerts"),
    queryFn: getInventoryAlerts,
    enabled,
  });
}

export function useCreateInventoryMovement() {
  const qc = useQueryClient();
  const { tenantQueryKey } = useTenantQueryScope();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => createInventoryMovement(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tenantQueryKey("inventory-movements") });
      qc.invalidateQueries({ queryKey: tenantQueryKey("inventory-alerts") });
      qc.invalidateQueries({ queryKey: tenantQueryKey("inventory-valuation") });
      qc.invalidateQueries({ queryKey: tenantQueryKey("products") });
    },
  });
}
