import { Link } from "react-router";
import { MapPin, Clock, Users, ChevronRight, Flame, Leaf, Zap } from "lucide-react";
import type { Expedition } from "../types";

const DIFFICULTY_CONFIG = {
  EASY: { label: "Fácil", icon: Leaf, className: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" },
  MODERATE: { label: "Moderado", icon: Zap, className: "bg-amber-500/15 text-amber-400 border border-amber-500/20" },
  HARD: { label: "Difícil", icon: Flame, className: "bg-red-500/15 text-red-400 border border-red-500/20" },
};

interface ExpeditionCardProps {
  expedition: Expedition;
}

export default function ExpeditionCard({ expedition }: ExpeditionCardProps) {
  const { label, icon: DiffIcon, className: diffClass } = DIFFICULTY_CONFIG[expedition.difficulty];
  const coverImage = expedition.images[0]?.url ?? "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800";
  const nextAvailability = expedition.availabilities.find((a) => a.availableSpots > 0);
  const totalSpots = nextAvailability?.capacity ?? 0;
  const availableSpots = nextAvailability?.availableSpots ?? 0;
  const spotsPercent = totalSpots > 0 ? (availableSpots / totalSpots) * 100 : 0;

  return (
    <Link
      to={`/viajes/${expedition.slug}`}
      className="group block bg-card border border-border rounded-2xl overflow-hidden hover:border-brand/40 transition-all duration-300 hover:shadow-xl hover:shadow-brand/5 hover:-translate-y-1"
    >
      <div className="relative h-52 overflow-hidden bg-muted">
        <img
          src={coverImage}
          alt={expedition.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <span className={`absolute top-3 left-3 inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${diffClass}`}>
          <DiffIcon size={11} />
          {label}
        </span>

        <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-black/50 text-white border border-white/10">
          <Clock size={11} />
          {expedition.durationDays === 1 ? "1 día" : `${expedition.durationDays} días`}
        </span>
      </div>

      <div className="p-5 space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-card-foreground font-semibold leading-snug group-hover:text-brand transition-colors line-clamp-2">
              {expedition.name}
            </h3>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <MapPin size={13} />
            <span>{expedition.location}</span>
          </div>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
          {expedition.description}
        </p>

        {nextAvailability ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users size={12} />
                {availableSpots} cupos disponibles
              </span>
              <span>{new Date(nextAvailability.startDate).toLocaleDateString("es-PE", { month: "short", day: "numeric" })}</span>
            </div>
            <div className="h-1 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-brand transition-all"
                style={{ width: `${spotsPercent}%` }}
              />
            </div>
          </div>
        ) : (
          <p className="text-xs text-red-400">Sin disponibilidad próxima</p>
        )}

        <div className="flex items-center justify-between pt-1 border-t border-border">
          <div>
            <span className="text-muted-foreground text-xs">Desde</span>
            <p className="text-brand font-bold text-lg leading-none">
              ${expedition.price.toFixed(0)}
              <span className="text-muted-foreground font-normal text-xs ml-1">USD</span>
            </p>
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-brand group-hover:gap-2 transition-all">
            Ver detalle <ChevronRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
