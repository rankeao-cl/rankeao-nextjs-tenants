"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit2, Trash2, Eye, Box } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/types/products";

interface ProductListProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  getImageUrl: (url?: string) => string | undefined;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(value);

export function ProductList({ products, isLoading, onEdit, onDelete, getImageUrl }: ProductListProps) {
  if (isLoading) {
    return (
      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-[var(--surface)]">
            <TableRow>
              <TableHead className="w-[80px]"></TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(6).fill(0).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-12 w-12 rounded-xl" /></TableCell>
                <TableCell><Skeleton className="h-5 w-48 rounded-lg" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24 rounded-lg" /></TableCell>
                <TableCell><Skeleton className="h-5 w-20 rounded-lg" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16 rounded-lg" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-8 w-8 rounded-lg ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm group">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-[var(--surface)] border-b border-[var(--border)]">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[80px] py-4 px-5"></TableHead>
              <TableHead className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest py-4 px-5">Producto</TableHead>
              <TableHead className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest py-4 px-5">SKU</TableHead>
              <TableHead className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest py-4 px-5">Precio</TableHead>
              <TableHead className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest py-4 px-5 text-center">Stock</TableHead>
              <TableHead className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest py-4 px-5">Estado</TableHead>
              <TableHead className="w-[60px] text-right py-4 px-5"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-20 text-center">
                   <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-[var(--surface)] flex items-center justify-center text-[var(--border-hover)]">
                        <Box className="w-8 h-8" />
                      </div>
                      <p className="text-[15px] font-bold text-[var(--muted-foreground)]">No se encontraron productos</p>
                      <p className="text-[13px] text-[var(--muted-foreground)] max-w-[280px]">Intenta ajustar tus filtros o crea un nuevo producto para comenzar.</p>
                   </div>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} className="hover:bg-[var(--surface)] transition-colors border-b border-[var(--surface)] last:border-0 group/row">
                  <TableCell className="py-3.5 px-5">
                    <div className="w-14 h-14 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center overflow-hidden shadow-sm transition-transform group-hover/row:scale-105">
                      {product.image_url ? (
                        <img 
                          src={getImageUrl(product.image_url)} 
                          alt={product.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <Box className="w-6 h-6 text-[var(--border-hover)]" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5 px-5">
                    <p className="text-[14px] font-extrabold text-[var(--foreground)] leading-tight">{product.name}</p>
                    <p className="text-[11px] text-[var(--muted-foreground)] mt-1 font-medium italic">General · {product.id.slice(-6)}</p>
                  </TableCell>
                  <TableCell className="py-3.5 px-5">
                    <span className="text-[12px] font-mono font-bold text-[var(--muted-foreground)] bg-[var(--surface)] px-2 py-1 rounded-md">
                      {product.sku || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5 px-5">
                    <span className="text-[14px] font-extrabold text-[var(--brand)] tracking-tight">
                      {formatCurrency(product.price)}
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5 px-5 text-center">
                    <div className="flex flex-col items-center">
                      <span className={`text-[14px] font-extrabold ${product.stock <= 5 ? 'text-red-500' : 'text-[var(--foreground)]'}`}>
                        {product.stock}
                      </span>
                      <span className="text-[9px] font-bold text-[var(--muted-foreground)] uppercase tracking-tighter">UNID</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5 px-5">
                    <Badge className={`rounded-xl px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border-none shadow-sm ${
                      product.status === 'PUBLISHED' || product.status === 'ACTIVE'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-amber-500 text-white'
                    }`}>
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 text-[var(--muted-foreground)] hover:text-[var(--brand-hover)] hover:bg-[var(--accent-subtle)]"
                        onClick={() => onEdit(product.id)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 text-[var(--muted-foreground)] hover:text-red-600 hover:bg-red-500/10"
                        onClick={() => onDelete(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
