"use client";

import { useEffect, useState } from "react";
import { Card, Input, Button, Label, Skeleton, toast, Switch } from "@heroui/react";
import { useLoyaltyProgram, useUpdateLoyaltyProgram, useAdjustLoyaltyPoints } from "@/lib/hooks/use-loyalty";
import { getErrorMessage } from "@/lib/utils/error-message";

export default function LoyaltyPage() {
  const { data: fetchedProgram, isLoading } = useLoyaltyProgram();
  const updateMutation = useUpdateLoyaltyProgram();
  const adjustMutation = useAdjustLoyaltyPoints();

  const [program, setProgram] = useState({
    is_active: false,
    name: "",
    description: "",
    earn_rate: 1,
    redemption_rate: 1,
  });

  const [adjustData, setAdjustData] = useState({
    user_id: "",
    points: 0,
    reason: "",
  });

  useEffect(() => {
    if (fetchedProgram) {
      setProgram({
        is_active: fetchedProgram.is_active ?? false,
        name: fetchedProgram.name ?? "",
        description: fetchedProgram.description ?? "",
        earn_rate: fetchedProgram.earn_rate ?? 1,
        redemption_rate: fetchedProgram.redemption_rate ?? 1,
      });
    }
  }, [fetchedProgram]);

  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync(program);
      toast.success("Programa actualizado correctamente");
    } catch (error) {
      toast.danger(getErrorMessage(error, "Error al actualizar programa"));
    }
  };

  const handleAdjustPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustData.user_id || !adjustData.points) {
      return toast.danger("Usuario y Puntos requeridos");
    }
    try {
      await adjustMutation.mutateAsync(adjustData);
      toast.success(`Se ajustaron ${adjustData.points} puntos al usuario.`);
      setAdjustData({ user_id: "", points: 0, reason: "" });
    } catch (error) {
      toast.danger(getErrorMessage(error, "Error al ajustar puntos"));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <Skeleton className="h-8 w-64 rounded-lg mb-2" />
          <Skeleton className="h-4 w-3/4 max-w-md rounded-lg" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
              <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48 rounded-lg" />
                  <Skeleton className="h-4 w-64 rounded-lg" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <div className="p-6 space-y-6">
                <Skeleton className="h-5 w-48 rounded-lg mb-4" />
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1.5"><Skeleton className="h-4 w-32 rounded" /><Skeleton className="h-10 w-full rounded-xl" /></div>
                  <div className="space-y-1.5"><Skeleton className="h-4 w-24 rounded" /><Skeleton className="h-10 w-full rounded-xl" /></div>
                </div>
              </div>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="bg-[var(--surface)] border border-[var(--border)] p-6 space-y-4">
              <Skeleton className="h-6 w-40 rounded-lg" />
              <Skeleton className="h-4 w-full rounded-lg" />
              <div className="space-y-1.5"><Skeleton className="h-4 w-24 rounded" /><Skeleton className="h-10 w-full rounded-xl" /></div>
              <div className="space-y-1.5"><Skeleton className="h-4 w-32 rounded" /><Skeleton className="h-10 w-full rounded-xl" /></div>
              <Skeleton className="h-10 w-full rounded-lg mt-2" />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--foreground)]">
          Programa de Fidelidad
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1">Configura cómo tus clientes acumulan y canjean puntos en tu tienda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
            <Card.Content className="p-0">
              <form onSubmit={handleSaveProgram}>
                <div className="p-6 border-b border-[var(--border)] bg-[var(--surface-sunken)] flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-[var(--foreground)]">Estado del Programa</h3>
                    <p className="text-sm text-[var(--muted)] mt-1">Activa o desactiva la acumulación de puntos.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      isSelected={program.is_active}
                      onChange={(val: boolean) => setProgram({ ...program, is_active: val })}
                    >
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                    </Switch>
                    <span className="text-sm font-medium">{program.is_active ? "Activo" : "Inactivo"}</span>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-[var(--foreground)]">Configuración General</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-1.5 flex flex-col">
                        <Label className="text-sm font-medium text-[var(--muted)]">Nombre del Programa</Label>
                        <Input
                          value={program.name}
                          onChange={(e) => setProgram({ ...program, name: e.target.value })}
                          placeholder="ej. Rankeao Rewards"
                          className="bg-transparent border border-[var(--border)]"
                        />
                      </div>
                      <div className="space-y-1.5 flex flex-col">
                        <Label className="text-sm font-medium text-[var(--muted)]">Descripción</Label>
                        <Input
                          value={program.description}
                          onChange={(e) => setProgram({ ...program, description: e.target.value })}
                          placeholder="Unas breves palabras para tus clientes"
                          className="bg-transparent border border-[var(--border)]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-[var(--border)] w-full" />

                  <div className="space-y-4">
                    <h4 className="font-semibold text-[var(--foreground)]">Reglas de Acumulación y Canje</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5 flex flex-col">
                        <Label className="text-sm font-medium text-[var(--muted)]">Puntos por cada $1 gastado (Earn Rate)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={program.earn_rate.toString()}
                          onChange={(e) => setProgram({ ...program, earn_rate: Number(e.target.value) })}
                          className="bg-transparent border border-[var(--border)]"
                        />
                      </div>
                      <div className="space-y-1.5 flex flex-col">
                        <Label className="text-sm font-medium text-[var(--muted)]">Valor de 1 Punto (Redemption Rate)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={program.redemption_rate.toString()}
                          onChange={(e) => setProgram({ ...program, redemption_rate: Number(e.target.value) })}
                          placeholder="Valor en tu moneda, ej. 1 punto = $1"
                          className="bg-transparent border border-[var(--border)]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-[var(--border)] bg-[var(--surface-sunken)] flex justify-end">
                  <Button type="submit" variant="primary" isDisabled={updateMutation.isPending}>
                    {updateMutation.isPending ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </div>
              </form>
            </Card.Content>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-[var(--surface)] border border-[var(--border)]">
            <Card.Content className="p-6">
              <h3 className="font-semibold text-lg text-[var(--foreground)] mb-2">Ajuste Manual</h3>
              <p className="text-sm text-[var(--muted)] mb-6">
                Otorga o remueve puntos a un usuario específico de forma manual. (Usa números negativos para restar).
              </p>
              <form onSubmit={handleAdjustPoints} className="space-y-4">
                <div className="space-y-1.5 flex flex-col">
                  <Label className="text-sm font-medium text-[var(--muted)]">ID del Usuario</Label>
                  <Input
                    value={adjustData.user_id}
                    onChange={(e) => setAdjustData({ ...adjustData, user_id: e.target.value })}
                    placeholder="user_12345"
                    required
                    className="bg-transparent border border-[var(--border)]"
                  />
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <Label className="text-sm font-medium text-[var(--muted)]">Puntos (+ o -)</Label>
                  <Input
                    type="number"
                    value={adjustData.points.toString()}
                    onChange={(e) => setAdjustData({ ...adjustData, points: Number(e.target.value) })}
                    required
                    className="bg-transparent border border-[var(--border)]"
                  />
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <Label className="text-sm font-medium text-[var(--muted)]">Motivo (Opcional)</Label>
                  <Input
                    value={adjustData.reason}
                    onChange={(e) => setAdjustData({ ...adjustData, reason: e.target.value })}
                    placeholder="Compensación, regalo, etc."
                    className="bg-transparent border border-[var(--border)]"
                  />
                </div>
                <Button type="submit" variant="primary" className="w-full mt-2" isDisabled={adjustMutation.isPending}>
                  {adjustMutation.isPending ? "Aplicando..." : "Aplicar Ajuste"}
                </Button>
              </form>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
}
