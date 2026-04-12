"use client";

export function LoyaltyHeader() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--foreground)]">
          Programa de Fidelidad
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Configura cómo tus clientes acumulan y canjean puntos en tu tienda
        </p>
      </div>
    </div>
  );
}
