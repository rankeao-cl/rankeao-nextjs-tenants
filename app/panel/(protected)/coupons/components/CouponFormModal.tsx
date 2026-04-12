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
      <DialogContent className="bg-[var(--card)] border border-[var(--border)] sm:max-w-[450px] p-0 overflow-hidden rounded-[24px]">
        <div className="p-6 border-b border-[var(--surface)] bg-[var(--surface)]/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[var(--foreground)]">
              {isEdit ? "Editar Cupón" : "Crear Nuevo Cupón"}
            </DialogTitle>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              Configure los detalles del código de descuento
            </p>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-2 flex flex-col">
            <Label className="text-sm font-semibold text-[var(--muted-foreground)]">Código del Cupón</Label>
            <Input
              value={coupon?.code || ""}
              onChange={(e) => onSave({ ...coupon, code: e.target.value.toUpperCase() })}
              placeholder="ej. VERANO2026"
              className="bg-[var(--card)] border-[var(--border)] h-11 font-mono font-bold text-[var(--brand)] placeholder:font-sans placeholder:font-normal"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 flex flex-col">
              <Label className="text-sm font-semibold text-[var(--muted-foreground)]">Tipo</Label>
              <select
                value={coupon?.discount_type || "PERCENTAGE"}
                onChange={(e) => onSave({ ...coupon, discount_type: e.target.value as "PERCENTAGE" | "FIXED" })}
                className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl h-11 px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 transition-all cursor-pointer"
              >
                <option value="PERCENTAGE">Porcentaje (%)</option>
                <option value="FIXED">Monto Fijo ($)</option>
              </select>
            </div>
            <div className="space-y-2 flex flex-col">
              <Label className="text-sm font-semibold text-[var(--muted-foreground)]">Valor</Label>
              <Input
                type="number"
                value={coupon?.discount_value?.toString() || ""}
                onChange={(e) => onSave({ ...coupon, discount_value: Number(e.target.value) })}
                placeholder={coupon?.discount_type === "PERCENTAGE" ? "20" : "5000"}
                className="bg-[var(--card)] border-[var(--border)] h-11"
              />
            </div>
          </div>

          <div className="space-y-2 flex flex-col">
            <Label className="text-sm font-semibold text-[var(--muted-foreground)]">Compra Mínima (Opcional)</Label>
            <Input
              type="number"
              value={coupon?.min_purchase?.toString() || ""}
              onChange={(e) => onSave({ ...coupon, min_purchase: Number(e.target.value) || undefined })}
              placeholder="Monto mínimo para aplicar"
              className="bg-[var(--card)] border-[var(--border)] h-11"
            />
          </div>

          <div className="space-y-2 flex flex-col">
            <Label className="text-sm font-semibold text-[var(--muted-foreground)]">Estado</Label>
            <select
              value={coupon?.status || "ACTIVE"}
              onChange={(e) => onSave({ ...coupon, status: e.target.value as "ACTIVE" | "INACTIVE" | "EXPIRED" })}
              className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl h-11 px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 transition-all cursor-pointer"
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
              className="flex-1 h-11 border-[var(--border)] text-[var(--muted-foreground)]"
            >
              Cancelar
            </Button>
            <Button 
              variant="default" 
              disabled={saving} 
              onClick={() => onSave(coupon || {})}
              className="flex-1 h-11 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white shadow-lg shadow-[var(--brand)]/20"
            >
              {saving ? "Guardando..." : isEdit ? "Actualizar Cupón" : "Crear Cupón"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
