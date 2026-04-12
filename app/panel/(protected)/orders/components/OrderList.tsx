"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MoreVertical, ExternalLink, Calendar, User, CreditCard } from "lucide-react";
import Link from "next/link";
import type { Order } from "@/lib/types/orders";

interface OrderListProps {
  orders: Order[];
  isLoading: boolean;
  getStatusColor: (status: string) => string;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(value);

export function OrderList({ orders, isLoading, getStatusColor }: OrderListProps) {
  if (isLoading) {
    return (
      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-[var(--surface)]">
            <TableRow>
              <TableHead>ID Orden</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(6).fill(0).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-5 w-24 rounded-lg" /></TableCell>
                <TableCell><Skeleton className="h-5 w-40 rounded-lg" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24 rounded-lg" /></TableCell>
                <TableCell><Skeleton className="h-5 w-20 rounded-lg" /></TableCell>
                <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-8 w-24 rounded-lg ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-[var(--surface)] border-b border-[var(--border)]">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest py-4 px-5">ID Orden</TableHead>
              <TableHead className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest py-4 px-5">Cliente</TableHead>
              <TableHead className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest py-4 px-5">Fecha</TableHead>
              <TableHead className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest py-4 px-5">Total Pago</TableHead>
              <TableHead className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest py-4 px-5">Estado</TableHead>
              <TableHead className="w-[100px] text-right py-4 px-5"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-20 text-center text-[var(--muted-foreground)] font-medium">
                   No se encontraron órdenes registradas.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id} className="hover:bg-[var(--surface)] transition-colors border-b border-[var(--surface)] last:border-0 group/row">
                  <TableCell className="py-4 px-5">
                    <span className="text-[14px] font-mono font-extrabold text-[var(--foreground)] tracking-tight">
                      {order.order_number || `#${order.id.split("-").pop()?.substring(0, 8)}`}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[var(--surface)] flex items-center justify-center text-[var(--muted-foreground)] text-[10px] font-bold">
                        {order.buyer_username?.charAt(0)?.toUpperCase() || "C"}
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-[var(--foreground)] leading-none">@{order.buyer_username || "—"}</p>
                        {order.item_summary && <p className="text-[11px] text-[var(--muted-foreground)] mt-1 font-medium truncate max-w-[160px]">{order.item_summary}</p>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-5">
                     <div className="flex items-center gap-1.5 text-[var(--muted-foreground)] font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-[12px]">
                          {order.created_at ? new Date(order.created_at).toLocaleDateString() : "N/A"}
                        </span>
                     </div>
                  </TableCell>
                  <TableCell className="py-4 px-5">
                    <div className="flex items-center gap-1.5">
                       <CreditCard className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                       <span className="text-[14px] font-extrabold text-[var(--brand)] tracking-tight">
                         {formatCurrency(order.total)}
                       </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-5 text-right">
                    <Link href={`/panel/orders/${order.id}`}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-10 px-4 text-[12px] font-bold text-[var(--brand-hover)] bg-[var(--accent-subtle)] hover:bg-[var(--accent-subtle)] opacity-0 group-hover/row:opacity-100 transition-opacity"
                      >
                        Gestionar <ExternalLink className="w-3 h-3 ml-2" />
                      </Button>
                    </Link>
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
