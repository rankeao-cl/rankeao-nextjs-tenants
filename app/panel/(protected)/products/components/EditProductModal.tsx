"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Info, Image as ImageIcon, Layers, Plus, Trash2, Save, X, Box } from "lucide-react";
import {
  getProduct,
  updateProduct,
  addProductImage,
  deleteProductImage,
  addProductVariant,
  updateProductVariant,
  deleteProductVariant,
} from "@/lib/api/products";
import { getErrorMessage } from "@/lib/utils/error-message";
import { useQueryClient } from "@tanstack/react-query";
import type { ProductImage, ProductVariant } from "@/lib/types/products";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(value);

const getImageUrl = (url?: string) => {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://rankeao-go-gateway-production.up.railway.app/api/v1";
  const host = baseUrl.replace(/\/api\/v1\/?$/, "");
  return `${host}${url.startsWith("/") ? "" : "/"}${url}`;
};

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string | null;
  onProductUpdated: () => void;
}

export function EditProductModal({ isOpen, onClose, productId, onProductUpdated }: EditProductModalProps) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({ name: "", sku: "", price: "", stock_quantity: "", description: "" });
  const [images, setImages] = useState<ProductImage[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  const fetchProduct = async () => {
    if (!productId) return;
    try {
      setLoading(true);
      const data = await getProduct(productId);
      setForm({
        name: data.name || "",
        sku: data.sku || "",
        price: data.price?.toString() || "",
        stock_quantity: data.stock_quantity?.toString() || "",
        description: data.description || "",
      });
      setImages(data.images || []);
      setVariants(data.variants || []);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al cargar producto"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && productId) {
      fetchProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, productId]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
    queryClient.invalidateQueries({ queryKey: ["product", productId] });
    onProductUpdated();
  };

  const handleSaveDetails = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!productId) return;
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const sku = formData.get("sku") as string;
    const priceStr = formData.get("price") as string;
    const stockStr = formData.get("stock_quantity") as string;
    const description = formData.get("description") as string;

    if (!name || !priceStr) {
      toast.error("Nombre y precio son requeridos");
      return;
    }
    
    const priceNum = Number(priceStr);
    if (isNaN(priceNum) || priceNum < 0) {
      toast.error("El precio debe ser un número válido");
      return;
    }

    try {
      setSaving(true);
      await updateProduct(productId, {
        name,
        sku,
        price: priceNum,
        stock_quantity: stockStr ? Number(stockStr) : 0,
        description,
      });
      toast.success("Detalles actualizados");
      invalidate();
      onClose();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al actualizar producto"));
    } finally {
      setSaving(false);
    }
  };

  const handleAddImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const url = formData.get("url") as string;
    
    if (!productId || !url) return;
    try {
      await addProductImage(productId, { url });
      toast.success("Imagen agregada");
      (e.target as HTMLFormElement).reset();
      fetchProduct();
      invalidate();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al agregar imagen"));
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!productId) return;
    try {
      await deleteProductImage(productId, imageId);
      toast.success("Imagen eliminada");
      fetchProduct();
      invalidate();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al eliminar imagen"));
    }
  };

  const handleAddVariant = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!productId) return;
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const sku = formData.get("sku") as string;
    const priceDiffStr = formData.get("price_diff") as string;
    const stockStr = formData.get("stock") as string;

    if (!name) {
      toast.error("Nombre de variante es requerido");
      return;
    }

    try {
      await addProductVariant(productId, {
        name,
        sku,
        price_diff: priceDiffStr ? Number(priceDiffStr) : 0,
        stock: stockStr ? Number(stockStr) : 0,
      });
      toast.success("Variante agregada");
      (e.target as HTMLFormElement).reset();
      fetchProduct();
      invalidate();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al agregar variante"));
    }
  };

  const handleUpdateVariant = async (variantId: string, data: Record<string, unknown>) => {
    if (!productId) return;
    try {
      await updateProductVariant(productId, variantId, data);
      toast.success("Variante actualizada");
      fetchProduct();
      invalidate();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al actualizar variante"));
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    if (!productId) return;
    try {
      await deleteProductVariant(productId, variantId);
      toast.success("Variante eliminada");
      fetchProduct();
      invalidate();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al eliminar variante"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-3xl bg-white border border-[var(--c-gray-200)] shadow-2xl !rounded-3xl overflow-hidden p-0 gap-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-[20px] font-extrabold text-[var(--c-gray-800)] tracking-tight">
            Editar Producto
          </DialogTitle>
          <div className="flex items-center gap-2 mt-1">
             <span className="text-[12px] font-bold text-[var(--c-gray-400)] uppercase tracking-widest">{form.sku || "Sin SKU"}</span>
             <span className="w-1 h-1 rounded-full bg-[var(--c-gray-300)]"></span>
             <span className="text-[12px] font-medium text-[var(--c-gray-400)]">ID: {productId?.slice(-8)}</span>
          </div>
        </DialogHeader>

        <div className="px-6 py-2 min-h-[500px] flex flex-col">
          {loading ? (
             <div className="space-y-6 pt-4 flex-1">
               <Skeleton className="h-10 w-full rounded-xl" />
               <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-11 w-full rounded-xl" /></div>
                 <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-11 w-full rounded-xl" /></div>
               </div>
               <Skeleton className="h-32 w-full rounded-xl" />
             </div>
          ) : (
            <Tabs defaultValue="details" className="w-full flex-1 flex flex-col">
              <TabsList className="bg-[var(--c-gray-50)] border border-[var(--c-gray-200)] p-1 rounded-xl w-full justify-start gap-1">
                <TabsTrigger value="details" className="h-9 px-4 text-[13px] font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:text-[var(--c-navy-500)] data-[state=active]:shadow-sm flex items-center gap-2">
                  <Info className="w-4 h-4" /> Detalles
                </TabsTrigger>
                <TabsTrigger value="images" className="h-9 px-4 text-[13px] font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:text-[var(--c-navy-500)] data-[state=active]:shadow-sm flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" /> Imágenes ({images.length})
                </TabsTrigger>
                <TabsTrigger value="variants" className="h-9 px-4 text-[13px] font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:text-[var(--c-navy-500)] data-[state=active]:shadow-sm flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Variantes ({variants.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="flex-1 mt-6 animate-in fade-in duration-300">
                <form onSubmit={handleSaveDetails} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase tracking-widest text-[var(--c-gray-400)]">Nombre de producto</Label>
                      <Input name="name" defaultValue={form.name} className="h-11 bg-[var(--c-gray-50)] border-none rounded-xl focus-visible:ring-2 focus-visible:ring-[var(--c-cyan-500)] font-medium" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase tracking-widest text-[var(--c-gray-400)]">SKU / Código</Label>
                      <Input name="sku" defaultValue={form.sku} className="h-11 bg-[var(--c-gray-50)] border-none rounded-xl focus-visible:ring-2 focus-visible:ring-[var(--c-cyan-500)] font-medium" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase tracking-widest text-[var(--c-gray-400)]">Precio Base (CLP)</Label>
                      <Input name="price" type="number" defaultValue={form.price} className="h-11 bg-[var(--c-gray-50)] border-none rounded-xl focus-visible:ring-2 focus-visible:ring-[var(--c-cyan-500)] font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase tracking-widest text-[var(--c-gray-400)]">Stock Actual</Label>
                      <Input name="stock_quantity" type="number" defaultValue={form.stock_quantity} className="h-11 bg-[var(--c-gray-100)] border-none rounded-xl focus-visible:ring-2 focus-visible:ring-[var(--c-cyan-500)] font-medium" readOnly />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-[11px] font-bold uppercase tracking-widest text-[var(--c-gray-400)]">Descripción</Label>
                      <Textarea name="description" defaultValue={form.description} className="bg-[var(--c-gray-50)] border-none rounded-xl focus-visible:ring-2 focus-visible:ring-[var(--c-cyan-500)] font-medium min-h-[140px] resize-none" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-[var(--c-gray-100)]">
                    <Button type="button" variant="ghost" className="h-11 px-6 text-[13px] font-bold text-[var(--c-gray-500)] hover:bg-[var(--c-gray-50)] rounded-xl" onClick={onClose}>Cancelar</Button>
                    <Button type="submit" className="h-11 px-8 bg-[var(--c-navy-500)] hover:bg-[var(--c-navy-600)] text-white font-bold rounded-xl shadow-lg shadow-[var(--c-navy-500)]/10" disabled={saving}>
                      {saving ? "Guardando..." : <><Save className="w-4 h-4 mr-2" /> Guardar Cambios</>}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="images" className="flex-1 mt-6 animate-in fade-in duration-300">
                <div className="space-y-6">
                  <form onSubmit={handleAddImage} className="flex gap-2">
                    <Input name="url" placeholder="https://ejemplo.com/imagen.jpg" className="h-11 bg-[var(--c-gray-50)] border-none rounded-xl focus-visible:ring-2 focus-visible:ring-[var(--c-cyan-500)] font-medium flex-1 px-4" />
                    <Button type="submit" className="h-11 px-6 bg-[var(--c-navy-500)] text-white font-bold rounded-xl hover:bg-[var(--c-navy-600)] shadow-md">
                      <Plus className="w-4 h-4 mr-2" /> Agregar
                    </Button>
                  </form>
                  
                  {images.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 bg-[var(--c-gray-50)] rounded-2xl border-2 border-dashed border-[var(--c-gray-200)]">
                      <ImageIcon className="w-10 h-10 text-[var(--c-gray-300)] mb-2" />
                      <p className="text-[13px] font-bold text-[var(--c-gray-400)]">No hay imágenes vinculadas</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {images.map((img) => (
                        <div key={img.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-[var(--c-gray-200)] bg-[var(--c-gray-100)] shadow-sm">
                          <img src={getImageUrl(img.url)} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                             <Button variant="ghost" size="icon" className="h-10 w-10 bg-white/20 hover:bg-red-500 text-white rounded-xl backdrop-blur-md" onClick={() => handleDeleteImage(img.id)}>
                               <Trash2 className="w-4 h-4" />
                             </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="variants" className="flex-1 mt-6 animate-in fade-in duration-300">
                <div className="space-y-6">
                  <form onSubmit={handleAddVariant} className="bg-[var(--c-gray-50)] p-5 rounded-2xl border border-[var(--c-gray-200)] space-y-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-[var(--c-gray-400)]">Nombre</Label>
                        <Input name="name" placeholder="Ej. L / Azul" className="h-10 bg-white border-none rounded-lg" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-[var(--c-gray-400)]">SKU</Label>
                        <Input name="sku" placeholder="SKU-VAR" className="h-10 bg-white border-none rounded-lg" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-[var(--c-gray-400)]">Inc. Precio</Label>
                        <Input name="price_diff" type="number" placeholder="0" className="h-10 bg-white border-none rounded-lg" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-[var(--c-gray-400)]">Stock</Label>
                        <Input name="stock" type="number" placeholder="0" className="h-10 bg-white border-none rounded-lg" />
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-10 bg-[var(--c-cyan-500)] hover:bg-[var(--c-cyan-600)] text-white font-bold rounded-xl transition-all">
                      Confirmar Nueva Variante
                    </Button>
                  </form>

                  <div className="space-y-3">
                    {variants.length === 0 ? (
                      <div className="text-center py-10 bg-[var(--c-gray-50)] rounded-2xl border border-[var(--c-gray-100)]">
                        <Box className="w-8 h-8 text-[var(--c-gray-300)] mx-auto mb-2" />
                        <p className="text-[13px] font-bold text-[var(--c-gray-400)]">Este producto no tiene variantes</p>
                      </div>
                    ) : (
                      variants.map((v) => (
                        <div key={v.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-[var(--c-gray-200)] hover:border-[var(--c-cyan-300)] transition-all group">
                          <div className="flex-1">
                            <p className="text-[14px] font-bold text-[var(--c-gray-800)]">{v.name}</p>
                            <p className="text-[11px] text-[var(--c-gray-400)] font-mono font-bold mt-0.5">SKU: {v.sku || "N/A"}</p>
                          </div>
                          <div className="text-right flex flex-col items-end">
                            <p className="text-[13px] font-bold text-[var(--c-navy-500)]">+{formatCurrency(v.price_diff || 0)}</p>
                            <p className="text-[11px] font-bold text-[var(--c-gray-400)] uppercase tracking-tighter">Stock: {v.stock || 0}</p>
                          </div>
                          <div className="flex gap-1 pl-2 border-l border-[var(--c-gray-100)]">
                             <Button size="icon" variant="ghost" className="h-9 w-9 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg" onClick={() => handleDeleteVariant(v.id)}>
                               <X className="w-4 h-4" />
                             </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
        
        <DialogFooter className="hidden">
           {/* Controlled by internal forms */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
