export default function AboutPage() {
  return (
    <main className="flex-1 py-32 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto">
      <div className="max-w-4xl">
        <p className="text-brand font-bold tracking-widest uppercase text-sm mb-4">Sobre Nosotros</p>
        <h1 className="text-4xl sm:text-6xl font-poppins font-extrabold text-white mb-8">
          Pasión por la <span className="text-brand">montaña</span>
        </h1>
        <div className="prose prose-invert prose-lg max-w-none text-slate-400">
          <p>
            LlamaTours nació con la idea de compartir la belleza inexplorada de los Andes con el mundo, 
            sin sacrificar la comodidad y la seguridad.
          </p>
          <p>
            Somos un equipo de guías locales y entusiastas de la aventura dedicados a crear 
            recuerdos que duren toda la vida.
          </p>
        </div>
      </div>
    </main>
  );
}
