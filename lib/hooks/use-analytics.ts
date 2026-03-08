import { useQuery } from "@tanstack/react-query";
import { getSalesAnalytics } from "@/lib/api/analytics";

export function useSalesAnalytics() {
  return useQuery({
    queryKey: ["sales-analytics"],
    queryFn: getSalesAnalytics,
  });
}
