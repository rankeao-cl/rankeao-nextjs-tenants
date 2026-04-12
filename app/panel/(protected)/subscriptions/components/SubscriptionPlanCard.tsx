"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Zap, Shield, Rocket } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  is_popular?: boolean;
}

interface SubscriptionPlanCardProps {
  plan: Plan;
  isCurrent: boolean;
  onSelect: (id: string) => void;
  formatCurrency: (val: number) => string;
}

const getPlanIcon = (id: string) => {
  switch (id) {
    case "free": return <Shield className="h-5 w-5" />;
    case "starter": return <Zap className="h-5 w-5" />;
    case "pro": return <Rocket className="h-5 w-5" />;
    default: return <Shield className="h-5 w-5" />;
  }
};

const getPlanGradient = (id: string) => {
  switch (id) {
    case "pro": return "from-[var(--brand-hover)] to-[var(--brand)] text-white";
    case "starter": return "from-[var(--card)] to-[var(--surface)] text-[var(--foreground)]";
    default: return "from-[var(--card)] to-[var(--card)] text-[var(--foreground)]";
  }
};

export function SubscriptionPlanCard({ 
  plan, 
  isCurrent, 
  onSelect, 
  formatCurrency 
}: SubscriptionPlanCardProps) {
  const isPremium = plan.id === "pro";

  return (
    <Card 
      className={`relative overflow-hidden rounded-[24px] border transition-all duration-300 ${
        isCurrent 
          ? "border-[var(--brand)] shadow-xl ring-1 ring-[var(--brand)]/20 scale-[1.02] z-10" 
          : "border-[var(--border)] hover:border-[var(--brand)] hover:shadow-lg"
      }`}
    >
      <div className={`h-full bg-gradient-to-br ${getPlanGradient(plan.id)}`}>
        <CardContent className="p-8 flex flex-col h-full">
          <div className="flex items-start justify-between mb-6">
            <div className={`p-3 rounded-2xl ${isPremium ? 'bg-[var(--card)]/10 text-white' : 'bg-[var(--brand)]/10 text-[var(--brand)]'}`}>
              {getPlanIcon(plan.id)}
            </div>
            {plan.is_popular && !isCurrent && (
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[var(--brand)] text-white shadow-sm">
                Más Popular
              </span>
            )}
            {isCurrent && (
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${isPremium ? 'bg-[var(--card)]/20 text-white' : 'bg-emerald-500 text-white animate-pulse shadow-sm'}`}>
                Plan Actual
              </span>
            )}
          </div>

          <h3 className={`text-xl font-extrabold tracking-tight mb-2 ${isPremium ? 'text-white' : 'text-[var(--foreground)]'}`}>
            {plan.name}
          </h3>
          
          <div className="mb-8 flex items-baseline gap-1">
            <span className={`text-3xl font-black ${isPremium ? 'text-white' : 'text-[var(--brand)]'}`}>
              {plan.price === 0 ? "Gratis" : formatCurrency(plan.price)}
            </span>
            {plan.price > 0 && <span className={`text-xs font-bold ${isPremium ? 'text-white/60' : 'text-[var(--muted-foreground)]'}`}>/ mes</span>}
          </div>

          <div className="space-y-4 flex-grow mb-8">
            <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isPremium ? 'text-[var(--brand)]' : 'text-[var(--muted-foreground)]'}`}>
              Incluye:
            </p>
            <ul className="space-y-3">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className={`p-1 rounded-full ${isPremium ? 'bg-[var(--brand)]/20 text-[var(--brand)]' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </div>
                  <span className={`text-[13px] font-medium leading-tight ${isPremium ? 'text-white/90' : 'text-[var(--muted-foreground)]'}`}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Button
            variant={isCurrent ? "outline" : "default"}
            disabled={isCurrent}
            onClick={() => onSelect(plan.id)}
            className={`w-full h-12 font-bold transition-all shadow-sm ${
              isCurrent
                ? "border-[var(--border)] text-[var(--muted-foreground)] cursor-not-allowed"
                : isPremium
                  ? "border-none shadow-[var(--brand)]/30 hover:shadow-[var(--brand)]/50"
                  : ""
            }`}
          >
            {isCurrent ? "Plan en Uso" : plan.price > 0 ? "Seleccionar Plan" : "Obtener Ahora"}
          </Button>
        </CardContent>
      </div>
    </Card>
  );
}
