"use client";

export function SubscriptionHeader() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--c-gray-800)]">
          Mi Suscripción
        </h1>
        <p className="text-sm text-[var(--c-gray-500)] mt-1">
          Gestiona tu plan, métodos de pago e historial de facturación
        </p>
      </div>
    </div>
  );
}
