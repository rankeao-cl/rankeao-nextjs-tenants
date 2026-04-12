"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useInventoryAlerts } from "@/lib/hooks/use-inventory";
import { InventoryStock } from "./components/InventoryStock";
import { InventoryMovements } from "./components/InventoryMovements";
import { InventoryAlerts } from "./components/InventoryAlerts";

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<"stock_actual" | "movements" | "alerts">("stock_actual");

  // We only fetch alerts here to get the count for the badge.
  const { data: alerts = [] } = useInventoryAlerts(true);

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
          <Button variant="default" className="rounded-xl" onClick={() => toast.info("Ajuste manual de stock próximamente")}>
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
    </div>
  );
}
