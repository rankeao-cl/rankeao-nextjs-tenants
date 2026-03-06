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
import { listPanelInventoryMovements } from "@/lib/api-panel";

export default function InventoryPage() {
    const [loading, setLoading] = useState(true);
    const [movements, setMovements] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState("");

    const fetchMovements = async () => {
        try {
            setLoading(true);
            const res = await listPanelInventoryMovements({ page, query });
            setMovements(res.movements as any[] || []);
        } catch (error: any) {
            toast.error(error.message || "Error al cargar movimientos de stock");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovements();
    }, [page, query]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-[var(--font-heading)] text-gradient-purple-cyan">
                        Inventario
                    </h1>
                    <p className="text-sm text-zinc-500 mt-1">Revisa el historial de movimientos de stock</p>
                </div>
                <Button
                    type="button"
                    className="bg-gradient-to-r from-zinc-700 to-black shadow-lg shadow-white/10"
                    onPress={() => toast.info("Ajuste manual de stock proximamente")}
                >
                    Ajustar Stock
                </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="w-full lg:w-1/3 shrink-0">
                    <Card className="bg-[#0f1017] border border-[#2a2f4b]/40">
                        <CardContent className="p-5">
                            <Form>
                                <Fieldset className="space-y-4">
                                    <Fieldset.Legend className="text-zinc-200 font-semibold">Filtros</Fieldset.Legend>
                                    <p className="text-xs text-zinc-500 mb-2">Busca movimientos por ID de producto o motivo.</p>

                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="space-y-1 flex flex-col">
                                            <Label className="text-xs text-zinc-400">Buscar</Label>
                                            <Input
                                                placeholder="ej. TCG-123 o 'venta'"
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
                            ) : movements.length === 0 ? (
                                <div className="text-center py-10 text-zinc-500">
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
                                                <Table.Cell>{new Date(mov.created_at).toLocaleDateString()}</Table.Cell>
                                                <Table.Cell>{mov.product_id}</Table.Cell>
                                                <Table.Cell>{mov.movement_type}</Table.Cell>
                                                <Table.Cell>{mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity}</Table.Cell>
                                                <Table.Cell>{mov.reason || "-"}</Table.Cell>
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
