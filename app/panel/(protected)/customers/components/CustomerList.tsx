"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MoreVertical, User, Star, CreditCard, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Customer } from "@/lib/types/customers";

interface CustomerListProps {
  customers: Customer[];
  isLoading: boolean;
  onViewDetail: (customer: Customer) => void;
  onToggleVip: (customer: Customer) => void;
  getSegmentColor: (segment: string) => string;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(value);

export function CustomerList({ 
  customers, 
  isLoading, 
  onViewDetail, 
  onToggleVip, 
  getSegmentColor 
}: CustomerListProps) {
  if (isLoading) {
    return (
      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-[var(--surface)]">
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Segmento</TableHead>
              <TableHead>Total Gastado</TableHead>
              <TableHead>Estado VIP</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5).fill(0).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-6 w-32 rounded-lg" /></TableCell>
                <TableCell><Skeleton className="h-5 w-48 rounded-lg" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24 rounded-lg" /></TableCell>
                <TableCell><Skeleton className="h-6 w-16 rounded-lg" /></TableCell>
                <TableCell><Skeleton className="h-10 w-32 ml-auto" /></TableCell>
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
              <TableHead className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest py-4 px-6 text-left">Ficha Cliente</TableHead>
              <TableHead className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest py-4 px-6">Email / Contacto</TableHead>
              <TableHead className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest py-4 px-6">Segmentación</TableHead>
              <TableHead className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest py-4 px-6">LTV / Venta Total</TableHead>
              <TableHead className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest py-4 px-6 text-center">Fidelidad</TableHead>
              <TableHead className="w-[120px] text-right py-4 px-6"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-20 text-center text-[var(--muted-foreground)] font-medium">
                   Tu base de clientes está vacía. Comienza a registrar clientes para ver estadísticas.
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-[var(--surface)] transition-colors border-b border-[var(--surface)] last:border-0 group/row">
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-[14px] shadow-sm transform transition-transform group-hover/row:scale-110 ${
                        customer.is_vip ? 'bg-[var(--accent-subtle)] text-[var(--brand-hover)]' : 'bg-[var(--surface)] text-[var(--muted-foreground)]'
                      }`}>
                        {customer.username[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                         <p className="text-[14px] font-extrabold text-[var(--foreground)] leading-none truncate">@{customer.username}</p>
                         <p className="text-[11px] text-[var(--muted-foreground)] font-medium mt-1">Reg: {new Date(customer.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className="text-[12px] font-bold text-[var(--muted-foreground)]">{customer.email}</span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <Badge variant="outline" className={`rounded-xl px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest border-none ${getSegmentColor(customer.segment)}`}>
                      {customer.segment}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-2">
                       <CreditCard className="w-4 h-4 text-[var(--border-hover)]" />
                       <span className="text-[14px] font-extrabold text-[var(--brand)] tracking-tight">
                         {formatCurrency(customer.total_spent)}
                       </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onToggleVip(customer)}
                      className={`h-8 px-2.5 rounded-lg border-none hover:bg-transparent ${customer.is_vip ? 'text-amber-500' : 'text-[var(--border)] hover:text-amber-300'}`}
                    >
                      <Star className={`w-5 h-5 ${customer.is_vip ? 'fill-amber-500' : ''}`} />
                    </Button>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onViewDetail(customer)}
                      className="h-10 px-4 text-[12px] font-bold text-[var(--brand-hover)] bg-[var(--accent-subtle)] hover:bg-[var(--accent-subtle)] opacity-0 group-hover/row:opacity-100 transition-opacity"
                    >
                      Perfil <ChevronRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
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
