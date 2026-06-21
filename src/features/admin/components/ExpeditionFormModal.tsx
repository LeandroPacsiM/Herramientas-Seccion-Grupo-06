import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { api } from "@/lib/api";
import type { Expedition } from "@/features/expeditions/types";
import { DatePicker } from "@/app/components/ui/date-picker";

interface ExpeditionFormModalProps {
  expedition?: Expedition | null;
  onClose: () => void;
  onSaved: (expedition: Expedition) => void;
}

const EMPTY_FORM = {
  name: "",
  slug: "",
  description: "",
  price: "",
  durationDays: "",
  difficulty: "MODERATE" as "EASY" | "MODERATE" | "HARD",
  location: "",
  latitude: "",
  longitude: "",
  itineraries: [{ dayNumber: 1, title: "", description: "" }],
  images: [{ url: "", imageOrder: 1 }],
  availabilities: [{ startDate: "", endDate: "", capacity: "" }],
};

type FormData = typeof EMPTY_FORM;

export default function ExpeditionFormModal({ expedition, onClose, onSaved }: ExpeditionFormModalProps) {
  const isEdit = !!expedition;
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (expedition) {
      setForm({
        name: expedition.name,
        slug: expedition.slug,
        description: expedition.description,
        price: String(expedition.price),
        durationDays: String(expedition.durationDays),
        difficulty: expedition.difficulty,
        location: expedition.location,
        latitude: expedition.latitude ? String(expedition.latitude) : "",
        longitude: expedition.longitude ? String(expedition.longitude) : "",
        itineraries: expedition.itineraries.map((it) => ({
          dayNumber: it.dayNumber,
          title: it.title,
          description: it.description,
        })),
        images: expedition.images.map((img) => ({
          url: img.url,
          imageOrder: img.imageOrder,
        })),
        availabilities: expedition.availabilities.map((av) => ({
          startDate: av.startDate,
          endDate: av.endDate,
          capacity: String(av.capacity),
        })),
      });
    }
  }, [expedition]);

  const set = (key: keyof typeof EMPTY_FORM, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const addDay = () =>
    set("itineraries", [...form.itineraries, { dayNumber: form.itineraries.length + 1, title: "", description: "" }]);
  const removeDay = (i: number) =>
    set("itineraries", form.itineraries.filter((_, idx) => idx !== i).map((it, idx) => ({ ...it, dayNumber: idx + 1 })));
  const setDay = (i: number, field: string, value: string) =>
    set("itineraries", form.itineraries.map((it, idx) => idx === i ? { ...it, [field]: value } : it));

  const addImage = () =>
    set("images", [...form.images, { url: "", imageOrder: form.images.length + 1 }]);
  const removeImage = (i: number) =>
    set("images", form.images.filter((_, idx) => idx !== i).map((img, idx) => ({ ...img, imageOrder: idx + 1 })));
  const setImage = (i: number, value: string) =>
    set("images", form.images.map((img, idx) => idx === i ? { ...img, url: value } : img));

  const addDate = () =>
    set("availabilities", [...form.availabilities, { startDate: "", endDate: "", capacity: "" }]);
  const removeDate = (i: number) =>
    set("availabilities", form.availabilities.filter((_, idx) => idx !== i));
  const setDate = (i: number, field: string, value: string) =>
    set("availabilities", form.availabilities.map((av, idx) => idx === i ? { ...av, [field]: value } : av));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      description: form.description,
      price: parseFloat(form.price),
      durationDays: parseInt(form.durationDays),
      difficulty: form.difficulty,
      location: form.location,
      latitude: form.latitude ? parseFloat(form.latitude) : undefined,
      longitude: form.longitude ? parseFloat(form.longitude) : undefined,
      itineraries: form.itineraries,
      images: form.images.filter((img) => img.url.trim()),
      availabilities: form.availabilities
        .filter((av) => av.startDate && av.capacity)
        .map((av) => ({ ...av, capacity: parseInt(av.capacity) })),
    };

    try {
      let result: Expedition;
      if (isEdit) {
        result = await api.put<Expedition>(`/api/admin/expeditions/${expedition!.id}`, payload);
      } else {
        result = await api.post<Expedition>("/api/admin/expeditions", payload);
      }
      onSaved(result);
    } catch (err: any) {
      setError(err.message || "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4 pt-8">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-foreground font-bold">
            {isEdit ? "Editar expedición" : "Nueva expedición"}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Nombre *</Label>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} required placeholder="Camino Inca Clásico" />
            </div>
            <div className="space-y-1.5">
              <Label>Slug (URL)</Label>
              <Input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="se genera automáticamente" />
            </div>
            <div className="space-y-1.5">
              <Label>Precio (USD) *</Label>
              <Input type="number" min="0" step="0.01" value={form.price} onChange={(e) => set("price", e.target.value)} required placeholder="599.99" />
            </div>
            <div className="space-y-1.5">
              <Label>Duración (días) *</Label>
              <Input type="number" min="1" value={form.durationDays} onChange={(e) => set("durationDays", e.target.value)} required placeholder="4" />
            </div>
            <div className="space-y-1.5">
              <Label>Dificultad *</Label>
              <select
                value={form.difficulty}
                onChange={(e) => set("difficulty", e.target.value)}
                className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground outline-none focus:border-ring"
                required
              >
                <option value="EASY">Fácil</option>
                <option value="MODERATE">Moderado</option>
                <option value="HARD">Difícil</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Ubicación *</Label>
              <Input value={form.location} onChange={(e) => set("location", e.target.value)} required placeholder="Cusco, Perú" />
            </div>
            <div className="space-y-1.5">
              <Label>Latitud</Label>
              <Input type="number" step="any" value={form.latitude} onChange={(e) => set("latitude", e.target.value)} placeholder="-13.1631" />
            </div>
            <div className="space-y-1.5">
              <Label>Longitud</Label>
              <Input type="number" step="any" value={form.longitude} onChange={(e) => set("longitude", e.target.value)} placeholder="-72.5450" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Descripción *</Label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              required
              rows={3}
              placeholder="Describe la expedición..."
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground outline-none focus:border-ring resize-none"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Imágenes (URLs)</Label>
              <button type="button" onClick={addImage} className="flex items-center gap-1 text-xs text-brand hover:text-brand-soft transition-colors">
                <Plus size={14} /> Agregar
              </button>
            </div>
            {form.images.map((img, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={img.url}
                  onChange={(e) => setImage(i, e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1"
                />
                {form.images.length > 1 && (
                  <button type="button" onClick={() => removeImage(i)} className="text-muted-foreground hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Itinerario</Label>
              <button type="button" onClick={addDay} className="flex items-center gap-1 text-xs text-brand hover:text-brand-soft transition-colors">
                <Plus size={14} /> Agregar día
              </button>
            </div>
            {form.itineraries.map((day, i) => (
              <div key={i} className="bg-background border border-border rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-brand text-sm font-bold">Día {day.dayNumber}</span>
                  {form.itineraries.length > 1 && (
                    <button type="button" onClick={() => removeDay(i)} className="text-muted-foreground hover:text-red-400 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
                <Input
                  value={day.title}
                  onChange={(e) => setDay(i, "title", e.target.value)}
                  placeholder="Título del día"
                />
                <textarea
                  value={day.description}
                  onChange={(e) => setDay(i, "description", e.target.value)}
                  rows={2}
                  placeholder="Descripción de las actividades..."
                  className="w-full bg-card border border-input rounded-md px-3 py-2 text-sm text-foreground outline-none focus:border-ring resize-none"
                />
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Fechas disponibles</Label>
              <button type="button" onClick={addDate} className="flex items-center gap-1 text-xs text-brand hover:text-brand-soft transition-colors">
                <Plus size={14} /> Agregar fecha
              </button>
            </div>
            {form.availabilities.map((av, i) => (
              <div key={i} className="bg-background border border-border rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs font-medium">Fecha {i + 1}</span>
                  {form.availabilities.length > 1 && (
                    <button type="button" onClick={() => removeDate(i)} className="text-muted-foreground hover:text-red-400 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Inicio</Label>
                    <DatePicker value={av.startDate} onChange={(v) => setDate(i, "startDate", v)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Fin</Label>
                    <DatePicker value={av.endDate} onChange={(v) => setDate(i, "endDate", v)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Capacidad</Label>
                    <Input type="number" min="1" value={av.capacity} onChange={(e) => setDate(i, "capacity", e.target.value)} placeholder="20" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 font-bold" disabled={loading}>
              {loading ? (
                <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />Guardando...</>
              ) : isEdit ? "Guardar cambios" : "Crear expedición"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
