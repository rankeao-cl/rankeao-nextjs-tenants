"use client";

import { useAuthStore } from "@/lib/stores/auth-store";
import { Card, Avatar, Tabs, Skeleton } from "@heroui/react";
import { Mail, User, Shield, Info, Store, Clock, Share2, CreditCard } from "lucide-react";
import { StoreConfig } from "./components/StoreConfig";
import { SchedulesConfig } from "./components/SchedulesConfig";
import { SocialLinksConfig } from "./components/SocialLinksConfig";
import { PaymentMethodsConfig } from "./components/PaymentMethodsConfig";
import { ProfileCompleteness } from "./components/ProfileCompleteness";

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
    <div className="space-y-6 max-w-5xl mx-auto w-full pb-12">
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--foreground)]">
          Mi Perfil & Tienda
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Gestiona tu información de usuario y la configuración de tu tienda
        </p>
      </div>

      <ProfileCompleteness />

      <Tabs className="w-full">
        <Tabs.ListContainer>
          <Tabs.List
            aria-label="Opciones de configuración"
            className="gap-2 w-full flex bg-[var(--surface-sunken)] border border-[var(--border)] p-1.5 rounded-full overflow-x-auto scrollbar-hide"
          >
            <Tabs.Tab id="account" className="relative max-w-fit px-4 h-10 flex items-center gap-2 text-sm font-medium text-[var(--muted)] data-[selected=true]:text-[var(--foreground)] transition-colors z-10">
              <User className="w-4 h-4" />
              <span>Mi Cuenta</span>
              <Tabs.Indicator className="absolute inset-0 w-full h-full border border-[var(--primary)] rounded-full pointer-events-none" />
            </Tabs.Tab>
            <Tabs.Tab id="store" className="relative max-w-fit px-4 h-10 flex items-center gap-2 text-sm font-medium text-[var(--muted)] data-[selected=true]:text-[var(--foreground)] transition-colors z-10">
              <Store className="w-4 h-4" />
              <span>Datos de Tienda</span>
              <Tabs.Indicator className="absolute inset-0 w-full h-full border border-[var(--primary)] rounded-full pointer-events-none" />
            </Tabs.Tab>
            <Tabs.Tab id="schedules" className="relative max-w-fit px-4 h-10 flex items-center gap-2 text-sm font-medium text-[var(--muted)] data-[selected=true]:text-[var(--foreground)] transition-colors z-10">
              <Clock className="w-4 h-4" />
              <span>Horarios</span>
              <Tabs.Indicator className="absolute inset-0 w-full h-full border border-[var(--primary)] rounded-full pointer-events-none" />
            </Tabs.Tab>
            <Tabs.Tab id="social" className="relative max-w-fit px-4 h-10 flex items-center gap-2 text-sm font-medium text-[var(--muted)] data-[selected=true]:text-[var(--foreground)] transition-colors z-10">
              <Share2 className="w-4 h-4" />
              <span>Redes</span>
              <Tabs.Indicator className="absolute inset-0 w-full h-full border border-[var(--primary)] rounded-full pointer-events-none" />
            </Tabs.Tab>
            <Tabs.Tab id="payments" className="relative max-w-fit px-4 h-10 flex items-center gap-2 text-sm font-medium text-[var(--muted)] data-[selected=true]:text-[var(--foreground)] transition-colors z-10">
              <CreditCard className="w-4 h-4" />
              <span>Métodos de Pago</span>
              <Tabs.Indicator className="absolute inset-0 w-full h-full border border-[var(--primary)] rounded-full pointer-events-none" />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>

        <Tabs.Panel id="account" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
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
        </Tabs.Panel>

        <Tabs.Panel id="store" className="pt-6">
          <StoreConfig />
        </Tabs.Panel>

        <Tabs.Panel id="schedules" className="pt-6">
          <SchedulesConfig />
        </Tabs.Panel>

        <Tabs.Panel id="social" className="pt-6">
          <SocialLinksConfig />
        </Tabs.Panel>

        <Tabs.Panel id="payments" className="pt-6">
          <PaymentMethodsConfig />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
