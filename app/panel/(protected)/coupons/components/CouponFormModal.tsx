"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Coupon } from "@/lib/types/coupons";

interface CouponFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon: Partial<Coupon> | null;
  onSave: (data: Partial<Coupon>) => void;
  saving: boolean;
}

export function CouponFormModal({
  open,
  onOpenChange,
  coupon,
  onSave,
  saving,
}: CouponFormModalProps) {
  const isEdit = !!coupon?.id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#ffffff] border border-[var(--c-gray-200)] sm:max-w-[450px] p-0 overflow-hidden rounded-[24px]">
        <div className="p-6 border-b border-[var(--c-gray-100)] bg-[var(--c-gray-50)]/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[var(--c-gray-800)]">
              {isEdit ? "Editar Cupón" : "Crear Nuevo Cupón"}
            </DialogTitle>
            <p className="text-sm text-[var(--c-gray-500)] mt-1">
              Configure los detalles del código de descuento
            </p>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-2 flex flex-col">
            <Label className="text-sm font-semibold text-[var(--c-gray-600)]">Código del Cupón</Label>
            <Input
              value={coupon?.code || ""}
              onChange={(e) => onSave({ ...coupon, code: e.target.value.toUpperCase() })}
              placeholder="ej. VERANO2026"
              className="bg-white border-[var(--c-gray-200)] rounded-xl h-11 font-mono font-bold text-[var(--c-navy-500)] placeholder:font-sans placeholder:font-normal"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 flex flex-col">
              <Label className="text-sm font-semibold text-[var(--c-gray-600)]">Tipo</Label>
              <select
                value={coupon?.discount_type || "PERCENTAGE"}
                onChange={(e) => onSave({ ...coupon, discount_type: e.target.value as "PERCENTAGE" | "FIXED" })}
                className="w-full bg-white border border-[var(--c-gray-200)] rounded-xl h-11 px-3 text-sm text-[var(--c-gray-800)] focus:outline-none focus:ring-2 focus:ring-[var(--c-navy-500)]/20 transition-all cursor-pointer"
              >
                <option value="PERCENTAGE">Porcentaje (%)</option>
                <option value="FIXED">Monto Fijo ($)</option>
              </select>
            </div>
            <div className="space-y-2 flex flex-col">
              <Label className="text-sm font-semibold text-[var(--c-gray-600)]">Valor</Label>
              <Input
                type="number"
                value={coupon?.discount_value?.toString() || ""}
                onChange={(e) => onSave({ ...coupon, discount_value: Number(e.target.value) })}
                placeholder={coupon?.discount_type === "PERCENTAGE" ? "20" : "5000"}
                className="bg-white border-[var(--c-gray-200)] rounded-xl h-11"
              />
            </div>
          </div>

          <div className="space-y-2 flex flex-col">
            <Label className="text-sm font-semibold text-[var(--c-gray-600)]">Compra Mínima (Opcional)</Label>
            <Input
              type="number"
              value={coupon?.min_purchase?.toString() || ""}
              onChange={(e) => onSave({ ...coupon, min_purchase: Number(e.target.value) || undefined })}
              placeholder="Monto mínimo para aplicar"
              className="bg-white border-[var(--c-gray-200)] rounded-xl h-11"
            />
          </div>

          <div className="space-y-2 flex flex-col">
            <Label className="text-sm font-semibold text-[var(--c-gray-600)]">Estado</Label>
            <select
              value={coupon?.status || "ACTIVE"}
              onChange={(e) => onSave({ ...coupon, status: e.target.value as "ACTIVE" | "INACTIVE" | "EXPIRED" })}
              className="w-full bg-white border border-[var(--c-gray-200)] rounded-xl h-11 px-3 text-sm text-[var(--c-gray-800)] focus:outline-none focus:ring-2 focus:ring-[var(--c-navy-500)]/20 transition-all cursor-pointer"
            >
              <option value="ACTIVE">Activo</option>
              <option value="INACTIVE">Inactivo</option>
              <option value="EXPIRED">Expirado</option>
            </select>
          </div>
        </div>

        <DialogFooter className="p-6 pt-2">
          <div className="flex w-full gap-3">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="flex-1 rounded-xl h-11 border-[var(--c-gray-200)] text-[var(--c-gray-600)]"
            >
              Cancelar
            </Button>
            <Button 
              variant="default" 
              disabled={saving} 
              onClick={() => onSave(coupon || {})}
              className="flex-1 rounded-xl h-11 bg-[var(--c-navy-500)] hover:bg-[var(--c-navy-600)] text-white shadow-lg shadow-[var(--c-navy-500)]/20"
            >
              {saving ? "Guardando..." : isEdit ? "Actualizar Cupón" : "Crear Cupón"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
