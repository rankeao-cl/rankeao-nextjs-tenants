import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "@/lib/api/dashboard";
import { useTenantQueryScope } from "./use-tenant-query-scope";

export function useDashboardSummary() {
  const { tenantQueryKey } = useTenantQueryScope();
  return useQuery({
    queryKey: tenantQueryKey("dashboard-summary"),
    queryFn: getDashboardSummary,
  });
}
