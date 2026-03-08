"use client";

import { useAuthStore } from "@/lib/stores/auth-store";
import { Card, Avatar } from "@heroui/react";
import { Mail, User, Shield, Info } from "lucide-react";

export default function PerfilPage() {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-[var(--muted)] text-sm animate-pulse">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full pb-12">
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-heading)] text-gradient-brand">
          Mi Perfil
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Gestiona tu información de usuario de tienda
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="bg-[var(--surface)] border border-[var(--border)] overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent)]/5 to-transparent h-24" />
            <Card.Content className="p-6 flex flex-col items-center text-center relative z-10 pt-10">
              <Avatar
                size="lg"
                className="w-24 h-24 text-large ring-4 ring-[var(--background)] bg-[var(--default)] text-[var(--foreground)] mb-4"
              >
                {user.avatar_url ? (
                  <Avatar.Image src={user.avatar_url} alt={user.username} />
                ) : null}
                <Avatar.Fallback>{user.username?.[0]?.toUpperCase() || "T"}</Avatar.Fallback>
              </Avatar>
              <h2 className="text-xl font-bold text-[var(--foreground)] mb-1">
                {user.username || "Usuario Tienda"}
              </h2>
              <p className="text-sm text-[var(--muted)] mb-4">Vendedor</p>
              <div className="flex items-center gap-2 bg-[var(--accent)]/10 text-[var(--accent)] px-3 py-1 rounded-full text-xs font-medium">
                <Shield className="w-3.5 h-3.5" />
                {user.tenant_id ? "Tienda Vinculada" : "Gestor Principal"}
              </div>
            </Card.Content>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="bg-[var(--surface)] border border-[var(--border)]">
            <Card.Content className="p-6">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-6 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-[var(--accent)]" />
                Información de la Cuenta
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 py-3 border-b border-[var(--border)]">
                  <div className="text-sm text-[var(--muted)] font-medium">Usuario</div>
                  <div className="sm:col-span-2 text-sm text-[var(--foreground)] font-medium">{user.username || "No asignado"}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 py-3 border-b border-[var(--border)]">
                  <div className="text-sm text-[var(--muted)] font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Correo
                  </div>
                  <div className="sm:col-span-2 text-sm text-[var(--foreground)]">{user.email}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 py-3 border-b border-[var(--border)]">
                  <div className="text-sm text-[var(--muted)] font-medium">ID de Tienda</div>
                  <div className="sm:col-span-2 text-sm text-[var(--muted)] font-mono text-xs">{user.tenant_id || "No asignado"}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 py-3">
                  <div className="text-sm text-[var(--muted)] font-medium">Miembro desde</div>
                  <div className="sm:col-span-2 text-sm text-[var(--muted)]">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString("es-CL") : "Desconocido"}
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card className="bg-[var(--accent)]/5 border border-[var(--accent)]/20">
            <Card.Content className="p-4 flex gap-3">
              <Info className="w-5 h-5 text-[var(--accent)] shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-[var(--foreground)] mb-1">Acerca del Perfil</h4>
                <p className="text-xs text-[var(--muted)]">
                  Actualmente la información del perfil y avatar se gestionan directamente a través de Soporte de Rankeao. Próximamente habilitaremos la edición directa.
                </p>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
}
