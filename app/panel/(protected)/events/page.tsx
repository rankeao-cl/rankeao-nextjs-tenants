"use client";

import { useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/error-message";

// Modular Components
import { EventHeader } from "./components/EventHeader";
import { EventList } from "./components/EventList";
import { EventFormModal } from "./components/EventFormModal";

interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
}

const MOCK_EVENTS: Event[] = [
  {
    id: "1",
    title: "Torneo Pokemon TCG",
    description: "Torneo semanal de cartas Pokemon con premios en sobres y puntos de liga.",
    start_date: "2026-03-20T18:00",
    end_date: "2026-03-20T22:00",
    status: "UPCOMING",
    created_at: "2026-03-10",
  },
  {
    id: "2",
    title: "Lanzamiento Set Nuevo",
    description: "Evento de lanzamiento del nuevo set con preventas exclusivas y sorteos para asistentes.",
    start_date: "2026-04-01T10:00",
    end_date: "2026-04-01T20:00",
    status: "SCHEDULED",
    created_at: "2026-03-05",
  },
  {
    id: "3",
    title: "Noche de Juegos de Mesa",
    description: "Evento comunitario de juegos de mesa, trae tus juegos o usa los de la casa.",
    start_date: "2026-03-15T19:00",
    end_date: "2026-03-15T23:00",
    status: "COMPLETED",
    created_at: "2026-03-01",
  },
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [isLoading] = useState(false);

  const [showFormModal, setShowFormModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
  });

  const handleOpenForm = () => {
    setFormData({ title: "", description: "", start_date: "", end_date: "" });
    setShowFormModal(true);
  };

  const handleCreateEvent = async () => {
    if (!formData.title || !formData.start_date || !formData.end_date) {
      return toast.error("Titulo, fecha inicio y fecha fin son requeridos");
    }
    if (new Date(formData.end_date) <= new Date(formData.start_date)) {
      return toast.error("La fecha de fin debe ser posterior a la de inicio");
    }
    setSaving(true);
    try {
      const newEvent: Event = {
        id: String(Date.now()),
        title: formData.title,
        description: formData.description,
        start_date: formData.start_date,
        end_date: formData.end_date,
        status: "UPCOMING",
        created_at: new Date().toISOString().split("T")[0],
      };
      // Simulated API call delay
      await new Promise(r => setTimeout(r, 600));
      setEvents((prev) => [newEvent, ...prev]);
      toast.success("Evento creado exitosamente");
      setShowFormModal(false);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al crear evento"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-10 px-4 sm:px-0">
      <EventHeader onNewEvent={handleOpenForm} />

      <EventList events={events} isLoading={isLoading} />

      <EventFormModal
        open={showFormModal}
        onOpenChange={setShowFormModal}
        formData={formData}
        onFormChange={setFormData}
        onSave={handleCreateEvent}
        saving={saving}
      />
    </div>
  );
}
