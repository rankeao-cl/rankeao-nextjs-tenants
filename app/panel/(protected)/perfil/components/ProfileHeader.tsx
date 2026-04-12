"use client";

export function ProfileHeader() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--foreground)] tracking-tight">
          Mi Perfil y Configuración
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Gestiona tu información personal, seguridad y preferencias del sistema
        </p>
      </div>
    </div>
  );
}
