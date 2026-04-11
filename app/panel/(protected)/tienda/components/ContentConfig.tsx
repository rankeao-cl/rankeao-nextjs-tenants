"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { FileText, Save, Menu, Plus, Trash2, ChevronRight, Eye, EyeOff } from "lucide-react";
import { useTenantConfig } from "@/lib/hooks/use-tenant-config";
import type { TenantMenuItem, TenantMenuSubItem } from "@/lib/types/tenant";

function emptyMenuItem(): TenantMenuItem {
  return { label: "", href: "/catalogo", type: "link" };
}

function emptySubItem(): TenantMenuSubItem {
  return { name: "", href: "" };
}

export function ContentConfig() {
  const { config, isLoading, isSaving, updateConfig } = useTenantConfig();

  const [aboutHtml, setAboutHtml] = useState("");
  const [termsHtml, setTermsHtml] = useState("");
  const [menuItems, setMenuItems] = useState<TenantMenuItem[]>([]);
  const [aboutPreview, setAboutPreview] = useState(false);
  const [termsPreview, setTermsPreview] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && config) {
      setAboutHtml(config.about_html ?? "");
      setTermsHtml(config.terms_html ?? "");
      setMenuItems(config.menu_items ?? []);
    }
  }, [isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    try {
      await updateConfig({
        about_html: aboutHtml || undefined,
        terms_html: termsHtml || undefined,
        menu_items: menuItems.length > 0 ? menuItems : undefined,
      });
      toast.success("Contenido actualizado");
    } catch {
      // error handled by hook
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-[400px] w-full rounded-[32px]" />
        <Skeleton className="h-[400px] w-full rounded-[32px]" />
      </div>
    );
  }

  const labelClass = "text-[11px] font-bold text-[var(--c-gray-400)] uppercase tracking-widest mb-2 flex items-center gap-2";
  const inputSmClass = "h-9 rounded-lg border-[var(--c-gray-200)] bg-white px-3 text-xs text-[var(--c-gray-800)] font-medium shadow-sm";

  const updateMenuItem = (i: number, patch: Partial<TenantMenuItem>) => {
    const next = [...menuItems];
    next[i] = { ...next[i], ...patch };
    setMenuItems(next);
  };

  const addSubItem = (i: number) => {
    const next = [...menuItems];
    next[i] = { ...next[i], items: [...(next[i].items ?? []), emptySubItem()] };
    setMenuItems(next);
  };

  const updateSubItem = (menuIdx: number, subIdx: number, patch: Partial<TenantMenuSubItem>) => {
    const next = [...menuItems];
    const items = [...(next[menuIdx].items ?? [])];
    items[subIdx] = { ...items[subIdx], ...patch };
    next[menuIdx] = { ...next[menuIdx], items };
    setMenuItems(next);
  };

  const removeSubItem = (menuIdx: number, subIdx: number) => {
    const next = [...menuItems];
    next[menuIdx] = { ...next[menuIdx], items: (next[menuIdx].items ?? []).filter((_, k) => k !== subIdx) };
    setMenuItems(next);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Nosotros */}
      <Card className="bg-white border border-[var(--c-gray-100)] rounded-[32px] shadow-sm overflow-hidden">
        <div className="p-8 border-b border-[var(--c-gray-50)] bg-[var(--c-gray-50)]/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[var(--c-navy-500)]/5 text-[var(--c-navy-500)]">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[var(--c-gray-800)] tracking-tight">Página Nosotros</h3>
              <p className="text-xs text-[var(--c-gray-400)] font-medium">Contenido HTML de la página /nosotros. Puedes pegar HTML o escribir texto plano.</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAboutPreview(!aboutPreview)}
            className="rounded-xl text-xs font-bold gap-1.5"
          >
            {aboutPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {aboutPreview ? "Editar" : "Vista previa"}
          </Button>
        </div>
        <CardContent className="p-8">
          {!aboutPreview ? (
            <textarea
              value={aboutHtml}
              onChange={(e) => setAboutHtml(e.target.value)}
              rows={12}
              placeholder="<h2>Sobre nosotros</h2><p>Somos una tienda especializada en TCG...</p>"
              className="w-full rounded-xl border border-[var(--c-gray-200)] bg-white p-4 text-sm text-[var(--c-gray-800)] font-mono resize-y shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--c-navy-500)]/10"
            />
          ) : (
            <div
              className="prose prose-sm max-w-none p-4 rounded-xl border border-[var(--c-gray-100)] bg-[var(--c-gray-50)]/30 min-h-[200px]"
              dangerouslySetInnerHTML={{ __html: aboutHtml || "<p class='text-gray-400'>Sin contenido aún...</p>" }}
            />
          )}
        </CardContent>
      </Card>

      {/* Términos */}
      <Card className="bg-white border border-[var(--c-gray-100)] rounded-[32px] shadow-sm overflow-hidden">
        <div className="p-8 border-b border-[var(--c-gray-50)] bg-[var(--c-gray-50)]/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[var(--c-cyan-500)]/5 text-[var(--c-cyan-500)]">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[var(--c-gray-800)] tracking-tight">Términos y Condiciones</h3>
              <p className="text-xs text-[var(--c-gray-400)] font-medium">Contenido HTML de la página /terminos</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTermsPreview(!termsPreview)}
            className="rounded-xl text-xs font-bold gap-1.5"
          >
            {termsPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {termsPreview ? "Editar" : "Vista previa"}
          </Button>
        </div>
        <CardContent className="p-8">
          {!termsPreview ? (
            <textarea
              value={termsHtml}
              onChange={(e) => setTermsHtml(e.target.value)}
              rows={12}
              placeholder="<h2>Términos y Condiciones</h2><p>Al realizar una compra...</p>"
              className="w-full rounded-xl border border-[var(--c-gray-200)] bg-white p-4 text-sm text-[var(--c-gray-800)] font-mono resize-y shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--c-navy-500)]/10"
            />
          ) : (
            <div
              className="prose prose-sm max-w-none p-4 rounded-xl border border-[var(--c-gray-100)] bg-[var(--c-gray-50)]/30 min-h-[200px]"
              dangerouslySetInnerHTML={{ __html: termsHtml || "<p class='text-gray-400'>Sin contenido aún...</p>" }}
            />
          )}
        </CardContent>
      </Card>

      {/* Menú personalizado */}
      <Card className="bg-white border border-[var(--c-gray-100)] rounded-[32px] shadow-sm overflow-hidden">
        <div className="p-8 border-b border-[var(--c-gray-50)] bg-[var(--c-gray-50)]/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-purple-500/5 text-purple-500">
              <Menu className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[var(--c-gray-800)] tracking-tight">Menú de Navegación</h3>
              <p className="text-xs text-[var(--c-gray-400)] font-medium">
                Si configuras items aquí, el navbar los usará en vez de las categorías de la API.{" "}
                {menuItems.length > 0 && (
                  <button
                    onClick={() => setMenuItems([])}
                    className="text-red-400 hover:text-red-500 font-bold underline"
                  >
                    Restablecer a categorías automáticas
                  </button>
                )}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMenuItems([...menuItems, emptyMenuItem()])}
            className="rounded-xl border-[var(--c-gray-200)] font-bold text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Agregar Item
          </Button>
        </div>
        <CardContent className="p-8 space-y-4">
          {menuItems.length === 0 && (
            <p className="text-sm text-[var(--c-gray-400)] text-center py-8 font-medium">
              Sin menú personalizado. El navbar usará las categorías de productos automáticamente.
            </p>
          )}
          {menuItems.map((item, i) => (
            <div key={i} className="border border-[var(--c-gray-100)] rounded-2xl overflow-hidden">
              <div className="p-4 flex items-center gap-3 bg-[var(--c-gray-50)]/30">
                <button
                  onClick={() => setExpandedMenu(expandedMenu === i ? null : i)}
                  className="p-1 rounded-lg hover:bg-[var(--c-gray-100)] transition-colors"
                >
                  <ChevronRight className={`h-4 w-4 text-[var(--c-gray-400)] transition-transform ${expandedMenu === i ? "rotate-90" : ""}`} />
                </button>
                <Input
                  value={item.label}
                  onChange={(e) => updateMenuItem(i, { label: e.target.value })}
                  placeholder="Etiqueta del menú"
                  className="h-8 rounded-lg border-[var(--c-gray-200)] text-xs font-bold flex-1"
                />
                <Input
                  value={item.href}
                  onChange={(e) => updateMenuItem(i, { href: e.target.value })}
                  placeholder="/catalogo"
                  className="h-8 rounded-lg border-[var(--c-gray-200)] text-xs font-mono flex-1"
                />
                <select
                  value={item.type}
                  onChange={(e) => updateMenuItem(i, { type: e.target.value as "link" | "dropdown" | "mega" })}
                  className="h-8 rounded-lg border border-[var(--c-gray-200)] text-xs font-bold px-2 bg-white text-[var(--c-gray-700)]"
                >
                  <option value="link">Link</option>
                  <option value="dropdown">Dropdown</option>
                  <option value="mega">Mega</option>
                </select>
                <button
                  onClick={() => setMenuItems(menuItems.filter((_, k) => k !== i))}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Sub-items (dropdown/mega) */}
              {expandedMenu === i && item.type !== "link" && (
                <div className="p-4 border-t border-[var(--c-gray-100)] space-y-2">
                  <div className="flex items-center justify-between mb-3">
                    <Label className={labelClass}>Sub-items</Label>
                    <Button variant="ghost" size="sm" onClick={() => addSubItem(i)} className="text-xs h-7 rounded-lg font-bold">
                      <Plus className="h-3 w-3 mr-1" /> Agregar
                    </Button>
                  </div>
                  {(item.items ?? []).map((sub, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <Input
                        value={sub.name}
                        onChange={(e) => updateSubItem(i, j, { name: e.target.value })}
                        placeholder="Nombre"
                        className={inputSmClass + " flex-1"}
                      />
                      <Input
                        value={sub.href}
                        onChange={(e) => updateSubItem(i, j, { href: e.target.value })}
                        placeholder="/catalogo?q=..."
                        className={inputSmClass + " flex-1 font-mono"}
                      />
                      <button onClick={() => removeSubItem(i, j)} className="p-1 rounded-lg hover:bg-red-50 text-red-400 transition-colors shrink-0">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {(item.items ?? []).length === 0 && (
                    <p className="text-[11px] text-[var(--c-gray-400)] font-medium">Sin sub-items aún.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end pt-2">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[var(--c-navy-500)] hover:bg-[var(--c-navy-600)] text-white shadow-xl shadow-[var(--c-navy-500)]/20 rounded-2xl px-12 h-14 w-full sm:w-auto font-black text-sm uppercase tracking-widest transition-all"
        >
          {isSaving ? "Guardando..." : "Guardar Contenido"}
          <Save className="h-4 w-4 ml-3" />
        </Button>
      </div>
    </div>
  );
}
