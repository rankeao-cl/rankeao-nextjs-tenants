"use client";

import { useState } from "react";
import { AuthGuard } from "@/components/ui/AuthGuard";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="admin-shell flex flex-col h-screen overflow-hidden bg-[var(--background)]">
        <Header onMenuToggle={() => setMobileOpen(true)} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            onToggle={() => setCollapsed(!collapsed)}
            mobileOpen={mobileOpen}
            onMobileClose={() => setMobileOpen(false)}
          />
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 relative">
            <div className="mx-auto w-full max-w-[1480px]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
