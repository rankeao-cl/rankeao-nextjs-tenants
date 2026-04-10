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
    case "pro": return "from-[var(--c-navy-600)] to-[var(--c-navy-800)] text-white";
    case "starter": return "from-white to-[var(--c-gray-50)] text-[var(--c-gray-800)]";
    default: return "from-white to-white text-[var(--c-gray-800)]";
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
          ? "border-[var(--c-navy-500)] shadow-xl ring-1 ring-[var(--c-navy-500)]/20 scale-[1.02] z-10" 
          : "border-[var(--c-gray-200)] hover:border-[var(--c-navy-300)] hover:shadow-lg"
      }`}
    >
      <div className={`h-full bg-gradient-to-br ${getPlanGradient(plan.id)}`}>
        <CardContent className="p-8 flex flex-col h-full">
          <div className="flex items-start justify-between mb-6">
            <div className={`p-3 rounded-2xl ${isPremium ? 'bg-white/10 text-white' : 'bg-[var(--c-navy-500)]/10 text-[var(--c-navy-500)]'}`}>
              {getPlanIcon(plan.id)}
            </div>
            {plan.is_popular && !isCurrent && (
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[var(--c-cyan-500)] text-white shadow-sm">
                Más Popular
              </span>
            )}
            {isCurrent && (
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${isPremium ? 'bg-white/20 text-white' : 'bg-emerald-500 text-white animate-pulse shadow-sm'}`}>
                Plan Actual
              </span>
            )}
          </div>

          <h3 className={`text-xl font-extrabold tracking-tight mb-2 ${isPremium ? 'text-white' : 'text-[var(--c-gray-800)]'}`}>
            {plan.name}
          </h3>
          
          <div className="mb-8 flex items-baseline gap-1">
            <span className={`text-3xl font-black ${isPremium ? 'text-white' : 'text-[var(--c-navy-500)]'}`}>
              {plan.price === 0 ? "Gratis" : formatCurrency(plan.price)}
            </span>
            {plan.price > 0 && <span className={`text-xs font-bold ${isPremium ? 'text-white/60' : 'text-[var(--c-gray-400)]'}`}>/ mes</span>}
          </div>

          <div className="space-y-4 flex-grow mb-8">
            <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isPremium ? 'text-[var(--c-cyan-400)]' : 'text-[var(--c-gray-400)]'}`}>
              Incluye:
            </p>
            <ul className="space-y-3">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className={`p-1 rounded-full ${isPremium ? 'bg-[var(--c-cyan-400)]/20 text-[var(--c-cyan-400)]' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </div>
                  <span className={`text-[13px] font-medium leading-tight ${isPremium ? 'text-white/90' : 'text-[var(--c-gray-600)]'}`}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Button
            variant={isPremium ? "secondary" : isCurrent ? "outline" : "default"}
            disabled={isCurrent}
            onClick={() => onSelect(plan.id)}
            className={`w-full h-12 rounded-xl font-bold transition-all shadow-sm ${
              isCurrent 
                ? "border-[var(--c-gray-200)] text-[var(--c-gray-400)] cursor-not-allowed" 
                : isPremium 
                  ? "bg-[var(--c-cyan-500)] hover:bg-[var(--c-cyan-400)] text-white border-none shadow-[var(--c-cyan-500)]/30 hover:shadow-[var(--c-cyan-500)]/50" 
                  : "bg-[var(--c-navy-500)] hover:bg-[var(--c-navy-600)] text-white"
            }`}
          >
            {isCurrent ? "Plan en Uso" : plan.price > 0 ? "Seleccionar Plan" : "Obtener Ahora"}
          </Button>
        </CardContent>
      </div>
    </Card>
  );
}
