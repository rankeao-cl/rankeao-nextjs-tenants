"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Skeleton, toast } from "@heroui/react";
import { Check, X, Store, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import {
  fetchMyPendingInvitations,
  fetchMyMemberships,
  acceptInvitation,
  declineInvitation,
  type PendingInvitation,
} from "@/lib/api/tenant";

const ROLE_LABELS: Record<string, string> = {
  OWNER: "Propietario",
  ADMIN: "Administrador",
  JUDGE: "Juez",
  CASHIER: "Cajero",
};

export default function InvitationsPage() {
  const router = useRouter();
  const [invitations, setInvitations] = useState<PendingInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/panel/login");
      return;
    }
    loadInvitations();
  }, []);

  async function loadInvitations() {
    try {
      const data = await fetchMyPendingInvitations();
      setInvitations(data);
    } catch {
      toast.danger("Error al cargar invitaciones");
    } finally {
      setLoading(false);
    }
  }

  async function handleAccept(id: number) {
    setProcessing(id);
    try {
      await acceptInvitation(id);
      toast.success("Invitacion aceptada");

      // Re-fetch memberships and redirect to dashboard
      const memberships = await fetchMyMemberships();
      if (memberships && memberships.length > 0) {
        const membership = memberships[0];
        const currentAuth = useAuthStore.getState();
        useAuthStore.getState().setAuth({
          access_token: currentAuth.accessToken!,
          refresh_token: currentAuth.refreshToken!,
          expires_in: Math.floor(((currentAuth.expiresAt || 0) - Date.now()) / 1000),
          user: {
            ...currentAuth.user!,
            tenant_id: String(membership.tenant_id),
          },
        });
        router.push("/panel/dashboard");
      } else {
        // Remove accepted invitation from list
        setInvitations((prev) => prev.filter((inv) => inv.id !== id));
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al aceptar";
      toast.danger(message);
    } finally {
      setProcessing(null);
    }
  }

  async function handleDecline(id: number) {
    setProcessing(id);
    try {
      await declineInvitation(id);
      toast.info("Invitacion rechazada");
      setInvitations((prev) => prev.filter((inv) => inv.id !== id));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al rechazar";
      toast.danger(message);
    } finally {
      setProcessing(null);
    }
  }

  function handleLogout() {
    useAuthStore.getState().logout();
    router.push("/panel/login");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 bg-[var(--background)]">
        <div className="w-full max-w-lg space-y-6">
          <div className="text-center space-y-2 flex flex-col items-center">
            <Skeleton className="h-8 w-64 rounded-lg" />
            <Skeleton className="h-4 w-80 rounded-lg" />
          </div>
          <Card className="bg-[var(--surface)]/90 border border-white/20">
            <Card.Content className="p-6">
              <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-48 rounded" />
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-3 w-40 rounded" />
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <Skeleton className="h-10 flex-1 rounded-lg" />
                <Skeleton className="h-10 flex-1 rounded-lg" />
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-[var(--background)]">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-white/10 blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-zinc-300/8 blur-[120px]" />
      </div>

      <div className="w-full max-w-lg relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-[var(--font-heading)] text-2xl font-bold text-[var(--foreground)]">
            Invitaciones Pendientes
          </h1>
          <p className="text-sm text-[var(--muted)]">
            Tienes invitaciones para unirte a las siguientes tiendas
          </p>
        </div>

        {invitations.length === 0 ? (
          <Card className="bg-[var(--surface)]/90 border border-white/20 backdrop-blur-xl">
            <Card.Content className="p-8 text-center space-y-4">
              <p className="text-[var(--muted)]">No tienes invitaciones pendientes.</p>
              <Button variant="tertiary" onPress={handleLogout}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al login
              </Button>
            </Card.Content>
          </Card>
        ) : (
          <>
            {invitations.map((inv) => (
              <Card
                key={inv.id}
                className="bg-[var(--surface)]/90 border border-white/20 backdrop-blur-xl"
              >
                <Card.Content className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/5">
                      {inv.tenant_logo_url ? (
                        <img src={inv.tenant_logo_url} alt="" className="h-8 w-8 rounded-lg object-cover" />
                      ) : (
                        <Store className="h-6 w-6 text-[var(--muted)]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="font-semibold text-[var(--foreground)] text-lg">
                        {inv.tenant_name}
                      </h3>
                      <p className="text-sm text-[var(--muted)]">
                        Rol: <span className="text-[var(--foreground)] font-medium">{ROLE_LABELS[inv.role] || inv.role}</span>
                      </p>
                      {inv.invited_by_username && (
                        <p className="text-xs text-[var(--muted)]">
                          Invitado por @{inv.invited_by_username}
                        </p>
                      )}
                      {inv.message && (
                        <p className="text-sm text-[var(--muted)] italic mt-2">&quot;{inv.message}&quot;</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-5">
                    <Button
                      variant="primary"
                      className="flex-1"
                      isPending={processing === inv.id}
                      onPress={() => handleAccept(inv.id)}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Aceptar
                    </Button>
                    <Button
                      variant="danger"
                      className="flex-1"
                      isPending={processing === inv.id}
                      onPress={() => handleDecline(inv.id)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Rechazar
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            ))}

            <div className="text-center">
              <Button variant="tertiary" className="text-[var(--muted)]" onPress={handleLogout}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cerrar sesión
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
