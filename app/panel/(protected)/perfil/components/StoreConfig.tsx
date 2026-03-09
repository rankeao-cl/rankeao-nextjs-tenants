"use client";

import { useEffect, useState } from "react";
import { Card, Input, Button, Switch, TextField, Label, InputGroup, toast, Skeleton } from "@heroui/react";
import { getMyTenant, updateMyTenant, setTenantSlug, tenantGoPublic, tenantGoPrivate, setTenantLogo, setTenantBanner } from "@/lib/api/tenant";
import { ImageIcon } from "lucide-react";

export function StoreConfig() {
  const [tenant, setTenant] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

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
      toast.success("Información guardada correctamente");
      const newTenant = await getMyTenant();
      setTenant(newTenant);
    } catch (error: unknown) {
      const err = error as Error;
      toast.danger(err.message || "Error al actualizar la información");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-[var(--surface)] border border-[var(--border)]">
          <Card.Content className="p-6">
            <Skeleton className="h-6 w-48 rounded-lg mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-1.5">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              ))}
            </div>
            <Skeleton className="h-6 w-48 rounded-lg mt-8 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-1.5">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
          </Card.Content>
        </Card>
      </div>
    );
  }
  if (!tenant) return <p className="text-red-400">No se pudo cargar la información de la tienda.</p>;

  const inputWrapperClass = "flex flex-col space-y-1.5";
  const labelClass = "text-[var(--muted)] text-sm";
  const groupClass = "flex items-center gap-2 border border-[var(--border)] bg-[var(--surface)] rounded-xl px-3 py-2";
  const inputClass = "w-full bg-transparent focus:outline-none text-[var(--foreground)]";

  return (
    <div className="space-y-6">
      <Card className="bg-[var(--surface)] border border-[var(--border)]">
        <Card.Content className="p-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Información General</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField name="name" className={inputWrapperClass}>
              <Label className={labelClass}>Nombre de la Tienda</Label>
              <InputGroup className={groupClass}>
                <Input name="name" value={formData.name} onChange={handleChange} className={inputClass} />
              </InputGroup>
            </TextField>
            <TextField name="slug" className={inputWrapperClass}>
              <Label className={labelClass}>Slug (URL)</Label>
              <InputGroup className={groupClass}>
                <Input name="slug" value={formData.slug} onChange={handleChange} className={inputClass} />
              </InputGroup>
            </TextField>
            <TextField name="city" className={inputWrapperClass}>
              <Label className={labelClass}>Ciudad</Label>
              <InputGroup className={groupClass}>
                <Input name="city" value={formData.city} onChange={handleChange} className={inputClass} />
              </InputGroup>
            </TextField>
            <TextField name="region" className={inputWrapperClass}>
              <Label className={labelClass}>Región</Label>
              <InputGroup className={groupClass}>
                <Input name="region" value={formData.region} onChange={handleChange} className={inputClass} />
              </InputGroup>
            </TextField>
            <TextField name="country" className={inputWrapperClass}>
              <Label className={labelClass}>País</Label>
              <InputGroup className={groupClass}>
                <Input name="country" value={formData.country} onChange={handleChange} className={inputClass} />
              </InputGroup>
            </TextField>
          </div>

          <h3 className="text-lg font-semibold text-[var(--foreground)] mt-8 mb-4">Imágenes (URLs)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <TextField name="logoUrl" className={inputWrapperClass}>
                <Label className={labelClass}>URL del Logo</Label>
                <InputGroup className={groupClass}>
                  <Input name="logoUrl" type="url" value={formData.logoUrl} onChange={handleChange} className={inputClass} placeholder="https://ejemplo.com/logo.png" />
                </InputGroup>
              </TextField>
              {formData.logoUrl ? (
                <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-sunken)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.logoUrl}
                    alt="Preview Logo"
                    className="w-16 h-16 rounded-lg object-contain border border-[var(--border)] bg-white"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement)?.classList.remove('hidden'); }}
                    onLoad={(e) => { (e.currentTarget as HTMLImageElement).style.display = ''; (e.currentTarget.nextElementSibling as HTMLElement)?.classList.add('hidden'); }}
                  />
                  <div className="hidden flex items-center gap-2 text-amber-400 text-xs">
                    <ImageIcon className="w-4 h-4" />
                    <span>No se pudo cargar la imagen</span>
                  </div>
                  <span className="text-xs text-[var(--muted)]">Vista previa del logo</span>
                </div>
              ) : null}
            </div>
            <div className="space-y-3">
              <TextField name="bannerUrl" className={inputWrapperClass}>
                <Label className={labelClass}>URL del Banner</Label>
                <InputGroup className={groupClass}>
                  <Input name="bannerUrl" type="url" value={formData.bannerUrl} onChange={handleChange} className={inputClass} placeholder="https://ejemplo.com/banner.png" />
                </InputGroup>
              </TextField>
              {formData.bannerUrl ? (
                <div className="space-y-2 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-sunken)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.bannerUrl}
                    alt="Preview Banner"
                    className="w-full h-24 rounded-lg object-cover border border-[var(--border)]"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement)?.classList.remove('hidden'); }}
                    onLoad={(e) => { (e.currentTarget as HTMLImageElement).style.display = ''; (e.currentTarget.nextElementSibling as HTMLElement)?.classList.add('hidden'); }}
                  />
                  <div className="hidden flex items-center gap-2 text-amber-400 text-xs">
                    <ImageIcon className="w-4 h-4" />
                    <span>No se pudo cargar la imagen</span>
                  </div>
                  <span className="text-xs text-[var(--muted)]">Vista previa del banner</span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button variant="primary" onPress={handleSave}>
              Guardar Cambios
            </Button>
          </div>
        </Card.Content>
      </Card>

      <Card className="bg-[var(--surface)] border border-[var(--border)]">
        <Card.Content className="p-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Visibilidad</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">Tienda Pública</p>
              <p className="text-xs text-[var(--muted)]">Hace que la tienda sea visible en el directorio.</p>
            </div>
            <Switch
              isSelected={!!tenant.is_public}
              onChange={async (isSelected: boolean) => {
                try {
                  if (isSelected) await tenantGoPublic();
                  else await tenantGoPrivate();
                  setTenant({ ...tenant, is_public: isSelected });
                  toast.success("Visibilidad actualizada");
                } catch (err: unknown) {
                  const error = err as Error;
                  toast.danger(error.message || "Error al actualizar la visibilidad");
                }
              }}
            >
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
            </Switch>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
