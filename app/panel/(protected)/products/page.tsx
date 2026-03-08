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
          <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--foreground)]">
            Productos
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">Gestiona el inventario y catálogo de tu tienda</p>
        </div>
        <Button
          type="button"
          onPress={() => setCreateModalOpen(true)}
          variant="primary"
        >
          Nuevo Producto
        </Button>
      </div>

      <Modal isOpen={isCreateModalOpen} onOpenChange={setCreateModalOpen}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-2xl">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading className="text-xl font-bold font-[var(--font-heading)] text-[var(--foreground)]">
                  Crear Nuevo Producto
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body className="py-4">
                <Form id="create-product-form" onSubmit={handleCreate} className="space-y-4 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm font-medium text-[var(--foreground)]">Nombre <span className="text-red-500">*</span></Label>
                      <Input
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        placeholder="Ej. TCG Caja"
                        className="bg-transparent border border-[var(--border)]"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm font-medium text-[var(--foreground)]">SKU</Label>
                      <Input
                        value={newProduct.sku}
                        onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                        placeholder="Opcional"
                        className="bg-transparent border border-[var(--border)]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm font-medium text-[var(--foreground)]">Precio (CLP) <span className="text-red-500">*</span></Label>
                      <Input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        placeholder="Ej. 15000"
                        className="bg-transparent border border-[var(--border)]"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm font-medium text-[var(--foreground)]">Stock Inicial</Label>
                      <Input
                        type="number"
                        value={newProduct.stock_quantity}
                        onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: e.target.value })}
                        placeholder="Ej. 10"
                        className="bg-transparent border border-[var(--border)]"
                      />
                    </div>
                    <div className="md:col-span-2 flex flex-col gap-1.5">
                      <Label className="text-sm font-medium text-[var(--foreground)]">Descripción</Label>
                      <TextArea
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        placeholder="Breve detalle del producto..."
                        rows={3}
                        className="bg-transparent border border-[var(--border)] w-full resize-y"
                      />
                    </div>
                  </div>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onPress={() => setCreateModalOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  form="create-product-form"
                  isDisabled={createMutation.isPending}
                  variant="primary"
                >
                  {createMutation.isPending ? "Guardando..." : "Crear Producto"}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      <div className="flex flex-col gap-6">
        <Card className="bg-[var(--surface)] border border-[var(--border)] w-full">
          <div className="p-4 flex flex-col sm:flex-row gap-4 items-end">
            <div className="w-full sm:max-w-xs space-y-1.5 flex flex-col">
              <Label className="text-xs font-semibold text-[var(--muted)]">Buscar Producto</Label>
              <Input
                placeholder="Ej: TCG-123 o Pikachu"
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                className="bg-transparent border border-[var(--border)]"
              />
            </div>
          </div>
        </Card>

        <Card className="bg-[var(--surface)] border border-[var(--border)] w-full overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <Table.ScrollContainer>
                <Table.Content aria-label="Tabla de Productos" className="min-w-full">
                  <Table.Header className="bg-[var(--surface-sunken)] border-b border-[var(--border)]">
                    <Table.Column isRowHeader className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Producto</Table.Column>
                    <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Inventario</Table.Column>
                    <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Precio</Table.Column>
                    <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Estado</Table.Column>
                    <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider text-right">Acciones</Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {isLoading ? (
                      Array(5).fill(0).map((_, i) => (
                        <Table.Row key={i} className="border-b border-[var(--border)]">
                          <Table.Cell className="py-4 px-4"><Skeleton className="h-10 w-48 rounded" /></Table.Cell>
                          <Table.Cell className="py-4 px-4"><Skeleton className="h-6 w-16 rounded" /></Table.Cell>
                          <Table.Cell className="py-4 px-4"><Skeleton className="h-6 w-16 rounded" /></Table.Cell>
                          <Table.Cell className="py-4 px-4"><Skeleton className="h-6 w-20 rounded" /></Table.Cell>
                          <Table.Cell className="py-4 px-4"><Skeleton className="h-8 w-16 rounded ml-auto" /></Table.Cell>
                        </Table.Row>
                      ))
                    ) : products.length === 0 ? (
                      <Table.Row>
                        <Table.Cell colSpan={5} className="py-12 text-center text-[var(--muted)]">
                          No se encontraron productos. Crea el primero.
                        </Table.Cell>
                      </Table.Row>
                    ) : (
                      products.map((prod) => (
                        <Table.Row key={prod.id} className="border-b border-[var(--border)] hover:bg-white/[0.02] transition-colors">
                          <Table.Cell className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border)] flex items-center justify-center overflow-hidden shrink-0">
                                {prod.primary_image_url ? (
                                  /* eslint-disable-next-line @next/next/no-img-element */
                                  <img src={prod.primary_image_url} alt={prod.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-[var(--muted)] text-xs">No img</span>
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-[var(--foreground)]">{prod.name}</p>
                                <p className="text-xs text-[var(--muted)]">SKU: {prod.sku || "N/A"}</p>
                              </div>
                            </div>
                          </Table.Cell>
                          <Table.Cell className="py-4 px-4">
                            <span className="text-sm text-[var(--foreground)]">{prod.stock_quantity} en stock</span>
                          </Table.Cell>
                          <Table.Cell className="py-4 px-4">
                            <span className="text-sm font-medium text-[var(--foreground)]">
                              {formatCurrency(prod.price)}
                            </span>
                          </Table.Cell>
                          <Table.Cell className="py-4 px-4">
                            <div className="flex items-center">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${prod.status === "ACTIVE" || prod.status === "PUBLISHED"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : prod.status === "DRAFT"
                                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                  : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                                }`}>
                                {prod.status}
                              </span>
                            </div>
                          </Table.Cell>
                          <Table.Cell className="py-4 px-4 text-right">
                            <div className="flex flex-row gap-2 justify-end">
                              <Button
                                size="sm"
                                variant="secondary"
                                onPress={() => {
                                  setSelectedProductId(prod.id);
                                  setEditModalOpen(true);
                                }}
                              >
                                Editar
                              </Button>
                              <Button
                                size="sm"
                                className="bg-red-500/10 text-red-500"
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
