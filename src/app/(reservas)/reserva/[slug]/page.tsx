import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import data from '@/lib/data/destinos.json';
import ReservationForm from '../components/ReservationForm';
import { MapPin, Mountain, ArrowUpCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default async function ReservaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destino = data.destinos.find((d) => d.codigoDestino === slug);

  if (!destino) {
    notFound();
  }

  const mockItinerary = [
    { day: 1, title: 'Llegada y Aclimatación', description: 'Recepción en el aeropuerto, traslado al hotel y tiempo libre para aclimatarse a la altitud.' },
    { day: 2, title: 'Exploración Principal', description: `Recorrido guiado por los principales atractivos de ${destino.nombre}.` },
    { day: 3, title: 'Despedida', description: 'Desayuno de despedida y traslado al aeropuerto o terminal.' },
  ];

  const mockInclusions = [
    'Transporte privado',
    'Guía oficial de turismo',
    'Entradas a los atractivos',
    'Botiquín de primeros auxilios'
  ];

  const mockExclusions = [
    'Vuelos o pasajes hacia la ciudad de origen',
    'Alimentación no especificada',
    'Propinas (opcional)'
  ];

  return (
    <main className="flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto min-h-screen">
      {/* Left 2/3: Scrollable Content */}
      <section className="w-full lg:w-2/3 px-4 sm:px-6 lg:px-12 py-8 lg:py-24 space-y-10 lg:space-y-12">

        {/* Hero Image Section */}
        <div id="overview" className="relative group">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-surface-container shadow-2xl">
            <Image
              id="heroImage"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              src={destino.imagenes.hero || destino.imagenes.card}
              alt={destino.nombre}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 1200px"
            />
          </div>
          <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 text-white z-10 max-w-[calc(100%-2rem)]">
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold font-poppins tracking-tighter mb-2">
              {destino.nombre}
            </h1>
            <p className="text-blue-200 font-medium tracking-widest text-xs uppercase opacity-80 flex items-center gap-2">
              <MapPin size={14} /> {destino.departamento}, Perú • Expedición
            </p>
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent rounded-2xl"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-surface-container/50 border border-white/5 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-1">
            <Mountain className="text-brand mb-2" size={24} />
            <span className="text-slate-400 text-xs font-bold tracking-widest uppercase">Dificultad</span>
            <span className="text-2xl font-poppins font-bold text-white">{destino.stats.dificultad}</span>
          </div>
          <div className="bg-surface-container/50 border border-white/5 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-1">
            <ArrowUpCircle className="text-brand mb-2" size={24} />
            <span className="text-slate-400 text-xs font-bold tracking-widest uppercase">Altitud</span>
            <span className="text-2xl font-poppins font-bold text-white">{destino.stats.altitud}</span>
          </div>
          <div className="bg-surface-container/50 border border-white/5 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-1 col-span-2 md:col-span-1">
            <Clock className="text-brand mb-2" size={24} />
            <span className="text-slate-400 text-xs font-bold tracking-widest uppercase">Duración</span>
            <span className="text-2xl font-poppins font-bold text-white">
              {destino.stats.duracionDias} {destino.stats.duracionDias === 1 ? 'Día' : 'Días'}
            </span>
          </div>
        </div>

        {/* Content Narrative */}
        <div className="prose prose-invert max-w-none space-y-6">
          <h2 className="text-3xl font-poppins font-bold text-white">
            Explora la Magia de {destino.nombre}
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed font-light">
            {destino.descripcionCorta} Prepárate para una aventura inolvidable donde cada paso
            te acercará más a la naturaleza y a la rica historia que envuelve a {departamentoText(destino.departamento)}.
            Nuestros guías expertos se encargarán de que tengas una experiencia segura, inmersiva y de primer nivel.
          </p>
        </div>

        {/* Itinerary Section */}
        <div id="itinerary" className="space-y-4 pt-8">
          <h3 className="text-xl font-poppins font-bold text-white mb-6 flex items-center">
            <MapPin className="mr-2 text-brand" size={24} />
            Itinerario Destacado
          </h3>
          <div className="space-y-4">
            {mockItinerary.map((item) => (
              <div key={item.day} className="bg-surface-container/30 border border-white/5 p-6 rounded-xl">
                <h4 className="text-brand font-bold mb-2">Día {item.day}: {item.title}</h4>
                <p className="text-slate-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Inclusions Section */}
        <div id="inclusions" className="space-y-6 pt-8">
          <h3 className="text-xl font-poppins font-bold text-white mb-6 flex items-center">
            <CheckCircle2 className="mr-2 text-brand" size={24} />
            Detalles de Inclusión
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container/30 rounded-xl p-6 border border-green-500/20">
              <h4 className="text-green-400 font-semibold flex items-center text-lg mb-4">
                <CheckCircle2 className="mr-2" size={20} />
                Incluido
              </h4>
              <ul className="space-y-3">
                {mockInclusions.map((item, idx) => (
                  <li key={idx} className="text-slate-300 text-sm flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-surface-container/30 rounded-xl p-6 border border-red-500/20">
              <h4 className="text-red-400 font-semibold flex items-center text-lg mb-4">
                <XCircle className="mr-2" size={20} />
                No Incluido
              </h4>
              <ul className="space-y-3">
                {mockExclusions.map((item, idx) => (
                  <li key={idx} className="text-slate-400 text-sm flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Right 1/3: Fixed Side Panel */}
      <aside className="w-full lg:w-1/3 px-4 sm:px-6 lg:px-0 max-w-full lg:sticky lg:top-24 self-start py-8 lg:py-12">
        <ReservationForm
          precio={destino.precio}
          moneda={destino.moneda}
          disponibilidad={destino.disponibilidad}
        />
      </aside>
    </main>
  );
}

function departamentoText(dep: string) {
  if (['Ica', 'Arequipa', 'Amazonas'].includes(dep)) return `la región de ${dep}`;
  return `el departamento de ${dep}`;
}
