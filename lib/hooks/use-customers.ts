"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as customersApi from "@/lib/api/customers";

export function useCustomers(params?: Record<string, string | number | boolean | undefined>) {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: () => customersApi.listCustomers(params),
  });
}

export function useCustomerDetail(id: string) {
  return useQuery({
    queryKey: ["customers", id],
    queryFn: () => customersApi.getCustomerDetail(id),
    enabled: !!id,
  });
}

export function useUpdateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => customersApi.updateCustomer(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers"] }),
  });
}

export function useAddCustomerNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, data }: { customerId: string; data: { content: string; note_type: string; is_pinned?: boolean } }) => customersApi.addCustomerNote(customerId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers"] }),
  });
}
