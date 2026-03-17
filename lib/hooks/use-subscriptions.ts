"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as subApi from "@/lib/api/subscriptions";

export function useSubscription() {
  return useQuery({ queryKey: ["subscription"], queryFn: subApi.getSubscription });
}

export function useUpgradeSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { plan_slug: string; billing_cycle: string; payment_provider: string }) => subApi.upgradeSubscription(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subscription"] }),
  });
}

export function useDowngradeSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { plan_slug: string }) => subApi.downgradeSubscription(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subscription"] }),
  });
}

export function useCancelSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reason?: string) => subApi.cancelSubscription(reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subscription"] }),
  });
}

export function useReactivateSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => subApi.reactivateSubscription(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subscription"] }),
  });
}

export function useInvoices(params?: Record<string, string | number | boolean | undefined>) {
  return useQuery({
    queryKey: ["invoices", params],
    queryFn: () => subApi.listInvoices(params),
  });
}
