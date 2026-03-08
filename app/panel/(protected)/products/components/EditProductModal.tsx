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

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string | null;
  onProductUpdated: () => void;
}

function SecondaryCloseButton({ onClose }: { onClose: () => void }) {
  return (
    <Button variant="secondary" onPress={onClose}>
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

  const handleSaveDetails = async () => {
    if (!productId) return;
    try {
      setSaving(true);
      await updateProduct(productId, {
        name: form.name,
        sku: form.sku,
        price: Number(form.price),
        stock_quantity: Number(form.stock_quantity),
        description: form.description,
      });
      toast.success("Producto actualizado");
      invalidate();
    } catch (error: unknown) {
      toast.danger(getErrorMessage(error, "Error al guardar"));
    } finally {
      setSaving(false);
    }
  };

  const handleAddImage = async () => {
    if (!productId || !newImageUrl) return;
    try {
      await addProductImage(productId, { url: newImageUrl });
      toast.success("Imagen agregada");
      setNewImageUrl("");
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

  const handleAddVariant = async () => {
    if (!productId || !newVariant.name) return;
    try {
      await addProductVariant(productId, {
        name: newVariant.name,
        sku: newVariant.sku,
        price_diff: newVariant.price_diff ? Number(newVariant.price_diff) : 0,
        stock: newVariant.stock ? Number(newVariant.stock) : 0,
      });
      toast.success("Variante agregada");
      setNewVariant({ name: "", sku: "", price_diff: "", stock: "" });
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
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-3xl">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading className="text-xl font-bold text-[var(--foreground)]">
                Editar Producto
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body className="py-4 min-h-[460px] flex flex-col">
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
                      className="gap-2 w-full flex bg-[var(--surface-sunken)] border border-[var(--border)] p-1.5 rounded-full overflow-x-auto scrollbar-hide flex-nowrap"
                    >
                      <Tabs.Tab id="details" className="relative flex-1 px-4 h-10 flex items-center justify-center gap-2 text-sm font-medium text-[var(--muted)] data-[selected=true]:text-[var(--foreground)] transition-colors z-10 whitespace-nowrap">
                        <Info className="w-4 h-4 shrink-0" />
                        <span>Detalles</span>
                        <Tabs.Indicator className="absolute inset-0 w-full h-full border border-[var(--primary)] rounded-full pointer-events-none" />
                      </Tabs.Tab>
                      <Tabs.Tab id="images" className="relative flex-1 px-4 h-10 flex items-center justify-center gap-2 text-sm font-medium text-[var(--muted)] data-[selected=true]:text-[var(--foreground)] transition-colors z-10 whitespace-nowrap">
                        <ImageIcon className="w-4 h-4 shrink-0" />
                        <span>Imágenes <span className="hidden sm:inline">({images.length})</span></span>
                        <Tabs.Indicator className="absolute inset-0 w-full h-full border border-[var(--primary)] rounded-full pointer-events-none" />
                      </Tabs.Tab>
                      <Tabs.Tab id="variants" className="relative flex-1 px-4 h-10 flex items-center justify-center gap-2 text-sm font-medium text-[var(--muted)] data-[selected=true]:text-[var(--foreground)] transition-colors z-10 whitespace-nowrap">
                        <Layers className="w-4 h-4 shrink-0" />
                        <span>Variantes <span className="hidden sm:inline">({variants.length})</span></span>
                        <Tabs.Indicator className="absolute inset-0 w-full h-full border border-[var(--primary)] rounded-full pointer-events-none" />
                      </Tabs.Tab>
                    </Tabs.List>
                  </Tabs.ListContainer>

                  <Tabs.Panel id="details" className="pt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-sm font-medium text-[var(--foreground)]">Nombre</Label>
                        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-transparent border border-[var(--border)]" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-sm font-medium text-[var(--foreground)]">SKU</Label>
                        <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="bg-transparent border border-[var(--border)]" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-sm font-medium text-[var(--foreground)]">Precio (CLP)</Label>
                        <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="bg-transparent border border-[var(--border)]" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-sm font-medium text-[var(--foreground)]">Stock</Label>
                        <Input type="number" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} className="bg-transparent border border-[var(--border)]" />
                      </div>
                      <div className="md:col-span-2 flex flex-col gap-1.5">
                        <Label className="text-sm font-medium text-[var(--foreground)]">Descripción</Label>
                        <TextArea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="bg-transparent border border-[var(--border)] w-full resize-y" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <SecondaryCloseButton onClose={onClose} />
                      <Button variant="primary" isDisabled={saving} onPress={handleSaveDetails}>
                        {saving ? "Guardando..." : "Guardar Detalles"}
                      </Button>
                    </div>
                  </Tabs.Panel>

                  <Tabs.Panel id="images" className="pt-4 space-y-4">
                    <div className="flex gap-2">
                      <Input placeholder="URL de la imagen" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} className="bg-transparent border border-[var(--border)] flex-1" />
                      <Button variant="primary" onPress={handleAddImage}>Agregar</Button>
                    </div>
                    {images.length === 0 ? (
                      <p className="text-sm text-[var(--muted)] text-center py-6">No hay imágenes.</p>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {images.map((img) => (
                          <div key={img.id} className="relative group rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--surface-sunken)]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img.url} alt={img.alt_text || ""} className="w-full h-32 object-cover" />
                            <Button
                              variant="danger"
                              onPress={() => handleDeleteImage(img.id)}
                            >
                              X
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-end">
                      <SecondaryCloseButton onClose={onClose} />
                    </div>
                  </Tabs.Panel>

                  <Tabs.Panel id="variants" className="pt-4 space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <Input placeholder="Nombre" value={newVariant.name} onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })} className="bg-transparent border border-[var(--border)]" />
                      <Input placeholder="SKU" value={newVariant.sku} onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })} className="bg-transparent border border-[var(--border)]" />
                      <Input placeholder="Dif. Precio" type="number" value={newVariant.price_diff} onChange={(e) => setNewVariant({ ...newVariant, price_diff: e.target.value })} className="bg-transparent border border-[var(--border)]" />
                      <Input placeholder="Stock" type="number" value={newVariant.stock} onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })} className="bg-transparent border border-[var(--border)]" />
                    </div>
                    <Button variant="primary" onPress={handleAddVariant}>Agregar Variante</Button>

                    {variants.length === 0 ? (
                      <p className="text-sm text-[var(--muted)] text-center py-6">No hay variantes.</p>
                    ) : (
                      <div className="space-y-2">
                        {variants.map((v) => (
                          <div key={v.id} className="flex items-center gap-2 p-3 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border)]">
                            <span className="text-sm font-medium text-[var(--foreground)] flex-1">{v.name}</span>
                            <span className="text-xs text-[var(--muted)]">SKU: {v.sku || "N/A"}</span>
                            <span className="text-xs text-[var(--muted)]">+${v.price_diff || 0}</span>
                            <span className="text-xs text-[var(--muted)]">Stock: {v.stock || 0}</span>
                            <Button size="sm" variant="secondary" onPress={() => handleUpdateVariant(v.id, { name: v.name })}>
                              Guardar
                            </Button>
                            <Button size="sm" variant="danger" onPress={() => handleDeleteVariant(v.id)}>
                              X
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-end">
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
