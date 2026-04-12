"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useExpenses, useCreateExpense } from "@/lib/hooks/use-expenses";
import { getErrorMessage } from "@/lib/utils/error-message";
import { Wallet, TrendingDown, ArrowDownRight } from "lucide-react";

// Modular Components
import { ExpenseHeader } from "./components/ExpenseHeader";
import { ExpenseList } from "./components/ExpenseList";
import { ExpenseFormModal } from "./components/ExpenseFormModal";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(value);

export default function ExpensesPage() {
  const { data: expenses = [], isLoading } = useExpenses();
  const createMutation = useCreateExpense();

  const [showModal, setShowModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleCreateExpense = async () => {
    if (!newExpense.title || !newExpense.amount) {
      return toast.error("Concepto y monto son requeridos");
    }
    try {
      await createMutation.mutateAsync({
        title: newExpense.title,
        amount: Number(newExpense.amount),
        category: newExpense.category,
        date: newExpense.date,
      });
      toast.success("Gasto registrado exitosamente");
      setShowModal(false);
      setNewExpense({ title: "", amount: "", category: "", date: new Date().toISOString().split("T")[0] });
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al registrar gasto"));
    }
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || e.cost || 0), 0);

  return (
    <div className="space-y-10 max-w-[1400px] mx-auto pb-10 px-4 sm:px-0">
      <ExpenseHeader onNewExpense={() => setShowModal(true)} />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[var(--card)] border border-[var(--surface)] rounded-[32px] shadow-sm overflow-hidden group">
          <CardContent className="p-8">
             <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-red-500/10 text-red-500 transition-colors group-hover:bg-red-500 group-hover:text-white">
                  <TrendingDown className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest mb-1">Gasto Total Acumulado</p>
                  <div className="text-3xl font-black text-red-500 tracking-tight">
                    {isLoading ? <Skeleton className="h-8 w-32" /> : formatCurrency(totalExpenses)}
                  </div>
                </div>
             </div>
             <div className="mt-6 flex items-center gap-2 text-[12px] font-medium text-[var(--muted-foreground)] bg-[var(--surface)] p-3">
                <ArrowDownRight className="h-4 w-4 text-emerald-500" />
                <span>Dentro del margen operativo proyectado</span>
             </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 bg-[var(--brand)] border-none rounded-[32px] shadow-lg shadow-[var(--brand)]/20 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <Wallet className="h-32 w-32 text-white" />
           </div>
           <CardContent className="p-8 flex flex-col justify-center h-full relative z-10">
              <h3 className="text-white font-bold text-lg mb-2">Control de Presupuesto</h3>
              <p className="text-[var(--brand)] text-sm font-medium max-w-md leading-relaxed">
                 Mantén tus finanzas saludables registrando cada egreso. Un buen control de gastos permite una mejor planificación de inventario y marketing.
              </p>
           </CardContent>
        </Card>
      </div>

      <ExpenseList 
        expenses={expenses} 
        isLoading={isLoading} 
        formatCurrency={formatCurrency} 
      />

      <ExpenseFormModal
        open={showModal}
        onOpenChange={setShowModal}
        newExpense={newExpense}
        onExpenseChange={setNewExpense}
        onSave={handleCreateExpense}
        saving={createMutation.isPending}
      />
    </div>
  );
}
