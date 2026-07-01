import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
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
});

const MOOD_META: Record<Mood, { emoji: string; label: string }> = {
  hungry: { emoji: "🍽️", label: "Hungry for a lesson" },
  happy: { emoji: "😄", label: "Happy" },
  focused: { emoji: "🧠", label: "Focused" },
  tired: { emoji: "😴", label: "A bit tired" },
};

function Home() {
  const nav = useNavigate();
  const { state, reset, demoMode } = useHodlchi();

  useEffect(() => {
    if (!state.onboarded) nav({ to: "/onboarding" });
  }, [state.onboarded, nav]);

  const stage = stageForLevel(state.level);
  const prog = progressToNextStage(state.level, state.xp);
  const challenge = useMemo(() => getDailyChallenge(), []);
  const totalLessons = PATHS.reduce((n, p) => n + p.lessons.length, 0);
  const doneLessons = state.completedLessons.length;

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

  return (
    <main className="min-h-screen bg-gradient-sky pb-24">
      <div className="mx-auto max-w-md px-5 pt-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-foreground/60">Hi there</div>
            <div className="text-xl font-extrabold">Meet {state.name}</div>
          </div>
          <div className="flex items-center gap-2">
            <Stat icon="🔥" value={state.streak} />
            <Stat icon="⭐" value={state.xp} />
          </div>
        </div>

        {/* Companion card */}
        <section className="mt-5 rounded-3xl bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-primary-deep">
                Stage · {stage}
              </div>
              <div className="mt-0.5 text-2xl font-extrabold">Level {state.level}</div>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-foreground/70">
                <span>{MOOD_META[state.mood].emoji}</span>
                <span>{MOOD_META[state.mood].label}</span>
              </div>
            </div>
            <HodlchiAvatar egg={state.egg} personality={state.personality} stage={stage} size={130} />
          </div>

          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs font-semibold text-foreground/60">
              <span>Progress to {prog.nextStage}</span>
              <span>{prog.pct}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-foreground/10">
              <div
                className="h-full bg-gradient-primary transition-all"
                style={{ width: `${prog.pct}%` }}
              />
            </div>
          </div>

          <button
            onClick={() =>
              nextLesson &&
              nav({
                to: "/lesson/$pathId/$lessonId",
                params: { pathId: nextLesson.path.id, lessonId: nextLesson.lesson.id },
              })
            }
            disabled={!nextLesson}
            className="mt-5 w-full rounded-2xl bg-foreground px-5 py-4 text-base font-bold text-primary shadow-pop transition active:scale-[0.98] disabled:opacity-40"
          >
            {nextLesson
              ? `🍎 Feed with a lesson — ${nextLesson.path.title}`
              : "You've completed every lesson! 🎉"}
          </button>
        </section>

        {/* Daily challenge */}
        <section className="mt-4 rounded-3xl border-2 border-dashed border-primary-deep/30 bg-primary/15 p-4">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-foreground text-primary">
              🎯
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-primary-deep">
                Daily challenge
              </div>
              <div className="mt-0.5 font-semibold">{challenge}</div>
            </div>
          </div>
        </section>

        {/* Paths */}
        <section className="mt-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-extrabold">Learning paths</h2>
            <div className="text-xs text-foreground/60">
              {doneLessons} / {totalLessons} lessons
            </div>
          </div>
          <div className="mt-3 grid gap-3">
            {PATHS.map((p) => {
              const done = p.lessons.filter((l) =>
                state.completedLessons.includes(`${p.id}:${l.id}`),
              ).length;
              const pct = Math.round((done / p.lessons.length) * 100);
              return (
                <Link
                  key={p.id}
                  to="/path/$pathId"
                  params={{ pathId: p.id }}
                  className="group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-soft transition active:scale-[0.99]"
                >
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/25 text-2xl">
                    {p.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold">{p.title}</div>
                    <div className="truncate text-sm text-foreground/70">{p.tagline}</div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-foreground/10">
                      <div className="h-full bg-primary-deep" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div className="text-sm font-bold text-foreground/60">
                    {done}/{p.lessons.length}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Demo / reset */}
        <section className="mt-8 rounded-2xl bg-white/60 p-4 text-sm">
          <div className="font-semibold">Mentor / demo tools</div>
          <p className="mt-1 text-foreground/70">
            For SCORE mentors or investors — reset sample progress or preview a clean flow.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => {
                if (confirm("Reset your Hodlchi and start over?")) {
                  reset();
                  nav({ to: "/" });
                }
              }}
              className="rounded-full border-2 border-foreground/15 bg-white px-4 py-2 text-xs font-semibold"
            >
              Reset progress
            </button>
            <button
              onClick={() => {
                demoMode();
              }}
              className="rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-primary"
            >
              Mentor demo mode
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({ icon, value }: { icon: string; value: number }) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm font-bold shadow-soft">
      <span>{icon}</span>
      <span>{value}</span>
    </div>
  );
}
