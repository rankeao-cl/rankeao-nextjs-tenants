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
    toast,
} from "@heroui/react";
import { listPanelCoupons } from "@/lib/api-panel";
import { getErrorMessage } from "@/lib/error-message";

interface Coupon {
    id: string;
    code: string;
    discount_type: "PERCENTAGE" | "FIXED";
    discount_value: number;
    min_purchase?: number;
    status: string;
}


export default function CouponsPage() {
    const [loading, setLoading] = useState(true);
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [page] = useState(1);
    const [query, setQuery] = useState("");

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const res = await listPanelCoupons({ page, query });
            setCoupons((res.coupons as Coupon[]) || []);
        } catch (error: unknown) {
            toast.danger(getErrorMessage(error, "Error al cargar cupones"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
    }, [page, query]);
    // es-lint-disable-next-line react-hooks/exhaustive-deps

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-[var(--font-heading)] text-gradient-purple-cyan">
                        Cupones
                    </h1>
                    <p className="text-sm text-[var(--muted)] mt-1">Gestiona los descuentos de tu tienda</p>
                </div>
                <Button
                    type="button"

                    onPress={() => toast.info("Crear cupon proximamente")}
                >
                    Nuevo Cupon
                </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="w-full lg:w-1/3 shrink-0">
                    <Card className="bg-[var(--surface)] border border-[var(--border)]/40">
                        <Card.Content className="p-5">
                            <Form>
                                <Fieldset className="space-y-4">
                                    <Fieldset.Legend className="text-[var(--foreground)] font-semibold">Filtros</Fieldset.Legend>
                                    <p className="text-xs text-[var(--muted)] mb-2">Busca cupones por codigo.</p>

                                    <div className="grid grid-cols-1 gap-3">
                                        <TextField className="space-y-1 flex flex-col">
                                            <Label className="text-xs text-[var(--muted)]">Buscar</Label>
                                            <Input
                                                placeholder="ej. VERANO2026"
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
                            ) : coupons.length === 0 ? (
                                <div className="text-center py-10 text-[var(--muted)]">
                                    No se encontraron cupones.
                                </div>
                            ) : (
                                <Table>
                                    <Table.Header>
                                        <Table.Column>Codigo</Table.Column>
                                        <Table.Column>Descuento</Table.Column>
                                        <Table.Column>Min. Compra</Table.Column>
                                        <Table.Column>Estado</Table.Column>
                                    </Table.Header>
                                    <Table.Body>
                                        {coupons.map((coupon: Coupon) => (
                                            <Table.Row key={coupon.id}>
                                                <Table.Cell className="font-mono text-emerald-400">{coupon.code}</Table.Cell>
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

