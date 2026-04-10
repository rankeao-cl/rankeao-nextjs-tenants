"use client";

import { useAuthStore } from "@/lib/stores/auth-store";
import { Skeleton } from "@/components/ui/skeleton";
import { Info, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Modular Components
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileCard } from "./components/ProfileCard";
import { ProfileDetails } from "./components/ProfileDetails";

export default function PerfilPage() {
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  if (!hasHydrated || !user) {
    return (
      <div className="space-y-10 max-w-[1400px] mx-auto pb-12 px-4 sm:px-0">
        <Skeleton className="h-10 w-64 rounded-xl mb-4" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <Skeleton className="h-[400px] rounded-[32px]" />
           <div className="lg:col-span-2 space-y-8">
              <Skeleton className="h-[500px] rounded-[32px]" />
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-[1400px] mx-auto pb-12 px-4 sm:px-0">
      <ProfileHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Premium Identity Card */}
        <div className="lg:col-span-1">
          <ProfileCard user={user} />
          
          <div className="mt-8 p-6 rounded-[32px] bg-gradient-to-br from-[var(--c-navy-500)] to-[var(--c-cyan-600)] shadow-lg shadow-[var(--c-navy-500)]/20 relative overflow-hidden group">
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3 text-[var(--c-cyan-400)]">
                   <Sparkles className="h-4 w-4" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Estado Premium</span>
                </div>
                <h4 className="text-white font-black text-lg mb-2 leading-tight">Tu ecosistema está al máximo rendimiento</h4>
                <p className="text-white/70 text-xs font-medium leading-relaxed">
                   Tienes activadas todas las integraciones de logística y analítica avanzada.
                </p>
             </div>
             <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          </div>
        </div>

        {/* Right Column: Detailed Configuration */}
        <div className="lg:col-span-2 space-y-8">
          <ProfileDetails user={user} />

          {/* Educational / Status Block */}
          <Card className="bg-[var(--c-gray-50)]/50 border border-[var(--c-gray-100)] shadow-none rounded-[32px]">
            <CardContent className="p-8 flex gap-6 items-start">
              <div className="p-4 rounded-2xl bg-white border border-[var(--c-gray-100)] text-[var(--c-navy-500)] shadow-sm">
                 <Info className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h4 className="text-[16px] font-black text-[var(--c-gray-800)]">Nota sobre la Gestión de Perfil</h4>
                <p className="text-[13px] text-[var(--c-gray-600)] font-medium leading-relaxed max-w-xl">
                  Por motivos de seguridad y cumplimiento de la normativa de arrendatarios, la modificación de credenciales y el cambio de correo electrónico se realizan a través de una solicitud directa a **Soporte Técnico**. 
                  <br /><br />
                  Este proceso asegura que las vinculaciones de base de datos y llaves de cifrado se mantengan íntegras durante la transición.
                </p>
                <div className="pt-4">
                   <button className="text-[12px] font-black text-[var(--c-navy-500)] uppercase tracking-widest hover:text-[var(--c-cyan-600)] transition-colors border-b-2 border-transparent hover:border-[var(--c-cyan-500)]">
                      Contactar a Soporte Especializado
                   </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
