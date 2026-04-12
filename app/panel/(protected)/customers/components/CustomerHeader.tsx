"use client";

import { Button } from "@/components/ui/button";
import { Plus, UserPlus } from "lucide-react";

export function CustomerHeader() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-[26px] font-extrabold text-[var(--foreground)] tracking-tight">
          Clientes
        </h1>
        <p className="text-[13px] text-[var(--muted-foreground)] mt-1.5 font-medium">
          Administra tu base de datos de clientes, segmentaciones y programas de fidelidad
        </p>
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Button 
          className="h-10 px-5 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white font-bold shadow-lg shadow-[var(--brand)]/10 flex-1 sm:flex-none"
        >
          <UserPlus className="w-4 h-4 mr-2" /> Agregar Cliente
        </Button>
      </div>
    </div>
  );
}
