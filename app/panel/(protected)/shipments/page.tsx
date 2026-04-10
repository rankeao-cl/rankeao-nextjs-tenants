"use client";

import { useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/error-message";

// Modular Components
import { ShipmentHeader } from "./components/ShipmentHeader";
import { ShipmentList } from "./components/ShipmentList";
import { ShipmentFormModal } from "./components/ShipmentFormModal";

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
      return toast.error("Transportista y número de seguimiento son requeridos");
    }
    setSaving(true);
    try {
      // Simulation delay
      await new Promise(r => setTimeout(r, 600));
      
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
      toast.success("Envío actualizado correctamente");
      setShowEditModal(false);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al actualizar envío"));
    } finally {
      setSaving(false);
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
        saving={saving}
      />
    </div>
  );
}
