"use client";

import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductFiltersProps {
  query: string;
  onQueryChange: (val: string) => void;
}

export function ProductFilters({ query, onQueryChange }: ProductFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-[var(--card)] p-4 rounded-2xl border border-[var(--border)] shadow-sm">
      <div className="relative w-full lg:max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
        <Input
          placeholder="Buscar por nombre, SKU o código..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="pl-10 h-11 bg-[var(--surface)] border-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] text-[14px] font-medium"
        />
      </div>
      
      <div className="flex items-center gap-2 w-full lg:w-auto">
        <Button variant="ghost" className="h-11 px-4 text-[13px] font-bold text-[var(--muted-foreground)] hover:bg-[var(--surface)] flex items-center gap-2">
          Categoría: Todas <ChevronDown className="w-4 h-4 text-[var(--muted-foreground)]" />
        </Button>
        <Button variant="ghost" className="h-11 px-4 text-[13px] font-bold text-[var(--muted-foreground)] hover:bg-[var(--surface)] flex items-center gap-2">
          Estado: Activos <ChevronDown className="w-4 h-4 text-[var(--muted-foreground)]" />
        </Button>
        <div className="w-px h-6 bg-[var(--border)] mx-1 hidden lg:block"></div>
        <Button variant="outline" className="h-11 px-5 border-[var(--brand)] text-[var(--brand-hover)] font-bold hover:bg-[var(--accent-subtle)] transition-all flex items-center gap-2 ml-auto lg:ml-0">
          <SlidersHorizontal className="w-4 h-4" /> Filtros
        </Button>
      </div>
    </div>
  );
}
