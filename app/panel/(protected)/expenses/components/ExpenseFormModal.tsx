"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Receipt, DollarSign, Tag, Calendar } from "lucide-react";

interface ExpenseFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newExpense: {
    title: string;
    amount: string;
    category: string;
    date: string;
  };
  onExpenseChange: (data: any) => void;
  onSave: () => void;
  saving: boolean;
}

export function ExpenseFormModal({
  open,
  onOpenChange,
  newExpense,
  onExpenseChange,
  onSave,
  saving,
}: ExpenseFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#ffffff] border border-[var(--c-gray-200)] sm:max-w-[450px] p-0 overflow-hidden rounded-[28px] shadow-2xl">
        <div className="p-6 border-b border-[var(--c-gray-100)] bg-[var(--c-gray-50)]/50 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-red-500/10 text-red-500">
             <Receipt className="h-6 w-6" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[var(--c-gray-800)]">
              Registrar Gasto
            </DialogTitle>
            <p className="text-sm text-[var(--c-gray-500)] font-medium">
              Completa los detalles del egreso
            </p>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2 flex flex-col">
              <Label className="text-[12px] font-bold text-[var(--c-gray-500)] uppercase tracking-wider flex items-center gap-2">
                Concepto / Glosa
              </Label>
              <Input
                placeholder="Ej. Pago de Alquiler, Publicidad..."
                value={newExpense.title}
                onChange={(e) => onExpenseChange({ ...newExpense, title: e.target.value })}
                className="bg-white border-[var(--c-gray-200)] rounded-xl h-11 font-bold focus:ring-[var(--c-navy-500)]/20 shadow-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 flex flex-col">
                <Label className="text-[12px] font-bold text-[var(--c-gray-500)] uppercase tracking-wider flex items-center gap-2">
                   <DollarSign className="h-3 w-3 text-red-500" /> Monto
                </Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={newExpense.amount}
                  onChange={(e) => onExpenseChange({ ...newExpense, amount: e.target.value })}
                  className="bg-white border-[var(--c-gray-200)] rounded-xl h-11 font-black text-red-500 focus:ring-red-500/20 shadow-sm"
                />
              </div>

              <div className="space-y-2 flex flex-col">
                <Label className="text-[12px] font-bold text-[var(--c-gray-500)] uppercase tracking-wider flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5 text-[var(--c-cyan-500)]" /> Categoría
                </Label>
                <Input
                  placeholder="Ej. Marketing"
                  value={newExpense.category}
                  onChange={(e) => onExpenseChange({ ...newExpense, category: e.target.value })}
                  className="bg-white border-[var(--c-gray-200)] rounded-xl h-11 text-xs font-bold"
                />
              </div>
            </div>

            <div className="space-y-2 flex flex-col">
              <Label className="text-[12px] font-bold text-[var(--c-gray-500)] uppercase tracking-wider flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-[var(--c-navy-500)]" /> Fecha de Pago
              </Label>
              <Input
                type="date"
                value={newExpense.date}
                onChange={(e) => onExpenseChange({ ...newExpense, date: e.target.value })}
                className="bg-white border-[var(--c-gray-200)] rounded-xl h-11 text-xs"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-2 bg-[var(--c-gray-50)]/30 border-t border-[var(--c-gray-100)]">
          <div className="flex w-full gap-3">
             <Button 
               variant="outline" 
               onClick={() => onOpenChange(false)} 
               className="flex-1 rounded-xl h-11 border-[var(--c-gray-200)] text-[var(--c-gray-600)] font-bold shadow-sm"
             >
               Cancelar
             </Button>
             <Button 
               variant="default" 
               disabled={saving} 
               onClick={onSave}
               className="flex-1 rounded-xl h-11 bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg shadow-red-500/20"
             >
               {saving ? "Registrando..." : "Registrar Gasto"}
             </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
