"use client";

import { useState } from "react";
import {
  Card,
  Table,
  Button,
  Input,
  Label,
  Skeleton,
  toast,
  Modal,
  Form,
  TextArea,
} from "@heroui/react";
import { useProducts, useCreateProduct, useDeleteProduct } from "@/lib/hooks/use-products";
import { getErrorMessage } from "@/lib/utils/error-message";
import { EditProductModal } from "./components/EditProductModal";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(value);

const getImageUrl = (url?: string) => {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://rankeao-go-gateway-production.up.railway.app/api/v1";
  const host = baseUrl.replace(/\/api\/v1\/?$/, "");
  return `${host}${url.startsWith("/") ? "" : "/"}${url}`;
};

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [page] = useState(1);
  const { data, isLoading } = useProducts({ page, query: query || undefined });
  const products = data?.items ?? [];

  const createMutation = useCreateProduct();
  const deleteMutation = useDeleteProduct();

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    price: "",
    stock_quantity: "",
    description: "",
  });

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Producto eliminado exitosamente");
    } catch (error: unknown) {
      toast.danger(getErrorMessage(error, "Error al eliminar producto"));
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      toast.danger("Nombre y precio son requeridos");
      return;
    }
    const priceNum = Number(newProduct.price);
    if (isNaN(priceNum) || priceNum < 0) {
      toast.danger("El precio debe ser un número válido");
      return;
    }
    try {
      await createMutation.mutateAsync({
        name: newProduct.name,
        sku: newProduct.sku,
        price: priceNum,
        stock_quantity: newProduct.stock_quantity ? Number(newProduct.stock_quantity) : 0,
        description: newProduct.description,
      });
      toast.success("Producto creado exitosamente");
      setCreateModalOpen(false);
      setNewProduct({ name: "", sku: "", price: "", stock_quantity: "", description: "" });
    } catch (error: unknown) {
      toast.danger(getErrorMessage(error, "Error al crear producto"));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2d3748]">
            Productos
          </h1>
          <p className="text-sm text-[#64748b] mt-1">Gestiona el inventario y catálogo de tu tienda</p>
        </div>
        <Button
          type="button"
          onPress={() => setCreateModalOpen(true)}
          className="bg-[#009baf] text-white font-medium shadow-sm hover:opacity-90 transition-opacity rounded-lg px-4"
        >
          Nuevo Producto
        </Button>
      </div>

      <Modal isOpen={isCreateModalOpen} onOpenChange={setCreateModalOpen}>
        <Modal.Backdrop className="bg-[#2d3748]/50 backdrop-blur-sm">
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-2xl bg-white border border-[#e2e8f0] shadow-xl !rounded-[20px]">
              <Modal.CloseTrigger className="text-[#64748b] hover:bg-[#f8fafc] rounded-full" />
              <Modal.Header className="border-b border-[#e2e8f0] pb-4">
                <Modal.Heading className="text-xl font-bold text-[#2d3748]">
                  Crear Nuevo Producto
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body className="py-6">
                <Form id="create-product-form" onSubmit={handleCreate} className="space-y-4 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Nombre <span className="text-red-500">*</span></Label>
                      <Input
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        placeholder="Ej. TCG Caja"
                        className="bg-[#f8fafc] border border-[#e2e8f0] text-[#2d3748] rounded-lg focus-within:border-[#009baf] focus-within:ring-1 focus-within:ring-[#009baf]/20 transition-all font-medium"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs font-bold uppercase tracking-wider text-[#64748b]">SKU</Label>
                      <Input
                        value={newProduct.sku}
                        onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                        placeholder="Opcional"
                        className="bg-[#f8fafc] border border-[#e2e8f0] text-[#2d3748] rounded-lg focus-within:border-[#009baf] focus-within:ring-1 focus-within:ring-[#009baf]/20 transition-all font-medium"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Precio (CLP) <span className="text-red-500">*</span></Label>
                      <Input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        placeholder="Ej. 15000"
                        className="bg-[#f8fafc] border border-[#e2e8f0] text-[#2d3748] rounded-lg focus-within:border-[#009baf] focus-within:ring-1 focus-within:ring-[#009baf]/20 transition-all font-medium"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Stock Inicial</Label>
                      <Input
                        type="number"
                        value={newProduct.stock_quantity}
                        onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: e.target.value })}
                        placeholder="Ej. 10"
                        className="bg-[#f8fafc] border border-[#e2e8f0] text-[#2d3748] rounded-lg focus-within:border-[#009baf] focus-within:ring-1 focus-within:ring-[#009baf]/20 transition-all font-medium"
                      />
                    </div>
                    <div className="md:col-span-2 flex flex-col gap-1.5">
                      <Label className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Descripción</Label>
                      <TextArea
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        placeholder="Breve detalle del producto..."
                        rows={3}
                        className="bg-[#f8fafc] border border-[#e2e8f0] text-[#2d3748] rounded-lg focus-within:border-[#009baf] focus-within:ring-1 focus-within:ring-[#009baf]/20 transition-all w-full resize-y font-medium min-h-[100px]"
                      />
                    </div>
                  </div>
                </Form>
              </Modal.Body>
              <Modal.Footer className="bg-[#f8fafc] border-t border-[#e2e8f0] rounded-b-[20px] p-4">
                <Button 
                  className="bg-white border border-[#e2e8f0] text-[#2d3748] font-medium hover:bg-[#f1f5f9] transition-colors rounded-lg px-4" 
                  onPress={() => setCreateModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  form="create-product-form"
                  isDisabled={createMutation.isPending}
                  className="bg-[#009baf] text-white font-medium hover:opacity-90 transition-opacity rounded-lg shadow-sm px-6"
                >
                  {createMutation.isPending ? "Guardando..." : "Crear Producto"}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      <div className="flex flex-col gap-6">
        <Card className="bg-white border border-[#e2e8f0] w-full shadow-sm rounded-[16px] p-1">
          <div className="p-4 flex flex-col sm:flex-row gap-4 items-end">
            <div className="w-full sm:max-w-xs space-y-1.5 flex flex-col">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">Buscar Producto</Label>
              <Input
                placeholder="Ej: TCG-123 o Pikachu"
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-[#2d3748] focus-within:border-[#009baf] focus-within:ring-1 focus-within:ring-[#009baf]/20 transition-all font-medium"
              />
            </div>
          </div>
        </Card>

        <Card className="bg-white border border-[#e2e8f0] w-full overflow-hidden shadow-sm rounded-[16px]">
          <div className="overflow-x-auto">
            <Table>
              <Table.ScrollContainer>
                <Table.Content aria-label="Tabla de Productos" className="min-w-full">
                  <Table.Header className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                    <Table.Column isRowHeader className="text-[11px] font-bold text-[#64748b] py-4 px-5 uppercase tracking-wide">Producto</Table.Column>
                    <Table.Column className="text-[11px] font-bold text-[#64748b] py-4 px-5 uppercase tracking-wide">Inventario</Table.Column>
                    <Table.Column className="text-[11px] font-bold text-[#64748b] py-4 px-5 uppercase tracking-wide">Precio</Table.Column>
                    <Table.Column className="text-[11px] font-bold text-[#64748b] py-4 px-5 uppercase tracking-wide">Estado</Table.Column>
                    <Table.Column className="text-[11px] font-bold text-[#64748b] py-4 px-5 uppercase tracking-wide text-right">Acciones</Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {isLoading ? (
                      Array(5).fill(0).map((_, i) => (
                        <Table.Row key={i} className="border-b border-[#e2e8f0]">
                          <Table.Cell className="py-4 px-5"><Skeleton className="h-10 w-48 rounded-[10px]" /></Table.Cell>
                          <Table.Cell className="py-4 px-5"><Skeleton className="h-6 w-16 rounded-md" /></Table.Cell>
                          <Table.Cell className="py-4 px-5"><Skeleton className="h-6 w-16 rounded-md" /></Table.Cell>
                          <Table.Cell className="py-4 px-5"><Skeleton className="h-6 w-20 rounded-full" /></Table.Cell>
                          <Table.Cell className="py-4 px-5"><Skeleton className="h-8 w-16 rounded-md ml-auto" /></Table.Cell>
                        </Table.Row>
                      ))
                    ) : products.length === 0 ? (
                      <Table.Row>
                        <Table.Cell colSpan={5} className="py-12 text-center text-[#64748b]">
                          No se encontraron productos. Crea el primero.
                        </Table.Cell>
                      </Table.Row>
                    ) : (
                      products.map((prod) => (
                        <Table.Row key={prod.id} className="border-b border-[#e2e8f0] hover:bg-[#f8fafc] transition-colors">
                          <Table.Cell className="py-4 px-5">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                                {prod.image_url ? (
                                  /* eslint-disable-next-line @next/next/no-img-element */
                                  <img src={getImageUrl(prod.image_url)} alt={prod.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-[#94a3b8] text-[10px] font-bold uppercase tracking-wider">No Img</span>
                                )}
                              </div>
                              <div>
                                <p className="text-[13px] font-bold text-[#2d3748]">{prod.name}</p>
                                <p className="text-[11px] text-[#64748b] mt-0.5 font-medium">SKU: {prod.sku || "N/A"}</p>
                              </div>
                            </div>
                          </Table.Cell>
                          <Table.Cell className="py-4 px-5">
                            <span className="text-[13px] font-medium text-[#2d3748]">{prod.stock_quantity} <span className="text-[#64748b] font-normal">en stock</span></span>
                          </Table.Cell>
                          <Table.Cell className="py-4 px-5">
                            <span className="text-[13px] font-bold text-[#2d3748]">
                              {formatCurrency(prod.price)}
                            </span>
                          </Table.Cell>
                          <Table.Cell className="py-4 px-5">
                            <div className="flex items-center">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${prod.status === "ACTIVE" || prod.status === "PUBLISHED"
                                ? "bg-[#009baf]/10 text-[#009baf] border-[#009baf]/20"
                                : prod.status === "DRAFT"
                                  ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                  : "bg-[#f1f5f9] text-[#64748b] border-[#e2e8f0]"
                                }`}>
                                {prod.status}
                              </span>
                            </div>
                          </Table.Cell>
                          <Table.Cell className="py-4 px-5 text-right">
                            <div className="flex flex-row gap-2 justify-end">
                              <Button
                                size="sm"
                                className="bg-[#f8fafc] border border-[#e2e8f0] text-[#2d3748] font-medium hover:bg-[#e2e8f0] transition-colors"
                                onPress={() => {
                                  setSelectedProductId(prod.id);
                                  setEditModalOpen(true);
                                }}
                              >
                                Editar
                              </Button>
                              <Button
                                size="sm"
                                className="bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors"
                                onPress={() => handleDelete(prod.id)}
                              >
                                Eliminar
                              </Button>
                            </div>
                          </Table.Cell>
                        </Table.Row>
                      ))
                    )}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
          </div>
        </Card>
      </div>

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        productId={selectedProductId}
        onProductUpdated={() => { }}
      />
    </div>
  );
}
