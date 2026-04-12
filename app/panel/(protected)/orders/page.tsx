"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/lib/hooks/use-orders";
import { OrderHeader } from "./components/OrderHeader";
import { OrderFilters } from "./components/OrderFilters";
import { OrderList } from "./components/OrderList";

const getStatusColor = (status: string) => {
  switch (status) {
    case "COMPLETED":
    case "SHIPPED":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    case "PAID":
    case "PROCESSING":
    case "READY":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    case "PENDING_PAYMENT":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case "CANCELLED":
    case "REFUNDED":
      return "bg-red-500/10 text-red-600 border-red-500/20";
    default:
      return "bg-[var(--surface)] text-[var(--muted-foreground)] border-[var(--border)]";
  }
};

export default function OrdersPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useOrders({ page, query: query || undefined });
  const orders = data?.items ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <OrderHeader />

      <div className="space-y-6">
        <OrderFilters query={query} onQueryChange={(val) => { setQuery(val); setPage(1); }} />

        <OrderList 
          orders={orders} 
          isLoading={isLoading} 
          getStatusColor={getStatusColor}
        />

        {/* Pagination Section */}
        {meta && meta.total_pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm">
            <p className="text-[13px] text-[var(--muted-foreground)] font-semibold">
              Página <span className="text-[var(--foreground)]">{meta.page}</span> de <span className="text-[var(--foreground)]">{meta.total_pages}</span> · {meta.total} órdenes
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-10 px-4 text-[13px] font-bold border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--surface)]"
              >
                <ChevronLeft className="h-4 w-4 mr-1.5" /> Anterior
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= meta.total_pages}
                onClick={() => setPage((p) => p + 1)}
                className="h-10 px-4 text-[13px] font-bold border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--surface)]"
              >
                Siguiente <ChevronRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
