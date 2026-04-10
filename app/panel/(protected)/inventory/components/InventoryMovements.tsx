"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useInventoryMovements } from "@/lib/hooks/use-inventory";

const getMovementColor = (type: string) => {
  switch (type?.toUpperCase()) {
    case "IN": case "PURCHASE": case "RETURN":
      return "text-emerald-400";
    case "OUT": case "SALE": case "ADJUSTMENT":
      return "text-red-400";
    default:
      return "text-[var(--c-gray-500)]";
  }
};

export function InventoryMovements() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data: movementsData, isLoading: movementsLoading } = useInventoryMovements({
    page,
    query: query || undefined,
  });

  const movements = movementsData?.items ?? [];
  const meta = movementsData?.meta;

  return (
    <div className="space-y-4">
      <Card className="bg-[#ffffff] border border-[var(--c-gray-200)] shadow-none rounded-xl w-full">
        <div className="p-4">
          <div className="w-full sm:max-w-xs space-y-1.5 flex flex-col">
            <Label className="text-xs font-semibold text-[var(--c-gray-500)]">Buscar Movimientos</Label>
            <Input
              placeholder="Ej: TCG-123 o 'venta'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent border border-[var(--c-gray-200)]"
            />
          </div>
        </div>
      </Card>

      <Card className="bg-[#ffffff] border border-[var(--c-gray-200)] shadow-none rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-white border-b-2 border-[var(--c-gray-100)]">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold text-[var(--c-gray-500)] py-4 px-4 uppercase tracking-wider">Fecha</TableHead>
                <TableHead className="text-xs font-semibold text-[var(--c-gray-500)] py-4 px-4 uppercase tracking-wider">Producto ID</TableHead>
                <TableHead className="text-xs font-semibold text-[var(--c-gray-500)] py-4 px-4 uppercase tracking-wider">Tipo</TableHead>
                <TableHead className="text-xs font-semibold text-[var(--c-gray-500)] py-4 px-4 uppercase tracking-wider text-center">Cantidad</TableHead>
                <TableHead className="text-xs font-semibold text-[var(--c-gray-500)] py-4 px-4 uppercase tracking-wider">Motivo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movementsLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <TableRow key={i} className="border-b border-[var(--c-gray-100)]">
                    <TableCell className="py-4 px-4"><Skeleton className="h-5 w-20 rounded" /></TableCell>
                    <TableCell className="py-4 px-4"><Skeleton className="h-5 w-24 rounded" /></TableCell>
                    <TableCell className="py-4 px-4"><Skeleton className="h-5 w-16 rounded" /></TableCell>
                    <TableCell className="py-4 px-4"><Skeleton className="h-5 w-10 rounded mx-auto" /></TableCell>
                    <TableCell className="py-4 px-4"><Skeleton className="h-5 w-32 rounded" /></TableCell>
                  </TableRow>
                ))
              ) : movements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-[var(--c-gray-500)] font-medium">
                    No se encontraron movimientos.
                  </TableCell>
                </TableRow>
              ) : (
                movements.map((mov) => (
                  <TableRow key={mov.id} className="border-b border-[var(--c-gray-100)] last:border-0 hover:bg-[var(--c-gray-50)] transition-colors">
                    <TableCell className="py-4 px-4 text-sm text-[var(--c-gray-500)]">
                      {new Date(mov.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="py-4 px-4 font-mono text-sm text-[var(--c-gray-800)]">
                      {mov.product_id}
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[var(--c-gray-50)] text-[var(--c-gray-500)] border border-[var(--c-gray-200)]">
                        {mov.movement_type}
                      </span>
                    </TableCell>
                    <TableCell className={`py-4 px-4 text-center font-semibold ${getMovementColor(mov.movement_type)}`}>
                      {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity}
                    </TableCell>
                    <TableCell className="py-4 px-4 text-sm text-[var(--c-gray-500)]">
                      {mov.reason || "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {/* Pagination */}
        {meta && meta.total_pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--c-gray-200)] bg-[var(--c-gray-50)]">
            <p className="text-[12px] text-[var(--c-gray-500)] font-medium">
              Página {meta.page} de {meta.total_pages} · {meta.total} elementos
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-8 px-3 text-xs border-[var(--c-gray-200)] bg-white"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Anterior
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= meta.total_pages}
                onClick={() => setPage((p) => p + 1)}
                className="h-8 px-3 text-xs border-[var(--c-gray-200)] bg-white"
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
