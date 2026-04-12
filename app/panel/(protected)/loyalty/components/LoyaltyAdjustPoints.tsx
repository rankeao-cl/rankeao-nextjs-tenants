"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, MinusCircle, PlusCircle } from "lucide-react";

interface LoyaltyAdjustPointsProps {
  adjustData: {
    user_id: string;
    points: number;
    reason: string;
  };
  onAdjustChange: (val: any) => void;
  onApply: (e: React.FormEvent) => void;
  adjusting: boolean;
}

export function LoyaltyAdjustPoints({
  adjustData,
  onAdjustChange,
  onApply,
  adjusting,
}: LoyaltyAdjustPointsProps) {
  return (
    <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-[var(--brand)]/10 text-[var(--brand)]">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-[var(--foreground)]">Ajuste Manual</h3>
            <p className="text-sm text-[var(--muted-foreground)]">Gestiona puntos de un cliente específico</p>
          </div>
        </div>

        <form onSubmit={onApply} className="space-y-5">
          <div className="space-y-2 flex flex-col">
            <Label className="text-sm font-semibold text-[var(--muted-foreground)]">ID del Usuario</Label>
            <Input
              value={adjustData.user_id}
              onChange={(e) => onAdjustChange({ ...adjustData, user_id: e.target.value })}
              placeholder="user_12345"
              required
              className="bg-[var(--card)] border-[var(--border)] h-11 font-mono"
            />
          </div>

          <div className="space-y-2 flex flex-col">
            <Label className="text-sm font-semibold text-[var(--muted-foreground)]">Cantidad de Puntos</Label>
            <div className="relative">
               <Input
                type="number"
                value={adjustData.points.toString()}
                onChange={(e) => onAdjustChange({ ...adjustData, points: Number(e.target.value) })}
                required
                className="bg-[var(--card)] border-[var(--border)] h-11 pl-10 font-bold"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                {adjustData.points >= 0 ? (
                  <PlusCircle className="h-5 w-5 text-emerald-500" />
                ) : (
                  <MinusCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>
            <p className="text-[10px] text-[var(--muted-foreground)] italic">Use números negativos para restar puntos</p>
          </div>

          <div className="space-y-2 flex flex-col">
            <Label className="text-sm font-semibold text-[var(--muted-foreground)]">Motivo (Opcional)</Label>
            <Input
              value={adjustData.reason}
              onChange={(e) => onAdjustChange({ ...adjustData, reason: e.target.value })}
              placeholder="Ej: Compensación por retraso"
              className="bg-[var(--card)] border-[var(--border)] h-11"
            />
          </div>

          <Button 
            type="submit" 
            variant="default" 
            disabled={adjusting}
            className="w-full h-11 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white font-bold transition-all mt-4"
          >
            {adjusting ? "Aplicando..." : "Aplicar Ajuste"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
