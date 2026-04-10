"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, Sparkles, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileCardProps {
  user: any;
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <Card className="bg-white border border-[var(--c-gray-100)] shadow-sm overflow-hidden flex flex-col rounded-[32px] group">
      <div className="h-28 bg-gradient-to-br from-[var(--c-navy-500)] to-[var(--c-cyan-500)] w-full relative">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
      </div>
      <CardContent className="p-8 flex flex-col items-center text-center -mt-14 relative z-10">
        <div className="relative p-1.5 bg-white rounded-full shadow-xl mb-4 group-hover:scale-105 transition-transform duration-500">
           <Avatar className="w-24 h-24 ring-4 ring-white shadow-sm cursor-pointer">
             {user.avatar_url ? (
               <AvatarImage src={user.avatar_url} alt={user.username} />
             ) : null}
             <AvatarFallback className="bg-[var(--c-navy-500)] text-white text-2xl font-black">
               {user.username?.[0]?.toUpperCase() || "AD"}
             </AvatarFallback>
           </Avatar>
           <div className="absolute bottom-1 right-1 p-2 rounded-full bg-white border border-[var(--c-gray-100)] text-[var(--c-cyan-500)] shadow-lg">
              <Sparkles className="h-4 w-4" />
           </div>
        </div>
        
        <h2 className="text-[20px] font-black text-[var(--c-gray-800)] mb-1 tracking-tight">
          {user.username || "Usuario Administrador"}
        </h2>
        <p className="text-[12px] font-bold text-[var(--c-gray-400)] uppercase tracking-widest mb-6">
           Socio Fundador / Propietario
        </p>
        
        <div className="flex flex-col w-full gap-3">
           <div className="flex items-center justify-center gap-3 bg-[var(--c-navy-500)]/5 text-[var(--c-navy-500)] px-4 py-2.5 rounded-2xl text-[12px] font-black border border-[var(--c-navy-500)]/5">
             <Shield className="w-4 h-4" />
             {user.tenant_id ? "TIENDA VERIFICADA" : "GESTOR ESTRATÉGICO"}
           </div>
           
           <Button variant="ghost" className="h-11 rounded-2xl text-[12px] font-bold text-[var(--c-gray-400)] hover:text-[var(--c-navy-500)] group/btn">
              <UserCircle className="h-4 w-4 mr-2" />
              Ver Registro de Actividad
           </Button>
        </div>
      </CardContent>
    </Card>
  );
}
