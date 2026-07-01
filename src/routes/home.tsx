import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { HodlchiAvatar } from "@/components/HodlchiAvatar";
import { PATHS, getDailyChallenge } from "@/lib/lessons-data";
import {
  useHodlchi,
  stageForLevel,
  progressToNextStage,
  type Mood,
} from "@/lib/hodlchi-store";

export const Route = createFileRoute("/home")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Your Hodlchi — Home" },
      {
        name: "description",
        content:
          "Feed your Hodlchi with a lesson, keep your streak alive, and evolve from Egg to Wealth Sage.",
      },
      { property: "og:title", content: "Your Hodlchi — Home" },
      {
        property: "og:description",
        content: "Daily lessons feed your Hodlchi. Come back tomorrow to keep the streak alive.",
      },
      { property: "og:url", content: "https://demo.hodlchi.com/home" },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: "https://demo.hodlchi.com/home" }],
  }),
});

const MOOD_LINE: Record<Mood, string> = {
  hungry: "I'm hungry… feed me a lesson?",
  happy: "That felt great! Ready for more?",
  focused: "I'm learning. Let's keep going.",
  tired: "One more lesson and I'll rest well.",
};

function Home() {
  const nav = useNavigate();
  const { state, reset, demoMode } = useHodlchi();
  const [showTools, setShowTools] = useState(false);
  const [wobble, setWobble] = useState(false);

  useEffect(() => {
    if (!state.onboarded) nav({ to: "/onboarding" });
  }, [state.onboarded, nav]);

  const stage = stageForLevel(state.level);
  const prog = progressToNextStage(state.level, state.xp);
  const challenge = useMemo(() => getDailyChallenge(), []);
  const totalLessons = PATHS.reduce((n, p) => n + p.lessons.length, 0);
  const doneLessons = state.completedLessons.length;
  const isFirstTime = doneLessons === 0;

  const nextLesson = useMemo(() => {
    for (const path of PATHS) {
      for (const lesson of path.lessons) {
        if (!state.completedLessons.includes(`${path.id}:${lesson.id}`)) {
          return { path, lesson };
        }
      }
    }
    return null;
  }, [state.completedLessons]);

  if (!state.onboarded) return null;

  const goNext = () => {
    if (!nextLesson) return;
    nav({
      to: "/lesson/$pathId/$lessonId",
      params: { pathId: nextLesson.path.id, lessonId: nextLesson.lesson.id },
    });
  };

  return (
    <main className="min-h-screen bg-gradient-sky pb-16">
      <div className="mx-auto max-w-md px-5 pt-5">
        {/* Slim top bar: identity + core signals */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-foreground text-primary text-sm font-black">
              H
            </div>
            <span className="text-sm font-bold text-foreground/70">Hodlchi</span>
          </div>
          <div className="flex items-center gap-2">
            <Stat icon="🔥" value={state.streak} label="streak" />
            <Stat icon="⭐" value={state.xp} label="xp" />
          </div>
        </div>

        {/* Hero companion — the emotional anchor */}
        <section className="mt-4 text-center">
          <button
            onClick={() => {
              setWobble(true);
              setTimeout(() => setWobble(false), 600);
            }}
            className="mx-auto block"
            aria-label={`Pet ${state.name}`}
          >
            <div className={wobble ? "animate-wobble" : ""}>
              <HodlchiAvatar
                egg={state.egg}
                personality={state.personality}
                stage={stage}
                size={180}
              />
            </div>
          </button>

          {/* Speech bubble — makes the need explicit */}
          <div className="relative mx-auto mt-1 inline-block max-w-[18rem] rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold shadow-soft">
            <span className="mr-1 font-extrabold">{state.name}:</span>
            <span className="text-foreground/80">{MOOD_LINE[state.mood]}</span>
            <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-white" />
          </div>

          {/* Stage + evolution ring */}
          <div className="mt-4 rounded-3xl bg-white/80 p-4 backdrop-blur">
            <div className="flex items-baseline justify-between">
              <div className="text-left">
                <div className="text-[10px] font-bold uppercase tracking-widest text-primary-deep">
                  Stage
                </div>
                <div className="text-lg font-extrabold leading-tight">{stage}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">
                  Next
                </div>
                <div className="text-sm font-bold text-foreground/70">{prog.nextStage}</div>
              </div>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-foreground/10">
              <div
                className="h-full bg-gradient-primary transition-all"
                style={{ width: `${prog.pct}%` }}
              />
            </div>
            <div className="mt-1 text-right text-[11px] font-semibold text-foreground/50">
              {prog.pct}% to evolve
            </div>
          </div>
        </section>

        {/* THE primary action — feed = learn */}
        <button
          onClick={goNext}
          disabled={!nextLesson}
          className="mt-5 flex w-full items-center justify-between rounded-2xl bg-foreground px-5 py-4 text-left font-bold text-primary shadow-pop transition active:scale-[0.98] disabled:opacity-40"
        >
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
              {isFirstTime ? "Start here" : "Feed with a lesson"}
            </div>
            <div className="mt-0.5 text-base leading-tight">
              {nextLesson
                ? `${nextLesson.path.emoji}  ${nextLesson.lesson.title}`
                : "All lessons complete 🎉"}
            </div>
            {nextLesson && (
              <div className="mt-0.5 text-[11px] font-semibold text-primary/70">
                {nextLesson.lesson.minutes} min · +30 XP
              </div>
            )}
          </div>
          <span className="text-2xl">→</span>
        </button>

        {/* First-time explainer — the loop, in 4 beats */}
        {isFirstTime && (
          <section className="mt-4 rounded-2xl border-2 border-dashed border-primary-deep/30 bg-primary/10 p-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-primary-deep">
              How Hodlchi grows
            </div>
            <ol className="mt-2 grid grid-cols-4 gap-2 text-center">
              <LoopStep n="1" emoji="📚" label="Learn" />
              <LoopStep n="2" emoji="🍎" label="Feed" />
              <LoopStep n="3" emoji="⭐" label="XP" />
              <LoopStep n="4" emoji="✨" label="Evolve" />
            </ol>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-primary-deep">
              <span>🔥</span>
              <span>Come back tomorrow to keep the streak alive</span>
            </div>
          </section>
        )}

        {/* Daily challenge — small, secondary */}
        {!isFirstTime && (
          <section className="mt-4 flex items-center gap-3 rounded-2xl bg-white/70 p-3 backdrop-blur">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/25 text-lg">
              🎯
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">
                Today's challenge
              </div>
              <div className="truncate text-sm font-semibold">{challenge}</div>
            </div>
          </section>
        )}

        {/* Paths — quiet, browsable */}
        <section className="mt-6">
          <div className="flex items-baseline justify-between px-1">
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-foreground/60">
              Paths
            </h2>
            <div className="text-[11px] font-semibold text-foreground/50">
              {doneLessons}/{totalLessons} done
            </div>
          </div>
          <div className="mt-2 grid gap-2">
            {PATHS.map((p) => {
              const done = p.lessons.filter((l) =>
                state.completedLessons.includes(`${p.id}:${l.id}`),
              ).length;
              const pct = Math.round((done / p.lessons.length) * 100);
              const isNext = nextLesson?.path.id === p.id;
              return (
                <Link
                  key={p.id}
                  to="/path/$pathId"
                  params={{ pathId: p.id }}
                  className={`flex items-center gap-3 rounded-2xl bg-white/80 p-3 backdrop-blur transition active:scale-[0.99] ${
                    isNext ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/25 text-xl">
                    {p.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-bold">{p.title}</div>
                      {isNext && (
                        <span className="rounded-full bg-foreground px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
                          Up next
                        </span>
                      )}
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-foreground/10">
                      <div className="h-full bg-primary-deep" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div className="text-xs font-bold text-foreground/50">
                    {done}/{p.lessons.length}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Tucked-away tools */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowTools((v) => !v)}
            className="text-[11px] font-semibold text-foreground/40 underline underline-offset-2"
          >
            {showTools ? "Hide" : "Mentor / reset"}
          </button>
          {showTools && (
            <div className="mx-auto mt-3 flex max-w-xs justify-center gap-2">
              <button
                onClick={() => {
                  if (confirm("Reset your Hodlchi and start over?")) {
                    reset();
                    nav({ to: "/" });
                  }
                }}
                className="rounded-full border border-foreground/15 bg-white px-3 py-1.5 text-[11px] font-semibold"
              >
                Reset
              </button>
              <button
                onClick={demoMode}
                className="rounded-full bg-foreground px-3 py-1.5 text-[11px] font-semibold text-primary"
              >
                Demo mode
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function Stat({ icon, value, label }: { icon: string; value: number; label: string }) {
  return (
    <div
      className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-bold shadow-soft"
      aria-label={`${value} ${label}`}
    >
      <span>{icon}</span>
      <span>{value}</span>
    </div>
  );
}

function LoopStep({ n, emoji, label }: { n: string; emoji: string; label: string }) {
  return (
    <li className="rounded-xl bg-white/80 py-2">
      <div className="text-[9px] font-bold text-primary-deep">{n}</div>
      <div className="text-lg leading-none">{emoji}</div>
      <div className="mt-1 text-[10px] font-bold">{label}</div>
    </li>
  );
}
