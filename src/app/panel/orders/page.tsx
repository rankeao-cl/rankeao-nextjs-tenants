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
import { listPanelOrders } from "@/lib/api-panel";

export default function OrdersPage() {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState("");

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await listPanelOrders({ page, query });
            setOrders(res.orders as any[] || []);
        } catch (error: any) {
            toast.error(error.message || "Error al cargar ordenes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page, query]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-[var(--font-heading)] text-gradient-purple-cyan">
                        Ordenes
                    </h1>
                    <p className="text-sm text-zinc-500 mt-1">Gestiona los pedidos de tus clientes</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="w-full lg:w-1/3 shrink-0">
                    <Card className="bg-[#0f1017] border border-[#2a2f4b]/40">
                        <CardContent className="p-5">
                            <Form>
                                <Fieldset className="space-y-4">
                                    <Fieldset.Legend className="text-zinc-200 font-semibold">Filtros</Fieldset.Legend>
                                    <p className="text-xs text-zinc-500 mb-2">Busca ordenes por ID o cliente.</p>

                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="space-y-1 flex flex-col">
                                            <Label className="text-xs text-zinc-400">Buscar</Label>
                                            <Input
                                                placeholder="ej. ORD-123 o Juan Perez"
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
                            ) : orders.length === 0 ? (
                                <div className="text-center py-10 text-zinc-500">
                                    No se encontraron ordenes.
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
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
