import { useTranslation } from "react-i18next";

export default function NosotrosPage() {
  const { t } = useTranslation();

  return (
    <main className="flex-1 py-32 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto">
      <div className="max-w-4xl">

        <p className="text-brand font-bold tracking-widest uppercase text-sm mb-4">
          {t("nosotros.subtitle")}
        </p>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-foreground mb-8">
          {t("nosotros.titlePart1")} <span className="text-brand">{t("nosotros.titlePart2")}</span>
        </h1>

        <div className="prose dark:prose-invert prose-lg max-w-none text-muted-foreground text-justify space-y-6 mb-12">
          <p>{t("nosotros.p1")}</p>
          <p>{t("nosotros.p2")}</p>
          <p>{t("nosotros.p3")}</p>
          <p>{t("nosotros.p4")}</p>
        </div>

        {/* --- NUEVA SECCIÓN: MISIÓN, VISIÓN Y VALORES (Inspirado en imagen_644a86.jpg) --- */}
        <div className="space-y-6 mt-12">
          
          {/* Bloque Misión y Visión */}
          <div className="border border-border rounded-xl p-6 bg-card/50 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-brand mb-2">
                {t("nosotros.misionTitle")}
              </h2>
              <p className="text-muted-foreground text-justify leading-relaxed">
                {t("nosotros.misionText")}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-brand mb-2">
                {t("nosotros.visionTitle")}
              </h2>
              <p className="text-muted-foreground text-justify leading-relaxed">
                {t("nosotros.visionText")}
              </p>
            </div>
          </div>

          {/* Bloque de Valores Organizacionales */}
          <div className="space-y-4">
            {/* Cabecera del colapsable o sección de valores */}
            <div className="border border-border rounded-xl p-4 bg-card/50 flex items-center">
              <span className="text-brand mr-2 text-xs">▼</span>
              <h2 className="text-xl font-bold text-brand">
                {t("nosotros.valoresTitle")}
              </h2>
            </div>

            {/* Lista de Valores */}
            <div className="border border-border rounded-xl p-6 bg-card/50">
              <ul className="space-y-4 list-disc list-inside text-muted-foreground text-justify">
                <li className="leading-relaxed">
                  <strong className="text-foreground">{t("nosotros.val1Title")}:</strong> {t("nosotros.val1Text")}
                </li>
                <li className="leading-relaxed">
                  <strong className="text-foreground">{t("nosotros.val2Title")}:</strong> {t("nosotros.val2Text")}
                </li>
                <li className="leading-relaxed">
                  <strong className="text-foreground">{t("nosotros.val3Title")}:</strong> {t("nosotros.val3Text")}
                </li>
                <li className="leading-relaxed">
                  <strong className="text-foreground">{t("nosotros.val4Title")}:</strong> {t("nosotros.val4Text")}
                </li>
                <li className="leading-relaxed">
                  <strong className="text-foreground">{t("nosotros.val5Title")}:</strong> {t("nosotros.val5Text")}
                </li>
              </ul>
            </div>
          </div>

        </div>
        {/* --- FIN DE LA NUEVA SECCIÓN --- */}

      </div>
    </main>
  );
}
