import { useQuery } from "@tanstack/react-query";
import { getInventoryValuation, listInventoryMovements } from "@/lib/api/inventory";

export function useInventoryValuation() {
  return useQuery({
    queryKey: ["inventory-valuation"],
    queryFn: getInventoryValuation,
  });
}

export function useInventoryMovements(params?: Record<string, string | number | undefined>) {
  return useQuery({
    queryKey: ["inventory-movements", params],
    queryFn: () => listInventoryMovements(params),
  });
}
