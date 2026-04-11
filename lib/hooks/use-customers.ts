"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listCustomers, updateCustomer, addCustomerNote } from "@/lib/api/customers";
import type { Customer } from "@/lib/types/customers";

export function useCustomers(params?: Record<string, string | number | boolean | undefined>) {
  return useQuery({
    queryKey: ["customers", params],
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
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      updateCustomer(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers"] }),
  });
}

export function useAddCustomerNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, content }: { customerId: string; content: string }) =>
      addCustomerNote(customerId, { content, note_type: "GENERAL" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers"] }),
  });
}
