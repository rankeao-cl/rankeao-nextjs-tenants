import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listExpenses, createExpense } from "@/lib/api/expenses";

export function useExpenses() {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: listExpenses,
  });
}

export function useCreateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => createExpense(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["expenses"] }),
  });
}
