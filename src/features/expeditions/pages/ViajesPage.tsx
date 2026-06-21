import { useState, useEffect, useMemo } from "react";
import { Search, SlidersHorizontal, X, Map as MapIcon } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import Loading from "@/app/components/shared/Loading";
import { api } from "@/lib/api";
import type { Expedition } from "../types";
import ExpeditionCard from "../components/ExpeditionCard";
import ExpeditionMap from "../components/ExpeditionMap";

type Difficulty = "ALL" | "EASY" | "MODERATE" | "HARD";
type SortOption = "price-asc" | "price-desc" | "duration-asc" | "duration-desc";

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string }[] = [
  { value: "ALL", label: "Todos" },
  { value: "EASY", label: "Fácil" },
  { value: "MODERATE", label: "Moderado" },
  { value: "HARD", label: "Difícil" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "duration-asc", label: "Duración: más corto" },
  { value: "duration-desc", label: "Duración: más largo" },
];

export default function ViajesPage() {
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("ALL");
  const [location, setLocation] = useState("ALL");
  const [sort, setSort] = useState<SortOption>("price-asc");
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [showMapOnMobile, setShowMapOnMobile] = useState(false);

  useEffect(() => {
    api
      .get<Expedition[]>("/api/expeditions")
      .then(setExpeditions)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const locations = useMemo(() => {
    const locs = [...new Set(expeditions.map((e) => e.location))];
    return ["ALL", ...locs];
  }, [expeditions]);

  const filtered = useMemo(() => {
    let result = expeditions;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q)
      );
    }

    if (difficulty !== "ALL") {
      result = result.filter((e) => e.difficulty === difficulty);
    }

    if (location !== "ALL") {
      result = result.filter((e) => e.location === location);
    }

    result = [...result].sort((a, b) => {
      switch (sort) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "duration-asc": return a.durationDays - b.durationDays;
        case "duration-desc": return b.durationDays - a.durationDays;
      }
    });

    return result;
  }, [expeditions, search, difficulty, location, sort]);

  const activeFiltersCount = [
    difficulty !== "ALL",
    location !== "ALL",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setDifficulty("ALL");
    setLocation("ALL");
    setSort("price-asc");
    setSearch("");
  };

  return (
    <main className="flex-1 py-32 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <p className="text-brand font-bold tracking-widest uppercase text-sm mb-3">Catálogo</p>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-foreground">
            Encuentra tu <span className="text-brand">destino</span>
          </h1>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Buscar expedición..."
            className="rounded-full pl-12 bg-card border-border h-12"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="flex items-center gap-2 flex-wrap">
          {DIFFICULTY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDifficulty(opt.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                difficulty === opt.value
                  ? "bg-brand text-black"
                  : "bg-card border border-border text-muted-foreground hover:border-brand/40 hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="hidden sm:block h-6 w-px bg-border" />

        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="bg-card border border-border text-sm text-muted-foreground rounded-full px-4 py-1.5 outline-none hover:border-brand/40 focus:border-brand/60 transition-colors cursor-pointer"
        >
          <option value="ALL">Todas las zonas</option>
          {locations.slice(1).map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="bg-card border border-border text-sm text-muted-foreground rounded-full px-4 py-1.5 outline-none hover:border-brand/40 focus:border-brand/60 transition-colors cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {(activeFiltersCount > 0 || search) && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-brand transition-colors ml-auto"
          >
            <X size={14} />
            Limpiar filtros
            {activeFiltersCount > 0 && (
              <span className="bg-brand text-black text-xs rounded-full px-1.5 py-0.5 font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start relative w-full">
        {/* Left Side: Cards and filters / loading states */}
        <div className={`w-full lg:w-7/12 xl:w-8/12 ${showMapOnMobile ? "hidden" : "block"} lg:block`}>
          {!loading && !error && (
            <p className="text-muted-foreground text-sm mb-6">
              {filtered.length === 0
                ? "No se encontraron expediciones"
                : `${filtered.length} expedición${filtered.length !== 1 ? "es" : ""} disponible${filtered.length !== 1 ? "s" : ""}`}
            </p>
          )}

          {loading ? (
            <div className="flex justify-center py-24">
              <Loading />
            </div>
          ) : error ? (
            <div className="glass-panel p-12 rounded-2xl text-center">
              <p className="text-red-400">{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Reintentar
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="glass-panel p-16 rounded-2xl text-center space-y-4">
              <p className="text-5xl">🦙</p>
              <p className="text-foreground font-semibold">Sin resultados</p>
              <p className="text-muted-foreground">
                Ninguna expedición coincide con tu búsqueda. Intenta con otros filtros.
              </p>
              <Button variant="outline" onClick={clearFilters} className="mt-2">
                Ver todas las expediciones
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((expedition) => (
                <div
                  key={expedition.id}
                  id={`expedition-card-${expedition.id}`}
                  onMouseEnter={() => setHoveredId(expedition.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="transition-transform duration-200 hover:-translate-y-1"
                >
                  <ExpeditionCard expedition={expedition} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Map (shown side-by-side on desktop, toggled on mobile) */}
        {!loading && !error && filtered.length > 0 && (
          <>
            {/* Desktop sticky map */}
            <div className="hidden lg:block lg:w-5/12 xl:w-4/12 sticky top-28 h-[calc(100vh-160px)] min-h-[500px] rounded-2xl overflow-hidden border border-border shadow-xl">
              <ExpeditionMap
                expeditions={filtered}
                hoveredId={hoveredId}
                onMarkerClick={(id) => {
                  const el = document.getElementById(`expedition-card-${id}`);
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
              />
            </div>

            {/* Mobile/Tablet full screen toggle map */}
            <div className={`lg:hidden w-full h-[calc(100vh-280px)] rounded-2xl overflow-hidden border border-border shadow-lg ${showMapOnMobile ? "block" : "hidden"}`}>
              <ExpeditionMap
                expeditions={filtered}
                hoveredId={hoveredId}
              />
            </div>

            {/* Floating button for mobile devices */}
            <button
              onClick={() => setShowMapOnMobile(!showMapOnMobile)}
              className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-foreground text-background font-bold px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all text-sm cursor-pointer"
            >
              {showMapOnMobile ? (
                <>
                  <SlidersHorizontal size={16} />
                  Ver Lista
                </>
              ) : (
                <>
                  <MapIcon size={16} />
                  Ver Mapa
                </>
              )}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
