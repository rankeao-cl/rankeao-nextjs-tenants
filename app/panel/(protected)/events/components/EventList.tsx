"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
}

interface EventListProps {
  events: Event[];
  isLoading: boolean;
}

const getEventStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case "ACTIVE":
    case "IN_PROGRESS":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "UPCOMING":
    case "SCHEDULED":
      return "bg-sky-500/10 text-sky-500 border-sky-500/20";
    case "CANCELLED":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    case "COMPLETED":
      return "bg-[var(--c-gray-50)] text-[var(--c-gray-500)] border-[var(--c-gray-200)]";
    default:
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
  }
};

const formatEventDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};

const formatEventTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function EventList({ events, isLoading }: EventListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(3).fill(0).map((_, i) => (
          <Card key={i} className="bg-white border-[var(--c-gray-200)] rounded-2xl overflow-hidden h-[240px]">
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-6 w-3/4 rounded-lg" />
              <Skeleton className="h-4 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <Card className="bg-[#ffffff] border border-[var(--c-gray-200)] rounded-2xl border-dashed">
        <CardContent className="p-20 text-center flex flex-col items-center gap-4">
           <div className="p-4 rounded-full bg-[var(--c-gray-50)]">
              <Calendar className="h-10 w-10 text-[var(--c-gray-300)]" />
           </div>
           <p className="text-[var(--c-gray-500)] font-medium max-w-xs">No hay eventos activos. Los eventos te ayudan a fidelizar a tu comunidad.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card key={event.id} className="bg-white border-[var(--c-gray-200)] rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-[var(--c-navy-500)]/30 transition-all group">
          <CardContent className="p-0">
            {/* Header with status */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getEventStatusColor(event.status)}`}>
                  {event.status}
                </span>
                <p className="text-[11px] text-[var(--c-gray-400)] font-medium">Ref: {event.id}</p>
              </div>
              <h3 className="text-xl font-bold text-[var(--c-gray-800)] line-clamp-2 min-h-[3.5rem] leading-tight group-hover:text-[var(--c-navy-500)] transition-colors">
                {event.title}
              </h3>
            </div>

            <div className="px-6 pb-6 space-y-4">
               {/* Date & Time */}
               <div className="flex flex-col gap-2 p-3 rounded-xl bg-[var(--c-gray-50)]/50 border border-[var(--c-gray-100)]">
                  <div className="flex items-center gap-2 text-[var(--c-gray-600)]">
                    <Calendar className="h-4 w-4 text-[var(--c-navy-500)]" />
                    <p className="text-xs font-bold capitalize">{formatEventDate(event.start_date)}</p>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--c-gray-500)]">
                    <Clock className="h-4 w-4 text-[var(--c-cyan-500)]" />
                    <p className="text-xs font-medium">
                      {formatEventTime(event.start_date)} - {formatEventTime(event.end_date)}
                    </p>
                  </div>
               </div>

               <p className="text-sm text-[var(--c-gray-500)] line-clamp-2 leading-relaxed">
                 {event.description}
               </p>

               <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center -space-x-2">
                    {/* Placeholder for participant avatars */}
                    {[1,2,3].map(i => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-[var(--c-gray-200)] flex items-center justify-center text-[8px] font-bold text-[var(--c-gray-500)]">
                        +
                      </div>
                    ))}
                    <span className="ml-3 text-[10px] font-bold text-[var(--c-navy-500)]">12 Inscritos</span>
                  </div>
                  <button className="text-xs font-bold text-[var(--c-navy-500)] hover:underline">
                    Gestionar →
                  </button>
               </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
