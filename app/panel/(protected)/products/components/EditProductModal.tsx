"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Input,
  Label,
  TextArea,
  Tabs,
  Spinner,
  Skeleton,
  toast,
} from "@heroui/react";
import { Info, Image as ImageIcon, Layers } from "lucide-react";
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

function SecondaryCloseButton({ onClose }: { onClose: () => void }) {
  return (
    <Button 
      className="bg-white border border-[#e2e8f0] text-[#2d3748] font-medium hover:bg-[#f1f5f9] transition-colors rounded-lg px-4" 
      onPress={onClose}
    >
      Cerrar
    </Button>
  );
}

export function EditProductModal({ isOpen, onClose, productId, onProductUpdated }: EditProductModalProps) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({ name: "", sku: "", price: "", stock_quantity: "", description: "" });
  const [images, setImages] = useState<ProductImage[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  const [newImageUrl, setNewImageUrl] = useState("");
  const [newVariant, setNewVariant] = useState({ name: "", sku: "", price_diff: "", stock: "" });

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
      toast.danger(getErrorMessage(error, "Error al cargar producto"));
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
      toast.danger("Nombre y precio son requeridos");
      return;
    }
    
    const priceNum = Number(priceStr);
    if (isNaN(priceNum) || priceNum < 0) {
      toast.danger("El precio debe ser un número válido");
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
      toast.danger(getErrorMessage(error, "Error al actualizar producto"));
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
      toast.danger(getErrorMessage(error, "Error al agregar imagen"));
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
      toast.danger(getErrorMessage(error, "Error al eliminar imagen"));
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
      toast.danger("Nombre de variante es requerido");
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
      toast.danger(getErrorMessage(error, "Error al agregar variante"));
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
      toast.danger(getErrorMessage(error, "Error al actualizar variante"));
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
      toast.danger(getErrorMessage(error, "Error al eliminar variante"));
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Modal.Backdrop className="bg-[#2d3748]/50 backdrop-blur-sm">
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-3xl bg-white border border-[#e2e8f0] shadow-xl !rounded-[20px]">
            <Modal.CloseTrigger className="text-[#64748b] hover:bg-[#f8fafc] rounded-full" />
            <Modal.Header className="border-b border-[#e2e8f0] pb-4">
              <Modal.Heading className="text-xl font-bold text-[#2d3748]">
                Editar Producto
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body className="py-6 min-h-[460px] flex flex-col">
              {loading ? (
                <div className="space-y-4 py-4 flex-1">
                  <div className="flex gap-4 border-b border-[var(--border)] pb-2">
                    <Skeleton className="h-8 w-24 rounded-lg" />
                    <Skeleton className="h-8 w-32 rounded-lg" />
                    <Skeleton className="h-8 w-32 rounded-lg" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="space-y-1.5"><Skeleton className="h-4 w-20 rounded" /><Skeleton className="h-10 w-full rounded-xl" /></div>
                    <div className="space-y-1.5"><Skeleton className="h-4 w-20 rounded" /><Skeleton className="h-10 w-full rounded-xl" /></div>
                    <div className="space-y-1.5"><Skeleton className="h-4 w-24 rounded" /><Skeleton className="h-10 w-full rounded-xl" /></div>
                    <div className="space-y-1.5"><Skeleton className="h-4 w-20 rounded" /><Skeleton className="h-10 w-full rounded-xl" /></div>
                    <div className="md:col-span-2 space-y-1.5"><Skeleton className="h-4 w-24 rounded" /><Skeleton className="h-24 w-full rounded-xl" /></div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Skeleton className="h-10 w-24 rounded-lg" />
                    <Skeleton className="h-10 w-32 rounded-lg" />
                  </div>
                </div>
              ) : (
                <Tabs className="w-full flex-1 flex flex-col">
                  <Tabs.ListContainer className="flex-shrink-0">
                    <Tabs.List
                      aria-label="Secciones del producto"
                      className="gap-2 w-full flex bg-[#f8fafc] border border-[#e2e8f0] p-1.5 rounded-[12px] overflow-x-auto scrollbar-hide flex-nowrap"
                    >
                      <Tabs.Tab id="details" className="relative flex-1 px-4 h-10 flex items-center justify-center gap-2 text-sm font-bold text-[#64748b] data-[selected=true]:text-[#009baf] transition-colors z-10 whitespace-nowrap">
                        <Info className="w-4 h-4 shrink-0" />
                        <span>Detalles</span>
                        <Tabs.Indicator className="absolute inset-0 w-full h-full bg-white shadow-sm border border-[#009baf]/20 rounded-[8px] pointer-events-none" />
                      </Tabs.Tab>
                      <Tabs.Tab id="images" className="relative flex-1 px-4 h-10 flex items-center justify-center gap-2 text-sm font-bold text-[#64748b] data-[selected=true]:text-[#009baf] transition-colors z-10 whitespace-nowrap">
                        <ImageIcon className="w-4 h-4 shrink-0" />
                        <span>Imágenes <span className="hidden sm:inline">({images.length})</span></span>
                        <Tabs.Indicator className="absolute inset-0 w-full h-full bg-white shadow-sm border border-[#009baf]/20 rounded-[8px] pointer-events-none" />
                      </Tabs.Tab>
                      <Tabs.Tab id="variants" className="relative flex-1 px-4 h-10 flex items-center justify-center gap-2 text-sm font-bold text-[#64748b] data-[selected=true]:text-[#009baf] transition-colors z-10 whitespace-nowrap">
                        <Layers className="w-4 h-4 shrink-0" />
                        <span>Variantes <span className="hidden sm:inline">({variants.length})</span></span>
                        <Tabs.Indicator className="absolute inset-0 w-full h-full bg-white shadow-sm border border-[#009baf]/20 rounded-[8px] pointer-events-none" />
                      </Tabs.Tab>
                    </Tabs.List>
                  </Tabs.ListContainer>

                  <Tabs.Panel id="details" className="pt-6 space-y-4">
                    <form onSubmit={handleSaveDetails} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Nombre</Label>
                        <Input name="name" defaultValue={form.name} className="bg-[#f8fafc] border border-[#e2e8f0] text-[#2d3748] rounded-lg focus-within:border-[#009baf] focus-within:ring-1 focus-within:ring-[#009baf]/20 transition-all font-medium" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-xs font-bold uppercase tracking-wider text-[#64748b]">SKU</Label>
                        <Input name="sku" defaultValue={form.sku} className="bg-[#f8fafc] border border-[#e2e8f0] text-[#2d3748] rounded-lg focus-within:border-[#009baf] focus-within:ring-1 focus-within:ring-[#009baf]/20 transition-all font-medium" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Precio (CLP)</Label>
                        <Input name="price" type="number" defaultValue={form.price} className="bg-[#f8fafc] border border-[#e2e8f0] text-[#2d3748] rounded-lg focus-within:border-[#009baf] focus-within:ring-1 focus-within:ring-[#009baf]/20 transition-all font-medium" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Stock</Label>
                        <Input name="stock_quantity" type="number" defaultValue={form.stock_quantity} className="bg-[#f8fafc] border border-[#e2e8f0] text-[#2d3748] rounded-lg focus-within:border-[#009baf] focus-within:ring-1 focus-within:ring-[#009baf]/20 transition-all font-medium" />
                      </div>
                      <div className="md:col-span-2 flex flex-col gap-1.5">
                        <Label className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Descripción</Label>
                        <TextArea name="description" defaultValue={form.description} rows={3} className="bg-[#f8fafc] border border-[#e2e8f0] text-[#2d3748] rounded-lg focus-within:border-[#009baf] focus-within:ring-1 focus-within:ring-[#009baf]/20 transition-all w-full resize-y font-medium min-h-[100px]" />
                      </div>
                      <div className="md:col-span-2 flex justify-end gap-2 pt-4">
                        <SecondaryCloseButton onClose={onClose} />
                        <Button type="submit" className="bg-[#009baf] text-white font-medium hover:opacity-90 shadow-sm rounded-lg px-6" isDisabled={saving}>
                          {saving ? "Guardando..." : "Guardar Detalles"}
                        </Button>
                      </div>
                    </form>
                  </Tabs.Panel>

                  <Tabs.Panel id="images" className="pt-6 space-y-4">
                    <form onSubmit={handleAddImage} className="flex gap-2">
                      <Input name="url" placeholder="URL de la imagen" className="bg-[#f8fafc] border border-[#e2e8f0] text-[#2d3748] rounded-lg focus-within:border-[#009baf] focus-within:ring-1 focus-within:ring-[#009baf]/20 transition-all font-medium flex-1" />
                      <Button type="submit" className="bg-[#009baf] text-white font-medium hover:opacity-90 shadow-sm rounded-lg px-6">Agregar</Button>
                    </form>
                    {images.length === 0 ? (
                      <p className="text-sm text-[#64748b] text-center py-6 font-medium">No hay imágenes vinculadas.</p>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                        {images.map((img) => (
                          <div key={img.id} className="relative group rounded-lg overflow-hidden border border-[#e2e8f0] bg-[#f8fafc] shadow-sm">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={getImageUrl(img.url)} alt={img.alt_text || "Producto sin imagen"} className="w-full h-32 object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button
                                className="bg-red-500 text-white shadow-sm font-medium px-4 opacity-90 hover:opacity-100 transition-opacity rounded-lg"
                                onPress={() => handleDeleteImage(img.id)}
                              >
                                Eliminar
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-end pt-4">
                      <SecondaryCloseButton onClose={onClose} />
                    </div>
                  </Tabs.Panel>

                  <Tabs.Panel id="variants" className="pt-6 space-y-4">
                    <form onSubmit={handleAddVariant} className="flex flex-col gap-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <Input name="name" placeholder="Nombre" className="bg-[#f8fafc] border border-[#e2e8f0] text-[#2d3748] rounded-lg focus-within:border-[#009baf] focus-within:ring-1 focus-within:ring-[#009baf]/20 transition-all font-medium" />
                        <Input name="sku" placeholder="SKU" className="bg-[#f8fafc] border border-[#e2e8f0] text-[#2d3748] rounded-lg focus-within:border-[#009baf] focus-within:ring-1 focus-within:ring-[#009baf]/20 transition-all font-medium" />
                        <Input name="price_diff" placeholder="Dif. Precio" type="number" className="bg-[#f8fafc] border border-[#e2e8f0] text-[#2d3748] rounded-lg focus-within:border-[#009baf] focus-within:ring-1 focus-within:ring-[#009baf]/20 transition-all font-medium" />
                        <Input name="stock" placeholder="Stock" type="number" className="bg-[#f8fafc] border border-[#e2e8f0] text-[#2d3748] rounded-lg focus-within:border-[#009baf] focus-within:ring-1 focus-within:ring-[#009baf]/20 transition-all font-medium" />
                      </div>
                      <Button type="submit" className="bg-[#009baf] text-white font-medium hover:opacity-90 shadow-sm rounded-lg w-max">Agregar Variante</Button>
                    </form>

                    {variants.length === 0 ? (
                      <p className="text-sm text-[#64748b] text-center py-6 font-medium">No hay variantes configuradas.</p>
                    ) : (
                      <div className="space-y-3 pt-2">
                        {variants.map((v) => (
                          <div key={v.id} className="flex items-center gap-3 p-4 rounded-[12px] bg-[#f8fafc] border border-[#e2e8f0]">
                            <span className="text-sm font-bold text-[#2d3748] flex-1">{v.name}</span>
                            <span className="text-xs text-[#64748b] font-medium hidden sm:inline">SKU: {v.sku || "N/A"}</span>
                            <span className="text-xs text-[#009baf] font-bold">+{formatCurrency(v.price_diff || 0)}</span>
                            <span className="text-xs text-[#64748b] font-medium">Stock: {v.stock || 0}</span>
                            <Button size="sm" className="bg-white border border-[#e2e8f0] text-[#2d3748] shadow-sm ml-2 font-medium hover:bg-[#e2e8f0] transition-colors" onPress={() => handleUpdateVariant(v.id, { name: v.name })}>
                              Guardar
                            </Button>
                            <Button size="sm" className="bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors" onPress={() => handleDeleteVariant(v.id)}>
                              X
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-end pt-4">
                      <SecondaryCloseButton onClose={onClose} />
                    </div>
                  </Tabs.Panel>
                </Tabs>
              )}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
