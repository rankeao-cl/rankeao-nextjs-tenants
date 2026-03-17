import { apiFetch, extractList } from "./client";
import type { Expense } from "@/lib/types/expenses";

export async function listExpenses(): Promise<Expense[]> {
  const payload = await apiFetch<unknown>("/tenants/me/expenses");
  return extractList<Expense>(payload, ["expenses", "items", "data"]);
}

export async function createExpense(data: Record<string, unknown>) {
  return apiFetch("/tenants/me/expenses", { method: "POST", body: data });
}

export async function updateExpense(id: string, data: Record<string, unknown>) {
  return apiFetch(`/tenants/me/expenses/${id}`, { method: "PATCH", body: data });
}

export async function deleteExpense(id: string) {
  return apiFetch(`/tenants/me/expenses/${id}`, { method: "DELETE" });
}

export async function attachReceipt(expenseId: string, url: string) {
  return apiFetch(`/tenants/me/expenses/${expenseId}/receipt`, { method: "POST", body: { url } });
}

export async function getExpenseBudgets(year?: number, month?: number) {
  return apiFetch("/tenants/me/expenses/budgets", { params: { year, month } });
}

export async function setExpenseBudgets(data: Record<string, unknown>) {
  return apiFetch("/tenants/me/expenses/budgets", { method: "PUT", body: data });
}
