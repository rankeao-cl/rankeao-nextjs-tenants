"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getGames, getFormats, createTournament, type CreateTournamentPayload } from "@/lib/api/tournaments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { toast } from "sonner";
import { ArrowLeft, Trophy, Calendar, DollarSign, MapPin, Settings } from "lucide-react";
import { useTenantQueryScope } from "@/lib/hooks/use-tenant-query-scope";

const labelClass = "text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest mb-2";
const inputClass = "h-11 border-[var(--border)] bg-[var(--card)] px-4 text-sm text-[var(--foreground)] font-medium";
const selectClass = "h-11 border border-[var(--border)] bg-[var(--card)] rounded-xl px-4 text-sm text-[var(--foreground)] font-medium w-full focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20";

export default function NuevoTorneoPage() {
  const router = useRouter();
  const { tenantQueryKey } = useTenantQueryScope();

  const [bannerUrl, setBannerUrl] = useState("");
  const [form, setForm] = useState({
    game_id: "",
    format_id: "",
    name: "",
    description: "",
    rules: "",
    visibility: "PUBLIC",
    modality: "IN_PERSON",
    format_type: "SWISS",
    tier: "CASUAL",
    is_ranked: false,
    best_of: 3,
    max_rounds: "",
    round_timer_min: 50,
    check_in_minutes: 30,
    allow_self_report: true,
    min_players: 8,
    max_players: "",
    venue_name: "",
    address: "",
    city: "",
    region: "",
    country_code: "CL",
    starts_at: "",
    registration_opens_at: "",
    registration_closes_at: "",
    entry_fee: 0,
    currency: "CLP",
    prize_pool: 0,
    inscription_url: "",
  });

  const { data: games = [] } = useQuery({ queryKey: tenantQueryKey("games"), queryFn: getGames });
  const selectedGameSlug = useMemo(
    () => games.find((game) => game.id === form.game_id)?.slug,
    [games, form.game_id]
  );
  const { data: formats = [] } = useQuery({
    queryKey: tenantQueryKey("formats", selectedGameSlug),
    queryFn: () => getFormats(selectedGameSlug),
    enabled: Boolean(selectedGameSlug),
  });

  const createMut = useMutation({
    mutationFn: (payload: CreateTournamentPayload) => createTournament(payload),
    onSuccess: (t) => {
      toast.success("Torneo creado correctamente");
      router.push(`/panel/torneos/${t.id}`);
    },
    onError: (err: Error) => toast.error(err.message || "Error al crear torneo"),
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "game_id" ? { format_id: "" } : {}),
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.game_id || !form.format_id || !form.name || !form.starts_at) {
      toast.error("Completa los campos obligatorios");
      return;
    }

    const payload: CreateTournamentPayload = {
      game_id: form.game_id,
      format_id: form.format_id,
      name: form.name,
      description: form.description || undefined,
      rules: form.rules || undefined,
      banner_url: bannerUrl || undefined,
      visibility: form.visibility,
      modality: form.modality,
      format_type: form.format_type,
      tier: form.tier,
      is_ranked: form.is_ranked,
      best_of: Number(form.best_of),
      max_rounds: form.max_rounds ? Number(form.max_rounds) : undefined,
      round_timer_min: Number(form.round_timer_min),
      check_in_minutes: Number(form.check_in_minutes),
      allow_self_report: form.allow_self_report,
      min_players: Number(form.min_players),
      max_players: form.max_players ? Number(form.max_players) : undefined,
      venue_name: form.venue_name || undefined,
      address: form.address || undefined,
      city: form.city || undefined,
      region: form.region || undefined,
      country_code: form.country_code || undefined,
      starts_at: new Date(form.starts_at).toISOString(),
      registration_opens_at: form.registration_opens_at ? new Date(form.registration_opens_at).toISOString() : undefined,
      registration_closes_at: form.registration_closes_at ? new Date(form.registration_closes_at).toISOString() : undefined,
      entry_fee: Number(form.entry_fee),
      currency: form.currency,
      prize_pool: Number(form.prize_pool),
      inscription_url: form.inscription_url || undefined,
    };

    createMut.mutate(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.push("/panel/torneos")}
          className="p-2 rounded-xl border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-[var(--foreground)] tracking-tight flex items-center gap-3">
            <Trophy className="h-6 w-6 text-[var(--brand)]" />
            Nuevo Torneo
          </h1>
        </div>
      </div>

      {/* Banner */}
      <Card className="bg-[var(--card)] border border-[var(--surface)] rounded-[28px] overflow-hidden">
        <div className="px-8 py-5 border-b border-[var(--surface)] bg-[var(--surface)]/30">
          <h3 className="text-base font-black text-[var(--foreground)]">Imagen del Torneo</h3>
        </div>
        <CardContent className="p-8">
          <Label className={labelClass}>Banner / Portada</Label>
          <ImageUploader
            entityType="tournament_cover"
            currentUrl={bannerUrl}
            variant="banner"
            onUploaded={({ public_url }) => setBannerUrl(public_url)}
          />
        </CardContent>
      </Card>

      {/* Info básica */}
      <Card className="bg-[var(--card)] border border-[var(--surface)] rounded-[28px] overflow-hidden">
        <div className="px-8 py-5 border-b border-[var(--surface)] bg-[var(--surface)]/30">
          <h3 className="text-base font-black text-[var(--foreground)]">Información Básica</h3>
        </div>
        <CardContent className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className={labelClass}>Juego *</Label>
              <select name="game_id" value={form.game_id} onChange={handleChange} className={selectClass} required>
                <option value="">Selecciona un juego</option>
                {games.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label className={labelClass}>Formato *</Label>
              <select name="format_id" value={form.format_id} onChange={handleChange} className={selectClass} required>
                <option value="">Selecciona un formato</option>
                {formats.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className={labelClass}>Nombre del Torneo *</Label>
            <Input name="name" value={form.name} onChange={handleChange} className={inputClass} placeholder="Ej: Gran Prix Agosto 2026" required />
          </div>

          <div className="space-y-2">
            <Label className={labelClass}>Descripción</Label>
            <Textarea name="description" value={form.description} onChange={handleChange} className="rounded-xl border-[var(--border)] bg-[var(--card)] text-sm" rows={3} placeholder="Describe el torneo..." />
          </div>

          <div className="space-y-2">
            <Label className={labelClass}>Reglas</Label>
            <Textarea name="rules" value={form.rules} onChange={handleChange} className="rounded-xl border-[var(--border)] bg-[var(--card)] text-sm" rows={3} placeholder="Reglas y condiciones del torneo..." />
          </div>
        </CardContent>
      </Card>

      {/* Formato y modalidad */}
      <Card className="bg-[var(--card)] border border-[var(--surface)] rounded-[28px] overflow-hidden">
        <div className="px-8 py-5 border-b border-[var(--surface)] bg-[var(--surface)]/30 flex items-center gap-3">
          <Settings className="h-4 w-4 text-[var(--brand)]" />
          <h3 className="text-base font-black text-[var(--foreground)]">Formato y Reglas</h3>
        </div>
        <CardContent className="p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className={labelClass}>Visibilidad</Label>
              <select name="visibility" value={form.visibility} onChange={handleChange} className={selectClass}>
                <option value="PUBLIC">Público</option>
                <option value="PRIVATE">Privado</option>
                <option value="UNLISTED">Sin listar</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className={labelClass}>Modalidad</Label>
              <select name="modality" value={form.modality} onChange={handleChange} className={selectClass}>
                <option value="IN_PERSON">Presencial</option>
                <option value="ONLINE">Online</option>
                <option value="HYBRID">Híbrido</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className={labelClass}>Tipo</Label>
              <select name="format_type" value={form.format_type} onChange={handleChange} className={selectClass}>
                <option value="SWISS">Suizo</option>
                <option value="SINGLE_ELIM">Elim. Simple</option>
                <option value="DOUBLE_ELIM">Elim. Doble</option>
                <option value="ROUND_ROBIN">Round Robin</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className={labelClass}>Nivel</Label>
              <select name="tier" value={form.tier} onChange={handleChange} className={selectClass}>
                <option value="CASUAL">Casual</option>
                <option value="COMPETITIVE">Competitivo</option>
                <option value="PREMIER">Premier</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className={labelClass}>Mejor de</Label>
              <select name="best_of" value={form.best_of} onChange={handleChange} className={selectClass}>
                <option value={1}>1</option>
                <option value={3}>3</option>
                <option value={5}>5</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className={labelClass}>Rondas máx.</Label>
              <Input name="max_rounds" type="number" value={form.max_rounds} onChange={handleChange} className={inputClass} placeholder="Auto" min={1} max={20} />
            </div>
            <div className="space-y-2">
              <Label className={labelClass}>Tiempo ronda (min)</Label>
              <Input name="round_timer_min" type="number" value={form.round_timer_min} onChange={handleChange} className={inputClass} min={10} max={120} />
            </div>
            <div className="space-y-2">
              <Label className={labelClass}>Check-in (min)</Label>
              <Input name="check_in_minutes" type="number" value={form.check_in_minutes} onChange={handleChange} className={inputClass} min={5} max={120} />
            </div>
          </div>

          <div className="flex items-center gap-6 mt-6">
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)] cursor-pointer">
              <input type="checkbox" name="is_ranked" checked={form.is_ranked} onChange={handleChange} className="rounded" />
              Torneo Ranked
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)] cursor-pointer">
              <input type="checkbox" name="allow_self_report" checked={form.allow_self_report} onChange={handleChange} className="rounded" />
              Permitir auto-reporte
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Jugadores y fechas */}
      <Card className="bg-[var(--card)] border border-[var(--surface)] rounded-[28px] overflow-hidden">
        <div className="px-8 py-5 border-b border-[var(--surface)] bg-[var(--surface)]/30 flex items-center gap-3">
          <Calendar className="h-4 w-4 text-[var(--brand)]" />
          <h3 className="text-base font-black text-[var(--foreground)]">Fechas y Jugadores</h3>
        </div>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className={labelClass}>Fecha y hora de inicio *</Label>
              <Input name="starts_at" type="datetime-local" value={form.starts_at} onChange={handleChange} className={inputClass} required />
            </div>
            <div className="space-y-2">
              <Label className={labelClass}>Apertura inscripciones</Label>
              <Input name="registration_opens_at" type="datetime-local" value={form.registration_opens_at} onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-2">
              <Label className={labelClass}>Cierre inscripciones</Label>
              <Input name="registration_closes_at" type="datetime-local" value={form.registration_closes_at} onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-2">
              <Label className={labelClass}>Mín. jugadores</Label>
              <Input name="min_players" type="number" value={form.min_players} onChange={handleChange} className={inputClass} min={2} max={2048} />
            </div>
            <div className="space-y-2">
              <Label className={labelClass}>Máx. jugadores</Label>
              <Input name="max_players" type="number" value={form.max_players} onChange={handleChange} className={inputClass} placeholder="Sin límite" min={2} max={2048} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ubicación */}
      <Card className="bg-[var(--card)] border border-[var(--surface)] rounded-[28px] overflow-hidden">
        <div className="px-8 py-5 border-b border-[var(--surface)] bg-[var(--surface)]/30 flex items-center gap-3">
          <MapPin className="h-4 w-4 text-[var(--brand)]" />
          <h3 className="text-base font-black text-[var(--foreground)]">Ubicación</h3>
        </div>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className={labelClass}>Nombre del local</Label>
              <Input name="venue_name" value={form.venue_name} onChange={handleChange} className={inputClass} placeholder="Ej: Tienda Rankeao" />
            </div>
            <div className="space-y-2">
              <Label className={labelClass}>Dirección</Label>
              <Input name="address" value={form.address} onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-2">
              <Label className={labelClass}>Ciudad</Label>
              <Input name="city" value={form.city} onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-2">
              <Label className={labelClass}>Región</Label>
              <Input name="region" value={form.region} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inscripción y premios */}
      <Card className="bg-[var(--card)] border border-[var(--surface)] rounded-[28px] overflow-hidden">
        <div className="px-8 py-5 border-b border-[var(--surface)] bg-[var(--surface)]/30 flex items-center gap-3">
          <DollarSign className="h-4 w-4 text-[var(--brand)]" />
          <h3 className="text-base font-black text-[var(--foreground)]">Inscripción y Premios</h3>
        </div>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className={labelClass}>Costo inscripción (CLP)</Label>
              <Input name="entry_fee" type="number" value={form.entry_fee} onChange={handleChange} className={inputClass} min={0} />
            </div>
            <div className="space-y-2">
              <Label className={labelClass}>Premio total (CLP)</Label>
              <Input name="prize_pool" type="number" value={form.prize_pool} onChange={handleChange} className={inputClass} min={0} />
            </div>
            <div className="space-y-2">
              <Label className={labelClass}>URL inscripción externa</Label>
              <Input name="inscription_url" type="url" value={form.inscription_url} onChange={handleChange} className={inputClass} placeholder="https://..." />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3 pb-8">
        <Button type="button" variant="outline" onClick={() => router.push("/panel/torneos")} className="rounded-xl px-6">
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={createMut.isPending}
          className="bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white px-10 font-bold shadow-lg shadow-[var(--brand)]/20"
        >
          {createMut.isPending ? "Creando..." : "Crear Torneo"}
        </Button>
      </div>
    </form>
  );
}
