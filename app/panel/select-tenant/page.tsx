"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ArrowLeft, Building2, Check, Loader2 } from "lucide-react";
import type { Membership } from "@/lib/types/auth";
import { useAuthStore } from "@/lib/stores/auth-store";
import {
  activateTenantMembership,
  closePanelSession,
  resolvePanelRedirect,
} from "@/lib/api/auth";
import { fetchMyMemberships, fetchMyPendingInvitations } from "@/lib/api/tenant";

const ROLE_LABELS: Record<string, string> = {
  OWNER: "Propietario",
  ADMIN: "Administrador",
  JUDGE: "Juez",
  CASHIER: "Cajero",
};

export default function SelectTenantPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectingTenant, setSelectingTenant] = useState<number | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const redirectPath = useMemo(
    () => resolvePanelRedirect(searchParams.get("redirect")),
    [searchParams]
  );

  const loadMemberships = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchMyMemberships();
      if (!data || data.length === 0) {
        const invitations = await fetchMyPendingInvitations();
        if (invitations.length > 0) {
          router.replace("/panel/invitations");
          return;
        }

        const session = await closePanelSession();
        if (session.warning) {
          toast.warning(session.warning);
        }
        toast.error("No tienes tiendas asociadas. Solicita una tienda primero.");
        router.replace("/panel/login");
        return;
      }

      if (data.length === 1) {
        activateTenantMembership(data[0]);
        toast.success(`Bienvenido al panel de ${data[0].tenant_name}!`);
        router.replace(redirectPath);
        return;
      }

      setMemberships(data);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error al cargar tus tiendas";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [redirectPath, router]);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!isAuthenticated()) {
      router.replace("/panel/login");
      return;
    }

    if (user?.tenant_id) {
      router.replace(redirectPath);
      return;
    }

    void loadMemberships();
  }, [hasHydrated, isAuthenticated, loadMemberships, redirectPath, router, user?.tenant_id]);

  async function handleSelect(membership: Membership) {
    setSelectingTenant(membership.tenant_id);
    try {
      activateTenantMembership(membership);
      toast.success(`Entrando a ${membership.tenant_name}`);
      router.push(redirectPath);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "No se pudo seleccionar la tienda";
      toast.error(message);
    } finally {
      setSelectingTenant(null);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    try {
      const session = await closePanelSession();
      if (session.warning) {
        toast.warning(session.warning);
      }
      router.push("/panel/login");
    } finally {
      setLoggingOut(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 bg-[var(--background)]">
        <div className="w-full max-w-2xl space-y-4">
          <Skeleton className="h-8 w-56 rounded-lg mx-auto" />
          <Skeleton className="h-4 w-80 rounded-lg mx-auto" />
          <Card className="bg-[var(--card)] border border-[var(--border)]">
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-[var(--background)]">
      <div className="w-full max-w-2xl space-y-5">
        <Card className="bg-[var(--card)] border border-[var(--border)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Selecciona tu tienda</CardTitle>
            <p className="text-sm text-[var(--muted-foreground)]">
              Tienes acceso a múltiples tiendas. Elige cuál quieres administrar ahora.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {memberships.map((membership) => {
              const isSelecting = selectingTenant === membership.tenant_id;
              return (
                <button
                  key={membership.tenant_id}
                  type="button"
                  onClick={() => handleSelect(membership)}
                  disabled={selectingTenant !== null}
                  className="w-full rounded-xl border border-[var(--border)] px-4 py-3 text-left transition hover:border-[var(--brand)] hover:bg-[var(--surface-secondary)] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border)] flex items-center justify-center text-sm font-semibold">
                      {membership.tenant_name ? membership.tenant_name.slice(0, 1).toUpperCase() : <Building2 className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[var(--foreground)] truncate">{membership.tenant_name}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        Rol: {ROLE_LABELS[membership.role] ?? membership.role}
                      </p>
                    </div>
                    <div className="text-[var(--muted-foreground)]">
                      {isSelecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <div className="text-center">
          <Button variant="secondary" onClick={handleLogout} disabled={loggingOut}>
            {loggingOut ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ArrowLeft className="h-4 w-4 mr-2" />}
            Cerrar sesión
          </Button>
        </div>
      </div>
    </div>
  );
}
