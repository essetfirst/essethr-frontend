import en from "./locales/en.json";
import am from "./locales/am.json";
import ti from "./locales/ti.json";

export const LOCALES = {
  en: { label: "English", messages: en, dir: "ltr" },
  am: { label: "አማርኛ", messages: am, dir: "ltr" },
  ti: { label: "ትግርኛ", messages: ti, dir: "ltr" },
};

export const DEFAULT_LOCALE = "en";
export const LOCALE_STORAGE_KEY = "essethr.locale";

export function getStoredLocale() {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
  return LOCALES[saved] ? saved : DEFAULT_LOCALE;
}

export function flattenMessages(nested, prefix = "") {
  return Object.entries(nested).reduce((acc, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(acc, flattenMessages(value, path));
    } else {
      acc[path] = String(value);
    }
    return acc;
  }, {});
}
