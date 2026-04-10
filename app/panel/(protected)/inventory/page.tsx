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
          <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--c-gray-800)]">
            Inventario
          </h1>
          <p className="text-sm text-[var(--c-gray-500)] mt-1">Revisa el stock actual, historial de movimientos y alertas de stock</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-[var(--c-cyan-500)] text-[var(--c-cyan-500)] hover:bg-[var(--c-cyan-500)] hover:text-white" onClick={() => toast.info("Importación próximamente")}>
             Importar
          </Button>
          <Button variant="default" className="bg-[var(--c-navy-500)] hover:bg-[var(--c-navy-600)]" onClick={() => toast.info("Ajuste manual de stock próximamente")}>
            Ajustar Stock
          </Button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-[var(--c-gray-200)] pb-0 pt-2 px-1">
        <button
          onClick={() => setActiveTab("stock_actual")}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === "stock_actual" ? "text-[var(--c-cyan-500)] border-[var(--c-cyan-500)]" : "text-[var(--c-gray-500)] border-transparent hover:text-[var(--c-gray-800)] hover:border-[var(--c-gray-300)]"}`}
        >
          Stock actual
        </button>
        <button
          onClick={() => setActiveTab("movements")}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === "movements" ? "text-[var(--c-cyan-500)] border-[var(--c-cyan-500)]" : "text-[var(--c-gray-500)] border-transparent hover:text-[var(--c-gray-800)] hover:border-[var(--c-gray-300)]"}`}
        >
          Movimientos
        </button>
        <button
          onClick={() => setActiveTab("alerts")}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === "alerts" ? "text-[var(--c-cyan-500)] border-[var(--c-cyan-500)]" : "text-[var(--c-gray-500)] border-transparent hover:text-[var(--c-gray-800)] hover:border-[var(--c-gray-300)]"}`}
        >
          Alertas de Stock
          {alerts.length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--c-cyan-100)] text-[var(--c-cyan-600)] text-xs font-bold">
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
