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
      <DialogContent className="bg-[var(--card)] border border-[var(--border)] sm:max-w-[550px] p-0 overflow-hidden rounded-[24px]">
        <div className="p-6 border-b border-[var(--surface)] bg-[var(--surface)]/50 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-[var(--brand)]/10 text-[var(--brand)]">
             <History className="h-6 w-6" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[var(--foreground)]">
              Historial de Uso
            </DialogTitle>
            <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
              Cupón: <span className="font-mono font-bold text-[var(--brand)] ml-1">{couponCode}</span>
            </p>
          </DialogHeader>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center border-b border-[var(--surface)] pb-3 last:border-0">
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
              <div className="p-4 rounded-full bg-[var(--surface)]">
                <History className="h-8 w-8 text-[var(--border-hover)]" />
              </div>
              <p className="text-[var(--muted-foreground)] font-medium">Este cupón aún no ha sido utilizado</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-[var(--surface)] sticky top-0 shadow-sm">
                <TableRow className="border-b border-[var(--surface)]">
                  <TableHead className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider py-4 px-6">Orden / Cliente</TableHead>
                  <TableHead className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider py-4 px-6 text-right">Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usages.map((u, idx) => (
                  <TableRow key={idx} className="border-b border-[var(--surface)] last:border-0 hover:bg-[var(--surface)] transition-colors">
                    <TableCell className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-[var(--foreground)]">#{u.order_id}</span>
                        <span className="text-xs text-[var(--muted-foreground)] font-mono">{u.user_id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-right">
                      <span className="text-sm text-[var(--muted-foreground)]">
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

        <div className="p-4 border-t border-[var(--surface)] bg-[var(--surface)]/30 flex justify-end">
          <span className="text-[11px] font-medium text-[var(--muted-foreground)]">
            Total de usos: <span className="text-[var(--muted-foreground)]">{usages.length}</span>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
