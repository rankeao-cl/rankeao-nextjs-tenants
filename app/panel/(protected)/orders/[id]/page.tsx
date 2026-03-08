"use client";

import { use, useState } from "react";
import { Card, Table, Button, Input, Label, TextArea, Skeleton, toast } from "@heroui/react";
import Link from "next/link";
import { useOrderDetail } from "@/lib/hooks/use-orders";
import {
  processOrder,
  readyOrder,
  shipOrder,
  completeOrder,
  cancelOrder,
  refundOrder,
  updateOrderNotes,
} from "@/lib/api/orders";
import { getErrorMessage } from "@/lib/utils/error-message";
import { useQueryClient } from "@tanstack/react-query";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(value);

const getStatusColor = (status: string) => {
  switch (status) {
    case "COMPLETED":
    case "SHIPPED":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "PAID":
    case "PROCESSING":
    case "READY":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "PENDING":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "CANCELLED":
    case "REFUNDED":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    default:
      return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  }
};

interface OrderItem {
  id: string;
  product_name?: string;
  quantity: number;
  unit_price: number;
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const { data: order, isLoading } = useOrderDetail(id);

  const [actionLoading, setActionLoading] = useState(false);
  const [showShipForm, setShowShipForm] = useState(false);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [showRefundForm, setShowRefundForm] = useState(false);
  const [shipData, setShipData] = useState({ carrier: "", tracking_number: "" });
  const [cancelReason, setCancelReason] = useState("");
  const [refundData, setRefundData] = useState({ amount: "", reason: "" });
  const [notes, setNotes] = useState("");
  const [notesInitialized, setNotesInitialized] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64 rounded-lg" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <Skeleton className="h-6 w-48 rounded-lg" />
              </div>
              <div className="p-4 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex justify-between border-b border-[var(--border)] pb-4">
                    <Skeleton className="h-5 w-48 rounded" />
                    <Skeleton className="h-5 w-12 rounded" />
                    <Skeleton className="h-5 w-24 rounded" />
                    <Skeleton className="h-5 w-24 rounded" />
                  </div>
                ))}
                <div className="flex justify-end pt-2">
                  <Skeleton className="h-6 w-48 rounded-lg" />
                </div>
              </div>
            </Card>
            <Card className="bg-[var(--surface)] border border-[var(--border)] p-6">
              <Skeleton className="h-6 w-32 rounded-lg mb-4" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24 rounded-lg" />
                <Skeleton className="h-10 w-32 rounded-lg" />
                <Skeleton className="h-10 w-24 rounded-lg" />
              </div>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="bg-[var(--surface)] border border-[var(--border)] p-6">
              <Skeleton className="h-6 w-32 rounded-lg mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-4 w-4/5 rounded" />
              </div>
            </Card>
            <Card className="bg-[var(--surface)] border border-[var(--border)] p-6">
              <Skeleton className="h-6 w-32 rounded-lg mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-1/2 rounded" />
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-4 w-1/3 rounded" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return <div className="text-center py-20 text-[var(--muted)]">Orden no encontrada.</div>;
  }

  if (!notesInitialized && order.internal_notes) {
    setNotes(order.internal_notes);
    setNotesInitialized(true);
  }

  const status = order.status || "UNKNOWN";
  const items = (order.items as OrderItem[]) || [];
  const totalAmount = order.total_amount || 0;

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["order", id] });

  const handleAction = async (action: () => Promise<unknown>, successMsg: string) => {
    try {
      setActionLoading(true);
      await action();
      toast.success(successMsg);
      invalidate();
    } catch (error: unknown) {
      toast.danger(getErrorMessage(error, "Error al procesar la acción"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleShip = () => handleAction(
    () => shipOrder(id, shipData),
    "Orden enviada"
  ).then(() => setShowShipForm(false));

  const handleCancel = () => handleAction(
    () => cancelOrder(id, { reason: cancelReason }),
    "Orden cancelada"
  ).then(() => setShowCancelForm(false));

  const handleRefund = () => handleAction(
    () => refundOrder(id, { amount: Number(refundData.amount), reason: refundData.reason }),
    "Reembolso procesado"
  ).then(() => setShowRefundForm(false));

  const handleSaveNotes = () => handleAction(
    () => updateOrderNotes(id, { internal_notes: notes }),
    "Notas guardadas"
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/panel/orders">
          <Button variant="secondary" size="sm">Volver</Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Orden {order.order_number || `#${id.split("-").pop()?.substring(0, 8)}`}
          </h1>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
            {status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
            <div className="p-4 border-b border-[var(--border)] bg-[var(--surface-sunken)]">
              <h3 className="font-semibold text-[var(--foreground)]">Productos del Pedido</h3>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <Table.ScrollContainer>
                  <Table.Content aria-label="Items de la orden" className="min-w-full">
                    <Table.Header>
                      <Table.Column isRowHeader className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase">Producto</Table.Column>
                      <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase text-center">Cant.</Table.Column>
                      <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase text-right">Precio Unit.</Table.Column>
                      <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase text-right">Subtotal</Table.Column>
                    </Table.Header>
                    <Table.Body>
                      {items.length === 0 ? (
                        <Table.Row>
                          <Table.Cell colSpan={4} className="py-8 text-center text-[var(--muted)]">Sin items</Table.Cell>
                        </Table.Row>
                      ) : (
                        items.map((item) => (
                          <Table.Row key={item.id} className="border-b border-[var(--border)]">
                            <Table.Cell className="py-3 px-4 text-sm text-[var(--foreground)]">{item.product_name || item.id}</Table.Cell>
                            <Table.Cell className="py-3 px-4 text-sm text-center text-[var(--foreground)]">{item.quantity}</Table.Cell>
                            <Table.Cell className="py-3 px-4 text-sm text-right text-[var(--muted)]">{formatCurrency(item.unit_price)}</Table.Cell>
                            <Table.Cell className="py-3 px-4 text-sm text-right font-medium text-[var(--foreground)]">{formatCurrency(item.quantity * item.unit_price)}</Table.Cell>
                          </Table.Row>
                        ))
                      )}
                      <Table.Row className="bg-[var(--surface-sunken)]">
                        <Table.Cell colSpan={3} className="py-3 px-4 text-sm font-semibold text-[var(--foreground)] text-right">Total</Table.Cell>
                        <Table.Cell className="py-3 px-4 text-sm font-bold text-[var(--foreground)] text-right">{formatCurrency(totalAmount)}</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table.Content>
                </Table.ScrollContainer>
              </Table>
            </div>
          </Card>

          <Card className="bg-[var(--surface)] border border-[var(--border)]">
            <Card.Content className="p-6 space-y-4">
              <h3 className="font-semibold text-[var(--foreground)]">Acciones</h3>
              <div className="flex flex-wrap gap-2">
                {status === "PENDING" && (
                  <Button variant="primary" isDisabled={actionLoading} onPress={() => handleAction(() => processOrder(id), "Orden en proceso")}>
                    Procesar
                  </Button>
                )}
                {status === "PROCESSING" && (
                  <Button variant="primary" isDisabled={actionLoading} onPress={() => handleAction(() => readyOrder(id), "Orden lista")}>
                    Lista para Envío
                  </Button>
                )}
                {(status === "READY" || status === "PROCESSING") && (
                  <Button variant="primary" isDisabled={actionLoading} onPress={() => setShowShipForm(!showShipForm)}>
                    Enviar
                  </Button>
                )}
                {status === "SHIPPED" && (
                  <Button variant="primary" isDisabled={actionLoading} onPress={() => handleAction(() => completeOrder(id), "Orden completada")}>
                    Completar
                  </Button>
                )}
                {!["CANCELLED", "REFUNDED", "COMPLETED"].includes(status) && (
                  <Button variant="danger" isDisabled={actionLoading} onPress={() => setShowCancelForm(!showCancelForm)}>
                    Cancelar
                  </Button>
                )}
                {["COMPLETED", "SHIPPED"].includes(status) && (
                  <Button variant="danger" isDisabled={actionLoading} onPress={() => setShowRefundForm(!showRefundForm)}>
                    Reembolsar
                  </Button>
                )}
              </div>

              {showShipForm && (
                <div className="space-y-3 p-4 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border)]">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm text-[var(--muted)]">Transportista</Label>
                    <Input value={shipData.carrier} onChange={(e) => setShipData({ ...shipData, carrier: e.target.value })} placeholder="Ej: Chilexpress" className="bg-transparent border border-[var(--border)]" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm text-[var(--muted)]">N° Seguimiento</Label>
                    <Input value={shipData.tracking_number} onChange={(e) => setShipData({ ...shipData, tracking_number: e.target.value })} placeholder="Ej: CL123456789" className="bg-transparent border border-[var(--border)]" />
                  </div>
                  <Button variant="primary" isDisabled={actionLoading} onPress={handleShip}>Confirmar Envío</Button>
                </div>
              )}

              {showCancelForm && (
                <div className="space-y-3 p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm text-[var(--muted)]">Motivo de Cancelación</Label>
                    <Input value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Ej: Solicitud del cliente" className="bg-transparent border border-[var(--border)]" />
                  </div>
                  <Button variant="danger" isDisabled={actionLoading} onPress={handleCancel}>Confirmar Cancelación</Button>
                </div>
              )}

              {showRefundForm && (
                <div className="space-y-3 p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm text-[var(--muted)]">Monto a Reembolsar</Label>
                    <Input type="number" value={refundData.amount} onChange={(e) => setRefundData({ ...refundData, amount: e.target.value })} placeholder="Ej: 15000" className="bg-transparent border border-[var(--border)]" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm text-[var(--muted)]">Motivo del Reembolso</Label>
                    <Input value={refundData.reason} onChange={(e) => setRefundData({ ...refundData, reason: e.target.value })} placeholder="Ej: Producto defectuoso" className="bg-transparent border border-[var(--border)]" />
                  </div>
                  <Button variant="danger" isDisabled={actionLoading} onPress={handleRefund}>Confirmar Reembolso</Button>
                </div>
              )}
            </Card.Content>
          </Card>

          <Card className="bg-[var(--surface)] border border-[var(--border)]">
            <Card.Content className="p-6 space-y-3">
              <h3 className="font-semibold text-[var(--foreground)]">Notas Internas</h3>
              <TextArea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Agrega notas internas sobre esta orden..."
                rows={3}
                className="bg-transparent border border-[var(--border)] w-full resize-y"
              />
              <div className="flex justify-end">
                <Button variant="primary" isDisabled={actionLoading} onPress={handleSaveNotes}>
                  Guardar Notas
                </Button>
              </div>
            </Card.Content>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-[var(--surface)] border border-[var(--border)]">
            <Card.Content className="p-6 space-y-4">
              <h3 className="font-semibold text-[var(--foreground)]">Cliente</h3>
              <div className="space-y-2 text-sm">
                <div><span className="text-[var(--muted)]">Nombre:</span> <span className="text-[var(--foreground)]">{order.customer_name || "Cliente Invitado"}</span></div>
                {order.customer_email && <div><span className="text-[var(--muted)]">Email:</span> <span className="text-[var(--foreground)]">{order.customer_email}</span></div>}
                {order.customer_phone && <div><span className="text-[var(--muted)]">Teléfono:</span> <span className="text-[var(--foreground)]">{order.customer_phone}</span></div>}
                {order.shipping_address && <div><span className="text-[var(--muted)]">Dirección:</span> <span className="text-[var(--foreground)]">{order.shipping_address}</span></div>}
              </div>
            </Card.Content>
          </Card>

          <Card className="bg-[var(--surface)] border border-[var(--border)]">
            <Card.Content className="p-6 space-y-2">
              <h3 className="font-semibold text-[var(--foreground)]">Detalle</h3>
              <div className="text-sm space-y-2">
                <div><span className="text-[var(--muted)]">Fecha:</span> <span className="text-[var(--foreground)]">{order.created_at ? new Date(order.created_at).toLocaleDateString() : "N/A"}</span></div>
                <div><span className="text-[var(--muted)]">Total:</span> <span className="text-[var(--foreground)] font-bold">{formatCurrency(totalAmount)}</span></div>
                {order.carrier && <div><span className="text-[var(--muted)]">Transportista:</span> <span className="text-[var(--foreground)]">{order.carrier}</span></div>}
                {order.tracking_number && <div><span className="text-[var(--muted)]">Tracking:</span> <span className="text-[var(--foreground)] font-mono">{order.tracking_number}</span></div>}
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
}
