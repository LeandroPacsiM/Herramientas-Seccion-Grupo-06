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

        <div className="prose dark:prose-invert prose-lg max-w-none text-muted-foreground text-justify space-y-6">

          <p>
            {t("nosotros.p1")}
          </p>

          <p>
            {t("nosotros.p2")}
          </p>

          <p>
            {t("nosotros.p3")}
          </p>

          <p>
            {t("nosotros.p4")}
          </p>

        </div>

      </div>
    </main>
  );
}
