"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck, Hash, MapPin, CheckCircle2 } from "lucide-react";
import type { Shipment } from "@/lib/api/shipments";

interface EditData {
  carrier: string;
  tracking_number: string;
  status: string;
  estimated_delivery: string;
}

interface ShipmentFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedShipment: Shipment | null;
  editData: EditData;
  onEditChange: (data: EditData) => void;
  onSave: () => void;
  saving: boolean;
}

export function ShipmentFormModal({
  open,
  onOpenChange,
  selectedShipment,
  editData,
  onEditChange,
  onSave,
  saving,
}: ShipmentFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[var(--card)] border border-[var(--border)] sm:max-w-[450px] p-0 overflow-hidden rounded-[28px] shadow-2xl">
        <div className="p-6 border-b border-[var(--surface)] bg-[var(--surface)]/50 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-[var(--brand)]/10 text-[var(--brand)]">
             <Truck className="h-6 w-6" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[var(--foreground)]">
              Gestionar Envío
            </DialogTitle>
            <p className="text-sm text-[var(--muted-foreground)] font-medium">
              Orden: {selectedShipment?.order_number ?? selectedShipment?.order_id}
            </p>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2 flex flex-col">
              <Label className="text-[12px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider flex items-center gap-2">
                <Truck className="h-3 w-3 text-[var(--brand)]" /> Transportista
              </Label>
              <Input
                placeholder="Ej. Starken, Chilexpress..."
                value={editData.carrier}
                onChange={(e) => onEditChange({ ...editData, carrier: e.target.value })}
                className="bg-[var(--card)] border-[var(--border)] h-11 focus:ring-[var(--brand)]/20"
              />
            </div>

            <div className="space-y-2 flex flex-col">
              <Label className="text-[12px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider flex items-center gap-2">
                <Hash className="h-3 w-3 text-[var(--brand)]" /> Número de Seguimiento
              </Label>
              <Input
                placeholder="Ej. SKU1293021-CL"
                value={editData.tracking_number}
                onChange={(e) => onEditChange({ ...editData, tracking_number: e.target.value })}
                className="bg-[var(--card)] border-[var(--border)] h-11 font-mono focus:ring-[var(--brand)]/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 flex flex-col">
                <Label className="text-[12px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider flex items-center gap-2">
                   <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Estado
                </Label>
                <select
                  value={editData.status}
                  onChange={(e) => onEditChange({ ...editData, status: e.target.value })}
                  className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl h-11 px-3 py-2 text-sm text-[var(--foreground)] font-bold focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 transition-all appearance-none"
                >
                  <option value="PENDING">Pendiente</option>
                  <option value="IN_TRANSIT">En Tránsito</option>
                  <option value="DELIVERED">Entregado</option>
                  <option value="RETURNED">Devuelto</option>
                  <option value="FAILED">Fallido</option>
                </select>
              </div>

              <div className="space-y-2 flex flex-col">
                <Label className="text-[12px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-red-500" /> Entrega Est.
                </Label>
                <Input
                  type="date"
                  value={editData.estimated_delivery}
                  onChange={(e) => onEditChange({ ...editData, estimated_delivery: e.target.value })}
                  className="bg-[var(--card)] border-[var(--border)] h-11 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-2 bg-[var(--surface)]/30 border-t border-[var(--surface)]">
          <div className="flex w-full gap-3">
             <Button 
               variant="outline" 
               onClick={() => onOpenChange(false)} 
               className="flex-1 h-11 border-[var(--border)] text-[var(--muted-foreground)] font-bold shadow-sm"
             >
               Cancelar
             </Button>
             <Button 
               variant="default" 
               disabled={saving} 
               onClick={onSave}
               className="flex-1 h-11 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white font-bold shadow-lg shadow-[var(--brand)]/20"
             >
               {saving ? "Guardando..." : "Actualizar Envío"}
             </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
