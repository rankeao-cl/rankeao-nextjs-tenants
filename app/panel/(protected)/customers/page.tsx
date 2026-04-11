"use client";

import { useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/error-message";
import { useCustomers, useUpdateCustomer, useAddCustomerNote } from "@/lib/hooks/use-customers";
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

export default function CustomersPage() {
  const [query, setQuery] = useState("");
  const { data, isLoading } = useCustomers();
  const customers = data?.customers ?? [];
  const updateMutation = useUpdateCustomer();
  const addNoteMutation = useAddCustomerNote();

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [newNote, setNewNote] = useState("");

  const filtered = customers.filter(
    (c) =>
      c.username.toLowerCase().includes(query.toLowerCase()) ||
      (c.email ?? "").toLowerCase().includes(query.toLowerCase())
  );

  const handleViewDetail = (customer: Customer) => {
    setSelectedCustomer(customer);
    setNewNote("");
    setShowDetailModal(true);
  };

  const handleToggleVip = async (customer: Customer) => {
    try {
      await updateMutation.mutateAsync({
        id: customer.id,
        data: { is_vip: !customer.is_vip, segment: !customer.is_vip ? "VIP" : "FREQUENT" },
      });
      toast.success(customer.is_vip ? "VIP removido" : "Cliente marcado como VIP");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al actualizar estado VIP"));
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !selectedCustomer) return;
    try {
      await addNoteMutation.mutateAsync({ customerId: selectedCustomer.id, content: newNote.trim() });
      // Optimistic update so the note appears immediately in the open modal
      setSelectedCustomer((prev) =>
        prev ? { ...prev, notes: [...(prev.notes || []), newNote.trim()] } : prev
      );
      setNewNote("");
      toast.success("Nota agregada con éxito");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al agregar nota"));
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
        savingNote={addNoteMutation.isPending}
        formatCurrency={formatCurrency}
        getSegmentColor={getSegmentColor}
      />
    </div>
  );
}
