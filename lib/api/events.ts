import { apiFetch, extractList } from "./client";

export async function listEvents() {
  const payload = await apiFetch<unknown>("/tenants/me/events");
  return extractList(payload, ["events", "items"]);
}

export async function createEvent(data: { title: string; description?: string; starts_at: string; ends_at: string }) {
  return apiFetch("/tenants/me/events", { method: "POST", body: data });
}
