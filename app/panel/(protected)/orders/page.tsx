"use client";

import { useState } from "react";
import {
  Card,
  Table,
  Input,
  TextField,
  Label,
  Spinner,
} from "@heroui/react";
import { useOrders } from "@/lib/hooks/use-orders";

export default function OrdersPage() {
  const [query, setQuery] = useState("");
  const [page] = useState(1);
  const { data, isLoading } = useOrders({ page, query: query || undefined });
  const orders = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-heading)] text-gradient-brand">
          Órdenes
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1">Gestiona los pedidos de tus clientes</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="w-full lg:w-1/3 shrink-0">
          <Card className="bg-[var(--surface)] border border-[var(--border)]">
            <Card.Content className="p-5 space-y-4">
              <p className="text-sm font-semibold text-[var(--foreground)]">Filtros</p>
              <p className="text-xs text-[var(--muted)]">Busca órdenes por ID o cliente.</p>
              <TextField className="space-y-1 flex flex-col">
                <Label className="text-xs text-[var(--muted)]">Buscar</Label>
                <Input
                  placeholder="ej. ORD-123 o Juan Pérez"
                  value={query}
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setQuery(e.target.value)}
                />
              </TextField>
            </Card.Content>
          </Card>
        </div>

        <div className="w-full lg:w-2/3">
          <Card className="bg-[var(--surface)] border border-[var(--border)]">
            <Card.Content className="p-5">
              {isLoading ? (
                <div className="flex justify-center py-20">
                  <Spinner size="lg" color="current" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-10 text-[var(--muted)]">
                  No se encontraron órdenes.
                </div>
              ) : (
                <Table>
                  <Table.Header>
                    <Table.Column>ID Orden</Table.Column>
                    <Table.Column>Cliente</Table.Column>
                    <Table.Column>Monto Total</Table.Column>
                    <Table.Column>Items</Table.Column>
                    <Table.Column>Estado</Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {orders.map((order) => (
                      <Table.Row key={order.id}>
                        <Table.Cell>{order.id.slice(0, 8)}</Table.Cell>
                        <Table.Cell>{order.customer_name || "-"}</Table.Cell>
                        <Table.Cell>${order.total_amount}</Table.Cell>
                        <Table.Cell>{order.items?.length || 0}</Table.Cell>
                        <Table.Cell>{order.status}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              )}
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
}
