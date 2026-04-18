import { useQuery, useMutation } from "@tanstack/react-query";
import * as analyticsApi from "@/lib/api/analytics";
import { useTenantQueryScope } from "./use-tenant-query-scope";

export function useSalesAnalytics() {
  const { tenantQueryKey } = useTenantQueryScope();
  return useQuery({
    queryKey: tenantQueryKey("sales-analytics"),
    queryFn: analyticsApi.getSalesAnalytics,
  });
}

export function useAuditLog(params?: { page?: number; per_page?: number; action?: string }) {
  const { tenantQueryKey } = useTenantQueryScope();
  return useQuery({
    queryKey: tenantQueryKey("audit-log", params ?? {}),
    queryFn: () => analyticsApi.getAuditLog(params),
  });
}

export function useExportAnalytics() {
  return useMutation({ mutationFn: () => analyticsApi.exportAnalytics() });
}
