import { apiFetch, extractList } from "./client";
import type { Expense } from "@/lib/types/expenses";

export async function listExpenses(): Promise<Expense[]> {
  const payload = await apiFetch<unknown>("/store/panel/expenses");
  return extractList<Expense>(payload, ["expenses", "items", "data"]);
}

export async function createExpense(data: Record<string, unknown>) {
  return apiFetch("/store/panel/expenses", { method: "POST", body: data });
}
