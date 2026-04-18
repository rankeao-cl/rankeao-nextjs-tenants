"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuditLog, useExportAnalytics, useSalesAnalytics } from "@/lib/hooks/use-analytics";
import { BarChart3, Download, Info, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

// Modular Components
import { AnalyticsHeader } from "./components/AnalyticsHeader";
import { AnalyticsSummary } from "./components/AnalyticsSummary";

const formatCurrency = (value: number | undefined) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(value || 0);

export default function AnalyticsPage() {
  const { data: stats, isLoading } = useSalesAnalytics();
  const { data: auditData, isLoading: isAuditLoading } = useAuditLog({ page: 1, per_page: 8 });
  const exportMutation = useExportAnalytics();

  const series = stats?.series ?? [];
  const maxNetRevenue = Math.max(...series.map((item) => item.net_revenue), 1);

  async function handleExport() {
    try {
      const file = await exportMutation.mutateAsync();
      const url = URL.createObjectURL(file.blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success("Reporte exportado");
    } catch {
      toast.error("No se pudo exportar el reporte");
    }
  }

  return (
    <div className="space-y-10 max-w-[1400px] mx-auto pb-10 px-4 sm:px-0">
      <AnalyticsHeader />

      <AnalyticsSummary stats={stats} isLoading={isLoading} formatCurrency={formatCurrency} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-[var(--card)] border border-[var(--surface)] rounded-[32px] overflow-hidden shadow-sm h-full">
            <div className="p-8 border-b border-[var(--surface)] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[var(--brand)]/5 text-[var(--brand)]">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h3 className="font-extrabold text-[var(--foreground)]">Evolución de ventas netas</h3>
              </div>
              <Button size="sm" variant="outline" onClick={handleExport} disabled={exportMutation.isPending}>
                <Download className="h-4 w-4 mr-2" />
                {exportMutation.isPending ? "Exportando..." : "Exportar CSV"}
              </Button>
            </div>
            <CardContent className="p-6">
              {series.length === 0 ? (
                <p className="text-sm text-[var(--muted-foreground)]">
                  Aún no hay datos de ventas para el período seleccionado.
                </p>
              ) : (
                <div className="space-y-3">
                  {series.slice(-14).map((point) => (
                    <div key={point.date} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[var(--muted-foreground)]">{point.date}</span>
                        <span className="font-bold text-[var(--foreground)]">{formatCurrency(point.net_revenue)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-[var(--surface)] overflow-hidden">
                        <div
                          className="h-full bg-[var(--brand)]"
                          style={{ width: `${Math.max(4, (point.net_revenue / maxNetRevenue) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="bg-[var(--card)] border border-[var(--surface)] rounded-[32px] shadow-sm">
            <div className="p-6 border-b border-[var(--surface)]">
              <h3 className="font-extrabold text-[14px] text-[var(--brand)] uppercase tracking-wider flex items-center gap-2">
                <Info className="h-4 w-4" /> Resumen del Período
              </h3>
            </div>
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-[var(--surface)]">
                  <span className="text-[12px] font-medium text-[var(--muted-foreground)]">Ventas netas</span>
                  <span className="text-[13px] font-bold text-[var(--foreground)]">
                    {formatCurrency(stats?.totals?.net_revenue)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[var(--surface)]">
                  <span className="text-[12px] font-medium text-[var(--muted-foreground)]">Órdenes</span>
                  <span className="text-[13px] font-bold text-[var(--foreground)]">
                    {stats?.totals?.orders_count ?? 0}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-[12px] font-medium text-[var(--muted-foreground)]">Items vendidos</span>
                  <span className="text-[13px] font-bold text-[var(--foreground)]">
                    {stats?.totals?.items_sold ?? 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[var(--card)] border border-[var(--surface)] rounded-[32px] shadow-sm">
            <div className="p-6 border-b border-[var(--surface)]">
              <h3 className="font-extrabold text-[14px] text-[var(--brand)] uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> Audit log reciente
              </h3>
            </div>
            <CardContent className="p-6">
              {isAuditLoading ? (
                <p className="text-sm text-[var(--muted-foreground)]">Cargando actividad...</p>
              ) : (auditData?.items?.length ?? 0) === 0 ? (
                <p className="text-sm text-[var(--muted-foreground)]">Sin eventos recientes.</p>
              ) : (
                <div className="space-y-3">
                  {auditData?.items.map((entry) => (
                    <div key={entry.id} className="rounded-xl border border-[var(--surface)] px-3 py-2">
                      <p className="text-xs font-bold text-[var(--foreground)]">
                        {entry.action} · {entry.entity_type}
                      </p>
                      <p className="text-[11px] text-[var(--muted-foreground)]">
                        actor #{entry.actor_id} · {new Date(entry.created_at).toLocaleString("es-CL")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
