"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { getMyTenant, updateMyTenant, setTenantSlug, tenantGoPublic, tenantGoPrivate, setTenantLogo, setTenantBanner } from "@/lib/api/tenant";
import { ImageIcon, Globe, MapPin, Store, Palette, Eye, Save } from "lucide-react";

export function StoreConfig() {
  const [tenant, setTenant] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    city: "",
    region: "",
    country: "",
    logoUrl: "",
    bannerUrl: "",
  });

  useEffect(() => {
    getMyTenant()
      .then((data) => {
        setTenant(data);
        setFormData({
          name: (data.name as string) || "",
          slug: (data.slug as string) || "",
          city: (data.city as string) || "",
          region: (data.region as string) || "",
          country: (data.country as string) || "",
          logoUrl: (data.logo_url || data.logo || "") as string,
          bannerUrl: (data.banner_url || data.banner || "") as string,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateMyTenant({
        name: formData.name,
        city: formData.city,
        region: formData.region,
        country: formData.country,
      });
      if (tenant && formData.slug !== tenant.slug) {
        await setTenantSlug(formData.slug);
      }
      if (tenant && formData.logoUrl !== (tenant.logo_url || tenant.logo)) {
        await setTenantLogo(formData.logoUrl);
      }
      if (tenant && formData.bannerUrl !== (tenant.banner_url || tenant.banner)) {
        await setTenantBanner(formData.bannerUrl);
      }
      toast.success("Configuración actualizada exitosamente");
      const newTenant = await getMyTenant();
      setTenant(newTenant);
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Error al actualizar la configuración");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-[300px] w-full rounded-[32px]" />
        <Skeleton className="h-[250px] w-full rounded-[32px]" />
      </div>
    );
  }

  if (!tenant) return <p className="text-red-500 font-bold">Error crítico: No se pudo cargar la información de la tienda.</p>;

  const labelClass = "text-[11px] font-bold text-[var(--c-gray-400)] uppercase tracking-widest mb-2 flex items-center gap-2";
  const inputClass = "h-11 rounded-xl border-[var(--c-gray-200)] bg-white px-4 text-sm text-[var(--c-gray-800)] font-bold focus:ring-[var(--c-navy-500)]/10 transition-all shadow-sm";

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* SECCIÓN: IDENTIDAD DE MARCA */}
      <Card className="bg-white border border-[var(--c-gray-100)] rounded-[32px] shadow-sm overflow-hidden">
        <div className="p-8 border-b border-[var(--c-gray-50)] bg-[var(--c-gray-50)]/30 flex items-center gap-4">
           <div className="p-3 rounded-2xl bg-[var(--c-navy-500)]/5 text-[var(--c-navy-500)]">
              <Palette className="h-6 w-6" />
           </div>
           <div>
              <h3 className="text-lg font-black text-[var(--c-gray-800)] tracking-tight">Identidad Visual</h3>
              <p className="text-xs text-[var(--c-gray-400)] font-medium">Personaliza el aspecto público de tu sucursal</p>
           </div>
        </div>
        <CardContent className="p-8 space-y-10">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                 <div className="space-y-2 flex flex-col">
                    <Label className={labelClass}>Enlace Logotipo (URL)</Label>
                    <Input name="logoUrl" type="url" value={formData.logoUrl} onChange={handleChange} className={inputClass} placeholder="https://..." />
                 </div>
                 <div className="space-y-2 flex flex-col">
                    <Label className={labelClass}>Enlace Portada (URL)</Label>
                    <Input name="bannerUrl" type="url" value={formData.bannerUrl} onChange={handleChange} className={inputClass} placeholder="https://..." />
                 </div>
              </div>

              <div className="relative group rounded-[24px] overflow-hidden border border-[var(--c-gray-100)] shadow-inner bg-[var(--c-gray-50)] min-h-[180px]">
                 {/* Banner Preview */}
                 <div className="absolute inset-0">
                    {formData.bannerUrl ? (
                      <img src={formData.bannerUrl} alt="" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                         <ImageIcon className="h-10 w-10 text-[var(--c-gray-200)]" />
                      </div>
                    )}
                 </div>
                 {/* Logo Preview Overlay */}
                 <div className="absolute inset-x-0 bottom-0 p-6 flex items-end gap-4 bg-gradient-to-t from-black/20 to-transparent">
                    <div className="w-16 h-16 rounded-2xl bg-white p-1.5 shadow-xl border border-white/20">
                       {formData.logoUrl ? (
                         <img src={formData.logoUrl} alt="" className="w-full h-full object-contain" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center bg-[var(--c-navy-500)]/5">
                            <Store className="h-6 w-6 text-[var(--c-navy-500)]" />
                         </div>
                       )}
                    </div>
                    <div className="text-white drop-shadow-md pb-1">
                       <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Vista Previa</p>
                       <h4 className="text-sm font-black tracking-tight">{formData.name || "Nombre de Tienda"}</h4>
                    </div>
                 </div>
              </div>
           </div>
        </CardContent>
      </Card>

      {/* SECCIÓN: INFORMACIÓN GENERAL */}
      <Card className="bg-white border border-[var(--c-gray-100)] rounded-[32px] shadow-sm overflow-hidden">
        <div className="p-8 border-b border-[var(--c-gray-50)] bg-[var(--c-gray-50)]/30 flex items-center gap-4">
           <div className="p-3 rounded-2xl bg-[var(--c-cyan-500)]/5 text-[var(--c-cyan-500)]">
              <Globe className="h-6 w-6" />
           </div>
           <div>
              <h3 className="text-lg font-black text-[var(--c-gray-800)] tracking-tight">Ubicación y Dominio</h3>
              <p className="text-xs text-[var(--c-gray-400)] font-medium">Configura cómo te encuentran y dónde operas</p>
           </div>
        </div>
        <CardContent className="p-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              <div className="space-y-2 flex flex-col">
                 <Label className={labelClass}>Nombre Comercial</Label>
                 <Input name="name" value={formData.name} onChange={handleChange} className={inputClass} />
              </div>

              <div className="space-y-2 flex flex-col">
                 <Label className={labelClass}>Subdominio Rankeao</Label>
                 <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[12px] font-bold text-[var(--c-gray-400)]">rankeao.cl /</span>
                    <Input name="slug" value={formData.slug} onChange={handleChange} className={`${inputClass} pl-[88px] font-mono lowercase`} />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2 flex flex-col">
                    <Label className={labelClass}>País</Label>
                    <Input name="country" value={formData.country} onChange={handleChange} className={inputClass} />
                 </div>
                 <div className="space-y-2 flex flex-col">
                    <Label className={labelClass}>Ciudad</Label>
                    <Input name="city" value={formData.city} onChange={handleChange} className={inputClass} />
                 </div>
              </div>

              <div className="space-y-2 flex flex-col">
                 <Label className={labelClass}><MapPin className="h-3 w-3" /> Región / Estado</Label>
                 <Input name="region" value={formData.region} onChange={handleChange} className={inputClass} />
              </div>
           </div>
        </CardContent>
      </Card>

      {/* SECCIÓN: VISIBILIDAD */}
      <Card className="bg-white border border-[var(--c-gray-100)] rounded-[32px] shadow-sm overflow-hidden">
        <CardContent className="p-8">
           <div className="flex flex-col sm:flex-row gap-8 justify-between sm:items-center">
              <div className="flex items-center gap-6">
                 <div className={`p-4 rounded-full transition-all duration-500 ${tenant.is_public ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
                    <Eye className="h-6 w-6" />
                 </div>
                 <div>
                    <h3 className="text-base font-black text-[var(--c-gray-800)] tracking-tight">Presencia en el Directorio</h3>
                    <p className="text-sm text-[var(--c-gray-500)] font-medium mt-1">Define si tu tienda es visible para los algoritmos de búsqueda globale.</p>
                 </div>
              </div>
              
              <div className={`flex items-center gap-6 px-6 py-4 rounded-2xl border transition-all ${tenant.is_public ? 'bg-emerald-50/30 border-emerald-100' : 'bg-red-50/30 border-red-100'}`}>
                 <span className={`text-xs font-black uppercase tracking-widest ${tenant.is_public ? 'text-emerald-600' : 'text-red-600'}`}>
                    {tenant.is_public ? 'Sucursal Pública' : 'Modo Privado'}
                 </span>
                 <Switch 
                   checked={!!tenant.is_public}
                   onCheckedChange={async (isSelected: boolean) => {
                     try {
                       if (isSelected) await tenantGoPublic();
                       else await tenantGoPrivate();
                       setTenant({ ...tenant, is_public: isSelected });
                       toast.success(`La tienda ahora es ${isSelected ? 'pública' : 'privada'}`);
                     } catch (err: unknown) {
                       const error = err as Error;
                       toast.error(error.message || "Error al cambiar estado");
                     }
                   }} 
                 />
              </div>
           </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-[var(--c-navy-500)] hover:bg-[var(--c-navy-600)] text-white shadow-xl shadow-[var(--c-navy-500)]/20 rounded-2xl px-12 h-14 w-full sm:w-auto font-black text-sm uppercase tracking-widest transition-all"
        >
          {saving ? "Guardando Configuración..." : "Sincronizar Cambios"}
          <Save className="h-4 w-4 ml-3" />
        </Button>
      </div>
    </div>
  );
}
