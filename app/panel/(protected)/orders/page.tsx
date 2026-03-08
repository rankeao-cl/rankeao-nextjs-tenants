"use client";

import { useState } from "react";
import {
  Card,
  Table,
  Input,
  Label,
  Button,
  Skeleton,
} from "@heroui/react";
import Link from "next/link";
import { useOrders } from "@/lib/hooks/use-orders";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(value);

const getStatusColor = (status: string) => {
  switch (status) {
    case "COMPLETED":
    case "SHIPPED":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "PAID":
    case "PROCESSING":
    case "READY":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "PENDING":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "CANCELLED":
    case "REFUNDED":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    default:
      return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  }
};

export default function OrdersPage() {
  const [query, setQuery] = useState("");
  const [page] = useState(1);
  const { data, isLoading } = useOrders({ page, query: query || undefined });
  const orders = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--foreground)]">
            Órdenes
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">Gestiona los pedidos de tus clientes, envíos y devoluciones.</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="bg-[var(--surface)] border border-[var(--border)] w-full">
          <div className="p-4 flex flex-col sm:flex-row gap-4 items-end">
            <div className="w-full sm:max-w-xs space-y-1.5 flex flex-col">
              <Label className="text-xs font-semibold text-[var(--muted)]">Buscar Orden</Label>
              <Input
                placeholder="Ej: ORD-1234 o Email del cliente"
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                className="bg-transparent border border-[var(--border)]"
              />
            </div>
          </div>
        </Card>

        <Card className="bg-[var(--surface)] border border-[var(--border)] w-full overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <Table.ScrollContainer>
                <Table.Content aria-label="Tabla de Órdenes" className="min-w-full">
                  <Table.Header className="bg-[var(--surface-sunken)] border-b border-[var(--border)]">
                    <Table.Column isRowHeader className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">ID Orden</Table.Column>
                    <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Cliente</Table.Column>
                    <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Fecha</Table.Column>
                    <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Monto Total</Table.Column>
                    <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Estado</Table.Column>
                    <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider text-right">Acciones</Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {isLoading ? (
                      Array(5).fill(0).map((_, i) => (
                        <Table.Row key={i} className="border-b border-[var(--border)]">
                          <Table.Cell className="py-4 px-4"><Skeleton className="h-6 w-24 rounded" /></Table.Cell>
                          <Table.Cell className="py-4 px-4"><Skeleton className="h-6 w-32 rounded" /></Table.Cell>
                          <Table.Cell className="py-4 px-4"><Skeleton className="h-6 w-24 rounded" /></Table.Cell>
                          <Table.Cell className="py-4 px-4"><Skeleton className="h-6 w-20 rounded" /></Table.Cell>
                          <Table.Cell className="py-4 px-4"><Skeleton className="h-6 w-20 rounded" /></Table.Cell>
                          <Table.Cell className="py-4 px-4"><Skeleton className="h-8 w-16 rounded ml-auto" /></Table.Cell>
                        </Table.Row>
                      ))
                    ) : orders.length === 0 ? (
                      <Table.Row>
                        <Table.Cell colSpan={6} className="py-12 text-center text-[var(--muted)]">
                          No se encontraron órdenes.
                        </Table.Cell>
                      </Table.Row>
                    ) : (
                      orders.map((order) => (
                        <Table.Row key={order.id} className="border-b border-[var(--border)] hover:bg-white/[0.02] transition-colors">
                          <Table.Cell className="py-4 px-4">
                            <span className="text-sm font-medium text-[var(--foreground)] font-mono">
                              {order.order_number || `#${order.id.split("-").pop()?.substring(0, 8)}`}
                            </span>
                          </Table.Cell>
                          <Table.Cell className="py-4 px-4">
                            <span className="text-sm text-[var(--foreground)]">{order.customer_name || "Cliente Invitado"}</span>
                          </Table.Cell>
                          <Table.Cell className="py-4 px-4">
                            <span className="text-sm text-[var(--muted)]">
                              {order.created_at ? new Date(order.created_at).toLocaleDateString() : "N/A"}
                            </span>
                          </Table.Cell>
                          <Table.Cell className="py-4 px-4">
                            <span className="text-sm font-medium text-[var(--foreground)]">
                              {formatCurrency(order.total_amount)}
                            </span>
                          </Table.Cell>
                          <Table.Cell className="py-4 px-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </Table.Cell>
                          <Table.Cell className="py-4 px-4 text-right">
                            <Link href={`/panel/orders/${order.id}`}>
                              <Button size="sm" variant="secondary">Gestión de Orden</Button>
                            </Link>
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
    </div>
  );
}
