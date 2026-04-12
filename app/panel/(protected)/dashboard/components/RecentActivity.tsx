"use client";

import { Activity, Clock } from "lucide-react";

export function RecentActivity() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[12px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest px-1 flex items-center gap-2">
          <Activity className="w-3.5 h-3.5" /> Actividad reciente
        </h2>
      </div>
      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-12 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden group">
        {/* Subtle decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[var(--brand)]/5 rounded-full blur-3xl -z-10 group-hover:bg-[var(--brand)]/10 transition-colors duration-500"></div>

        <div className="w-16 h-16 rounded-full bg-[var(--surface)] text-[var(--muted-foreground)] flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
          <Clock className="w-8 h-8" />
        </div>

        <p className="text-[15px] text-[var(--foreground)] font-bold tracking-tight">
          No hay actividad registrada
        </p>
        <p className="text-[13px] text-[var(--muted-foreground)] mt-2 font-medium max-w-[300px] text-center leading-relaxed">
          Las acciones importantes y eventos de tu tienda aparecerán aquí en tiempo real.
        </p>
        
        <button className="mt-8 text-[12px] font-bold text-[var(--brand)] hover:text-[var(--brand-hover)] uppercase tracking-wider transition-colors">
          Refrescar Ahora
        </button>
      </div>
    </div>
  );
}
