import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle, User, MessageSquare } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function ContactoPage() {
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
      setError(err.message || "No se pudo enviar el mensaje. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 py-32 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto">
      <div className="mb-16">
        <p className="text-brand font-bold tracking-widest uppercase text-sm mb-4">Contacto</p>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-foreground">
          Hablemos de tu <span className="text-brand">próxima aventura</span>
        </h1>
        <p className="text-muted-foreground text-lg mt-6 max-w-2xl">
          ¿Tienes dudas sobre una ruta o quieres una expedición personalizada? Nuestro equipo de expertos está listo para ayudarte.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

        <div className="lg:col-span-3">
          {sent ? (
            <div className="bg-card border border-emerald-500/20 rounded-2xl p-12 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle size={32} className="text-emerald-400" />
              </div>
              <h2 className="text-foreground font-bold text-xl">¡Mensaje enviado!</h2>
              <p className="text-muted-foreground max-w-sm">
                Gracias por contactarnos, <strong className="text-foreground">{form.name}</strong>. Te responderemos a <strong className="text-foreground">{form.email}</strong> en menos de 24 horas.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => { setSent(false); setForm({ name: user?.name ?? "", email: user?.email ?? "", message: "" }); }}
              >
                Enviar otro mensaje
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
                  <Label htmlFor="name">Nombre completo *</Label>
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
                  <Label htmlFor="email">Correo electrónico *</Label>
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
                <Label htmlFor="message">Mensaje *</Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 text-muted-foreground" size={16} />
                  <textarea
                    id="message"
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    required
                    rows={6}
                    placeholder="Cuéntanos sobre tu expedición ideal, fechas tentativas, número de personas..."
                    className="w-full bg-background border border-input rounded-md pl-9 pr-3 py-2 text-sm text-foreground outline-none focus:border-ring resize-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full font-bold h-12" disabled={loading}>
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />Enviando...</>
                ) : (
                  <><Send size={16} className="mr-2" />Enviar mensaje</>
                )}
              </Button>
            </form>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="text-foreground font-bold">Información de contacto</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0">
                  <Phone size={16} className="text-brand" />
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">Teléfono</p>
                  <p className="text-muted-foreground text-sm">+51 900 460 347</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={16} className="text-brand" />
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">Email</p>
                  <p className="text-muted-foreground text-sm">contacto@llamatours.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={16} className="text-brand" />
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">Oficina</p>
                  <p className="text-muted-foreground text-sm">Av. 28 de Julio, La Victoria<br />Lima, Perú</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-brand/5 border border-brand/20 rounded-2xl p-6 space-y-3">
            <p className="text-foreground font-semibold text-sm">🕐 Horario de atención</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Lunes – Viernes</span>
                <span className="text-foreground">8:00 – 18:00</span>
              </div>
              <div className="flex justify-between">
                <span>Sábado</span>
                <span className="text-foreground">9:00 – 14:00</span>
              </div>
              <div className="flex justify-between">
                <span>Domingo</span>
                <span className="text-muted-foreground">Cerrado</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
            <p className="text-foreground font-semibold text-sm">¿Listo para explorar?</p>
            <p className="text-muted-foreground text-sm">Revisa nuestro catálogo de expediciones y encuentra tu aventura ideal.</p>
            <a href="/viajes">
              <Button variant="outline" className="w-full">Ver expediciones</Button>
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}
