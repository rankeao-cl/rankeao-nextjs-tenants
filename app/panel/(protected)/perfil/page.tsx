"use client";

import { useAuthStore } from "@/lib/stores/auth-store";
import { Card, Avatar, Skeleton } from "@heroui/react";
import { User, Shield, Info } from "lucide-react";

export default function PerfilPage() {
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  if (!hasHydrated || !user) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto w-full pb-12">
        <div>
          <Skeleton className="h-8 w-48 rounded-lg mb-2" />
          <Skeleton className="h-4 w-3/4 max-w-md rounded-lg" />
        </div>

        <div className="flex gap-6 border-b border-divider h-12 items-center">
          <Skeleton className="h-5 w-24 rounded-lg" />
          <Skeleton className="h-5 w-32 rounded-lg" />
          <Skeleton className="h-5 w-24 rounded-lg" />
          <Skeleton className="h-5 w-24 rounded-lg" />
          <Skeleton className="h-5 w-32 rounded-lg" />
        </div>

        <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card className="bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
              <Card.Content className="p-6 flex flex-col items-center pt-10">
                <Skeleton className="w-24 h-24 rounded-full mb-4" />
                <Skeleton className="h-6 w-32 rounded-lg mb-2" />
                <Skeleton className="h-4 w-20 rounded-lg mb-4" />
                <Skeleton className="h-6 w-32 rounded-full" />
              </Card.Content>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Card className="bg-[var(--surface)] border border-[var(--border)]">
              <Card.Content className="p-6">
                <Skeleton className="h-5 w-48 rounded-lg mb-6" />
                <div className="space-y-4">
                  <div className="py-2 border-b border-[var(--border)]">
                    <Skeleton className="h-5 w-full rounded-lg" />
                  </div>
                  <div className="py-2 border-b border-[var(--border)]">
                    <Skeleton className="h-5 w-full rounded-lg" />
                  </div>
                  <div className="py-2 border-b border-[var(--border)]">
                    <Skeleton className="h-5 w-full rounded-lg" />
                  </div>
                  <div className="py-2">
                    <Skeleton className="h-5 w-full rounded-lg" />
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full pb-12 pt-2">
      <div>
        <h1 className="text-[22px] font-bold text-[#2d3748] tracking-tight">
          Mi Perfil
        </h1>
        <p className="text-[14px] text-[#64748b] mt-1">
          Gestiona tu información de usuario y credenciales del entorno
        </p>
      </div>

      <div className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column Avatar Card */}
          <div className="md:col-span-1 space-y-6">
            <Card className="bg-white border border-[#e2e8f0] shadow-sm overflow-hidden flex flex-col">
              <div className="h-24 bg-gradient-to-br from-[#eff9fa] to-[#e2f6f8] w-full" />
              <Card.Content className="p-6 flex flex-col items-center text-center -mt-12 relative z-10">
                <Avatar
                  size="lg"
                  className="w-24 h-24 text-large ring-4 ring-white bg-[#009baf] text-white shadow-sm mb-4"
                >
                  {user.avatar_url ? (
                    <Avatar.Image src={user.avatar_url} alt={user.username} />
                  ) : null}
                  <Avatar.Fallback>{user.username?.[0]?.toUpperCase() || "AD"}</Avatar.Fallback>
                </Avatar>
                <h2 className="text-[18px] font-bold text-[#2d3748] mb-1">
                  {user.username || "Usuario Administrador"}
                </h2>
                <p className="text-[13px] text-[#64748b] mb-4">Administrador / Configuración</p>
                
                <div className="flex w-full items-center justify-center gap-2 bg-[#eff9fa] text-[#009baf] px-3 py-1.5 rounded-full text-[12px] font-semibold border border-[#e2f6f8]">
                  <Shield className="w-3.5 h-3.5" />
                  {user.tenant_id ? "Tienda Vinculada" : "Gestor Global"}
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Right Column Details */}
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-white border border-[#e2e8f0] shadow-sm">
              <Card.Content className="p-6">
                <h3 className="text-[13px] font-bold text-[#64748b] mb-6 uppercase tracking-wider flex items-center gap-2 pb-4 border-b border-[#f1f5f9]">
                  <User className="w-4 h-4 text-[#009baf]" />
                  Información de la Cuenta
                </h3>
                <div className="space-y-1">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 py-3 px-3 hover:bg-[#f8fafc] rounded-lg transition-colors">
                    <div className="text-[14px] text-[#64748b] font-medium flex items-center">Nombre de Usuario</div>
                    <div className="sm:col-span-2 text-[14px] text-[#2d3748] font-semibold">{user.username || "No asignado"}</div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 py-3 px-3 hover:bg-[#f8fafc] rounded-lg transition-colors">
                    <div className="text-[14px] text-[#64748b] font-medium flex items-center gap-2">
                       Correo
                    </div>
                    <div className="sm:col-span-2 text-[14px] text-[#2d3748] font-medium">{user.email}</div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 py-3 px-3 hover:bg-[#f8fafc] rounded-lg transition-colors">
                    <div className="text-[14px] text-[#64748b] font-medium flex items-center">ID de Arrendatario</div>
                    <div className="sm:col-span-2 text-[13px] text-[#94a3b8] font-mono tracking-wide">{user.tenant_id || "No asignado (Global)"}</div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 py-3 px-3 hover:bg-[#f8fafc] rounded-lg transition-colors">
                    <div className="text-[14px] text-[#64748b] font-medium flex items-center">Miembro desde</div>
                    <div className="sm:col-span-2 text-[14px] text-[#64748b]">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString("es-CL") : "Fecha desconocida"}
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>

            {/* Info Block */}
            <Card className="bg-[#eff9fa] border border-[#e2f6f8] shadow-none">
              <Card.Content className="p-4 flex gap-4">
                <div className="mt-0.5">
                  <Info className="w-5 h-5 text-[#009baf]" />
                </div>
                <div>
                  <h4 className="text-[14px] font-semibold text-[#009baf] mb-1">Nota sobre tu perfil</h4>
                  <p className="text-[13px] text-[#475569] leading-relaxed">
                    La edición directa del avatar y las credenciales clave se encuentra en beta cerrada. Por el momento, la modificación estructural del perfil base se realiza desde Soporte Técnico, mientras que aquí podrás administrar la lógica de toda tu operativa comercial.
                  </p>
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
