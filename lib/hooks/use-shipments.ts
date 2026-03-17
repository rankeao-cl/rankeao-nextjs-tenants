"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as shipmentsApi from "@/lib/api/shipments";
import type { Shipment } from "@/lib/api/shipments";

export function useShipments(params?: Record<string, string | number | boolean | undefined>) {
  return useQuery({
    queryKey: ["shipments", params],
    queryFn: () => shipmentsApi.listShipments(params),
  });
}

export function useUpdateShipment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Shipment> }) => shipmentsApi.updateShipment(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shipments"] }),
  });
}
