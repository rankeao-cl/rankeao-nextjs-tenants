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
import { ChevronLeft, Package, User, CreditCard, Truck, AlertTriangle, CheckCircle2, Clock, History, FileText, Send } from "lucide-react";
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

const getStatusConfig = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return { label: "Completada", color: "bg-emerald-500 text-white", icon: CheckCircle2 };
    case "SHIPPED":
      return { label: "Enviada", color: "bg-blue-500 text-white", icon: Truck };
    case "PAID":
    case "PROCESSING":
      return { label: "En Proceso", color: "bg-indigo-500 text-white", icon: Clock };
    case "READY":
      return { label: "Listo para Envío", color: "bg-cyan-500 text-white", icon: Package };
    case "PENDING":
      return { label: "Pendiente", color: "bg-amber-500 text-white", icon: AlertTriangle };
    case "CANCELLED":
    case "REFUNDED":
      return { label: "Cancelada", color: "bg-red-500 text-white", icon: AlertTriangle };
    default:
      return { label: status, color: "bg-gray-500 text-white", icon: Clock };
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

  const statusConfig = getStatusConfig(order.status || "UNKNOWN");
  const StatusIcon = statusConfig.icon;
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
      toast.error(getErrorMessage(error, "Error al procesar la acción"));
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
              Orden {order.order_number || `#${id.split("-").pop()?.substring(0, 8)}`}
            </h1>
            <Badge className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border-none shadow-sm flex items-center gap-1.5 ${statusConfig.color}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              {statusConfig.label}
            </Badge>
          </div>
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
                        <p className="text-[14px] font-extrabold text-[var(--c-gray-800)] leading-tight">{item.product_name || item.id}</p>
                        <p className="text-[11px] text-[var(--c-gray-400)] mt-1 font-medium">Categoría: General</p>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-center text-[14px] font-bold text-[var(--c-gray-800)]">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-right text-[13px] font-medium text-[var(--c-gray-500)]">
                        {formatCurrency(item.unit_price)}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-right text-[14px] font-extrabold text-[var(--c-gray-800)]">
                        {formatCurrency(item.quantity * item.unit_price)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="px-6 py-5 bg-[var(--c-gray-50)]/50 border-t border-[var(--c-gray-100)]">
               <div className="flex flex-col items-end gap-2">
                 <div className="flex justify-between w-[240px] text-[13px] font-medium text-[var(--c-gray-500)]">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(totalAmount)}</span>
                 </div>
                 <div className="flex justify-between w-[240px] text-[13px] font-medium text-[var(--c-gray-500)]">
                    <span>Envío:</span>
                    <span className="text-emerald-500">Gratis</span>
                 </div>
                 <div className="flex justify-between w-[240px] pt-2 border-t border-[var(--c-gray-200)] text-[18px] font-extrabold text-[var(--c-navy-500)]">
                    <span>Total:</span>
                    <span>{formatCurrency(totalAmount)}</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Action Hub */}
          <div className="bg-white rounded-3xl border border-[var(--c-gray-200)] p-8 shadow-sm space-y-6">
            <h3 className="text-[15px] font-extrabold text-[var(--c-gray-800)] flex items-center gap-2">
              <History className="w-4 h-4 text-[var(--c-cyan-500)]" /> Gestión de Flujo
            </h3>
            
            <div className="flex flex-wrap gap-3">
              {order.status === "PENDING" && (
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

            {/* Inline Action Forms */}
            {(showShipForm || showCancelForm || showRefundForm) && (
               <div className="pt-6 border-t border-[var(--c-gray-100)] animate-in slide-in-from-top duration-300">
                  {showShipForm && (
                    <div className="space-y-4 max-w-lg bg-[var(--c-gray-50)] p-5 rounded-2xl border border-[var(--c-gray-100)]">
                      <h4 className="text-[13px] font-bold text-[var(--c-gray-700)]">Datos del Envío</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-[10px] uppercase font-bold text-[var(--c-gray-400)] tracking-widest">Transportista</Label>
                          <Input value={shipData.carrier} onChange={(e) => setShipData({ ...shipData, carrier: e.target.value })} placeholder="Ej: Chilexpress" className="h-10 bg-white border-none rounded-lg" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[10px] uppercase font-bold text-[var(--c-gray-400)] tracking-widest">N° Seguimiento</Label>
                          <Input value={shipData.tracking_number} onChange={(e) => setShipData({ ...shipData, tracking_number: e.target.value })} placeholder="CL-938392" className="h-10 bg-white border-none rounded-lg" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button className="h-10 px-6 bg-[var(--c-cyan-500)] text-white font-bold rounded-xl flex-1" disabled={actionLoading} onClick={handleShip}>Confirmar Envío</Button>
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
                  {order.customer_name?.charAt(0) || "C"}
                </div>
                <div>
                   <p className="text-[15px] font-extrabold text-[var(--c-gray-800)] leading-none mt-1">{order.customer_name || "Cliente Invitado"}</p>
                   {order.customer_email && <p className="text-[12px] text-[var(--c-gray-400)] mt-1.5 font-medium">{order.customer_email}</p>}
                </div>
              </div>
              <div className="space-y-4 pt-2">
                 <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--c-gray-400)]">Teléfono</span>
                    <span className="text-[13px] font-bold text-[var(--c-gray-700)]">{order.customer_phone || "No proporcionado"}</span>
                 </div>
                 <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--c-gray-400)]">Dirección de Envío</span>
                    <span className="text-[13px] font-bold text-[var(--c-gray-700)] leading-relaxed">{order.shipping_address || "Retiro en tienda"}</span>
                 </div>
              </div>
           </div>

           {/* Payment Details */}
           <div className="bg-white rounded-3xl border border-[var(--c-gray-200)] p-7 shadow-sm space-y-6">
              <h3 className="text-[14px] font-extrabold text-[var(--c-gray-800)] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[var(--c-cyan-500)]" /> Detalle del Pago
              </h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                    <span className="text-[12px] font-bold text-emerald-600 uppercase tracking-tight">Monto Total</span>
                    <span className="text-[18px] font-extrabold text-emerald-700">{formatCurrency(totalAmount)}</span>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--c-gray-400)]">Fecha</span>
                       <span className="text-[12px] font-bold text-[var(--c-gray-700)]">{order.created_at ? new Date(order.created_at).toLocaleDateString() : "N/A"}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--c-gray-400)]">Transportista</span>
                       <span className="text-[12px] font-bold text-[var(--c-gray-700)]">{order.carrier || "N/A"}</span>
                    </div>
                 </div>
                 {order.tracking_number && (
                    <div className="flex flex-col gap-1 p-3 bg-[var(--c-gray-50)] rounded-xl border border-[var(--c-gray-100)]">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--c-gray-400)]">Tracking Code</span>
                       <span className="text-[13px] font-mono font-bold text-[var(--c-navy-500)]">{order.tracking_number}</span>
                    </div>
                 )}
              </div>
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
        </div>
      </div>
    </div>
  );
}
