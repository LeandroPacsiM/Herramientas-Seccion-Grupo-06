import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import esTranslation from '../locales/es.json';
import enTranslation from '../locales/en.json';
import quTranslation from '../locales/qu.json';

const resources = {
  es: {
    translation: esTranslation,
  },
  en: {
    translation: enTranslation,
  },
  qu: {
    translation: quTranslation,
  },
};

i18n
  // Detectar idioma del navegador automáticamente
  .use(LanguageDetector)
  // Inicializar react-i18next
  .use(initReactI18next)
  // Configuración
  .init({
    resources,
    fallbackLng: 'es', // Idioma por defecto si no está disponible
    ns: ['translation'],
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false, // React protege contra XSS
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
