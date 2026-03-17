import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as tenantApi from "@/lib/api/tenant";

export function useMyTenant() {
  return useQuery({
    queryKey: ["my-tenant"],
    queryFn: tenantApi.getMyTenant,
  });
}

export function useUpdateMyTenant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => tenantApi.updateMyTenant(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-tenant"] }),
  });
}

export function usePaymentMethods() {
  return useQuery({
    queryKey: ["payment-methods"],
    queryFn: tenantApi.listPaymentMethods,
  });
}

export function useTenantNotifications() {
  return useQuery({ queryKey: ["tenant", "notifications"], queryFn: tenantApi.getTenantNotifications });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tenantApi.markNotificationRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tenant", "notifications"] }),
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => tenantApi.markAllNotificationsRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tenant", "notifications"] }),
  });
}

export function useDeletePaymentMethod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tenantApi.deletePaymentMethod(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["payment-methods"] }),
  });
}

export function useCreateScheduleOverride() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => tenantApi.createScheduleOverride(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tenant", "schedules"] }),
  });
}

export function useDeleteScheduleOverride() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tenantApi.deleteScheduleOverride(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tenant", "schedules"] }),
  });
}
