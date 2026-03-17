"use client";

import { useState } from "react";
import {
  Card,
  Table,
  Button,
  Input,
  Label,
  Skeleton,
  Modal,
  toast,
} from "@heroui/react";
import { getErrorMessage } from "@/lib/utils/error-message";

interface Customer {
  id: string;
  username: string;
  email: string;
  segment: string;
  total_spent: number;
  order_count: number;
  is_vip: boolean;
  created_at: string;
  notes: string[];
  recent_orders: { id: string; total: number; date: string; status: string }[];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(value);

const getSegmentColor = (segment: string) => {
  switch (segment?.toUpperCase()) {
    case "VIP":
    case "PREMIUM":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "FREQUENT":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "NEW":
      return "bg-sky-500/10 text-sky-400 border-sky-500/20";
    case "INACTIVE":
      return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    default:
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  }
};

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "1",
    username: "carlos_gamer",
    email: "carlos@email.com",
    segment: "VIP",
    total_spent: 450000,
    order_count: 23,
    is_vip: true,
    created_at: "2025-03-10",
    notes: ["Cliente frecuente, prefiere retiro en tienda"],
    recent_orders: [
      { id: "ORD-101", total: 35000, date: "2026-03-12", status: "COMPLETED" },
      { id: "ORD-098", total: 18500, date: "2026-03-05", status: "COMPLETED" },
    ],
  },
  {
    id: "2",
    username: "maria_tcg",
    email: "maria@email.com",
    segment: "FREQUENT",
    total_spent: 180000,
    order_count: 9,
    is_vip: false,
    created_at: "2025-06-15",
    notes: [],
    recent_orders: [
      { id: "ORD-095", total: 22000, date: "2026-02-28", status: "COMPLETED" },
    ],
  },
  {
    id: "3",
    username: "pedro_nuevo",
    email: "pedro@email.com",
    segment: "NEW",
    total_spent: 15000,
    order_count: 1,
    is_vip: false,
    created_at: "2026-03-01",
    notes: [],
    recent_orders: [
      { id: "ORD-102", total: 15000, date: "2026-03-14", status: "PENDING" },
    ],
  },
];

export default function CustomersPage() {
  const [query, setQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [isLoading] = useState(false);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [newNote, setNewNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const filtered = customers.filter(
    (c) =>
      c.username.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase())
  );

  const handleViewDetail = (customer: Customer) => {
    setSelectedCustomer(customer);
    setNewNote("");
    setShowDetailModal(true);
  };

  const handleToggleVip = async (customer: Customer) => {
    try {
      setCustomers((prev) =>
        prev.map((c) => (c.id === customer.id ? { ...c, is_vip: !c.is_vip, segment: !c.is_vip ? "VIP" : "FREQUENT" } : c))
      );
      toast.success(customer.is_vip ? "VIP removido" : "Cliente marcado como VIP");
    } catch (error: unknown) {
      toast.danger(getErrorMessage(error, "Error al actualizar estado VIP"));
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !selectedCustomer) return;
    setSavingNote(true);
    try {
      const updatedNotes = [...(selectedCustomer.notes || []), newNote.trim()];
      setCustomers((prev) =>
        prev.map((c) => (c.id === selectedCustomer.id ? { ...c, notes: updatedNotes } : c))
      );
      setSelectedCustomer({ ...selectedCustomer, notes: updatedNotes });
      setNewNote("");
      toast.success("Nota agregada");
    } catch (error: unknown) {
      toast.danger(getErrorMessage(error, "Error al agregar nota"));
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--foreground)]">
            Clientes
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">Gestiona tu base de clientes y segmentos</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="bg-[var(--surface)] border border-[var(--border)] w-full">
          <div className="p-4 flex flex-col sm:flex-row gap-4 items-end justify-between">
            <div className="w-full sm:max-w-xs space-y-1.5 flex flex-col">
              <Label className="text-xs font-semibold text-[var(--muted)]">Buscar Cliente</Label>
              <Input
                placeholder="Nombre o email..."
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                className="bg-transparent border border-[var(--border)]"
              />
            </div>
          </div>
        </Card>

        <Card className="bg-[var(--surface)] border border-[var(--border)] w-full overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <Table.ScrollContainer>
                <Table.Content aria-label="Tabla de Clientes" className="min-w-full">
                  <Table.Header className="bg-[var(--surface-sunken)] border-b border-[var(--border)]">
                    <Table.Column isRowHeader className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Usuario</Table.Column>
                    <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Email</Table.Column>
                    <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Segmento</Table.Column>
                    <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Total Gastado</Table.Column>
                    <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Ordenes</Table.Column>
                    <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">VIP</Table.Column>
                    <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider text-right">Acciones</Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {isLoading ? (
                      Array(4).fill(0).map((_, i) => (
                        <Table.Row key={i} className="border-b border-[var(--border)]">
                          <Table.Cell className="py-4 px-4"><Skeleton className="h-6 w-28 rounded" /></Table.Cell>
                          <Table.Cell className="py-4 px-4"><Skeleton className="h-6 w-36 rounded" /></Table.Cell>
                          <Table.Cell className="py-4 px-4"><Skeleton className="h-6 w-20 rounded" /></Table.Cell>
                          <Table.Cell className="py-4 px-4"><Skeleton className="h-6 w-24 rounded" /></Table.Cell>
                          <Table.Cell className="py-4 px-4"><Skeleton className="h-6 w-12 rounded" /></Table.Cell>
                          <Table.Cell className="py-4 px-4"><Skeleton className="h-6 w-12 rounded" /></Table.Cell>
                          <Table.Cell className="py-4 px-4"><Skeleton className="h-8 w-32 rounded ml-auto" /></Table.Cell>
                        </Table.Row>
                      ))
                    ) : filtered.length === 0 ? (
                      <Table.Row>
                        <Table.Cell colSpan={7} className="py-12 text-center text-[var(--muted)]">
                          No se encontraron clientes.
                        </Table.Cell>
                      </Table.Row>
                    ) : (
                      filtered.map((customer) => (
                        <Table.Row key={customer.id} className="border-b border-[var(--border)] hover:bg-white/[0.02] transition-colors">
                          <Table.Cell className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[var(--primary)]/20 flex items-center justify-center text-xs font-bold text-[var(--primary)]">
                                {customer.username[0].toUpperCase()}
                              </div>
                              <p className="font-medium text-[var(--foreground)]">@{customer.username}</p>
                            </div>
                          </Table.Cell>
                          <Table.Cell className="py-4 px-4 text-sm text-[var(--muted)]">
                            {customer.email}
                          </Table.Cell>
                          <Table.Cell className="py-4 px-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSegmentColor(customer.segment)}`}>
                              {customer.segment}
                            </span>
                          </Table.Cell>
                          <Table.Cell className="py-4 px-4 text-[var(--foreground)] font-medium">
                            {formatCurrency(customer.total_spent)}
                          </Table.Cell>
                          <Table.Cell className="py-4 px-4 text-[var(--muted)]">
                            {customer.order_count}
                          </Table.Cell>
                          <Table.Cell className="py-4 px-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                              customer.is_vip
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                            }`}>
                              {customer.is_vip ? "VIP" : "Normal"}
                            </span>
                          </Table.Cell>
                          <Table.Cell className="py-4 px-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <Button size="sm" variant="outline" onPress={() => handleViewDetail(customer)}>
                                Detalle
                              </Button>
                              <Button size="sm" variant="secondary" onPress={() => handleToggleVip(customer)}>
                                {customer.is_vip ? "Quitar VIP" : "Hacer VIP"}
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
      </div>

      {/* Detail Modal */}
      <Modal isOpen={showDetailModal} onOpenChange={setShowDetailModal}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="bg-[var(--surface)] border border-[var(--border)] max-w-lg w-full mx-4">
              <Modal.CloseTrigger className="text-[var(--muted)] hover:text-[var(--foreground)]" />
              <Modal.Header className="p-6 pb-0">
                <Modal.Heading className="text-xl font-bold text-[var(--foreground)]">
                  Detalle del Cliente
                </Modal.Heading>
                <p className="text-sm text-[var(--muted)] mt-1">@{selectedCustomer?.username}</p>
              </Modal.Header>
              <Modal.Body className="p-6 space-y-6">
                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[var(--muted)] uppercase tracking-wider">Email</p>
                    <p className="text-sm text-[var(--foreground)] mt-1">{selectedCustomer?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--muted)] uppercase tracking-wider">Segmento</p>
                    <p className="mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSegmentColor(selectedCustomer?.segment || "")}`}>
                        {selectedCustomer?.segment}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--muted)] uppercase tracking-wider">Total Gastado</p>
                    <p className="text-sm font-medium text-[var(--foreground)] mt-1">{formatCurrency(selectedCustomer?.total_spent || 0)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--muted)] uppercase tracking-wider">Ordenes</p>
                    <p className="text-sm text-[var(--foreground)] mt-1">{selectedCustomer?.order_count}</p>
                  </div>
                </div>

                {/* Recent Orders */}
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)] mb-3">Ordenes Recientes</p>
                  {selectedCustomer?.recent_orders && selectedCustomer.recent_orders.length > 0 ? (
                    <div className="space-y-2">
                      {selectedCustomer.recent_orders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border)]">
                          <div>
                            <p className="text-sm font-medium text-[var(--foreground)]">{order.id}</p>
                            <p className="text-xs text-[var(--muted)]">{order.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-[var(--foreground)]">{formatCurrency(order.total)}</p>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                              order.status === "COMPLETED"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[var(--muted)]">Sin ordenes recientes.</p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)] mb-3">Notas</p>
                  {selectedCustomer?.notes && selectedCustomer.notes.length > 0 ? (
                    <div className="space-y-2 mb-3">
                      {selectedCustomer.notes.map((note, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border)]">
                          <p className="text-sm text-[var(--foreground)]">{note}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[var(--muted)] mb-3">Sin notas.</p>
                  )}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Agregar nota..."
                      value={newNote}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewNote(e.target.value)}
                      className="bg-transparent border border-[var(--border)] flex-1"
                    />
                    <Button variant="secondary" isDisabled={savingNote || !newNote.trim()} onPress={handleAddNote}>
                      {savingNote ? "Guardando..." : "Agregar"}
                    </Button>
                  </div>
                </div>
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
