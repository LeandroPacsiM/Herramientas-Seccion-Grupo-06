import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { CalendarCheck, Users, X, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import Loading from "@/app/components/shared/Loading";
import { api } from "@/lib/api";
import type { Booking } from "../types";

const STATUS_CONFIG = {
  CONFIRMED: { className: "text-emerald-400 bg-emerald-500/10", icon: CheckCircle },
  PENDING: { className: "text-amber-400 bg-amber-500/10", icon: Clock },
  CANCELLED: { className: "text-red-400 bg-red-500/10", icon: X },
};

const EXPEDITION_SLUGS: Record<number, string> = {
  1: "camino-inca-clasico",
  2: "montana-7-colores",
  3: "ausangate-trek",
  4: "salkantay-trek",
  5: "huayhuash-circuit",
  6: "laguna-69",
  7: "choquequirao-trek",
  8: "glaciar-pastoruri",
  9: "lares-trek",
  10: "santa-cruz-trek",
};

export default function MisReservasPage() {
  const { t, i18n } = useTranslation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (dateStr: string) => {
    const localeMap: Record<string, string> = { es: "es-PE", en: "en-US", qu: "es-PE" };
    return new Date(dateStr).toLocaleDateString(localeMap[i18n.language] || "es-PE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getTranslatedName = (booking: Booking) => {
    const slug = EXPEDITION_SLUGS[booking.expeditionId];
    return slug ? t(`expeditions.${slug}.name`, booking.expeditionName) : booking.expeditionName;
  };

  useEffect(() => {
    api.get<Booking[]>("/api/bookings")
      .then(setBookings)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id: number) => {
    setCancellingId(id);
    try {
      await api.post(`/api/bookings/${id}/cancel`);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "CANCELLED" as const } : b))
      );
    } catch (e: any) {
      setError(e.message || t("bookings.cancelError", "Error al cancelar"));
    } finally {
      setCancellingId(null);
    }
  };

  const active = bookings.filter((b) => b.status !== "CANCELLED");
  const cancelled = bookings.filter((b) => b.status === "CANCELLED");

  return (
    <main className="flex-1 py-32 px-4 sm:px-6 lg:px-12 max-w-[1200px] mx-auto">
      <div className="mb-10">
        <p className="text-brand font-bold tracking-widest uppercase text-sm mb-3">{t("bookings.myAccount")}</p>
        <h1 className="text-4xl font-extrabold text-foreground">{t("bookings.title")}</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><Loading /></div>
      ) : error ? (
        <div className="glass-panel p-8 rounded-2xl text-center">
          <p className="text-red-400">{error}</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="glass-panel p-16 rounded-2xl text-center space-y-4">
          <p className="text-5xl">🦙</p>
          <p className="text-foreground font-semibold">{t("bookings.noBookings")}</p>
          <p className="text-muted-foreground">{t("bookings.noBookingsDesc")}</p>
          <Link to="/viajes">
            <Button className="mt-2 font-bold">{t("bookings.viewExpeditions")}</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {active.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-foreground font-semibold flex items-center gap-2">
                <CalendarCheck size={18} className="text-brand" />
                {t("bookings.upcoming", { count: active.length })}
              </h2>
              {active.map((booking) => {
                const { className: statusClass, icon: StatusIcon } = STATUS_CONFIG[booking.status];
                const statusLabel = booking.status === "CONFIRMED"
                  ? t("bookings.confirmedStatus")
                  : t("bookings.pendingStatus");
                const isCancelling = cancellingId === booking.id;

                return (
                  <div key={booking.id} className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col sm:flex-row">
                    <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <h3 className="text-foreground font-bold">{getTranslatedName(booking)}</h3>
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${statusClass}`}>
                            <StatusIcon size={12} />
                            {statusLabel}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-1">
                          <span className="flex items-center gap-1.5">
                            <CalendarCheck size={14} className="text-brand" />
                            {formatDate(booking.startDate)}
                            {booking.startDate !== booking.endDate && <> → {formatDate(booking.endDate)}</>}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users size={14} className="text-brand" />
                            {booking.peopleCount === 1
                              ? t("bookings.person_one", { count: 1 })
                              : t("bookings.person_other", { count: booking.peopleCount })}
                          </span>
                        </div>
                      </div>

                      {booking.status !== "CANCELLED" && (
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            className="text-sm border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40"
                            onClick={() => handleCancel(booking.id)}
                            disabled={isCancelling}
                          >
                            {isCancelling ? t("bookings.cancelling") : t("bookings.cancelButton")}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {cancelled.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-muted-foreground font-semibold text-sm uppercase tracking-widest">
                {t("bookings.cancelled", { count: cancelled.length })}
              </h2>
              {cancelled.map((booking) => {
                const { className: statusClass, icon: StatusIcon } = STATUS_CONFIG[booking.status];
                const statusLabel = t("bookings.cancelledStatus");
                return (
                  <div key={booking.id} className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between gap-4 opacity-60">
                    <div>
                      <p className="text-foreground font-medium">{getTranslatedName(booking)}</p>
                      <p className="text-muted-foreground text-sm mt-0.5">
                        {formatDate(booking.startDate)} · {booking.peopleCount === 1
                          ? t("bookings.person_one", { count: 1 })
                          : t("bookings.person_other", { count: booking.peopleCount })}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${statusClass}`}>
                      <StatusIcon size={12} />
                      {statusLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
