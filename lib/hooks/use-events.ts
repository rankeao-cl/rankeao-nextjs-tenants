"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listEvents, createEvent } from "@/lib/api/events";

export interface TenantEvent {
  id: string;
  title: string;
  description: string;
  /** Normalized from backend starts_at */
  start_date: string;
  /** Normalized from backend ends_at */
  end_date: string;
  status: string;
  created_at: string;
}

interface RawEvent {
  id: string;
  title: string;
  description?: string;
  starts_at: string;
  ends_at: string;
  status: string;
  created_at?: string;
}

function normalizeEvent(e: unknown): TenantEvent {
  const raw = e as RawEvent;
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description ?? "",
    start_date: raw.starts_at,
    end_date: raw.ends_at,
    status: raw.status,
    created_at: raw.created_at ?? new Date().toISOString().split("T")[0],
  };
}

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const raw = await listEvents();
      return (raw as unknown[]).map(normalizeEvent);
    },
  });
}

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; description?: string; starts_at: string; ends_at: string }) =>
      createEvent(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}
