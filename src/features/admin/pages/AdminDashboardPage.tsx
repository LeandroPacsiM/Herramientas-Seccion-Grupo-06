import { useEffect, useState } from "react";
import { Map, Users, CalendarCheck, TrendingUp } from "lucide-react";
import AdminLayout from "@/app/components/layout/AdminLayout";
import { api } from "@/lib/api";
import type { Expedition } from "@/features/expeditions/types";
import type { Booking } from "@/features/bookings/types";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}

function StatCard({ icon: Icon, label, value, sub, accent }: StatCardProps) {
  return (
    <div className={`bg-card border rounded-2xl p-6 ${accent ? "border-brand/30" : "border-border"}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${accent ? "bg-brand/10 text-brand" : "bg-accent text-muted-foreground"}`}>
        <Icon size={20} />
      </div>
      <p className="text-muted-foreground text-sm mb-1">{label}</p>
      <p className={`font-extrabold text-3xl ${accent ? "text-brand" : "text-foreground"}`}>{value}</p>
      {sub && <p className="text-muted-foreground text-xs mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<Expedition[]>("/api/admin/expeditions"),
      api.get<Booking[]>("/api/admin/bookings"),
    ]).then(([exps, bks]) => {
      setExpeditions(exps);
      setBookings(bks);
    }).finally(() => setLoading(false));
  }, []);

  const totalSpots = expeditions.reduce(
    (acc, e) => acc + e.availabilities.reduce((a, av) => a + av.availableSpots, 0),
    0
  );
  const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED").length;
  const revenue = bookings
    .filter((b) => b.status === "CONFIRMED")
    .reduce((acc, b) => {
      const exp = expeditions.find((e) => e.id === b.expeditionId);
      return acc + (exp ? exp.price * b.peopleCount : 0);
    }, 0);

  const recentBookings = [...bookings].reverse().slice(0, 5);

  return (
    <AdminLayout current="/admin">
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Resumen general de LlamaTours</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 animate-pulse h-36" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Map} label="Expediciones" value={expeditions.length} sub="en catálogo" accent />
            <StatCard icon={CalendarCheck} label="Reservas confirmadas" value={confirmedBookings} sub={`de ${bookings.length} totales`} />
            <StatCard icon={Users} label="Cupos disponibles" value={totalSpots} sub="próximas fechas" />
            <StatCard icon={TrendingUp} label="Ingresos" value={`$${revenue.toFixed(0)}`} sub="USD" />
          </div>
        )}

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-foreground font-semibold">Reservas recientes</h2>
            <span className="text-muted-foreground text-xs">{bookings.length} total</span>
          </div>

          {recentBookings.length === 0 ? (
            <p className="text-muted-foreground text-sm p-6">No hay reservas aún.</p>
          ) : (
            <div className="divide-y divide-border">
              {recentBookings.map((b) => {
                const statusColor =
                  b.status === "CONFIRMED" ? "text-emerald-400 bg-emerald-500/10"
                  : b.status === "CANCELLED" ? "text-red-400 bg-red-500/10"
                  : "text-amber-400 bg-amber-500/10";
                const statusLabel =
                  b.status === "CONFIRMED" ? "Confirmada"
                  : b.status === "CANCELLED" ? "Cancelada"
                  : "Pendiente";
                return (
                  <div key={b.id} className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-foreground text-sm font-medium truncate">{b.expeditionName}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">
                        {new Date(b.startDate).toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" })}
                        {" · "}{b.peopleCount} {b.peopleCount === 1 ? "persona" : "personas"}
                      </p>
                    </div>
                    <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor}`}>
                      {statusLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="/admin/expediciones"
            className="bg-brand/5 border border-brand/20 hover:border-brand/40 rounded-2xl p-6 flex items-center gap-4 transition-colors group"
          >
            <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center text-brand">
              <Map size={22} />
            </div>
            <div>
              <p className="text-foreground font-semibold group-hover:text-brand transition-colors">Gestionar Expediciones</p>
              <p className="text-muted-foreground text-sm">Crear, editar y eliminar</p>
            </div>
          </a>
          <a
            href="/viajes"
            className="bg-card border border-border hover:border-brand/30 rounded-2xl p-6 flex items-center gap-4 transition-colors group"
          >
            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-muted-foreground">
              <Users size={22} />
            </div>
            <div>
              <p className="text-foreground font-semibold group-hover:text-brand transition-colors">Ver Catálogo Público</p>
              <p className="text-muted-foreground text-sm">Vista del cliente</p>
            </div>
          </a>
        </div>
      </div>
    </AdminLayout>
  );
}
