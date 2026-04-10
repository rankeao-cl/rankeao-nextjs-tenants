"use client";

import Link from "next/link";
import { ShoppingBag, ShoppingCart, PackageSearch, Ticket, Truck, TrendingUp, ArrowUpRight } from "lucide-react";

const quickLinks = [
  { label: "Productos", href: "/panel/products", icon: ShoppingBag, desc: "Catálogo completo" },
  { label: "Órdenes", href: "/panel/orders", icon: ShoppingCart, desc: "Pedidos y ventas" },
  { label: "Inventario", href: "/panel/inventory", icon: PackageSearch, desc: "Stock y alertas" },
  { label: "Cupones", href: "/panel/coupons", icon: Ticket, desc: "Promociones" },
  { label: "Envíos", href: "/panel/shipments", icon: Truck, desc: "Logística" },
  { label: "Analítica", href: "/panel/analytics", icon: TrendingUp, desc: "Rendimiento" },
];

export function QuickAccess() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[12px] font-bold text-[var(--c-gray-400)] uppercase tracking-widest px-1">
          Acceso Directo
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href} className="group">
              <div className="h-full bg-white rounded-2xl border border-[var(--c-gray-200)] p-5 flex flex-col items-start gap-4 transition-all duration-300 hover:border-[var(--c-cyan-500)] hover:shadow-md hover:-translate-y-1 relative overflow-hidden">
                {/* Subtle background decoration */}
                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4 text-[var(--c-cyan-500)]" />
                </div>
                
                <div className="w-12 h-12 rounded-xl bg-[var(--c-gray-50)] flex items-center justify-center transition-colors duration-300 group-hover:bg-[var(--c-cyan-50)] group-hover:text-[var(--c-cyan-600)] shadow-inner">
                  <Icon className="h-5 w-5 text-[var(--c-gray-400)] group-hover:text-[var(--c-cyan-600)] transition-colors duration-300" />
                </div>
                
                <div>
                  <p className="text-[14px] font-bold text-[var(--c-gray-800)] group-hover:text-[var(--c-cyan-700)] transition-colors">{link.label}</p>
                  <p className="text-[11px] text-[var(--c-gray-400)] mt-1 font-medium leading-tight">{link.desc}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
