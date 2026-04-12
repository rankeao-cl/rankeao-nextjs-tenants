"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useSalesAnalytics } from "@/lib/hooks/use-analytics";
import { BarChart3, PieChart, Info } from "lucide-react";


// Modular Components
import { AnalyticsHeader } from "./components/AnalyticsHeader";
import { AnalyticsSummary } from "./components/AnalyticsSummary";

const formatCurrency = (value: number | undefined) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(value || 0);

export default function AnalyticsPage() {
  const { data: stats, isLoading } = useSalesAnalytics();

  return (
    <div className="space-y-10 max-w-[1400px] mx-auto pb-10 px-4 sm:px-0">
      <AnalyticsHeader />

      <AnalyticsSummary 
        stats={stats} 
        isLoading={isLoading} 
        formatCurrency={formatCurrency} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Placeholder / Preview */}
        <div className="lg:col-span-2">
           <Card className="bg-[var(--card)] border border-[var(--surface)] rounded-[32px] overflow-hidden shadow-sm h-full">
              <div className="p-8 border-b border-[var(--surface)] flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[var(--brand)]/5 text-[var(--brand)]">
                       <BarChart3 className="h-5 w-5" />
                    </div>
                    <h3 className="font-extrabold text-[var(--foreground)]">Gráfico de Ventas</h3>
                 </div>
                 <div className="flex items-center gap-2 bg-[var(--surface)] p-1 rounded-lg">
                    <button className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] hover:text-[var(--brand)]">Día</button>
                    <button className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-[var(--card)] shadow-sm text-[var(--brand)] rounded-md">Semana</button>
                    <button className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] hover:text-[var(--brand)]">Mes</button>
                 </div>
              </div>
              <CardContent className="p-8 min-h-[400px] flex flex-col items-center justify-center bg-[var(--surface)]/30 border-dashed border-2 border-[var(--surface)] m-4 rounded-[24px]">
                 <div className="p-5 rounded-full bg-[var(--card)] shadow-sm mb-4">
                    <PieChart className="h-10 w-10 text-[var(--border)]" />
                 </div>
                 <h4 className="font-bold text-[var(--muted-foreground)] mb-1 text-center">Visualizaciones Proximamente</h4>
                 <p className="text-sm text-[var(--muted-foreground)] text-center max-w-sm">Estamos procesando el historial de transacciones para generar gráficos interactivos de alta fidelidad.</p>
              </CardContent>
           </Card>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-8">
           <Card className="bg-[var(--card)] border border-[var(--surface)] rounded-[32px] shadow-sm">
              <div className="p-6 border-b border-[var(--surface)]">
                 <h3 className="font-extrabold text-[14px] text-[var(--brand)] uppercase tracking-wider flex items-center gap-2">
                    <Info className="h-4 w-4" /> Resumen del Período
                 </h3>
              </div>
              <CardContent className="p-8">
                 {stats ? (
                   <div className="space-y-4">
                     <div className="flex justify-between items-center py-2 border-b border-[var(--surface)]">
                       <span className="text-[12px] font-medium text-[var(--muted-foreground)]">Total Ventas</span>
                       <span className="text-[13px] font-bold text-[var(--foreground)]">{formatCurrency((stats as Record<string, unknown>).total_revenue as number)}</span>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-[var(--surface)]">
                       <span className="text-[12px] font-medium text-[var(--muted-foreground)]">Órdenes</span>
                       <span className="text-[13px] font-bold text-[var(--foreground)]">{String((stats as Record<string, unknown>).total_orders ?? 0)}</span>
                     </div>
                     <div className="flex justify-between items-center py-2">
                       <span className="text-[12px] font-medium text-[var(--muted-foreground)]">Ticket Promedio</span>
                       <span className="text-[13px] font-bold text-[var(--foreground)]">{formatCurrency((stats as Record<string, unknown>).avg_order_value as number)}</span>
                     </div>
                   </div>
                 ) : (
                   <p className="text-[13px] text-[var(--muted-foreground)] font-medium text-center py-4">
                     Los insights estarán disponibles cuando tengas historial de ventas.
                   </p>
                 )}
              </CardContent>
           </Card>

           {/* Debug info if needed */}
           {!isLoading && stats && (
              <details className="cursor-pointer group">
                 <summary className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest hover:text-[var(--brand)] transition-colors list-none flex items-center gap-2 px-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--border-hover)] group-open:bg-[var(--brand)]" />
                    Datos Crudos del API
                 </summary>
                 <div className="mt-4 p-4 bg-[var(--brand)] text-white/80 rounded-2xl text-[10px] font-mono overflow-auto max-h-[300px]">
                    <pre>{JSON.stringify(stats, null, 2)}</pre>
                 </div>
              </details>
           )}
        </div>
      </div>
    </div>
  );
}
