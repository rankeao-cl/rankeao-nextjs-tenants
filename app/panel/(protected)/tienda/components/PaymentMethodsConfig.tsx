"use client";

import { useEffect, useState } from "react";
import { Card, Input, Button, Switch, Label, Skeleton, toast, TextArea } from "@heroui/react";
import { listPaymentMethods, addPaymentMethod, updatePaymentMethod } from "@/lib/api/tenant";
import { getErrorMessage } from "@/lib/utils/error-message";
import type { PaymentConfig, PaymentMethod } from "@/lib/types/tenant";

export function PaymentMethodsConfig() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const [transferConfig, setTransferConfig] = useState<PaymentConfig>({});
  const [cashConfig, setCashConfig] = useState<PaymentConfig>({});

  const fetchMethods = async () => {
    try {
      const fetched = await listPaymentMethods();
      setMethods(fetched);
      const transfer = fetched.find((m) => m.type === "BANK_TRANSFER");
      if (transfer?.config) setTransferConfig(transfer.config);
      const cash = fetched.find((m) => m.type === "CASH");
      if (cash?.config) setCashConfig(cash.config);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const handleToggle = async (type: string, isActive: boolean, existingId?: string) => {
    try {
      if (existingId) {
        setSaving(existingId);
        await updatePaymentMethod(existingId, { is_active: isActive });
        toast.success(`Método de pago ${isActive ? "activado" : "desactivado"}`);
      } else {
        setSaving(type);
        await addPaymentMethod({
          type,
          label: type === "BANK_TRANSFER" ? "Transferencia Bancaria" : "Efectivo",
          is_active: isActive,
          config: type === "BANK_TRANSFER" ? transferConfig : cashConfig,
        });
        toast.success("Método de pago activado");
      }
      await fetchMethods();
    } catch (err) {
      toast.danger(getErrorMessage(err, "Error al actualizar método de pago"));
    } finally {
      setSaving(null);
    }
  };

  const handleSaveConfig = async (type: string, config: PaymentConfig, existingId?: string) => {
    try {
      if (existingId) {
        setSaving(existingId);
        await updatePaymentMethod(existingId, { config });
      } else {
        setSaving(type);
        await addPaymentMethod({
          type,
          label: type === "BANK_TRANSFER" ? "Transferencia Bancaria" : "Efectivo",
          is_active: false,
          config,
        });
      }
      toast.success("Configuración guardada");
      await fetchMethods();
    } catch (err) {
      toast.danger(getErrorMessage(err, "Error al guardar configuración"));
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="bg-[var(--surface)] border border-[var(--border)] p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-2 w-full">
                <Skeleton className="h-6 w-48 rounded-lg" />
                <Skeleton className="h-4 w-3/4 max-w-md rounded-lg" />
              </div>
              <Skeleton className="h-6 w-12 rounded-full shrink-0" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5"><Skeleton className="h-4 w-20 rounded" /><Skeleton className="h-10 w-full rounded-xl" /></div>
              <div className="space-y-1.5"><Skeleton className="h-4 w-24 rounded" /><Skeleton className="h-10 w-full rounded-xl" /></div>
            </div>
            <div className="mt-6 flex justify-end">
              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const transferMethod = methods.find((m) => m.type === "BANK_TRANSFER");
  const cashMethod = methods.find((m) => m.type === "CASH");

  return (
    <div className="space-y-6">
      <Card className="bg-[var(--surface)] border border-[var(--border)] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">Transferencia Bancaria</h3>
            <p className="text-[var(--muted)] text-sm">Permite a los clientes pagar depositando directamente en tu cuenta.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--muted)]">{transferMethod?.is_active ? "Activado" : "Desactivado"}</span>
            <Switch
              isSelected={!!transferMethod?.is_active}
              onChange={(val) => handleToggle("BANK_TRANSFER", val, transferMethod?.id)}
              isDisabled={saving !== null}
            >
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
            </Switch>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-[var(--muted)] mb-1.5 block">Banco</Label>
            <Input value={transferConfig.bank || ""} onChange={(e) => setTransferConfig({ ...transferConfig, bank: e.target.value })} placeholder="Ej: Banco Estado" className="bg-transparent" />
          </div>
          <div>
            <Label className="text-sm text-[var(--muted)] mb-1.5 block">Tipo de Cuenta</Label>
            <Input value={transferConfig.account_type || ""} onChange={(e) => setTransferConfig({ ...transferConfig, account_type: e.target.value })} placeholder="Ej: Cuenta Corriente" className="bg-transparent" />
          </div>
          <div>
            <Label className="text-sm text-[var(--muted)] mb-1.5 block">Número de Cuenta</Label>
            <Input value={transferConfig.account_number || ""} onChange={(e) => setTransferConfig({ ...transferConfig, account_number: e.target.value })} placeholder="12345678" className="bg-transparent" />
          </div>
          <div>
            <Label className="text-sm text-[var(--muted)] mb-1.5 block">RUT / Identificación</Label>
            <Input value={transferConfig.rut || ""} onChange={(e) => setTransferConfig({ ...transferConfig, rut: e.target.value })} placeholder="12.345.678-9" className="bg-transparent" />
          </div>
          <div className="md:col-span-2">
            <Label className="text-sm text-[var(--muted)] mb-1.5 block">Correo Electrónico para Comprobantes</Label>
            <Input value={transferConfig.email || ""} onChange={(e) => setTransferConfig({ ...transferConfig, email: e.target.value })} placeholder="ventas@mitienda.cl" className="bg-transparent" />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            size="sm"
            variant="primary"
            onPress={() => handleSaveConfig("BANK_TRANSFER", transferConfig, transferMethod?.id)}
            isDisabled={saving !== null}
          >
            Guardar Datos Bancarios
          </Button>
        </div>
      </Card>

      <Card className="bg-[var(--surface)] border border-[var(--border)] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">Pago en Efectivo / Presencial</h3>
            <p className="text-[var(--muted)] text-sm">El cliente paga al momento de retirar su pedido en tienda.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--muted)]">{cashMethod?.is_active ? "Activado" : "Desactivado"}</span>
            <Switch
              isSelected={!!cashMethod?.is_active}
              onChange={(val) => handleToggle("CASH", val, cashMethod?.id)}
              isDisabled={saving !== null}
            >
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
            </Switch>
          </div>
        </div>

        <div>
          <Label className="text-sm text-[var(--muted)] mb-1.5 block">Instrucciones Adicionales (Opcional)</Label>
          <TextArea
            value={cashConfig.instructions || ""}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCashConfig({ ...cashConfig, instructions: e.target.value })}
            placeholder="Ej: Te esperamos en nuestra sucursal. Tienes 24 horas para recoger el pedido."
            rows={3}
            className="bg-transparent border border-[var(--border)] w-full resize-y"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            size="sm"
            variant="primary"
            onPress={() => handleSaveConfig("CASH", cashConfig, cashMethod?.id)}
            isDisabled={saving !== null}
          >
            Guardar Instrucciones
          </Button>
        </div>
      </Card>
    </div>
  );
}
