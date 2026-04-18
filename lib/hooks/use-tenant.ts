import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as tenantApi from "@/lib/api/tenant";
import { useTenantQueryScope } from "./use-tenant-query-scope";

export function useMyTenant() {
  const { tenantQueryKey } = useTenantQueryScope();
  return useQuery({
    queryKey: tenantQueryKey("my-tenant"),
    queryFn: tenantApi.getMyTenant,
  });
}

export function useUpdateMyTenant() {
  const qc = useQueryClient();
  const { tenantQueryKey } = useTenantQueryScope();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => tenantApi.updateMyTenant(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: tenantQueryKey("my-tenant") }),
  });
}

export function usePaymentMethods() {
  const { tenantQueryKey } = useTenantQueryScope();
  return useQuery({
    queryKey: tenantQueryKey("payment-methods"),
    queryFn: tenantApi.listPaymentMethods,
  });
}

export function useTenantNotifications() {
  const { tenantQueryKey } = useTenantQueryScope();
  return useQuery({ queryKey: tenantQueryKey("notifications"), queryFn: tenantApi.getTenantNotifications });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  const { tenantQueryKey } = useTenantQueryScope();
  return useMutation({
    mutationFn: (id: string) => tenantApi.markNotificationRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: tenantQueryKey("notifications") }),
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  const { tenantQueryKey } = useTenantQueryScope();
  return useMutation({
    mutationFn: () => tenantApi.markAllNotificationsRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: tenantQueryKey("notifications") }),
  });
}

export function useDeletePaymentMethod() {
  const qc = useQueryClient();
  const { tenantQueryKey } = useTenantQueryScope();
  return useMutation({
    mutationFn: (id: string) => tenantApi.deletePaymentMethod(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: tenantQueryKey("payment-methods") }),
  });
}

export function useCreateScheduleOverride() {
  const qc = useQueryClient();
  const { tenantQueryKey } = useTenantQueryScope();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => tenantApi.createScheduleOverride(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: tenantQueryKey("schedules") }),
  });
}

export function useDeleteScheduleOverride() {
  const qc = useQueryClient();
  const { tenantQueryKey } = useTenantQueryScope();
  return useMutation({
    mutationFn: (id: string) => tenantApi.deleteScheduleOverride(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: tenantQueryKey("schedules") }),
  });
}
