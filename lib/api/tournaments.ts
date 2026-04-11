import { apiFetch, extractList } from "./client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TournamentListItem {
  id: string;
  name: string;
  slug: string;
  banner_url?: string;
  logo_url?: string;
  status: string;
  visibility: string;
  modality: string;
  format_type: string;
  tier: string;
  is_ranked: boolean;
  current_players: number;
  max_players?: number;
  starts_at: string;
  ends_at?: string;
  entry_fee: number;
  currency: string;
  prize_pool: number;
  game_name: string;
  format_name: string;
  organizer_name: string;
}

export interface TournamentDetail extends TournamentListItem {
  description?: string;
  rules?: string;
  best_of: number;
  max_rounds?: number;
  round_timer_min: number;
  check_in_minutes?: number;
  allow_self_report: boolean;
  min_players: number;
  current_round: number;
  venue_name?: string;
  address?: string;
  city?: string;
  region?: string;
  country_code?: string;
  registration_opens_at?: string;
  registration_closes_at?: string;
  started_at?: string;
  finished_at?: string;
  platform_fee_pct: number;
  inscription_url?: string;
  prizes: PrizeDistribution[];
  rounds: Round[];
  user_role: string;
}

export interface PrizeDistribution {
  position_from: number;
  position_to: number;
  prize_type: string;
  amount?: number;
  percentage?: number;
  description?: string;
}

export interface Round {
  id: string;
  round_number: number;
  status: string;
  started_at?: string;
  completed_at?: string;
}

export interface CreateTournamentPayload {
  game_id: string;
  format_id: string;
  name: string;
  description?: string;
  rules?: string;
  banner_url?: string;
  visibility?: string;
  modality?: string;
  format_type?: string;
  tier?: string;
  is_ranked?: boolean;
  best_of?: number;
  max_rounds?: number;
  round_timer_min?: number;
  check_in_minutes?: number;
  allow_self_report?: boolean;
  min_players?: number;
  max_players?: number;
  venue_name?: string;
  address?: string;
  city?: string;
  region?: string;
  country_code?: string;
  registration_opens_at?: string;
  registration_closes_at?: string;
  starts_at: string;
  ends_at?: string;
  entry_fee?: number;
  currency?: string;
  prize_pool?: number;
  inscription_url?: string;
  prizes?: PrizeDistribution[];
}

export interface GameOption {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
}

export interface FormatOption {
  id: string;
  name: string;
  slug: string;
  game_id?: string;
}

// ─── API calls ───────────────────────────────────────────────────────────────

export async function getMyTournaments(params?: {
  page?: number;
  per_page?: number;
  status?: string;
}): Promise<{ items: TournamentListItem[]; total: number }> {
  const payload = await apiFetch<unknown>("/tournaments", {
    params: { ...(params ?? {}), mine: "true" },
  });
  const items = extractList<TournamentListItem>(payload, ["tournaments", "items", "data"]);
  const total = (payload as Record<string, unknown>)?.total as number ?? items.length;
  return { items, total };
}

export async function getTournamentById(id: string): Promise<TournamentDetail> {
  const raw = await apiFetch<{ data?: TournamentDetail } | TournamentDetail>(`/tournaments/${id}`);
  return (raw as { data: TournamentDetail }).data ?? (raw as TournamentDetail);
}

export async function createTournament(payload: CreateTournamentPayload): Promise<TournamentDetail> {
  const raw = await apiFetch<{ data?: TournamentDetail } | TournamentDetail>("/tournaments", {
    method: "POST",
    body: payload,
  });
  return (raw as { data: TournamentDetail }).data ?? (raw as TournamentDetail);
}

export async function updateTournament(
  id: string,
  payload: Partial<CreateTournamentPayload>
): Promise<TournamentDetail> {
  const raw = await apiFetch<{ data?: TournamentDetail } | TournamentDetail>(`/tournaments/${id}`, {
    method: "PATCH",
    body: payload,
  });
  return (raw as { data: TournamentDetail }).data ?? (raw as TournamentDetail);
}

export async function deleteTournament(id: string): Promise<void> {
  await apiFetch(`/tournaments/${id}`, { method: "DELETE" });
}

// Lifecycle actions
export async function publishTournament(id: string) {
  return apiFetch(`/tournaments/${id}/publish`, { method: "POST" });
}
export async function startCheckIn(id: string) {
  return apiFetch(`/tournaments/${id}/start-check-in`, { method: "POST" });
}
export async function startTournament(id: string) {
  return apiFetch(`/tournaments/${id}/start`, { method: "POST" });
}
export async function nextRound(id: string) {
  return apiFetch(`/tournaments/${id}/next-round`, { method: "POST" });
}
export async function finishTournament(id: string) {
  return apiFetch(`/tournaments/${id}/finish`, { method: "POST" });
}
export async function closeTournament(id: string) {
  return apiFetch(`/tournaments/${id}/close`, { method: "POST" });
}

// Catalog helpers
export async function getGames(): Promise<GameOption[]> {
  const payload = await apiFetch<unknown>("/catalog/games");
  return extractList<GameOption>(payload, ["games", "items", "data"]);
}

export async function getFormats(gameId?: string): Promise<FormatOption[]> {
  const payload = await apiFetch<unknown>("/catalog/formats", {
    params: gameId ? { game_id: gameId } : undefined,
  });
  return extractList<FormatOption>(payload, ["formats", "items", "data"]);
}
