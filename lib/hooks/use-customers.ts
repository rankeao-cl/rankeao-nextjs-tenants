"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listCustomers, updateCustomer, addCustomerNote } from "@/lib/api/customers";
import type { Customer } from "@/lib/types/customers";
import { useTenantQueryScope } from "./use-tenant-query-scope";

export function useCustomers(params?: Record<string, string | number | boolean | undefined>) {
  const { tenantQueryKey } = useTenantQueryScope();
  return useQuery({
    queryKey: tenantQueryKey("customers", params),
    queryFn: async () => {
      const res = await listCustomers(params);
      return {
        customers: res.customers as Customer[],
        meta: res.meta,
      };
    },
  });
}

export function useUpdateCustomer() {
  const qc = useQueryClient();
  const { tenantQueryKey } = useTenantQueryScope();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      updateCustomer(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: tenantQueryKey("customers") }),
  });
}

export function useAddCustomerNote() {
  const qc = useQueryClient();
  const { tenantQueryKey } = useTenantQueryScope();
  return useMutation({
    mutationFn: ({ customerId, content }: { customerId: string; content: string }) =>
      addCustomerNote(customerId, { content, note_type: "GENERAL" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: tenantQueryKey("customers") }),
  });
}
