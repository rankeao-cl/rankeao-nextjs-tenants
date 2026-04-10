"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Receipt, Calendar, Tag, CreditCard } from "lucide-react";

import { Expense } from "@/lib/types/expenses";

interface ExpenseListProps {
  expenses: Expense[];
  isLoading: boolean;
  formatCurrency: (val: number) => string;
}

export function ExpenseList({ expenses, isLoading, formatCurrency }: ExpenseListProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl border border-[var(--c-gray-200)] overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-[var(--c-gray-50)]">
            <TableRow>
              <TableHead>Concepto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Monto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5).fill(0).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-6 w-48 rounded-lg" /></TableCell>
                <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24 rounded-lg" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20 rounded-lg ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] border border-[var(--c-gray-100)] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-[var(--c-gray-50)]/50 border-b border-[var(--c-gray-100)]">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[11px] font-bold text-[var(--c-gray-400)] uppercase tracking-widest py-4 px-6">Concepto / Detalle</TableHead>
              <TableHead className="text-[11px] font-bold text-[var(--c-gray-400)] uppercase tracking-widest py-4 px-6">Clasificación</TableHead>
              <TableHead className="text-[11px] font-bold text-[var(--c-gray-400)] uppercase tracking-widest py-4 px-6">Fecha Registro</TableHead>
              <TableHead className="text-[11px] font-bold text-[var(--c-gray-400)] uppercase tracking-widest py-4 px-6 text-right">Impacto en Caja</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-24 text-center">
                   <div className="flex flex-col items-center gap-4">
                      <div className="p-4 rounded-full bg-[var(--c-gray-50)]">
                        <Receipt className="h-8 w-8 text-[var(--c-gray-300)]" />
                      </div>
                      <p className="text-[var(--c-gray-500)] font-medium">No hay gastos registrados este periodo</p>
                   </div>
                </TableCell>
              </TableRow>
            ) : (
              expenses.map((expense, idx) => (
                <TableRow key={expense.id || idx} className="hover:bg-[var(--c-gray-50)] transition-colors border-b border-[var(--c-gray-100)] last:border-0 group/row">
                  <TableCell className="py-5 px-6">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                          <CreditCard className="h-5 w-5" />
                       </div>
                       <span className="text-[14px] font-extrabold text-[var(--c-gray-800)]">
                         {expense.title || expense.description || "Sin descripción"}
                       </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-5 px-6">
                    <div className="flex items-center gap-2">
                       <Tag className="h-3.5 w-3.5 text-[var(--c-cyan-500)]" />
                       <Badge variant="outline" className="rounded-xl px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest border border-[var(--c-gray-100)] bg-[var(--c-gray-50)] text-[var(--c-gray-500)]">
                         {expense.category || "Operativo"}
                       </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="py-5 px-6">
                    <div className="flex items-center gap-2 text-[var(--c-gray-500)]">
                       <Calendar className="h-3.5 w-3.5 text-[var(--c-navy-500)]" />
                       <span className="text-[13px] font-medium">{expense.date || expense.created_at || "-"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-5 px-6 text-right">
                    <span className="text-[15px] font-black text-red-500 tracking-tight">
                       -{formatCurrency(Number(expense.amount || expense.cost || 0))}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
