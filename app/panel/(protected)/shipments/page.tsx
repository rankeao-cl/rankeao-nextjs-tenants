"use client";

import { useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/error-message";
import { useShipments, useUpdateShipment } from "@/lib/hooks/use-shipments";
import type { Shipment } from "@/lib/api/shipments";

// Modular Components
import { ShipmentHeader } from "./components/ShipmentHeader";
import { ShipmentList } from "./components/ShipmentList";
import { ShipmentFormModal } from "./components/ShipmentFormModal";

const getShipmentStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case "DELIVERED":
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    case "IN_TRANSIT":
      return "bg-sky-50 text-sky-600 border-sky-100";
    case "PENDING":
      return "bg-amber-50 text-amber-600 border-amber-100";
    case "RETURNED":
    case "FAILED":
      return "bg-red-50 text-red-600 border-red-100";
    default:
      return "bg-[var(--c-gray-50)] text-[var(--c-gray-500)] border-[var(--c-gray-200)]";
  }
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  IN_TRANSIT: "En Tránsito",
  DELIVERED: "Entregado",
  RETURNED: "Devuelto",
  FAILED: "Fallido",
};

export default function ShipmentsPage() {
  const { data, isLoading } = useShipments();
  const shipments = data?.shipments ?? [];
  const updateMutation = useUpdateShipment();

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [editData, setEditData] = useState({
    carrier: "",
    tracking_number: "",
    status: "",
    estimated_delivery: "",
  });

  const handleOpenEdit = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setEditData({
      carrier: shipment.carrier,
      tracking_number: shipment.tracking_number ?? "",
      status: shipment.status,
      estimated_delivery: shipment.estimated_delivery ?? "",
    });
    setShowEditModal(true);
  };

  const handleSaveShipment = async () => {
    if (!selectedShipment) return;
    if (!editData.carrier || !editData.tracking_number) {
      return toast.error("Transportista y número de seguimiento son requeridos");
    }
    try {
      await updateMutation.mutateAsync({
        id: selectedShipment.id,
        data: {
          carrier: editData.carrier,
          tracking_number: editData.tracking_number,
          status: editData.status,
          estimated_delivery: editData.estimated_delivery || undefined,
        },
      });
      toast.success("Envío actualizado correctamente");
      setShowEditModal(false);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al actualizar envío"));
    }
  };

  return (
    <div className="space-y-10 max-w-[1400px] mx-auto pb-10 px-4 sm:px-0">
      <ShipmentHeader onNewShipment={() => toast.info("Función para crear guía desde orden disponible pronto")} />

      <ShipmentList
        shipments={shipments}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        getShipmentStatusColor={getShipmentStatusColor}
        STATUS_LABELS={STATUS_LABELS}
      />

      <ShipmentFormModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        selectedShipment={selectedShipment}
        editData={editData}
        onEditChange={setEditData}
        onSave={handleSaveShipment}
        saving={updateMutation.isPending}
      />
    </div>
  );
}
