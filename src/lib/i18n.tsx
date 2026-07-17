import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { STRINGS, type StringKey, type Locale } from "./i18n-strings";

interface I18nCtx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: StringKey) => string;
}

const Ctx = createContext<I18nCtx | null>(null);
const STORAGE_KEY = "hodlchi-locale";

function loadLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const v = localStorage.getItem(STORAGE_KEY);
  return v === "es" ? "es" : "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => loadLocale());

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, l);
  };

  const t = (key: StringKey) => STRINGS[locale][key] ?? STRINGS.en[key] ?? key;

  return <Ctx.Provider value={{ locale, setLocale, t }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useI18n must be inside I18nProvider");
  return c;
}

export function useLocale(): Locale {
  return useI18n().locale;
}

/** Pick the right side of a bilingual field. Fall back to English if the ES value is missing. */
export function pick<T>(field: { en: T; es?: T } | T, locale: Locale): T {
  if (field && typeof field === "object" && "en" in (field as object)) {
    const f = field as { en: T; es?: T };
    return (locale === "es" && f.es !== undefined ? f.es : f.en);
  }
  return field as T;
}
