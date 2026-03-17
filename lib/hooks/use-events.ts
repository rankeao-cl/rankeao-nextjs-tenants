"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as eventsApi from "@/lib/api/events";

export function useEvents() {
  return useQuery({ queryKey: ["events"], queryFn: eventsApi.listEvents });
}

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; description?: string; starts_at: string; ends_at: string }) => eventsApi.createEvent(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}
