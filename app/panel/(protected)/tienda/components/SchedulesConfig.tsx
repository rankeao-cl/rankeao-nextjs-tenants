"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { getTenantSchedules, updateTenantSchedules } from "@/lib/api/tenant";
import { getErrorMessage } from "@/lib/utils/error-message";
import { Clock, Copy } from "lucide-react";
import type { ScheduleDay, DayOfWeek } from "@/lib/types/tenant";

const DAY_ORDER: DayOfWeek[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

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

  const handleChange = (
    day: DayOfWeek,
    field: keyof ScheduleDay,
    value: string | boolean
  ) => {
    setSchedules((prev) =>
      prev.map((s) =>
        s.day_of_week === day ? { ...s, [field]: value } : s
      )
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateTenantSchedules({ schedules });
      toast.success("Horarios actualizados correctamente");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al guardar horarios"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <section className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Horarios de Atención
              </h3>
              <p className="text-xs text-[var(--muted-foreground)]">
                Días y horarios en que tu tienda está abierta
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="secondary"
            className="gap-1.5"
            onClick={() => {
              const firstOpen = schedules.find((s) => !s.is_closed);
              if (!firstOpen) {
                toast.error("No hay ningún día abierto para copiar");
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
              toast.success(
                `Horario de ${DAY_LABELS[firstOpen.day_of_week]} aplicado a todos`
              );
            }}
          >
            <Copy className="w-3.5 h-3.5" />
            Aplicar a todos
          </Button>
        </div>

        <div className="divide-y divide-[var(--border)]">
          {schedules.map((schedule) => (
            <div
              key={schedule.day_of_week}
              className="flex flex-col sm:flex-row gap-3 items-start sm:items-center px-5 py-3.5 hover:bg-[var(--surface-secondary)] transition-colors"
            >
              <div className="w-24 shrink-0">
                <Label className="text-sm font-medium text-[var(--foreground)]">
                  {DAY_LABELS[schedule.day_of_week]}
                </Label>
              </div>
              <div className="flex items-center gap-3 flex-1">
                {schedule.is_closed ? (
                  <span className="text-sm text-[var(--muted-foreground)] italic">
                    Cerrado
                  </span>
                ) : (
                  <>
                    <input
                      type="time"
                      value={schedule.opens_at.slice(0, 5)}
                      onChange={(e) =>
                        handleChange(
                          schedule.day_of_week,
                          "opens_at",
                          e.target.value
                        )
                      }
                      className="h-9 w-28 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] text-center focus:outline-none focus:border-primary"
                    />
                    <span className="text-[var(--muted-foreground)] text-sm">
                      —
                    </span>
                    <input
                      type="time"
                      value={schedule.closes_at.slice(0, 5)}
                      onChange={(e) =>
                        handleChange(
                          schedule.day_of_week,
                          "closes_at",
                          e.target.value
                        )
                      }
                      className="h-9 w-28 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] text-center focus:outline-none focus:border-primary"
                    />
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={!schedule.is_closed}
                  onCheckedChange={(isOpen: boolean) =>
                    handleChange(schedule.day_of_week, "is_closed", !isOpen)
                  }
                />
                <span className="text-xs w-14 text-[var(--muted-foreground)]">
                  {!schedule.is_closed ? "Abierto" : "Cerrado"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end">
        <Button variant="default" onClick={handleSave} disabled={saving} size="lg">
          {saving ? "Guardando..." : "Guardar horarios"}
        </Button>
      </div>
    </div>
  );
}
