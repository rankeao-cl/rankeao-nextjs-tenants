"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSubscription,
  cancelSubscription,
  reactivateSubscription,
  listInvoices,
} from "@/lib/api/subscriptions";

export interface SubscriptionInfo {
  plan_slug: string;
  plan_name?: string;
  status: string;
  current_period_end?: string;
}

export interface BillingInvoice {
  id: string;
  date: string;
  amount: number;
  status: string;
}

export function useSubscription() {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: () => getSubscription(),
    select: (data: unknown): SubscriptionInfo | null => {
      const d = data as Record<string, unknown> | null;
      if (!d) return null;
      const sub = (d.data ?? d) as Record<string, unknown>;
      return {
        plan_slug: ((sub.plan_slug ?? sub.plan_id ?? "free") as string),
        plan_name: sub.plan_name as string | undefined,
        status: ((sub.status ?? "ACTIVE") as string),
        current_period_end: sub.current_period_end as string | undefined,
      };
    },
  });
}

export function useInvoices() {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: async (): Promise<BillingInvoice[]> => {
      const res = await listInvoices();
      return res.invoices.map((inv: unknown): BillingInvoice => {
        const i = inv as Record<string, unknown>;
        return {
          id: (i.id ?? i.invoice_id ?? "") as string,
          date: ((i.issued_at ?? i.date ?? i.created_at ?? "") as string).split("T")[0],
          amount: (i.amount ?? i.total ?? 0) as number,
          status: (i.status ?? "PAID") as string,
        };
      });
    },
  });
}

export function useCancelSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reason?: string) => cancelSubscription(reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subscription"] }),
  });
}

export function useReactivateSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => reactivateSubscription(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subscription"] }),
  });
}
