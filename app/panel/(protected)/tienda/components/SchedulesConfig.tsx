"use client";

import { useEffect, useState } from "react";
import { Card, Button, Switch, Label, Skeleton, toast } from "@heroui/react";
import { getTenantSchedules, updateTenantSchedules } from "@/lib/api/tenant";
import { getErrorMessage } from "@/lib/utils/error-message";
import { Copy } from "lucide-react";
import type { ScheduleDay, DayOfWeek } from "@/lib/types/tenant";

const DAY_ORDER: DayOfWeek[] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

const DAY_LABELS: Record<DayOfWeek, string> = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

const DEFAULT_SCHEDULES: ScheduleDay[] = DAY_ORDER.map((day, i) => ({
  day_of_week: day,
  opens_at: "09:00",
  closes_at: "18:00",
  is_closed: i >= 5,
}));

export function SchedulesConfig() {
  const [schedules, setSchedules] = useState<ScheduleDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getTenantSchedules()
      .then((fetched) => {
        const merged = DEFAULT_SCHEDULES.map((def) => {
          const match = fetched.find((s) => s.day_of_week === def.day_of_week);
          return match || def;
        });
        setSchedules(merged);
        setLoading(false);
      })
      .catch(() => {
        setSchedules(DEFAULT_SCHEDULES);
        setLoading(false);
      });
  }, []);

  const handleChange = (day: DayOfWeek, field: keyof ScheduleDay, value: string | boolean) => {
    setSchedules((prev) =>
      prev.map((s) => (s.day_of_week === day ? { ...s, [field]: value } : s))
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateTenantSchedules({ schedules });
      toast.success("Horarios actualizados correctamente");
    } catch (error: unknown) {
      toast.danger(getErrorMessage(error, "Error al guardar horarios"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-[var(--surface)] border border-[var(--border)] p-6">
        <Skeleton className="h-6 w-48 rounded-lg mb-1" />
        <Skeleton className="h-4 w-3/4 max-w-md rounded-lg mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-3 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border)]">
              <div className="w-[100px] flex-shrink-0">
                <Skeleton className="h-5 w-20 rounded" />
              </div>
              <div className="flex items-center gap-4 flex-1">
                <Skeleton className="h-10 w-full max-w-[150px] rounded-xl" />
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-10 w-full max-w-[150px] rounded-xl" />
              </div>
              <Skeleton className="h-6 w-12 rounded-full" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const inputClass = "w-full bg-transparent focus:outline-none text-[var(--foreground)] border border-[var(--border)] bg-[var(--surface)] rounded-xl px-3 py-2";

  return (
    <Card className="bg-[var(--surface)] border border-[var(--border)] p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">Horarios de Atención</h3>
          <p className="text-[var(--muted)] text-sm">Configura los días y horarios en los que tu tienda está abierta al público.</p>
        </div>
        <Button
          size="sm"
          variant="secondary"
          className="flex items-center gap-2 shrink-0"
          onPress={() => {
            const firstOpen = schedules.find((s) => !s.is_closed);
            if (!firstOpen) {
              toast.danger("No hay ningún día abierto para copiar");
              return;
            }
            setSchedules((prev) =>
              prev.map((s) => ({
                ...s,
                opens_at: firstOpen.opens_at,
                closes_at: firstOpen.closes_at,
                is_closed: false,
              }))
            );
            toast.success(`Horario de ${DAY_LABELS[firstOpen.day_of_week]} aplicado a todos los días`);
          }}
        >
          <Copy className="w-4 h-4" />
          Aplicar a todos
        </Button>
      </div>

      <div className="space-y-4">
        {schedules.map((schedule) => (
          <div key={schedule.day_of_week} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-3 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border)] transition-colors hover:bg-[var(--surface-secondary)]">
            <div className="w-[100px] flex-shrink-0">
              <Label className="text-sm font-medium text-[var(--foreground)]">{DAY_LABELS[schedule.day_of_week]}</Label>
            </div>
            <div className="flex items-center gap-4 flex-1">
              {schedule.is_closed ? (
                <div className="text-sm text-[var(--muted)] italic flex-1">Cerrado</div>
              ) : (
                <>
                  <div className="flex-1 max-w-[150px]">
                    <input
                      type="time"
                      value={schedule.opens_at.slice(0, 5)}
                      onChange={(e) => handleChange(schedule.day_of_week, "opens_at", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <span className="text-[var(--muted)]">-</span>
                  <div className="flex-1 max-w-[150px]">
                    <input
                      type="time"
                      value={schedule.closes_at.slice(0, 5)}
                      onChange={(e) => handleChange(schedule.day_of_week, "closes_at", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 pt-2 sm:pt-0">
              <Switch
                isSelected={!schedule.is_closed}
                onChange={(isOpen: boolean) => handleChange(schedule.day_of_week, "is_closed", !isOpen)}
              >
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
              </Switch>
              <span className="text-xs w-[60px] text-[var(--muted)]">{!schedule.is_closed ? "Abierto" : "Cerrado"}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Button variant="primary" onPress={handleSave} isDisabled={saving}>
          {saving ? "Guardando..." : "Guardar Horarios"}
        </Button>
      </div>
    </Card>
  );
}
