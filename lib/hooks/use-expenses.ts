import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as expensesApi from "@/lib/api/expenses";
import { useTenantQueryScope } from "./use-tenant-query-scope";

export function useExpenses() {
  const { tenantQueryKey } = useTenantQueryScope();
  return useQuery({
    queryKey: tenantQueryKey("expenses"),
    queryFn: expensesApi.listExpenses,
  });
}

export function useCreateExpense() {
  const qc = useQueryClient();
  const { tenantQueryKey } = useTenantQueryScope();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => expensesApi.createExpense(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: tenantQueryKey("expenses") }),
  });
}

export function useUpdateExpense() {
  const qc = useQueryClient();
  const { tenantQueryKey } = useTenantQueryScope();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => expensesApi.updateExpense(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: tenantQueryKey("expenses") }),
  });
}

export function useDeleteExpense() {
  const qc = useQueryClient();
  const { tenantQueryKey } = useTenantQueryScope();
  return useMutation({
    mutationFn: (id: string) => expensesApi.deleteExpense(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: tenantQueryKey("expenses") }),
  });
}

export function useAttachReceipt() {
  const qc = useQueryClient();
  const { tenantQueryKey } = useTenantQueryScope();
  return useMutation({
    mutationFn: ({ expenseId, url }: { expenseId: string; url: string }) => expensesApi.attachReceipt(expenseId, url),
    onSuccess: () => qc.invalidateQueries({ queryKey: tenantQueryKey("expenses") }),
  });
}

export function useExpenseBudgets(year?: number, month?: number) {
  const { tenantQueryKey } = useTenantQueryScope();
  return useQuery({
    queryKey: tenantQueryKey("expenses", "budgets", year, month),
    queryFn: () => expensesApi.getExpenseBudgets(year, month),
  });
}

export function useSetExpenseBudgets() {
  const qc = useQueryClient();
  const { tenantQueryKey } = useTenantQueryScope();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => expensesApi.setExpenseBudgets(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: tenantQueryKey("expenses", "budgets") }),
  });
}
