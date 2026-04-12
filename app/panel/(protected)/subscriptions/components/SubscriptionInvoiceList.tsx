"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: string;
}

interface SubscriptionInvoiceListProps {
  invoices: Invoice[];
  formatCurrency: (val: number) => string;
  getStatusColor: (status: string) => string;
}

export function SubscriptionInvoiceList({ 
  invoices, 
  formatCurrency, 
  getStatusColor 
}: SubscriptionInvoiceListProps) {
  return (
    <div className="bg-[var(--card)] rounded-[24px] border border-[var(--border)] overflow-hidden shadow-sm">
      <div className="p-6 border-b border-[var(--surface)] flex items-center justify-between bg-[var(--surface)]/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[var(--brand)]/10 text-[var(--brand)]">
            <FileText className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-[var(--foreground)]">Historial de Facturación</h3>
        </div>
        <p className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Últimos 12 meses</p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-transparent">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest py-4 px-6">ID Factura</TableHead>
              <TableHead className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest py-4 px-6">Emisión</TableHead>
              <TableHead className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest py-4 px-6">Monto</TableHead>
              <TableHead className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest py-4 px-6">Estado</TableHead>
              <TableHead className="w-[100px] text-right py-4 px-6"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-20 text-center text-[var(--muted-foreground)] font-medium italic">
                   No se registran facturas en este periodo.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-[var(--surface)] transition-colors border-b border-[var(--surface)] last:border-0 group/row">
                  <TableCell className="py-4 px-6">
                    <span className="text-[13px] font-mono font-bold text-[var(--foreground)]">{invoice.id}</span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                      <Calendar className="h-3.5 w-3.5" />
                      <span className="text-[13px] font-medium">{invoice.date}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-2 text-[var(--brand)]">
                      <CreditCard className="h-3.5 w-3.5 text-[var(--border-hover)]" />
                      <span className="text-[14px] font-extrabold">{formatCurrency(invoice.amount)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <Badge variant="outline" className={`rounded-xl px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest border shadow-none ${getStatusColor(invoice.status)}`}>
                      {invoice.status === "PAID" ? "Pagado" : invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-9 w-9 p-0 text-[var(--muted-foreground)] hover:text-[var(--brand)] hover:bg-[var(--brand)]/10 transition-all opacity-0 group-hover/row:opacity-100"
                    >
                      <Download className="h-4 w-4" />
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
