"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useInventoryAlerts, useCreateInventoryMovement } from "@/lib/hooks/use-inventory";
import { useProducts } from "@/lib/hooks/use-products";
import { getErrorMessage } from "@/lib/utils/error-message";
import { InventoryStock } from "./components/InventoryStock";
import { InventoryMovements } from "./components/InventoryMovements";
import { InventoryAlerts } from "./components/InventoryAlerts";

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<"stock_actual" | "movements" | "alerts">("stock_actual");
  const [showAdjustDialog, setShowAdjustDialog] = useState(false);
  const [adjustForm, setAdjustForm] = useState({
    product_id: "",
    type: "ADJUSTMENT",
    quantity: "",
    notes: "",
  });

  // We only fetch alerts here to get the count for the badge.
  const { data: alerts = [] } = useInventoryAlerts(true);
  const { data: productsData } = useProducts({ page: 1, per_page: 100 });
  const products = productsData?.items ?? [];
  const createMovement = useCreateInventoryMovement();

  async function handleCreateMovement() {
    const quantity = Number(adjustForm.quantity);
    if (!adjustForm.product_id) {
      toast.error("Selecciona un producto");
      return;
    }
    if (!Number.isFinite(quantity) || quantity === 0) {
      toast.error("La cantidad debe ser distinta de 0");
      return;
    }

    try {
      await createMovement.mutateAsync({
        product_id: adjustForm.product_id,
        type: adjustForm.type,
        quantity,
        ...(adjustForm.notes.trim() ? { notes: adjustForm.notes.trim() } : {}),
      });
      toast.success("Movimiento de inventario registrado");
      setShowAdjustDialog(false);
      setAdjustForm({ product_id: "", type: "ADJUSTMENT", quantity: "", notes: "" });
      setActiveTab("movements");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "No se pudo registrar el movimiento"));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--foreground)]">
            Inventario
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Revisa el stock actual, historial de movimientos y alertas de stock</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-[var(--brand)] text-[var(--brand)] hover:bg-[var(--brand)] hover:text-white" onClick={() => toast.info("Importación próximamente")}>
             Importar
          </Button>
          <Button variant="default" className="rounded-xl" onClick={() => setShowAdjustDialog(true)}>
            Ajustar Stock
          </Button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-[var(--border)] pb-0 pt-2 px-1">
        <button
          onClick={() => setActiveTab("stock_actual")}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === "stock_actual" ? "text-[var(--brand)] border-[var(--brand)]" : "text-[var(--muted-foreground)] border-transparent hover:text-[var(--foreground)] hover:border-[var(--border-hover)]"}`}
        >
          Stock actual
        </button>
        <button
          onClick={() => setActiveTab("movements")}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === "movements" ? "text-[var(--brand)] border-[var(--brand)]" : "text-[var(--muted-foreground)] border-transparent hover:text-[var(--foreground)] hover:border-[var(--border-hover)]"}`}
        >
          Movimientos
        </button>
        <button
          onClick={() => setActiveTab("alerts")}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === "alerts" ? "text-[var(--brand)] border-[var(--brand)]" : "text-[var(--muted-foreground)] border-transparent hover:text-[var(--foreground)] hover:border-[var(--border-hover)]"}`}
        >
          Alertas de Stock
          {alerts.length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--accent-subtle)] text-[var(--brand-hover)] text-xs font-bold">
              {alerts.length}
            </span>
          )}
        </button>
      </div>

      <div className="w-full">
        {activeTab === "stock_actual" && <InventoryStock />}
        {activeTab === "movements" && <InventoryMovements />}
        {activeTab === "alerts" && <InventoryAlerts />}
      </div>

      <Dialog open={showAdjustDialog} onOpenChange={setShowAdjustDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajuste manual de stock</DialogTitle>
            <DialogDescription>
              Registra compras, ajustes o devoluciones para mantener el inventario actualizado.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Producto</Label>
              <select
                value={adjustForm.product_id}
                onChange={(e) => setAdjustForm((prev) => ({ ...prev, product_id: e.target.value }))}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Selecciona un producto</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.sku ? `(${p.sku})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <select
                  value={adjustForm.type}
                  onChange={(e) => setAdjustForm((prev) => ({ ...prev, type: e.target.value }))}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="ADJUSTMENT">Ajuste</option>
                  <option value="PURCHASE">Compra</option>
                  <option value="RETURN">Devolución</option>
                  <option value="TRANSFER">Transferencia</option>
                  <option value="DAMAGE">Merma/Daño</option>
                  <option value="INITIAL">Carga inicial</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Cantidad</Label>
                <Input
                  type="number"
                  value={adjustForm.quantity}
                  onChange={(e) => setAdjustForm((prev) => ({ ...prev, quantity: e.target.value }))}
                  placeholder="Ej: 5 o -2"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notas</Label>
              <Textarea
                value={adjustForm.notes}
                onChange={(e) => setAdjustForm((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Motivo del ajuste (opcional)"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdjustDialog(false)} disabled={createMovement.isPending}>
              Cancelar
            </Button>
            <Button onClick={handleCreateMovement} disabled={createMovement.isPending}>
              {createMovement.isPending ? "Guardando..." : "Guardar movimiento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
