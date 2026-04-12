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
    case "OWNER": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case "ADMIN": return "bg-purple-500/10 text-purple-600 border-purple-500/20";
    case "JUDGE": return "bg-sky-500/10 text-sky-600 border-sky-500/20";
    case "CASHIER": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    default: return "bg-[var(--surface)] text-[var(--muted-foreground)] border-[var(--border)]";
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
        <DialogContent className="bg-[var(--card)] border border-[var(--border)] sm:max-w-[450px] p-0 overflow-hidden rounded-[28px] shadow-2xl">
          <div className="p-6 border-b border-[var(--surface)] bg-[var(--surface)]/50 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[var(--brand)]/10 text-[var(--brand)]">
              <UserPlus className="h-6 w-6" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-[var(--foreground)]">
                Invitar al Equipo
              </DialogTitle>
              <p className="text-sm text-[var(--muted-foreground)] font-medium">
                Expande tu staff y delega funciones
              </p>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-6">
            <div className="space-y-2 flex flex-col">
              <Label className="text-[12px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider flex items-center gap-2">
                <Mail className="h-3 w-3 text-[var(--brand)]" /> Correo Electrónico
              </Label>
              <Input
                placeholder="ejemplo@correo.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="bg-[var(--card)] border-[var(--border)] h-11 focus:ring-[var(--brand)]/20"
              />
            </div>

            <div className="space-y-2 flex flex-col">
              <Label className="text-[12px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-[var(--brand)]" /> Selecciona un Rol
              </Label>
              <select
                className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl h-11 px-3 py-2 text-sm text-[var(--foreground)] font-bold focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 transition-all appearance-none"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
              >
                <option value="ADMIN">Administrador</option>
                <option value="JUDGE">Juez / Staff</option>
                <option value="CASHIER">Cajero / Atención</option>
              </select>
              <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-500/5 mt-2">
                 <Info className="h-4 w-4 text-[var(--brand)] mt-0.5" />
                 <p className="text-[11px] text-[var(--brand)] leading-tight font-medium">
                    El usuario recibirá un correo para unirse a tu tienda y configurar sus accesos.
                 </p>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 pt-2 bg-[var(--surface)]/30 border-t border-[var(--surface)]">
            <div className="flex w-full gap-3">
              <Button variant="outline" onClick={() => setShowInviteModal(false)} className="flex-1 h-11">
                Cancelar
              </Button>
              <Button
                variant="default"
                disabled={actionLoading || !inviteEmail}
                onClick={handleInvite}
                className="flex-1 h-11"
              >
                {inviteMutation.isPending ? "Enviando..." : "Enviar Invitación"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role Management Modal */}
      <Dialog open={showRoleModal} onOpenChange={setShowRoleModal}>
        <DialogContent className="bg-[var(--card)] border border-[var(--border)] sm:max-w-[400px] p-0 overflow-hidden rounded-[28px] shadow-2xl">
          <div className="p-6 border-b border-[var(--surface)] bg-[var(--surface)]/50">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-[var(--foreground)]">
                Modificar Privilegios
              </DialogTitle>
            </DialogHeader>
          </div>
          <div className="p-8 space-y-6">
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              Estás modificando el rol de <strong className="text-[var(--foreground)] underline decoration-[var(--brand)] decoration-2">{selectedMember?.display_name || selectedMember?.username}</strong>. Asegúrate de otorgar los permisos adecuados.
            </p>
            <div className="space-y-4">
              <select
                className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl h-12 px-4 text-sm text-[var(--foreground)] font-bold focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 transition-all appearance-none"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              >
                <option value="ADMIN">Administrador</option>
                <option value="JUDGE">Juez / Staff</option>
                <option value="CASHIER">Cajero / Atención</option>
              </select>
            </div>
          </div>
          <DialogFooter className="p-6 pt-2 bg-[var(--surface)]/30 border-t border-[var(--surface)]">
             <div className="flex w-full gap-3">
                <Button variant="outline" onClick={() => setShowRoleModal(false)} className="flex-1 h-11">Cancelar</Button>
                <Button variant="default" disabled={actionLoading} onClick={handleUpdateRole} className="flex-1 h-11">
                  {updateRoleMutation.isPending ? "Procesando..." : "Actualizar Rol"}
                </Button>
             </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
