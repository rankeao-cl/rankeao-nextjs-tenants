import { apiFetch } from "./client";
import type { AuthResponse, Membership } from "@/lib/types/auth";
import { useAuthStore } from "@/lib/stores/auth-store";

interface AuthPayload {
  data?: {
    tokens?: {
      access_token?: string;
      refresh_token?: string;
      expires_in?: number;
    };
    user?: {
      id?: string | number;
      username?: string;
      email?: string;
      avatar_url?: string;
      created_at?: string;
      tenant_id?: string;
    };
  };
}

function normalizeAuthResponse(payload: AuthResponse | AuthPayload): AuthResponse {
  const direct = payload as AuthResponse;
  if (direct?.access_token && direct?.refresh_token && direct?.user) {
    return {
      ...direct,
      user: { ...direct.user, id: String(direct.user.id) },
    };
  }

  const envelope = payload as AuthPayload;
  const tokens = envelope.data?.tokens;
  const user = envelope.data?.user;

  if (!tokens?.access_token || !tokens?.refresh_token || !user?.id || !user.email) {
    throw new Error("Respuesta de autenticación inválida");
  }

  return {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_in: tokens.expires_in ?? 3600,
    user: {
      id: String(user.id),
      username: user.username ?? "",
      email: user.email,
      avatar_url: user.avatar_url,
      created_at: user.created_at ?? "",
      tenant_id: user.tenant_id,
    },
  };
}

export async function loginPanel(email: string, password: string): Promise<AuthResponse> {
  const raw = await apiFetch<AuthResponse | AuthPayload>("/auth/login", {
    method: "POST",
    body: { email, password },
    skipAuth: true,
  });

  return normalizeAuthResponse(raw);
}

export async function logoutPanel(refreshToken: string): Promise<void> {
  await apiFetch("/auth/logout", {
    method: "POST",
    body: { refresh_token: refreshToken },
    skipAuth: true,
  });
}

export async function closePanelSession(): Promise<{ remoteRevoked: boolean; warning?: string }> {
  const { refreshToken, logout } = useAuthStore.getState();
  if (!refreshToken) {
    logout();
    return { remoteRevoked: false };
  }

  try {
    await logoutPanel(refreshToken);
    logout();
    return { remoteRevoked: true };
  } catch (error: unknown) {
    logout();
    const message = error instanceof Error ? error.message : "No se pudo cerrar sesión en el servidor.";
    return {
      remoteRevoked: false,
      warning: `Sesión local cerrada. ${message}`,
    };
  }
}

const DEFAULT_PANEL_REDIRECT = "/panel/dashboard";

export function resolvePanelRedirect(redirect: string | null | undefined): string {
  const value = (redirect ?? "").trim();
  if (!value.startsWith("/panel/")) return DEFAULT_PANEL_REDIRECT;
  if (
    value.startsWith("/panel/login") ||
    value.startsWith("/panel/select-tenant") ||
    value.startsWith("/panel/invitations")
  ) {
    return DEFAULT_PANEL_REDIRECT;
  }
  return value;
}

export function activateTenantMembership(membership: Membership): void {
  const { accessToken, refreshToken, expiresAt, user, setAuth } = useAuthStore.getState();

  if (!accessToken || !refreshToken || !user) {
    throw new Error("No hay una sesión activa para seleccionar tienda.");
  }

  const remaining = expiresAt ? Math.floor((expiresAt - Date.now()) / 1000) : 3600;
  const expiresIn = Math.max(1, remaining);

  setAuth({
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: expiresIn,
    user: {
      ...user,
      tenant_id: String(membership.tenant_id),
    },
  });
}
