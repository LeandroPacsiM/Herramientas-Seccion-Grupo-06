import Link from "next/link";
import { ArrowRight, Star, MapPin, Calendar } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image Placeholder (Legacy style) */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-1000 hover:scale-105"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80')",
            filter: "brightness(0.6)"
          }}
        />

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <p className="text-brand font-poppins font-bold tracking-[0.3em] uppercase text-xs sm:text-sm mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Aventuras de Lujo en los Andes
          </p>
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-poppins font-extrabold text-white leading-tight mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Tu Expedición <br />
            <span className="text-brand">Inolvidable</span>
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Link
              href="/viajes"
              className="bg-brand hover:bg-brand-soft text-black px-8 py-4 rounded-md font-bold transition-all flex items-center group"
            >
              Explorar Viajes
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <Link
              href="/contacto"
              className="glass-panel text-white border border-white/20 px-8 py-4 rounded-md font-bold hover:bg-white/10 transition-all"
            >
              Contactar un Guía
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-brand opacity-60">
          <div className="w-1 h-12 bg-gradient-to-t from-brand to-transparent rounded-full" />
        </div>
      </section>

      <section className="py-24 bg-surface/50 border-y border-white/5">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 bg-brand/10 rounded-full text-brand">
              <Star size={32} />
            </div>
            <h3 className="text-2xl font-poppins font-bold">Experiencias Premium</h3>
            <p className="text-slate-400">Seleccionamos los mejores destinos y servicios para una expedición sin preocupaciones.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 bg-brand/10 rounded-full text-brand">
              <MapPin size={32} />
            </div>
            <h3 className="text-2xl font-poppins font-bold">Rutas Exclusivas</h3>
            <p className="text-slate-400">Acceso a zonas remotas y campamentos de lujo en el corazón de la cordillera.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 bg-brand/10 rounded-full text-brand">
              <Calendar size={32} />
            </div>
            <h3 className="text-2xl font-poppins font-bold">Fechas Flexibles</h3>
            <p className="text-slate-400">Nos adaptamos a tu calendario para que vivas tu aventura cuando lo desees.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
