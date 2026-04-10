"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { getTenantSocialLinks, updateTenantSocialLinks } from "@/lib/api/tenant";
import { getErrorMessage } from "@/lib/utils/error-message";
import type { SocialLink } from "@/lib/types/tenant";

const PLATFORMS = [
  {
    id: "instagram",
    name: "Instagram",
    color: "#E4405F",
    gradient: "from-[#f09433] via-[#e6683c] to-[#dc2743]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    id: "facebook",
    name: "Facebook",
    color: "#1877F2",
    gradient: "from-[#1877F2] to-[#0C63D4]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    id: "tiktok",
    name: "TikTok",
    color: "#000000",
    gradient: "from-[#25F4EE] via-[#FE2C55] to-[#000000]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    color: "#000000",
    gradient: "from-[#1DA1F2] to-[#0C85D0]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: "youtube",
    name: "YouTube",
    color: "#FF0000",
    gradient: "from-[#FF0000] to-[#CC0000]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
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
      toast.error(getErrorMessage(error, "Error al guardar redes sociales"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-[#ffffff] border border-[var(--c-gray-200)] p-6">
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

    const inputClass = "flex h-10 w-full rounded-xl border border-[var(--c-gray-200)] bg-white px-3 py-2 text-sm text-[var(--c-gray-800)] placeholder:text-[var(--c-gray-400)] focus:outline-none focus:border-[var(--c-navy-400)] transition-colors";

  return (
    <Card className="bg-[#ffffff] border border-[var(--c-gray-200)] p-6">
      <h3 className="text-lg font-semibold text-[var(--c-gray-800)] mb-1">Redes Sociales</h3>
      <p className="text-[var(--c-gray-500)] text-sm mb-6">Administra los enlaces a tus perfiles sociales. Estos aparecerán en tu tienda pública.</p>

      <div className="space-y-4">
        {PLATFORMS.map((platform) => {
          const linkData = getLinkForPlatform(platform.id);
          return (
            <div
              key={platform.id}
              className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-3 rounded-xl border border-[var(--c-gray-200)] bg-[var(--c-gray-100)] transition-all hover:border-[var(--border-hover)]"
            >
              <div className="flex items-center gap-3 w-[140px] flex-shrink-0">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: platform.color }}
                >
                  {platform.icon}
                </div>
                <Label className="text-sm font-medium text-[var(--c-gray-800)]">{platform.name}</Label>
              </div>
              <div className="flex flex-col space-y-1.5 flex-1">
                <div>
                  <Input
                    type="url"
                    placeholder={`https://${platform.id}.com/tu-usuario`}
                    value={linkData.url}
                    onChange={(e) => handleUrlChange(platform.id, e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 sm:pt-0 pl-1">
                <Switch checked={linkData.is_active as boolean}
                  onCheckedChange={(isSelected: boolean) => handleToggleActive(platform.id, isSelected)}
                  disabled={!linkData.url} />
                <span className={`text-xs font-medium ${linkData.is_active ? "text-emerald-400" : "text-[var(--c-gray-500)]"}`}>
                  {linkData.is_active ? "Visible" : "Oculto"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <Button variant="default" onClick={handleSave} disabled={saving}>
          {saving ? "Guardando..." : "Guardar Redes Sociales"}
        </Button>
      </div>
    </Card>
  );
}
