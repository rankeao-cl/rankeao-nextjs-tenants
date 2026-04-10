"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useStaff,
  useInviteStaff,
  useCancelStaffInvitation,
  useUpdateStaffRole,
} from "@/lib/hooks/use-staff";
import { getErrorMessage } from "@/lib/utils/error-message";
import type { StaffMember } from "@/lib/types/staff";
import { UserPlus, ShieldCheck, Mail, Info } from "lucide-react";

// Modular Components
import { StaffHeader } from "./components/StaffHeader";
import { StaffList } from "./components/StaffList";

const ROLE_LABELS: Record<string, string> = {
  OWNER: "Propietario",
  ADMIN: "Administrador",
  JUDGE: "Juez",
  CASHIER: "Cajero",
};

const getRoleColor = (role: string) => {
  switch (role?.toUpperCase()) {
    case "OWNER": return "bg-amber-50 text-amber-600 border-amber-100";
    case "ADMIN": return "bg-purple-50 text-purple-600 border-purple-100";
    case "JUDGE": return "bg-sky-50 text-sky-600 border-sky-100";
    case "CASHIER": return "bg-emerald-50 text-emerald-600 border-emerald-100";
    default: return "bg-[var(--c-gray-50)] text-[var(--c-gray-500)] border-[var(--c-gray-200)]";
  }
};

export default function StaffPage() {
  const { data: staff = [], isLoading } = useStaff();
  const inviteMutation = useInviteStaff();
  const revokeMutation = useCancelStaffInvitation();
  const updateRoleMutation = useUpdateStaffRole();

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("CASHIER");

  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState("");

  const handleInvite = async () => {
    if (!inviteEmail) return;
    try {
      await inviteMutation.mutateAsync({ email: inviteEmail, role: inviteRole });
      toast.success("Invitación enviada exitosamente");
      setShowInviteModal(false);
      setInviteEmail("");
      setInviteRole("CASHIER");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "No se pudo enviar la invitación"));
    }
  };

  const handleRevoke = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas remover este miembro del equipo?")) return;
    try {
      await revokeMutation.mutateAsync(String(id));
      toast.success("Miembro removido permanentemente");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "No se pudo remover al miembro"));
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedMember || !newRole) return;
    try {
      await updateRoleMutation.mutateAsync({ id: String(selectedMember.id), role: newRole });
      toast.success("Rol actualizado con éxito");
      setShowRoleModal(false);
      setSelectedMember(null);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al actualizar el rol"));
    }
  };

  const actionLoading = inviteMutation.isPending || updateRoleMutation.isPending;

  return (
    <div className="space-y-10 max-w-[1400px] mx-auto pb-10 px-4 sm:px-0">
      <StaffHeader onInvite={() => setShowInviteModal(true)} />

      <StaffList 
        staff={staff}
        isLoading={isLoading}
        onEditRole={(member) => { setSelectedMember(member); setNewRole(member.role); setShowRoleModal(true); }}
        onRemove={handleRevoke}
        getRoleColor={getRoleColor}
        ROLE_LABELS={ROLE_LABELS}
      />

      {/* Invite Modal */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent className="bg-[#ffffff] border border-[var(--c-gray-200)] sm:max-w-[450px] p-0 overflow-hidden rounded-[28px] shadow-2xl">
          <div className="p-6 border-b border-[var(--c-gray-100)] bg-[var(--c-gray-50)]/50 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[var(--c-navy-500)]/10 text-[var(--c-navy-500)]">
              <UserPlus className="h-6 w-6" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-[var(--c-gray-800)]">
                Invitar al Equipo
              </DialogTitle>
              <p className="text-sm text-[var(--c-gray-500)] font-medium">
                Expande tu staff y delega funciones
              </p>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-6">
            <div className="space-y-2 flex flex-col">
              <Label className="text-[12px] font-bold text-[var(--c-gray-500)] uppercase tracking-wider flex items-center gap-2">
                <Mail className="h-3 w-3 text-[var(--c-navy-500)]" /> Correo Electrónico
              </Label>
              <Input
                placeholder="ejemplo@correo.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="bg-white border-[var(--c-gray-200)] rounded-xl h-11 focus:ring-[var(--c-navy-500)]/20"
              />
            </div>

            <div className="space-y-2 flex flex-col">
              <Label className="text-[12px] font-bold text-[var(--c-gray-500)] uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-[var(--c-cyan-500)]" /> Selecciona un Rol
              </Label>
              <select
                className="w-full bg-white border border-[var(--c-gray-200)] rounded-xl h-11 px-3 py-2 text-sm text-[var(--c-gray-800)] font-bold focus:outline-none focus:ring-2 focus:ring-[var(--c-navy-500)]/20 transition-all appearance-none"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
              >
                <option value="ADMIN">Administrador</option>
                <option value="JUDGE">Juez / Staff</option>
                <option value="CASHIER">Cajero / Atención</option>
              </select>
              <div className="flex items-start gap-2 p-3 bg-blue-50/50 rounded-xl mt-2">
                 <Info className="h-4 w-4 text-[var(--c-navy-500)] mt-0.5" />
                 <p className="text-[11px] text-[var(--c-navy-500)] leading-tight font-medium">
                    El usuario recibirá un correo para unirse a tu tienda y configurar sus accesos.
                 </p>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 pt-2 bg-[var(--c-gray-50)]/30 border-t border-[var(--c-gray-100)]">
            <div className="flex w-full gap-3">
              <Button variant="outline" onClick={() => setShowInviteModal(false)} className="flex-1 rounded-xl h-11">
                Cancelar
              </Button>
              <Button
                variant="default"
                disabled={actionLoading || !inviteEmail}
                onClick={handleInvite}
                className="flex-1 rounded-xl h-11 bg-[var(--c-navy-500)] hover:bg-[var(--c-navy-600)]"
              >
                {inviteMutation.isPending ? "Enviando..." : "Enviar Invitación"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role Management Modal */}
      <Dialog open={showRoleModal} onOpenChange={setShowRoleModal}>
        <DialogContent className="bg-[#ffffff] border border-[var(--c-gray-200)] sm:max-w-[400px] p-0 overflow-hidden rounded-[28px] shadow-2xl">
          <div className="p-6 border-b border-[var(--c-gray-100)] bg-[var(--c-gray-50)]/50">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-[var(--c-gray-800)]">
                Modificar Privilegios
              </DialogTitle>
            </DialogHeader>
          </div>
          <div className="p-8 space-y-6">
            <p className="text-sm text-[var(--c-gray-500)] leading-relaxed">
              Estás modificando el rol de <strong className="text-[var(--c-gray-800)] underline decoration-[var(--c-cyan-500)] decoration-2">{selectedMember?.display_name || selectedMember?.username}</strong>. Asegúrate de otorgar los permisos adecuados.
            </p>
            <div className="space-y-4">
              <select
                className="w-full bg-white border border-[var(--c-gray-200)] rounded-xl h-12 px-4 text-sm text-[var(--c-gray-800)] font-bold focus:outline-none focus:ring-2 focus:ring-[var(--c-navy-500)]/20 transition-all appearance-none"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              >
                <option value="ADMIN">Administrador</option>
                <option value="JUDGE">Juez / Staff</option>
                <option value="CASHIER">Cajero / Atención</option>
              </select>
            </div>
          </div>
          <DialogFooter className="p-6 pt-2 bg-[var(--c-gray-50)]/30 border-t border-[var(--c-gray-100)]">
             <div className="flex w-full gap-3">
                <Button variant="outline" onClick={() => setShowRoleModal(false)} className="flex-1 rounded-xl h-11">Cancelar</Button>
                <Button variant="default" disabled={actionLoading} onClick={handleUpdateRole} className="flex-1 rounded-xl h-11 bg-[var(--c-navy-500)]">
                  {updateRoleMutation.isPending ? "Procesando..." : "Actualizar Rol"}
                </Button>
             </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
