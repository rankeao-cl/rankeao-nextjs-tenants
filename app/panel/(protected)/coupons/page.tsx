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
  Select,
  ListBox,
} from "@heroui/react";
import { useCoupons, useCreateCoupon, useUpdateCoupon, useDeleteCoupon } from "@/lib/hooks/use-coupons";
import { getCouponUsages } from "@/lib/api/coupons";
import { getErrorMessage } from "@/lib/utils/error-message";
import type { Coupon, CouponUsage } from "@/lib/types/coupons";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(value);

const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case "ACTIVE":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "INACTIVE":
    case "EXPIRED":
      return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    default:
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  }
};

export default function CouponsPage() {
  const [query, setQuery] = useState("");
  const [page] = useState(1);
  const { data, isLoading } = useCoupons({ page, query: query || undefined });
  const coupons = data?.items ?? [];

  const createMutation = useCreateCoupon();
  const updateMutation = useUpdateCoupon();
  const deleteMutation = useDeleteCoupon();

  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Coupon>>({
    code: "",
    discount_type: "PERCENTAGE",
    discount_value: 0,
    status: "ACTIVE",
  });

  const [showUsagesModal, setShowUsagesModal] = useState(false);
  const [usages, setUsages] = useState<CouponUsage[]>([]);
  const [loadingUsages, setLoadingUsages] = useState(false);

  const handleOpenForm = (coupon?: Coupon) => {
    if (coupon) {
      setFormData(coupon);
    } else {
      setFormData({ code: "", discount_type: "PERCENTAGE", discount_value: 0, status: "ACTIVE" });
    }
    setShowFormModal(true);
  };

  const handleSaveCoupon = async () => {
    if (!formData.code || formData.discount_value === undefined) {
      return toast.danger("Código y Descuento son requeridos");
    }
    try {
      if (formData.id) {
        await updateMutation.mutateAsync({ id: formData.id, data: formData as Record<string, unknown> });
        toast.success("Cupón actualizado");
      } else {
        await createMutation.mutateAsync(formData as Record<string, unknown>);
        toast.success("Cupón creado");
      }
      setShowFormModal(false);
    } catch (error) {
      toast.danger(getErrorMessage(error, "Error al guardar cupón"));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar cupón?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Cupón eliminado");
    } catch {
      toast.danger("Error al eliminar");
    }
  };

  const handleViewUsages = async (id: string, code: string) => {
    setShowUsagesModal(true);
    setLoadingUsages(true);
    try {
      const data = await getCouponUsages(id);
      setUsages(data);
    } catch {
      toast.danger(`Error al cargar usos del cupón ${code}`);
      setShowUsagesModal(false);
    } finally {
      setLoadingUsages(false);
    }
  };

  const saving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--foreground)]">
            Cupones
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">Gestiona los descuentos y promociones de tu tienda</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="bg-[var(--surface)] border border-[var(--border)] w-full">
          <div className="p-4 flex flex-col sm:flex-row gap-4 items-end justify-between">
            <div className="w-full sm:max-w-xs space-y-1.5 flex flex-col">
              <Label className="text-xs font-semibold text-[var(--muted)]">Buscar Cupón</Label>
              <Input
                placeholder="Ej: VERANO2026"
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                className="bg-transparent border border-[var(--border)]"
              />
            </div>
            <Button variant="primary" onPress={() => handleOpenForm()}>
              Nuevo Cupón
            </Button>
          </div>
        </Card>

        <Card className="bg-[var(--surface)] border border-[var(--border)] w-full overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <Table.ScrollContainer>
                <Table.Content aria-label="Tabla de Cupones" className="min-w-full">
                  <Table.Header className="bg-[var(--surface-sunken)] border-b border-[var(--border)]">
                    <Table.Column isRowHeader className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Código</Table.Column>
                    <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Descuento</Table.Column>
                    <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Compra Mínima</Table.Column>
                    <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Estado</Table.Column>
                    <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider text-right">Acciones</Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {isLoading ? (
                      Array(4).fill(0).map((_, i) => (
                        <Table.Row key={i} className="border-b border-[var(--border)]">
                          <Table.Cell className="py-4 px-4"><Skeleton className="h-6 w-24 rounded" /></Table.Cell>
                          <Table.Cell className="py-4 px-4"><Skeleton className="h-6 w-20 rounded" /></Table.Cell>
                          <Table.Cell className="py-4 px-4"><Skeleton className="h-6 w-20 rounded" /></Table.Cell>
                          <Table.Cell className="py-4 px-4"><Skeleton className="h-6 w-20 rounded" /></Table.Cell>
                          <Table.Cell className="py-4 px-4"><Skeleton className="h-8 w-32 rounded ml-auto" /></Table.Cell>
                        </Table.Row>
                      ))
                    ) : coupons.length === 0 ? (
                      <Table.Row>
                        <Table.Cell colSpan={5} className="py-12 text-center text-[var(--muted)]">
                          No se encontraron cupones.
                        </Table.Cell>
                      </Table.Row>
                    ) : (
                      coupons.map((coupon) => (
                        <Table.Row key={coupon.id} className="border-b border-[var(--border)] hover:bg-white/[0.02] transition-colors">
                          <Table.Cell className="py-4 px-4 text-emerald-400 font-mono font-medium">
                            {coupon.code}
                          </Table.Cell>
                          <Table.Cell className="py-4 px-4 text-[var(--foreground)] font-medium">
                            {coupon.discount_type === "PERCENTAGE"
                              ? `${coupon.discount_value}%`
                              : formatCurrency(coupon.discount_value)}
                          </Table.Cell>
                          <Table.Cell className="py-4 px-4 text-[var(--muted)]">
                            {coupon.min_purchase ? formatCurrency(coupon.min_purchase) : "Sin mínimo"}
                          </Table.Cell>
                          <Table.Cell className="py-4 px-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(coupon.status)}`}>
                              {coupon.status}
                            </span>
                          </Table.Cell>
                          <Table.Cell className="py-4 px-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <Button size="sm" variant="outline" onPress={() => handleViewUsages(coupon.id, coupon.code)}>
                                Usos
                              </Button>
                              <Button size="sm" variant="secondary" onPress={() => handleOpenForm(coupon)}>
                                Editar
                              </Button>
                              <Button size="sm" variant="danger" onPress={() => handleDelete(coupon.id)}>
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

      {/* Form Modal */}
      <Modal isOpen={showFormModal} onOpenChange={setShowFormModal}>
        <Modal.Backdrop />
        <Modal.Container>
          <Modal.Dialog className="bg-[var(--surface)] border border-[var(--border)]">
            <Modal.CloseTrigger className="text-[var(--muted)] hover:text-[var(--foreground)]" />
            <Modal.Header>
              <Modal.Heading className="text-xl font-bold text-[var(--foreground)]">
                {formData.id ? "Editar Cupón" : "Crear Cupón"}
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body className="py-4 space-y-4">
              <div className="space-y-1.5 flex flex-col">
                <Label className="text-sm font-medium text-[var(--muted)]">Código</Label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="ej. VERANO20"
                  className="bg-transparent border border-[var(--border)] font-mono"
                />
              </div>
              <div className="space-y-1.5 flex flex-col">
                <Label className="text-sm font-medium text-[var(--muted)]">Tipo de Descuento</Label>
                <Select
                  selectedKey={formData.discount_type || "PERCENTAGE"}
                  onSelectionChange={(key: unknown) => { if (key) setFormData({ ...formData, discount_type: key as "PERCENTAGE" | "FIXED" }); }}
                  className="w-full"
                >
                  <Select.Trigger className="bg-transparent border border-[var(--border)]">
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover className="bg-[var(--surface)] border border-[var(--border)]">
                    <ListBox className="text-[var(--foreground)]">
                      <ListBox.Item id="PERCENTAGE" textValue="Porcentaje">
                        Porcentaje (%)
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                      <ListBox.Item id="FIXED" textValue="Monto Fijo">
                        Monto Fijo ($)
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>
              <div className="space-y-1.5 flex flex-col">
                <Label className="text-sm font-medium text-[var(--muted)]">Valor del Descuento</Label>
                <Input
                  type="number"
                  value={formData.discount_value?.toString()}
                  onChange={(e) => setFormData({ ...formData, discount_value: Number(e.target.value) })}
                  placeholder="ej. 20"
                  className="bg-transparent border border-[var(--border)]"
                />
              </div>
              <div className="space-y-1.5 flex flex-col">
                <Label className="text-sm font-medium text-[var(--muted)]">Compra Mínima (Opcional)</Label>
                <Input
                  type="number"
                  value={formData.min_purchase?.toString() || ""}
                  onChange={(e) => setFormData({ ...formData, min_purchase: Number(e.target.value) })}
                  placeholder="ej. 15000"
                  className="bg-transparent border border-[var(--border)]"
                />
              </div>
            </Modal.Body>
            <Modal.Footer className="border-t border-[var(--border)]/40 p-4">
              <Button variant="outline" onPress={() => setShowFormModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" isDisabled={saving} onPress={handleSaveCoupon}>
                {saving ? "Guardando..." : "Guardar Cupón"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal>

      {/* Usages Modal */}
      <Modal isOpen={showUsagesModal} onOpenChange={setShowUsagesModal}>
        <Modal.Backdrop />
        <Modal.Container>
          <Modal.Dialog className="bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
            <Modal.CloseTrigger className="text-[var(--muted)] hover:text-[var(--foreground)]" />
            <Modal.Header className="border-b border-[var(--border)] bg-[var(--surface-sunken)]">
              <Modal.Heading className="text-xl font-bold text-[var(--foreground)]">
                Historial de Uso
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body className="p-0">
              {loadingUsages ? (
                <div className="flex flex-col gap-4 p-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex justify-between border-b border-[var(--border)] pb-2 last:border-0">
                      <Skeleton className="h-5 w-32 rounded" />
                      <Skeleton className="h-5 w-32 rounded" />
                      <Skeleton className="h-5 w-24 rounded" />
                    </div>
                  ))}
                </div>
              ) : usages.length === 0 ? (
                <div className="p-10 text-center text-[var(--muted)]">
                  Este cupón aún no ha sido utilizado.
                </div>
              ) : (
                <div className="w-full overflow-x-auto max-h-[500px]">
                  <Table className="w-full">
                    <Table.ScrollContainer>
                      <Table.Content aria-label="Tabla de usos del cupón">
                        <Table.Header className="bg-[var(--surface-sunken)] border-b border-[var(--border)]">
                          <Table.Column isRowHeader className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Orden ID</Table.Column>
                          <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Usuario ID</Table.Column>
                          <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider text-right">Fecha</Table.Column>
                        </Table.Header>
                        <Table.Body>
                          {usages.map((u, idx) => (
                            <Table.Row key={idx} className="border-b border-[var(--border)] last:border-0 hover:bg-white/[0.02]">
                              <Table.Cell className="py-4 px-4 text-[var(--foreground)] text-sm">{u.order_id}</Table.Cell>
                              <Table.Cell className="py-4 px-4 text-[var(--foreground)] text-sm">{u.user_id}</Table.Cell>
                              <Table.Cell className="py-4 px-4 text-[var(--muted)] text-sm text-right">
                                {new Date(u.used_at).toLocaleDateString()}
                              </Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table.Content>
                    </Table.ScrollContainer>
                  </Table>
                </div>
              )}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal>
    </div>
  );
}
