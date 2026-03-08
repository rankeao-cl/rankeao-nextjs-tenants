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
import { useProducts } from "@/lib/hooks/use-products";

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [page] = useState(1);
  const { data, isLoading } = useProducts({ page, query: query || undefined });
  const products = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-heading)] text-gradient-brand">
            Productos
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">Gestiona el catálogo de productos de tu tienda</p>
        </div>
        <Button onPress={() => toast.info("Funcionalidad de crear producto próximamente")}>
          Nuevo Producto
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="w-full lg:w-1/3 shrink-0">
          <Card className="bg-[var(--surface)] border border-[var(--border)]">
            <Card.Content className="p-5 space-y-4">
              <p className="text-sm font-semibold text-[var(--foreground)]">Filtros</p>
              <p className="text-xs text-[var(--muted)]">Busca productos por SKU o Nombre.</p>
              <TextField className="space-y-1 flex flex-col">
                <Label className="text-xs text-[var(--muted)]">Buscar</Label>
                <Input
                  placeholder="ej. TCG-123 o Pikachu"
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
              ) : products.length === 0 ? (
                <div className="text-center py-10 text-[var(--muted)]">
                  No se encontraron productos.
                </div>
              ) : (
                <Table>
                  <Table.Header>
                    <Table.Column>SKU</Table.Column>
                    <Table.Column>Nombre</Table.Column>
                    <Table.Column>Precio</Table.Column>
                    <Table.Column>Stock</Table.Column>
                    <Table.Column>Estado</Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {products.map((prod) => (
                      <Table.Row key={prod.id}>
                        <Table.Cell>{prod.sku || "-"}</Table.Cell>
                        <Table.Cell>{prod.name}</Table.Cell>
                        <Table.Cell>${prod.price}</Table.Cell>
                        <Table.Cell>{prod.stock_quantity}</Table.Cell>
                        <Table.Cell>{prod.status}</Table.Cell>
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
