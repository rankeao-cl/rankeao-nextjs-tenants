"use client";

import { useAuthStore } from "@/lib/stores/auth-store";
import { Tabs, Skeleton } from "@heroui/react";
import { Store, Clock, Share2, CreditCard } from "lucide-react";
import { StoreConfig } from "./components/StoreConfig";
import { SchedulesConfig } from "./components/SchedulesConfig";
import { SocialLinksConfig } from "./components/SocialLinksConfig";
import { PaymentMethodsConfig } from "./components/PaymentMethodsConfig";
import { ProfileCompleteness } from "../perfil/components/ProfileCompleteness";

export default function TiendaConfigPage() {
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  if (!hasHydrated || !user) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto w-full pb-12">
        <div>
          <Skeleton className="h-8 w-48 rounded-lg mb-2" />
          <Skeleton className="h-4 w-3/4 max-w-md rounded-lg" />
        </div>

        <div className="flex gap-6 border-b border-divider h-12 items-center">
          <Skeleton className="h-5 w-32 rounded-lg" />
          <Skeleton className="h-5 w-24 rounded-lg" />
          <Skeleton className="h-5 w-24 rounded-lg" />
          <Skeleton className="h-5 w-32 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full pb-12 pt-2">
      <div>
        <h1 className="text-[22px] font-bold text-[#2d3748] tracking-tight">
          Configuración de Tienda
        </h1>
        <p className="text-[14px] text-[#64748b] mt-1">
          Gestiona la información comercial, horarios, redes y métodos de pago de tu entorno
        </p>
      </div>

      <ProfileCompleteness />

      <Tabs className="w-full">
        <Tabs.ListContainer>
          <Tabs.List
            aria-label="Opciones de configuración de tienda"
            className="gap-2 w-full flex bg-[#f8fafc] border border-[#e2e8f0] p-1.5 rounded-full overflow-x-auto scrollbar-hide shadow-sm"
          >
            <Tabs.Tab id="store" className="relative max-w-fit px-4 h-9 flex items-center gap-2 text-[14px] font-medium text-[#64748b] data-[selected=true]:text-[#009baf] transition-colors z-10 rounded-full">
              <Store className="w-4 h-4" />
              <span>Datos de Tienda</span>
              <Tabs.Indicator className="absolute inset-0 w-full h-full bg-[#e2f6f8] rounded-full pointer-events-none -z-10" />
            </Tabs.Tab>
            <Tabs.Tab id="schedules" className="relative max-w-fit px-4 h-9 flex items-center gap-2 text-[14px] font-medium text-[#64748b] data-[selected=true]:text-[#009baf] transition-colors z-10 rounded-full">
              <Clock className="w-4 h-4" />
              <span>Horarios</span>
              <Tabs.Indicator className="absolute inset-0 w-full h-full bg-[#e2f6f8] rounded-full pointer-events-none -z-10" />
            </Tabs.Tab>
            <Tabs.Tab id="social" className="relative max-w-fit px-4 h-9 flex items-center gap-2 text-[14px] font-medium text-[#64748b] data-[selected=true]:text-[#009baf] transition-colors z-10 rounded-full">
              <Share2 className="w-4 h-4" />
              <span>Redes</span>
              <Tabs.Indicator className="absolute inset-0 w-full h-full bg-[#e2f6f8] rounded-full pointer-events-none -z-10" />
            </Tabs.Tab>
            <Tabs.Tab id="payments" className="relative max-w-fit px-4 h-9 flex items-center gap-2 text-[14px] font-medium text-[#64748b] data-[selected=true]:text-[#009baf] transition-colors z-10 rounded-full">
              <CreditCard className="w-4 h-4" />
              <span>Métodos de Pago</span>
              <Tabs.Indicator className="absolute inset-0 w-full h-full bg-[#e2f6f8] rounded-full pointer-events-none -z-10" />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>

        <Tabs.Panel id="store" className="pt-6">
          <StoreConfig />
        </Tabs.Panel>

        <Tabs.Panel id="schedules" className="pt-6">
          <SchedulesConfig />
        </Tabs.Panel>

        <Tabs.Panel id="social" className="pt-6">
          <SocialLinksConfig />
        </Tabs.Panel>

        <Tabs.Panel id="payments" className="pt-6">
          <PaymentMethodsConfig />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
