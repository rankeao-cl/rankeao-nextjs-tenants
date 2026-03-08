import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  PackageSearch,
  Ticket,
  Code2,
  User,
  Users,
  Heart,
  Receipt,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavDivider {
  type: "divider";
  label: string;
}

export type NavEntry = NavItem | NavDivider;

export const NAV_ITEMS: NavEntry[] = [
  { label: "Panel principal", href: "/panel/dashboard", icon: LayoutDashboard },
  { label: "Perfil", href: "/panel/perfil", icon: User },
  { type: "divider", label: "Gestión" },
  { label: "Productos", href: "/panel/products", icon: ShoppingBag },
  { label: "Órdenes", href: "/panel/orders", icon: ShoppingCart },
  { label: "Inventario", href: "/panel/inventory", icon: PackageSearch },
  { type: "divider", label: "Marketing" },
  { label: "Cupones", href: "/panel/coupons", icon: Ticket },
  { label: "Fidelidad", href: "/panel/loyalty", icon: Heart },
  { type: "divider", label: "Finanzas" },
  { label: "Gastos", href: "/panel/expenses", icon: Receipt },
  { label: "Analítica", href: "/panel/analytics", icon: BarChart3 },
  { type: "divider", label: "Equipo" },
  { label: "Staff", href: "/panel/staff", icon: Users },
  { type: "divider", label: "Desarrollo" },
  { label: "API Explorer", href: "/panel/api-explorer", icon: Code2 },
];
