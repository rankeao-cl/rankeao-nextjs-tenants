"use client";

import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, ChevronDown, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderFiltersProps {
  query: string;
  onQueryChange: (val: string) => void;
}

export function OrderFilters({ query, onQueryChange }: OrderFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-white p-4 rounded-2xl border border-[var(--c-gray-200)] shadow-sm">
      <div className="relative w-full lg:max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--c-gray-400)]" />
        <Input
          placeholder="N° de orden, cliente o email..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="pl-10 h-11 bg-[var(--c-gray-50)] border-none rounded-xl focus-visible:ring-2 focus-visible:ring-[var(--c-cyan-500)] text-[14px] font-medium"
        />
      </div>
      
      <div className="flex items-center gap-2 w-full lg:w-auto">
        <Button variant="ghost" className="h-11 px-4 text-[13px] font-bold text-[var(--c-gray-600)] hover:bg-[var(--c-gray-50)] rounded-xl flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[var(--c-gray-400)]" /> Últimos 30 días <ChevronDown className="w-4 h-4 text-[var(--c-gray-400)]" />
        </Button>
        <Button variant="ghost" className="h-11 px-4 text-[13px] font-bold text-[var(--c-gray-600)] hover:bg-[var(--c-gray-50)] rounded-xl flex items-center gap-2">
          Estado: Todos <ChevronDown className="w-4 h-4 text-[var(--c-gray-400)]" />
        </Button>
        <div className="w-px h-6 bg-[var(--c-gray-200)] mx-1 hidden lg:block"></div>
        <Button className="h-11 px-5 bg-white border border-[var(--c-cyan-500)] text-[var(--c-cyan-600)] font-bold rounded-xl hover:bg-[var(--c-cyan-50)] transition-all flex items-center gap-2 ml-auto lg:ml-0">
          <SlidersHorizontal className="w-4 h-4" /> Filtros
        </Button>
      </div>
    </div>
  );
}
