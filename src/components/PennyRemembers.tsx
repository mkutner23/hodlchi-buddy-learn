import { useMemo } from "react";
import { useHodlchi } from "@/lib/hodlchi-store";
import { PATH_FRUIT, PATHS, type PathId } from "@/lib/lessons-data";
import { useI18n } from "@/lib/i18n";
import {
  daysSinceTs,
  getMilestones,
  lessonTitleFromKey,
  type Milestone,
} from "@/lib/penny-memory";

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

function relativeDay(ts: number, locale: "en" | "es", now = Date.now()): string {
  const d = daysSinceTs(ts, now);
  if (locale === "es") {
    if (d === 0) return "hoy";
    if (d === 1) return "ayer";
    if (d < 7) return `hace ${d} días`;
    if (d < 30) return `hace ${Math.floor(d / 7)} sem`;
    return `hace ${Math.floor(d / 30)} mes`;
  }
  if (d === 0) return "today";
  if (d === 1) return "yesterday";
  if (d < 7) return `${d} days ago`;
  if (d < 30) return `${Math.floor(d / 7)} wk ago`;
  return `${Math.floor(d / 30)} mo ago`;
}

function renderRow(
  m: Milestone,
  locale: "en" | "es",
  label: Record<PathId, string>,
): { icon: string; text: string; meta?: string } | null {
  const es = locale === "es";
  switch (m.kind) {
    case "hatched":
      return {
        icon: "🎂",
        text: es ? "Eclosioné" : "Hatched",
        meta: m.ts ? relativeDay(m.ts, locale) : undefined,
      };
    case "first-lesson": {
      const key = m.meta?.lessonKey as string | undefined;
      const t = key ? lessonTitleFromKey(key)?.title : null;
      if (!t) return null;
      return {
        icon: "🌱",
        text: (es ? "Primera lección: " : "First lesson: ") + t,
        meta: m.ts ? relativeDay(m.ts, locale) : undefined,
      };
    }
    case "first-streak":
      return {
        icon: "🔥",
        text: es ? "Volviste al día siguiente" : "You came back the next day",
        meta: m.ts ? relativeDay(m.ts, locale) : undefined,
      };
    case "first-investing":
      return {
        icon: PATH_FRUIT.investing,
        text: es ? "Primera lección de inversión" : "First Investing lesson",
        meta: m.ts ? relativeDay(m.ts, locale) : undefined,
      };
    case "first-evolution":
      return {
        icon: "✨",
        text: es ? "Primera evolución" : "First evolution",
        meta: m.ts ? relativeDay(m.ts, locale) : undefined,
      };
    case "longest-streak": {
      const days = Number(m.meta?.days ?? 0);
      return {
        icon: "🏆",
        text: es ? `Racha más larga: ${days} días` : `Longest streak: ${days} days`,
      };
    }
    case "favorite-topic": {
      const p = m.meta?.pathId as PathId | undefined;
      if (!p) return null;
      return {
        icon: PATH_FRUIT[p],
        text: es ? `Tema favorito: ${label[p]}` : `Favorite topic: ${label[p]}`,
      };
    }
    case "visits": {
      const n = Number(m.meta?.count ?? 0);
      return {
        icon: "👋",
        text: es ? `Nos hemos visto ${n} veces` : `We've met ${n} times`,
      };
    }
    default:
      return null;
  }
}

/**
 * "Penny Remembers" — a soft, personal memory strip. Makes returning users feel
 * recognized. Renders the milestone ledger from src/lib/penny-memory.ts so
 * every surface stays in sync.
 */
export function PennyRemembers() {
  const { state } = useHodlchi();
  const { locale } = useI18n();
  const label = locale === "es" ? PATH_LABEL_ES : PATH_LABEL_EN;

  const rows = useMemo(() => {
    return getMilestones(state)
      .map((m) => ({ m, row: renderRow(m, locale, label) }))
      .filter((x): x is { m: Milestone; row: NonNullable<ReturnType<typeof renderRow>> } => x.row !== null);
  }, [state, locale, label]);

  if (rows.length === 0) return null;

  return (
    <section className="mt-4 rounded-3xl bg-white/80 p-4 shadow-soft backdrop-blur">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-[11px] font-extrabold uppercase tracking-widest text-primary-deep">
          💭 {locale === "es" ? `${state.name} recuerda` : `${state.name} remembers`}
        </h2>
      </div>
      <ul className="mt-2 grid grid-cols-1 gap-1.5">
        {rows.map(({ m, row }) => (
          <li
            key={m.id}
            className="flex items-center gap-2 rounded-2xl bg-primary/10 px-3 py-2 text-sm font-semibold text-foreground/85"
          >
            <span className="text-base leading-none">{row.icon}</span>
            <span className="flex-1 truncate">{row.text}</span>
            {row.meta && (
              <span className="shrink-0 text-[11px] font-bold uppercase tracking-wider text-foreground/50">
                {row.meta}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
