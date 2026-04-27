export default function ContactPage() {
  return (
    <main className="flex-1 py-32 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto">
      <div className="max-w-3xl">
        <p className="text-brand font-bold tracking-widest uppercase text-sm mb-4">Contacto</p>
        <h1 className="text-4xl sm:text-6xl font-poppins font-extrabold text-white mb-8">
          Hablemos de tu <span className="text-brand">próxima aventura</span>
        </h1>
        <p className="text-slate-400 text-lg mb-12">
          ¿Tienes dudas sobre una ruta o quieres una expedición personalizada? Nuestro equipo de expertos está listo para ayudarte.
        </p>

        <div className="glass-panel p-8 rounded-2xl border border-white/5">
          <p className="text-white">Formulario en construcción...</p>
        </div>
      </div>
    </main>
  );
}
