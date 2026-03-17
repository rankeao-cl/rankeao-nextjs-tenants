"use client";

import { useState } from "react";
import {
  Card,
  Table,
  Button,
  Input,
  Label,
  Skeleton,
  Modal,
  Select,
  ListBox,
  toast,
} from "@heroui/react";
import { getErrorMessage } from "@/lib/utils/error-message";

interface Shipment {
  id: string;
  order_id: string;
  carrier: string;
  tracking_number: string;
  status: string;
  shipped_at: string;
  estimated_delivery: string;
}

const getShipmentStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case "DELIVERED":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "IN_TRANSIT":
      return "bg-sky-500/10 text-sky-400 border-sky-500/20";
    case "PENDING":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "RETURNED":
    case "FAILED":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    default:
      return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  }
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  IN_TRANSIT: "En Transito",
  DELIVERED: "Entregado",
  RETURNED: "Devuelto",
  FAILED: "Fallido",
};

const MOCK_SHIPMENTS: Shipment[] = [
  {
    id: "1",
    order_id: "ORD-101",
    carrier: "Chilexpress",
    tracking_number: "CX-2026031201",
    status: "IN_TRANSIT",
    shipped_at: "2026-03-12",
    estimated_delivery: "2026-03-17",
  },
  {
    id: "2",
    order_id: "ORD-098",
    carrier: "Starken",
    tracking_number: "STK-2026030501",
    status: "DELIVERED",
    shipped_at: "2026-03-05",
    estimated_delivery: "2026-03-08",
  },
  {
    id: "3",
    order_id: "ORD-095",
    carrier: "Correos de Chile",
    tracking_number: "CC-2026022801",
    status: "PENDING",
    shipped_at: "",
    estimated_delivery: "",
  },
];

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>(MOCK_SHIPMENTS);
  const [isLoading] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [editData, setEditData] = useState({
    carrier: "",
    tracking_number: "",
    status: "",
    estimated_delivery: "",
  });
  const [saving, setSaving] = useState(false);

  const handleOpenEdit = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setEditData({
      carrier: shipment.carrier,
      tracking_number: shipment.tracking_number,
      status: shipment.status,
      estimated_delivery: shipment.estimated_delivery,
    });
    setShowEditModal(true);
  };

  const handleSaveShipment = async () => {
    if (!selectedShipment) return;
    if (!editData.carrier || !editData.tracking_number) {
      return toast.danger("Transportista y numero de seguimiento son requeridos");
    }
    setSaving(true);
    try {
      setShipments((prev) =>
        prev.map((s) =>
          s.id === selectedShipment.id
            ? {
                ...s,
                carrier: editData.carrier,
                tracking_number: editData.tracking_number,
                status: editData.status,
                estimated_delivery: editData.estimated_delivery,
                shipped_at: editData.status !== "PENDING" && !s.shipped_at ? new Date().toISOString().split("T")[0] : s.shipped_at,
              }
            : s
        )
      );
      toast.success("Envio actualizado");
      setShowEditModal(false);
    } catch (error: unknown) {
      toast.danger(getErrorMessage(error, "Error al actualizar envio"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--foreground)]">
            Envios
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">Rastrea y gestiona los envios de tus ordenes</p>
        </div>
      </div>

      <Card className="bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label="Tabla de Envios" className="min-w-full">
                <Table.Header className="bg-[var(--surface-sunken)] border-b border-[var(--border)]">
                  <Table.Column isRowHeader className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Orden</Table.Column>
                  <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Transportista</Table.Column>
                  <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">N° Seguimiento</Table.Column>
                  <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Estado</Table.Column>
                  <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Fecha Envio</Table.Column>
                  <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider text-right">Acciones</Table.Column>
                </Table.Header>
                <Table.Body>
                  {isLoading ? (
                    Array(3).fill(0).map((_, i) => (
                      <Table.Row key={i} className="border-b border-[var(--border)]">
                        <Table.Cell className="py-4 px-4"><Skeleton className="h-5 w-20 rounded" /></Table.Cell>
                        <Table.Cell className="py-4 px-4"><Skeleton className="h-5 w-28 rounded" /></Table.Cell>
                        <Table.Cell className="py-4 px-4"><Skeleton className="h-5 w-36 rounded" /></Table.Cell>
                        <Table.Cell className="py-4 px-4"><Skeleton className="h-5 w-24 rounded" /></Table.Cell>
                        <Table.Cell className="py-4 px-4"><Skeleton className="h-5 w-24 rounded" /></Table.Cell>
                        <Table.Cell className="py-4 px-4"><Skeleton className="h-8 w-20 rounded ml-auto" /></Table.Cell>
                      </Table.Row>
                    ))
                  ) : shipments.length === 0 ? (
                    <Table.Row>
                      <Table.Cell colSpan={6} className="py-12 text-center text-[var(--muted)]">
                        No hay envios registrados.
                      </Table.Cell>
                    </Table.Row>
                  ) : (
                    shipments.map((shipment) => (
                      <Table.Row key={shipment.id} className="border-b border-[var(--border)] last:border-0 hover:bg-white/[0.02] transition-colors">
                        <Table.Cell className="py-4 px-4 text-sm font-medium text-[var(--foreground)]">
                          {shipment.order_id}
                        </Table.Cell>
                        <Table.Cell className="py-4 px-4 text-sm text-[var(--foreground)]">
                          {shipment.carrier}
                        </Table.Cell>
                        <Table.Cell className="py-4 px-4 text-sm font-mono text-[var(--muted)]">
                          {shipment.tracking_number}
                        </Table.Cell>
                        <Table.Cell className="py-4 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getShipmentStatusColor(shipment.status)}`}>
                            {STATUS_LABELS[shipment.status] || shipment.status}
                          </span>
                        </Table.Cell>
                        <Table.Cell className="py-4 px-4 text-sm text-[var(--muted)]">
                          {shipment.shipped_at || "-"}
                        </Table.Cell>
                        <Table.Cell className="py-4 px-4 text-right">
                          <Button size="sm" variant="secondary" onPress={() => handleOpenEdit(shipment)}>
                            Editar
                          </Button>
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

      {/* Edit Shipment Modal */}
      <Modal isOpen={showEditModal} onOpenChange={setShowEditModal}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="bg-[var(--surface)] border border-[var(--border)]">
              <Modal.CloseTrigger className="text-[var(--muted)] hover:text-[var(--foreground)]" />
              <Modal.Header>
                <Modal.Heading className="text-xl font-bold text-[var(--foreground)]">
                  Editar Envio
                </Modal.Heading>
                <p className="text-sm text-[var(--muted)] mt-1">Orden: {selectedShipment?.order_id}</p>
              </Modal.Header>
              <Modal.Body className="py-4 space-y-4">
                <div className="space-y-1.5 flex flex-col">
                  <Label className="text-sm font-medium text-[var(--muted)]">Transportista</Label>
                  <Input
                    placeholder="Ej. Chilexpress"
                    value={editData.carrier}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, carrier: e.target.value })}
                    className="bg-transparent border border-[var(--border)]"
                  />
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <Label className="text-sm font-medium text-[var(--muted)]">Numero de Seguimiento</Label>
                  <Input
                    placeholder="Ej. CX-2026031201"
                    value={editData.tracking_number}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, tracking_number: e.target.value })}
                    className="bg-transparent border border-[var(--border)] font-mono"
                  />
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <Label className="text-sm font-medium text-[var(--muted)]">Estado</Label>
                  <Select
                    selectedKey={editData.status}
                    onSelectionChange={(key: unknown) => { if (key) setEditData({ ...editData, status: key as string }); }}
                    className="w-full"
                  >
                    <Select.Trigger className="bg-transparent border border-[var(--border)]">
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover className="bg-[var(--surface)] border border-[var(--border)]">
                      <ListBox className="text-[var(--foreground)]">
                        <ListBox.Item id="PENDING" textValue="Pendiente">
                          Pendiente
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                        <ListBox.Item id="IN_TRANSIT" textValue="En Transito">
                          En Transito
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                        <ListBox.Item id="DELIVERED" textValue="Entregado">
                          Entregado
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                        <ListBox.Item id="RETURNED" textValue="Devuelto">
                          Devuelto
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                        <ListBox.Item id="FAILED" textValue="Fallido">
                          Fallido
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <Label className="text-sm font-medium text-[var(--muted)]">Entrega Estimada</Label>
                  <Input
                    type="date"
                    value={editData.estimated_delivery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, estimated_delivery: e.target.value })}
                    className="bg-transparent border border-[var(--border)]"
                  />
                </div>
              </Modal.Body>
              <Modal.Footer className="border-t border-[var(--border)]/40 p-4">
                <Button variant="outline" onPress={() => setShowEditModal(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" isDisabled={saving} onPress={handleSaveShipment}>
                  {saving ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
