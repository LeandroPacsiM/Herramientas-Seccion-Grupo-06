import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import {
  MapPin, Clock, Users, ChevronLeft, ChevronRight,
  Calendar, Flame, Leaf, Zap, CheckCircle, Minus, Plus, LogIn, AlertCircle
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import Loading from "@/app/components/shared/Loading";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import type { Booking } from "@/features/bookings/types";
import type { Expedition, Availability } from "@/features/expeditions/types";

const DIFFICULTY_CONFIG = {
  EASY: { icon: Leaf, className: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" },
  MODERATE: { icon: Zap, className: "bg-amber-500/15 text-amber-400 border border-amber-500/20" },
  HARD: { icon: Flame, className: "bg-red-500/15 text-red-400 border border-red-500/20" },
};

function SpotsBar({ availability }: { availability: Availability }) {
  const pct = (availability.availableSpots / availability.capacity) * 100;
  const color = pct > 50 ? "bg-emerald-500" : pct > 20 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="h-1.5 rounded-full bg-muted overflow-hidden mt-2">
      <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function ExpeditionDetailPage() {
  const { t, i18n } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [expedition, setExpedition] = useState<Expedition | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const [selectedAvailability, setSelectedAvailability] = useState<number | null>(null);
  const [peopleCount, setPeopleCount] = useState(1);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const navigate = useNavigate();

  const formatDate = (dateStr: string) => {
    const localeMap: Record<string, string> = { es: "es-PE", en: "en-US", qu: "es-PE" };
    return new Date(dateStr).toLocaleDateString(localeMap[i18n.language] || "es-PE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    api.get<Expedition[]>("/api/expeditions").then((list) => {
      const found = list.find((e) => e.slug === slug) ?? null;
      setExpedition(found);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    setPeopleCount(1);
    setBookingError(null);
  }, [selectedAvailability]);

  if (loading || authLoading) {
    return <div className="flex justify-center items-center h-screen"><Loading /></div>;
  }

  if (!expedition) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center py-32 px-4 gap-6">
        <p className="text-6xl">🦙</p>
        <h1 className="text-2xl font-bold text-foreground">{t("expeditionDetail.notFound", "Expedición no encontrada")}</h1>
        <Link to="/viajes"><Button variant="outline">{t("expeditionDetail.viewCatalog", "Ver catálogo")}</Button></Link>
      </main>
    );
  }

  const { icon: DiffIcon, className: diffClass } = DIFFICULTY_CONFIG[expedition.difficulty];
  const diffKey = expedition.difficulty === "EASY" ? "Easy" : expedition.difficulty === "MODERATE" ? "Moderate" : "Hard";
  const diffLabel = t(`viajes.difficulty${diffKey}`);

  const sortedAvailabilities = [...expedition.availabilities].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
  const selected = expedition.availabilities.find((a) => a.id === selectedAvailability);
  const maxPeople = selected?.availableSpots ?? 1;
  const totalPrice = expedition.price * peopleCount;

  const prevImage = () => setActiveImage((i) => (i - 1 + expedition.images.length) % expedition.images.length);
  const nextImage = () => setActiveImage((i) => (i + 1) % expedition.images.length);

  const handleReservar = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/viajes/${slug}`);
      return;
    }
    if (!selectedAvailability) return;

    setBookingLoading(true);
    setBookingError(null);

    try {
      const result = await api.post<Booking>("/api/bookings", {
        availabilityId: selectedAvailability,
        peopleCount,
      });
      const av = expedition.availabilities.find((a) => a.id === selectedAvailability);
      if (av) av.availableSpots -= peopleCount;
      navigate(`/checkout/${result.id}`);
    } catch (err: any) {
      setBookingError(err.message || t("expeditionDetail.bookingError", "No se pudo completar la reserva. Intenta de nuevo."));
    } finally {
      setBookingLoading(false);
    }
  };

  const canReserve = !!selectedAvailability && peopleCount >= 1 && peopleCount <= maxPeople;

  return (
    <main className="flex-1 pt-24 pb-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12 mb-6">
        <Link
          to="/viajes"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand transition-colors"
        >
          <ChevronLeft size={16} />
          {t("expeditionDetail.back")}
        </Link>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

        <div className="lg:col-span-2 space-y-8">

          <div className="relative rounded-2xl overflow-hidden bg-muted aspect-video">
            <img
              key={activeImage}
              src={expedition.images[activeImage]?.url}
              alt={t(`expeditions.${expedition.slug}.name`, expedition.name)}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

            {expedition.images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors">
                  <ChevronRight size={20} />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {expedition.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`h-2 rounded-full transition-all ${i === activeImage ? "bg-brand w-5" : "bg-white/50 hover:bg-white/80 w-2"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full ${diffClass}`}>
                <DiffIcon size={14} />{diffLabel}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground bg-card border border-border px-3 py-1 rounded-full">
                <Clock size={14} />
                {expedition.durationDays === 1
                  ? t("expeditionCard.days_one", { count: 1 })
                  : t("expeditionCard.days_other", { count: expedition.durationDays })}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground bg-card border border-border px-3 py-1 rounded-full">
                <MapPin size={14} />{t(`expeditions.${expedition.slug}.location`, expedition.location)}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">{t(`expeditions.${expedition.slug}.name`, expedition.name)}</h1>
            <p className="text-muted-foreground leading-relaxed">{t(`expeditions.${expedition.slug}.description`, expedition.description)}</p>
          </div>

          {expedition.itineraries.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-6">{t("expeditionDetail.itinerary")}</h2>
              <div className="relative">
                <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
                <div className="space-y-6">
                  {expedition.itineraries.map((day) => (
                    <div key={day.id} className="relative flex gap-5">
                      <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-brand/10 border border-brand/30 flex items-center justify-center">
                        <span className="text-brand font-bold text-sm">{day.dayNumber}</span>
                      </div>
                      <div className="bg-card border border-border rounded-xl p-4 flex-1">
                        <h3 className="text-foreground font-semibold mb-1">
                          {t(`expeditions.${expedition.slug}.itinerary.${day.dayNumber}.title`, day.title)}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {t(`expeditions.${expedition.slug}.itinerary.${day.dayNumber}.description`, day.description)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="sticky top-28 space-y-4">

            <div className="bg-card border border-border rounded-2xl p-6">
              <p className="text-muted-foreground text-sm mb-1">{t("expeditionDetail.pricePerPerson")}</p>
              <p className="text-brand font-extrabold text-4xl">
                ${expedition.price.toFixed(0)}
                <span className="text-muted-foreground font-normal text-base ml-1">USD</span>
              </p>
              <p className="text-muted-foreground text-xs mt-1">{t("expeditionDetail.allIncluded")}</p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
              <h2 className="text-foreground font-bold flex items-center gap-2">
                <Calendar size={18} className="text-brand" />
                {t("expeditionDetail.bookTitle")}
              </h2>

              {sortedAvailabilities.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("expeditionDetail.noAvailability")}</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{t("expeditionDetail.selectDate")}</p>
                  {sortedAvailabilities.map((av) => {
                    const isExpired = new Date(av.startDate) < new Date(new Date().setHours(0, 0, 0, 0));
                    const isSoldOut = av.availableSpots <= 0;
                    const isDisabled = isExpired || isSoldOut;

                    let statusLabel = "";
                    if (isExpired) {
                      statusLabel = ` - ${t("expeditionDetail.expiredStatus")}`;
                    } else if (isSoldOut) {
                      statusLabel = ` - ${t("expeditionDetail.soldOutStatus")}`;
                    }

                    return (
                      <button
                        key={av.id}
                        disabled={isDisabled}
                        onClick={() => setSelectedAvailability(av.id === selectedAvailability ? null : av.id)}
                        className={`w-full text-left rounded-xl border p-3.5 transition-all ${
                          isDisabled
                            ? "opacity-50 cursor-not-allowed border-border bg-muted/20"
                            : selectedAvailability === av.id
                              ? "border-brand bg-brand/5 cursor-pointer"
                              : "border-border hover:border-brand/40 bg-background cursor-pointer"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm font-medium ${isDisabled ? "text-muted-foreground line-through" : "text-foreground"}`}>
                            {formatDate(av.startDate)}
                            {av.startDate !== av.endDate && (
                              <span className="text-muted-foreground font-normal"> → {formatDate(av.endDate)}</span>
                            )}
                            {statusLabel && <span className="text-red-400 font-semibold ml-2 text-xs">{statusLabel}</span>}
                          </span>
                          {selectedAvailability === av.id && <CheckCircle size={15} className="text-brand" />}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users size={11} />
                          {t("expeditionDetail.spotsLeft", { available: av.availableSpots, capacity: av.capacity, count: av.availableSpots })}
                        </div>
                        <SpotsBar availability={av} />
                      </button>
                    );
                  })}
                </div>
              )}

              {selectedAvailability && !booking && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{t("expeditionDetail.peopleCount")}</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setPeopleCount((n) => Math.max(1, n - 1))}
                      disabled={peopleCount <= 1}
                      className="w-9 h-9 rounded-full border border-border bg-background flex items-center justify-center text-foreground hover:border-brand/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-foreground font-semibold w-8 text-center">{peopleCount}</span>
                    <button
                      onClick={() => setPeopleCount((n) => Math.min(maxPeople, n + 1))}
                      disabled={peopleCount >= maxPeople}
                      className="w-9 h-9 rounded-full border border-border bg-background flex items-center justify-center text-foreground hover:border-brand/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                    <span className="text-muted-foreground text-xs ml-1">
                      {maxPeople === 1
                        ? t("expeditionDetail.maxPeople_one", { count: 1 })
                        : t("expeditionDetail.maxPeople_other", { count: maxPeople })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-brand/5 border border-brand/20 px-4 py-3 mt-1">
                    <span className="text-sm text-muted-foreground">{t("expeditionDetail.total")}</span>
                    <span className="text-brand font-bold">
                      ${totalPrice.toFixed(0)} USD
                    </span>
                  </div>
                </div>
              )}

              {bookingError && (
                <div className="flex items-start gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  {bookingError}
                </div>
              )}

              {booking ? (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-emerald-400" />
                    <p className="text-emerald-400 font-semibold text-sm">{t("expeditionDetail.bookingSuccess")}</p>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1 pt-1">
                    <p>📅 {formatDate(booking.startDate)}{booking.startDate !== booking.endDate ? ` → ${formatDate(booking.endDate)}` : ""}</p>
                    <p>👥 {booking.peopleCount} {booking.peopleCount === 1 ? t("bookings.person_one", { count: 1 }) : t("bookings.person_other", { count: booking.peopleCount })}</p>
                    <p>💰 ${(expedition.price * booking.peopleCount).toFixed(0)} USD total</p>
                  </div>
                  <Link to="/mis-reservas" className="block mt-2">
                    <Button variant="outline" className="w-full text-xs h-8">{t("expeditionDetail.viewBookings")}</Button>
                  </Link>
                </div>
              ) : !isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-2 rounded-xl bg-brand/5 border border-brand/20 p-3 text-sm text-muted-foreground">
                    <LogIn size={15} className="text-brand flex-shrink-0 mt-0.5" />
                    {t("expeditionDetail.loginToBookDesc")}
                  </div>
                  <Link to={`/login?redirect=/viajes/${slug}`}>
                    <Button className="w-full font-bold h-11">
                      <LogIn size={16} className="mr-2" />
                      {t("expeditionDetail.loginToBookButton")}
                    </Button>
                  </Link>
                </div>
              ) : (
                <Button
                  className="w-full font-bold h-11"
                  disabled={!canReserve || bookingLoading}
                  onClick={handleReservar}
                >
                  {bookingLoading ? (
                    <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />{t("expeditionDetail.bookingLoading")}</>
                  ) : canReserve ? (
                    t("expeditionDetail.bookButton", { price: totalPrice.toFixed(0) })
                  ) : (
                    t("expeditionDetail.selectDateAndPeople")
                  )}
                </Button>
              )}

              <p className="text-xs text-muted-foreground text-center">
                {t("expeditionDetail.cancelPolicy")}
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 text-center space-y-3">
              <p className="text-sm text-muted-foreground">{t("expeditionDetail.customExpedition")}</p>
              <Link to="/contacto" className="block">
                <Button variant="outline" className="w-full">{t("expeditionDetail.contactGuide")}</Button>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
