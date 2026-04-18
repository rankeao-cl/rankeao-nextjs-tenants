import { useAuthStore } from "@/lib/stores/auth-store";

export function useTenantQueryScope() {
  const tenantId = useAuthStore((state) => state.user?.tenant_id ?? "no-tenant");

  return {
    tenantId,
    tenantQueryKey: (...parts: ReadonlyArray<unknown>) => ["tenant", tenantId, ...parts],
  };
}
