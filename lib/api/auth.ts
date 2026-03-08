import { apiFetch } from "./client";
import type { AuthResponse } from "@/lib/types/auth";

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
