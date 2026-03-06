"use client";

import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    Table,
    Button,
    Input,
    Form,
    Fieldset,
    Label,
    Spinner,
} from "@heroui/react";
import { toast } from "sonner";
import { listPanelProducts } from "@/lib/api-panel";

export default function ProductsPage() {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState("");

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await listPanelProducts({ page, query });
            setProducts(res.products as any[] || []);
        } catch (error: any) {
            toast.error(error.message || "Error al cargar productos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, query]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-[var(--font-heading)] text-gradient-purple-cyan">
                        Productos
                    </h1>
                    <p className="text-sm text-zinc-500 mt-1">Gestiona el catalogo de productos de tu tienda</p>
                </div>
                <Button
                    type="button"
                    className="bg-gradient-to-r from-zinc-700 to-black shadow-lg shadow-white/10"
                    onPress={() => toast.info("Funcionalidad de crear producto proximamente")}
                >
                    Nuevo Producto
                </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="w-full lg:w-1/3 shrink-0">
                    <Card className="bg-[#0f1017] border border-[#2a2f4b]/40">
                        <CardContent className="p-5">
                            <Form>
                                <Fieldset className="space-y-4">
                                    <Fieldset.Legend className="text-zinc-200 font-semibold">Filtros</Fieldset.Legend>
                                    <p className="text-xs text-zinc-500 mb-2">Busca productos por SKU o Nombre.</p>

                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="space-y-1 flex flex-col">
                                            <Label className="text-xs text-zinc-400">Buscar</Label>
                                            <Input
                                                placeholder="ej. TCG-123 o Pikachu"
                                                value={query}
                                                onChange={(e) => setQuery(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </Fieldset>
                            </Form>
                        </CardContent>
                    </Card>
                </div>

                <div className="w-full lg:w-2/3">
                    <Card className="bg-[#0f1017] border border-[#2a2f4b]/40">
                        <CardContent className="p-5">
                            {loading ? (
                                <div className="flex justify-center py-20">
                                    <Spinner size="lg" color="current" />
                                </div>
                            ) : products.length === 0 ? (
                                <div className="text-center py-10 text-zinc-500">
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
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
