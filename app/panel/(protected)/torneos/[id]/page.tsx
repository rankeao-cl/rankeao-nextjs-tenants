"use client";

import { use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  getTournamentById,
  publishTournament,
  startCheckIn,
  startTournament,
  nextRound,
  finishTournament,
  closeTournament,
  deleteTournament,
  type TournamentDetail,
} from "@/lib/api/tournaments";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  ArrowLeft,
  Trophy,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Play,
  CheckSquare,
  SkipForward,
  Flag,
  Archive,
  Trash2,
  Send,
  ExternalLink,
  List,
} from "lucide-react";
import Link from "next/link";

const STATUS_LABELS: Record<string, { label: string; bg: string; text: string }> = {
  DRAFT: { label: "Borrador", bg: "bg-gray-500/15", text: "text-[var(--muted-foreground)]" },
  PENDING_APPROVAL: { label: "Pendiente aprobación", bg: "bg-orange-500/15", text: "text-orange-500" },
  OPEN: { label: "Inscripciones abiertas", bg: "bg-green-500/15", text: "text-green-500" },
  CHECK_IN: { label: "Check-in activo", bg: "bg-yellow-500/15", text: "text-yellow-500" },
  STARTED: { label: "En curso", bg: "bg-blue-500/15", text: "text-blue-500" },
  ROUND_IN_PROGRESS: { label: "Ronda en progreso", bg: "bg-blue-500/15", text: "text-blue-500" },
  ROUND_COMPLETE: { label: "Ronda completada", bg: "bg-blue-500/10", text: "text-blue-600" },
  FINISHED: { label: "Finalizado", bg: "bg-purple-500/15", text: "text-purple-500" },
  CLOSED: { label: "Cerrado", bg: "bg-gray-500/15", text: "text-[var(--muted-foreground)]" },
  CANCELLED: { label: "Cancelado", bg: "bg-red-500/15", text: "text-red-600" },
};

interface LifecycleAction {
  label: string;
  icon: React.ElementType;
  action: () => void;
  variant?: "default" | "destructive" | "outline";
  condition: (t: TournamentDetail) => boolean;
}

export default function TorneoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const qc = useQueryClient();

  const { data: tournament, isLoading } = useQuery({
    queryKey: ["panel-tournament", id],
    queryFn: () => getTournamentById(id),
  });

  function invalidate() {
    qc.invalidateQueries({ queryKey: ["panel-tournament", id] });
    qc.invalidateQueries({ queryKey: ["my-tournaments"] });
  }

  const publishMut = useMutation({
    mutationFn: () => publishTournament(id),
    onSuccess: () => { toast.success("Torneo publicado"); invalidate(); },
    onError: (e: Error) => toast.error(e.message || "Error"),
  });
  const checkInMut = useMutation({
    mutationFn: () => startCheckIn(id),
    onSuccess: () => { toast.success("Check-in iniciado"); invalidate(); },
    onError: (e: Error) => toast.error(e.message || "Error"),
  });
  const startMut = useMutation({
    mutationFn: () => startTournament(id),
    onSuccess: () => { toast.success("Torneo iniciado"); invalidate(); },
    onError: (e: Error) => toast.error(e.message || "Error"),
  });
  const nextRoundMut = useMutation({
    mutationFn: () => nextRound(id),
    onSuccess: () => { toast.success("Nueva ronda iniciada"); invalidate(); },
    onError: (e: Error) => toast.error(e.message || "Error"),
  });
  const finishMut = useMutation({
    mutationFn: () => finishTournament(id),
    onSuccess: () => { toast.success("Torneo finalizado"); invalidate(); },
    onError: (e: Error) => toast.error(e.message || "Error"),
  });
  const closeMut = useMutation({
    mutationFn: () => closeTournament(id),
    onSuccess: () => { toast.success("Torneo cerrado"); invalidate(); },
    onError: (e: Error) => toast.error(e.message || "Error"),
  });
  const deleteMut = useMutation({
    mutationFn: () => deleteTournament(id),
    onSuccess: () => {
      toast.success("Torneo eliminado");
      router.push("/panel/torneos");
    },
    onError: (e: Error) => toast.error(e.message || "Error"),
  });

  const isMutating =
    publishMut.isPending || checkInMut.isPending || startMut.isPending ||
    nextRoundMut.isPending || finishMut.isPending || closeMut.isPending;

  const lifecycleActions: LifecycleAction[] = [
    {
      label: "Publicar",
      icon: Send,
      action: () => publishMut.mutate(),
      condition: (t) => t.status === "DRAFT",
    },
    {
      label: "Iniciar Check-in",
      icon: CheckSquare,
      action: () => checkInMut.mutate(),
      condition: (t) => t.status === "OPEN",
    },
    {
      label: "Iniciar Torneo",
      icon: Play,
      action: () => startMut.mutate(),
      condition: (t) => t.status === "CHECK_IN",
    },
    {
      label: "Siguiente Ronda",
      icon: SkipForward,
      action: () => nextRoundMut.mutate(),
      condition: (t) => t.status === "ROUND_COMPLETE",
    },
    {
      label: "Finalizar Torneo",
      icon: Flag,
      action: () => finishMut.mutate(),
      condition: (t) =>
        t.status === "STARTED" || t.status === "ROUND_IN_PROGRESS" || t.status === "ROUND_COMPLETE",
    },
    {
      label: "Cerrar Torneo",
      icon: Archive,
      action: () => closeMut.mutate(),
      condition: (t) => t.status === "FINISHED",
    },
  ];

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-64 w-full rounded-[28px]" />
        <Skeleton className="h-32 w-full rounded-[28px]" />
        <Skeleton className="h-32 w-full rounded-[28px]" />
      </div>
    );
  }

  if (!tournament) {
    return <p className="p-8 text-red-500 font-bold">Torneo no encontrado.</p>;
  }

  const st = STATUS_LABELS[tournament.status] ?? { label: tournament.status, bg: "bg-gray-500/15", text: "text-[var(--muted-foreground)]" };
  const activeActions = lifecycleActions.filter((a) => a.condition(tournament));

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => router.push("/panel/torneos")}
          className="p-2 rounded-xl border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--surface)] transition-colors mt-1"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${st.bg} ${st.text}`}>
              {st.label}
            </span>
            {tournament.is_ranked && (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-500">
                Ranked
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black text-[var(--foreground)] tracking-tight truncate">
            {tournament.name}
          </h1>
          <p className="text-sm text-[var(--muted-foreground)]">{tournament.game_name} · {tournament.format_name}</p>
        </div>
      </div>

      {/* Banner */}
      {tournament.banner_url && (
        <div className="w-full aspect-[3/1] rounded-[24px] overflow-hidden border border-[var(--surface)]">
          <img src={tournament.banner_url} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Lifecycle actions */}
      {activeActions.length > 0 && (
        <div className="bg-[var(--card)] border border-[var(--surface)] rounded-[24px] p-6">
          <h3 className="text-sm font-black text-[var(--foreground)] mb-4 uppercase tracking-wider">
            Acciones del Torneo
          </h3>
          <div className="flex flex-wrap gap-3">
            {activeActions.map((a) => (
              <Button
                key={a.label}
                onClick={a.action}
                disabled={isMutating}
                className="bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white"
              >
                <a.icon className="h-4 w-4 mr-2" />
                {a.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "Jugadores", value: `${tournament.current_players}${tournament.max_players ? ` / ${tournament.max_players}` : ""}` },
          { icon: Trophy, label: "Ronda actual", value: tournament.current_round || "—" },
          { icon: DollarSign, label: "Inscripción", value: tournament.entry_fee > 0 ? `$${tournament.entry_fee.toLocaleString("es-CL")}` : "Gratis" },
          { icon: Calendar, label: "Inicio", value: format(new Date(tournament.starts_at), "d MMM yyyy", { locale: es }) },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-[var(--card)] border border-[var(--surface)] rounded-2xl p-4 text-center">
            <Icon className="h-4 w-4 text-[var(--brand)] mx-auto mb-2" />
            <p className="text-lg font-black text-[var(--foreground)]">{value}</p>
            <p className="text-[11px] text-[var(--muted-foreground)] font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="bg-[var(--card)] border border-[var(--surface)] rounded-[24px] p-6">
        <h3 className="text-sm font-black text-[var(--foreground)] mb-4 uppercase tracking-wider">
          Ver torneo público
        </h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/torneos/${id}/rondas`}
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors"
          >
            <List className="h-4 w-4" />
            Rondas
          </Link>
          <Link
            href={`/torneos/${id}/standings`}
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors"
          >
            <Trophy className="h-4 w-4" />
            Standings
          </Link>
          <Link
            href={`/torneos/${id}`}
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Página pública
          </Link>
        </div>
      </div>

      {/* Location */}
      {(tournament.venue_name || tournament.city) && (
        <div className="bg-[var(--card)] border border-[var(--surface)] rounded-[24px] p-6">
          <h3 className="text-sm font-black text-[var(--foreground)] mb-3 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[var(--brand)]" />
            Ubicación
          </h3>
          {tournament.venue_name && <p className="text-sm font-semibold text-[var(--foreground)]">{tournament.venue_name}</p>}
          {tournament.address && <p className="text-sm text-[var(--muted-foreground)]">{tournament.address}</p>}
          {(tournament.city || tournament.region) && (
            <p className="text-sm text-[var(--muted-foreground)]">{[tournament.city, tournament.region].filter(Boolean).join(", ")}</p>
          )}
        </div>
      )}

      {/* Danger zone */}
      {tournament.status === "DRAFT" && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-[24px] p-6">
          <h3 className="text-sm font-black text-red-500 mb-2">Zona peligrosa</h3>
          <p className="text-xs text-red-500 mb-4">Solo se pueden eliminar torneos en estado Borrador.</p>
          <Button
            variant="outline"
            onClick={() => {
              if (confirm("¿Eliminar este torneo permanentemente?")) deleteMut.mutate();
            }}
            disabled={deleteMut.isPending}
            className="border-red-500/25 text-red-600 hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar torneo
          </Button>
        </div>
      )}
    </div>
  );
}
