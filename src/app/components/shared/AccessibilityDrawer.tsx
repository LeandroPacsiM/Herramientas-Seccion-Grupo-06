import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAccessibility } from "@/context/AccessibilityContext";
import { X } from "lucide-react";

export default function AccessibilityDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const {
    textScale,
    contrastMode,
    dyslexicFriendly,
    readingMask,
    largeCursor,
    lineSpacing,
    language,
    darkMode,
    setTextScale,
    setContrastMode,
    setDyslexicFriendly,
    setReadingMask,
    setLargeCursor,
    setLineSpacing,
    setLanguage,
    setDarkMode,
    applyProfile,
    resetSettings,
  } = useAccessibility();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "a") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("toggle-accessibility", handleToggle);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("toggle-accessibility", handleToggle);
    };
  }, []);

  const [profileValue, setProfileValue] = useState("");

  const isTextScaleActive = textScale !== 100;
  const isContrastActive = contrastMode !== "default";
  const isLineSpacingActive = lineSpacing !== "normal";

  const cycleTextScale = () => {
    const order = [100, 120, 150];
    const idx = order.indexOf(textScale);
    setTextScale(order[(idx + 1) % order.length]);
  };

  const cycleContrast = () => {
    const order = ["default", "high", "inverted"] as const;
    const idx = order.indexOf(contrastMode);
    setContrastMode(order[(idx + 1) % order.length]);
  };

  const cycleLineSpacing = () => {
    const order = ["normal", "relaxed", "spacious"] as const;
    const idx = order.indexOf(lineSpacing);
    setLineSpacing(order[(idx + 1) % order.length]);
  };

  const btnBase = "flex flex-col items-center justify-center border rounded-xl p-4 shadow-sm hover:shadow-md transition-all group cursor-pointer";
  const btnInactive = "bg-card border-border hover:border-primary";
  const btnActive = "bg-primary/10 border-primary shadow-md";

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-foreground shadow-lg flex items-center justify-center transition-all focus-visible:outline-4 focus-visible:outline-offset-2"
        aria-label={t("accessibility.openAccessibility")}
        title={t("accessibility.keyboardShortcut")}
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4,8 L11,8 L11,14 L7,21 M20,8 L13,8 L13,14 L17,21 M12,5 C12.55,5 13,4.55 13,4 C13,3.45 12.55,3 12,3 C11.45,3 11,3.45 11,4 C11,4.55 11.45,5 12,5 Z M11,8 L13,8 L13,13 L11,13 L11,8 Z" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-background/50 z-40"
            onClick={() => setIsOpen(false)}
            role="presentation"
            aria-hidden="true"
          />

          <div
            className="fixed right-0 top-0 h-screen w-96 bg-background border-l border-border flex flex-col shadow-lg z-50"
            role="dialog"
            aria-labelledby="accessibility-drawer-title"
            aria-modal="true"
          >
            <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between text-sm font-semibold">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm3.5 3.25a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5zm5 0a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5z"/>
                </svg>
                <span id="accessibility-drawer-title">{t("accessibility.menu")}</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-primary/20 p-1 rounded transition-colors"
                aria-label={t("accessibility.closeMenu")}
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4 flex flex-col gap-4 flex-1 overflow-y-auto">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">{t("accessibility.language")}:</label>
                <div className="relative">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as "es" | "en" | "qu")}
                    className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm appearance-none focus:outline-none focus:border-primary cursor-pointer shadow-sm text-foreground"
                    aria-label={t("accessibility.language")}
                  >
                    <option value="es">{t("accessibility.spanish")}</option>
                    <option value="en">{t("accessibility.english")}</option>
                    <option value="qu">{t("accessibility.quechua")}</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">{t("accessibility.profile")}</label>
                <div className="relative">
                  <select
                    value={profileValue}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val) {
                        applyProfile(val as "default" | "lowVision" | "tdah" | "dyslexia");
                        setProfileValue("");
                      }
                    }}
                    className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm appearance-none focus:outline-none focus:border-primary cursor-pointer shadow-sm text-foreground"
                    aria-label={t("accessibility.profile")}
                  >
                    <option value="">{t("accessibility.selectProfile")}</option>
                    <option value="default">{t("accessibility.presetDefault")}</option>
                    <option value="lowVision">{t("accessibility.presetLowVision")}</option>
                    <option value="tdah">{t("accessibility.presetTdah")}</option>
                    <option value="dyslexia">{t("accessibility.presetDyslexia")}</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <hr className="border-border my-1" />

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`${btnBase} col-span-2 ${darkMode ? btnActive : btnInactive} flex-row gap-3 py-3 px-5 justify-start`}
                  aria-pressed={darkMode}
                  aria-label="Modo Nocturno"
                >
                  <svg className={`w-6 h-6 transition-colors ${darkMode ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/>
                  </svg>
                  <div className="text-left flex-grow">
                    <span className="text-sm font-semibold text-foreground block">
                      Modo Nocturno
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {darkMode ? "Activado" : "Desactivado"}
                    </span>
                  </div>
                </button>

                <button
                  onClick={cycleTextScale}
                  className={`${btnBase} ${isTextScaleActive ? btnActive : btnInactive}`}
                  aria-pressed={isTextScaleActive}
                  aria-label={t("accessibility.textSize")}
                >
                  <span className={`text-xl font-bold transition-colors ${isTextScaleActive ? "text-primary" : "text-foreground group-hover:text-primary"}`}>tT</span>
                  <span className="text-xs font-medium mt-2 text-center text-foreground">
                    {t("accessibility.textSize")}
                  </span>
                </button>

                <button
                  onClick={cycleContrast}
                  className={`${btnBase} ${isContrastActive ? btnActive : btnInactive}`}
                  aria-pressed={isContrastActive}
                  aria-label={t("accessibility.contrast")}
                >
                  <svg className={`w-6 h-6 transition-colors ${isContrastActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2A10 10 0 002 12a10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8v16z"/>
                  </svg>
                  <span className="text-xs font-medium mt-2 text-center text-foreground">
                    {t("accessibility.contrast")}
                  </span>
                </button>

                <button
                  onClick={() => setLargeCursor(!largeCursor)}
                  className={`${btnBase} ${largeCursor ? btnActive : btnInactive}`}
                  aria-pressed={largeCursor}
                  aria-label={t("accessibility.cursorLabel")}
                >
                  <svg className={`w-6 h-6 transition-colors ${largeCursor ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5"/>
                  </svg>
                  <span className="text-xs font-medium mt-2 text-center text-foreground">
                    {t("accessibility.cursorLabel")}
                  </span>
                </button>

                <button
                  onClick={() => setReadingMask(!readingMask)}
                  className={`${btnBase} ${readingMask ? btnActive : btnInactive}`}
                  aria-pressed={readingMask}
                  aria-label={t("accessibility.readingMask")}
                >
                  <svg className={`w-6 h-6 transition-colors ${readingMask ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                  </svg>
                  <span className="text-xs font-medium mt-2 text-center text-foreground">
                    {t("accessibility.readingMask")}
                  </span>
                </button>

                <button
                  onClick={() => setDyslexicFriendly(!dyslexicFriendly)}
                  className={`${btnBase} ${dyslexicFriendly ? btnActive : btnInactive}`}
                  aria-pressed={dyslexicFriendly}
                  aria-label={t("accessibility.dyslexicLabel")}
                >
                  <span className={`text-lg font-extrabold tracking-tighter transition-colors ${dyslexicFriendly ? "text-primary" : "text-foreground group-hover:text-primary"}`}>AZ</span>
                  <span className="text-xs font-medium mt-2 text-center text-foreground">
                    {t("accessibility.dyslexicLabel")}
                  </span>
                </button>

                <button
                  onClick={cycleLineSpacing}
                  className={`${btnBase} ${isLineSpacingActive ? btnActive : btnInactive}`}
                  aria-pressed={isLineSpacingActive}
                  aria-label={t("accessibility.lineSpacing")}
                >
                  <svg className={`w-6 h-6 transition-colors ${isLineSpacingActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h10M7 16h10M3 4v16M21 4v16"/>
                  </svg>
                  <span className="text-xs font-medium mt-2 text-center text-foreground">
                    {t("accessibility.lineSpacing")}
                  </span>
                </button>
              </div>
            </div>

            <div className="p-4 bg-muted border-t border-border flex justify-center">
              <button
                onClick={resetSettings}
                className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors py-2 px-4 rounded-lg hover:bg-accent"
                aria-label={t("common.reset")}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.212 9H18.5"/>
                </svg>
                <span>{t("common.reset")}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
