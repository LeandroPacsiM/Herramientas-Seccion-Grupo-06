import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Printer, ArrowLeft, CheckCircle, CalendarDays, Users, User, Mail } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import Loader from "@/app/components/shared/Loading";
import { paymentApi } from "@/features/payment/services/paymentApi";
import type { PaymentDetails } from "@/features/payment/services/paymentApi";

export default function PaymentReceiptPage() {
  const { t, i18n } = useTranslation();
  const { bookingId } = useParams();
  const [details, setDetails] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    paymentApi.getPaymentDetails(id)
      .then(setDetails)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [bookingId]);

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center py-32">
        <Loader />
      </main>
    );
  }

  if (error || !details) {
    return (
      <main className="flex-1 flex items-center justify-center py-32 px-4">
        <div className="text-center space-y-4">
          <p className="text-red-400">{error || t("receipt.notFound")}</p>
          <Link to="/mis-reservas">
            <Button variant="outline">{t("receipt.backToBookings")}</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 py-32 px-4 print:py-8">
      <div className="max-w-[600px] mx-auto">
        <div className="hidden print:flex items-center justify-center mb-10">
          <pre className="text-xs text-muted-foreground font-mono leading-tight tracking-[0.15em]">
{`╔══════════════════════════════╗
║       L L A M A T O U R S     ║
║   Comprobante de Pago         ║
╚══════════════════════════════╝`}
          </pre>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden print:border print:shadow-none">
          <div className="bg-brand/10 border-b border-border/50 px-6 py-5 flex items-center justify-between print:bg-transparent">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">{t("receipt.voucher")}</p>
              <p className="text-xl font-bold text-foreground font-serif tracking-tight">{details.receiptNumber}</p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 rounded-full">
              <CheckCircle size={14} className="text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{t("receipt.paid")}</span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{t("receipt.expedition")}</p>
              <p className="text-lg font-bold text-foreground">{details.expeditionName}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("receipt.dates")}</p>
                <p className="text-sm text-foreground flex items-center gap-1.5">
                  <CalendarDays size={14} className="text-brand shrink-0" />
                  {formatDate(details.startDate)}
                  {details.startDate !== details.endDate && <> — {formatDate(details.endDate)}</>}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("receipt.people")}</p>
                <p className="text-sm text-foreground flex items-center gap-1.5">
                  <Users size={14} className="text-brand shrink-0" />
                  {details.peopleCount === 1
                    ? t("bookings.person_one", { count: 1 })
                    : t("bookings.person_other", { count: details.peopleCount })}
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("receipt.customer")}</p>
              <div className="space-y-1.5">
                <p className="text-sm text-foreground flex items-center gap-1.5">
                  <User size={14} className="text-brand shrink-0" />
                  {details.customerName}
                </p>
                <p className="text-sm text-foreground flex items-center gap-1.5">
                  <Mail size={14} className="text-brand shrink-0" />
                  {details.customerEmail}
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("receipt.paymentInfo")}</p>
              {details.bookingDate && (
                <p className="text-xs text-muted-foreground">
                  {t("receipt.bookingDate")}: {formatDate(details.bookingDate)}
                </p>
              )}
            </div>

            <div className="bg-brand/10 -mx-6 -mb-6 px-6 py-5 flex items-center justify-between print:bg-gray-100">
              <p className="text-sm font-semibold text-muted-foreground">{t("receipt.totalPaid")}</p>
              <p className="text-2xl font-bold text-foreground font-serif">${details.totalAmount.toFixed(2)} USD</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-8 print:hidden">
          <Link to="/mis-reservas">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft size={14} />
              {t("receipt.backToBookings")}
            </Button>
          </Link>
          <Button onClick={handlePrint} className="flex items-center gap-2 font-bold">
            <Printer size={16} />
            {t("receipt.printButton")}
          </Button>
        </div>

        <p className="text-[10px] text-muted-foreground text-center mt-6 print:mt-4 leading-relaxed">
          {t("receipt.footer")}
        </p>
      </div>
    </main>
  );
}
