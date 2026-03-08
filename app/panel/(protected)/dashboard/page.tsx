"use client";

import { Card, Skeleton } from "@heroui/react";
import { PackageSearch, ShoppingBag, ShoppingCart, Ticket } from "lucide-react";
import { useInventoryValuation } from "@/lib/hooks/use-inventory";
import Link from "next/link";

const quickLinks = [
  { label: "Productos", href: "/panel/products", icon: ShoppingBag },
  { label: "Órdenes", href: "/panel/orders", icon: ShoppingCart },
  { label: "Inventario", href: "/panel/inventory", icon: PackageSearch },
  { label: "Cupones", href: "/panel/coupons", icon: Ticket },
];

export default function DashboardPage() {
  const { data: stats, isLoading } = useInventoryValuation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-heading)] text-gradient-brand">
          Panel de Tienda
        </h1>
        <p className="text-[var(--muted)] mt-1">Resumen general de tu negocio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[var(--surface)] border border-[var(--border)]">
          <Card.Content className="p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
                <PackageSearch className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-[var(--muted)]">Total Inventario (Retail)</p>
                {isLoading ? (
                  <Skeleton className="h-7 w-24 rounded mt-1" />
                ) : (
                  <p className="text-xl font-bold text-[var(--foreground)]">
                    ${stats?.total_retail_value ?? 0}
                  </p>
                )}
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
          Acceso rápido
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <Card className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)]/30 transition-colors cursor-pointer">
                  <Card.Content className="p-4 flex items-center gap-3">
                    <Icon className="h-4 w-4 text-[var(--muted)]" />
                    <span className="text-sm text-[var(--foreground)]">{link.label}</span>
                  </Card.Content>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
