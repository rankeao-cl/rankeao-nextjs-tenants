"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Image as ImageIcon, Save, Layers, Grid3X3, MessageSquare, LayoutTemplate, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { useTenantConfig } from "@/lib/hooks/use-tenant-config";
import { ImageUploader } from "@/components/ui/ImageUploader";
import type { CarouselSlide, CategoryTile, TenantHomeSections } from "@/lib/types/tenant";

function emptySlide(): CarouselSlide {
  return { image_url: "", link_url: "", link_text: "", alt_text: "", title: "", subtitle: "" };
}

function emptyTile(): CategoryTile {
  return { image_url: "", link_url: "", title: "" };
}

function moveItem<T>(arr: T[], from: number, to: number): T[] {
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function StorefrontConfig() {
  const { config, tenant, isLoading, isSaving, updateConfig } = useTenantConfig();

  const [promoText, setPromoText] = useState("");
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [tiles, setTiles] = useState<CategoryTile[]>([]);
  const [communityImages, setCommunityImages] = useState<CategoryTile[]>([]);
  const [sections, setSections] = useState<TenantHomeSections>({});

  useEffect(() => {
    if (!isLoading && config) {
      setPromoText(config.promo_bar_text ?? "");
      setSlides(config.carousel_slides ?? config.carousel_images ?? []);
      setTiles(config.category_tiles ?? []);
      setCommunityImages(config.community_images ?? []);
      setSections(config.home_sections ?? {});
    }
  }, [isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    try {
      await updateConfig({
        promo_bar_text: promoText || undefined,
        carousel_slides: slides.filter((s) => s.image_url),
        carousel_images: slides.filter((s) => s.image_url),
        category_tiles: tiles.filter((t) => t.image_url),
        community_images: communityImages.filter((i) => i.image_url),
        home_sections: sections,
      });
      toast.success("Vitrina actualizada correctamente");
    } catch {
      // error handled by hook
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-[250px] w-full rounded-[32px]" />
        <Skeleton className="h-[400px] w-full rounded-[32px]" />
        <Skeleton className="h-[300px] w-full rounded-[32px]" />
      </div>
    );
  }

  const labelClass = "text-[11px] font-bold text-[var(--c-gray-400)] uppercase tracking-widest mb-1 flex items-center gap-2";
  const inputClass = "h-11 rounded-xl border-[var(--c-gray-200)] bg-white px-4 text-sm text-[var(--c-gray-800)] font-bold focus:ring-[var(--c-navy-500)]/10 transition-all shadow-sm";
  const inputSmClass = "h-9 rounded-lg border-[var(--c-gray-200)] bg-white px-3 text-xs text-[var(--c-gray-800)] font-medium shadow-sm";
  const tenantId = (tenant?.id as string) ?? "";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Promo Bar */}
      <Card className="bg-white border border-[var(--c-gray-100)] rounded-[32px] shadow-sm overflow-hidden">
        <div className="p-8 border-b border-[var(--c-gray-50)] bg-[var(--c-gray-50)]/30 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-[var(--c-navy-500)]/5 text-[var(--c-navy-500)]">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-[var(--c-gray-800)] tracking-tight">Barra de Promoción</h3>
            <p className="text-xs text-[var(--c-gray-400)] font-medium">Mensaje que aparece en la parte superior del sitio</p>
          </div>
        </div>
        <CardContent className="p-8 space-y-4">
          <div className="space-y-2 flex flex-col">
            <Label className={labelClass}>Texto de la barra</Label>
            <Input
              value={promoText}
              onChange={(e) => setPromoText(e.target.value)}
              placeholder="Envíos gratis sobre $50.000 · Retiro en tienda disponible"
              className={inputClass}
            />
          </div>
          {promoText && (
            <div className="rounded-xl bg-black text-white text-center text-xs font-medium py-2 px-4">
              {promoText}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Carousel Hero */}
      <Card className="bg-white border border-[var(--c-gray-100)] rounded-[32px] shadow-sm overflow-hidden">
        <div className="p-8 border-b border-[var(--c-gray-50)] bg-[var(--c-gray-50)]/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[var(--c-cyan-500)]/5 text-[var(--c-cyan-500)]">
              <ImageIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[var(--c-gray-800)] tracking-tight">Carrusel Hero</h3>
              <p className="text-xs text-[var(--c-gray-400)] font-medium">Imágenes del banner principal en el home</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSlides([...slides, emptySlide()])}
            className="rounded-xl border-[var(--c-gray-200)] font-bold text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Agregar Slide
          </Button>
        </div>
        <CardContent className="p-8 space-y-6">
          {slides.length === 0 && (
            <p className="text-sm text-[var(--c-gray-400)] text-center py-8 font-medium">
              Sin slides. Agrega uno para mostrar el carrusel en el home.
            </p>
          )}
          {slides.map((slide, i) => (
            <div key={i} className="border border-[var(--c-gray-100)] rounded-2xl p-6 space-y-4 bg-[var(--c-gray-50)]/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase tracking-widest text-[var(--c-gray-400)]">Slide {i + 1}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => i > 0 && setSlides(moveItem(slides, i, i - 1))}
                    disabled={i === 0}
                    className="p-1.5 rounded-lg hover:bg-[var(--c-gray-100)] disabled:opacity-30 transition-colors"
                  >
                    <ChevronUp className="h-3.5 w-3.5 text-[var(--c-gray-500)]" />
                  </button>
                  <button
                    onClick={() => i < slides.length - 1 && setSlides(moveItem(slides, i, i + 1))}
                    disabled={i === slides.length - 1}
                    className="p-1.5 rounded-lg hover:bg-[var(--c-gray-100)] disabled:opacity-30 transition-colors"
                  >
                    <ChevronDown className="h-3.5 w-3.5 text-[var(--c-gray-500)]" />
                  </button>
                  <button
                    onClick={() => setSlides(slides.filter((_, idx) => idx !== i))}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="shrink-0">
                  <Label className={labelClass}>Imagen</Label>
                  <ImageUploader
                    entityType="store_cover"
                    entityId={tenantId}
                    currentUrl={slide.image_url}
                    variant="banner"
                    onUploaded={({ public_url }) => {
                      const next = [...slides];
                      next[i] = { ...next[i], image_url: public_url };
                      setSlides(next);
                    }}
                  />
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className={labelClass}>Título</Label>
                    <Input value={slide.title ?? ""} onChange={(e) => { const n = [...slides]; n[i] = { ...n[i], title: e.target.value }; setSlides(n); }} placeholder="Título del slide" className={inputSmClass} />
                  </div>
                  <div className="space-y-1">
                    <Label className={labelClass}>Subtítulo</Label>
                    <Input value={slide.subtitle ?? ""} onChange={(e) => { const n = [...slides]; n[i] = { ...n[i], subtitle: e.target.value }; setSlides(n); }} placeholder="Subtítulo" className={inputSmClass} />
                  </div>
                  <div className="space-y-1">
                    <Label className={labelClass}>Link URL</Label>
                    <Input value={slide.link_url ?? ""} onChange={(e) => { const n = [...slides]; n[i] = { ...n[i], link_url: e.target.value }; setSlides(n); }} placeholder="/catalogo" className={inputSmClass} />
                  </div>
                  <div className="space-y-1">
                    <Label className={labelClass}>Texto del Link</Label>
                    <Input value={slide.link_text ?? ""} onChange={(e) => { const n = [...slides]; n[i] = { ...n[i], link_text: e.target.value }; setSlides(n); }} placeholder="Ver catálogo" className={inputSmClass} />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <Label className={labelClass}>Texto Alternativo (SEO)</Label>
                    <Input value={slide.alt_text ?? ""} onChange={(e) => { const n = [...slides]; n[i] = { ...n[i], alt_text: e.target.value }; setSlides(n); }} placeholder="Descripción de la imagen" className={inputSmClass} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Category Tiles */}
      <Card className="bg-white border border-[var(--c-gray-100)] rounded-[32px] shadow-sm overflow-hidden">
        <div className="p-8 border-b border-[var(--c-gray-50)] bg-[var(--c-gray-50)]/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-purple-500/5 text-purple-500">
              <Grid3X3 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[var(--c-gray-800)] tracking-tight">Tiles de Categorías</h3>
              <p className="text-xs text-[var(--c-gray-400)] font-medium">Imágenes cuadradas que enlazan a categorías del catálogo</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTiles([...tiles, emptyTile()])}
            className="rounded-xl border-[var(--c-gray-200)] font-bold text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Agregar Tile
          </Button>
        </div>
        <CardContent className="p-8">
          {tiles.length === 0 && (
            <p className="text-sm text-[var(--c-gray-400)] text-center py-8 font-medium">Sin tiles. Si no configuras esto, el home no mostrará la sección de categorías.</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tiles.map((tile, i) => (
              <div key={i} className="border border-[var(--c-gray-100)] rounded-2xl p-4 space-y-3 bg-[var(--c-gray-50)]/30">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--c-gray-400)]">Tile {i + 1}</span>
                  <button onClick={() => setTiles(tiles.filter((_, idx) => idx !== i))} className="p-1 rounded-lg hover:bg-red-50 text-red-400 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <ImageUploader
                  entityType="store_cover"
                  entityId={tenantId}
                  currentUrl={tile.image_url}
                  variant="square"
                  onUploaded={({ public_url }) => { const n = [...tiles]; n[i] = { ...n[i], image_url: public_url }; setTiles(n); }}
                />
                <Input value={tile.title ?? ""} onChange={(e) => { const n = [...tiles]; n[i] = { ...n[i], title: e.target.value }; setTiles(n); }} placeholder="Título" className={inputSmClass} />
                <Input value={tile.link_url ?? ""} onChange={(e) => { const n = [...tiles]; n[i] = { ...n[i], link_url: e.target.value }; setTiles(n); }} placeholder="/catalogo?categoria=..." className={inputSmClass} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Community Images */}
      <Card className="bg-white border border-[var(--c-gray-100)] rounded-[32px] shadow-sm overflow-hidden">
        <div className="p-8 border-b border-[var(--c-gray-50)] bg-[var(--c-gray-50)]/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-rose-500/5 text-rose-500">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[var(--c-gray-800)] tracking-tight">Imágenes de Comunidad</h3>
              <p className="text-xs text-[var(--c-gray-400)] font-medium">Galería de fotos de tu comunidad y eventos</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCommunityImages([...communityImages, emptyTile()])}
            className="rounded-xl border-[var(--c-gray-200)] font-bold text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Agregar Imagen
          </Button>
        </div>
        <CardContent className="p-8">
          {communityImages.length === 0 && (
            <p className="text-sm text-[var(--c-gray-400)] text-center py-8 font-medium">Sin imágenes de comunidad configuradas.</p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {communityImages.map((img, i) => (
              <div key={i} className="border border-[var(--c-gray-100)] rounded-2xl p-3 space-y-2 bg-[var(--c-gray-50)]/30">
                <div className="flex justify-end">
                  <button onClick={() => setCommunityImages(communityImages.filter((_, idx) => idx !== i))} className="p-1 rounded-lg hover:bg-red-50 text-red-400 transition-colors">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
                <ImageUploader
                  entityType="store_cover"
                  entityId={tenantId}
                  currentUrl={img.image_url}
                  variant="square"
                  onUploaded={({ public_url }) => { const n = [...communityImages]; n[i] = { ...n[i], image_url: public_url }; setCommunityImages(n); }}
                />
                <Input value={img.title ?? ""} onChange={(e) => { const n = [...communityImages]; n[i] = { ...n[i], title: e.target.value }; setCommunityImages(n); }} placeholder="Descripción" className={inputSmClass} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Home Sections */}
      <Card className="bg-white border border-[var(--c-gray-100)] rounded-[32px] shadow-sm overflow-hidden">
        <div className="p-8 border-b border-[var(--c-gray-50)] bg-[var(--c-gray-50)]/30 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-500/5 text-amber-500">
            <LayoutTemplate className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-[var(--c-gray-800)] tracking-tight">Textos del Home</h3>
            <p className="text-xs text-[var(--c-gray-400)] font-medium">Personaliza los títulos de cada sección del home. Deja en blanco para usar el texto por defecto.</p>
          </div>
        </div>
        <CardContent className="p-8 space-y-8">
          {(
            [
              { key: "categories" as const, label: "Sección Categorías" },
              { key: "featured" as const, label: "Sección Destacados" },
              { key: "sale" as const, label: "Sección Ofertas" },
              { key: "new_arrivals" as const, label: "Sección Novedades" },
            ] as const
          ).map(({ key, label }) => (
            <div key={key} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label className={labelClass}>{label} — Título</Label>
                <Input
                  value={sections[key]?.title ?? ""}
                  onChange={(e) => setSections({ ...sections, [key]: { ...sections[key], title: e.target.value } })}
                  placeholder="Título de la sección"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <Label className={labelClass}>{label} — Subtítulo</Label>
                <Input
                  value={sections[key]?.subtitle ?? ""}
                  onChange={(e) => setSections({ ...sections, [key]: { ...sections[key], subtitle: e.target.value } })}
                  placeholder="Subtítulo descriptivo"
                  className={inputClass}
                />
              </div>
            </div>
          ))}

          {/* CTA Section */}
          <div className="pt-4 border-t border-[var(--c-gray-50)] space-y-4">
            <p className="text-[11px] font-black uppercase tracking-widest text-[var(--c-gray-400)]">Sección CTA (llamada a la acción)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label className={labelClass}>Título</Label>
                <Input value={sections.cta?.title ?? ""} onChange={(e) => setSections({ ...sections, cta: { ...sections.cta, title: e.target.value } })} placeholder="¿No encuentras lo que buscas?" className={inputClass} />
              </div>
              <div className="space-y-1">
                <Label className={labelClass}>Subtítulo</Label>
                <Input value={sections.cta?.subtitle ?? ""} onChange={(e) => setSections({ ...sections, cta: { ...sections.cta, subtitle: e.target.value } })} placeholder="Explora nuestro catálogo completo..." className={inputClass} />
              </div>
              <div className="space-y-1">
                <Label className={labelClass}>Texto botón catálogo</Label>
                <Input value={sections.cta?.catalog_button ?? ""} onChange={(e) => setSections({ ...sections, cta: { ...sections.cta, catalog_button: e.target.value } })} placeholder="Ver catálogo completo" className={inputClass} />
              </div>
              <div className="space-y-1">
                <Label className={labelClass}>Texto botón WhatsApp</Label>
                <Input value={sections.cta?.whatsapp_button ?? ""} onChange={(e) => setSections({ ...sections, cta: { ...sections.cta, whatsapp_button: e.target.value } })} placeholder="Contactar por WhatsApp" className={inputClass} />
              </div>
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
          {isSaving ? "Guardando..." : "Guardar Vitrina"}
          <Save className="h-4 w-4 ml-3" />
        </Button>
      </div>
    </div>
  );
}
