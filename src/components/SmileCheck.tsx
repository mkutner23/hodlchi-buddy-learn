import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics-client";
import { useHodlchi } from "@/lib/hodlchi-store";
import { useI18n } from "@/lib/i18n";

/**
 * "Penny made me smile today" micro-survey.
 *
 * This is the north-star measurement instrument: we don't care about lesson
 * counts or XP — we care whether Penny produced a warm feeling. Shown at most
 * once per day, and only after the user has completed at least one lesson
 * (otherwise the answer is meaningless).
 *
 * Response is logged to analytics as `smile_check.{yes|meh|no}` and cached
 * locally so we don't re-ask on the same day.
 */

const STORAGE_KEY = "hodlchi-smile-check-v1";

interface CacheShape {
  lastAskedDay: string | null;
  lastAnswer: "yes" | "meh" | "no" | null;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function loadCache(): CacheShape {
  if (typeof window === "undefined") return { lastAskedDay: null, lastAnswer: null };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { lastAskedDay: null, lastAnswer: null };
    return JSON.parse(raw) as CacheShape;
  } catch {
    return { lastAskedDay: null, lastAnswer: null };
  }
}

function saveCache(c: CacheShape) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
}

export function SmileCheck() {
  const { state } = useHodlchi();
  const { locale } = useI18n();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!state.onboarded) return;
    if (state.completedLessons.length < 1) return;
    const cache = loadCache();
    if (cache.lastAskedDay === today()) return;
    // small delay so it doesn't fight the hero for attention on load
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, [state.onboarded, state.completedLessons.length]);

  if (!visible || dismissed) return null;

  const answer = (rating: "yes" | "meh" | "no") => {
    saveCache({ lastAskedDay: today(), lastAnswer: rating });
    trackEvent("smile_check", {
      rating,
      streak: state.streak,
      xp: state.xp,
      completed: state.completedLessons.length,
    });
    setDismissed(true);
  };

  const dismiss = () => {
    saveCache({ lastAskedDay: today(), lastAnswer: null });
    trackEvent("smile_check_dismissed", { streak: state.streak });
    setDismissed(true);
  };

  const es = locale === "es";
  const question = es
    ? `¿${state.name || "Penny"} te hizo sonreír hoy?`
    : `Did ${state.name || "Penny"} make you smile today?`;

  return (
    <section
      className="mt-4 rounded-2xl border border-primary-deep/20 bg-white/90 p-4 shadow-soft backdrop-blur"
      aria-label={question}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-bold uppercase tracking-widest text-primary-deep">
            {es ? "Un momento" : "One quick moment"}
          </div>
          <div className="mt-0.5 font-display text-base font-extrabold leading-tight">
            {question}
          </div>
        </div>
        <button
          onClick={dismiss}
          aria-label={es ? "Cerrar" : "Dismiss"}
          className="text-foreground/40 hover:text-foreground/70"
        >
          ×
        </button>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <button
          onClick={() => answer("yes")}
          className="btn-squish rounded-2xl bg-primary/15 py-3 text-2xl hover:bg-primary/25"
          aria-label={es ? "Sí" : "Yes"}
        >
          😊
        </button>
        <button
          onClick={() => answer("meh")}
          className="btn-squish rounded-2xl bg-foreground/5 py-3 text-2xl hover:bg-foreground/10"
          aria-label={es ? "Más o menos" : "Kind of"}
        >
          🙂
        </button>
        <button
          onClick={() => answer("no")}
          className="btn-squish rounded-2xl bg-foreground/5 py-3 text-2xl hover:bg-foreground/10"
          aria-label={es ? "No mucho" : "Not really"}
        >
          😐
        </button>
      </div>
      <div className="mt-2 text-center text-[11px] font-semibold text-foreground/50">
        {es
          ? "Nos ayuda a saber si Penny se siente viva."
          : "Helps us know whether Penny feels alive."}
      </div>
    </section>
  );
}
