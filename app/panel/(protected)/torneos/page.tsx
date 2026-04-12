"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getMyTournaments, type TournamentListItem } from "@/lib/api/tournaments";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Trophy, Calendar, Users, DollarSign, Settings } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Borrador", color: "bg-gray-500/15 text-[var(--muted-foreground)]" },
  OPEN: { label: "Inscripciones", color: "bg-green-500/15 text-green-500" },
  CHECK_IN: { label: "Check-in", color: "bg-yellow-500/15 text-yellow-500" },
  STARTED: { label: "En curso", color: "bg-blue-500/15 text-blue-500" },
  ROUND_IN_PROGRESS: { label: "Ronda activa", color: "bg-blue-500/15 text-blue-500" },
  ROUND_COMPLETE: { label: "Ronda completada", color: "bg-blue-500/10 text-blue-600" },
  FINISHED: { label: "Finalizado", color: "bg-purple-500/15 text-purple-500" },
  CLOSED: { label: "Cerrado", color: "bg-gray-500/15 text-[var(--muted-foreground)]" },
  CANCELLED: { label: "Cancelado", color: "bg-red-500/15 text-red-600" },
  PENDING_APPROVAL: { label: "Pendiente", color: "bg-orange-500/15 text-orange-500" },
};

function TournamentCard({ t, onClick }: { t: TournamentListItem; onClick: () => void }) {
  const st = STATUS_LABELS[t.status] ?? { label: t.status, color: "bg-gray-500/15 text-[var(--muted-foreground)]" };
  return (
    <div
      onClick={onClick}
      className="bg-[var(--card)] border border-[var(--surface)] rounded-2xl overflow-hidden cursor-pointer hover:border-[var(--brand)] hover:shadow-sm transition-all group"
    >
      <div className="h-24 relative bg-[var(--surface)]">
        {t.banner_url ? (
          <img src={t.banner_url} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Trophy className="h-10 w-10 text-[var(--border)]" />
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${st.color}`}>
            {st.label}
          </span>
        </div>
        {t.is_ranked && (
          <div className="absolute top-2 right-2">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-500">
              Ranked
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-[var(--foreground)] text-sm truncate mb-1">{t.name}</h3>
        <p className="text-[11px] text-[var(--muted-foreground)] mb-3">{t.game_name} · {t.format_name}</p>

        <div className="space-y-1.5 text-[11px] text-[var(--muted-foreground)]">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            <span className="capitalize">{format(new Date(t.starts_at), "d MMM yyyy, HH:mm", { locale: es })}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3 w-3" />
            <span>{t.current_players}{t.max_players ? ` / ${t.max_players}` : ""} jugadores</span>
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-3 w-3" />
            <span>{t.entry_fee > 0 ? `$${t.entry_fee.toLocaleString("es-CL")} CLP` : "Gratis"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TorneosPage() {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["my-tournaments"],
    queryFn: () => getMyTournaments({ per_page: 50 }),
    retry: 1,
  });

  const tournaments = data?.items ?? [];

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[var(--foreground)] tracking-tight flex items-center gap-3">
            <Trophy className="h-6 w-6 text-[var(--brand)]" />
            Mis Torneos
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            {isLoading ? "Cargando..." : `${tournaments.length} torneo${tournaments.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Button
          onClick={() => router.push("/panel/torneos/nuevo")}
          className="bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Torneo
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-52 rounded-2xl" />
          ))}
        </div>
      ) : tournaments.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-[var(--accent-subtle)] flex items-center justify-center mx-auto mb-4">
            <Trophy className="h-8 w-8 text-[var(--brand)]" />
          </div>
          <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">Sin torneos aún</h3>
          <p className="text-sm text-[var(--muted-foreground)] mb-6">
            Crea tu primer torneo y atrae jugadores a tu tienda.
          </p>
          <Button
            onClick={() => router.push("/panel/torneos/nuevo")}
            className="bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear Torneo
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tournaments.map((t) => (
            <TournamentCard
              key={t.id}
              t={t}
              onClick={() => router.push(`/panel/torneos/${t.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
