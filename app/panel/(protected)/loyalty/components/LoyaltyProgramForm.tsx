"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Trophy, Settings2, Info } from "lucide-react";

interface LoyaltyProgramFormProps {
  program: {
    is_active: boolean;
    name: string;
    description: string;
    earn_rate: number;
    redemption_rate: number;
  };
  onProgramChange: (val: any) => void;
  onSave: (e: React.FormEvent) => void;
  saving: boolean;
}

export function LoyaltyProgramForm({
  program,
  onProgramChange,
  onSave,
  saving,
}: LoyaltyProgramFormProps) {
  return (
    <Card className="bg-[#ffffff] border border-[var(--c-gray-200)] rounded-2xl overflow-hidden shadow-sm">
      <CardContent className="p-0">
        <form onSubmit={onSave}>
          {/* Status Header */}
          <div className="p-6 border-b border-[var(--c-gray-100)] bg-[var(--c-gray-50)]/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className={`p-3 rounded-2xl ${program.is_active ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-100 text-gray-400'}`}>
                 <Trophy className="h-6 w-6" />
               </div>
               <div>
                 <h3 className="font-bold text-lg text-[var(--c-gray-800)]">Estado del Programa</h3>
                 <p className="text-sm text-[var(--c-gray-500)]">Habilita o deshabilita la acumulación de puntos</p>
               </div>
            </div>
            <div className="flex items-center gap-3 bg-white p-2 px-4 rounded-xl border border-[var(--c-gray-200)]">
              <span className={`text-xs font-bold uppercase tracking-wider ${program.is_active ? 'text-emerald-500' : 'text-gray-400'}`}>
                {program.is_active ? "Activo" : "Inactivo"}
              </span>
              <Switch 
                checked={program.is_active}
                onCheckedChange={(val) => onProgramChange({ ...program, is_active: val })} 
              />
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* General Settings */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-[var(--c-navy-500)]">
                <Settings2 className="h-4 w-4" />
                <h4 className="font-bold text-sm uppercase tracking-wider">Configuración General</h4>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2 flex flex-col">
                  <Label className="text-sm font-semibold text-[var(--c-gray-600)]">Nombre del Programa</Label>
                  <Input
                    value={program.name}
                    onChange={(e) => onProgramChange({ ...program, name: e.target.value })}
                    placeholder="ej. Recompensas Rankeao"
                    className="bg-white border-[var(--c-gray-200)] rounded-xl h-11"
                  />
                </div>
                <div className="space-y-2 flex flex-col">
                  <Label className="text-sm font-semibold text-[var(--c-gray-600)]">Descripción para Clientes</Label>
                  <textarea
                    value={program.description}
                    onChange={(e) => onProgramChange({ ...program, description: e.target.value })}
                    placeholder="Explica brevemente cómo funciona tu programa..."
                    className="w-full bg-white border border-[var(--c-gray-200)] rounded-xl p-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[var(--c-navy-500)]/20 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-[var(--c-gray-100)] w-full" />

            {/* Rules */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-[var(--c-navy-500)]">
                <Info className="h-4 w-4" />
                <h4 className="font-bold text-sm uppercase tracking-wider">Reglas de Acumulación y Canje</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 flex flex-col p-4 rounded-2xl bg-[var(--c-cyan-500)]/5 border border-[var(--c-cyan-500)]/10">
                  <Label className="text-sm font-semibold text-[var(--c-gray-600)] flex items-center gap-2">
                    Tasa de Acumulación
                  </Label>
                  <p className="text-[11px] text-[var(--c-gray-500)] mb-1">Puntos otorgados por cada $1 gastado</p>
                  <Input
                    type="number"
                    step="0.01"
                    value={program.earn_rate.toString()}
                    onChange={(e) => onProgramChange({ ...program, earn_rate: Number(e.target.value) })}
                    className="bg-white border-[var(--c-gray-200)] rounded-xl h-11 font-bold text-[var(--c-navy-500)]"
                  />
                </div>
                <div className="space-y-2 flex flex-col p-4 rounded-2xl bg-[var(--c-navy-500)]/5 border border-[var(--c-navy-500)]/10">
                  <Label className="text-sm font-semibold text-[var(--c-gray-600)] flex items-center gap-2">
                    Valor del Punto
                  </Label>
                  <p className="text-[11px] text-[var(--c-gray-500)] mb-1">Valor monetario de 1 punto al canjear</p>
                  <Input
                    type="number"
                    step="0.01"
                    value={program.redemption_rate.toString()}
                    onChange={(e) => onProgramChange({ ...program, redemption_rate: Number(e.target.value) })}
                    placeholder="ej. 1 punto = $1"
                    className="bg-white border-[var(--c-gray-200)] rounded-xl h-11 font-bold text-[var(--c-navy-500)]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-[var(--c-gray-100)] bg-[var(--c-gray-50)]/50 flex justify-end">
            <Button 
              type="submit" 
              variant="default" 
              disabled={saving}
              className="bg-[var(--c-navy-500)] hover:bg-[var(--c-navy-600)] text-white rounded-xl h-11 px-8 shadow-lg shadow-[var(--c-navy-500)]/20"
            >
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
