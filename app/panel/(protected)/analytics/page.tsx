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
           <Card className="bg-white border border-[var(--c-gray-100)] rounded-[32px] overflow-hidden shadow-sm h-full">
              <div className="p-8 border-b border-[var(--c-gray-50)] flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[var(--c-navy-500)]/5 text-[var(--c-navy-500)]">
                       <BarChart3 className="h-5 w-5" />
                    </div>
                    <h3 className="font-extrabold text-[var(--c-gray-800)]">Gráfico de Ventas</h3>
                 </div>
                 <div className="flex items-center gap-2 bg-[var(--c-gray-50)] p-1 rounded-lg">
                    <button className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--c-gray-400)] hover:text-[var(--c-navy-500)]">Día</button>
                    <button className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-white shadow-sm text-[var(--c-navy-500)] rounded-md">Semana</button>
                    <button className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--c-gray-400)] hover:text-[var(--c-navy-500)]">Mes</button>
                 </div>
              </div>
              <CardContent className="p-8 min-h-[400px] flex flex-col items-center justify-center bg-[var(--c-gray-50)]/30 border-dashed border-2 border-[var(--c-gray-100)] m-4 rounded-[24px]">
                 <div className="p-5 rounded-full bg-white shadow-sm mb-4">
                    <PieChart className="h-10 w-10 text-[var(--c-gray-200)]" />
                 </div>
                 <h4 className="font-bold text-[var(--c-gray-600)] mb-1 text-center">Visualizaciones Proximamente</h4>
                 <p className="text-sm text-[var(--c-gray-400)] text-center max-w-sm">Estamos procesando el historial de transacciones para generar gráficos interactivos de alta fidelidad.</p>
              </CardContent>
           </Card>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-8">
           <Card className="bg-white border border-[var(--c-gray-100)] rounded-[32px] shadow-sm">
              <div className="p-6 border-b border-[var(--c-gray-50)]">
                 <h3 className="font-extrabold text-[14px] text-[var(--c-navy-500)] uppercase tracking-wider flex items-center gap-2">
                    <Info className="h-4 w-4" /> Resumen del Período
                 </h3>
              </div>
              <CardContent className="p-8">
                 {stats ? (
                   <div className="space-y-4">
                     <div className="flex justify-between items-center py-2 border-b border-[var(--c-gray-50)]">
                       <span className="text-[12px] font-medium text-[var(--c-gray-500)]">Total Ventas</span>
                       <span className="text-[13px] font-bold text-[var(--c-gray-800)]">{formatCurrency((stats as Record<string, unknown>).total_revenue as number)}</span>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-[var(--c-gray-50)]">
                       <span className="text-[12px] font-medium text-[var(--c-gray-500)]">Órdenes</span>
                       <span className="text-[13px] font-bold text-[var(--c-gray-800)]">{String((stats as Record<string, unknown>).total_orders ?? 0)}</span>
                     </div>
                     <div className="flex justify-between items-center py-2">
                       <span className="text-[12px] font-medium text-[var(--c-gray-500)]">Ticket Promedio</span>
                       <span className="text-[13px] font-bold text-[var(--c-gray-800)]">{formatCurrency((stats as Record<string, unknown>).avg_order_value as number)}</span>
                     </div>
                   </div>
                 ) : (
                   <p className="text-[13px] text-[var(--c-gray-400)] font-medium text-center py-4">
                     Los insights estarán disponibles cuando tengas historial de ventas.
                   </p>
                 )}
              </CardContent>
           </Card>

           {/* Debug info if needed */}
           {!isLoading && stats && (
              <details className="cursor-pointer group">
                 <summary className="text-[11px] font-bold text-[var(--c-gray-400)] uppercase tracking-widest hover:text-[var(--c-navy-500)] transition-colors list-none flex items-center gap-2 px-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--c-gray-300)] group-open:bg-[var(--c-cyan-500)]" />
                    Datos Crudos del API
                 </summary>
                 <div className="mt-4 p-4 bg-[var(--c-navy-500)] text-white/80 rounded-2xl text-[10px] font-mono overflow-auto max-h-[300px]">
                    <pre>{JSON.stringify(stats, null, 2)}</pre>
                 </div>
              </details>
           )}
        </div>
      </div>
    </div>
  );
}
