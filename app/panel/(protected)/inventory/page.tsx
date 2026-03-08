"use client";

import { useState } from "react";
import {
  Card,
  Table,
  Button,
  Input,
  TextField,
  Label,
  Spinner,
  toast,
} from "@heroui/react";
import { useInventoryMovements } from "@/lib/hooks/use-inventory";

export default function InventoryPage() {
  const [query, setQuery] = useState("");
  const [page] = useState(1);
  const { data, isLoading } = useInventoryMovements({ page, query: query || undefined });
  const movements = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-heading)] text-gradient-brand">
            Inventario
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">Revisa el historial de movimientos de stock</p>
        </div>
        <Button onPress={() => toast.info("Ajuste manual de stock próximamente")}>
          Ajustar Stock
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="w-full lg:w-1/3 shrink-0">
          <Card className="bg-[var(--surface)] border border-[var(--border)]">
            <Card.Content className="p-5 space-y-4">
              <p className="text-sm font-semibold text-[var(--foreground)]">Filtros</p>
              <p className="text-xs text-[var(--muted)]">Busca movimientos por ID de producto o motivo.</p>
              <TextField className="space-y-1 flex flex-col">
                <Label className="text-xs text-[var(--muted)]">Buscar</Label>
                <Input
                  placeholder="ej. TCG-123 o 'venta'"
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
              ) : movements.length === 0 ? (
                <div className="text-center py-10 text-[var(--muted)]">
                  No se encontraron movimientos.
                </div>
              ) : (
                <Table>
                  <Table.Header>
                    <Table.Column>Fecha</Table.Column>
                    <Table.Column>Producto ID</Table.Column>
                    <Table.Column>Tipo</Table.Column>
                    <Table.Column>Cantidad</Table.Column>
                    <Table.Column>Motivo</Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {movements.map((mov) => (
                      <Table.Row key={mov.id}>
                        <Table.Cell>{new Date(mov.created_at).toLocaleDateString("es-CL")}</Table.Cell>
                        <Table.Cell>{mov.product_id}</Table.Cell>
                        <Table.Cell>{mov.movement_type}</Table.Cell>
                        <Table.Cell>{mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity}</Table.Cell>
                        <Table.Cell>{mov.reason || "-"}</Table.Cell>
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
