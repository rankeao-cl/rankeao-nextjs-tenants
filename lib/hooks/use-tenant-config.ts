import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyTenant, updateMyTenant } from "@/lib/api/tenant";
import type { TenantStorefrontConfig } from "@/lib/types/tenant";
import { toast } from "sonner";
import { useTenantQueryScope } from "./use-tenant-query-scope";

function extractConfig(tenant: Record<string, unknown>): TenantStorefrontConfig {
  return (tenant.config as TenantStorefrontConfig) ?? {};
}

export function useTenantConfig() {
  const queryClient = useQueryClient();
  const { tenantQueryKey } = useTenantQueryScope();

  const { data: tenant, isLoading } = useQuery({
    queryKey: tenantQueryKey("my-tenant"),
    queryFn: getMyTenant,
    staleTime: 5 * 60 * 1000,
  });

  const config: TenantStorefrontConfig = tenant ? extractConfig(tenant) : {};

  const mutation = useMutation({
    mutationFn: async (partial: Partial<TenantStorefrontConfig>) => {
      // CRITICAL: always read current config first to avoid full-replace overwriting other fields
      const current = await getMyTenant();
      const currentConfig = extractConfig(current);
      const merged = { ...currentConfig, ...partial };
      await updateMyTenant({ config: merged });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantQueryKey("my-tenant") });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Error al guardar configuración";
      toast.error(msg);
    },
  });

  return {
    config,
    tenant,
    isLoading,
    isSaving: mutation.isPending,
    updateConfig: mutation.mutateAsync,
  };
}
