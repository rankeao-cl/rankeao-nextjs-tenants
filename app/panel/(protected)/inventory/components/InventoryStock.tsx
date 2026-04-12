"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreVertical, Search, Download, Filter, SlidersHorizontal, ChevronRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useProducts } from "@/lib/hooks/use-products";

export function InventoryStock() {
  const [query, setQuery] = useState("");
  const { data: productsData, isLoading } = useProducts({ page: 1, query: query || undefined });
  const products = productsData?.items ?? [];

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full items-start">
      {/* Main Stock Table */}
      <div className="flex-1 w-full space-y-4">
        {/* Header toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
            <Input
              placeholder="Buscar"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 h-10 w-full bg-[var(--surface)] border-[var(--border)] focus-visible:ring-[var(--brand)]"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[var(--muted-foreground)] mr-2">
              Filtros: <span className="text-[var(--foreground)]">Sucursal: Casa Matriz</span>
            </span>
            <Button variant="ghost" size="sm" className="text-[var(--brand)] hover:text-[var(--brand-hover)] font-medium h-9 px-3">
              ↻ Restablecer
            </Button>
          </div>
        </div>

        <Card className="bg-[var(--card)] border-none shadow-none rounded-2xl overflow-hidden mt-2 border border-[var(--border)]">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[var(--card)] border-b-2 border-[var(--surface)]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold text-[var(--muted-foreground)] py-4 px-4 uppercase tracking-wider">Producto</TableHead>
                  <TableHead className="text-xs font-semibold text-[var(--muted-foreground)] py-4 px-4 uppercase tracking-wider text-center">Disponible</TableHead>
                  <TableHead className="text-xs font-semibold text-[var(--muted-foreground)] py-4 px-4 uppercase tracking-wider text-center">Por despachar</TableHead>
                  <TableHead className="text-xs font-semibold text-[var(--muted-foreground)] py-4 px-4 uppercase tracking-wider text-center">Total</TableHead>
                  <TableHead className="text-xs font-semibold text-[var(--muted-foreground)] py-4 px-4 uppercase tracking-wider text-right">Costo un</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i} className="border-b border-[var(--surface)]">
                      <TableCell className="py-4 px-4"><Skeleton className="h-5 w-48 rounded" /></TableCell>
                      <TableCell className="py-4 px-4"><Skeleton className="h-5 w-12 mx-auto rounded" /></TableCell>
                      <TableCell className="py-4 px-4"><Skeleton className="h-5 w-10 mx-auto rounded" /></TableCell>
                      <TableCell className="py-4 px-4"><Skeleton className="h-5 w-12 mx-auto rounded" /></TableCell>
                      <TableCell className="py-4 px-4"><Skeleton className="h-5 w-16 ml-auto rounded" /></TableCell>
                      <TableCell className="py-4 px-4"></TableCell>
                    </TableRow>
                  ))
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center text-[var(--muted-foreground)] font-medium">
                      No se encontraron productos.
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id} className="border-b border-[var(--surface)] last:border-0 hover:bg-[var(--surface)] transition-colors">
                      <TableCell className="py-4 px-4">
                        <div className="font-medium text-sm text-[var(--foreground)]">{product.name}</div>
                        {product.sku && <div className="text-xs text-[var(--muted-foreground)] mt-0.5">SKU: {product.sku}</div>}
                      </TableCell>
                      <TableCell className="py-4 px-4 text-center text-sm font-semibold text-[var(--foreground)]">
                        {product.stock ?? 0}
                      </TableCell>
                      <TableCell className="py-4 px-4 text-center text-sm text-[var(--muted-foreground)]">
                        0
                      </TableCell>
                      <TableCell className="py-4 px-4 text-center text-sm font-semibold text-[var(--foreground)]">
                        {product.stock ?? 0}
                      </TableCell>
                      <TableCell className="py-4 px-4 text-right text-sm text-[var(--muted-foreground)] whitespace-nowrap">
                        $ {(product.price || 0).toLocaleString("es-CL")}
                      </TableCell>
                      <TableCell className="py-4 px-4 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="bg-[var(--surface)] px-6 py-3 border-t border-[var(--surface)] flex justify-between items-center text-xs text-[var(--muted-foreground)] font-medium">
            <span>Total de productos: {productsData?.meta?.total || 0}</span>
            <div className="flex gap-6">
              <span>Total unidades: 0</span>
              <span>Costo total: $ 0</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Right Sidebar Filters */}
      <Card className="w-full lg:w-[280px] shrink-0 border border-[var(--border)] rounded-2xl bg-[var(--card)] sticky top-6 shadow-sm overflow-hidden">
        <div className="px-5 py-4 flex justify-between items-center border-b border-[var(--surface)]">
          <h3 className="font-semibold text-[var(--foreground)] text-sm uppercase tracking-wide">Filtros</h3>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-[var(--muted-foreground)]">
             <span className="sr-only">Cerrar</span>
             &times;
          </Button>
        </div>
        <div className="p-5 flex flex-col gap-6">
          
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-[var(--foreground)] flex justify-between items-center cursor-pointer">
              Sucursal <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)] rotate-90" />
            </h4>
            <p className="text-xs text-[var(--muted-foreground)]">Casa Matriz</p>
          </div>

          <div className="w-full h-px bg-[var(--surface)]"></div>

          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-[var(--foreground)]">Stock disponible</h4>
            <div className="flex flex-col gap-3">
              {["Con stock", "Sin stock", "Todo"].map((opt) => (
                <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-4 h-4 rounded-full border border-[var(--border-hover)] group-hover:border-[var(--brand)]"></div>
                  <span className="text-sm text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]">{opt}</span>
                </label>
              ))}
              <label className="flex items-center gap-3 cursor-pointer mt-1">
                <div className="w-4 h-4 rounded-full border-4 border-[var(--brand)] flex items-center justify-center"></div>
                <span className="text-sm font-medium text-[var(--foreground)]">Rango de unidades</span>
              </label>
              <div className="flex items-center gap-2 mt-2 ml-7">
                <Input type="number" placeholder="10" className="h-9 text-center bg-[var(--card)]" />
                <span className="text-[var(--muted-foreground)]">-</span>
                <Input type="number" placeholder="100" className="h-9 text-center bg-[var(--card)]" />
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-[var(--surface)]"></div>

          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-[var(--foreground)] cursor-pointer">Series y lotes</Label>
            <Switch />
          </div>

          <div className="w-full h-px bg-[var(--surface)]"></div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-[var(--foreground)] flex justify-between items-center cursor-pointer">
              Tipo de producto <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)]" />
            </h4>
            <p className="text-xs text-[var(--muted-foreground)]">Todos los tipos de producto</p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-[var(--foreground)] flex justify-between items-center cursor-pointer">
              Marca <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)]" />
            </h4>
            <p className="text-xs text-[var(--muted-foreground)]">Todas las marcas</p>
          </div>

          <Button variant="default" className="w-full mt-4 font-semibold h-10">
            Filtrar
          </Button>
        </div>
      </Card>
    </div>
  );
}
