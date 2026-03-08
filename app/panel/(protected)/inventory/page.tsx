"use client";

import { useState } from "react";
import {
  Card,
  Table,
  Button,
  Input,
  Label,
  Skeleton,
  toast,
} from "@heroui/react";
import { useInventoryMovements, useInventoryAlerts } from "@/lib/hooks/use-inventory";

const getMovementColor = (type: string) => {
  switch (type?.toUpperCase()) {
    case "IN": case "PURCHASE": case "RETURN":
      return "text-emerald-400";
    case "OUT": case "SALE": case "ADJUSTMENT":
      return "text-red-400";
    default:
      return "text-[var(--muted)]";
  }
};

export default function InventoryPage() {
  const [query, setQuery] = useState("");
  const [page] = useState(1);
  const [activeTab, setActiveTab] = useState<"movements" | "alerts">("movements");

  const { data: movementsData, isLoading: movementsLoading } = useInventoryMovements(
    activeTab === "movements" ? { page, query: query || undefined } : undefined
  );
  const movements = movementsData?.items ?? [];

  const { data: alerts = [], isLoading: alertsLoading } = useInventoryAlerts(activeTab === "alerts");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--foreground)]">
            Inventario
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">Revisa el historial de movimientos y alertas de stock</p>
        </div>
        <Button variant="primary" onPress={() => toast.info("Ajuste manual de stock próximamente")}>
          Ajustar Stock
        </Button>
      </div>

      <div className="flex gap-2 border-b border-[var(--border)] pb-2">
        <button
          onClick={() => setActiveTab("movements")}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === "movements" ? "text-[var(--foreground)] border-b-2 border-[var(--primary)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"}`}
        >
          Movimientos
        </button>
        <button
          onClick={() => setActiveTab("alerts")}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === "alerts" ? "text-red-400 border-b-2 border-red-500" : "text-[var(--muted)] hover:text-[var(--foreground)]"}`}
        >
          Alertas de Stock
          {alerts.length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500/20 text-red-400 text-xs font-bold">
              {alerts.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === "movements" && (
        <div className="space-y-4">
          <Card className="bg-[var(--surface)] border border-[var(--border)] w-full">
            <div className="p-4">
              <div className="w-full sm:max-w-xs space-y-1.5 flex flex-col">
                <Label className="text-xs font-semibold text-[var(--muted)]">Buscar Movimientos</Label>
                <Input
                  placeholder="Ej: TCG-123 o 'venta'"
                  value={query}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                  className="bg-transparent border border-[var(--border)]"
                />
              </div>
            </div>
          </Card>

          <Card className="bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <Table.ScrollContainer>
                  <Table.Content aria-label="Movimientos de Inventario" className="min-w-full">
                    <Table.Header className="bg-[var(--surface-sunken)] border-b border-[var(--border)]">
                      <Table.Column isRowHeader className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Fecha</Table.Column>
                      <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Producto ID</Table.Column>
                      <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Tipo</Table.Column>
                      <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider text-center">Cantidad</Table.Column>
                      <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Motivo</Table.Column>
                    </Table.Header>
                    <Table.Body>
                      {movementsLoading ? (
                        Array(3).fill(0).map((_, i) => (
                          <Table.Row key={i} className="border-b border-[var(--border)]">
                            <Table.Cell className="py-4 px-4"><Skeleton className="h-5 w-20 rounded" /></Table.Cell>
                            <Table.Cell className="py-4 px-4"><Skeleton className="h-5 w-24 rounded" /></Table.Cell>
                            <Table.Cell className="py-4 px-4"><Skeleton className="h-5 w-16 rounded" /></Table.Cell>
                            <Table.Cell className="py-4 px-4"><Skeleton className="h-5 w-10 rounded mx-auto" /></Table.Cell>
                            <Table.Cell className="py-4 px-4"><Skeleton className="h-5 w-32 rounded" /></Table.Cell>
                          </Table.Row>
                        ))
                      ) : movements.length === 0 ? (
                        <Table.Row>
                          <Table.Cell colSpan={5} className="py-12 text-center text-[var(--muted)]">
                            No se encontraron movimientos.
                          </Table.Cell>
                        </Table.Row>
                      ) : (
                        movements.map((mov) => (
                          <Table.Row key={mov.id} className="border-b border-[var(--border)] last:border-0 hover:bg-white/[0.02] transition-colors">
                            <Table.Cell className="py-4 px-4 text-sm text-[var(--muted)]">
                              {new Date(mov.created_at).toLocaleDateString()}
                            </Table.Cell>
                            <Table.Cell className="py-4 px-4 font-mono text-sm text-[var(--foreground)]">
                              {mov.product_id}
                            </Table.Cell>
                            <Table.Cell className="py-4 px-4">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
                                {mov.movement_type}
                              </span>
                            </Table.Cell>
                            <Table.Cell className={`py-4 px-4 text-center font-semibold ${getMovementColor(mov.movement_type)}`}>
                              {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity}
                            </Table.Cell>
                            <Table.Cell className="py-4 px-4 text-sm text-[var(--muted)]">
                              {mov.reason || "-"}
                            </Table.Cell>
                          </Table.Row>
                        ))
                      )}
                    </Table.Body>
                  </Table.Content>
                </Table.ScrollContainer>
              </Table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "alerts" && (
        <Card className="bg-[var(--surface)] border border-red-500/30 overflow-hidden">
          <div className="p-6 border-b border-red-500/20 bg-red-500/5">
            <h3 className="text-lg font-semibold text-red-400">Productos con Stock Crítico</h3>
            <p className="text-sm text-[var(--muted)] mt-1">Estos productos necesitan reabastecimiento.</p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <Table.ScrollContainer>
                <Table.Content aria-label="Alertas de Inventario" className="min-w-full">
                  <Table.Header className="bg-[var(--surface-sunken)] border-b border-[var(--border)]">
                    <Table.Column isRowHeader className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Producto ID</Table.Column>
                    <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Nombre</Table.Column>
                    <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider text-center">Stock Actual</Table.Column>
                    <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider text-center">Umbral</Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {alertsLoading ? (
                      Array(3).fill(0).map((_, i) => (
                        <Table.Row key={i} className="border-b border-[var(--border)]">
                          <Table.Cell className="py-4 px-4"><Skeleton className="h-5 w-24 rounded" /></Table.Cell>
                          <Table.Cell className="py-4 px-4"><Skeleton className="h-5 w-32 rounded" /></Table.Cell>
                          <Table.Cell className="py-4 px-4"><Skeleton className="h-5 w-10 rounded mx-auto" /></Table.Cell>
                          <Table.Cell className="py-4 px-4"><Skeleton className="h-5 w-10 rounded mx-auto" /></Table.Cell>
                        </Table.Row>
                      ))
                    ) : alerts.length === 0 ? (
                      <Table.Row>
                        <Table.Cell colSpan={4} className="py-12 text-center text-emerald-400">
                          No hay productos con stock bajo. Todo está en orden.
                        </Table.Cell>
                      </Table.Row>
                    ) : (
                      alerts.map((alert) => (
                        <Table.Row key={alert.product_id} className="border-b border-[var(--border)] last:border-0 hover:bg-white/[0.02]">
                          <Table.Cell className="py-4 px-4 font-mono text-sm text-[var(--foreground)]">
                            {alert.product_id}
                          </Table.Cell>
                          <Table.Cell className="py-4 px-4 font-medium text-[var(--foreground)]">
                            {alert.product_name || "Desconocido"}
                          </Table.Cell>
                          <Table.Cell className="py-4 px-4 text-center font-bold text-red-400">
                            {alert.current_stock}
                          </Table.Cell>
                          <Table.Cell className="py-4 px-4 text-center text-[var(--muted)]">
                            {alert.alert_threshold ?? "-"}
                          </Table.Cell>
                        </Table.Row>
                      ))
                    )}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
}
