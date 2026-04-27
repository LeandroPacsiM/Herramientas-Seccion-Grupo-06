import Link from "next/link";
import { Search, Filter, MapPin, Clock, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TripsPage() {
  return (
    <main className="flex-1 py-32 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <p className="text-brand font-bold tracking-widest uppercase text-sm mb-4">Catálogo</p>
          <h1 className="text-4xl sm:text-6xl font-poppins font-extrabold text-white">
            Encuentra tu <span className="text-brand">destino</span>
          </h1>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <Input
            placeholder="Buscar expedición..."
            className="rounded-full pl-12 bg-surface-container border-white/5 h-12"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        <Card className="glass-panel border-white/5 overflow-hidden group rounded-3xl">
          <CardHeader className="p-0">
            <div className="aspect-[4/3] bg-surface-container relative overflow-hidden">
              <div className="absolute top-4 right-4 z-10">
                <span className="bg-brand text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  Experto
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0" />
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-4">
            <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span className="flex items-center gap-1"><MapPin size={14} className="text-brand" /> Andes</span>
              <span className="flex items-center gap-1"><Clock size={14} className="text-brand" /> 8 Días</span>
            </div>
            <h3 className="text-2xl font-poppins font-bold text-white group-hover:text-brand transition-colors">
              Ausangate Trek
            </h3>
            <p className="text-slate-400 line-clamp-2 leading-relaxed">
              Una expedición mística por los glaciares sagrados de los Andes. Cruza pasos de montaña a más de 5,000 metros.
            </p>
          </CardContent>
          <CardFooter className="p-8 pt-0 flex items-center justify-between">
            <span className="text-2xl font-poppins font-bold text-brand">$3,450</span>
            <Button
              variant="outline"
              nativeButton={false}
              className="border-white/10 hover:bg-brand hover:text-black"
              render={
                <Link href="/viaje/ausangate" className="flex items-center gap-2">
                  Ver detalle <ArrowRight size={16} />
                </Link>
              }
            />
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
