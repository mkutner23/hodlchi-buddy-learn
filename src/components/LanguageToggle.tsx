import { useI18n } from "@/lib/i18n";
import { sfx } from "@/lib/sfx";

/** Fixed pill in the top-right corner. Toggles EN ↔ ES globally. */
export function LanguageToggle() {
  const { locale, setLocale, t } = useI18n();
  const isEs = locale === "es";

  const toggle = () => {
    sfx.pop();
    setLocale(isEs ? "en" : "es");
  };


  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t("lang.switch")}
      className="fixed right-3 top-3 z-50 flex items-center gap-1 rounded-full border border-black/10 bg-white/90 px-2.5 py-1 text-[11px] font-semibold shadow-soft backdrop-blur transition hover:bg-white active:scale-95 dark:bg-black/60 dark:text-white print:hidden"
    >
      <span className={isEs ? "opacity-50" : "text-primary"}>{t("lang.en")}</span>
      <span aria-hidden className="opacity-40">·</span>
      <span className={isEs ? "text-primary" : "opacity-50"}>{t("lang.es")}</span>
    </button>
  );
}
