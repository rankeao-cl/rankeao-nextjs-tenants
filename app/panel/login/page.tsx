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
import { fetchMyMemberships } from "@/lib/api/tenant";
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
      // Store auth first so the API client can use the token
      setAuth(resp);

      // Check if user has any tenant memberships
      const memberships = await fetchMyMemberships();
      if (!memberships || memberships.length === 0) {
        // No tenant associated — block access
        useAuthStore.getState().logout();
        toast.danger("No tienes tiendas asociadas. Solicita una tienda primero.");
        return;
      }

      // Store the first membership's tenant_id on the user
      const membership = memberships[0];
      useAuthStore.getState().setAuth({
        ...resp,
        user: {
          ...resp.user,
          tenant_id: String(membership.tenant_id),
        },
      });

      toast.success(`¡Bienvenido al panel de ${membership.tenant_name}!`);
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

  const inputClasses = "w-full bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--field-placeholder)] focus:outline-none";
  const groupClasses = "flex items-center gap-2 border border-white/15 bg-[var(--surface)] rounded-xl px-3 py-2 focus-within:border-white/70 hover:border-white/40 transition-colors";

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-[var(--background)]">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-white/10 blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-zinc-300/8 blur-[120px]" />
      </div>

      <Card className="w-full max-w-md bg-[var(--surface)]/90 border border-white/20 backdrop-blur-xl shadow-neon-white relative z-10">
        <Card.Content className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-white/30 bg-gradient-to-br from-zinc-200 to-white mb-4 shadow-lg shadow-white/20">
              <Image
                src="/logo.png"
                alt="Rankeao"
                fill
                sizes="56px"
                className="object-contain p-2"
                priority
              />
            </div>
            <h1 className="font-[var(--font-heading)] text-2xl font-bold text-gradient-brand">
              Rankeao Panel
            </h1>
            <p className="text-sm text-[var(--muted)] mt-1">
              Ingresa al panel de administración de tiendas
            </p>
          </div>

          <Form onSubmit={handleSubmit} className="space-y-5">
            <TextField name="email" className="space-y-1.5 flex flex-col">
              <Label className="text-[var(--muted)] text-sm">Email</Label>
              <InputGroup className={groupClasses}>
                <InputGroupPrefix>
                  <Mail className="h-4 w-4 text-[var(--muted)] pointer-events-none" />
                </InputGroupPrefix>
                <Input
                  type="email"
                  placeholder="tienda@rankeao.cl"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setEmail(e.target.value)}
                  className={inputClasses}
                  required
                />
              </InputGroup>
            </TextField>

            <TextField name="password" className="space-y-1.5 flex flex-col">
              <Label className="text-[var(--muted)] text-sm">Contraseña</Label>
              <InputGroup className={groupClasses}>
                <InputGroupPrefix>
                  <Lock className="h-4 w-4 text-[var(--muted)] pointer-events-none" />
                </InputGroupPrefix>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setPassword(e.target.value)}
                  className={inputClasses}
                  required
                />
                <InputGroupSuffix>
                  <Button
                    type="button"
                    isIconOnly
                    size="sm"
                    variant="ghost"
                    onPress={() => setShowPassword(!showPassword)}
                    className="text-[var(--muted)] hover:text-[var(--foreground)]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </InputGroupSuffix>
              </InputGroup>
            </TextField>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-zinc-200 to-white text-black font-semibold hover:from-zinc-100 hover:to-zinc-50 shadow-lg shadow-white/20 transition-all hover:scale-[1.02] py-2 rounded-xl mt-4"
              isPending={isLoading}
            >
              Iniciar Sesión
            </Button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-[var(--border)]"></div>
              <span className="flex-shrink-0 mx-4 text-xs text-[var(--muted)]">o</span>
              <div className="flex-grow border-t border-[var(--border)]"></div>
            </div>

            <Button
              type="button"
              variant="secondary"
              className="w-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 hover:bg-[var(--accent)]/20 transition-all font-medium py-2 rounded-xl"
              onPress={() => {
                setEmail("demo@rankeao.cl");
                setPassword("demo123");
                toast.info("Credenciales demo cargadas. Haz clic en Iniciar Sesión.");
              }}
            >
              Usar Cuenta Demo
            </Button>
          </Form>

          <p className="mt-6 text-center text-xs text-[var(--field-placeholder)]">
            Panel exclusivo para tiendas de Rankeao.cl
          </p>
        </Card.Content>
      </Card>
    </div>
  );
}
