"use client";

import { useEffect, useState } from "react";
import { Card, Input, Button, Switch, TextField, Label, InputGroup, toast, Skeleton } from "@heroui/react";
import { getTenantSocialLinks, updateTenantSocialLinks } from "@/lib/api/tenant";
import { getErrorMessage } from "@/lib/utils/error-message";
import type { SocialLink } from "@/lib/types/tenant";

const PLATFORMS = [
  { id: "instagram", name: "Instagram" },
  { id: "facebook", name: "Facebook" },
  { id: "tiktok", name: "TikTok" },
  { id: "twitter", name: "X (Twitter)" },
  { id: "youtube", name: "YouTube" },
];

export function SocialLinksConfig() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getTenantSocialLinks()
      .then((fetched) => {
        setLinks(fetched);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getLinkForPlatform = (platformId: string) => {
    return links.find((l) => l.platform?.toLowerCase() === platformId) || { platform: platformId, url: "", is_active: false, sort_order: 0 };
  };

  const handleUrlChange = (platformId: string, url: string) => {
    setLinks((prev) => {
      const existing = prev.find((l) => l.platform?.toLowerCase() === platformId);
      if (existing) {
        return prev.map((l) => (l.platform?.toLowerCase() === platformId ? { ...l, url, is_active: !!url } : l));
      }
      return [...prev, { platform: platformId.toUpperCase(), url, is_active: !!url, sort_order: prev.length }];
    });
  };

  const handleToggleActive = (platformId: string, isActive: boolean) => {
    setLinks((prev) => {
      const existing = prev.find((l) => l.platform?.toLowerCase() === platformId);
      if (existing) {
        return prev.map((l) => (l.platform?.toLowerCase() === platformId ? { ...l, is_active: isActive } : l));
      }
      return [...prev, { platform: platformId.toUpperCase(), url: "", is_active: isActive, sort_order: prev.length }];
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateTenantSocialLinks({ links });
      toast.success("Redes sociales actualizadas");
    } catch (error: unknown) {
      toast.danger(getErrorMessage(error, "Error al guardar redes sociales"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-[var(--surface)] border border-[var(--border)] p-6">
        <Skeleton className="h-6 w-48 rounded-lg mb-1" />
        <Skeleton className="h-4 w-3/4 max-w-md rounded-lg mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="w-[120px] flex-shrink-0">
                <Skeleton className="h-5 w-24 rounded" />
              </div>
              <Skeleton className="h-10 w-full rounded-xl flex-1" />
              <div className="flex items-center gap-2 pl-1 pt-2 sm:pt-0">
                <Skeleton className="h-6 w-10 rounded-full" />
                <Skeleton className="h-4 w-12 rounded" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const inputWrapperClass = "flex flex-col space-y-1.5 flex-1";
  const labelClass = "text-[var(--muted)] text-sm font-medium";
  const groupClass = "flex items-center gap-2 border border-[var(--border)] bg-[var(--surface)] rounded-xl px-3 py-2";
  const inputClass = "w-full bg-transparent focus:outline-none text-[var(--foreground)]";

  return (
    <Card className="bg-[var(--surface)] border border-[var(--border)] p-6">
      <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">Redes Sociales</h3>
      <p className="text-[var(--muted)] text-sm mb-6">Administra los enlaces a tus perfiles sociales. Estos aparecerán en tu tienda pública.</p>

      <div className="space-y-4">
        {PLATFORMS.map((platform) => {
          const linkData = getLinkForPlatform(platform.id);
          return (
            <div key={platform.id} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="w-[120px] flex-shrink-0">
                <Label className={labelClass}>{platform.name}</Label>
              </div>
              <TextField name={platform.id} className={inputWrapperClass}>
                <InputGroup className={groupClass}>
                  <Input
                    type="url"
                    placeholder={`https://${platform.id}.com/tu-usuario`}
                    value={linkData.url}
                    onChange={(e) => handleUrlChange(platform.id, e.target.value)}
                    className={inputClass}
                  />
                </InputGroup>
              </TextField>
              <div className="flex items-center gap-2 pt-2 sm:pt-0 pl-1">
                <Switch
                  isSelected={linkData.is_active as boolean}
                  onChange={(isSelected: boolean) => handleToggleActive(platform.id, isSelected)}
                  isDisabled={!linkData.url}
                >
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                </Switch>
                <span className="text-xs text-[var(--muted)]">{linkData.is_active ? "Visible" : "Oculto"}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <Button variant="primary" onPress={handleSave} isDisabled={saving}>
          {saving ? "Guardando..." : "Guardar Redes Sociales"}
        </Button>
      </div>
    </Card>
  );
}
