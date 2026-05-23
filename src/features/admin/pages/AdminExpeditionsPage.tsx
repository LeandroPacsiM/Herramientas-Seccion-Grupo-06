import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, Flame, Leaf, Zap, AlertCircle } from "lucide-react";
import AdminLayout from "@/app/components/layout/AdminLayout";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { api } from "@/lib/api";
import type { Expedition } from "@/features/expeditions/types";
import ExpeditionFormModal from "@/features/admin/components/ExpeditionFormModal";

const DIFFICULTY_CONFIG = {
  EASY: { label: "Fácil", icon: Leaf, className: "text-emerald-400 bg-emerald-500/10" },
  MODERATE: { label: "Moderado", icon: Zap, className: "text-amber-400 bg-amber-500/10" },
  HARD: { label: "Difícil", icon: Flame, className: "text-red-400 bg-red-500/10" },
};

export default function AdminExpeditionsPage() {
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Expedition | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Expedition | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    api.get<Expedition[]>("/api/admin/expeditions")
      .then(setExpeditions)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = expeditions.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.location.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (exp: Expedition) => { setEditing(exp); setModalOpen(true); };

  const handleSaved = (saved: Expedition) => {
    setExpeditions((prev) => {
      const idx = prev.findIndex((e) => e.id === saved.id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [...prev, saved];
    });
    setModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await api.delete(`/api/admin/expeditions/${deleteTarget.id}`);
      setExpeditions((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      setDeleteError(err.message || "Error al eliminar");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <AdminLayout current="/admin/expediciones">
      <div className="p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Expediciones</h1>
            <p className="text-muted-foreground text-sm mt-1">{expeditions.length} en catálogo</p>
          </div>
          <Button onClick={openCreate} className="font-bold">
            <Plus size={18} className="mr-2" />
            Nueva expedición
          </Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Buscar por nombre o ubicación..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-accent rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-4xl mb-3">🦙</p>
              <p className="text-muted-foreground">{search ? "Sin resultados" : "No hay expediciones"}</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left px-6 py-3 font-medium">Expedición</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Dificultad</th>
                  <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Duración</th>
                  <th className="text-right px-4 py-3 font-medium hidden sm:table-cell">Precio</th>
                  <th className="text-right px-4 py-3 font-medium hidden lg:table-cell">Cupos</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((exp) => {
                  const { label, icon: Icon, className: diffClass } = DIFFICULTY_CONFIG[exp.difficulty];
                  const totalSpots = exp.availabilities.reduce((a, av) => a + av.availableSpots, 0);
                  return (
                    <tr key={exp.id} className="hover:bg-accent/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {exp.images[0] && (
                            <img
                              src={exp.images[0].url}
                              alt={exp.name}
                              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <p className="text-foreground font-medium truncate">{exp.name}</p>
                            <p className="text-muted-foreground text-xs truncate">{exp.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${diffClass}`}>
                          <Icon size={11} />{label}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground hidden lg:table-cell">
                        {exp.durationDays === 1 ? "1 día" : `${exp.durationDays} días`}
                      </td>
                      <td className="px-4 py-4 text-right hidden sm:table-cell">
                        <span className="text-brand font-semibold">${exp.price.toFixed(0)}</span>
                        <span className="text-muted-foreground text-xs ml-1">USD</span>
                      </td>
                      <td className="px-4 py-4 text-right text-muted-foreground hidden lg:table-cell">
                        {totalSpots}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(exp)}
                            className="p-2 rounded-lg text-muted-foreground hover:text-brand hover:bg-brand/10 transition-colors"
                            title="Editar"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => { setDeleteTarget(exp); setDeleteError(null); }}
                            className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modalOpen && (
        <ExpeditionFormModal
          expedition={editing}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="text-foreground font-semibold">Eliminar expedición</p>
                <p className="text-muted-foreground text-sm">Esta acción no se puede deshacer</p>
              </div>
            </div>
            <p className="text-foreground text-sm">
              ¿Seguro que deseas eliminar <strong>"{deleteTarget.name}"</strong>?
            </p>
            {deleteError && (
              <p className="text-red-400 text-sm">{deleteError}</p>
            )}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteTarget(null)} disabled={deleteLoading}>
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold"
                onClick={confirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Eliminando..." : "Eliminar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
