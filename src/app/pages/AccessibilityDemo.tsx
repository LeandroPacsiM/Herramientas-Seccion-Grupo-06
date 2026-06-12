import ReadingMask, { ReadingMaskLine } from "@/app/components/shared/ReadingMask";
import { useTranslation } from "react-i18next";

/**
 * AccessibilityDemo Page
 * 
 * Página de demostración que muestra cómo usar el sistema de accesibilidad
 */
export default function AccessibilityDemo() {
  const { t } = useTranslation();

  return (
    <ReadingMask>
      <div className="max-w-4xl mx-auto p-8 space-y-12">
        <section>
          <h1 className="text-4xl font-bold mb-6">Sistema de Accesibilidad - Demo</h1>
          <p className="text-lg text-gray-600">
            Esta página demuestra cómo el sistema de accesibilidad funciona con diferentes 
            configuraciones. Abre el menú de accesibilidad (botón azul inferior derecha) 
            para probar las diferentes opciones.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">Características Implementadas</h2>
          <div className="space-y-4">
            <ReadingMaskLine>
              <h3 className="text-xl font-semibold mb-2">1. Escalado de Texto</h3>
              <p>
                Prueba cambiar el tamaño del texto a 120% o 150% desde el menú de accesibilidad. 
                Todos los elementos escalan proporcionalmente.
              </p>
            </ReadingMaskLine>

            <ReadingMaskLine>
              <h3 className="text-xl font-semibold mb-2">2. Modos de Contraste</h3>
              <p>
                Selecciona entre Predeterminado, Alto Contraste e Invertido. Estas opciones 
                mejoran la legibilidad para usuarios con visión baja.
              </p>
            </ReadingMaskLine>

            <ReadingMaskLine>
              <h3 className="text-xl font-semibold mb-2">3. Fuente Dislexia-Amigable</h3>
              <p>
                Activa la fuente OpenDyslexic que utiliza un diseño especial para mejorar 
                la legibilidad en usuarios con dislexia.
              </p>
            </ReadingMaskLine>

            <ReadingMaskLine>
              <h3 className="text-xl font-semibold mb-2">4. Máscara de Lectura</h3>
              <p>
                Oscurece el contenido fuera del área de lectura actual, reduciendo distracciones. 
                Especialmente útil para TDAH.
              </p>
            </ReadingMaskLine>

            <ReadingMaskLine>
              <h3 className="text-xl font-semibold mb-2">5. Cursor Grande</h3>
              <p>
                Aumenta el tamaño y la visibilidad del cursor del ratón, facilitando su 
                ubicación en pantalla.
              </p>
            </ReadingMaskLine>

            <ReadingMaskLine>
              <h3 className="text-xl font-semibold mb-2">6. Soporte Multiidioma</h3>
              <p>
                Cambia entre Español, English y Quechua. Las preferencias se guardan automáticamente 
                en tu navegador.
              </p>
            </ReadingMaskLine>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">Perfiles Predefinidos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border-2 border-blue-200 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Visión Baja</h3>
              <ul className="space-y-1 text-sm">
                <li>• Texto: 150%</li>
                <li>• Contraste: Alto</li>
                <li>• Cursor: Grande</li>
              </ul>
            </div>

            <div className="p-4 border-2 border-green-200 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">TDAH</h3>
              <ul className="space-y-1 text-sm">
                <li>• Texto: 120%</li>
                <li>• Máscara de Lectura: Activada</li>
                <li>• Cursor: Grande</li>
              </ul>
            </div>

            <div className="p-4 border-2 border-purple-200 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Dislexia</h3>
              <ul className="space-y-1 text-sm">
                <li>• Texto: 120%</li>
                <li>• Fuente: OpenDyslexic</li>
                <li>• Contraste: Alto</li>
              </ul>
            </div>

            <div className="p-4 border-2 border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Normal</h3>
              <ul className="space-y-1 text-sm">
                <li>• Configuración predeterminada</li>
                <li>• Sin cambios especiales</li>
                <li>• Restaura valores por defecto</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">Atajos de Teclado</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="font-semibold mb-2">Presiona <kbd className="bg-white px-2 py-1 border rounded">Alt+A</kbd> para abrir/cerrar el menú de accesibilidad</p>
            <p className="text-sm text-gray-600">
              Funciona desde cualquier página de la aplicación.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">Persistencia de Datos</h2>
          <p className="mb-4">
            Tus preferencias de accesibilidad se guardan automáticamente en tu navegador. 
            Cuando vuelvas a visitar la aplicación, se cargarán tus configuraciones previas.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm">
              💾 Los datos se almacenan en <code className="bg-gray-200 px-2 py-1 rounded text-xs">localStorage</code> 
              con la clave <code className="bg-gray-200 px-2 py-1 rounded text-xs">accessibility-settings</code>
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">Próximas Mejoras</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>Testing exhaustivo con herramientas de accesibilidad</li>
            <li>Validación WCAG 2.1 AA compliance</li>
            <li>Integración con backend para sincronización por usuario</li>
            <li>Más perfiles y opciones personalizadas</li>
          </ul>
        </section>
      </div>
    </ReadingMask>
  );
}
