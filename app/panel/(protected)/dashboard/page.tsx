"use client";

import { Card, Skeleton } from "@heroui/react";
import { DollarSign, ShoppingCart, ShoppingBag, Users, PackageSearch, Ticket, Truck, TrendingUp } from "lucide-react";
import { useDashboardSummary } from "@/lib/hooks/use-dashboard";
import Link from "next/link";

const formatCurrency = (value: number | undefined) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(value || 0);

const quickLinks = [
  { label: "Productos", href: "/panel/products", icon: ShoppingBag, desc: "Gestionar catálogo" },
  { label: "Órdenes", href: "/panel/orders", icon: ShoppingCart, desc: "Ver pedidos" },
  { label: "Inventario", href: "/panel/inventory", icon: PackageSearch, desc: "Controlar stock" },
  { label: "Cupones", href: "/panel/coupons", icon: Ticket, desc: "Crear descuentos" },
  { label: "Envíos", href: "/panel/shipments", icon: Truck, desc: "Rastrear envíos" },
  { label: "Analítica", href: "/panel/analytics", icon: TrendingUp, desc: "Ver reportes" },
];

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardSummary();

  const kpis = [
    { label: "Ingresos Totales", value: formatCurrency(stats?.total_revenue), icon: DollarSign, color: "#009baf" },
    { label: "Órdenes", value: stats?.total_orders ?? 0, icon: ShoppingCart, color: "#f59e0b" },
    { label: "Productos", value: stats?.total_products ?? 0, icon: ShoppingBag, color: "#8b5cf6" },
    { label: "Clientes", value: stats?.total_customers ?? 0, icon: Users, color: "#10b981" },
  ];

  return (
    <div className="space-y-8 pt-2">
      {/* Page Title */}
      <div>
        <h1 className="text-[22px] font-bold text-[#2d3748] tracking-tight">
          Panel de Control
        </h1>
        <p className="text-[14px] text-[#64748b] mt-1">Resumen general de las operaciones de tu entorno</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="bg-white rounded-xl border border-[#e2e8f0] p-5 flex items-center gap-4 transition-all duration-200 hover:shadow-sm"
            >
              <div
                className="flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0 bg-opacity-10"
                style={{ backgroundColor: `${kpi.color}15`, color: kpi.color }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] text-[#64748b] font-medium">{kpi.label}</p>
                {isLoading ? (
                  <Skeleton className="h-7 w-24 rounded mt-1" />
                ) : (
                  <p className="text-[20px] font-bold text-[#2d3748] tracking-tight">{kpi.value}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Access */}
      <div>
        <h2 className="text-[12px] font-bold text-[#94a3b8] uppercase tracking-wider mb-4 px-1">
          Acceso rápido
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href} className="block group">
                <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 flex flex-col items-center gap-3 text-center transition-all duration-200 group-hover:border-[#009baf] group-hover:shadow-[0_4px_20px_-4px_rgba(0,155,175,0.15)] group-hover:-translate-y-0.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#f8fafc] flex items-center justify-center transition-colors duration-200 group-hover:bg-[#eff9fa]">
                    <Icon className="h-5 w-5 text-[#64748b] transition-colors duration-200 group-hover:text-[#009baf]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#2d3748] group-hover:text-[#009baf] transition-colors">{link.label}</p>
                    <p className="text-[12px] text-[#94a3b8] mt-0.5">{link.desc}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Activity placeholder */}
      <div>
        <h2 className="text-[12px] font-bold text-[#94a3b8] uppercase tracking-wider mb-4 px-1">
          Actividad reciente
        </h2>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-8 text-center flex flex-col items-center justify-center h-48 bg-gradient-to-b from-white to-[#f8fafc]">
          <p className="text-[14px] text-[#64748b] font-medium">
            No hay actividad reciente registrada
          </p>
          <p className="text-[13px] text-[#94a3b8] mt-1">
            Revisa más tarde para monitorear el pulso de tu tienda
          </p>
        </div>
      </div>
    </div>
  );
}
