"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, ShoppingBag, DollarSign, Users, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface AnalyticsSummaryProps {
  stats: any;
  isLoading: boolean;
  formatCurrency: (val: number) => string;
}

export function AnalyticsSummary({ stats, isLoading, formatCurrency }: AnalyticsSummaryProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i} className="bg-[var(--card)] border-[var(--border)] rounded-[24px]">
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24 rounded mb-2" />
              <Skeleton className="h-8 w-32 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const metricCards = [
    { 
      label: "Ingresos Totales", 
      value: formatCurrency(stats?.total_revenue || 0), 
      icon: DollarSign, 
      color: "var(--brand)",
      bg: "bg-[var(--brand)]/5",
      trend: "+12.5%",
      trendUp: true
    },
    { 
      label: "Ventas Totales", 
      value: stats?.total_sales || 0, 
      icon: ShoppingBag, 
      color: "var(--brand)",
      bg: "bg-[var(--brand)]/5",
      trend: "+8.2%",
      trendUp: true
    },
    { 
      label: "Ticket Promedio", 
      value: formatCurrency(stats?.average_order_value || 0), 
      icon: TrendingUp, 
      color: "var(--brand)",
      bg: "bg-[var(--brand)]/5",
      trend: "-2.1%",
      trendUp: false
    },
    { 
      label: "Clientes Nuevos", 
      value: "124", 
      icon: Users, 
      color: "var(--brand)",
      bg: "bg-[var(--brand)]/5",
      trend: "+18.3%",
      trendUp: true
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards.map((card, i) => (
        <Card key={i} className="bg-[var(--card)] border border-[var(--surface)] rounded-[24px] shadow-sm hover:shadow-md transition-all group overflow-hidden">
          <CardContent className="p-0">
             <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                   <div className={`p-3 rounded-2xl ${card.bg} text-[${card.color}] transition-colors group-hover:bg-[var(--brand)] group-hover:text-white`}>
                      <card.icon className="h-5 w-5" />
                   </div>
                   <div className={`flex items-center gap-1 text-[11px] font-bold ${card.trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
                      {card.trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {card.trend}
                   </div>
                </div>
                <p className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-1">{card.label}</p>
                <h3 className="text-2xl font-black text-[var(--foreground)] tracking-tight">{card.value}</h3>
             </div>
             <div className="h-1 w-full bg-[var(--surface)]">
                <div 
                  className={`h-full opacity-30`} 
                  style={{ width: '70%', backgroundColor: card.color }}
                />
             </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
