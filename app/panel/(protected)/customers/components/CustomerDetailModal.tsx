"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, CreditCard, ShoppingBag, FileText, Send, Star, Clock } from "lucide-react";
import type { Customer } from "@/lib/types/customers";

interface CustomerDetailModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newNote: string;
  onNewNoteChange: (val: string) => void;
  onAddNote: () => void;
  savingNote: boolean;
  formatCurrency: (val: number) => string;
  getSegmentColor: (segment: string) => string;
}

export function CustomerDetailModal({
  customer,
  isOpen,
  onOpenChange,
  newNote,
  onNewNoteChange,
  onAddNote,
  savingNote,
  formatCurrency,
  getSegmentColor,
}: CustomerDetailModalProps) {
  if (!customer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white border-none p-0 overflow-hidden rounded-[32px] gap-0 shadow-2xl">
        {/* Header / Banner Area */}
        <div className="bg-[var(--c-navy-500)] p-8 text-white relative">
           <div className="flex items-start justify-between">
              <div className="flex items-center gap-5">
                 <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl font-extrabold border border-white/20">
                    {customer.username[0].toUpperCase()}
                 </div>
                 <div>
                    <h2 className="text-2xl font-extrabold tracking-tight">@{customer.username}</h2>
                    <div className="flex items-center gap-3 mt-2">
                       <Badge className={`rounded-lg px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border-none ${getSegmentColor(customer.segment)} bg-white text-[var(--c-navy-500)]`}>
                         {customer.segment}
                       </Badge>
                       {customer.is_vip && (
                         <Badge className="rounded-lg px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border-none bg-amber-400 text-amber-900 shadow-sm flex items-center gap-1">
                           <Star className="w-2.5 h-2.5 fill-amber-900" /> VIP Elite
                         </Badge>
                       )}
                    </div>
                 </div>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-1">
                 <span className="text-white/50 text-[10px] uppercase font-bold tracking-widest">Gasto Histórico</span>
                 <span className="text-2xl font-extrabold">{formatCurrency(customer.total_spent)}</span>
              </div>
           </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-5 gap-8 bg-white">
           {/* Info Section (Left) */}
           <div className="md:col-span-2 space-y-8">
              <div className="space-y-6">
                 <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--c-gray-400)] flex items-center gap-2">
                       <Mail className="w-3 h-3 text-[var(--c-cyan-500)]" /> Correo Electrónico
                    </span>
                    <span className="text-[14px] font-bold text-[var(--c-gray-800)]">{customer.email}</span>
                 </div>
                 <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--c-gray-400)] flex items-center gap-2">
                       <Calendar className="w-3 h-3 text-[var(--c-cyan-500)]" /> Fecha Registro
                    </span>
                    <span className="text-[14px] font-bold text-[var(--c-gray-800)]">{new Date(customer.created_at).toLocaleDateString()}</span>
                 </div>
                 <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--c-gray-400)] flex items-center gap-2">
                       <ShoppingBag className="w-3 h-3 text-[var(--c-cyan-500)]" /> Total Pedidos
                    </span>
                    <span className="text-[14px] font-bold text-[var(--c-gray-800)] px-3 py-1 bg-[var(--c-gray-50)] rounded-lg w-fit">{customer.order_count} completadas</span>
                 </div>
              </div>

              <div className="pt-8 border-t border-[var(--c-gray-100)]">
                 <h4 className="text-[12px] font-extrabold text-[var(--c-gray-800)] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-[var(--c-cyan-500)]" /> Notas de Gestión
                 </h4>
                 <div className="space-y-3">
                    {customer.notes.map((note, idx) => (
                      <div key={idx} className="p-3 bg-[var(--c-gray-50)] rounded-xl text-[12px] text-[var(--c-gray-600)] font-medium leading-relaxed border border-[var(--c-gray-100)]">
                         {note}
                      </div>
                    ))}
                    {customer.notes.length === 0 && <p className="text-[12px] text-[var(--c-gray-400)] italic">No hay notas registradas</p>}
                 </div>
                 <div className="mt-4 flex gap-2">
                    <Input 
                      placeholder="Nueva nota..." 
                      value={newNote}
                      onChange={(e) => onNewNoteChange(e.target.value)}
                      className="h-10 bg-[var(--c-gray-50)] border-none rounded-xl text-[12px] font-medium focus-visible:ring-1 focus-visible:ring-[var(--c-cyan-500)]"
                    />
                    <Button 
                      size="sm" 
                      onClick={onAddNote} 
                      disabled={savingNote || !newNote.trim()}
                      className="h-10 bg-[var(--c-navy-500)] hover:bg-[var(--c-navy-600)] text-white rounded-xl font-bold px-3 transition-opacity"
                    >
                       <Send className="w-3.5 h-3.5" />
                    </Button>
                 </div>
              </div>
           </div>

           {/* Activity Section (Right) */}
           <div className="md:col-span-3 space-y-6">
              <h4 className="text-[12px] font-extrabold text-[var(--c-gray-800)] uppercase tracking-wider flex items-center gap-2">
                 <Clock className="w-3.5 h-3.5 text-[var(--c-cyan-500)]" /> Actividad Reciente
              </h4>
              <div className="space-y-4">
                 {customer.recent_orders.map((order) => (
                   <div key={order.id} className="group/order flex items-center justify-between p-4 rounded-2xl bg-white border border-[var(--c-gray-100)] hover:border-[var(--c-cyan-200)] hover:bg-[var(--c-cyan-50)]/30 transition-all cursor-default">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-[var(--c-gray-50)] flex items-center justify-center text-[var(--c-gray-500)] group-hover/order:bg-white group-hover/order:text-[var(--c-cyan-500)] transition-colors">
                            <ShoppingBag className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="text-[13px] font-extrabold text-[var(--c-gray-800)] leading-none">{order.id}</p>
                            <p className="text-[11px] text-[var(--c-gray-400)] mt-1.5 font-medium">{new Date(order.date).toLocaleDateString()}</p>
                         </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1.5">
                         <p className="text-[14px] font-extrabold text-[var(--c-navy-500)]">{formatCurrency(order.total)}</p>
                         <Badge className={`rounded-lg px-2 py-0 text-[9px] font-bold uppercase tracking-wider border shadow-none ${
                           order.status === "COMPLETED" 
                             ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                             : 'bg-amber-50 text-amber-600 border-amber-100'
                         }`}>
                           {order.status}
                         </Badge>
                      </div>
                   </div>
                 ))}
                 {customer.recent_orders.length === 0 && <p className="text-[13px] text-[var(--c-gray-400)] py-10 text-center">Sin pedidos registrados recientemente</p>}
              </div>
              
              <div className="pt-4">
                 <Button variant="ghost" className="w-full h-12 rounded-2xl border-2 border-dashed border-[var(--c-gray-100)] text-[var(--c-gray-400)] font-bold hover:bg-[var(--c-gray-50)] hover:border-[var(--c-gray-200)] hover:text-[var(--c-gray-600)] transition-all">
                    Ver Historial Completo
                 </Button>
              </div>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
