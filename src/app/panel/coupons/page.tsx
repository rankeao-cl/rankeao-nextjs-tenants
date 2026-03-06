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
import { listPanelCoupons } from "@/lib/api-panel";

export default function CouponsPage() {
    const [loading, setLoading] = useState(true);
    const [coupons, setCoupons] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState("");

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const res = await listPanelCoupons({ page, query });
            setCoupons(res.coupons as any[] || []);
        } catch (error: any) {
            toast.error(error.message || "Error al cargar cupones");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, [page, query]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-[var(--font-heading)] text-gradient-purple-cyan">
                        Cupones
                    </h1>
                    <p className="text-sm text-zinc-500 mt-1">Gestiona los descuentos de tu tienda</p>
                </div>
                <Button
                    type="button"
                    className="bg-gradient-to-r from-zinc-700 to-black shadow-lg shadow-white/10"
                    onPress={() => toast.info("Crear cupon proximamente")}
                >
                    Nuevo Cupon
                </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="w-full lg:w-1/3 shrink-0">
                    <Card className="bg-[#0f1017] border border-[#2a2f4b]/40">
                        <CardContent className="p-5">
                            <Form>
                                <Fieldset className="space-y-4">
                                    <Fieldset.Legend className="text-zinc-200 font-semibold">Filtros</Fieldset.Legend>
                                    <p className="text-xs text-zinc-500 mb-2">Busca cupones por codigo.</p>

                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="space-y-1 flex flex-col">
                                            <Label className="text-xs text-zinc-400">Buscar</Label>
                                            <Input
                                                placeholder="ej. VERANO2026"
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
                            ) : coupons.length === 0 ? (
                                <div className="text-center py-10 text-zinc-500">
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
                                        {coupons.map((coupon) => (
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
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
