"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { loginPanel } from "@/lib/api/auth";
import { fetchMyMemberships, fetchMyPendingInvitations } from "@/lib/api/tenant";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Ingresa email y contraseña");
      return;
    }
    setIsLoading(true);
    try {
      const resp = await loginPanel(email, password);
      setAuth(resp);

      const memberships = await fetchMyMemberships();
      if (!memberships || memberships.length === 0) {
        const invitations = await fetchMyPendingInvitations();
        if (invitations && invitations.length > 0) {
          router.push("/panel/invitations");
          return;
        }
        useAuthStore.getState().logout();
        toast.error("No tienes tiendas asociadas. Solicita una tienda primero.");
        return;
      }

      const membership = memberships[0];
      useAuthStore.getState().setAuth({
        ...resp,
        user: {
          ...resp.user,
          tenant_id: String(membership.tenant_id),
        },
      });

      toast.success(`Bienvenido al panel de ${membership.tenant_name}!`);
      const redirect =
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("redirect")) ||
        "/panel/dashboard";
      router.push(redirect as string);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al iniciar sesión";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: "linear-gradient(145deg, var(--c-gray-50) 0%, var(--c-navy-50) 50%, var(--c-gray-100) 100%)" }}
    >
      <div className="w-full max-w-[420px]">
        {/* Subtle top accent line */}
        <div className="h-1 w-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-[var(--c-navy-400)] to-[var(--c-navy-500)]" />

        <div className="bg-white rounded-2xl border border-[var(--c-gray-200)] shadow-elevated p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative flex h-10 w-48 items-center justify-center overflow-hidden mb-4">
              <Image
                src="/logo.svg"
                alt="Rankeao"
                fill
                sizes="192px"
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-xl font-bold text-[var(--c-gray-800)] tracking-tight">
              Panel Administrativo
            </h1>
            <p className="text-[13px] text-[var(--c-gray-400)] mt-1">
              Ingresa al entorno de gestión de tu tienda
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5 flex flex-col w-full">
              <Label className="text-sm font-medium text-[var(--c-gray-600)]">Email</Label>
              <div className="flex items-center gap-2.5 border border-[var(--c-gray-200)] bg-[var(--c-gray-50)] rounded-xl px-3 py-0.5 focus-within:border-[var(--c-navy-400)] focus-within:ring-2 focus-within:ring-[var(--c-navy-500)]/10 hover:border-[var(--c-gray-300)] transition-all">
                <Mail className="h-4 w-4 pointer-events-none shrink-0 text-[var(--c-gray-400)]" />
                <Input
                  type="email"
                  placeholder="tienda@rankeao.cl"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-10 placeholder:text-[var(--c-gray-400)] text-sm text-[var(--c-gray-800)]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 flex flex-col w-full">
              <Label className="text-sm font-medium text-[var(--c-gray-600)]">Contraseña</Label>
              <div className="flex items-center gap-2.5 border border-[var(--c-gray-200)] bg-[var(--c-gray-50)] rounded-xl px-3 py-0.5 focus-within:border-[var(--c-navy-400)] focus-within:ring-2 focus-within:ring-[var(--c-navy-500)]/10 hover:border-[var(--c-gray-300)] transition-all">
                <Lock className="h-4 w-4 pointer-events-none shrink-0 text-[var(--c-gray-400)]" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-10 placeholder:text-[var(--c-gray-400)] text-sm text-[var(--c-gray-800)]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="transition-colors p-0.5 hover:opacity-70 shrink-0 text-[var(--c-gray-400)]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full text-white font-semibold transition-all py-2.5 rounded-xl mt-1 text-sm hover:opacity-90 flex gap-2 bg-[var(--c-navy-500)] hover:bg-[var(--c-navy-800)] shadow-brand-sm"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Iniciar Sesión
            </Button>

            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-[var(--c-gray-200)]" />
              <span className="flex-shrink-0 mx-4 text-xs text-[var(--c-gray-400)]">o</span>
              <div className="flex-grow border-t border-[var(--c-gray-200)]" />
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full transition-all font-medium py-2.5 rounded-xl text-sm text-[var(--c-gray-600)] border-[var(--c-gray-200)] hover:bg-[var(--c-gray-50)]"
              onClick={() => {
                setEmail("demo@rankeao.cl");
                setPassword("demo123");
                toast.info("Credenciales demo cargadas. Haz clic en Iniciar Sesión.");
              }}
            >
              Usar Cuenta Demo
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-[var(--c-gray-400)]">
            Panel exclusivo para tiendas de Rankeao.cl
          </p>
        </div>
      </div>
    </div>
  );
}
