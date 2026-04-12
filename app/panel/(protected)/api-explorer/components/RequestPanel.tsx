"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, ShieldCheck, Cpu, Database, Braces, Search } from "lucide-react";

interface RequestPanelProps {
  operation: any;
  pathParams: Record<string, string>;
  setPathParams: (val: any) => void;
  queryParams: Record<string, string>;
  setQueryParams: (val: any) => void;
  bodyText: string;
  setBodyText: (val: string) => void;
  sendAuth: boolean;
  setSendAuth: (val: boolean) => void;
  onExecute: () => void;
  isRunning: boolean;
}

export function RequestPanel({
  operation,
  pathParams,
  setPathParams,
  queryParams,
  setQueryParams,
  bodyText,
  setBodyText,
  sendAuth,
  setSendAuth,
  onExecute,
  isRunning
}: RequestPanelProps) {
  
  const labelClass = "text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-widest mb-1.5 flex items-center gap-1.5";
  const inputClass = "h-10 border-[var(--surface)] bg-[var(--surface)]/50 text-xs font-bold focus:ring-[var(--brand)]/10 transition-all";

  return (
    <Card className="bg-[var(--card)] border border-[var(--surface)] rounded-[32px] shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-8 border-b border-[var(--surface)] bg-[var(--surface)]/30 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[var(--brand)] text-white shadow-lg shadow-[var(--brand)]/10">
               <Cpu className="h-5 w-5" />
            </div>
            <div>
               <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-black text-[var(--foreground)] uppercase tracking-widest">Configuración de Envío</h3>
                  <Badge variant="outline" className="text-[9px] font-black uppercase text-[var(--brand-hover)] border-[var(--accent-subtle)] bg-[var(--accent-subtle)]">v1.2</Badge>
               </div>
               <p className="text-[11px] text-[var(--muted-foreground)] font-medium">Define cabeceras, parámetros y carga útil (payload)</p>
            </div>
         </div>
         
         <div className="flex items-center gap-3">
            <button 
              onClick={() => setSendAuth(!sendAuth)}
              className={`flex items-center gap-2 px-4 py-2 border-2 transition-all ${
                sendAuth ? 'bg-[var(--brand)]/5 border-[var(--brand)] text-[var(--brand-hover)] shadow-sm' : 'bg-[var(--card)] border-[var(--surface)] text-[var(--muted-foreground)]'
              }`}
            >
               <ShieldCheck className="h-4 w-4" />
               <span className="text-[10px] font-black uppercase tracking-widest">Auth Token</span>
            </button>
            <Button 
               onClick={onExecute} 
               disabled={isRunning}
               className="h-11 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white px-6 font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-[var(--brand)]/20"
            >
               {isRunning ? "Procesando..." : "Ejecutar Request"}
               <Play className="h-4 w-4 ml-2 fill-current" />
            </Button>
         </div>
      </div>

      <CardContent className="p-8 overflow-y-auto custom-scrollbar space-y-8">
        {/* Summary Info */}
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--surface)]">
           <div className="flex items-center gap-3 mb-2">
              <span className="p-1 rounded bg-[var(--brand)] text-white text-[9px] font-black uppercase px-2">{operation.method}</span>
              <span className="text-[12px] font-mono text-[var(--brand)] font-bold opacity-70 break-all">{operation.path}</span>
           </div>
           <p className="text-[11px] text-[var(--muted-foreground)] font-medium italic underline decoration-[var(--brand)]/30 underline-offset-4">{operation.summary}</p>
        </div>

        {operation.pathParams.length > 0 && (
          <div className="space-y-4">
            <h4 className={labelClass}><Database className="h-3 w-3" /> Path Parameters</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {operation.pathParams.map((p: string) => (
                <div key={p} className="space-y-1.5 flex flex-col">
                  <Label className="text-[11px] font-bold text-[var(--muted-foreground)]">{p}</Label>
                  <Input
                    placeholder={`valor de ${p}`}
                    value={pathParams[p] || ""}
                    onChange={(e) => setPathParams({ ...pathParams, [p]: e.target.value })}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {operation.queryParams.length > 0 && (
          <div className="space-y-4">
            <h4 className={labelClass}><Search className="h-3 w-3" /> Query Parameters</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {operation.queryParams.map((p: string) => (
                <div key={p} className="space-y-1.5 flex flex-col">
                  <Label className="text-[11px] font-bold text-[var(--muted-foreground)]">{p}</Label>
                  <Input
                    placeholder={`query ${p}`}
                    value={queryParams[p] || ""}
                    onChange={(e) => setQueryParams({ ...queryParams, [p]: e.target.value })}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {operation.hasRequestBody && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
               <h4 className={labelClass}><Braces className="h-3 w-3" /> Body Payload (JSON)</h4>
               <span className="text-[9px] font-bold text-[var(--muted-foreground)] uppercase">application/json</span>
            </div>
            <div className="rounded-2xl border border-[var(--surface)] bg-zinc-950 p-4 shadow-inner">
               <Textarea
                 value={bodyText}
                 onChange={(e) => setBodyText(e.target.value)}
                 className="min-h-[220px] font-mono text-[13px] text-emerald-400 bg-transparent border-none focus-visible:ring-0 resize-none p-0 custom-scrollbar"
                 placeholder='{ "key": "value" }'
               />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
