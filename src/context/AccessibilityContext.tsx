import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import i18n from "@/lib/i18n";

interface AccessibilitySettings {
  textScale: number; // 100, 120, 150
  contrastMode: "default" | "high" | "inverted";
  dyslexicFriendly: boolean;
  readingMask: boolean;
  largeCursor: boolean;
  lineSpacing: "normal" | "relaxed" | "spacious";
  language: "es" | "en" | "qu";
  darkMode: boolean;
}

interface AccessibilityContextType extends AccessibilitySettings {
  setTextScale: (scale: number) => void;
  setContrastMode: (mode: "default" | "high" | "inverted") => void;
  setDyslexicFriendly: (enabled: boolean) => void;
  setReadingMask: (enabled: boolean) => void;
  setLargeCursor: (enabled: boolean) => void;
  setLineSpacing: (spacing: "normal" | "relaxed" | "spacious") => void;
  setLanguage: (lang: "es" | "en" | "qu") => void;
  setDarkMode: (enabled: boolean) => void;
  applyProfile: (profile: "default" | "lowVision" | "tdah" | "dyslexia") => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  textScale: 100,
  contrastMode: "default",
  dyslexicFriendly: false,
  readingMask: false,
  largeCursor: false,
  lineSpacing: "normal",
  language: "es",
  darkMode: false,
};

const STORAGE_KEY = "accessibility-settings";

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);
  const [mounted, setMounted] = useState(false);

  // Cargar configuración del localStorage al iniciar
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (error) {
        console.error("Error parsing accessibility settings:", error);
        setSettings(DEFAULT_SETTINGS);
      }
    }
    setMounted(true);
  }, []);

  // Guardar cambios en localStorage y aplicar estilos
  useEffect(() => {
    if (!mounted) return;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    applyAccessibilityStyles(settings);
  }, [settings, mounted]);

  // Sincronizar el idioma con i18next
  useEffect(() => {
    if (settings.language) {
      i18n.changeLanguage(settings.language);
    }
  }, [settings.language]);

  const updateSetting = useCallback(
    (key: keyof AccessibilitySettings, value: any) => {
      setSettings((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const setTextScale = (scale: number) => {
    if ([100, 120, 150].includes(scale)) {
      updateSetting("textScale", scale);
    }
  };

  const setContrastMode = (mode: "default" | "high" | "inverted") => {
    updateSetting("contrastMode", mode);
  };

  const setDyslexicFriendly = (enabled: boolean) => {
    updateSetting("dyslexicFriendly", enabled);
  };

  const setReadingMask = (enabled: boolean) => {
    updateSetting("readingMask", enabled);
  };

  const setLargeCursor = (enabled: boolean) => {
    updateSetting("largeCursor", enabled);
  };

  const setLineSpacing = (spacing: "normal" | "relaxed" | "spacious") => {
    updateSetting("lineSpacing", spacing);
  };

  const setLanguage = (lang: "es" | "en" | "qu") => {
    updateSetting("language", lang);
  };

  const setDarkMode = (enabled: boolean) => {
    updateSetting("darkMode", enabled);
  };

  const applyProfile = (profile: "default" | "lowVision" | "tdah" | "dyslexia") => {
    const profiles: Record<string, Partial<AccessibilitySettings>> = {
      default: DEFAULT_SETTINGS,
      lowVision: {
        textScale: 150,
        contrastMode: "high",
        largeCursor: true,
      },
      tdah: {
        textScale: 120,
        readingMask: true,
        largeCursor: true,
      },
      dyslexia: {
        textScale: 120,
        dyslexicFriendly: true,
        contrastMode: "high",
      },
    };

    const newSettings = { ...settings, ...profiles[profile] };
    setSettings(newSettings);
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value: AccessibilityContextType = {
    ...settings,
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
  };

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
};

/**
 * Aplica los estilos de accesibilidad al documento
 */
function applyAccessibilityStyles(settings: AccessibilitySettings) {
  const root = document.documentElement;

  // Escala de texto
  const fontSizeScale = {
    100: "16px",
    120: "19.2px",
    150: "24px",
  };
  root.style.setProperty("--accessibility-font-size-base", fontSizeScale[settings.textScale as keyof typeof fontSizeScale]);
  root.style.setProperty("--accessibility-text-scale", `${settings.textScale / 100}`);

  // Contraste
  const contrastClasses = {
    default: "",
    high: "accessibility-high-contrast",
    inverted: "accessibility-inverted-contrast",
  };
  document.body.classList.remove("accessibility-high-contrast", "accessibility-inverted-contrast");
  if (contrastClasses[settings.contrastMode]) {
    document.body.classList.add(contrastClasses[settings.contrastMode]);
  }

  // Fuente Dyslexia-friendly
  if (settings.dyslexicFriendly) {
    document.body.classList.add("accessibility-dyslexic-font");
  } else {
    document.body.classList.remove("accessibility-dyslexic-font");
  }

  // Cursor grande
  if (settings.largeCursor) {
    document.body.classList.add("accessibility-large-cursor");
  } else {
    document.body.classList.remove("accessibility-large-cursor");
  }

  // Espaciado de línea
  const lineSpacingClasses = {
    normal: "",
    relaxed: "accessibility-line-spacing-relaxed",
    spacious: "accessibility-line-spacing-spacious",
  };
  document.body.classList.remove("accessibility-line-spacing-relaxed", "accessibility-line-spacing-spacious");
  if (lineSpacingClasses[settings.lineSpacing]) {
    document.body.classList.add(lineSpacingClasses[settings.lineSpacing]);
  }

  // Idioma (para soporte futuro de i18next)
  root.setAttribute("lang", settings.language);

  // Modo Oscuro (Nocturno)
  if (settings.darkMode) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}
