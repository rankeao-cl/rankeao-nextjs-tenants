"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Mail, Edit3, Trash2, UserPlus } from "lucide-react";
import type { StaffMember } from "@/lib/types/staff";

interface StaffListProps {
  staff: StaffMember[];
  isLoading: boolean;
  onEditRole: (member: StaffMember) => void;
  onRemove: (id: number) => void;
  getRoleColor: (role: string) => string;
  ROLE_LABELS: Record<string, string>;
}

export function StaffList({
  staff,
  isLoading,
  onEditRole,
  onRemove,
  getRoleColor,
  ROLE_LABELS,
}: StaffListProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-[32px] border border-[var(--c-gray-200)] overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-[var(--c-gray-50)]">
            <TableRow>
              <TableHead>Miembro</TableHead>
              <TableHead>Rol / Permisos</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(3).fill(0).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-12 w-48 rounded-xl" /></TableCell>
                <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-10 w-32 rounded-xl ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] border border-[var(--c-gray-100)] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-[var(--c-gray-50)]/50 border-b border-[var(--c-gray-100)]">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[11px] font-bold text-[var(--c-gray-400)] uppercase tracking-widest py-4 px-6">Identidad Miembro</TableHead>
              <TableHead className="text-[11px] font-bold text-[var(--c-gray-400)] uppercase tracking-widest py-4 px-6">Rol de Acceso</TableHead>
              <TableHead className="text-[11px] font-bold text-[var(--c-gray-400)] uppercase tracking-widest py-4 px-6">Estado Salud</TableHead>
              <TableHead className="w-[200px] text-right py-4 px-6"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-24 text-center">
                   <div className="flex flex-col items-center gap-4">
                      <div className="p-4 rounded-full bg-[var(--c-gray-50)]">
                        <UserPlus className="h-8 w-8 text-[var(--c-gray-300)]" />
                      </div>
                      <p className="text-[var(--c-gray-500)] font-medium">Aún no has invitado a nadie a tu equipo</p>
                   </div>
                </TableCell>
              </TableRow>
            ) : (
              staff.map((member) => {
                const isOwner = member.role === "OWNER";
                return (
                  <TableRow key={member.id} className="hover:bg-[var(--c-gray-50)] transition-colors border-b border-[var(--c-gray-100)] last:border-0 group/row">
                    <TableCell className="py-5 px-6">
                      <div className="flex items-center gap-4">
                        {member.avatar_url ? (
                          <img src={member.avatar_url} alt="" className="w-10 h-10 rounded-2xl object-cover ring-2 ring-white shadow-sm" />
                        ) : (
                          <div className="w-10 h-10 rounded-2xl bg-[var(--c-navy-500)]/5 flex items-center justify-center text-[15px] font-black text-[var(--c-navy-500)] border border-[var(--c-navy-500)]/10">
                            {(member.display_name || member.username || "?")[0].toUpperCase()}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold text-[var(--c-gray-800)]">
                            {member.display_name || member.username || "Sin nombre"}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                             <Mail className="h-3 w-3 text-[var(--c-gray-300)]" />
                             <span className="text-[11px] text-[var(--c-gray-400)] font-medium">{member.email}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-5 px-6">
                       <Badge variant="outline" className={`rounded-xl px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest border shadow-sm ${getRoleColor(member.role)}`}>
                         <Shield className="h-3 w-3 mr-1.5 opacity-70" />
                         {ROLE_LABELS[member.role] || member.role}
                       </Badge>
                    </TableCell>
                    <TableCell className="py-5 px-6">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${member.is_active
                        ? "text-emerald-500 bg-emerald-50"
                        : "text-red-500 bg-red-50"
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full mr-2 ${member.is_active ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {member.is_active ? "Activo" : "Inactivo"}
                      </span>
                    </TableCell>
                    <TableCell className="py-5 px-6 text-right">
                      {isOwner ? (
                        <span className="text-[11px] text-[var(--c-gray-400)] font-black uppercase tracking-widest mr-4">Owner</span>
                      ) : (
                        <div className="flex gap-2 justify-end opacity-0 group-hover/row:opacity-100 transition-all">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => onEditRole(member)}
                            className="h-9 px-3 text-[var(--c-navy-500)] hover:bg-[var(--c-navy-500)] hover:text-white rounded-xl font-bold transition-all"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => onRemove(member.id)}
                            className="h-9 px-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl font-bold transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
