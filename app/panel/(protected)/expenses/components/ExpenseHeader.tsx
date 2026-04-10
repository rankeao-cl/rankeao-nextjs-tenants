"use client";

import { Button } from "@/components/ui/button";

interface ExpenseHeaderProps {
  onNewExpense: () => void;
}

export function ExpenseHeader({ onNewExpense }: ExpenseHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--c-gray-800)]">
          Gastos y Presupuestos
        </h1>
        <p className="text-sm text-[var(--c-gray-500)] mt-1">
          Lleva el control de tus egresos operativos y flujo de caja
        </p>
      </div>
      <Button 
        variant="default" 
        onClick={onNewExpense}
        className="bg-[var(--c-navy-500)] hover:bg-[var(--c-navy-600)] text-white rounded-xl shadow-sm transition-all h-10 px-6 font-bold"
      >
        Registrar Nuevo Gasto
      </Button>
    </div>
  );
}
