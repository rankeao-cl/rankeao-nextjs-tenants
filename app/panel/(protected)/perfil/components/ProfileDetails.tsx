"use client";

import { Card, CardContent } from "@/components/ui/card";
import { User, Mail, Fingerprint, CalendarDays, ExternalLink, ShieldCheck } from "lucide-react";

interface ProfileDetailsProps {
  user: any;
}

export function ProfileDetails({ user }: ProfileDetailsProps) {
  const accountInfo = [
    { 
      label: "Usuario", 
      value: user.username || "No asignado", 
      icon: User,
      desc: "Nombre identificador en la plataforma"
    },
    { 
      label: "Correo Electrónico", 
      value: user.email, 
      icon: Mail,
      desc: "Contacto principal de notificaciones"
    },
    { 
      label: "ID Arrendatario", 
      value: user.tenant_id || "Global System", 
      icon: Fingerprint,
      desc: "Identificador único de tu ecosistema comercial",
      mono: true
    },
    { 
      label: "Miembro Desde", 
      value: user.created_at ? new Date(user.created_at).toLocaleDateString("es-CL", { day: '2-digit', month: 'long', year: 'numeric' }) : "Desconocida", 
      icon: CalendarDays,
      desc: "Fecha de alta inicial en el entorno"
    },
  ];

  return (
    <Card className="bg-[var(--card)] border border-[var(--surface)] rounded-[32px] shadow-sm overflow-hidden">
      <CardContent className="p-0">
         <div className="p-8 border-b border-[var(--surface)] bg-[var(--surface)]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="p-2.5 rounded-xl bg-[var(--brand)] text-white">
                  <ShieldCheck className="h-5 w-5" />
               </div>
               <h3 className="text-sm font-black text-[var(--foreground)] uppercase tracking-widest">Información de Seguridad y Cuenta</h3>
            </div>
            <button className="text-[11px] font-bold text-[var(--brand)] flex items-center gap-1.5 hover:underline">
               Solicitar Cambio <ExternalLink className="h-3 w-3" />
            </button>
         </div>
         
         <div className="divide-y divide-[var(--surface)]">
           {accountInfo.map((item, i) => (
             <div key={i} className="p-6 hover:bg-[var(--surface)]/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
               <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)] group-hover:border-[var(--brand)]/30 group-hover:text-[var(--brand)] transition-all">
                     <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest mb-0.5">{item.label}</p>
                     <p className={`text-[15px] font-extrabold text-[var(--foreground)] ${item.mono ? 'font-mono tracking-tighter text-[13px] opacity-70' : ''}`}>
                       {item.value}
                     </p>
                  </div>
               </div>
               <p className="text-[11px] font-medium text-[var(--muted-foreground)] italic max-w-[200px] text-right">
                 {item.desc}
               </p>
             </div>
           ))}
         </div>
      </CardContent>
    </Card>
  );
}
