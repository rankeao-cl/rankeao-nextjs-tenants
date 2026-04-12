"use client";

import { useInventoryAlerts } from "@/lib/hooks/use-inventory";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, TriangleAlert, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { InventoryAlert } from "@/lib/types/inventory";

export function InventoryAlerts() {
  const [query, setQuery] = useState("");
  // useInventoryAlerts hook expects a boolean 'enabled'
  const { data: alerts = [], isLoading: alertsLoading } = useInventoryAlerts(true);

  // Filter alerts client-side since the API doesn't support query parameters for alerts yet
  const filteredAlerts = query 
    ? (alerts as InventoryAlert[]).filter(a => 
        a.product?.name?.toLowerCase().includes(query.toLowerCase()) || 
        a.product?.sku?.toLowerCase().includes(query.toLowerCase())
      )
    : (alerts as InventoryAlert[]);

  return (
    <div className="space-y-4">
      <Card className="bg-[var(--card)] border-none shadow-none overflow-hidden mt-2 border border-[var(--border)]">
        {/* Header Action Row */}
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-[320px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
              <Input
                placeholder="Buscar alerta"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 h-10 w-full bg-[var(--surface)] border-[var(--border)] focus-visible:ring-[var(--brand)]"
              />
            </div>
          </div>
          <Button variant="default" className="shadow-sm font-semibold h-10 px-6 w-full sm:w-auto">
            + Asignar alerta
          </Button>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto border-t border-[var(--border)]">
          <Table>
            <TableHeader className="bg-[var(--card)] border-b-2 border-[var(--surface)]">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold text-[var(--muted-foreground)] py-4 px-4 uppercase tracking-wider">Producto / Nombre</TableHead>
                <TableHead className="text-xs font-semibold text-[var(--muted-foreground)] py-4 px-4 uppercase tracking-wider">SKU</TableHead>
                <TableHead className="text-xs font-semibold text-[var(--muted-foreground)] py-4 px-4 uppercase tracking-wider text-center">Mínimo asignado</TableHead>
                <TableHead className="text-xs font-semibold text-[var(--muted-foreground)] py-4 px-4 uppercase tracking-wider text-center">Stock disponible</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alertsLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <TableRow key={i} className="border-b border-[var(--surface)]">
                    <TableCell className="py-4 px-4"><Skeleton className="h-5 w-48 rounded" /></TableCell>
                    <TableCell className="py-4 px-4"><Skeleton className="h-5 w-24 rounded" /></TableCell>
                    <TableCell className="py-4 px-4"><Skeleton className="h-5 w-10 mx-auto rounded" /></TableCell>
                    <TableCell className="py-4 px-4"><Skeleton className="h-5 w-12 mx-auto rounded" /></TableCell>
                    <TableCell className="py-4 px-4"></TableCell>
                  </TableRow>
                ))
              ) : filteredAlerts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-[var(--muted-foreground)] font-medium">
                    No hay productos con stock crítico. Todo está en orden.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAlerts.map((alert: InventoryAlert, index: number) => {
                  const isOutOfStock = alert.current_stock <= 0;
                  return (
                    <TableRow key={alert.product?.id || `alert-${index}`} className="border-b border-[var(--surface)] last:border-0 hover:bg-[var(--surface)] transition-colors">
                      <TableCell className="py-4 px-4">
                        <span className="text-sm font-medium text-[var(--foreground)]">
                          {alert.product?.name || "Desconocido"}
                        </span>
                        {alert.variant && (
                          <span className="ml-1.5 text-xs text-[var(--muted-foreground)]">({alert.variant.name})</span>
                        )}
                      </TableCell>
                      <TableCell className="py-4 px-4 font-mono text-sm text-[var(--muted-foreground)]">
                        {alert.product?.sku || alert.product?.id?.slice(0,8) || "-"}
                      </TableCell>
                      <TableCell className="py-4 px-4 text-center text-sm font-medium text-[var(--muted-foreground)]">
                        {alert.low_stock_alert ?? "-"}
                      </TableCell>
                      <TableCell className="py-4 px-4 text-center">
                        <div className="inline-flex items-center justify-center gap-1.5 font-bold text-sm">
                          <TriangleAlert className={`w-4 h-4 ${isOutOfStock ? "text-red-500" : "text-amber-500"}`} />
                          <span className={isOutOfStock ? "text-red-500" : "text-[var(--foreground)]"}>
                            {alert.current_stock}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-4 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
