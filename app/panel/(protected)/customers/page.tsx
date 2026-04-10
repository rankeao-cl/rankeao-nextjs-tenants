"use client";

import { useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/error-message";
import { CustomerHeader } from "./components/CustomerHeader";
import { CustomerFilters } from "./components/CustomerFilters";
import { CustomerList } from "./components/CustomerList";
import { CustomerDetailModal } from "./components/CustomerDetailModal";
import type { Customer } from "@/lib/types/customers";


const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(value);

const getSegmentColor = (segment: string) => {
  switch (segment?.toUpperCase()) {
    case "VIP":
    case "PREMIUM":
      return "bg-amber-50 text-amber-600 border-amber-100";
    case "FREQUENT":
      return "bg-purple-50 text-purple-600 border-purple-100";
    case "NEW":
      return "bg-sky-50 text-sky-600 border-sky-100";
    case "INACTIVE":
      return "bg-[var(--c-gray-50)] text-[var(--c-gray-500)] border-[var(--c-gray-200)]";
    default:
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
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
      toast.error(getErrorMessage(error, "Error al actualizar estado VIP"));
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
      toast.success("Nota agregada con éxito");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al agregar nota"));
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <CustomerHeader />

      <div className="space-y-6">
        <CustomerFilters query={query} onQueryChange={setQuery} />

        <CustomerList 
          customers={filtered} 
          isLoading={isLoading} 
          onViewDetail={handleViewDetail}
          onToggleVip={handleToggleVip}
          getSegmentColor={getSegmentColor}
        />
      </div>

      <CustomerDetailModal 
        customer={selectedCustomer}
        isOpen={showDetailModal}
        onOpenChange={setShowDetailModal}
        newNote={newNote}
        onNewNoteChange={setNewNote}
        onAddNote={handleAddNote}
        savingNote={savingNote}
        formatCurrency={formatCurrency}
        getSegmentColor={getSegmentColor}
      />
    </div>
  );
}
