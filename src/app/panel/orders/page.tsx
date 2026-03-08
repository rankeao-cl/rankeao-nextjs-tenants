"use client";

import { useEffect, useState } from "react";
import {
    Card,
    Table,
    Input,
    TextField,
    Form,
    Fieldset,
    Label,
    Spinner,
    toast,
} from "@heroui/react";
import { listPanelOrders } from "@/lib/api-panel";
import { getErrorMessage } from "@/lib/error-message";

interface Order {
    id: string;
    customer_name?: string;
    total_amount: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items?: any[];
    status: string;
}


export default function OrdersPage() {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<Order[]>([]);
    const [page] = useState(1);
    const [query, setQuery] = useState("");

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await listPanelOrders({ page, query });
            setOrders((res.orders as Order[]) || []);
        } catch (error: unknown) {
            toast.danger(getErrorMessage(error, "Error al cargar ordenes"));
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
                        Ordenes
                    </h1>
                    <p className="text-sm text-[var(--muted)] mt-1">Gestiona los pedidos de tus clientes</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="w-full lg:w-1/3 shrink-0">
                    <Card className="bg-[var(--surface)] border border-[var(--border)]/40">
                        <Card.Content className="p-5">
                            <Form>
                                <Fieldset className="space-y-4">
                                    <Fieldset.Legend className="text-[var(--foreground)] font-semibold">Filtros</Fieldset.Legend>
                                    <p className="text-xs text-[var(--muted)] mb-2">Busca ordenes por ID o cliente.</p>

                                    <div className="grid grid-cols-1 gap-3">
                                        <TextField className="space-y-1 flex flex-col">
                                            <Label className="text-xs text-[var(--muted)]">Buscar</Label>
                                            <Input
                                                placeholder="ej. ORD-123 o Juan Perez"
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
                            ) : orders.length === 0 ? (
                                <div className="text-center py-10 text-[var(--muted)]">
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
                                        {orders.map((order: Order) => (
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

