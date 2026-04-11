"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Package, Truck, Calendar, MapPin, ChevronRight, Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Shipment } from "@/lib/api/shipments";

interface ShipmentListProps {
  shipments: Shipment[];
  isLoading: boolean;
  onEdit: (shipment: Shipment) => void;
  getShipmentStatusColor: (status: string) => string;
  STATUS_LABELS: Record<string, string>;
}

export function ShipmentList({
  shipments,
  isLoading,
  onEdit,
  getShipmentStatusColor,
  STATUS_LABELS,
}: ShipmentListProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl border border-[var(--c-gray-200)] overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-[var(--c-gray-50)]">
            <TableRow>
              <TableHead>Orden</TableHead>
              <TableHead>Detalle Envío</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Estimado</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5).fill(0).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-6 w-24 rounded-lg" /></TableCell>
                <TableCell><Skeleton className="h-10 w-48 rounded-lg" /></TableCell>
                <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-5 w-32 rounded-lg" /></TableCell>
                <TableCell><Skeleton className="h-10 w-24 rounded-xl ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] border border-[var(--c-gray-100)] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-[var(--c-gray-50)]/50 border-b border-[var(--c-gray-100)]">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[11px] font-bold text-[var(--c-gray-400)] uppercase tracking-widest py-4 px-6">Orden / ID</TableHead>
              <TableHead className="text-[11px] font-bold text-[var(--c-gray-400)] uppercase tracking-widest py-4 px-6">Transportista & Seguimiento</TableHead>
              <TableHead className="text-[11px] font-bold text-[var(--c-gray-400)] uppercase tracking-widest py-4 px-6 text-center">Logística</TableHead>
              <TableHead className="text-[11px] font-bold text-[var(--c-gray-400)] uppercase tracking-widest py-4 px-6">Fecha Envío / Est.</TableHead>
              <TableHead className="w-[120px] text-right py-4 px-6"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shipments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-24 text-center">
                   <div className="flex flex-col items-center gap-4">
                      <div className="p-4 rounded-full bg-[var(--c-gray-50)]">
                        <Truck className="h-8 w-8 text-[var(--c-gray-300)]" />
                      </div>
                      <p className="text-[var(--c-gray-500)] font-medium">No se registran envíos activos</p>
                   </div>
                </TableCell>
              </TableRow>
            ) : (
              shipments.map((shipment) => (
                <TableRow key={shipment.id} className="hover:bg-[var(--c-gray-50)] transition-colors border-b border-[var(--c-gray-100)] last:border-0 group/row">
                  <TableCell className="py-5 px-6">
                    <div className="flex flex-col">
                       <span className="text-[14px] font-bold text-[var(--c-gray-800)]">{shipment.order_number || shipment.order_id}</span>
                       <span className="text-[10px] text-[var(--c-gray-400)] font-medium mt-1 uppercase tracking-tight">Guía: #{shipment.id}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-5 px-6">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-[var(--c-navy-500)]/5 flex items-center justify-center text-[var(--c-navy-500)]">
                          <Package className="h-5 w-5" />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[13px] font-extrabold text-[var(--c-gray-800)]">{shipment.carrier}</span>
                          <div className="flex items-center gap-1.5 mt-1">
                             <Hash className="h-3 w-3 text-[var(--c-cyan-500)]" />
                             <span className="text-[11px] font-mono font-medium text-[var(--c-gray-500)]">{shipment.tracking_number}</span>
                          </div>
                       </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-5 px-6 text-center">
                    <Badge variant="outline" className={`rounded-xl px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest border-none ${getShipmentStatusColor(shipment.status)}`}>
                      {STATUS_LABELS[shipment.status] || shipment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-5 px-6">
                    <div className="flex flex-col gap-1.5">
                       <div className="flex items-center gap-1.5 text-[var(--c-gray-600)]">
                          <Calendar className="h-3.5 w-3.5 text-[var(--c-navy-500)]" />
                          <span className="text-[12px] font-bold">{shipment.created_at ? new Date(shipment.created_at).toLocaleDateString("es-CL") : "Pendiente"}</span>
                       </div>
                       {shipment.estimated_delivery && (
                         <div className="flex items-center gap-1.5 text-[var(--c-gray-400)]">
                            <MapPin className="h-3 w-3 text-[var(--c-cyan-500)]" />
                            <span className="text-[11px] font-medium italic">Est: {shipment.estimated_delivery}</span>
                         </div>
                       )}
                    </div>
                  </TableCell>
                  <TableCell className="py-5 px-6 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onEdit(shipment)}
                      className="h-10 px-4 text-[12px] font-bold text-[var(--c-navy-500)] bg-[var(--c-navy-500)]/5 hover:bg-[var(--c-navy-500)] hover:text-white rounded-xl opacity-0 group-hover/row:opacity-100 transition-all shadow-sm"
                    >
                      Gestionar <ChevronRight className="h-3.5 w-3.5 ml-1.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
