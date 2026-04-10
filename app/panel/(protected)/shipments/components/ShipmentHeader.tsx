"use client";

import { Button } from "@/components/ui/button";

interface ShipmentHeaderProps {
  onNewShipment: () => void;
}

export function ShipmentHeader({ onNewShipment }: ShipmentHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--c-gray-800)]">
          Logística y Envíos
        </h1>
        <p className="text-sm text-[var(--c-gray-50)] mt-1">
          Gestiona tus guías de despacho y el estado de entrega de tus pedidos
        </p>
      </div>
      <Button 
        variant="default" 
        onClick={onNewShipment}
        className="bg-[var(--c-navy-500)] hover:bg-[var(--c-navy-600)] text-white rounded-xl shadow-sm transition-all h-10 px-6 font-bold"
      >
        Crear Guía de Despacho
      </Button>
    </div>
  );
}
