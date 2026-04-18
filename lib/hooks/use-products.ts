import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkProductAction,
} from "@/lib/api/products";
import { useTenantQueryScope } from "./use-tenant-query-scope";

export function useProducts(params?: Record<string, string | number | undefined>) {
  const { tenantQueryKey } = useTenantQueryScope();
  return useQuery({
    queryKey: tenantQueryKey("products", params),
    queryFn: () => listProducts(params),
  });
}

export function useProduct(id: string | null) {
  const { tenantQueryKey } = useTenantQueryScope();
  return useQuery({
    queryKey: tenantQueryKey("product", id),
    queryFn: () => getProduct(id!),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  const { tenantQueryKey } = useTenantQueryScope();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => createProduct(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: tenantQueryKey("products") }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  const { tenantQueryKey } = useTenantQueryScope();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => updateProduct(id, data),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: tenantQueryKey("products") });
      qc.invalidateQueries({ queryKey: tenantQueryKey("product", vars.id) });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  const { tenantQueryKey } = useTenantQueryScope();
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: tenantQueryKey("products") }),
  });
}

export function useBulkProductAction() {
  const qc = useQueryClient();
  const { tenantQueryKey } = useTenantQueryScope();
  return useMutation({
    mutationFn: (data: { product_ids: string[]; action: string }) => bulkProductAction(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tenantQueryKey("products") });
    },
  });
}
