"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/error-message";
import { ArrowUpRight, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";

// Modular Components
import { SubscriptionHeader } from "./components/SubscriptionHeader";
import { SubscriptionPlanCard } from "./components/SubscriptionPlanCard";
import { SubscriptionInvoiceList } from "./components/SubscriptionInvoiceList";

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  is_popular?: boolean;
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: string;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(value);

const getStatusStyles = (status: string) => {
  switch (status?.toUpperCase()) {
    case "ACTIVE":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "CANCELLED":
    case "EXPIRED":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    case "PAST_DUE":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "PAID":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    default:
      return "bg-[var(--c-gray-50)] text-[var(--c-gray-500)] border-[var(--c-gray-200)]";
  }
};

const AVAILABLE_PLANS: Plan[] = [
  {
    id: "free",
    name: "Gratis",
    price: 0,
    features: ["Hasta 50 productos", "1 miembro del equipo", "Reportes básicos", "Soporte comunitario"],
  },
  {
    id: "starter",
    name: "Starter",
    price: 9990,
    features: ["Hasta 500 productos", "3 miembros", "Cupones y descuentos", "Reportes avanzados"],
    is_popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: 24990,
    features: ["Productos ilimitados", "10 miembros", "API completa", "Soporte prioritario 24/7", "Dominio personalizado"],
  },
];

const MOCK_INVOICES: Invoice[] = [
  { id: "INV-2026-003", date: "2026-03-01", amount: 9990, status: "PAID" },
  { id: "INV-2026-002", date: "2026-02-01", amount: 9990, status: "PAID" },
  { id: "INV-2026-001", date: "2026-01-01", amount: 9990, status: "PAID" },
];

export default function SubscriptionsPage() {
  const [isLoading] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState("starter");
  const [subscriptionStatus, setSubscriptionStatus] = useState("ACTIVE");
  const [invoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [actionLoading, setActionLoading] = useState(false);

  const currentPlan = AVAILABLE_PLANS.find((p) => p.id === currentPlanId);

  const handleCancelSubscription = async () => {
    setActionLoading(true);
    try {
      // Simulation
      await new Promise(r => setTimeout(r, 800));
      setSubscriptionStatus("CANCELLED");
      toast.success("Suscripción cancelada exitosamente");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al cancelar suscripción"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivate = async () => {
    setActionLoading(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      setSubscriptionStatus("ACTIVE");
      toast.success("Suscripción reactivada");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al reactivar suscripción"));
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-[1400px] mx-auto pb-10">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-[200px] w-full rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Skeleton className="h-[400px] rounded-3xl" />
           <Skeleton className="h-[400px] rounded-3xl" />
           <Skeleton className="h-[400px] rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-[1400px] mx-auto pb-10 px-4 sm:px-0">
      <SubscriptionHeader />

      {/* Current Plan Hero */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--c-navy-500)] to-[var(--c-cyan-500)] rounded-[32px] blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
        <Card className="relative bg-white border border-[var(--c-gray-100)] rounded-[32px] overflow-hidden shadow-sm">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-[var(--c-gray-100)]">
              {/* Left: Status */}
              <div className="p-8 md:w-1/3 flex flex-col justify-center">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-2xl bg-[var(--c-navy-500)]/5 text-[var(--c-navy-500)]">
                       <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--c-gray-400)]">Plan Vigente</p>
                      <h2 className="text-2xl font-black text-[var(--c-gray-800)]">{currentPlan?.name}</h2>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 mt-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider border shadow-sm ${getStatusStyles(subscriptionStatus)}`}>
                      {subscriptionStatus === "ACTIVE" ? (
                        <><CheckCircle2 className="h-3 w-3 mr-1.5" /> Activo</>
                      ) : (
                        <><AlertCircle className="h-3 w-3 mr-1.5" /> Cancelado</>
                      )}
                    </span>
                    <p className="text-[11px] font-medium text-[var(--c-gray-500)] italic">Prox. Cobro: 01 Abr 2026</p>
                 </div>
              </div>

              {/* Middle: Details */}
              <div className="p-8 md:w-1/3 flex flex-col justify-center bg-[var(--c-gray-50)]/30">
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-[13px] font-medium text-[var(--c-gray-500)]">Inversión Mensual</span>
                       <span className="text-[15px] font-bold text-[var(--c-gray-800)]">{currentPlan?.price === 0 ? "Sin costo" : formatCurrency(currentPlan?.price || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[13px] font-medium text-[var(--c-gray-500)]">Método de Pago</span>
                       <span className="text-[13px] font-bold text-[var(--c-gray-800)]">Visa •••• 4242</span>
                    </div>
                 </div>
              </div>

              {/* Right: Actions */}
              <div className="p-8 md:w-1/3 flex flex-col justify-center gap-3">
                 {subscriptionStatus === "ACTIVE" && currentPlanId !== "free" ? (
                   <Button 
                    variant="outline" 
                    disabled={actionLoading} 
                    onClick={handleCancelSubscription}
                    className="h-11 rounded-xl border-[var(--c-gray-200)] text-red-500 font-bold hover:bg-red-50 hover:border-red-100 group transition-all"
                   >
                     {actionLoading ? "Cancelando..." : "Detener Suscripción"}
                     <ArrowUpRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-all -translate-y-1 group-hover:translate-x-1" />
                   </Button>
                 ) : subscriptionStatus === "CANCELLED" ? (
                   <Button 
                    variant="default" 
                    disabled={actionLoading} 
                    onClick={handleReactivate}
                    className="h-11 rounded-xl bg-[var(--c-navy-500)] hover:bg-[var(--c-navy-600)] text-white font-bold transition-all shadow-lg shadow-[var(--c-navy-500)]/20"
                   >
                     {actionLoading ? "Reactivando..." : "Reactivar Suscripción"}
                   </Button>
                 ) : (
                   <p className="text-xs text-[var(--c-gray-400)] text-center font-medium italic">El plan gratuito es permanente y no tiene cobros asociados.</p>
                 )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Plans Section */}
      <section className="space-y-8">
        <div className="px-2">
           <h2 className="text-xl font-black text-[var(--c-gray-800)] tracking-tight">Mejora tu Experiencia</h2>
           <p className="text-sm text-[var(--c-gray-500)] mt-1 font-medium">Escala tu negocio con funciones avanzadas y mayor capacidad</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-4">
          {AVAILABLE_PLANS.map((plan) => (
            <SubscriptionPlanCard
              key={plan.id}
              plan={plan}
              isCurrent={plan.id === currentPlanId}
              onSelect={(id) => {
                setCurrentPlanId(id);
                setSubscriptionStatus("ACTIVE");
                toast.success(`Plan actualizado a ${plan.name}`);
              }}
              formatCurrency={formatCurrency}
            />
          ))}
        </div>
      </section>

      {/* Billing History Section */}
      <section className="space-y-6">
        <SubscriptionInvoiceList 
          invoices={invoices} 
          formatCurrency={formatCurrency}
          getStatusColor={getStatusStyles}
        />
      </section>
    </div>
  );
}
