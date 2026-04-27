export default function AboutPage() {
  return (
    <main className="flex-1 py-32 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto">
      <div className="max-w-4xl">
        
        <p className="text-brand font-bold tracking-widest uppercase text-sm mb-4">
          Sobre Nosotros
        </p>

        <h1 className="text-4xl sm:text-6xl font-poppins font-extrabold text-white mb-8">
          Pasión por la <span className="text-brand">montaña</span>
        </h1>

        <div className="prose prose-invert prose-lg max-w-none text-slate-400 text-justify space-y-6">
          
          <p>
            LlamaTours nació con la idea de compartir la belleza inexplorada de los Andes con el mundo,
            ofreciendo experiencias únicas que combinan aventura, cultura y confort. Creemos que viajar
            no solo es desplazarse, sino conectar profundamente con los paisajes, las personas y las historias
            que hacen de cada destino algo inolvidable.
          </p>

          <p>
            Nuestro equipo está conformado por guías locales expertos, apasionados por la montaña y comprometidos
            con brindar experiencias seguras, auténticas y enriquecedoras. Cada ruta, cada expedición y cada detalle
            ha sido cuidadosamente diseñado para que nuestros viajeros vivan algo más que un simple recorrido.
          </p>

          <p>
            Nos diferenciamos por ofrecer un equilibrio entre aventura y elegancia, permitiendo que tanto exploradores
            experimentados como viajeros primerizos puedan disfrutar de destinos de alta montaña con el respaldo de un
            servicio profesional y cercano.
          </p>

          <p>
            En LlamaTours, no solo organizamos viajes: creamos recuerdos que perduran en el tiempo, fomentamos el respeto
            por la naturaleza y promovemos el turismo responsable en cada paso que damos.
          </p>

        </div>

      </div>
    </main>
  );
}
