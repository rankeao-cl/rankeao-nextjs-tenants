"use client";

import { useAuthStore } from "@/lib/stores/auth-store";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Store, Clock, Share2, CreditCard, Sparkles, LayoutTemplate, FileText, Phone } from "lucide-react";
import { StoreConfig } from "./components/StoreConfig";
import { SchedulesConfig } from "./components/SchedulesConfig";
import { SocialLinksConfig } from "./components/SocialLinksConfig";
import { PaymentMethodsConfig } from "./components/PaymentMethodsConfig";
import { StorefrontConfig } from "./components/StorefrontConfig";
import { ContentConfig } from "./components/ContentConfig";
import { ContactConfig } from "./components/ContactConfig";

// Modular Components
import { StoreHeader } from "./components/StoreHeader";

export default function TiendaConfigPage() {
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  if (!hasHydrated || !user) {
    return (
      <div className="space-y-10 max-w-[1400px] mx-auto pb-12 px-4 sm:px-0">
        <Skeleton className="h-10 w-64 rounded-xl mb-4" />
        <div className="flex flex-col md:flex-row gap-10">
           <Skeleton className="h-64 w-full md:w-64 rounded-[32px]" />
           <Skeleton className="h-[600px] flex-1 rounded-[32px]" />
        </div>
      </div>
    );
  }

  const triggerClass = "w-full justify-start gap-4 h-12 px-6 text-[13px] font-black uppercase tracking-widest text-[var(--c-gray-400)] rounded-2xl data-[state=active]:bg-[var(--c-navy-500)] data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-[var(--c-navy-500)]/20 transition-all hover:bg-[var(--c-gray-50)] shrink-0 group";

  return (
    <div className="space-y-10 max-w-[1400px] mx-auto pb-12 px-4 sm:px-0">
      <StoreHeader />

      <Tabs defaultValue="store" className="flex flex-col md:flex-row gap-10 items-start">

        {/* Left Sidebar Menu */}
        <div className="w-full md:w-72 shrink-0 space-y-6">
           <TabsList className="w-full flex flex-row md:flex-col items-stretch justify-start bg-white border border-[var(--c-gray-100)] p-2 h-auto gap-2 rounded-[32px] shadow-sm overflow-x-auto scrollbar-hide md:overflow-visible">
             <TabsTrigger value="store" className={triggerClass}>
               <Store className="w-4 h-4 group-data-[state=active]:animate-pulse" />
               <span>Datos Generales</span>
             </TabsTrigger>

             <TabsTrigger value="storefront" className={triggerClass}>
               <LayoutTemplate className="w-4 h-4 group-data-[state=active]:animate-pulse" />
               <span>Mi Vitrina</span>
             </TabsTrigger>

             <TabsTrigger value="content" className={triggerClass}>
               <FileText className="w-4 h-4 group-data-[state=active]:animate-pulse" />
               <span>Contenido</span>
             </TabsTrigger>

             <TabsTrigger value="contact" className={triggerClass}>
               <Phone className="w-4 h-4 group-data-[state=active]:animate-pulse" />
               <span>Contacto</span>
             </TabsTrigger>

             <TabsTrigger value="schedules" className={triggerClass}>
               <Clock className="w-4 h-4 group-data-[state=active]:animate-pulse" />
               <span>Horarios</span>
             </TabsTrigger>

             <TabsTrigger value="social" className={triggerClass}>
               <Share2 className="w-4 h-4 group-data-[state=active]:animate-pulse" />
               <span>Redes Sociales</span>
             </TabsTrigger>

             <TabsTrigger value="payments" className={triggerClass}>
               <CreditCard className="w-4 h-4 group-data-[state=active]:animate-pulse" />
               <span>Cobranza</span>
             </TabsTrigger>
           </TabsList>

           <div className="hidden md:block p-6 rounded-[32px] bg-[var(--c-navy-500)]/5 border border-[var(--c-navy-500)]/10">
              <div className="flex items-center gap-2 mb-3 text-[var(--c-navy-500)]">
                 <Sparkles className="h-4 w-4" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Optimización</span>
              </div>
              <p className="text-[11px] text-[var(--c-navy-600)] font-medium leading-relaxed">
                 Completa todos los campos para mejorar el SEO de tu sucursal en el directorio principal de **Rankeao.cl**.
              </p>
           </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 w-full min-w-0">
          <TabsContent value="store" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <StoreConfig />
          </TabsContent>

          <TabsContent value="storefront" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <StorefrontConfig />
          </TabsContent>

          <TabsContent value="content" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <ContentConfig />
          </TabsContent>

          <TabsContent value="contact" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <ContactConfig />
          </TabsContent>

          <TabsContent value="schedules" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <SchedulesConfig />
          </TabsContent>

          <TabsContent value="social" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <SocialLinksConfig />
          </TabsContent>

          <TabsContent value="payments" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <PaymentMethodsConfig />
          </TabsContent>
        </div>

      </Tabs>
    </div>
  );
}
