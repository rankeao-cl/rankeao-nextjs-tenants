import {
  LayoutDashboard,
  ShoppingCart,
  ShoppingBag,
  Ticket,
  User,
  Users,
  Heart,
  BarChart3,
  Truck,
  Settings,
  Store,
  Tag,
  PieChart,
  Trophy,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export interface NavMainGroup {
  label: string;
  icon: LucideIcon;
  href?: string;
  sections?: NavSection[];
}

export const NAV_GROUPS: NavMainGroup[] = [
  {
    label: "Acceso",
    icon: LayoutDashboard,
    href: "/panel/dashboard",
  },
  {
    label: "Ventas",
    icon: ShoppingCart,
    sections: [
      {
        title: "Transacciones",
        items: [
          { label: "Todas las órdenes", href: "/panel/orders" },
          { label: "Suscripciones", href: "/panel/subscriptions" },
        ],
      },
      {
        title: "Logística",
        items: [
          { label: "Envíos", href: "/panel/shipments" },
        ],
      },
    ],
  },
  {
    label: "Productos",
    icon: ShoppingBag,
    sections: [
      {
        title: "Catálogo",
        items: [
          { label: "Lista de productos", href: "/panel/products" },
        ],
      },
      {
        title: "Inventario",
        items: [
          { label: "Gestión de Stock", href: "/panel/inventory" },
        ],
      },
    ],
  },
  {
    label: "Clientes",
    icon: Users,
    sections: [
      {
        title: "Gestión de clientes",
        items: [
          { label: "Directorio", href: "/panel/customers" },
        ],
      },
    ],
  },
  {
    label: "Marketing",
    icon: Ticket,
    sections: [
      {
        title: "Promociones",
        items: [
          { label: "Cupones", href: "/panel/coupons" },
          { label: "Plan de Lealtad", href: "/panel/loyalty" },
        ],
      },
      {
        title: "Campañas",
        items: [
          { label: "Eventos Especiales", href: "/panel/events" },
        ],
      },
    ],
  },
  {
    label: "Torneos",
    icon: Trophy,
    sections: [
      {
        title: "Gestión",
        items: [
          { label: "Mis Torneos", href: "/panel/torneos" },
          { label: "Nuevo Torneo", href: "/panel/torneos/nuevo" },
        ],
      },
    ],
  },
  {
    label: "Reportes",
    icon: PieChart,
    sections: [
      {
        title: "Análisis",
        items: [
          { label: "Analítica general", href: "/panel/analytics" },
        ],
      },
      {
        title: "Registro",
        items: [
          { label: "Control de Gastos", href: "/panel/expenses" },
        ],
      },
    ],
  },
  {
    label: "Ajustes",
    icon: Settings,
    sections: [
      {
        title: "Cuenta y Sistema",
        items: [
          { label: "Mi Perfil", href: "/panel/perfil" },
          { label: "Configuración Tienda", href: "/panel/tienda" },
          { label: "Staff", href: "/panel/staff" },
          { label: "API y Devs", href: "/panel/api-explorer" },
        ],
      },
    ],
  },
];
