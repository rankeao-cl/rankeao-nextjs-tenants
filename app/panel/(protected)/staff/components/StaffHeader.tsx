"use client";

import { Button } from "@/components/ui/button";

interface StaffHeaderProps {
  onInvite: () => void;
}

export function StaffHeader({ onInvite }: StaffHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--foreground)]">
          Equipo y Permisos
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Gestiona los miembros de tu tienda, sus roles y accesos al sistema
        </p>
      </div>
      <Button
        variant="default"
        onClick={onInvite}
        className="rounded-xl shadow-sm transition-all h-10 px-6 font-bold"
      >
        Invitar al Equipo
      </Button>
    </div>
  );
}
