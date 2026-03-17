"use client";

import { useState } from "react";
import {
  Card,
  Table,
  Button,
  Skeleton,
  toast,
} from "@heroui/react";
import { getErrorMessage } from "@/lib/utils/error-message";

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

const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case "ACTIVE":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "CANCELLED":
    case "EXPIRED":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    case "PAST_DUE":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "PAID":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "PENDING":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    default:
      return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  }
};

const AVAILABLE_PLANS: Plan[] = [
  {
    id: "free",
    name: "Gratis",
    price: 0,
    features: ["Hasta 50 productos", "1 miembro del equipo", "Reportes basicos"],
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
    features: ["Productos ilimitados", "10 miembros", "API completa", "Soporte prioritario", "Dominio personalizado"],
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
    if (!window.confirm("¿Seguro que deseas cancelar tu suscripcion? Perderas acceso a las funciones premium al final del periodo.")) return;
    setActionLoading(true);
    try {
      setSubscriptionStatus("CANCELLED");
      toast.success("Suscripcion cancelada. Tendras acceso hasta el final del periodo actual.");
    } catch (error: unknown) {
      toast.danger(getErrorMessage(error, "Error al cancelar suscripcion"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivate = async () => {
    setActionLoading(true);
    try {
      setSubscriptionStatus("ACTIVE");
      toast.success("Suscripcion reactivada");
    } catch (error: unknown) {
      toast.danger(getErrorMessage(error, "Error al reactivar suscripcion"));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--foreground)]">
            Suscripcion
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">Gestiona tu plan y facturacion</p>
        </div>
      </div>

      {/* Current Plan */}
      {isLoading ? (
        <Card className="bg-[var(--surface)] border border-[var(--border)]">
          <Card.Content className="p-6 space-y-3">
            <Skeleton className="h-6 w-40 rounded" />
            <Skeleton className="h-8 w-24 rounded" />
            <Skeleton className="h-4 w-60 rounded" />
          </Card.Content>
        </Card>
      ) : (
        <Card className="bg-[var(--surface)] border border-[var(--border)]">
          <Card.Content className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9Z" /><path d="M11 3 8 9l4 13 4-13-3-6" /><path d="M2 9h20" /></svg>
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-[var(--foreground)]">Plan {currentPlan?.name}</h2>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(subscriptionStatus)}`}>
                      {subscriptionStatus === "ACTIVE" ? "Activo" : "Cancelado"}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--muted)] mt-1">
                    {currentPlan?.price === 0 ? "Gratis" : `${formatCurrency(currentPlan?.price || 0)} / mes`}
                  </p>
                </div>
              </div>
              <div>
                {subscriptionStatus === "ACTIVE" && currentPlanId !== "free" ? (
                  <Button variant="danger" isDisabled={actionLoading} onPress={handleCancelSubscription}>
                    {actionLoading ? "Procesando..." : "Cancelar Suscripcion"}
                  </Button>
                ) : subscriptionStatus === "CANCELLED" ? (
                  <Button variant="primary" isDisabled={actionLoading} onPress={handleReactivate}>
                    {actionLoading ? "Procesando..." : "Reactivar Suscripcion"}
                  </Button>
                ) : null}
              </div>
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Available Plans */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Planes Disponibles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AVAILABLE_PLANS.map((plan) => {
            const isCurrent = plan.id === currentPlanId;
            return (
              <Card
                key={plan.id}
                className={`bg-[var(--surface)] border transition-colors ${
                  isCurrent ? "border-[var(--primary)] ring-1 ring-[var(--primary)]/30" : "border-[var(--border)] hover:border-[var(--border-hover)]"
                }`}
              >
                <Card.Content className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[var(--foreground)]">{plan.name}</h3>
                    {plan.is_popular && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        Popular
                      </span>
                    )}
                    {isCurrent && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Actual
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-[var(--foreground)]">
                    {plan.price === 0 ? "Gratis" : formatCurrency(plan.price)}
                    {plan.price > 0 && <span className="text-sm font-normal text-[var(--muted)]"> / mes</span>}
                  </p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-[var(--muted)]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 flex-shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {!isCurrent && (
                    <Button
                      variant={plan.is_popular ? "primary" : "outline"}
                      className="w-full"
                      onPress={() => {
                        setCurrentPlanId(plan.id);
                        setSubscriptionStatus("ACTIVE");
                        toast.success(`Cambiado al plan ${plan.name}`);
                      }}
                    >
                      {plan.price > (currentPlan?.price || 0) ? "Mejorar Plan" : "Cambiar Plan"}
                    </Button>
                  )}
                </Card.Content>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Invoices */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Historial de Facturas</h2>
        <Card className="bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <Table.ScrollContainer>
                <Table.Content aria-label="Historial de Facturas" className="min-w-full">
                  <Table.Header className="bg-[var(--surface-sunken)] border-b border-[var(--border)]">
                    <Table.Column isRowHeader className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Factura</Table.Column>
                    <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Fecha</Table.Column>
                    <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Monto</Table.Column>
                    <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider text-right">Estado</Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {invoices.length === 0 ? (
                      <Table.Row>
                        <Table.Cell colSpan={4} className="py-12 text-center text-[var(--muted)]">
                          No hay facturas registradas.
                        </Table.Cell>
                      </Table.Row>
                    ) : (
                      invoices.map((invoice) => (
                        <Table.Row key={invoice.id} className="border-b border-[var(--border)] last:border-0 hover:bg-white/[0.02] transition-colors">
                          <Table.Cell className="py-4 px-4 text-sm font-medium text-[var(--foreground)]">
                            {invoice.id}
                          </Table.Cell>
                          <Table.Cell className="py-4 px-4 text-sm text-[var(--muted)]">
                            {invoice.date}
                          </Table.Cell>
                          <Table.Cell className="py-4 px-4 text-sm font-medium text-[var(--foreground)]">
                            {formatCurrency(invoice.amount)}
                          </Table.Cell>
                          <Table.Cell className="py-4 px-4 text-right">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                              {invoice.status === "PAID" ? "Pagado" : invoice.status}
                            </span>
                          </Table.Cell>
                        </Table.Row>
                      ))
                    )}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
