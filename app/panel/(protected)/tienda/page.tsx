"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Store,
  Clock,
  Share2,
  CreditCard,
  LayoutTemplate,
  FileText,
  Phone,
} from "lucide-react";
import { StoreConfig } from "./components/StoreConfig";
import { SchedulesConfig } from "./components/SchedulesConfig";
import { SocialLinksConfig } from "./components/SocialLinksConfig";
import { PaymentMethodsConfig } from "./components/PaymentMethodsConfig";
import { StorefrontConfig } from "./components/StorefrontConfig";
import { ContentConfig } from "./components/ContentConfig";
import { ContactConfig } from "./components/ContactConfig";

const TABS = [
  { id: "store", label: "General", icon: Store },
  { id: "storefront", label: "Vitrina", icon: LayoutTemplate },
  { id: "content", label: "Contenido", icon: FileText },
  { id: "contact", label: "Contacto", icon: Phone },
  { id: "schedules", label: "Horarios", icon: Clock },
  { id: "social", label: "Redes", icon: Share2 },
  { id: "payments", label: "Cobranza", icon: CreditCard },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function TiendaConfigPage() {
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const [activeTab, setActiveTab] = useState<TabId>("store");

  if (!hasHydrated || !user) {
    return (
      <div className="space-y-8 max-w-[1200px] mx-auto pb-12">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-[26px] font-extrabold text-[var(--foreground)] tracking-tight">
          Configuración de Tienda
        </h1>
        <p className="text-[13px] text-[var(--muted-foreground)] font-medium mt-1">
          Personaliza la identidad, horarios y reglas de negocio de tu sucursal
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        <div
          className="inline-flex items-center gap-1 rounded-full p-1"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-secondary)]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === "store" && <StoreConfig />}
        {activeTab === "storefront" && <StorefrontConfig />}
        {activeTab === "content" && <ContentConfig />}
        {activeTab === "contact" && <ContactConfig />}
        {activeTab === "schedules" && <SchedulesConfig />}
        {activeTab === "social" && <SocialLinksConfig />}
        {activeTab === "payments" && <PaymentMethodsConfig />}
      </div>
    </div>
  );
}
