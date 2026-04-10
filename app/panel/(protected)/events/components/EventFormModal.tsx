"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarRange, Type, AlignLeft } from "lucide-react";

interface EventFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    title: string;
    description: string;
    start_date: string;
    end_date: string;
  };
  onFormChange: (data: any) => void;
  onSave: () => void;
  saving: boolean;
}

export function EventFormModal({
  open,
  onOpenChange,
  formData,
  onFormChange,
  onSave,
  saving,
}: EventFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#ffffff] border border-[var(--c-gray-200)] sm:max-w-[500px] p-0 overflow-hidden rounded-[24px]">
        <div className="p-6 border-b border-[var(--c-gray-100)] bg-[var(--c-gray-50)]/50 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-[var(--c-navy-500)]/10 text-[var(--c-navy-500)]">
             <CalendarRange className="h-6 w-6" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[var(--c-gray-800)]">
              Crear Nuevo Evento
            </DialogTitle>
            <p className="text-sm text-[var(--c-gray-500)] font-medium">
              Organiza una actividad para tus clientes
            </p>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2 flex flex-col">
            <Label className="text-sm font-semibold text-[var(--c-gray-600)] flex items-center gap-2">
              <Type className="h-3.5 w-3.5 text-[var(--c-navy-500)]" /> Título del Evento
            </Label>
            <Input
              placeholder="Ej. Torneo Regional Pokemon TCG"
              value={formData.title}
              onChange={(e) => onFormChange({ ...formData, title: e.target.value })}
              className="bg-white border-[var(--c-gray-200)] rounded-xl h-11 focus:ring-[var(--c-navy-500)] focus:border-[var(--c-navy-500)]"
            />
          </div>

          <div className="space-y-2 flex flex-col">
            <Label className="text-sm font-semibold text-[var(--c-gray-600)] flex items-center gap-2">
              <AlignLeft className="h-3.5 w-3.5 text-[var(--c-navy-500)]" /> Descripción
            </Label>
            <textarea
              placeholder="Detalla de qué trata el evento, premios, requisitos, etc..."
              value={formData.description}
              onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
              className="w-full bg-white border border-[var(--c-gray-200)] rounded-xl p-3 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[var(--c-navy-500)]/20 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 flex flex-col p-4 rounded-2xl bg-[var(--c-gray-50)] border border-[var(--c-gray-100)]">
              <Label className="text-xs font-bold text-[var(--c-gray-500)] uppercase">Fecha de Inicio</Label>
              <Input
                type="datetime-local"
                value={formData.start_date}
                onChange={(e) => onFormChange({ ...formData, start_date: e.target.value })}
                className="bg-white border-[var(--c-gray-200)] rounded-xl h-10 text-xs shadow-sm"
              />
            </div>
            <div className="space-y-2 flex flex-col p-4 rounded-2xl bg-[var(--c-gray-50)] border border-[var(--c-gray-100)]">
              <Label className="text-xs font-bold text-[var(--c-gray-500)] uppercase">Fecha de Término</Label>
              <Input
                type="datetime-local"
                value={formData.end_date}
                onChange={(e) => onFormChange({ ...formData, end_date: e.target.value })}
                className="bg-white border-[var(--c-gray-200)] rounded-xl h-10 text-xs shadow-sm"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-2">
          <div className="flex w-full gap-3">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="flex-1 rounded-xl h-11 border-[var(--c-gray-200)] text-[var(--c-gray-600)] font-bold shadow-sm"
            >
              Cerrar
            </Button>
            <Button 
              variant="default" 
              disabled={saving} 
              onClick={onSave}
              className="flex-1 rounded-xl h-11 bg-[var(--c-navy-500)] hover:bg-[var(--c-navy-600)] text-white font-bold shadow-lg shadow-[var(--c-navy-500)]/20"
            >
              {saving ? "Creando..." : "Publicar Evento"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
