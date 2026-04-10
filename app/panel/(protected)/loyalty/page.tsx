"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useLoyaltyProgram, useUpdateLoyaltyProgram, useAdjustLoyaltyPoints } from "@/lib/hooks/use-loyalty";
import { getErrorMessage } from "@/lib/utils/error-message";

// Modular Components
import { LoyaltyHeader } from "./components/LoyaltyHeader";
import { LoyaltyProgramForm } from "./components/LoyaltyProgramForm";
import { LoyaltyAdjustPoints } from "./components/LoyaltyAdjustPoints";

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
      toast.error(getErrorMessage(error, "Error al actualizar programa"));
    }
  };

  const handleAdjustPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustData.user_id || adjustData.points === 0) {
      return toast.error("Usuario y Puntos requeridos");
    }
    try {
      await adjustMutation.mutateAsync(adjustData);
      toast.success(`Se ajustaron ${adjustData.points} puntos al usuario.`);
      setAdjustData({ user_id: "", points: 0, reason: "" });
    } catch (error) {
      toast.error(getErrorMessage(error, "Error al ajustar puntos"));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 space-y-6">
               <Skeleton className="h-20 w-full rounded-2xl" />
               <Skeleton className="h-10 w-48 rounded-xl" />
               <div className="space-y-4">
                  <Skeleton className="h-12 w-full rounded-xl" />
                  <Skeleton className="h-24 w-full rounded-xl" />
               </div>
            </Card>
          </div>
          <div className="space-y-6">
             <Card className="p-6 space-y-4">
               <Skeleton className="h-8 w-40 rounded-xl" />
               <Skeleton className="h-12 w-full rounded-xl" />
               <Skeleton className="h-12 w-full rounded-xl" />
             </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10 px-4 sm:px-0">
      <LoyaltyHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <LoyaltyProgramForm
            program={program}
            onProgramChange={setProgram}
            onSave={handleSaveProgram}
            saving={updateMutation.isPending}
          />
        </div>

        <div className="space-y-6">
          <LoyaltyAdjustPoints
            adjustData={adjustData}
            onAdjustChange={setAdjustData}
            onApply={handleAdjustPoints}
            adjusting={adjustMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
