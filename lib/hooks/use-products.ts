import { useQuery } from "@tanstack/react-query";
import { listProducts } from "@/lib/api/products";

export function useProducts(params?: Record<string, string | number | undefined>) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => listProducts(params),
  });
}
