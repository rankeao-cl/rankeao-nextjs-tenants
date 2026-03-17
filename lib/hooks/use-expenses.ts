import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as expensesApi from "@/lib/api/expenses";

export function useExpenses() {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: expensesApi.listExpenses,
  });
}

export function useCreateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => expensesApi.createExpense(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["expenses"] }),
  });
}

export function useUpdateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => expensesApi.updateExpense(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["expenses"] }),
  });
}

export function useDeleteExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => expensesApi.deleteExpense(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["expenses"] }),
  });
}

export function useAttachReceipt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ expenseId, url }: { expenseId: string; url: string }) => expensesApi.attachReceipt(expenseId, url),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["expenses"] }),
  });
}

export function useExpenseBudgets(year?: number, month?: number) {
  return useQuery({
    queryKey: ["expenses", "budgets", year, month],
    queryFn: () => expensesApi.getExpenseBudgets(year, month),
  });
}

export function useSetExpenseBudgets() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => expensesApi.setExpenseBudgets(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["expenses", "budgets"] }),
  });
}
