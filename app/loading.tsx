"use client";

import { Loader2 } from "lucide-react";

export default function AppLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--c-gray-50)]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--c-navy-500)]" />
        <p className="text-sm text-[var(--c-gray-400)]">Cargando...</p>
      </div>
    </div>
  );
}

