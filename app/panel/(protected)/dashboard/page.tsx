"use client";

import { useDashboardSummary } from "@/lib/hooks/use-dashboard";
import { Button } from "@/components/ui/button";
import { DashboardStats } from "./components/DashboardStats";
import { QuickAccess } from "./components/QuickAccess";
import { RecentActivity } from "./components/RecentActivity";

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardSummary();

  return (
    <div className="space-y-10 pt-2 animate-in fade-in duration-500">
      {/* Page Title & Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-[26px] font-extrabold text-[var(--foreground)] tracking-tight">
            Panel de Control
          </h1>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-[13px] text-[var(--muted-foreground)] font-medium">Resumen en vivo · {new Date().toLocaleDateString("es-CL", { day: 'numeric', month: 'long' })}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="h-10 px-5 text-[13px] font-bold transition-all">
            Exportar reporte
          </Button>
          <Button variant="default" className="h-10 px-5 text-[13px] font-bold shadow-sm shadow-[var(--brand)]/20 transition-all">
            Nueva Venta
          </Button>
        </div>
      </div>

      <div className="space-y-10">
        {/* KPI Section */}
        <DashboardStats stats={stats} isLoading={isLoading} />

        {/* Actionable Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-3">
             <QuickAccess />
          </div>
          <div className="lg:col-span-3">
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
}
