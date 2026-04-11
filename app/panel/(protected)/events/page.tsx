"use client";

import { useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/error-message";
import { useEvents, useCreateEvent } from "@/lib/hooks/use-events";

// Modular Components
import { EventHeader } from "./components/EventHeader";
import { EventList } from "./components/EventList";
import { EventFormModal } from "./components/EventFormModal";

export default function EventsPage() {
  const { data: events = [], isLoading } = useEvents();
  const createMutation = useCreateEvent();

  const [showFormModal, setShowFormModal] = useState(false);
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
    try {
      await createMutation.mutateAsync({
        title: formData.title,
        description: formData.description || undefined,
        starts_at: formData.start_date,
        ends_at: formData.end_date,
      });
      toast.success("Evento creado exitosamente");
      setShowFormModal(false);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al crear evento"));
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
        saving={createMutation.isPending}
      />
    </div>
  );
}
