"use client";

import { useState } from "react";
import {
  Card,
  Button,
  Input,
  Label,
  Skeleton,
  Modal,
  toast,
} from "@heroui/react";
import { getErrorMessage } from "@/lib/utils/error-message";

interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
}

const getEventStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case "ACTIVE":
    case "IN_PROGRESS":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "UPCOMING":
    case "SCHEDULED":
      return "bg-sky-500/10 text-sky-400 border-sky-500/20";
    case "CANCELLED":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    case "COMPLETED":
      return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    default:
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  }
};

const MOCK_EVENTS: Event[] = [
  {
    id: "1",
    title: "Torneo Pokemon TCG",
    description: "Torneo semanal de cartas Pokemon con premios en sobres.",
    start_date: "2026-03-20T18:00",
    end_date: "2026-03-20T22:00",
    status: "UPCOMING",
    created_at: "2026-03-10",
  },
  {
    id: "2",
    title: "Lanzamiento Set Nuevo",
    description: "Evento de lanzamiento del nuevo set con preventas y sorteos.",
    start_date: "2026-04-01T10:00",
    end_date: "2026-04-01T20:00",
    status: "SCHEDULED",
    created_at: "2026-03-05",
  },
  {
    id: "3",
    title: "Noche de Juegos de Mesa",
    description: "Evento comunitario de juegos de mesa, entrada libre.",
    start_date: "2026-03-15T19:00",
    end_date: "2026-03-15T23:00",
    status: "COMPLETED",
    created_at: "2026-03-01",
  },
];

const formatEventDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-CL", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

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
      return toast.danger("Titulo, fecha inicio y fecha fin son requeridos");
    }
    if (new Date(formData.end_date) <= new Date(formData.start_date)) {
      return toast.danger("La fecha de fin debe ser posterior a la de inicio");
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
      setEvents((prev) => [newEvent, ...prev]);
      toast.success("Evento creado");
      setShowFormModal(false);
    } catch (error: unknown) {
      toast.danger(getErrorMessage(error, "Error al crear evento"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--foreground)]">
            Eventos
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">Organiza torneos, lanzamientos y eventos de tu tienda</p>
        </div>
        <Button variant="primary" onPress={handleOpenForm}>
          Crear Evento
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(3).fill(0).map((_, i) => (
            <Card key={i} className="bg-[var(--surface)] border border-[var(--border)]">
              <Card.Content className="p-6 space-y-3">
                <Skeleton className="h-6 w-3/4 rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-1/2 rounded" />
                <Skeleton className="h-5 w-20 rounded" />
              </Card.Content>
            </Card>
          ))}
        </div>
      ) : events.length === 0 ? (
        <Card className="bg-[var(--surface)] border border-[var(--border)]">
          <Card.Content className="p-12 text-center">
            <p className="text-[var(--muted)]">No hay eventos creados. Usa &quot;Crear Evento&quot; para comenzar.</p>
          </Card.Content>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <Card key={event.id} className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-colors">
              <Card.Content className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-semibold text-[var(--foreground)] line-clamp-2">{event.title}</h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getEventStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                </div>
                <p className="text-sm text-[var(--muted)] line-clamp-2">{event.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--muted)]"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                    <p className="text-xs text-[var(--muted)]">
                      <span className="text-[var(--foreground)]">Inicio:</span> {formatEventDate(event.start_date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--muted)]"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                    <p className="text-xs text-[var(--muted)]">
                      <span className="text-[var(--foreground)]">Fin:</span> {formatEventDate(event.end_date)}
                    </p>
                  </div>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}

      {/* Create Event Modal */}
      <Modal isOpen={showFormModal} onOpenChange={setShowFormModal}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="bg-[var(--surface)] border border-[var(--border)]">
              <Modal.CloseTrigger className="text-[var(--muted)] hover:text-[var(--foreground)]" />
              <Modal.Header>
                <Modal.Heading className="text-xl font-bold text-[var(--foreground)]">
                  Crear Evento
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body className="py-4 space-y-4">
                <div className="space-y-1.5 flex flex-col">
                  <Label className="text-sm font-medium text-[var(--muted)]">Titulo</Label>
                  <Input
                    placeholder="Ej. Torneo Pokemon TCG"
                    value={formData.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-transparent border border-[var(--border)]"
                  />
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <Label className="text-sm font-medium text-[var(--muted)]">Descripcion</Label>
                  <Input
                    placeholder="Describe el evento..."
                    value={formData.description}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-transparent border border-[var(--border)]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 flex flex-col">
                    <Label className="text-sm font-medium text-[var(--muted)]">Fecha Inicio</Label>
                    <Input
                      type="datetime-local"
                      value={formData.start_date}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, start_date: e.target.value })}
                      className="bg-transparent border border-[var(--border)]"
                    />
                  </div>
                  <div className="space-y-1.5 flex flex-col">
                    <Label className="text-sm font-medium text-[var(--muted)]">Fecha Fin</Label>
                    <Input
                      type="datetime-local"
                      value={formData.end_date}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, end_date: e.target.value })}
                      className="bg-transparent border border-[var(--border)]"
                    />
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer className="border-t border-[var(--border)]/40 p-4">
                <Button variant="outline" onPress={() => setShowFormModal(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" isDisabled={saving} onPress={handleCreateEvent}>
                  {saving ? "Creando..." : "Crear Evento"}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
