"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Image as ImageIcon, Save, CreditCard } from "lucide-react";
import { useTenantConfig } from "@/lib/hooks/use-tenant-config";
import { ImageUploader } from "@/components/ui/ImageUploader";

export function ContactConfig() {
  const { config, tenant, isLoading, isSaving, updateConfig } = useTenantConfig();

  const [form, setForm] = useState({
    whatsapp_number: "",
    contact_email: "",
    google_maps_url: "",
    footer_logo_url: "",
    payment_methods_image: "",
  });

  useEffect(() => {
    if (!isLoading && config) {
      setForm({
        whatsapp_number: config.whatsapp_number ?? "",
        contact_email: config.contact_email ?? "",
        google_maps_url: config.google_maps_url ?? "",
        footer_logo_url: config.footer_logo_url ?? "",
        payment_methods_image: config.payment_methods_image ?? "",
      });
    }
  }, [isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    try {
      await updateConfig({
        whatsapp_number: form.whatsapp_number || undefined,
        contact_email: form.contact_email || undefined,
        google_maps_url: form.google_maps_url || undefined,
        footer_logo_url: form.footer_logo_url || undefined,
        payment_methods_image: form.payment_methods_image || undefined,
      });
      toast.success("Datos de contacto actualizados");
    } catch {
      // error handled by hook
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-[300px] w-full rounded-[32px]" />
        <Skeleton className="h-[200px] w-full rounded-[32px]" />
      </div>
    );
  }

  const labelClass = "text-[11px] font-bold text-[var(--c-gray-400)] uppercase tracking-widest mb-2 flex items-center gap-2";
  const inputClass = "h-11 rounded-xl border-[var(--c-gray-200)] bg-white px-4 text-sm text-[var(--c-gray-800)] font-bold focus:ring-[var(--c-navy-500)]/10 transition-all shadow-sm";
  const tenantId = (tenant?.id as string) ?? "";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Contacto directo */}
      <Card className="bg-white border border-[var(--c-gray-100)] rounded-[32px] shadow-sm overflow-hidden">
        <div className="p-8 border-b border-[var(--c-gray-50)] bg-[var(--c-gray-50)]/30 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-[var(--c-navy-500)]/5 text-[var(--c-navy-500)]">
            <Phone className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-[var(--c-gray-800)] tracking-tight">Contacto Directo</h3>
            <p className="text-xs text-[var(--c-gray-400)] font-medium">WhatsApp y email que se muestran en el storefront y footer</p>
          </div>
        </div>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2 flex flex-col">
              <Label className={labelClass}><Phone className="h-3 w-3" /> WhatsApp</Label>
              <Input
                value={form.whatsapp_number}
                onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
                placeholder="+56912345678"
                className={inputClass}
              />
              <p className="text-[10px] text-[var(--c-gray-400)] font-medium">Formato: +56912345678 (con código de país)</p>
            </div>
            <div className="space-y-2 flex flex-col">
              <Label className={labelClass}><Mail className="h-3 w-3" /> Email de Contacto</Label>
              <Input
                type="email"
                value={form.contact_email}
                onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                placeholder="contacto@tutienda.cl"
                className={inputClass}
              />
              <p className="text-[10px] text-[var(--c-gray-400)] font-medium">Sobreescribe el email principal en el footer</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ubicación */}
      <Card className="bg-white border border-[var(--c-gray-100)] rounded-[32px] shadow-sm overflow-hidden">
        <div className="p-8 border-b border-[var(--c-gray-50)] bg-[var(--c-gray-50)]/30 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-[var(--c-cyan-500)]/5 text-[var(--c-cyan-500)]">
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-[var(--c-gray-800)] tracking-tight">Google Maps</h3>
            <p className="text-xs text-[var(--c-gray-400)] font-medium">URL para mostrar en la página Nosotros</p>
          </div>
        </div>
        <CardContent className="p-8 space-y-4">
          <div className="space-y-2 flex flex-col">
            <Label className={labelClass}>URL de Google Maps</Label>
            <Input
              value={form.google_maps_url}
              onChange={(e) => setForm({ ...form, google_maps_url: e.target.value })}
              placeholder="https://maps.google.com/?q=..."
              className={inputClass}
            />
          </div>
        </CardContent>
      </Card>

      {/* Imágenes del footer */}
      <Card className="bg-white border border-[var(--c-gray-100)] rounded-[32px] shadow-sm overflow-hidden">
        <div className="p-8 border-b border-[var(--c-gray-50)] bg-[var(--c-gray-50)]/30 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/5 text-emerald-500">
            <ImageIcon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-[var(--c-gray-800)] tracking-tight">Imágenes del Footer</h3>
            <p className="text-xs text-[var(--c-gray-400)] font-medium">Logo alternativo y banner de métodos de pago</p>
          </div>
        </div>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3 flex flex-col">
              <Label className={labelClass}><ImageIcon className="h-3 w-3" /> Logo del Footer</Label>
              <p className="text-[10px] text-[var(--c-gray-400)] font-medium -mt-2">Logo alternativo para fondo oscuro del footer</p>
              <ImageUploader
                entityType="store_logo"
                entityId={tenantId}
                currentUrl={form.footer_logo_url}
                variant="logo"
                onUploaded={({ public_url }) => setForm((f) => ({ ...f, footer_logo_url: public_url }))}
              />
            </div>
            <div className="space-y-3 flex flex-col">
              <Label className={labelClass}><CreditCard className="h-3 w-3" /> Imagen Métodos de Pago</Label>
              <p className="text-[10px] text-[var(--c-gray-400)] font-medium -mt-2">Banner con los métodos de pago que aceptas</p>
              <ImageUploader
                entityType="store_cover"
                entityId={tenantId}
                currentUrl={form.payment_methods_image}
                variant="banner"
                onUploaded={({ public_url }) => setForm((f) => ({ ...f, payment_methods_image: public_url }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-2">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[var(--c-navy-500)] hover:bg-[var(--c-navy-600)] text-white shadow-xl shadow-[var(--c-navy-500)]/20 rounded-2xl px-12 h-14 w-full sm:w-auto font-black text-sm uppercase tracking-widest transition-all"
        >
          {isSaving ? "Guardando..." : "Guardar Contacto"}
          <Save className="h-4 w-4 ml-3" />
        </Button>
      </div>
    </div>
  );
}
