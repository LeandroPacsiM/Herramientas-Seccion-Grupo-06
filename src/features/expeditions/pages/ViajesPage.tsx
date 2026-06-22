import { useState, useEffect, useMemo } from "react";
import { Search, SlidersHorizontal, X, Map as MapIcon } from "lucide-react";
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

      <div className="flex flex-col lg:flex-row gap-8 items-start relative w-full">
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
    </main>
  );
}
