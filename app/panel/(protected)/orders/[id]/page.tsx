"use client";

import { use, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { ChevronLeft, Package, User, CreditCard, Truck, AlertTriangle, CheckCircle2, Clock, History, FileText, Send, MapPin } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(value);

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PENDING_PAYMENT: { label: "Pago pendiente", color: "bg-amber-500 text-white", icon: Clock },
  PAID:            { label: "Pagada", color: "bg-indigo-500 text-white", icon: CheckCircle2 },
  PROCESSING:      { label: "En Proceso", color: "bg-indigo-500 text-white", icon: Clock },
  READY:           { label: "Listo para Envío", color: "bg-cyan-500 text-white", icon: Package },
  SHIPPED:         { label: "Enviada", color: "bg-blue-500 text-white", icon: Truck },
  DELIVERED:       { label: "Entregada", color: "bg-teal-500 text-white", icon: Truck },
  COMPLETED:       { label: "Completada", color: "bg-emerald-500 text-white", icon: CheckCircle2 },
  CANCELLED:       { label: "Cancelada", color: "bg-red-500 text-white", icon: AlertTriangle },
  REFUNDED:        { label: "Reembolsada", color: "bg-orange-500 text-white", icon: AlertTriangle },
};

const DELIVERY_LABELS: Record<string, string> = {
  SHIPPING: "Envío a domicilio",
  PICKUP: "Retiro en tienda",
  IN_PERSON: "En persona",
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const { data: order, isLoading } = useOrderDetail(id);

  const [actionLoading, setActionLoading] = useState(false);
  const [showShipForm, setShowShipForm] = useState(false);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [showRefundForm, setShowRefundForm] = useState(false);
  const [shipData, setShipData] = useState({ carrier: "", tracking_number: "", carrier_name: "", notes: "" });
  const [cancelReason, setCancelReason] = useState("");
  const [refundData, setRefundData] = useState({ amount: "", reason: "" });
  const [notes, setNotes] = useState("");
  const [notesInitialized, setNotesInitialized] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <Skeleton className="h-12 w-64 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-[400px] w-full rounded-3xl" />
            <Skeleton className="h-48 w-full rounded-3xl" />
          </div>
          <div className="space-y-8">
            <Skeleton className="h-64 w-full rounded-3xl" />
            <Skeleton className="h-48 w-full rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[var(--c-gray-800)]">Orden no encontrada</h2>
        <p className="text-[14px] text-[var(--c-gray-500)] mt-2">No pudimos localizar la información de este pedido.</p>
        <Link href="/panel/orders" className="mt-6">
          <Button variant="outline" className="rounded-xl px-6 font-bold">Volver al listado</Button>
        </Link>
      </div>
    );
  }

  if (!notesInitialized && order.internal_notes) {
    setNotes(order.internal_notes);
    setNotesInitialized(true);
  }

  const statusCfg = STATUS_CONFIG[order.status] ?? { label: order.status, color: "bg-gray-500 text-white", icon: Clock };
  const StatusIcon = statusCfg.icon;
  const items = order.items ?? [];
  const shipment = order.shipment;
  const review = order.review;

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["order", id] });

  const handleAction = async (action: () => Promise<unknown>, successMsg: string) => {
    try {
      setActionLoading(true);
      await action();
      toast.success(successMsg);
      invalidate();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al procesar la acción"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleShip = () => handleAction(
    () => shipOrder(id, { carrier: shipData.carrier, tracking_number: shipData.tracking_number, carrier_name: shipData.carrier_name || undefined, notes: shipData.notes || undefined }),
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

  // Full shipping address string
  const shippingParts = [
    order.shipping_address,
    order.shipping_city,
    order.shipping_region,
    order.shipping_country,
  ].filter(Boolean);
  const shippingAddressStr = shippingParts.length > 0 ? shippingParts.join(", ") : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex flex-col gap-3">
          <Link href="/panel/orders" className="w-max">
            <Button variant="ghost" size="sm" className="h-8 px-2 -ml-2 text-[var(--c-gray-400)] hover:text-[var(--c-cyan-600)] hover:bg-[var(--c-cyan-50)] rounded-lg font-bold">
              <ChevronLeft className="w-4 h-4 mr-1" /> Volver a órdenes
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-[26px] font-extrabold text-[var(--c-gray-800)] tracking-tight">
              Orden {order.order_number}
            </h1>
            <Badge className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border-none shadow-sm flex items-center gap-1.5 ${statusCfg.color}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              {statusCfg.label}
            </Badge>
          </div>
          <p className="text-xs text-[var(--c-gray-400)]">
            {DELIVERY_LABELS[order.delivery_method] || order.delivery_method}
            {order.currency && ` · ${order.currency}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-11 px-5 border-[var(--c-gray-200)] text-[var(--c-gray-600)] font-bold rounded-xl hover:bg-[var(--c-gray-50)]">
            <FileText className="w-4 h-4 mr-2" /> Imprimir Boleta
          </Button>
          <Button className="h-11 px-5 bg-[var(--c-cyan-500)] hover:bg-[var(--c-cyan-600)] text-white font-bold rounded-xl shadow-lg shadow-[var(--c-cyan-500)]/10">
            <Send className="w-4 h-4 mr-2" /> Enviar Correo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Items & Actions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Items Table */}
          <div className="bg-white rounded-3xl border border-[var(--c-gray-200)] overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-[var(--c-gray-100)] flex items-center justify-between bg-[var(--c-gray-50)]/50">
              <h3 className="text-[15px] font-extrabold text-[var(--c-gray-800)] flex items-center gap-2">
                <Package className="w-4 h-4 text-[var(--c-cyan-500)]" /> Productos del Pedido
              </h3>
              <span className="text-[11px] font-bold text-[var(--c-gray-400)] uppercase tracking-widest">{items.length} items</span>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="hover:bg-transparent">
                  <TableRow className="hover:bg-transparent border-b border-[var(--c-gray-100)]">
                    <TableHead className="text-[11px] font-bold text-[var(--c-gray-400)] uppercase tracking-widest py-4 px-6">Producto</TableHead>
                    <TableHead className="text-[11px] font-bold text-[var(--c-gray-400)] uppercase tracking-widest py-4 px-6 text-center">Cant.</TableHead>
                    <TableHead className="text-[11px] font-bold text-[var(--c-gray-400)] uppercase tracking-widest py-4 px-6 text-right">Precio Unit.</TableHead>
                    <TableHead className="text-[11px] font-bold text-[var(--c-gray-400)] uppercase tracking-widest py-4 px-6 text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id} className="border-b border-[var(--c-gray-50)] last:border-0 hover:bg-[var(--c-gray-50)] transition-colors">
                      <TableCell className="py-4 px-6">
                        <p className="text-[14px] font-extrabold text-[var(--c-gray-800)] leading-tight">{item.product_name}</p>
                        {item.product_sku && <p className="text-[11px] text-[var(--c-gray-400)] mt-1 font-medium font-mono">{item.product_sku}</p>}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-center text-[14px] font-bold text-[var(--c-gray-800)]">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-right text-[13px] font-medium text-[var(--c-gray-500)]">
                        {formatCurrency(item.unit_price)}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-right text-[14px] font-extrabold text-[var(--c-gray-800)]">
                        {formatCurrency(item.total)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="px-6 py-5 bg-[var(--c-gray-50)]/50 border-t border-[var(--c-gray-100)]">
              <div className="flex flex-col items-end gap-2">
                <div className="flex justify-between w-[280px] text-[13px] font-medium text-[var(--c-gray-500)]">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between w-[280px] text-[13px] font-medium text-emerald-600">
                    <span>Descuento:</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                {order.shipping_cost > 0 && (
                  <div className="flex justify-between w-[280px] text-[13px] font-medium text-[var(--c-gray-500)]">
                    <span>Envío:</span>
                    <span>{formatCurrency(order.shipping_cost)}</span>
                  </div>
                )}
                <div className="flex justify-between w-[280px] pt-2 border-t border-[var(--c-gray-200)] text-[18px] font-extrabold text-[var(--c-navy-500)]">
                  <span>Total:</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
                {order.seller_payout > 0 && (
                  <div className="flex justify-between w-[280px] text-[11px] font-medium text-[var(--c-gray-400)]">
                    <span>Pago neto tienda:</span>
                    <span>{formatCurrency(order.seller_payout)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Hub */}
          <div className="bg-white rounded-3xl border border-[var(--c-gray-200)] p-8 shadow-sm space-y-6">
            <h3 className="text-[15px] font-extrabold text-[var(--c-gray-800)] flex items-center gap-2">
              <History className="w-4 h-4 text-[var(--c-cyan-500)]" /> Gestión de Flujo
            </h3>

            <div className="flex flex-wrap gap-3">
              {order.status === "PAID" && (
                <Button className="h-11 px-6 bg-[var(--c-navy-500)] text-white font-bold rounded-xl" disabled={actionLoading} onClick={() => handleAction(() => processOrder(id), "Orden en proceso")}>
                  Procesar Orden
                </Button>
              )}
              {order.status === "PROCESSING" && (
                <Button className="h-11 px-6 bg-cyan-500 text-white font-bold rounded-xl" disabled={actionLoading} onClick={() => handleAction(() => readyOrder(id), "Orden lista")}>
                  Listo para Envío
                </Button>
              )}
              {(order.status === "READY" || order.status === "PROCESSING") && (
                <Button className="h-11 px-6 bg-indigo-500 text-white font-bold rounded-xl" disabled={actionLoading} onClick={() => setShowShipForm(!showShipForm)}>
                  Enviar Pedido
                </Button>
              )}
              {order.status === "SHIPPED" && (
                <Button className="h-11 px-6 bg-emerald-500 text-white font-bold rounded-xl" disabled={actionLoading} onClick={() => handleAction(() => completeOrder(id), "Orden completada")}>
                  Marcar como Completada
                </Button>
              )}

              {!["CANCELLED", "REFUNDED", "COMPLETED"].includes(order.status) && (
                <Button variant="ghost" className="h-11 px-6 text-red-500 hover:bg-red-50 font-bold rounded-xl" disabled={actionLoading} onClick={() => setShowCancelForm(!showCancelForm)}>
                  Cancelar Orden
                </Button>
              )}

              {["COMPLETED", "SHIPPED"].includes(order.status) && (
                <Button variant="ghost" className="h-11 px-6 text-amber-500 hover:bg-amber-50 font-bold rounded-xl" disabled={actionLoading} onClick={() => setShowRefundForm(!showRefundForm)}>
                  Procesar Reembolso
                </Button>
              )}
            </div>

            {(showShipForm || showCancelForm || showRefundForm) && (
              <div className="pt-6 border-t border-[var(--c-gray-100)] animate-in slide-in-from-top duration-300">
                {showShipForm && (
                  <div className="space-y-4 max-w-lg bg-[var(--c-gray-50)] p-5 rounded-2xl border border-[var(--c-gray-100)]">
                    <h4 className="text-[13px] font-bold text-[var(--c-gray-700)]">Datos del Envío</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase font-bold text-[var(--c-gray-400)] tracking-widest">Transportista *</Label>
                        <Input value={shipData.carrier} onChange={(e) => setShipData({ ...shipData, carrier: e.target.value })} placeholder="Ej: chilexpress" className="h-10 bg-white border-none rounded-lg" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase font-bold text-[var(--c-gray-400)] tracking-widest">Nombre transportista</Label>
                        <Input value={shipData.carrier_name} onChange={(e) => setShipData({ ...shipData, carrier_name: e.target.value })} placeholder="Ej: Chilexpress" className="h-10 bg-white border-none rounded-lg" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase font-bold text-[var(--c-gray-400)] tracking-widest">N° Seguimiento</Label>
                        <Input value={shipData.tracking_number} onChange={(e) => setShipData({ ...shipData, tracking_number: e.target.value })} placeholder="CL-938392" className="h-10 bg-white border-none rounded-lg" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase font-bold text-[var(--c-gray-400)] tracking-widest">Notas</Label>
                        <Input value={shipData.notes} onChange={(e) => setShipData({ ...shipData, notes: e.target.value })} placeholder="Opcional" className="h-10 bg-white border-none rounded-lg" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="h-10 px-6 bg-[var(--c-cyan-500)] text-white font-bold rounded-xl flex-1" disabled={actionLoading || !shipData.carrier} onClick={handleShip}>Confirmar Envío</Button>
                      <Button variant="ghost" className="h-10 px-4 font-bold rounded-xl" onClick={() => setShowShipForm(false)}>Cancelar</Button>
                    </div>
                  </div>
                )}

                {showCancelForm && (
                  <div className="space-y-4 max-w-lg bg-red-50 p-5 rounded-2xl border border-red-100">
                    <h4 className="text-[13px] font-bold text-red-600">Cancelar Pedido</h4>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase font-bold text-red-400 tracking-widest">Motivo de la cancelación</Label>
                      <Input value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Ej: Error en el stock" className="h-10 bg-white border-none rounded-lg" />
                    </div>
                    <div className="flex gap-2">
                      <Button className="h-10 px-6 bg-red-500 text-white font-bold rounded-xl flex-1" disabled={actionLoading} onClick={handleCancel}>Anular Ahora</Button>
                      <Button variant="ghost" className="h-10 px-4 font-bold rounded-xl text-red-400" onClick={() => setShowCancelForm(false)}>Descartar</Button>
                    </div>
                  </div>
                )}

                {showRefundForm && (
                  <div className="space-y-4 max-w-lg bg-amber-50 p-5 rounded-2xl border border-amber-100">
                    <h4 className="text-[13px] font-bold text-amber-600">Reembolso Parcial o Total</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase font-bold text-amber-400 tracking-widest">Monto</Label>
                        <Input type="number" value={refundData.amount} onChange={(e) => setRefundData({ ...refundData, amount: e.target.value })} placeholder="0" className="h-10 bg-white border-none rounded-lg" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase font-bold text-amber-400 tracking-widest">Razón</Label>
                        <Input value={refundData.reason} onChange={(e) => setRefundData({ ...refundData, reason: e.target.value })} placeholder="Ej: Devolución" className="h-10 bg-white border-none rounded-lg" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="h-10 px-6 bg-amber-500 text-white font-bold rounded-xl flex-1" disabled={actionLoading} onClick={handleRefund}>Confirmar Reembolso</Button>
                      <Button variant="ghost" className="h-10 px-4 font-bold rounded-xl text-amber-400" onClick={() => setShowRefundForm(false)}>Cerrar</Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Customer & Details */}
        <div className="space-y-8">
          {/* Customer Card */}
          <div className="bg-white rounded-3xl border border-[var(--c-gray-200)] p-7 shadow-sm space-y-6">
            <h3 className="text-[14px] font-extrabold text-[var(--c-gray-800)] flex items-center gap-2">
              <User className="w-4 h-4 text-[var(--c-cyan-500)]" /> Información del Cliente
            </h3>
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[var(--c-gray-50)]">
              <div className="w-12 h-12 rounded-full bg-[var(--c-cyan-100)] text-[var(--c-cyan-600)] flex items-center justify-center font-bold text-lg">
                {order.buyer_username?.charAt(0)?.toUpperCase() || "C"}
              </div>
              <div>
                <p className="text-[15px] font-extrabold text-[var(--c-gray-800)] leading-none mt-1">@{order.buyer_username || "—"}</p>
                {order.buyer_notes && <p className="text-[12px] text-[var(--c-gray-400)] mt-1.5 font-medium italic">"{order.buyer_notes}"</p>}
              </div>
            </div>

            {/* Shipping address */}
            {(order.shipping_name || shippingAddressStr) && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--c-gray-400)] flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" /> Dirección de Envío
                </span>
                {order.shipping_name && <p className="text-[13px] font-bold text-[var(--c-gray-700)]">{order.shipping_name}</p>}
                {order.shipping_phone && <p className="text-[12px] text-[var(--c-gray-500)]">{order.shipping_phone}</p>}
                {shippingAddressStr && <p className="text-[12px] text-[var(--c-gray-500)] leading-relaxed">{shippingAddressStr}</p>}
              </div>
            )}
            {!order.shipping_name && order.delivery_method !== "SHIPPING" && (
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--c-gray-400)]">Método de entrega</span>
                <span className="text-[13px] font-bold text-[var(--c-gray-700)]">{DELIVERY_LABELS[order.delivery_method] || order.delivery_method}</span>
              </div>
            )}
          </div>

          {/* Payment + Shipment */}
          <div className="bg-white rounded-3xl border border-[var(--c-gray-200)] p-7 shadow-sm space-y-6">
            <h3 className="text-[14px] font-extrabold text-[var(--c-gray-800)] flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[var(--c-cyan-500)]" /> Pago y Envío
            </h3>
            <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
              <span className="text-[12px] font-bold text-emerald-600 uppercase tracking-tight">Monto Total</span>
              <span className="text-[18px] font-extrabold text-emerald-700">{formatCurrency(order.total)}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-[12px]">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--c-gray-400)]">Fecha</span>
                <span className="font-bold text-[var(--c-gray-700)]">{new Date(order.created_at).toLocaleDateString("es-CL")}</span>
              </div>
              {order.payment && (
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--c-gray-400)]">Método pago</span>
                  <span className="font-bold text-[var(--c-gray-700)]">{order.payment.provider}</span>
                </div>
              )}
            </div>
            {/* Shipment info */}
            {shipment && (
              <div className="pt-4 border-t border-[var(--c-gray-100)] space-y-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[var(--c-cyan-500)]" />
                  <span className="text-[13px] font-extrabold text-[var(--c-gray-800)]">{shipment.carrier_name || shipment.carrier}</span>
                </div>
                {shipment.tracking_number && (
                  <div className="p-3 bg-[var(--c-gray-50)] rounded-xl border border-[var(--c-gray-100)]">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--c-gray-400)] block mb-1">Código de seguimiento</span>
                    <span className="text-[13px] font-mono font-bold text-[var(--c-navy-500)]">{shipment.tracking_number}</span>
                    {shipment.tracking_url && (
                      <a href={shipment.tracking_url} target="_blank" rel="noopener noreferrer" className="block text-[11px] text-[var(--c-cyan-500)] hover:underline mt-1">Ver seguimiento →</a>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Internal Notes */}
          <div className="bg-white rounded-3xl border border-[var(--c-gray-200)] p-7 shadow-sm space-y-4">
            <h3 className="text-[14px] font-extrabold text-[var(--c-gray-800)] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[var(--c-cyan-500)]" /> Notas Internas
            </h3>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Solo visible para el personal..."
              className="bg-[var(--c-gray-50)] border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-[var(--c-cyan-500)] font-medium text-[13px] min-h-[100px] resize-none"
            />
            <Button onClick={handleSaveNotes} disabled={actionLoading} className="w-full h-10 bg-[var(--c-gray-100)] hover:bg-[var(--c-gray-200)] text-[var(--c-gray-600)] font-bold rounded-xl transition-all">
              Actualizar Notas
            </Button>
          </div>

          {/* Buyer Review */}
          {review && (
            <div className="bg-white rounded-3xl border border-[var(--c-gray-200)] p-7 shadow-sm space-y-4">
              <h3 className="text-[14px] font-extrabold text-[var(--c-gray-800)] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Reseña del Comprador
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={`text-lg ${star <= review.overall_rating ? "text-amber-400" : "text-[var(--c-gray-200)]"}`}>★</span>
                  ))}
                </div>
                <span className="text-[13px] font-bold text-[var(--c-gray-700)]">{review.overall_rating}/5</span>
              </div>
              {review.comment && (
                <p className="text-[13px] text-[var(--c-gray-600)] italic leading-relaxed">"{review.comment}"</p>
              )}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {review.condition_accuracy !== undefined && (
                  <div className="flex justify-between bg-[var(--c-gray-50)] px-3 py-2 rounded-xl">
                    <span className="text-[var(--c-gray-400)] font-medium">Estado</span>
                    <span className="font-bold text-[var(--c-gray-700)]">{review.condition_accuracy}/5</span>
                  </div>
                )}
                {review.shipping_speed !== undefined && (
                  <div className="flex justify-between bg-[var(--c-gray-50)] px-3 py-2 rounded-xl">
                    <span className="text-[var(--c-gray-400)] font-medium">Envío</span>
                    <span className="font-bold text-[var(--c-gray-700)]">{review.shipping_speed}/5</span>
                  </div>
                )}
                {review.communication !== undefined && (
                  <div className="flex justify-between bg-[var(--c-gray-50)] px-3 py-2 rounded-xl">
                    <span className="text-[var(--c-gray-400)] font-medium">Comunicación</span>
                    <span className="font-bold text-[var(--c-gray-700)]">{review.communication}/5</span>
                  </div>
                )}
                {review.packaging !== undefined && (
                  <div className="flex justify-between bg-[var(--c-gray-50)] px-3 py-2 rounded-xl">
                    <span className="text-[var(--c-gray-400)] font-medium">Empaque</span>
                    <span className="font-bold text-[var(--c-gray-700)]">{review.packaging}/5</span>
                  </div>
                )}
              </div>
              <p className="text-[11px] text-[var(--c-gray-400)]">
                {review.is_anonymous ? "Reseña anónima" : `@${review.reviewer_username || "—"}`}
                {" · "}{new Date(review.created_at).toLocaleDateString("es-CL")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
