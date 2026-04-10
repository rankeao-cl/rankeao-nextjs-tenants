"use client";

import { useState } from "react";
import { Card, Table, Skeleton, Button, Label, Input, Modal, toast } from "@heroui/react";
import { useExpenses, useCreateExpense } from "@/lib/hooks/use-expenses";
import { getErrorMessage } from "@/lib/utils/error-message";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(value);

export default function ExpensesPage() {
  const { data: expenses = [], isLoading } = useExpenses();
  const createMutation = useCreateExpense();

  const [showModal, setShowModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleCreateExpense = async () => {
    if (!newExpense.title || !newExpense.amount) {
      return toast.danger("Concepto y monto son requeridos");
    }
    try {
      await createMutation.mutateAsync({
        title: newExpense.title,
        amount: Number(newExpense.amount),
        category: newExpense.category,
        date: newExpense.date,
      });
      toast.success("Gasto registrado");
      setShowModal(false);
      setNewExpense({ title: "", amount: "", category: "", date: new Date().toISOString().split("T")[0] });
    } catch (error: unknown) {
      toast.danger(getErrorMessage(error, "Error al registrar gasto"));
    }
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || e.cost || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--foreground)]">
            Gastos y Presupuestos
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">Registra y rastrea los gastos operativos de tu tienda</p>
        </div>
        <Button variant="primary" onPress={() => setShowModal(true)}>
          Registrar Gasto
        </Button>
      </div>

      <Card className="bg-[var(--surface)] border border-[var(--border)]">
        <Card.Content className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-red-500/10 text-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3l-5-8" /><path d="M12 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3l-5-8" /></svg>
            </div>
            <div>
              <p className="text-sm text-[var(--muted)]">Gastos Totales Registrados</p>
              <p className="text-2xl font-bold text-red-400">
                {isLoading ? "..." : formatCurrency(totalExpenses)}
              </p>
            </div>
          </div>
        </Card.Content>
      </Card>

      <Card className="bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label="Historial de gastos" className="min-w-full">
                <Table.Header className="bg-[var(--surface-sunken)] border-b border-[var(--border)]">
                  <Table.Column isRowHeader className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Fecha</Table.Column>
                  <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Concepto</Table.Column>
                  <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider">Categoría</Table.Column>
                  <Table.Column className="text-xs font-medium text-[var(--muted)] py-3 px-4 uppercase tracking-wider text-right">Monto</Table.Column>
                </Table.Header>
                <Table.Body>
                  {isLoading ? (
                    Array(3).fill(0).map((_, i) => (
                      <Table.Row key={i} className="border-b border-[var(--border)]">
                        <Table.Cell className="py-4 px-4"><Skeleton className="h-5 w-24 rounded" /></Table.Cell>
                        <Table.Cell className="py-4 px-4"><Skeleton className="h-5 w-40 rounded" /></Table.Cell>
                        <Table.Cell className="py-4 px-4"><Skeleton className="h-5 w-24 rounded" /></Table.Cell>
                        <Table.Cell className="py-4 px-4"><Skeleton className="h-5 w-20 rounded ml-auto" /></Table.Cell>
                      </Table.Row>
                    ))
                  ) : expenses.length === 0 ? (
                    <Table.Row>
                      <Table.Cell colSpan={4} className="py-12 text-center text-[var(--muted)]">
                        No hay gastos registrados. Usa &quot;Registrar Gasto&quot; para comenzar.
                      </Table.Cell>
                    </Table.Row>
                  ) : (
                    expenses.map((expense, idx) => (
                      <Table.Row key={expense.id || idx} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-secondary)] transition-colors">
                        <Table.Cell className="py-4 px-4 whitespace-nowrap text-sm text-[var(--muted)]">
                          {expense.date || expense.created_at || "-"}
                        </Table.Cell>
                        <Table.Cell className="py-4 px-4 text-sm font-medium text-[var(--foreground)]">
                          {expense.title || expense.description || "Sin descripción"}
                        </Table.Cell>
                        <Table.Cell className="py-4 px-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[var(--surface-secondary)] text-[var(--muted)] border border-[var(--border)]">
                            {expense.category || "General"}
                          </span>
                        </Table.Cell>
                        <Table.Cell className="py-4 px-4 text-right font-semibold text-red-400">
                          -{formatCurrency(Number(expense.amount || expense.cost || 0))}
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

      <Modal isOpen={showModal} onOpenChange={setShowModal}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="bg-[var(--surface)] border border-[var(--border)]">
              <Modal.CloseTrigger className="text-[var(--muted)] hover:text-[var(--foreground)]" />
              <Modal.Header>
                <Modal.Heading className="text-xl font-bold text-[var(--foreground)]">
                  Registrar Gasto
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body className="py-4 space-y-4">
                <div className="space-y-1.5 flex flex-col">
                  <Label className="text-sm font-medium text-[var(--muted)]">Concepto</Label>
                  <Input
                    placeholder="Ej. Publicidad Instagram"
                    value={newExpense.title}
                    onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                    className="bg-transparent border border-[var(--border)]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 flex flex-col">
                    <Label className="text-sm font-medium text-[var(--muted)]">Monto</Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Ej. 15000"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                      className="bg-transparent border border-[var(--border)]"
                    />
                  </div>
                  <div className="space-y-1.5 flex flex-col">
                    <Label className="text-sm font-medium text-[var(--muted)]">Categoría</Label>
                    <Input
                      placeholder="Ej. Marketing"
                      value={newExpense.category}
                      onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                      className="bg-transparent border border-[var(--border)]"
                    />
                  </div>
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <Label className="text-sm font-medium text-[var(--muted)]">Fecha</Label>
                  <Input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                    className="bg-transparent border border-[var(--border)]"
                  />
                </div>
              </Modal.Body>
              <Modal.Footer className="border-t border-[var(--border)]/40 p-4">
                <Button variant="outline" onPress={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" isDisabled={createMutation.isPending} onPress={handleCreateExpense}>
                  {createMutation.isPending ? "Guardando..." : "Guardar Gasto"}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
