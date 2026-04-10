"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  TextField, Label, InputGroup, InputGroupPrefix, InputGroupSuffix, Input,
  Button, Card, Form
} from "@heroui/react";
import { toast } from "@heroui/react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
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
      toast.danger("Ingresa email y contraseña");
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
        toast.danger("No tienes tiendas asociadas. Solicita una tienda primero.");
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
        new URLSearchParams(window.location.search).get("redirect") ||
        "/panel/dashboard";
      router.push(redirect);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al iniciar sesión";
      toast.danger(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: "linear-gradient(135deg, #f7f9fa 0%, #e6eaef 100%)" }}>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-[var(--border)] shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8">
          
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative flex h-10 w-48 items-center justify-center overflow-hidden mb-5">
              <Image
                src="/logo.svg"
                alt="Rankeao"
                fill
                sizes="192px"
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-[22px] font-bold text-[#2d3748] tracking-tight">
              Panel Administrativo
            </h1>
            <p className="text-[14px] text-[#64748b] mt-1">
              Ingresa al entorno de gestión de tu tienda
            </p>
          </div>

          {/* Form */}
          <Form onSubmit={handleSubmit} className="space-y-5">
            <TextField name="email" className="space-y-1.5 flex flex-col w-full">
              <Label className="text-sm font-medium" style={{ color: "var(--c-dark-gray)" }}>Email</Label>
              <InputGroup className="flex items-center gap-2 border border-[var(--border)] bg-[#f9fafb] rounded-xl px-3 py-2 focus-within:border-[var(--c-cyan)] focus-within:ring-2 focus-within:ring-[var(--c-cyan)]/10 hover:border-[#c0c5cc] transition-all">
                <InputGroupPrefix>
                  <Mail className="h-4 w-4 pointer-events-none" style={{ color: "var(--c-gray)" }} />
                </InputGroupPrefix>
                <Input
                  type="email"
                  placeholder="tienda@rankeao.cl"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setEmail(e.target.value)}
                  className="w-full bg-transparent placeholder:text-[#a0aec0] focus:outline-none text-sm"
                  style={{ color: "var(--c-dark-gray)" }}
                  required
                />
              </InputGroup>
            </TextField>

            <TextField name="password" className="space-y-1.5 flex flex-col w-full">
              <Label className="text-sm font-medium" style={{ color: "var(--c-dark-gray)" }}>Contraseña</Label>
              <InputGroup className="flex items-center gap-2 border border-[var(--border)] bg-[#f9fafb] rounded-xl px-3 py-2 focus-within:border-[var(--c-cyan)] focus-within:ring-2 focus-within:ring-[var(--c-cyan)]/10 hover:border-[#c0c5cc] transition-all">
                <InputGroupPrefix>
                  <Lock className="h-4 w-4 pointer-events-none" style={{ color: "var(--c-gray)" }} />
                </InputGroupPrefix>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setPassword(e.target.value)}
                  className="w-full bg-transparent placeholder:text-[#a0aec0] focus:outline-none text-sm"
                  style={{ color: "var(--c-dark-gray)" }}
                  required
                />
                <InputGroupSuffix>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="transition-colors p-0.5 hover:opacity-70"
                    style={{ color: "var(--c-gray)" }}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </InputGroupSuffix>
              </InputGroup>
            </TextField>

            <Button
              type="submit"
              className="w-full text-white font-semibold shadow-sm transition-all py-2.5 rounded-xl mt-2 text-sm hover:opacity-90"
              style={{ backgroundColor: "var(--c-cyan)" }}
              isPending={isLoading}
            >
              Iniciar Sesión
            </Button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-[var(--border)]"></div>
              <span className="flex-shrink-0 mx-4 text-xs" style={{ color: "var(--c-gray)" }}>o</span>
              <div className="flex-grow border-t border-[var(--border)]"></div>
            </div>

            <Button
              type="button"
              variant="secondary"
              className="w-full border transition-all font-medium py-2.5 rounded-xl text-sm"
              style={{ 
                backgroundColor: "var(--surface-secondary)", 
                color: "var(--c-orange)", 
                borderColor: "var(--border)" 
              }}
              onPress={() => {
                setEmail("demo@rankeao.cl");
                setPassword("demo123");
                toast.info("Credenciales demo cargadas. Haz clic en Iniciar Sesión.");
              }}
            >
              Usar Cuenta Demo
            </Button>
          </Form>

          <p className="mt-6 text-center text-xs" style={{ color: "var(--c-gray)" }}>
            Panel exclusivo para tiendas de Rankeao.cl
          </p>
        </div>
      </div>
    </div>
  );
}
