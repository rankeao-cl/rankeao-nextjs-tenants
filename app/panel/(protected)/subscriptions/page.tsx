"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/error-message";
import { ArrowUpRight, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import {
  useSubscription,
  useInvoices,
  useCancelSubscription,
  useReactivateSubscription,
  useUpgradeSubscription,
  useDowngradeSubscription,
} from "@/lib/hooks/use-subscriptions";

// Modular Components
import { SubscriptionHeader } from "./components/SubscriptionHeader";
import { SubscriptionPlanCard } from "./components/SubscriptionPlanCard";
import { SubscriptionInvoiceList } from "./components/SubscriptionInvoiceList";

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
      return "bg-[var(--surface)] text-[var(--muted-foreground)] border-[var(--border)]";
  }
};

export default function SubscriptionsPage() {
  const { data: subscription, isLoading: loadingSubscription } = useSubscription();
  const { data: invoices = [], isLoading: loadingInvoices } = useInvoices();
  const cancelMutation = useCancelSubscription();
  const reactivateMutation = useReactivateSubscription();
  const upgradeMutation = useUpgradeSubscription();
  const downgradeMutation = useDowngradeSubscription();

  const availablePlans = subscription?.available_plans ?? [];
  const currentPlanId = (subscription?.plan_slug ?? "starter").toLowerCase();
  const subscriptionStatus = subscription?.status ?? "ACTIVE";
  const billingCycle = (subscription?.billing_cycle ?? "MONTHLY").toUpperCase();
  const isLoading = loadingSubscription || loadingInvoices;

  const currentPlan = availablePlans.find((p) => p.slug.toLowerCase() === currentPlanId);
  const actionLoading =
    cancelMutation.isPending ||
    reactivateMutation.isPending ||
    upgradeMutation.isPending ||
    downgradeMutation.isPending;

  const handleCancelSubscription = async () => {
    try {
      await cancelMutation.mutateAsync(undefined);
      toast.success("Suscripción cancelada exitosamente");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al cancelar suscripción"));
    }
  };

  const handleReactivate = async () => {
    try {
      await reactivateMutation.mutateAsync();
      toast.success("Suscripción reactivada");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al reactivar suscripción"));
    }
  };

  const handleSelectPlan = async (targetPlanSlug: string) => {
    const targetPlan = availablePlans.find((p) => p.slug.toLowerCase() === targetPlanSlug.toLowerCase());
    if (!targetPlan || !currentPlan || targetPlan.slug.toLowerCase() === currentPlanId) return;

    try {
      if (targetPlan.price_monthly >= currentPlan.price_monthly) {
        await upgradeMutation.mutateAsync({
          plan_slug: targetPlan.slug,
          billing_cycle: billingCycle === "YEARLY" ? "YEARLY" : "MONTHLY",
          payment_provider: "manual",
        });
        toast.success(`Plan actualizado a ${targetPlan.name}`);
      } else {
        await downgradeMutation.mutateAsync({ plan_slug: targetPlan.slug });
        toast.success(`Cambio a ${targetPlan.name} programado para el próximo ciclo`);
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "No se pudo cambiar el plan"));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-[1400px] mx-auto pb-10">
        <Skeleton className="h-10 w-64" />
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
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--brand)] to-[var(--brand)] rounded-[32px] blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
        <Card className="relative bg-[var(--card)] border border-[var(--surface)] rounded-[32px] overflow-hidden shadow-sm">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-[var(--surface)]">
              {/* Left: Status */}
              <div className="p-8 md:w-1/3 flex flex-col justify-center">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-2xl bg-[var(--brand)]/5 text-[var(--brand)]">
                       <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Plan Vigente</p>
                       <h2 className="text-2xl font-black text-[var(--foreground)]">{currentPlan?.name ?? subscription?.plan_name ?? "Plan"}</h2>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 mt-2">
                    <span className={`inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-wider border shadow-sm ${getStatusStyles(subscriptionStatus)}`}>
                      {subscriptionStatus === "ACTIVE" ? (
                        <><CheckCircle2 className="h-3 w-3 mr-1.5" /> Activo</>
                      ) : (
                        <><AlertCircle className="h-3 w-3 mr-1.5" /> Cancelado</>
                      )}
                    </span>
                    {subscription?.current_period_end && (
                      <p className="text-[11px] font-medium text-[var(--muted-foreground)] italic">
                        Prox. Cobro: {new Date(subscription.current_period_end).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    )}
                 </div>
              </div>

              {/* Middle: Details */}
              <div className="p-8 md:w-1/3 flex flex-col justify-center bg-[var(--surface)]/30">
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-[13px] font-medium text-[var(--muted-foreground)]">Inversión Mensual</span>
                       <span className="text-[15px] font-bold text-[var(--foreground)]">
                         {(subscription?.amount ?? currentPlan?.price_monthly ?? 0) === 0
                           ? "Sin costo"
                           : formatCurrency(subscription?.amount ?? currentPlan?.price_monthly ?? 0)}
                       </span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[13px] font-medium text-[var(--muted-foreground)]">Plan</span>
                       <span className="text-[13px] font-bold text-[var(--foreground)]">{subscription?.plan_name ?? currentPlan?.name ?? "—"}</span>
                    </div>
                 </div>
              </div>

              {/* Right: Actions */}
              <div className="p-8 md:w-1/3 flex flex-col justify-center gap-3">
                 {subscriptionStatus === "ACTIVE" && (subscription?.amount ?? currentPlan?.price_monthly ?? 0) > 0 ? (
                   <Button 
                    variant="outline" 
                    disabled={actionLoading} 
                    onClick={handleCancelSubscription}
                    className="h-11 border-[var(--border)] text-red-500 font-bold hover:bg-red-500/10 hover:border-red-500/20 group transition-all"
                   >
                     {actionLoading ? "Cancelando..." : "Detener Suscripción"}
                     <ArrowUpRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-all -translate-y-1 group-hover:translate-x-1" />
                   </Button>
                 ) : subscriptionStatus === "CANCELLED" ? (
                   <Button
                    variant="default"
                    disabled={actionLoading}
                    onClick={handleReactivate}
                    className="h-11 font-bold transition-all shadow-lg shadow-[var(--brand)]/20"
                   >
                     {actionLoading ? "Reactivando..." : "Reactivar Suscripción"}
                   </Button>
                 ) : (
                   <p className="text-xs text-[var(--muted-foreground)] text-center font-medium italic">El plan gratuito es permanente y no tiene cobros asociados.</p>
                 )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Plans Section */}
      <section className="space-y-8">
        <div className="px-2">
           <h2 className="text-xl font-black text-[var(--foreground)] tracking-tight">Mejora tu Experiencia</h2>
           <p className="text-sm text-[var(--muted-foreground)] mt-1 font-medium">Escala tu negocio con funciones avanzadas y mayor capacidad</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-4">
          {availablePlans.map((plan) => (
            <SubscriptionPlanCard
              key={plan.slug}
              plan={{
                id: plan.slug,
                name: plan.name,
                price: plan.price_monthly,
                features: plan.features,
                is_popular: plan.is_popular,
              }}
              isCurrent={plan.slug.toLowerCase() === currentPlanId}
              onSelect={handleSelectPlan}
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
