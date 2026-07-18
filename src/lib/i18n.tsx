import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { STRINGS, type StringKey, type Locale } from "./i18n-strings";

interface I18nCtx {
  locale: Locale;
  t: (key: StringKey) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

/** Strip the /es prefix from a pathname. Returns "/" for "/es". */
export function stripLocalePrefix(pathname: string): string {
  if (pathname === "/es") return "/";
  if (pathname.startsWith("/es/")) return pathname.slice(3);
  return pathname;
}

/** Add the /es prefix to a pathname. Idempotent. */
export function addLocalePrefix(pathname: string, locale: Locale): string {
  const base = stripLocalePrefix(pathname);
  if (locale === "en") return base;
  if (base === "/") return "/es";
  return `/es${base}`;
}

export function localeFromPathname(pathname: string): Locale {
  return pathname === "/es" || pathname.startsWith("/es/") ? "es" : "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const locale = localeFromPathname(pathname);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const t = (key: StringKey) => STRINGS[locale][key] ?? STRINGS.en[key] ?? key;

  return <Ctx.Provider value={{ locale, t }}>{children}</Ctx.Provider>;
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
    return locale === "es" && f.es !== undefined ? f.es : f.en;
  }
  return field as T;
}
