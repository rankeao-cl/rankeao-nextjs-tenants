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

const ROLE_LABELS: Record<string, string> = {
  OWNER: "Propietario",
  ADMIN: "Administrador",
  JUDGE: "Juez",
  CASHIER: "Cajero",
};

const getRoleColor = (role: string) => {
  switch (role?.toUpperCase()) {
    case "OWNER": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "ADMIN": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "JUDGE": return "bg-sky-500/10 text-sky-400 border-sky-500/20";
    case "CASHIER": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
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
  const [inviteRole, setInviteRole] = useState("CASHIER");

  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState("");

  const handleInvite = async () => {
    if (!inviteEmail) return;
    try {
      await inviteMutation.mutateAsync({ email: inviteEmail, role: inviteRole });
      toast.success("Invitacion enviada");
      setShowInviteModal(false);
      setInviteEmail("");
      setInviteRole("CASHIER");
    } catch (error: unknown) {
      toast.danger(getErrorMessage(error, "No se pudo invitar al usuario"));
    }
  };

  const handleRevoke = async (id: number) => {
    if (!window.confirm("Seguro que deseas remover este miembro?")) return;
    try {
      await revokeMutation.mutateAsync(String(id));
      toast.success("Miembro removido");
    } catch (error: unknown) {
      toast.danger(getErrorMessage(error, "No se pudo remover al miembro"));
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedMember || !newRole) return;
    try {
      await updateRoleMutation.mutateAsync({ id: String(selectedMember.id), role: newRole });
      toast.success("Rol actualizado");
      setShowRoleModal(false);
      setSelectedMember(null);
    } catch (error: unknown) {
      toast.danger(getErrorMessage(error, "Error al cambiar el rol"));
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
                  <Table.Column isRowHeader className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Miembro</Table.Column>
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
                        Aun no hay mas miembros en tu tienda.
                      </Table.Cell>
                    </Table.Row>
                  ) : (
                    staff.map((member) => {
                      const isOwner = member.role === "OWNER";
                      return (
                        <Table.Row key={member.id} className="border-b border-[var(--border)] last:border-0 hover:bg-white/[0.02] transition-colors">
                          <Table.Cell className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              {member.avatar_url ? (
                                <img src={member.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-[var(--primary)]/20 flex items-center justify-center text-xs font-bold text-[var(--primary)]">
                                  {(member.display_name || member.username || "?")[0].toUpperCase()}
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-[var(--foreground)]">
                                  {member.display_name || member.username || "Sin nombre"}
                                </p>
                                <p className="text-xs text-[var(--muted)]">@{member.username}</p>
                              </div>
                            </div>
                          </Table.Cell>
                          <Table.Cell className="py-4 px-4 text-sm text-[var(--muted)]">
                            {member.email}
                          </Table.Cell>
                          <Table.Cell className="py-4 px-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleColor(member.role)}`}>
                              {ROLE_LABELS[member.role] || member.role}
                            </span>
                          </Table.Cell>
                          <Table.Cell className="py-4 px-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${member.is_active
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                              }`}>
                              {member.is_active ? "Activo" : "Inactivo"}
                            </span>
                          </Table.Cell>
                          <Table.Cell className="py-4 px-4 text-right">
                            {isOwner ? (
                              <span className="text-xs text-[var(--muted)] italic">Propietario</span>
                            ) : (
                              <div className="flex gap-2 justify-end">
                                <Button
                                  size="sm" variant="outline"
                                  onPress={() => { setSelectedMember(member); setNewRole(member.role); setShowRoleModal(true); }}
                                >
                                  Cambiar Rol
                                </Button>
                                <Button
                                  size="sm" variant="outline"
                                  className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                                  onPress={() => handleRevoke(member.id)}
                                >
                                  Remover
                                </Button>
                              </div>
                            )}
                          </Table.Cell>
                        </Table.Row>
                      );
                    })
                  )}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        </div>
      </Card>

      {/* Invite Modal */}
      <Modal isOpen={showInviteModal} onOpenChange={setShowInviteModal}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="bg-[var(--surface)] border border-[var(--border)] max-w-md w-full mx-4">
              <Modal.CloseTrigger className="text-[var(--muted)] hover:text-[var(--foreground)]" />
              <Modal.Header className="p-6 pb-0">
                <Modal.Heading className="text-xl font-bold text-[var(--foreground)]">
                  Invitar al Equipo
                </Modal.Heading>
                <p className="text-sm text-[var(--muted)] mt-1">Envia una invitacion por correo electronico</p>
              </Modal.Header>
              <Modal.Body className="p-6 space-y-4">
                <div className="space-y-1.5 flex flex-col">
                  <Label className="text-sm font-medium text-[var(--muted)]">Correo Electronico</Label>
                  <Input
                    placeholder="ejemplo@email.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    type="email"
                    className="bg-transparent border border-[var(--border)] focus:border-[var(--primary)]"
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
                        <ListBox.Item id="ADMIN" textValue="Administrador">
                          <div>
                            <p className="font-medium">Administrador</p>
                            <p className="text-xs text-[var(--muted)]">Control total salvo suscripcion</p>
                          </div>
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                        <ListBox.Item id="JUDGE" textValue="Juez">
                          <div>
                            <p className="font-medium">Juez</p>
                            <p className="text-xs text-[var(--muted)]">Torneos y eventos</p>
                          </div>
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                        <ListBox.Item id="CASHIER" textValue="Cajero">
                          <div>
                            <p className="font-medium">Cajero</p>
                            <p className="text-xs text-[var(--muted)]">Ordenes, inventario y pagos</p>
                          </div>
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>
              </Modal.Body>
              <Modal.Footer className="border-t border-[var(--border)]/40 p-4 flex justify-end gap-3">
                <Button variant="outline" onPress={() => setShowInviteModal(false)}>Cancelar</Button>
                <Button
                  className="bg-[var(--primary)] text-[var(--primary-foreground)]"
                  isDisabled={actionLoading || !inviteEmail}
                  onPress={handleInvite}
                >
                  {inviteMutation.isPending ? "Enviando..." : "Enviar Invitacion"}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      {/* Role Modal */}
      <Modal isOpen={showRoleModal} onOpenChange={setShowRoleModal}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="bg-[var(--surface)] border border-[var(--border)] max-w-md w-full mx-4">
              <Modal.CloseTrigger className="text-[var(--muted)] hover:text-[var(--foreground)]" />
              <Modal.Header className="p-6 pb-0">
                <Modal.Heading className="text-xl font-bold text-[var(--foreground)]">
                  Modificar Rol
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body className="p-6 space-y-4">
                <p className="text-sm text-[var(--muted)]">
                  Modificando el rol de <strong className="text-[var(--foreground)]">{selectedMember?.display_name || selectedMember?.username}</strong>.
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
                        <ListBox.Item id="ADMIN" textValue="Administrador">
                          <div>
                            <p className="font-medium">Administrador</p>
                            <p className="text-xs text-[var(--muted)]">Control total salvo suscripcion</p>
                          </div>
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                        <ListBox.Item id="JUDGE" textValue="Juez">
                          <div>
                            <p className="font-medium">Juez</p>
                            <p className="text-xs text-[var(--muted)]">Torneos y eventos</p>
                          </div>
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                        <ListBox.Item id="CASHIER" textValue="Cajero">
                          <div>
                            <p className="font-medium">Cajero</p>
                            <p className="text-xs text-[var(--muted)]">Ordenes, inventario y pagos</p>
                          </div>
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>
              </Modal.Body>
              <Modal.Footer className="border-t border-[var(--border)]/40 p-4 flex justify-end gap-3">
                <Button variant="outline" onPress={() => setShowRoleModal(false)}>Cancelar</Button>
                <Button
                  className="bg-[var(--primary)] text-[var(--primary-foreground)]"
                  isDisabled={actionLoading}
                  onPress={handleUpdateRole}
                >
                  {updateRoleMutation.isPending ? "Guardando..." : "Guardar Rol"}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
