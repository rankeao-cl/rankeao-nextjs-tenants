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
  
  const labelClass = "text-[10px] font-black text-[var(--c-gray-400)] uppercase tracking-widest mb-1.5 flex items-center gap-1.5";
  const inputClass = "h-10 rounded-xl border-[var(--c-gray-100)] bg-[var(--c-gray-50)]/50 text-xs font-bold focus:ring-[var(--c-navy-500)]/10 transition-all";

  return (
    <Card className="bg-white border border-[var(--c-gray-100)] rounded-[32px] shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-8 border-b border-[var(--c-gray-50)] bg-[var(--c-gray-50)]/30 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[var(--c-navy-500)] text-white shadow-lg shadow-[var(--c-navy-500)]/10">
               <Cpu className="h-5 w-5" />
            </div>
            <div>
               <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-black text-[var(--c-gray-800)] uppercase tracking-widest">Configuración de Envío</h3>
                  <Badge variant="outline" className="text-[9px] font-black uppercase text-[var(--c-cyan-600)] border-[var(--c-cyan-200)] bg-[var(--c-cyan-50)]">v1.2</Badge>
               </div>
               <p className="text-[11px] text-[var(--c-gray-400)] font-medium">Define cabeceras, parámetros y carga útil (payload)</p>
            </div>
         </div>
         
         <div className="flex items-center gap-3">
            <button 
              onClick={() => setSendAuth(!sendAuth)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                sendAuth ? 'bg-[var(--c-cyan-500)]/5 border-[var(--c-cyan-500)] text-[var(--c-cyan-600)] shadow-sm' : 'bg-white border-[var(--c-gray-100)] text-[var(--c-gray-400)]'
              }`}
            >
               <ShieldCheck className="h-4 w-4" />
               <span className="text-[10px] font-black uppercase tracking-widest">Auth Token</span>
            </button>
            <Button 
               onClick={onExecute} 
               disabled={isRunning}
               className="h-11 rounded-xl bg-[var(--c-navy-500)] hover:bg-[var(--c-navy-600)] text-white px-6 font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-[var(--c-navy-500)]/20"
            >
               {isRunning ? "Procesando..." : "Ejecutar Request"}
               <Play className="h-4 w-4 ml-2 fill-current" />
            </Button>
         </div>
      </div>

      <CardContent className="p-8 overflow-y-auto custom-scrollbar space-y-8">
        {/* Summary Info */}
        <div className="p-4 rounded-2xl bg-[var(--c-gray-50)] border border-[var(--c-gray-100)]">
           <div className="flex items-center gap-3 mb-2">
              <span className="p-1 rounded bg-[var(--c-navy-500)] text-white text-[9px] font-black uppercase px-2">{operation.method}</span>
              <span className="text-[12px] font-mono text-[var(--c-navy-500)] font-bold opacity-70 break-all">{operation.path}</span>
           </div>
           <p className="text-[11px] text-[var(--c-gray-500)] font-medium italic underline decoration-[var(--c-cyan-500)]/30 underline-offset-4">{operation.summary}</p>
        </div>

        {operation.pathParams.length > 0 && (
          <div className="space-y-4">
            <h4 className={labelClass}><Database className="h-3 w-3" /> Path Parameters</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {operation.pathParams.map((p: string) => (
                <div key={p} className="space-y-1.5 flex flex-col">
                  <Label className="text-[11px] font-bold text-[var(--c-gray-600)]">{p}</Label>
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
                  <Label className="text-[11px] font-bold text-[var(--c-gray-600)]">{p}</Label>
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
               <span className="text-[9px] font-bold text-[var(--c-gray-400)] uppercase">application/json</span>
            </div>
            <div className="rounded-2xl border border-[var(--c-gray-100)] bg-zinc-950 p-4 shadow-inner">
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
