"use client";

import { useAuthStore } from "@/lib/stores/auth-store";
import { useThemeStore } from "@/lib/stores/theme-store";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Menu, LogOut, User, Settings, HelpCircle, Bell, Sun, Moon, Check, Store } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_GROUPS, type NavItem } from "@/lib/constants/nav-items";
import { RankeaoLogo } from "@/components/icons/RankeaoLogo";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMyMemberships, getTenantNotifications, markAllNotificationsRead } from "@/lib/api/tenant";
import { activateTenantMembership, closePanelSession } from "@/lib/api/auth";
import { useTenantQueryScope } from "@/lib/hooks/use-tenant-query-scope";
import { useState } from "react";
import { toast } from "sonner";
import type { Membership } from "@/lib/types/auth";

interface HeaderProps {
  onMenuToggle: () => void;
}

const ROLE_LABELS: Record<string, string> = {
  OWNER: "Propietario",
  ADMIN: "Administrador",
  JUDGE: "Juez",
  CASHIER: "Cajero",
};

export function Header({ onMenuToggle }: HeaderProps) {
  const user = useAuthStore((st) => st.user);
  const { tenantId, tenantQueryKey } = useTenantQueryScope();
  const router = useRouter();
  const pathname = usePathname();
  const qc = useQueryClient();
  const [notifOpen, setNotifOpen] = useState(false);
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  const { data: memberships = [] } = useQuery({
    queryKey: ["auth", "memberships"],
    queryFn: fetchMyMemberships,
    retry: false,
    staleTime: 60_000,
  });

  const currentMembership =
    memberships.find((membership) => String(membership.tenant_id) === String(tenantId)) ?? null;

  const { data: notifications = [] } = useQuery({
    queryKey: tenantQueryKey("notifications"),
    queryFn: getTenantNotifications,
    refetchInterval: 60_000,
    retry: false,
  });

  const unreadCount = (notifications as Array<{ is_read?: boolean; read_at?: string }>).filter(
    (n) => !n.is_read && !n.read_at
  ).length;

  const markAllMut = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: tenantQueryKey("notifications") }),
  });

  const switchTenantMut = useMutation({
    mutationFn: async (membership: Membership) => {
      if (String(membership.tenant_id) === String(tenantId)) {
        return;
      }
      activateTenantMembership(membership);
      await qc.cancelQueries();
      qc.clear();
    },
    onSuccess: (_value, membership) => {
      toast.success(`Cambiado a ${membership.tenant_name}`);
      router.push("/panel/dashboard");
      router.refresh();
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "No se pudo cambiar de tienda.";
      toast.error(message);
    },
  });

  const handleLogout = async () => {
    const session = await closePanelSession();
    if (session.warning) {
      toast.warning(session.warning);
    }
    router.push("/panel/login");
  };

  const activePathGroup = NAV_GROUPS.find((g) => {
    if (g.href && (pathname === g.href || pathname.startsWith(g.href + "/"))) return true;
    if (g.sections) {
      return g.sections.some((sec) =>
        sec.items.some((item) => pathname === item.href || pathname.startsWith(item.href + "/"))
      );
    }
    return false;
  });

  const headerNavItems: NavItem[] = activePathGroup?.sections
    ? activePathGroup.sections.flatMap(sec => sec.items)
    : [];

  return (
    <header className="sticky top-0 z-50 h-14 border-b border-[var(--border)] bg-[var(--background)] flex items-center justify-between px-4 lg:px-6 shrink-0">
      <div className="flex items-center">
        <button
          className="md:hidden mr-3 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          onClick={onMenuToggle}
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center mr-4 md:mr-6">
          <RankeaoLogo className="h-6 w-auto text-[var(--foreground)]" />
        </div>
      </div>

      {headerNavItems.length > 0 && (
        <nav
          className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-0.5 rounded-full px-1 py-1"
          style={{ background: "var(--sidebar)", boxShadow: "var(--shadow-popover)", border: "1px solid var(--border)" }}
        >
          <AnimatePresence mode="popLayout">
            {headerNavItems.map((item, idx) => {
              const isItemActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <motion.button
                  key={item.href}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.1 } }}
                  transition={{ duration: 0.18, delay: idx * 0.02, ease: "easeOut" }}
                  onClick={() => router.push(item.href)}
                  className="text-[13px] font-medium transition-all px-4 py-1.5 rounded-full"
                  style={{
                    background: isItemActive ? "var(--sidebar-accent)" : "transparent",
                    color: isItemActive ? "var(--sidebar-primary)" : "var(--sidebar-foreground)",
                    fontWeight: isItemActive ? 600 : 500,
                    border: isItemActive ? "1px solid transparent" : "1px solid transparent",
                  }}
                >
                  {item.label}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </nav>
      )}

      <div className="flex items-center gap-1.5">
        {/* Help button */}
        <button
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-medium text-[var(--muted-foreground)] hover:bg-[var(--surface-secondary)] hover:text-[var(--foreground)] transition-colors"
          type="button"
        >
          <HelpCircle className="h-4 w-4" />
          <span>Ayuda</span>
        </button>

        {/* Notification bell */}
        <div className="relative">
          <button
            className="relative text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors p-1.5 rounded-lg hover:bg-[var(--surface-secondary)]"
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notificaciones"
          >
            <Bell className="h-[18px] w-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-elevated z-50 overflow-hidden"
                onMouseLeave={() => setNotifOpen(false)}
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
                  <span className="text-[13px] font-semibold text-[var(--foreground)]">Notificaciones</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllMut.mutate()}
                      className="text-[11px] text-[var(--brand)] font-medium hover:underline"
                    >
                      Marcar todas como leidas
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-[var(--separator)]">
                  {(notifications as Array<{ id: string; title?: string; message?: string; body?: string; is_read?: boolean; read_at?: string; created_at?: string }>).length === 0 ? (
                    <p className="text-center text-[12px] text-[var(--muted-foreground)] py-8">Sin notificaciones</p>
                  ) : (
                    (notifications as Array<{ id: string; title?: string; message?: string; body?: string; is_read?: boolean; read_at?: string; created_at?: string }>).map((n) => (
                      <div
                        key={n.id}
                        className={`px-4 py-3 text-[12px] ${!n.is_read && !n.read_at ? "bg-[var(--accent-subtle)]" : ""}`}
                      >
                        {n.title && <p className="font-semibold text-[var(--foreground)] mb-0.5">{n.title}</p>}
                        <p className="text-[var(--muted-foreground)]">{n.message || n.body}</p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme toggle */}
        <button
          className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors p-1.5 rounded-lg hover:bg-[var(--surface-secondary)]"
          onClick={toggleTheme}
          aria-label="Cambiar tema"
        >
          {theme === "light" ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
        </button>

        {/* Settings */}
        <button
          className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors p-1.5 rounded-lg hover:bg-[var(--surface-secondary)]"
          onClick={() => router.push("/panel/perfil")}
          aria-label="Settings"
        >
          <Settings className="h-[18px] w-[18px]" />
        </button>

        {/* User profile dropdown */}
        <div className="ml-1">
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full cursor-pointer flex border-2 border-transparent hover:border-[var(--accent)] transition-colors outline-none">
              <Avatar className="h-8 w-8">
                {user?.avatar_url && <AvatarImage src={user.avatar_url} alt="Avatar" />}
                <AvatarFallback className="bg-[var(--sidebar)] text-white text-xs font-semibold">
                  {user?.username?.[0]?.toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[256px] p-0 overflow-hidden bg-[var(--card)] border border-[var(--border)] shadow-elevated rounded-xl">
              <div className="relative">
                <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[var(--brand)] to-[var(--accent)]" />
                <div className="flex items-center gap-3 px-4 py-4 pt-5">
                  <Avatar className="ring-2 ring-[var(--border)]">
                    {user?.avatar_url && <AvatarImage src={user.avatar_url} alt="Avatar" />}
                    <AvatarFallback className="bg-[var(--sidebar)] text-white font-semibold">
                      {user?.username?.[0]?.toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <p className="text-sm font-semibold text-[var(--foreground)] truncate">{user?.username || "Usuario Admin"}</p>
                    <p className="text-[11px] text-[var(--muted-foreground)] truncate">{user?.email || "admin@rutten.cl"}</p>
                  </div>
                </div>
              </div>

              <DropdownMenuSeparator className="bg-[var(--border)] m-0" />

                <DropdownMenuGroup className="p-1.5">
                {memberships.length > 1 && (
                  <>
                    <DropdownMenuLabel className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                      Tienda activa
                    </DropdownMenuLabel>
                    {memberships.map((membership) => {
                      const isCurrent = String(membership.tenant_id) === String(tenantId);
                      return (
                        <DropdownMenuItem
                          key={membership.tenant_id}
                          disabled={switchTenantMut.isPending}
                          onClick={() => switchTenantMut.mutate(membership)}
                          className="rounded-lg hover:bg-[var(--surface-secondary)] focus:bg-[var(--surface-secondary)] cursor-pointer items-start"
                        >
                          <Store className="mr-3 h-4 w-4 text-[var(--muted-foreground)] mt-[2px]" />
                          <span className="flex flex-col gap-0.5 min-w-0">
                            <span className="text-sm text-[var(--foreground)] truncate">{membership.tenant_name}</span>
                            <span className="text-[11px] text-[var(--muted-foreground)]">
                              {ROLE_LABELS[membership.role] ?? membership.role}
                            </span>
                          </span>
                          {isCurrent && <Check className="ml-auto h-4 w-4 text-emerald-500" />}
                        </DropdownMenuItem>
                      );
                    })}
                    <DropdownMenuSeparator className="bg-[var(--border)] m-0 my-1" />
                  </>
                )}
                <DropdownMenuLabel className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Mi cuenta
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => router.push("/panel/perfil")}
                  className="rounded-lg hover:bg-[var(--surface-secondary)] focus:bg-[var(--surface-secondary)] cursor-pointer"
                >
                  <User className="mr-3 h-4 w-4 text-[var(--muted-foreground)]" />
                  <span className="text-sm text-[var(--foreground)]">Mi Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/panel/tienda")}
                  className="rounded-lg hover:bg-[var(--surface-secondary)] focus:bg-[var(--surface-secondary)] cursor-pointer"
                >
                  <Settings className="mr-3 h-4 w-4 text-[var(--muted-foreground)]" />
                  <span className="text-sm text-[var(--foreground)]">
                    {currentMembership ? `Configuración ${currentMembership.tenant_name}` : "Configuracion Tienda"}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="bg-[var(--border)] m-0" />

              <DropdownMenuGroup className="p-1.5">
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="rounded-lg hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer text-[var(--danger)] hover:text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span className="text-sm font-medium">Cerrar Sesion</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
