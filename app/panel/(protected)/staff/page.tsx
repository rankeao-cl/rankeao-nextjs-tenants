"use client";

import { useState } from "react";
import {
  Card,
  Table,
  Button,
  Skeleton,
  Modal,
  Input,
  Label,
  Select,
  ListBox,
  toast,
} from "@heroui/react";
import {
  useStaff,
  useInviteStaff,
  useCancelStaffInvitation,
  useUpdateStaffRole,
  useTransferOwnership,
} from "@/lib/hooks/use-staff";
import { getErrorMessage } from "@/lib/utils/error-message";
import type { StaffMember } from "@/lib/types/staff";

const getRoleColor = (role: string) => {
  switch (role?.toUpperCase()) {
    case "OWNER": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "ADMIN": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    default: return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  }
};

const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case "PENDING": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "ACTIVE": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    default: return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  }
};

export default function StaffPage() {
  const { data: staff = [], isLoading } = useStaff();
  const inviteMutation = useInviteStaff();
  const revokeMutation = useCancelStaffInvitation();
  const updateRoleMutation = useUpdateStaffRole();
  const transferMutation = useTransferOwnership();

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("STAFF");

  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState("");

  const handleInvite = async () => {
    if (!inviteEmail) return;
    try {
      await inviteMutation.mutateAsync({ email: inviteEmail, role: inviteRole });
      toast.success("Invitación enviada");
      setShowInviteModal(false);
      setInviteEmail("");
    } catch (error: unknown) {
      toast.danger(getErrorMessage(error, "No se pudo invitar al usuario"));
    }
  };

  const handleRevoke = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas revocar esta invitación o remover este miembro?")) return;
    try {
      await revokeMutation.mutateAsync(id);
      toast.success("Revocación exitosa");
    } catch (error: unknown) {
      toast.danger(getErrorMessage(error, "No se pudo revocar la invitación"));
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedMember || !newRole) return;
    try {
      await updateRoleMutation.mutateAsync({ id: selectedMember.id, role: newRole });
      toast.success("Rol actualizado");
      setShowRoleModal(false);
      setSelectedMember(null);
    } catch (error: unknown) {
      toast.danger(getErrorMessage(error, "Error al cambiar el rol"));
    }
  };

  const handleTransferOwnership = async (id: string) => {
    if (!window.confirm("ATENCIÓN: Estás a punto de transferir la propiedad entera de esta tienda. Esto es irreversible. ¿Deseas continuar?")) return;
    try {
      await transferMutation.mutateAsync({ new_owner_id: id });
      toast.success("Propiedad transferida exitosamente");
    } catch (error: unknown) {
      toast.danger(getErrorMessage(error, "Error al transferir la propiedad"));
    }
  };

  const actionLoading = inviteMutation.isPending || updateRoleMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--foreground)]">
            Equipo y Roles
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">Gestiona los miembros de tu tienda y sus permisos</p>
        </div>
        <Button className="bg-[var(--primary)] text-[var(--primary-foreground)]" onPress={() => setShowInviteModal(true)}>
          Invitar Miembro
        </Button>
      </div>

      <Card className="bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label="Lista de Staff" className="min-w-full">
                <Table.Header className="bg-[var(--surface-sunken)] border-b border-[var(--border)]">
                  <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Miembro</Table.Column>
                  <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Email</Table.Column>
                  <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Rol</Table.Column>
                  <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Estado</Table.Column>
                  <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider text-right">Acciones</Table.Column>
                </Table.Header>
                <Table.Body>
                  {isLoading ? (
                    Array(3).fill(0).map((_, i) => (
                      <Table.Row key={i} className="border-b border-[var(--border)]">
                        <Table.Cell className="py-4 px-4"><Skeleton className="h-5 w-28 rounded" /></Table.Cell>
                        <Table.Cell className="py-4 px-4"><Skeleton className="h-5 w-40 rounded" /></Table.Cell>
                        <Table.Cell className="py-4 px-4"><Skeleton className="h-5 w-16 rounded" /></Table.Cell>
                        <Table.Cell className="py-4 px-4"><Skeleton className="h-5 w-20 rounded" /></Table.Cell>
                        <Table.Cell className="py-4 px-4"><Skeleton className="h-5 w-24 rounded ml-auto" /></Table.Cell>
                      </Table.Row>
                    ))
                  ) : staff.length === 0 ? (
                    <Table.Row>
                      <Table.Cell colSpan={5} className="py-12 text-center text-[var(--muted)]">
                        Aún no hay más miembros en tu tienda.
                      </Table.Cell>
                    </Table.Row>
                  ) : (
                    staff.map((member) => (
                      <Table.Row key={member.id} className="border-b border-[var(--border)] last:border-0 hover:bg-white/[0.02] transition-colors">
                        <Table.Cell className="py-4 px-4 font-medium text-[var(--foreground)]">
                          {member.name || member.username || "Sin nombre"}
                        </Table.Cell>
                        <Table.Cell className="py-4 px-4 text-sm text-[var(--muted)]">
                          {member.email}
                        </Table.Cell>
                        <Table.Cell className="py-4 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(member.role)}`}>
                            {member.role || "STAFF"}
                          </span>
                        </Table.Cell>
                        <Table.Cell className="py-4 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(member.status)}`}>
                            {member.status === "PENDING" ? "Pendiente" : "Activo"}
                          </span>
                        </Table.Cell>
                        <Table.Cell className="py-4 px-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm" variant="outline"
                              onPress={() => { setSelectedMember(member); setNewRole(member.role || "STAFF"); setShowRoleModal(true); }}
                            >
                              Cambiar Rol
                            </Button>
                            <Button
                              size="sm" variant="outline"
                              className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
                              onPress={() => handleTransferOwnership(member.id)}
                            >
                              Transferir
                            </Button>
                            <Button
                              size="sm" variant="outline"
                              className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                              onPress={() => handleRevoke(member.id)}
                            >
                              Revocar
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

      {/* Invite Modal */}
      <Modal isOpen={showInviteModal} onOpenChange={setShowInviteModal}>
        <Modal.Backdrop />
        <Modal.Container>
          <Modal.Dialog className="bg-[var(--surface)] border border-[var(--border)]">
            <Modal.CloseTrigger className="text-[var(--muted)] hover:text-[var(--foreground)]" />
            <Modal.Header>
              <Modal.Heading className="text-xl font-bold text-[var(--foreground)]">
                Invitar al Equipo
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body className="py-4 space-y-4">
              <div className="space-y-1.5 flex flex-col">
                <Label className="text-sm font-medium text-[var(--muted)]">Correo Electrónico</Label>
                <Input
                  placeholder="ejemplo@email.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  type="email"
                  className="bg-transparent border border-[var(--border)]"
                />
              </div>
              <div className="space-y-1.5 flex flex-col">
                <Label className="text-sm font-medium text-[var(--muted)]">Rol a Asignar</Label>
                <Select
                  className="w-full"
                  selectedKey={inviteRole}
                  onSelectionChange={(key: unknown) => { if (key) setInviteRole(key as string); }}
                >
                  <Select.Trigger className="bg-transparent border border-[var(--border)]">
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover className="bg-[var(--surface)] border border-[var(--border)]">
                    <ListBox className="text-[var(--foreground)]">
                      <ListBox.Item id="STAFF" textValue="Staff">
                        Staff (Permisos limitados)
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                      <ListBox.Item id="ADMIN" textValue="Administrador">
                        Administrador (Control total)
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>
            </Modal.Body>
            <Modal.Footer className="border-t border-[var(--border)]/40 p-4">
              <Button variant="outline" onPress={() => setShowInviteModal(false)}>Cancelar</Button>
              <Button className="bg-[var(--primary)] text-[var(--primary-foreground)]" isDisabled={actionLoading} onPress={handleInvite}>
                {inviteMutation.isPending ? "Enviando..." : "Enviar Invitación"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal>

      {/* Role Modal */}
      <Modal isOpen={showRoleModal} onOpenChange={setShowRoleModal}>
        <Modal.Backdrop />
        <Modal.Container>
          <Modal.Dialog className="bg-[var(--surface)] border border-[var(--border)]">
            <Modal.CloseTrigger className="text-[var(--muted)] hover:text-[var(--foreground)]" />
            <Modal.Header>
              <Modal.Heading className="text-xl font-bold text-[var(--foreground)]">
                Modificar Rol
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body className="py-4 space-y-4">
              <p className="text-sm text-[var(--muted)]">
                Modificando el rol de <strong className="text-[var(--foreground)]">{selectedMember?.email}</strong>.
              </p>
              <div className="space-y-1.5 flex flex-col">
                <Label className="text-sm font-medium text-[var(--muted)]">Nuevo Rol</Label>
                <Select
                  className="w-full"
                  selectedKey={newRole}
                  onSelectionChange={(key: unknown) => { if (key) setNewRole(key as string); }}
                >
                  <Select.Trigger className="bg-transparent border border-[var(--border)]">
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover className="bg-[var(--surface)] border border-[var(--border)]">
                    <ListBox className="text-[var(--foreground)]">
                      <ListBox.Item id="STAFF" textValue="Staff">
                        Staff (Permisos limitados)
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                      <ListBox.Item id="ADMIN" textValue="Administrador">
                        Administrador (Control total salvo propiedad)
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>
            </Modal.Body>
            <Modal.Footer className="border-t border-[var(--border)]/40 p-4">
              <Button variant="outline" onPress={() => setShowRoleModal(false)}>Cancelar</Button>
              <Button className="bg-[var(--primary)] text-[var(--primary-foreground)]" isDisabled={actionLoading} onPress={handleUpdateRole}>
                {updateRoleMutation.isPending ? "Guardando..." : "Guardar Rol"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal>
    </div>
  );
}
