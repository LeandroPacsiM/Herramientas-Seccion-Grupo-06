interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ReservationPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="flex-1 py-32 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto">
      <div className="max-w-4xl">
        <p className="text-brand font-bold tracking-widest uppercase text-sm mb-4">Proceso de Reserva</p>
        <h1 className="text-4xl sm:text-7xl font-poppins font-extrabold text-white mb-8 capitalize">
          {slug.replace("-", " ")}
        </h1>
        <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-6">
          <p className="text-slate-400 text-xl leading-relaxed">
            Estás a un paso de comenzar tu expedición. Aquí integraremos el flujo de selección de fechas, 
            número de personas y el ticket de reserva que tenías en <code className="text-brand">viaje.html</code>.
          </p>
          <div className="h-40 bg-white/5 rounded-2xl flex items-center justify-center border border-dashed border-white/20">
            <span className="text-slate-500 font-poppins font-bold">Módulo de Ticket de Reserva (Próximamente)</span>
          </div>
        </div>
      </div>
    </main>
  );
}
