import { useQuery, useMutation } from "@tanstack/react-query";
import * as analyticsApi from "@/lib/api/analytics";

export function useSalesAnalytics() {
  return useQuery({
    queryKey: ["sales-analytics"],
    queryFn: analyticsApi.getSalesAnalytics,
  });
}

export function useAuditLog() {
  return useQuery({ queryKey: ["audit-log"], queryFn: analyticsApi.getAuditLog });
}

export function useExportAnalytics() {
  return useMutation({ mutationFn: () => analyticsApi.exportAnalytics() });
}
