"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, ShoppingCart, ShoppingBag, Users } from "lucide-react";

interface DashboardStatsProps {
  stats: any;
  isLoading: boolean;
}

const formatCurrency = (value: number | undefined) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(value || 0);

export function DashboardStats({ stats, isLoading }: DashboardStatsProps) {
  const kpis = [
    { 
      label: "Ingresos Totales", 
      value: formatCurrency(stats?.total_revenue), 
      icon: DollarSign, 
      color: "text-[var(--c-navy-500)]", 
      bg: "bg-[var(--c-navy-50)]",
      description: "Ventas del periodo actual"
    },
    { 
      label: "Órdenes", 
      value: stats?.total_orders ?? 0, 
      icon: ShoppingCart, 
      color: "text-amber-600", 
      bg: "bg-amber-50",
      description: "Pedidos procesados"
    },
    { 
      label: "Productos", 
      value: stats?.total_products ?? 0, 
      icon: ShoppingBag, 
      color: "text-indigo-600", 
      bg: "bg-indigo-50",
      description: "Items en catálogo"
    },
    { 
      label: "Clientes", 
      value: stats?.total_customers ?? 0, 
      icon: Users, 
      color: "text-emerald-600", 
      bg: "bg-emerald-50" ,
      description: "Usuarios registrados"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.label}
            className="bg-white rounded-2xl border border-[var(--c-gray-200)] p-5 transition-all duration-200 hover:shadow-sm hover:border-[var(--c-gray-300)] group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${kpi.bg} ${kpi.color} transition-colors duration-200 group-hover:scale-110 transform`}>
                <Icon className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-bold text-[var(--c-gray-400)] uppercase tracking-widest">KPI</span>
            </div>
            <div className="min-w-0">
              <p className="text-[12px] text-[var(--c-gray-500)] font-semibold mb-1 uppercase tracking-tight">{kpi.label}</p>
              {isLoading ? (
                <Skeleton className="h-8 w-28 rounded-lg mt-1" />
              ) : (
                <p className="text-[24px] font-extrabold text-[var(--c-gray-800)] tracking-tight leading-none">{kpi.value}</p>
              )}
              <p className="text-[11px] text-[var(--c-gray-400)] mt-2 font-medium">{kpi.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
