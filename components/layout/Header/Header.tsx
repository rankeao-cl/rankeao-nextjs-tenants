"use client";

import { useAuthStore } from "@/lib/stores/auth-store";
import { useTheme } from "@/lib/hooks/use-theme";
import { usePathname, useRouter } from "next/navigation";
import {
  Dropdown,
  DropdownTrigger,
  DropdownPopover,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Button,
} from "@heroui/react";
import { Menu, LogOut, User, Sun, Moon } from "lucide-react";
import s from "./styles/Header.module.css";

const labelMap: Record<string, string> = {
  dashboard: "Panel",
  perfil: "Perfil",
  products: "Productos",
  orders: "Órdenes",
  coupons: "Cupones",
  inventory: "Inventario",
  staff: "Equipo",
  loyalty: "Fidelidad",
  expenses: "Gastos",
  analytics: "Analítica",
  "api-explorer": "API Explorer",
};

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const user = useAuthStore((st) => st.user);
  const logout = useAuthStore((st) => st.logout);
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const panelSegments = segments[0] === "panel" ? segments.slice(1) : segments;

  const handleLogout = () => {
    logout();
    router.push("/panel/login");
  };

  return (
    <header className={s.header}>
      <div className="flex items-center gap-3">
        <Button
          isIconOnly
          variant="secondary"
          className="md:hidden text-[var(--muted)]"
          onPress={onMenuToggle}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold font-[var(--font-heading)] hidden md:block text-[var(--foreground)] capitalize tracking-tight">
          {panelSegments.length > 0 ? (labelMap[panelSegments[0]] || panelSegments[0]) : "Panel"}
        </h1>
      </div>

      <div className={s.actions}>
        <Button
          isIconOnly
          variant="secondary"
          size="sm"
          onPress={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="text-[var(--muted)] hover:text-[var(--foreground)]"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <Dropdown>
          <DropdownTrigger className={s.userTrigger}>
            <Avatar size="sm" className="h-8 w-8 bg-[var(--default)] text-[var(--foreground)]">
              {user?.avatar_url ? (
                <Avatar.Image src={user.avatar_url} alt={user?.username || "Tienda"} />
              ) : null}
              <Avatar.Fallback>{user?.username?.[0]?.toUpperCase() || "T"}</Avatar.Fallback>
            </Avatar>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-medium text-[var(--foreground)]">
                {user?.username || "Tienda"}
              </span>
              <span className="text-[11px] text-[var(--muted)]">{user?.email}</span>
            </div>
          </DropdownTrigger>
          <DropdownPopover placement="bottom end">
            <DropdownMenu
              aria-label="User menu"
              className="bg-[var(--overlay)] border border-[var(--border)]"
            >
              <DropdownItem
                key="profile"
                className="text-[var(--foreground)]"
                onPress={() => router.push("/panel/perfil")}
              >
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Perfil
                </span>
              </DropdownItem>
              <DropdownItem
                key="logout"
                className="text-[var(--foreground)]"
                onPress={handleLogout}
              >
                <span className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </span>
              </DropdownItem>
            </DropdownMenu>
          </DropdownPopover>
        </Dropdown>
      </div>
    </header>
  );
}
