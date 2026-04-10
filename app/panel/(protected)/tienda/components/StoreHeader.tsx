"use client";

export function StoreHeader() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--c-gray-800)] tracking-tight">
          Configuración de Tu Tienda
        </h1>
        <p className="text-sm text-[var(--c-gray-500)] mt-1">
          Personaliza la identidad, horarios y reglas de negocio de tu sucursal
        </p>
      </div>
    </div>
  );
}
