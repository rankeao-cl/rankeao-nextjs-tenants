"use client";

import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";

export function OrderHeader() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-[26px] font-extrabold text-[var(--foreground)] tracking-tight">
          Órdenes
        </h1>
        <p className="text-[13px] text-[var(--muted-foreground)] mt-1.5 font-medium">
          Monitorea y gestiona los pedidos, envíos y devoluciones de tu tienda
        </p>
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Button 
          variant="outline" 
          className="h-10 px-4 border-[var(--border)] text-[var(--muted-foreground)] font-bold hover:bg-[var(--surface)] flex-1 sm:flex-none"
        >
          <Download className="w-4 h-4 mr-2" /> Exportar CSV
        </Button>
        <Button 
          className="h-10 px-5 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white font-bold shadow-lg shadow-[var(--brand)]/10 flex-1 sm:flex-none"
        >
          <Plus className="w-4 h-4 mr-2" /> Nueva Orden
        </Button>
      </div>
    </div>
  );
}
