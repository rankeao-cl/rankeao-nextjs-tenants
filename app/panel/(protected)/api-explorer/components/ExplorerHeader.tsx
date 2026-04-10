"use client";

import { Terminal } from "lucide-react";

export function ExplorerHeader() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-[var(--c-navy-500)] text-white shadow-lg shadow-[var(--c-navy-500)]/20">
          <Terminal className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--c-gray-800)] tracking-tight">
            API Explorer
          </h1>
          <p className="text-sm text-[var(--c-gray-500)] mt-1 font-medium">
            Entorno de pruebas interactivo para la Panel API v1
          </p>
        </div>
      </div>
    </div>
  );
}
