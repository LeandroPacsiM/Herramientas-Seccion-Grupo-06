import { useSearchParams, Link } from "react-router";
import { useTranslation } from "react-i18next";
import { CheckCircle, MapPin, CalendarDays, Users, FileText } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useEffect, useState } from "react";
import { bookingApi } from "@/features/bookings/services/bookingApi";
import type { Booking } from "@/features/bookings/types";

export default function PaymentSuccessPage() {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [booking, setBooking] = useState<Booking | null>(null);

  const formatDate = (dateStr: string) => {
    const localeMap: Record<string, string> = { es: "es-PE", en: "en-US", qu: "es-PE" };
    return new Date(dateStr).toLocaleDateString(localeMap[i18n.language] || "es-PE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    if (!bookingId) return;
    const id = parseInt(bookingId, 10);
    if (isNaN(id)) return;
    bookingApi.getById(id).then(setBooking).catch(() => {});
  }, [bookingId]);

  return (
    <main className="flex-1 flex items-center justify-center py-32 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto">
          <CheckCircle size={40} className="text-emerald-400" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">{t("checkout.paySuccessTitle")}</h1>
          <p className="text-muted-foreground text-sm">{t("checkout.paySuccessDesc")}</p>
        </div>

        {booking && (
          <div className="bg-card border border-border rounded-2xl p-5 text-left space-y-3">
            <p className="text-foreground font-semibold">{booking.expeditionName}</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <CalendarDays size={14} className="text-brand" />
                {formatDate(booking.startDate)}
                {booking.startDate !== booking.endDate && <> → {formatDate(booking.endDate)}</>}
              </span>
              <span className="flex items-center gap-2">
                <Users size={14} className="text-brand" />
                {booking.peopleCount === 1
                  ? t("bookings.person_one", { count: 1 })
                  : t("bookings.person_other", { count: booking.peopleCount })}
              </span>
              {booking.totalAmount && (
                <span className="flex items-center gap-2 font-semibold text-foreground">
                  <span className="text-brand">$</span>
                  {booking.totalAmount.toFixed(2)} USD
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {bookingId && (
            <Link to={`/payment/receipt/${bookingId}`}>
              <Button variant="outline" className="w-full flex items-center gap-2 font-bold">
                <FileText size={16} />
                {t("checkout.viewReceipt")}
              </Button>
            </Link>
          )}
          <Link to="/mis-reservas">
            <Button className="w-full font-bold">{t("checkout.viewBookings")}</Button>
          </Link>
          <Link to="/viajes">
            <Button variant="outline" className="w-full">{t("checkout.continueExploring")}</Button>
          </Link>
        </div>

        <p className="text-6xl">🦙</p>
      </div>
    </main>
  );
}
