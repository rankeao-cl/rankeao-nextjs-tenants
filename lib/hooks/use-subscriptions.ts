"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSubscription,
  cancelSubscription,
  reactivateSubscription,
  listInvoices,
  upgradeSubscription,
  downgradeSubscription,
} from "@/lib/api/subscriptions";
import { useTenantQueryScope } from "./use-tenant-query-scope";

export interface SubscriptionPlan {
  slug: string;
  name: string;
  price_monthly: number;
  price_yearly: number;
  is_popular?: boolean;
  features: string[];
}

export interface SubscriptionInfo {
  plan_slug: string;
  plan_name?: string;
  status: string;
  current_period_end?: string;
  billing_cycle?: string;
  amount?: number;
  available_plans: SubscriptionPlan[];
}

export interface BillingInvoice {
  id: string;
  date: string;
  amount: number;
  status: string;
}

function extractFeatures(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.map((f) => String(f));
  }
  if (raw && typeof raw === "object") {
    return Object.entries(raw as Record<string, unknown>).map(([key, value]) =>
      typeof value === "string" ? value : key,
    );
  }
  return [];
}

export function useSubscription() {
  const { tenantQueryKey } = useTenantQueryScope();
  return useQuery({
    queryKey: tenantQueryKey("subscription"),
    queryFn: () => getSubscription(),
    select: (data: unknown): SubscriptionInfo | null => {
      const d = data as Record<string, unknown> | null;
      if (!d) return null;
      const sub = (d.data ?? d) as Record<string, unknown>;
      const plan = (sub.plan ?? {}) as Record<string, unknown>;
      return {
        plan_slug: ((sub.plan_slug ?? plan.slug ?? sub.plan_id ?? "starter") as string).toLowerCase(),
        plan_name: (sub.plan_name ?? plan.name) as string | undefined,
        status: ((sub.status ?? "ACTIVE") as string),
        current_period_end: sub.current_period_end as string | undefined,
        billing_cycle: sub.billing_cycle as string | undefined,
        amount: sub.amount as number | undefined,
        available_plans: Array.isArray(sub.available_plans)
          ? sub.available_plans.map((item): SubscriptionPlan => {
              const p = item as Record<string, unknown>;
              return {
                slug: String(p.slug ?? ""),
                name: String(p.name ?? p.plan ?? ""),
                price_monthly: Number(p.price_monthly ?? 0),
                price_yearly: Number(p.price_yearly ?? 0),
                is_popular: Boolean(p.highlighted ?? p.is_popular),
                features: extractFeatures(p.features),
              };
            })
          : [],
      };
    },
  });
}

export function useInvoices() {
  const { tenantQueryKey } = useTenantQueryScope();
  return useQuery({
    queryKey: tenantQueryKey("invoices"),
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
  const { tenantQueryKey } = useTenantQueryScope();
  return useMutation({
    mutationFn: (reason?: string) => cancelSubscription(reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: tenantQueryKey("subscription") }),
  });
}

export function useReactivateSubscription() {
  const qc = useQueryClient();
  const { tenantQueryKey } = useTenantQueryScope();
  return useMutation({
    mutationFn: () => reactivateSubscription(),
    onSuccess: () => qc.invalidateQueries({ queryKey: tenantQueryKey("subscription") }),
  });
}

export function useUpgradeSubscription() {
  const qc = useQueryClient();
  const { tenantQueryKey } = useTenantQueryScope();
  return useMutation({
    mutationFn: (data: { plan_slug: string; billing_cycle: string; payment_provider: string }) =>
      upgradeSubscription(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tenantQueryKey("subscription") });
      qc.invalidateQueries({ queryKey: tenantQueryKey("invoices") });
    },
  });
}

export function useDowngradeSubscription() {
  const qc = useQueryClient();
  const { tenantQueryKey } = useTenantQueryScope();
  return useMutation({
    mutationFn: (data: { plan_slug: string }) => downgradeSubscription(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tenantQueryKey("subscription") });
      qc.invalidateQueries({ queryKey: tenantQueryKey("invoices") });
    },
  });
}
