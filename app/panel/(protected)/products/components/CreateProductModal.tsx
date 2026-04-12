"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useCreateProduct } from "@/lib/hooks/use-products";
import { getErrorMessage } from "@/lib/utils/error-message";

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProductModal({ isOpen, onClose }: CreateProductModalProps) {
  const createMutation = useCreateProduct();
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    stock: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error("Nombre y precio son requeridos");
      return;
    }
    const priceNum = Number(formData.price);
    if (isNaN(priceNum) || priceNum < 0) {
      toast.error("El precio debe ser un número válido");
      return;
    }
    try {
      await createMutation.mutateAsync({
        name: formData.name,
        sku: formData.sku,
        price: priceNum,
        stock: formData.stock ? Number(formData.stock) : 0,
        description: formData.description,
      });
      toast.success("Producto creado exitosamente");
      onClose();
      setFormData({ name: "", sku: "", price: "", stock: "", description: "" });
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al crear producto"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-[var(--card)] border border-[var(--border)] shadow-2xl !rounded-3xl overflow-hidden p-0 gap-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-[20px] font-extrabold text-[var(--foreground)] tracking-tight">
            Crear Nuevo Producto
          </DialogTitle>
          <p className="text-[13px] text-[var(--muted-foreground)] font-medium">Ingresa los detalles básicos para tu nuevo item</p>
        </DialogHeader>
        
        <div className="p-6 pt-4">
          <form id="create-product-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Nombre de producto *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej. TCG Caja Coleccionista"
                  className="h-11 bg-[var(--surface)] border-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] font-medium"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">SKU / Código</Label>
                <Input
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="Ej. PROD-001"
                  className="h-11 bg-[var(--surface)] border-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] font-medium"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Precio CLP *</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] font-bold">$</span>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0"
                    className="h-11 pl-8 bg-[var(--surface)] border-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] font-bold"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Stock Inicial</Label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="0"
                  className="h-11 bg-[var(--surface)] border-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] font-medium"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Descripción detallada</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe las características principales del producto..."
                  className="bg-[var(--surface)] border-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] font-medium min-h-[120px] resize-none"
                />
              </div>
            </div>
          </form>
        </div>

        <DialogFooter className="p-6 bg-[var(--surface)] flex items-center gap-3">
          <Button 
            variant="ghost"
            className="text-[13px] font-bold text-[var(--muted-foreground)] hover:bg-[var(--surface)] h-11 px-6" 
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="create-product-form"
            disabled={createMutation.isPending}
            className="bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white font-bold h-11 px-8 shadow-lg shadow-[var(--brand)]/10"
          >
            {createMutation.isPending ? "Guardando..." : "Crear Producto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
