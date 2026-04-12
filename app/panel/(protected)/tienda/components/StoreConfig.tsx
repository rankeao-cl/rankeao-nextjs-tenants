"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import {
  getMyTenant,
  updateMyTenant,
  setTenantSlug,
  tenantGoPublic,
  tenantGoPrivate,
  setTenantLogo,
  setTenantBanner,
} from "@/lib/api/tenant";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { Globe, MapPin, Store, Palette, Eye } from "lucide-react";

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
      <div className="space-y-6">
        <Skeleton className="h-[280px] w-full rounded-xl" />
        <Skeleton className="h-[220px] w-full rounded-xl" />
        <Skeleton className="h-[80px] w-full rounded-xl" />
      </div>
    );
  }

  if (!tenant) {
    return (
      <p className="text-red-500 font-semibold">
        Error: No se pudo cargar la información de la tienda.
      </p>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Identidad Visual */}
      <section className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 p-5 border-b border-[var(--border)]">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Palette className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              Identidad Visual
            </h3>
            <p className="text-xs text-[var(--muted-foreground)]">
              Logo, banner y vista previa pública
            </p>
          </div>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-[var(--muted-foreground)]">
                  Logotipo
                </Label>
                <ImageUploader
                  entityType="store_logo"
                  entityId={(tenant?.id as string) || ""}
                  currentUrl={formData.logoUrl}
                  variant="logo"
                  onUploaded={async ({ public_url }) => {
                    setFormData((prev) => ({ ...prev, logoUrl: public_url }));
                    await setTenantLogo(public_url);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-[var(--muted-foreground)]">
                  Portada / Banner
                </Label>
                <ImageUploader
                  entityType="store_cover"
                  entityId={(tenant?.id as string) || ""}
                  currentUrl={formData.bannerUrl}
                  variant="banner"
                  onUploaded={async ({ public_url }) => {
                    setFormData((prev) => ({
                      ...prev,
                      bannerUrl: public_url,
                    }));
                    await setTenantBanner(public_url);
                  }}
                />
              </div>
            </div>

            {/* Preview */}
            <div className="relative rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] min-h-[180px]">
              <div className="absolute inset-0">
                {formData.bannerUrl ? (
                  <img
                    src={formData.bannerUrl}
                    alt=""
                    className="w-full h-full object-cover opacity-60"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Store className="h-10 w-10 text-[var(--border)]" />
                  </div>
                )}
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 flex items-end gap-3 bg-gradient-to-t from-black/30 to-transparent">
                <div className="w-14 h-14 rounded-xl bg-[var(--card)] p-1.5 shadow-lg border border-white/20">
                  {formData.logoUrl ? (
                    <img
                      src={formData.logoUrl}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                      <Store className="h-5 w-5 text-primary" />
                    </div>
                  )}
                </div>
                <div className="text-white drop-shadow-md pb-0.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider opacity-80">
                    Vista previa
                  </p>
                  <h4 className="text-sm font-bold tracking-tight">
                    {formData.name || "Nombre de Tienda"}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ubicación y Dominio */}
      <section className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 p-5 border-b border-[var(--border)]">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              Ubicación y Dominio
            </h3>
            <p className="text-xs text-[var(--muted-foreground)]">
              Cómo te encuentran y dónde operas
            </p>
          </div>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[var(--muted-foreground)]">
                Nombre Comercial
              </Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="h-10 bg-[var(--surface)] border-[var(--border)]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[var(--muted-foreground)]">
                Subdominio Rankeao
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[var(--muted-foreground)]">
                  rankeao.cl/
                </span>
                <Input
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="h-10 bg-[var(--surface)] border-[var(--border)] pl-[80px] font-mono lowercase"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[var(--muted-foreground)]">
                  País
                </Label>
                <Input
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="h-10 bg-[var(--surface)] border-[var(--border)]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[var(--muted-foreground)]">
                  Ciudad
                </Label>
                <Input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="h-10 bg-[var(--surface)] border-[var(--border)]"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[var(--muted-foreground)] flex items-center gap-1.5">
                <MapPin className="h-3 w-3" /> Región / Estado
              </Label>
              <Input
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="h-10 bg-[var(--surface)] border-[var(--border)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Visibilidad */}
      <section className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
        <div className="flex flex-col sm:flex-row gap-5 justify-between sm:items-center">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-xl transition-colors ${
                tenant.is_public
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-red-500/10 text-red-500"
              }`}
            >
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Presencia en el Directorio
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                Define si tu tienda es visible en las búsquedas globales
              </p>
            </div>
          </div>
          <div
            className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-colors ${
              tenant.is_public
                ? "bg-emerald-500/5 border-emerald-500/20"
                : "bg-red-500/5 border-red-500/20"
            }`}
          >
            <span
              className={`text-xs font-semibold ${
                tenant.is_public ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {tenant.is_public ? "Pública" : "Privada"}
            </span>
            <Switch
              checked={!!tenant.is_public}
              onCheckedChange={async (isSelected: boolean) => {
                try {
                  if (isSelected) await tenantGoPublic();
                  else await tenantGoPrivate();
                  setTenant({ ...tenant, is_public: isSelected });
                  toast.success(
                    `La tienda ahora es ${isSelected ? "pública" : "privada"}`
                  );
                } catch (err: unknown) {
                  const error = err as Error;
                  toast.error(error.message || "Error al cambiar estado");
                }
              }}
            />
          </div>
        </div>
      </section>

      {/* Save */}
      <div className="flex justify-end">
        <Button variant="default" onClick={handleSave} disabled={saving} size="lg">
          {saving ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </div>
  );
}
