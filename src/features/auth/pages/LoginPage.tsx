import LoginForm from "../components/LoginForm";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <main className="flex-1 py-32 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <p className="text-brand font-bold tracking-widest uppercase text-sm mb-4">{t("auth.welcome")}</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4">
            {t("auth.loginTitlePart1")} <span className="text-brand">{t("auth.loginTitlePart2")}</span>
          </h1>
          <p className="text-muted-foreground">
            {t("auth.loginDesc")}
          </p>
        </div>

        <div className="glass-panel p-8 rounded-2xl">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
