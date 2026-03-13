import polyglotI18nProvider from "ra-i18n-polyglot";
import { en } from "./en";
import { de } from "./de";

const messages: Record<string, object> = {
  en,
  de,
};

export const getBrowserLocale = () => {
  const browserLocale = navigator.language.split("-")[0];
  return messages[browserLocale] ? browserLocale : "en";
};

export const resolveLocale = (setting: string | null) => {
  if (!setting || setting === "system") {
    return getBrowserLocale();
  }
  return messages[setting] ? setting : "en";
};

export const getLanguageSetting = () => {
  return localStorage.getItem("ra-language") || "system";
};

export const availableLocales = [
  { locale: "en", name: "English" },
  { locale: "de", name: "Deutsch" },
];

export const i18nProvider = polyglotI18nProvider(
  (locale) => messages[locale] || messages.en,
  resolveLocale(localStorage.getItem("ra-language")),
  availableLocales,
);
