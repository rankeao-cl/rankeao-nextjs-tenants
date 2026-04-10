"use client";

export function AnalyticsHeader() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--c-gray-800)]">
          Analítica de Negocio
        </h1>
        <p className="text-sm text-[var(--c-gray-500)] mt-1">
          Visualiza el rendimiento, ventas y métricas clave de tu tienda en tiempo real
        </p>
      </div>
    </div>
  );
}
