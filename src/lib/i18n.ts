import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import arTranslations from "../locales/ar.json";
import enTranslations from "../locales/en.json";

// Set up translations
const resources = {
  ar: {
    translation: arTranslations,
  },
  en: {
    translation: enTranslations,
  },
};

i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  .init({
    resources,
    fallbackLng: "ar",
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
