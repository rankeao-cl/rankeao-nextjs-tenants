"use client";

import { Button } from "@/components/ui/button";
import { Plus, Download, Upload } from "lucide-react";

interface ProductHeaderProps {
  onAddProduct: () => void;
}

export function ProductHeader({ onAddProduct }: ProductHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-[26px] font-extrabold text-[var(--foreground)] tracking-tight">
          Productos
        </h1>
        <p className="text-[13px] text-[var(--muted-foreground)] mt-1.5 font-medium">
          Gestiona tu catálogo, stock y visibilidad en tiempo real
        </p>
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Button 
          variant="outline" 
          className="h-10 px-4 border-[var(--border)] text-[var(--muted-foreground)] font-bold hover:bg-[var(--surface)] flex-1 sm:flex-none"
        >
          <Download className="w-4 h-4 mr-2" /> Exportar
        </Button>
        <Button 
          onClick={onAddProduct}
          className="h-10 px-5 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white font-bold shadow-lg shadow-[var(--brand)]/10 flex-1 sm:flex-none"
        >
          <Plus className="w-4 h-4 mr-2" /> Nuevo Producto
        </Button>
      </div>
    </div>
  );
}
