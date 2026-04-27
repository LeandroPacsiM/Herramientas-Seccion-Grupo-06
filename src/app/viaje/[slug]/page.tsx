interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function TripDetailPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="flex-1 py-32 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto">
      <div className="max-w-4xl">
        <p className="text-brand font-bold tracking-widest uppercase text-sm mb-4">Expedición Privada</p>
        <h1 className="text-4xl sm:text-7xl font-poppins font-extrabold text-white mb-8 capitalize">
          {slug.replace("-", " ")}
        </h1>
        <p className="text-slate-400 text-xl leading-relaxed">
          Cargando detalles de la aventura... En esta página migraremos el itinerario interactivo y la galería.
        </p>
      </div>
    </main>
  );
}
