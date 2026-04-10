"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Code2 } from "lucide-react";

interface OperationSidebarProps {
  operations: any[];
  isLoading: boolean;
  search: string;
  onSearchChange: (val: string) => void;
  selectedId: string;
  onSelect: (id: string) => void;
}

export function OperationSidebar({ 
  operations, 
  isLoading, 
  search, 
  onSearchChange, 
  selectedId, 
  onSelect 
}: OperationSidebarProps) {
  
  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "POST": return "bg-sky-50 text-sky-600 border-sky-100";
      case "PUT": return "bg-amber-50 text-amber-600 border-amber-100";
      case "DELETE": return "bg-red-50 text-red-600 border-red-100";
      default: return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  return (
    <Card className="bg-white border border-[var(--c-gray-100)] rounded-[32px] shadow-sm overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-[var(--c-gray-50)] bg-[var(--c-gray-50)]/30">
        <div className="space-y-3 flex flex-col">
          <Label className="text-[10px] font-black text-[var(--c-gray-400)] uppercase tracking-widest flex items-center gap-2">
            <Search className="h-3 w-3" /> Buscar Endpoints
          </Label>
          <Input
            placeholder="ID, Ruta o Método..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 rounded-xl border-[var(--c-gray-200)] bg-white text-xs font-bold focus:ring-[var(--c-navy-500)]/10"
          />
        </div>
      </div>

      <CardContent className="p-4 overflow-y-auto flex-1 custom-scrollbar">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {operations.map((op) => (
              <Button
                key={op.operationId}
                variant="ghost"
                onClick={() => onSelect(op.operationId)}
                className={`w-full justify-start items-start flex-col h-auto p-4 rounded-2xl transition-all border ${
                  selectedId === op.operationId
                    ? "bg-[var(--c-navy-500)]/5 border-[var(--c-navy-500)] shadow-sm"
                    : "bg-transparent border-transparent hover:bg-[var(--c-gray-50)] hover:border-[var(--c-gray-100)]"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <div className="flex items-center gap-2">
                    <Code2 className={`h-3.5 w-3.5 ${selectedId === op.operationId ? 'text-[var(--c-navy-500)]' : 'text-[var(--c-gray-400)]'}`} />
                    <span className={`text-[12px] font-black tracking-tight ${selectedId === op.operationId ? 'text-[var(--c-navy-500)]' : 'text-[var(--c-gray-800)]'}`}>
                      {op.operationId}
                    </span>
                  </div>
                  <Badge className={`text-[9px] font-black uppercase tracking-widest border px-2 py-0.5 rounded-lg ${getMethodColor(op.method)} shadow-none`}>
                    {op.method}
                  </Badge>
                </div>
                <p className="text-[10px] text-[var(--c-gray-500)] font-mono truncate w-full opacity-80 decoration-dotted underline-offset-4 decoration-[var(--c-gray-200)]">
                  {op.path}
                </p>
              </Button>
            ))}
            {operations.length === 0 && (
              <div className="py-10 text-center">
                <p className="text-xs font-bold text-[var(--c-gray-400)] uppercase tracking-widest">No hay resultados</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
