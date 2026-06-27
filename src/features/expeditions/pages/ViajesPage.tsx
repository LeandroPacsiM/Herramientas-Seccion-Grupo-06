import { useState, useEffect, useMemo } from "react";
import { Search, SlidersHorizontal, X, Map as MapIcon, Star, MessageSquare, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import Loading from "@/app/components/shared/Loading";
import { api } from "@/lib/api";
import type { Expedition } from "../types";
import ExpeditionCard from "../components/ExpeditionCard";
import ExpeditionMap from "../components/ExpeditionMap";

type Difficulty = "ALL" | "EASY" | "MODERATE" | "HARD";
type SortOption = "price-asc" | "price-desc" | "duration-asc" | "duration-desc";

export default function ViajesPage() {
  const { t } = useTranslation();
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("ALL");
  const [location, setLocation] = useState("ALL");
  const [sort, setSort] = useState<SortOption>("price-asc");
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [showMapOnMobile, setShowMapOnMobile] = useState(false);

  // Estados para el formulario de opiniones y el libro de reclamaciones
  const [rating, setRating] = useState(5);
  const [showReclamaciones, setShowReclamaciones] = useState(false);

  const DIFFICULTY_OPTIONS = useMemo(() => [
    { value: "ALL" as Difficulty, label: t("viajes.allDifficulties") },
    { value: "EASY" as Difficulty, label: t("viajes.difficultyEasy") },
    { value: "MODERATE" as Difficulty, label: t("viajes.difficultyModerate") },
    { value: "HARD" as Difficulty, label: t("viajes.difficultyHard") },
  ], [t]);

  const SORT_OPTIONS = useMemo(() => [
    { value: "price-asc" as SortOption, label: t("viajes.priceAsc") },
    { value: "price-desc" as SortOption, label: t("viajes.priceDesc") },
    { value: "duration-asc" as SortOption, label: t("viajes.durationAsc") },
    { value: "duration-desc" as SortOption, label: t("viajes.durationDesc") },
  ], [t]);

  useEffect(() => {
    api
      .get<Expedition[]>("/api/expeditions")
      .then(setExpeditions)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const locations = useMemo(() => {
    const translatedLocs = expeditions.map((e) => t(`expeditions.${e.slug}.location`, e.location));
    const locs = [...new Set(translatedLocs)];
    return ["ALL", ...locs];
  }, [expeditions, t]);

  const filtered = useMemo(() => {
    let result = expeditions;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          t(`expeditions.${e.slug}.name`, e.name).toLowerCase().includes(q) ||
          t(`expeditions.${e.slug}.description`, e.description).toLowerCase().includes(q) ||
          t(`expeditions.${e.slug}.location`, e.location).toLowerCase().includes(q)
      );
    }

    if (difficulty !== "ALL") {
      result = result.filter((e) => e.difficulty === difficulty);
    }

    if (location !== "ALL") {
      result = result.filter((e) => t(`expeditions.${e.slug}.location`, e.location) === location);
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
  }, [expeditions, search, difficulty, location, sort, t]);

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
          <p className="text-brand font-bold tracking-widest uppercase text-sm mb-3">{t("viajes.catalog")}</p>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-foreground">
            {t("viajes.titlePart1")} <span className="text-brand">{t("viajes.titlePart2")}</span>
          </h1>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder={t("viajes.searchPlaceholder")}
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
          <option value="ALL">{t("viajes.allZones")}</option>
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
            {t("viajes.clearFilters")}
            {activeFiltersCount > 0 && (
              <span className="bg-brand text-black text-xs rounded-full px-1.5 py-0.5 font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start relative w-full mb-16">
        {/* Left Side: Cards and filters / loading states */}
        <div className={`w-full lg:w-7/12 xl:w-8/12 ${showMapOnMobile ? "hidden" : "block"} lg:block`}>
          {!loading && !error && (
            <p className="text-muted-foreground text-sm mb-6">
              {filtered.length === 0
                ? t("viajes.noExpeditions")
                : filtered.length === 1
                  ? t("viajes.expeditionCount_one", { count: 1 })
                  : t("viajes.expeditionCount_other", { count: filtered.length })}
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
                {t("viajes.retry")}
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="glass-panel p-16 rounded-2xl text-center space-y-4">
              <p className="text-5xl">🦙</p>
              <p className="text-foreground font-semibold">{t("viajes.noResults")}</p>
              <p className="text-muted-foreground">
                {t("viajes.noResultsDesc")}
              </p>
              <Button variant="outline" onClick={clearFilters} className="mt-2">
                {t("viajes.viewAll")}
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

        {/* Right Side: Map (corregido para cerrarse correctamente sin condicionar el final de la página) */}
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
                onMarkerClick={() => {}}
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
                  {t("viajes.viewList")}
                </>
              ) : (
                <>
                  <MapIcon size={16} />
                  {t("viajes.viewMap")}
                </>
              )}
            </button>
          </>
        )}
      </div>

      {/* ======================================================================= */}
      {/* NUEVA INTEGRACIÓN COMPLEMENTARIA: OPINIONES Y LIBRO DE RECLAMACIONES    */}
      {/* ======================================================================= */}
      <hr className="border-border my-12" />
      
      <div className="space-y-6">
        <div>
          <p className="text-brand font-bold tracking-widest uppercase text-xs mb-1">Feedback del Usuario</p>
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="text-brand" size={24} /> Experiencias y Soporte
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Módulo de investigación propuesto para la recolección de métricas de satisfacción y cumplimiento legal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formulario de Calificación */}
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-foreground mb-4">⭐ Califica tu Expedición</h3>
            <form onSubmit={(e) => { e.preventDefault(); alert("¡Muchas gracias! Tu opinión ha sido guardada en el entorno de desarrollo."); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Selecciona el Viaje realizado:</label>
                <select className="w-full p-2.5 rounded-lg bg-background border border-border text-foreground text-sm outline-none focus:border-brand" required>
                  <option value="">-- Elige un destino --</option>
                  <option value="1">Cusco & Machu Picchu Místico</option>
                  <option value="2">Lago Titicaca e Islas Flotantes</option>
                  <option value="3">Aventura en las Dunas de Huacachina</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Tu Puntuación:</label>
                <div className="flex gap-1 text-2xl text-amber-400 cursor-pointer">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRating(star)}>
                      {star <= rating ? "★" : "☆"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Cuéntanos tu experiencia:</label>
                <textarea 
                  className="w-full p-2.5 rounded-lg bg-background border border-border text-foreground text-sm outline-none focus:border-brand" 
                  rows={3} 
                  placeholder="¿Qué te pareció el itinerario, los transportes y la atención del guía?" 
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-brand text-black font-bold hover:bg-brand/90 rounded-lg">
                Enviar Comentario
              </Button>
            </form>
          </div>

          {/* Historial Simulado de Comentarios */}
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-foreground">👥 Reseñas de la Comunidad</h3>
            
            <div className="border-l-2 border-brand pl-3 py-1 space-y-1 bg-background/50 p-3 rounded-r-lg">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-foreground">Carlos Mendoza</span>
                <span className="text-amber-400">★★★★★</span>
              </div>
              <p className="text-xs text-muted-foreground">Destino: Cusco & Machu Picchu Místico</p>
              <p className="text-sm text-foreground/90">¡Excelente organización! El software se adaptó de maravilla y las ayudas de accesibilidad visual nos facilitaron todo el viaje.</p>
            </div>

            <div className="border-l-2 border-brand pl-3 py-1 space-y-1 bg-background/50 p-3 rounded-r-lg">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-foreground">Ana Bartra</span>
                <span className="text-amber-400">★★★★☆</span>
              </div>
              <p className="text-xs text-muted-foreground">Destino: Dunas de Huacachina</p>
              <p className="text-sm text-foreground/90">Súper divertido el sandboarding en las dunas de Ica. El buggy llegó puntual, aunque el sol estuvo fuertísimo. Recomendado.</p>
            </div>
          </div>
        </div>

        {/* Módulo Regulatorio: Libro de Reclamaciones INDECOPI */}
        <div className="border border-red-500/30 bg-red-500/5 p-6 rounded-2xl text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-red-400 font-bold">
            <BookOpen size={20} />
            <h3>Libro de Reclamaciones Virtual</h3>
          </div>
          <p className="text-muted-foreground text-xs max-w-xl mx-auto">
            Conforme al Código de Protección y Defensa del Consumidor de Perú. Ponemos a su disposición esta herramienta para registrar cualquier disconformidad.
          </p>
          <Button 
            variant="outline" 
            onClick={() => setShowReclamaciones(!showReclamaciones)}
            className="border-red-500/40 text-red-400 hover:bg-red-500/10 hover:text-red-300 text-xs rounded-full"
          >
            {showReclamaciones ? "Ocultar Formulario" : "Abrir Hoja de Reclamación"}
          </Button>

          {showReclamaciones && (
            <div className="mt-6 text-left bg-card border border-border p-5 rounded-xl space-y-4 max-w-2xl mx-auto animate-in fade-in-50 duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Nombre y Apellidos:</label>
                  <input type="text" className="w-full p-2 bg-background border border-border rounded text-sm text-foreground outline-none" placeholder="Juan Pérez" />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Documento de Identidad (DNI/CE):</label>
                  <input type="text" className="w-full p-2 bg-background border border-border rounded text-sm text-foreground outline-none" placeholder="00000000" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Tipo de Incidencia:</label>
                <select className="w-full p-2 bg-background border border-border rounded text-sm text-foreground outline-none">
                  <option>Reclamo (Disconformidad relacionada directamente con los servicios turísticos)</option>
                  <option>Queja (Descontento referente a la atención brindada por el personal)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Descripción clara del hecho:</label>
                <textarea className="w-full p-2 bg-background border border-border rounded text-sm text-foreground outline-none" rows={4} placeholder="Detalle lo ocurrido de la manera más descriptiva posible..." />
              </div>
              <div className="flex justify-end">
                <Button 
                  type="button" 
                  onClick={() => { alert("Reclamación registrada exitosamente de forma local. Se enviará una copia digital al correo asignado."); setShowReclamaciones(false); }}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs py-2 px-4 rounded"
                >
                  Registrar Hoja de Reclamación
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
