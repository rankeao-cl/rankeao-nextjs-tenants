"use client";

import { Card, Skeleton } from "@heroui/react";
import { useSalesAnalytics } from "@/lib/hooks/use-analytics";

const formatCurrency = (value: number | undefined) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(value || 0);

export default function AnalyticsPage() {
  const { data: stats, isLoading } = useSalesAnalytics();

  const metricCards = [
    { label: "Ventas Totales", value: stats?.total_sales ?? 0, format: "number", color: "emerald" },
    { label: "Ingresos Totales", value: stats?.total_revenue, format: "currency", color: "blue" },
    { label: "Órdenes Totales", value: stats?.total_orders ?? 0, format: "number", color: "purple" },
    { label: "Ticket Promedio", value: stats?.average_order_value, format: "currency", color: "amber" },
  ];

  const colorMap: Record<string, { text: string }> = {
    emerald: { text: "text-emerald-400" },
    blue: { text: "text-blue-400" },
    purple: { text: "text-purple-400" },
    amber: { text: "text-amber-400" },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--foreground)]">
          Analítica de Ventas
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1">Rendimiento y métricas de tu negocio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array(4).fill(0).map((_, i) => (
              <Card key={i} className="bg-[var(--surface)] border border-[var(--border)]">
                <Card.Content className="p-6">
                  <Skeleton className="h-4 w-24 rounded mb-2" />
                  <Skeleton className="h-8 w-20 rounded" />
                </Card.Content>
              </Card>
            ))
          : metricCards.map((card) => {
              const colors = colorMap[card.color];
              return (
                <Card key={card.label} className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-colors">
                  <Card.Content className="p-6">
                    <p className="text-sm text-[var(--muted)] mb-1">{card.label}</p>
                    <p className={`text-2xl font-bold ${colors.text}`}>
                      {card.format === "currency" ? formatCurrency(card.value as number) : card.value}
                    </p>
                  </Card.Content>
                </Card>
              );
            })}
      </div>

      {!isLoading && stats && (
        <Card className="bg-[var(--surface)] border border-[var(--border)]">
          <Card.Content className="p-6">
            <h3 className="font-semibold text-[var(--foreground)] mb-2">Datos Completos del API</h3>
            <p className="text-sm text-amber-400/80 mb-4">
              Esta vista muestra datos en crudo. Una vez que se consolide el esquema de respuesta del API, se presentarán gráficos y tablas visuales aquí.
            </p>
            <pre className="text-xs text-[var(--muted)] overflow-x-auto whitespace-pre-wrap p-4 bg-[var(--surface-sunken)] rounded-lg border border-[var(--border)]">
              {JSON.stringify(stats, null, 2)}
            </pre>
          </Card.Content>
        </Card>
      )}

      {!isLoading && !stats && (
        <Card className="bg-[var(--surface)] border border-[var(--border)]">
          <Card.Content className="p-10 text-center">
            <p className="text-[var(--muted)]">No hay datos de analítica disponibles para mostrar.</p>
          </Card.Content>
        </Card>
      )}
    </div>
  );
}
