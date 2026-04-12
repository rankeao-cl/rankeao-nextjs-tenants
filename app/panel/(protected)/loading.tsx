"use client";

import { Loader2 } from "lucide-react";

export default function ProtectedRouteLoading() {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--brand)]" />
        <p className="text-sm text-[var(--muted-foreground)]">Cargando vista...</p>
      </div>
    </div>
  );
}
