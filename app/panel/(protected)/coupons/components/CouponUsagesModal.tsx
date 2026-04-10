"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { CouponUsage } from "@/lib/types/coupons";
import { History } from "lucide-react";

interface CouponUsagesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usages: CouponUsage[];
  loading: boolean;
  couponCode: string;
}

export function CouponUsagesModal({
  open,
  onOpenChange,
  usages,
  loading,
  couponCode,
}: CouponUsagesModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#ffffff] border border-[var(--c-gray-200)] sm:max-w-[550px] p-0 overflow-hidden rounded-[24px]">
        <div className="p-6 border-b border-[var(--c-gray-100)] bg-[var(--c-gray-50)]/50 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-[var(--c-navy-500)]/10 text-[var(--c-navy-500)]">
             <History className="h-6 w-6" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[var(--c-gray-800)]">
              Historial de Uso
            </DialogTitle>
            <p className="text-sm text-[var(--c-gray-500)] mt-0.5">
              Cupón: <span className="font-mono font-bold text-[var(--c-cyan-500)] ml-1">{couponCode}</span>
            </p>
          </DialogHeader>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center border-b border-[var(--c-gray-50)] pb-3 last:border-0">
                  <div className="space-y-1.5 flex flex-col">
                    <Skeleton className="h-4 w-32 rounded" />
                    <Skeleton className="h-3 w-48 rounded" />
                  </div>
                  <Skeleton className="h-4 w-20 rounded" />
                </div>
              ))}
            </div>
          ) : usages.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center gap-3">
              <div className="p-4 rounded-full bg-[var(--c-gray-50)]">
                <History className="h-8 w-8 text-[var(--c-gray-300)]" />
              </div>
              <p className="text-[var(--c-gray-500)] font-medium">Este cupón aún no ha sido utilizado</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-[var(--c-gray-50)] sticky top-0 shadow-sm">
                <TableRow className="border-b border-[var(--c-gray-100)]">
                  <TableHead className="text-[10px] font-bold text-[var(--c-gray-400)] uppercase tracking-wider py-4 px-6">Orden / Cliente</TableHead>
                  <TableHead className="text-[10px] font-bold text-[var(--c-gray-400)] uppercase tracking-wider py-4 px-6 text-right">Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usages.map((u, idx) => (
                  <TableRow key={idx} className="border-b border-[var(--c-gray-50)] last:border-0 hover:bg-[var(--c-gray-50)] transition-colors">
                    <TableCell className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-[var(--c-gray-800)]">#{u.order_id}</span>
                        <span className="text-xs text-[var(--c-gray-400)] font-mono">{u.user_id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-right">
                      <span className="text-sm text-[var(--c-gray-500)]">
                        {new Date(u.used_at).toLocaleDateString("es-CL", {
                           day: "2-digit",
                           month: "short",
                           year: "numeric"
                        })}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="p-4 border-t border-[var(--c-gray-100)] bg-[var(--c-gray-50)]/30 flex justify-end">
          <span className="text-[11px] font-medium text-[var(--c-gray-400)]">
            Total de usos: <span className="text-[var(--c-gray-600)]">{usages.length}</span>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
