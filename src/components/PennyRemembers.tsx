import { useMemo } from "react";
import { useHodlchi } from "@/lib/hodlchi-store";
import { PATH_FRUIT, PATHS, type PathId } from "@/lib/lessons-data";
import { useI18n } from "@/lib/i18n";

const PATH_LABEL_EN: Record<PathId, string> = {
  saving: "Saving",
  investing: "Investing",
  credit: "Credit",
  entrepreneurship: "Entrepreneurship",
  crypto: "Crypto",
};
const PATH_LABEL_ES: Record<PathId, string> = {
  saving: "Ahorro",
  investing: "Inversión",
  credit: "Crédito",
  entrepreneurship: "Emprendimiento",
  crypto: "Cripto",
};

function daysSince(ts: number, now: number = Date.now()) {
  return Math.max(0, Math.floor((now - ts) / 86400000));
}

function lessonTitle(key: string): string | null {
  const [pathId, lessonId] = key.split(":") as [PathId, string];
  const path = PATHS.find((p) => p.id === pathId);
  const lesson = path?.lessons.find((l) => l.id === lessonId);
  return lesson?.title ?? null;
}

/**
 * "Penny Remembers" — a soft, personal memory strip. Makes returning users feel
 * recognized. Only renders when there's something worth remembering.
 */
export function PennyRemembers() {
  const { state, favoritePath } = useHodlchi();
  const { locale } = useI18n();
  const label = locale === "es" ? PATH_LABEL_ES : PATH_LABEL_EN;

  const items = useMemo(() => {
    const out: Array<{ icon: string; text: string; key: string }> = [];
    const m = state.memory;
    if (m.firstHatchedAt) {
      const d = daysSince(m.firstHatchedAt);
      const line =
        locale === "es"
          ? d === 0
            ? "Nací hoy 🐣"
            : d === 1
              ? "Ayer eclosioné"
              : `Nací hace ${d} días`
          : d === 0
            ? "Hatched today 🐣"
            : d === 1
              ? "Hatched yesterday"
              : `Hatched ${d} days ago`;
      out.push({ icon: "🎂", text: line, key: "hatch" });
    }
    if (m.firstLessonKey) {
      const t = lessonTitle(m.firstLessonKey);
      if (t) {
        out.push({
          icon: "🌱",
          text: locale === "es" ? `Primera lección: ${t}` : `First lesson: ${t}`,
          key: "first-lesson",
        });
      }
    }
    if (m.longestStreak >= 2) {
      out.push({
        icon: "🔥",
        text:
          locale === "es"
            ? `Racha más larga: ${m.longestStreak} días`
            : `Longest streak: ${m.longestStreak} days`,
        key: "streak",
      });
    }
    const fav = favoritePath() as PathId | null;
    if (fav && state.completedLessons.length >= 2) {
      out.push({
        icon: PATH_FRUIT[fav],
        text: locale === "es" ? `Tema favorito: ${label[fav]}` : `Favorite topic: ${label[fav]}`,
        key: "fav",
      });
    }
    if (m.visitCount >= 3) {
      out.push({
        icon: "👋",
        text:
          locale === "es"
            ? `Nos vemos por visita nº ${m.visitCount}`
            : `We've met ${m.visitCount} times`,
        key: "visits",
      });
    }
    return out;
  }, [state, favoritePath, locale, label]);

  if (items.length === 0) return null;

  return (
    <section className="mt-4 rounded-3xl bg-white/80 p-4 shadow-soft backdrop-blur">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-[11px] font-extrabold uppercase tracking-widest text-primary-deep">
          💭 {locale === "es" ? `${state.name} recuerda` : `${state.name} remembers`}
        </h2>
      </div>
      <ul className="mt-2 grid grid-cols-1 gap-1.5">
        {items.map((it) => (
          <li
            key={it.key}
            className="flex items-center gap-2 rounded-2xl bg-primary/10 px-3 py-2 text-sm font-semibold text-foreground/85"
          >
            <span className="text-base leading-none">{it.icon}</span>
            <span className="truncate">{it.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
