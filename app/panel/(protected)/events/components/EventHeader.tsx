"use client";

import { Button } from "@/components/ui/button";

interface EventHeaderProps {
  onNewEvent: () => void;
}

export function EventHeader({ onNewEvent }: EventHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--c-gray-800)]">
          Eventos
        </h1>
        <p className="text-sm text-[var(--c-gray-500)] mt-1">
          Organiza torneos, lanzamientos y eventos de tu tienda
        </p>
      </div>
      <Button 
        variant="default" 
        onClick={onNewEvent}
        className="bg-[var(--c-navy-500)] hover:bg-[var(--c-navy-600)] text-white rounded-xl shadow-sm transition-all h-10 px-6"
      >
        Crear Evento
      </Button>
    </div>
  );
}
