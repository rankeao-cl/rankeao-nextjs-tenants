"use client";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import type { Coupon } from "@/lib/types/coupons";

interface CouponListProps {
  coupons: Coupon[];
  isLoading: boolean;
  query: string;
  onQueryChange: (val: string) => void;
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (val: number) => void;
  onEdit: (coupon: Coupon) => void;
  onDelete: (id: string) => void;
  onViewUsages: (id: string, code: string) => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(value);

const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case "ACTIVE":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "INACTIVE":
    case "EXPIRED":
      return "bg-[var(--surface)] text-[var(--muted-foreground)] border-[var(--border)]";
    default:
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  }
};

export function CouponList({
  coupons,
  isLoading,
  query,
  onQueryChange,
  page,
  totalPages,
  totalItems,
  onPageChange,
  onEdit,
  onDelete,
  onViewUsages,
}: CouponListProps) {
  return (
    <div className="space-y-4">
      {/* Search Bar - Compact BSale Style */}
      <Card className="bg-[var(--card)] border border-[var(--border)] p-4 shadow-sm">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
          <Input
            placeholder="Buscar por código..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="pl-9 bg-transparent border-[var(--border)] focus:ring-[var(--brand)] focus:border-[var(--brand)] h-10"
          />
        </div>
      </Card>

      {/* Table Container */}
      <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto min-h-[400px]">
          <Table>
            <TableHeader className="bg-[var(--surface)]">
              <TableRow className="border-b border-[var(--surface)]">
                <TableHead className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider py-4 px-6">Código</TableHead>
                <TableHead className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider py-4 px-6">Descuento</TableHead>
                <TableHead className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider py-4 px-6">Mínimo</TableHead>
                <TableHead className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider py-4 px-6">Estado</TableHead>
                <TableHead className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider py-4 px-6 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <TableRow key={i} className="border-b border-[var(--surface)]">
                    <TableCell className="py-4 px-6"><Skeleton className="h-5 w-24 rounded" /></TableCell>
                    <TableCell className="py-4 px-6"><Skeleton className="h-5 w-20 rounded" /></TableCell>
                    <TableCell className="py-4 px-6"><Skeleton className="h-5 w-20 rounded" /></TableCell>
                    <TableCell className="py-4 px-6"><Skeleton className="h-5 w-20 rounded" /></TableCell>
                    <TableCell className="py-4 px-6"><Skeleton className="h-8 w-32 rounded ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : coupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 rounded-full bg-[var(--surface)]">
                        <Search className="h-8 w-8 text-[var(--border-hover)]" />
                      </div>
                      <p className="text-[var(--muted-foreground)] font-medium">No se encontraron cupones</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                coupons.map((coupon) => (
                  <TableRow key={coupon.id} className="border-b border-[var(--surface)] last:border-0 hover:bg-[var(--surface)]/80 transition-colors group">
                    <TableCell className="py-4 px-6">
                      <span className="text-[var(--brand)] font-mono font-bold text-sm bg-[var(--brand)]/5 px-2 py-1 rounded-md border border-[var(--brand)]/10">
                        {coupon.code}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-sm font-semibold text-[var(--foreground)]">
                      {coupon.discount_type === "PERCENTAGE"
                        ? `${coupon.discount_value}%`
                        : formatCurrency(coupon.discount_value)}
                    </TableCell>
                    <TableCell className="py-4 px-6 text-sm text-[var(--muted-foreground)]">
                      {coupon.min_purchase ? formatCurrency(coupon.min_purchase) : "Sin mínimo"}
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(coupon.status)}`}>
                        {coupon.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-right">
                      <div className="flex gap-1.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          size="xs" 
                          variant="outline" 
                          onClick={() => onViewUsages(coupon.id, coupon.code)}
                          className="h-8 px-3 rounded-lg border-[var(--border)] text-[var(--muted-foreground)]"
                        >
                          Usos
                        </Button>
                        <Button 
                          size="xs" 
                          variant="secondary" 
                          onClick={() => onEdit(coupon)}
                          className="h-8 px-3 rounded-lg bg-[var(--brand)]/5 text-[var(--brand)] border-none hover:bg-[var(--brand)]/10"
                        >
                          Editar
                        </Button>
                        <Button 
                          size="xs" 
                          variant="destructive" 
                          onClick={() => onDelete(coupon.id)}
                          className="h-8 px-3 rounded-lg bg-red-500/10 text-red-500 border-none hover:bg-red-500/15"
                        >
                          Borrar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination - BSale Style */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--surface)] bg-[var(--surface)]/50">
            <p className="text-[12px] text-[var(--muted-foreground)] font-medium">
              Página <span className="text-[var(--foreground)]">{page}</span> de <span className="text-[var(--foreground)]">{totalPages}</span> · {totalItems} cupones
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                className="h-8 px-4 text-xs border-[var(--border)] bg-[var(--card)] hover:bg-[var(--surface)]"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Anterior
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                className="h-8 px-4 text-xs border-[var(--border)] bg-[var(--card)] hover:bg-[var(--surface)]"
              >
                Siguiente <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
