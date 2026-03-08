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
import { useCoupons } from "@/lib/hooks/use-coupons";

export default function CouponsPage() {
  const [query, setQuery] = useState("");
  const [page] = useState(1);
  const { data, isLoading } = useCoupons({ page, query: query || undefined });
  const coupons = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-heading)] text-gradient-brand">
            Cupones
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">Gestiona los descuentos de tu tienda</p>
        </div>
        <Button onPress={() => toast.info("Crear cupón próximamente")}>
          Nuevo Cupón
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="w-full lg:w-1/3 shrink-0">
          <Card className="bg-[var(--surface)] border border-[var(--border)]">
            <Card.Content className="p-5 space-y-4">
              <p className="text-sm font-semibold text-[var(--foreground)]">Filtros</p>
              <p className="text-xs text-[var(--muted)]">Busca cupones por código.</p>
              <TextField className="space-y-1 flex flex-col">
                <Label className="text-xs text-[var(--muted)]">Buscar</Label>
                <Input
                  placeholder="ej. VERANO2026"
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
              ) : coupons.length === 0 ? (
                <div className="text-center py-10 text-[var(--muted)]">
                  No se encontraron cupones.
                </div>
              ) : (
                <Table>
                  <Table.Header>
                    <Table.Column>Código</Table.Column>
                    <Table.Column>Descuento</Table.Column>
                    <Table.Column>Min. Compra</Table.Column>
                    <Table.Column>Estado</Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {coupons.map((coupon) => (
                      <Table.Row key={coupon.id}>
                        <Table.Cell className="font-mono">{coupon.code}</Table.Cell>
                        <Table.Cell>
                          {coupon.discount_type === "PERCENTAGE"
                            ? `${coupon.discount_value}%`
                            : `$${coupon.discount_value}`}
                        </Table.Cell>
                        <Table.Cell>{coupon.min_purchase ? `$${coupon.min_purchase}` : "-"}</Table.Cell>
                        <Table.Cell>{coupon.status}</Table.Cell>
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
