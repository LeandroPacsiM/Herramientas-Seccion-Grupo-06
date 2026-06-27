import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { ChevronLeft, MapPin, CalendarDays, Users, ShieldCheck } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import Loading from "@/app/components/shared/Loading";
import { useAuth } from "@/context/AuthContext";
import { bookingApi } from "@/features/bookings/services/bookingApi";
import { expeditionApi } from "@/features/expeditions/services/expeditionApi";
import { paymentApi } from "@/features/payment/services/paymentApi";
import type { Booking } from "@/features/bookings/types";
import type { Expedition } from "@/features/expeditions/types";

type PageStatus = "loading" | "ready" | "paying" | "success" | "error";

const BOOKING_STATUS_STEPS = [
  { key: "reserved", labelKey: "checkout.stepReserved" },
  { key: "pending", labelKey: "checkout.stepPending" },
  { key: "confirmed", labelKey: "checkout.stepConfirmed" },
];

export default function CheckoutPage() {
  const { t, i18n } = useTranslation();
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [status, setStatus] = useState<PageStatus>("loading");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [expedition, setExpedition] = useState<Expedition | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const formatDate = (dateStr: string) => {
    const localeMap: Record<string, string> = { es: "es-PE", en: "en-US", qu: "es-PE" };
    return new Date(dateStr).toLocaleDateString(localeMap[i18n.language] || "es-PE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate("/login?redirect=/checkout/" + bookingId);
      return;
    }
    if (!bookingId) {
      setStatus("error");
      setErrorMsg(t("checkout.invalidBooking"));
      return;
    }

    const id = parseInt(bookingId, 10);
    if (isNaN(id)) {
      setStatus("error");
      setErrorMsg(t("checkout.invalidBooking"));
      return;
    }

    bookingApi.getById(id)
      .then((b) => {
        if (b.status !== "PENDING") {
          if (b.status === "CONFIRMED") {
            navigate("/mis-reservas");
            return;
          }
          setStatus("error");
          setErrorMsg(t("checkout.bookingNotAvailable"));
          return;
        }
        setBooking(b);
        return expeditionApi.getById(b.expeditionId);
      })
      .then((exp) => {
        if (exp) setExpedition(exp);
        setStatus("ready");
      })
      .catch((err) => {
        setStatus("error");
        setErrorMsg(err.message || t("checkout.loadError"));
      });
  }, [bookingId, isAuthenticated, authLoading, navigate, t]);

  const handlePay = async () => {
    if (!booking) return;
    setStatus("paying");
    try {
      const { sessionUrl } = await paymentApi.createCheckoutSession(booking.id);
      window.location.href = sessionUrl;
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || t("checkout.payError"));
    }
  };

  if (status === "loading" || authLoading) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-screen">
        <Loading />
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="flex-1 flex flex-col items-center justify-center py-32 px-4 gap-6">
        <p className="text-7xl">🦙</p>
        <h1 className="text-2xl font-bold text-foreground">{t("checkout.errorTitle")}</h1>
        <p className="text-muted-foreground text-sm">{errorMsg}</p>
        <Link to="/mis-reservas">
          <Button variant="outline">{t("checkout.backToBookings")}</Button>
        </Link>
      </main>
    );
  }

  if (status === "success") {
    return (
      <main className="flex-1 flex items-center justify-center min-h-screen px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <p className="text-emerald-400 font-semibold text-lg">{t("checkout.paySuccessTitle")}</p>
          <p className="text-muted-foreground text-sm">{t("checkout.redirecting")}</p>
        </div>
      </main>
    );
  }

  if (!booking || !expedition) return null;

  const heroImage = expedition.images?.[0]?.url;

  return (
    <main className="flex-1 pt-24 pb-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12">
        <Link
          to="/mis-reservas"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand transition-colors mb-8"
        >
          <ChevronLeft size={16} />
          {t("checkout.backToBookings")}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 space-y-8">
            {/* Quipu progress */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between">
                {BOOKING_STATUS_STEPS.map((step, idx) => {
                  const isActive = step.key === "pending";
                  const isPast = step.key === "reserved";
                  return (
                    <div key={step.key} className="flex items-center gap-0 flex-1">
                      <div className="flex flex-col items-center gap-1.5">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                            isPast
                              ? "bg-brand/20 border-brand text-brand"
                              : isActive
                                ? "bg-brand border-brand text-black"
                                : "bg-muted border-border text-muted-foreground"
                          }`}
                        >
                          {isPast ? <CheckIcon /> : idx + 1}
                        </div>
                        <span
                          className={`text-[10px] text-center leading-tight max-w-[70px] ${
                            isActive ? "text-brand font-semibold" : "text-muted-foreground"
                          }`}
                        >
                          {t(step.labelKey)}
                        </span>
                      </div>
                      {idx < BOOKING_STATUS_STEPS.length - 1 && (
                        <div
                          className={`flex-1 h-[2px] mx-2 mt-[-18px] ${
                            isPast ? "bg-brand" : "bg-border"
                          }`}
                          style={{
                            background: isPast
                              ? "repeating-linear-gradient(90deg, var(--brand) 0, var(--brand) 4px, transparent 4px, transparent 8px)"
                              : undefined,
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hero image */}
            {heroImage && (
              <div className="rounded-2xl overflow-hidden bg-muted aspect-video">
                <img
                  src={heroImage}
                  alt={expedition.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Expedition info */}
            <div>
              <h1
                className="text-3xl sm:text-4xl text-foreground mb-3"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontWeight: 400 }}
              >
                {expedition.name}
              </h1>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-brand" />
                  {expedition.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={14} className="text-brand" />
                  {formatDate(booking.startDate)}
                  {booking.startDate !== booking.endDate && <> → {formatDate(booking.endDate)}</>
}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={14} className="text-brand" />
                  {booking.peopleCount === 1
                    ? t("bookings.person_one", { count: 1 })
                    : t("bookings.person_other", { count: booking.peopleCount })}
                </span>
              </div>

              <p className="text-muted-foreground leading-relaxed mt-4 text-sm">
                {expedition.description}
              </p>
            </div>

            {/* Itinerary preview */}
            {expedition.itineraries.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-foreground mb-4">{t("checkout.itineraryPreview")}</h2>
                <div className="relative">
                  <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-border" />
                  <div className="space-y-4">
                    {expedition.itineraries.slice(0, 3).map((day) => (
                      <div key={day.id} className="relative flex gap-4">
                        <div className="relative z-10 flex-shrink-0 w-5 h-5 rounded-full bg-brand/20 border border-brand/40 flex items-center justify-center mt-0.5">
                          <span className="text-brand font-bold text-[10px]">{day.dayNumber}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-foreground font-medium text-sm">{day.title}</p>
                          <p className="text-muted-foreground text-xs leading-relaxed mt-0.5 line-clamp-2">
                            {day.description}
                          </p>
                        </div>
                      </div>
                    ))}
                    {expedition.itineraries.length > 3 && (
                      <p className="text-xs text-muted-foreground pl-9">
                        {t("checkout.moreDays", { count: expedition.itineraries.length - 3 })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment card */}
          <div className="lg:col-span-2">
            <div className="sticky top-28 space-y-4">
              <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <img
                    src={import.meta.env.BASE_URL + "assets/img/icons/llama.png"}
                    alt="LlamaTOURS"
                    className="w-10 h-10"
                  />
                  <div>
                    <p className="text-foreground font-bold">LlamaTOURS</p>
                    <p className="text-muted-foreground text-xs">{t("checkout.paymentSummary")}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("checkout.pricePerPerson")}</span>
                    <span className="text-foreground">${expedition.price.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("checkout.people")}</span>
                    <span className="text-foreground">{booking.peopleCount}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="text-foreground font-semibold">{t("checkout.total")}</span>
                    <span
                      className="text-xl font-bold"
                      style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: "var(--brand)" }}
                    >
                      ${(expedition.price * booking.peopleCount).toFixed(2)} USD
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full h-12 font-bold text-base bg-brand text-black hover:bg-brand/80 transition-all"
                  onClick={handlePay}
                  disabled={status === "paying"}
                >
                  {status === "paying" ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      {t("checkout.paying")}
                    </span>
                  ) : (
                    t("checkout.confirmAndPay", { price: (expedition.price * booking.peopleCount).toFixed(0) })
                  )}
                </Button>

                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck size={12} />
                  {t("checkout.securePayment")}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5 text-center space-y-2">
                <p className="text-xs text-muted-foreground">{t("checkout.cancelPolicy")}</p>
                <Link to="/contacto">
                  <Button variant="outline" className="w-full text-xs h-9">
                    {t("checkout.needHelp")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}
