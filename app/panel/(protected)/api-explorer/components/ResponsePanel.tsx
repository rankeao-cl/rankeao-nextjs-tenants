"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Terminal, Clock, Link2, Ghost, Hash } from "lucide-react";

interface ResponsePanelProps {
  response: any;
}

export function ResponsePanel({ response }: ResponsePanelProps) {
  if (!response) {
    return (
      <Card className="bg-[var(--surface)]/50 border border-dashed border-[var(--border)] rounded-[32px] overflow-hidden flex flex-col items-center justify-center p-12 text-center h-[300px]">
        <div className="p-4 rounded-full bg-[var(--card)] border border-[var(--surface)] text-[var(--border-hover)] mb-4">
           <Ghost className="h-8 w-8" />
        </div>
        <p className="text-sm font-black text-[var(--muted-foreground)] uppercase tracking-widest mb-1">Sin Datos de Ejecución</p>
        <p className="text-xs text-[var(--muted-foreground)] font-medium">Configura los parámetros y presiona "Ejecutar Request" para ver resultados</p>
      </Card>
    );
  }

  const isError = !response.ok;

  return (
    <Card className="bg-[var(--card)] border border-[var(--surface)] rounded-[32px] shadow-sm overflow-hidden flex flex-col animate-in slide-in-from-top-4 duration-500">
      <div className="p-6 border-b border-[var(--surface)] bg-[var(--surface)]/30 flex items-center justify-between">
         <div className="flex items-center gap-3">
             <div className={`p-2 text-white ${isError ? 'bg-red-500 shadow-red-500/20' : 'bg-emerald-500 shadow-emerald-500/20'} shadow-lg`}>
                <Terminal className="h-4 w-4" />
             </div>
             <p className="text-xs font-black text-[var(--foreground)] uppercase tracking-widest">Respuesta del Servidor</p>
         </div>

         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
               <Clock className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
               <span className="text-[11px] font-bold text-[var(--muted-foreground)]">{response.durationMs}ms</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-black text-[10px] uppercase tracking-tighter shadow-sm transition-all ${
              isError ? 'bg-red-500/10 border-red-500/25 text-red-600' : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-600'
            }`}>
               <Hash className="h-3 w-3" />
               HTTP {response.status}
            </div>
         </div>
      </div>

      <CardContent className="p-6 space-y-6">
        <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--muted-foreground)] bg-[var(--surface)] p-2 rounded-lg break-all">
           <Link2 className="h-3 w-3 shrink-0" />
           <span className="opacity-70">{response.url}</span>
        </div>

        <div className="space-y-4">
           <details className="group border border-[var(--surface)] bg-[var(--card)] overflow-hidden shadow-sm transition-all">
              <summary className="p-3 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)] cursor-pointer hover:bg-[var(--surface)] select-none list-none flex items-center justify-between">
                 <span>Response Headers</span>
                 <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="p-4 border-t border-[var(--surface)] bg-[var(--surface)]/20">
                 <pre className="text-[11px] font-mono text-[var(--brand-hover)] leading-relaxed">{JSON.stringify(response.headers, null, 2)}</pre>
              </div>
           </details>

           <div className="space-y-2">
              <div className="flex items-center justify-between">
                 <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">JSON Output</p>
                 <button 
                  onClick={() => { navigator.clipboard.writeText(response.body); }}
                  className="text-[9px] font-black text-[var(--brand)] uppercase tracking-wider hover:underline"
                >
                  Copiar Cuerpo
                </button>
              </div>
              <div className="rounded-2xl border border-[var(--surface)] bg-zinc-950 p-6 shadow-2xl relative">
                 <div className="absolute top-4 right-4 h-3 w-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center animate-pulse">
                    <div className="h-1 w-1 rounded-full bg-emerald-500" />
                 </div>
                 <pre className="text-[13px] font-mono text-emerald-300 leading-relaxed overflow-auto max-h-[500px] custom-scrollbar selection:bg-emerald-500/30">
                    {response.body}
                 </pre>
              </div>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
