import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Mail, Phone, MapPin, Send, CheckCircle, User, MessageSquare } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function ContactoPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post("/api/contact", {
        name: form.name,
        email: form.email,
        message: form.message,
      });
      setSent(true);
    } catch (err: any) {
      setError(err.message || t("contacto.sendError", "No se pudo enviar el mensaje. Intenta de nuevo."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 py-32 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto">
      <div className="mb-16">
        <p className="text-brand font-bold tracking-widest uppercase text-sm mb-4">{t("contacto.subtitle")}</p>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-foreground">
          {t("contacto.titlePart1")} <span className="text-brand">{t("contacto.titlePart2")}</span>
        </h1>
        <p className="text-muted-foreground text-lg mt-6 max-w-2xl">
          {t("contacto.desc")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

        <div className="lg:col-span-3">
          {sent ? (
            <div className="bg-card border border-emerald-500/20 rounded-2xl p-12 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle size={32} className="text-emerald-400" />
              </div>
              <h2 className="text-foreground font-bold text-xl">{t("contacto.sentSuccess")}</h2>
              <p className="text-muted-foreground max-w-sm">
                {t("contacto.sentDesc", { name: form.name, email: form.email })}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => { setSent(false); setForm({ name: user?.name ?? "", email: user?.email ?? "", message: "" }); }}
              >
                {t("contacto.sendAnother")}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 space-y-6">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 text-destructive text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("contacto.fullName")}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      required
                      placeholder="Juan Pérez"
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("contacto.email")}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      required
                      placeholder="tu@email.com"
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">{t("contacto.message")}</Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 text-muted-foreground" size={16} />
                  <textarea
                    id="message"
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    required
                    rows={6}
                    placeholder={t("contacto.messagePlaceholder")}
                    className="w-full bg-background border border-input rounded-md pl-9 pr-3 py-2 text-sm text-foreground outline-none focus:border-ring resize-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full font-bold h-12" disabled={loading}>
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />{t("contacto.sending")}</>
                ) : (
                  <><Send size={16} className="mr-2" />{t("contacto.sendMessage")}</>
                )}
              </Button>
            </form>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="text-foreground font-bold">{t("contacto.contactInfo")}</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0">
                  <Phone size={16} className="text-brand" />
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">{t("contacto.phone")}</p>
                  <p className="text-muted-foreground text-sm">+51 900 460 347</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={16} className="text-brand" />
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">{t("auth.emailLabel")}</p>
                  <p className="text-muted-foreground text-sm">contacto@llamatours.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={16} className="text-brand" />
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">{t("contacto.office")}</p>
                  <p className="text-muted-foreground text-sm" style={{ whiteSpace: "pre-line" }}>{t("contacto.address")}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-brand/5 border border-brand/20 rounded-2xl p-6 space-y-3">
            <p className="text-foreground font-semibold text-sm">🕐 {t("contacto.hours")}</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>{t("contacto.weekdays")}</span>
                <span className="text-foreground">8:00 – 18:00</span>
              </div>
              <div className="flex justify-between">
                <span>{t("contacto.saturday")}</span>
                <span className="text-foreground">9:00 – 14:00</span>
              </div>
              <div className="flex justify-between">
                <span>{t("contacto.sunday")}</span>
                <span className="text-muted-foreground">{t("contacto.closed")}</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
            <p className="text-foreground font-semibold text-sm">{t("contacto.ready")}</p>
            <p className="text-muted-foreground text-sm">{t("contacto.readyDesc")}</p>
            <Link to="/viajes">
              <Button variant="outline" className="w-full">{t("contacto.viewExpeditions")}</Button>
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
