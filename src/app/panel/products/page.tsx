"use client";

import { useEffect, useState } from "react";
import {
    Card,
    Table,
    Button,
    Input,
    TextField,
    Form,
    Fieldset,
    Label,
    Spinner,
} from "@heroui/react";
import { toast } from "@heroui/react";
import { listPanelProducts } from "@/lib/api-panel";
import { getErrorMessage } from "@/lib/error-message";

interface Product {
    id: string;
    sku?: string;
    name: string;
    price: number;
    stock_quantity: number;
    status: string;
}


export default function ProductsPage() {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [page] = useState(1);
    const [query, setQuery] = useState("");

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await listPanelProducts({ page, query });
            setProducts((res.products as Product[]) || []);
        } catch (error: unknown) {
            toast.danger(getErrorMessage(error, "Error al cargar productos"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
    }, [page, query]);
    // eslint-disable-next-line react-hooks/exhaustive-deps

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-[var(--font-heading)] text-gradient-purple-cyan">
                        Productos
                    </h1>
                    <p className="text-sm text-[var(--muted)] mt-1">Gestiona el catalogo de productos de tu tienda</p>
                </div>
                <Button
                    type="button"

                    onPress={() => toast.info("Funcionalidad de crear producto proximamente")}
                >
                    Nuevo Producto
                </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="w-full lg:w-1/3 shrink-0">
                    <Card className="bg-[var(--surface)] border border-[var(--border)]/40">
                        <Card.Content className="p-5">
                            <Form>
                                <Fieldset className="space-y-4">
                                    <Fieldset.Legend className="text-[var(--foreground)] font-semibold">Filtros</Fieldset.Legend>
                                    <p className="text-xs text-[var(--muted)] mb-2">Busca productos por SKU o Nombre.</p>

                                    <div className="grid grid-cols-1 gap-3">
                                        <TextField className="space-y-1 flex flex-col">
                                            <Label className="text-xs text-[var(--muted)]">Buscar</Label>
                                            <Input
                                                placeholder="ej. TCG-123 o Pikachu"
                                                value={query}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setQuery(e.target.value)}
                                            />
                                        </TextField>
                                    </div>
                                </Fieldset>
                            </Form>
                        </Card.Content>
                    </Card>
                </div>

                <div className="w-full lg:w-2/3">
                    <Card className="bg-[var(--surface)] border border-[var(--border)]/40">
                        <Card.Content className="p-5">
                            {loading ? (
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
                                        {products.map((prod: Product) => (
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

