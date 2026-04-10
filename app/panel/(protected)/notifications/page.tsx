"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTenantNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/lib/hooks/use-tenant";
import { getErrorMessage } from "@/lib/utils/error-message";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  const { data: notifications, isLoading } = useTenantNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const items = (notifications ?? []) as Array<{
    id: string;
    title?: string;
    message?: string;
    type?: string;
    is_read?: boolean;
    created_at?: string;
  }>;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-rajdhani)" }}>
          Notificaciones
        </h1>
        {items.length > 0 && (
          <Button
            variant="ghost"
            disabled={markAllRead.isPending}
            onClick={() => {
              markAllRead.mutateAsync()
                .then(() => toast.success("Todas marcadas como leídas"))
                .catch((e: unknown) => toast.error(getErrorMessage(e)));
            }}
          >
            Marcar todas como leídas
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Bell className="h-12 w-12 mx-auto text-[var(--c-gray-500)] mb-3 opacity-40" />
            <p className="text-[var(--c-gray-500)]">No hay notificaciones</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <Card key={n.id} className={n.is_read ? "opacity-50" : ""}>
              <CardContent>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {n.type && (
                        <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium bg-[var(--c-gray-50)] text-[var(--c-gray-500)] border-[var(--c-gray-200)]">
                          {n.type}
                        </span>
                      )}
                      {!n.is_read && (
                        <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium bg-sky-500/10 text-sky-400 border-sky-500/20">
                          Nueva
                        </span>
                      )}
                    </div>
                    {n.title && <h3 className="font-semibold">{n.title}</h3>}
                    {n.message && <p className="text-sm text-[var(--c-gray-500)]">{n.message}</p>}
                    {n.created_at && (
                      <p className="text-xs text-[var(--c-gray-500)] mt-1 opacity-60">
                        {new Date(n.created_at).toLocaleString("es-CL")}
                      </p>
                    )}
                  </div>
                  {!n.is_read && (
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={markRead.isPending}
                      onClick={() => {
                        markRead.mutateAsync(n.id)
                          .then(() => toast.success("Marcada como leída"))
                          .catch((e: unknown) => toast.error(getErrorMessage(e)));
                      }}
                    >
                      Leída
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
