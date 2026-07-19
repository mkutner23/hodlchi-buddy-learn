import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useHodlchi } from "@/lib/hodlchi-store";

export const Route = createFileRoute("/debug")({
  component: DebugView,
  head: () => ({
    meta: [
      { title: "Debug — Hodlchi" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function DebugView() {
  const { state, favoritePath } = useHodlchi();

  const funnel = useMemo(() => {
    const has = (n: string) => state.events.some((e) => e.name === n);
    return [
      { step: "App visit", hit: has("app_visit") || state.memory.visitCount > 0 },
      { step: "Penny hatched", hit: has("penny_hatched") || state.onboarded },
      { step: "First lesson started", hit: has("first_lesson_started") },
      { step: "First lesson completed", hit: has("first_lesson_completed") || state.completedLessons.length >= 1 },
      { step: "Second-day return", hit: state.streak >= 2 },
      { step: "7-day streak", hit: state.streak >= 7 || has("seven_day_streak") },
      { step: "Evolution reached", hit: has("evolution_reached") },
      { step: "First-lesson feedback", hit: state.feedback.firstLesson !== null },
    ];
  }, [state]);

  const eventCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const e of state.events) counts[e.name] = (counts[e.name] ?? 0) + 1;
    return counts;
  }, [state.events]);

  return (
    <main className="min-h-screen bg-gradient-sky pb-16 font-sans">
      <div className="mx-auto max-w-md px-5 pt-6">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="text-sm font-semibold text-foreground/60">← Back</Link>
          <div className="text-xs font-semibold text-foreground/60">Local analytics · this device</div>
        </div>
        <h1 className="mt-3 font-display text-2xl font-extrabold">Retention funnel</h1>
        <p className="text-sm text-foreground/60">Every event lives in localStorage — nothing leaves this device.</p>

        <section className="mt-5 rounded-3xl bg-white p-4 shadow-soft">
          <ol className="space-y-2">
            {funnel.map((f, i) => (
              <li key={f.step} className="flex items-center gap-3">
                <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-black ${f.hit ? "bg-primary text-primary-foreground" : "bg-foreground/10 text-foreground/40"}`}>
                  {i + 1}
                </span>
                <span className={`flex-1 text-sm font-semibold ${f.hit ? "text-foreground" : "text-foreground/40"}`}>{f.step}</span>
                <span className="text-lg">{f.hit ? "✅" : "◻️"}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-5 rounded-3xl bg-white p-4 shadow-soft">
          <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">Penny's memory</div>
          <ul className="mt-2 space-y-1 text-sm">
            <MemoryRow k="Hatched" v={fmt(state.memory.firstHatchedAt)} />
            <MemoryRow k="First lesson" v={state.memory.firstLessonKey ? `${state.memory.firstLessonKey} · ${fmt(state.memory.firstLessonAt)}` : "—"} />
            <MemoryRow k="First streak (≥2)" v={fmt(state.memory.firstStreakAt)} />
            <MemoryRow k="First investing lesson" v={fmt(state.memory.firstInvestingAt)} />
            <MemoryRow k="First evolution" v={fmt(state.memory.firstEvolutionAt)} />
            <MemoryRow k="Favorite path" v={favoritePath() ?? "—"} />
            <MemoryRow k="Visits" v={String(state.memory.visitCount)} />
            <MemoryRow k="Last login" v={fmt(state.memory.lastLoginAt)} />
            <MemoryRow k="First-lesson feedback" v={state.feedback.firstLesson ?? "—"} />
          </ul>
        </section>

        <section className="mt-5 rounded-3xl bg-white p-4 shadow-soft">
          <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">Event counts</div>
          {Object.keys(eventCounts).length === 0 ? (
            <div className="mt-2 text-sm text-foreground/50">No events yet.</div>
          ) : (
            <ul className="mt-2 space-y-1 text-sm">
              {Object.entries(eventCounts).sort().map(([k, v]) => (
                <li key={k} className="flex justify-between">
                  <span className="font-mono">{k}</span>
                  <span className="font-bold">{v}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-5 rounded-3xl bg-white p-4 shadow-soft">
          <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">Recent events</div>
          <ul className="mt-2 max-h-64 space-y-1 overflow-auto text-xs">
            {[...state.events].slice(-40).reverse().map((e, i) => (
              <li key={i} className="rounded-lg bg-foreground/5 px-2 py-1">
                <span className="font-mono font-bold">{e.name}</span>
                <span className="text-foreground/50"> · {fmt(e.ts)}</span>
                {e.meta && <span className="text-foreground/40"> · {JSON.stringify(e.meta)}</span>}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

function MemoryRow({ k, v }: { k: string; v: string }) {
  return (
    <li className="flex justify-between gap-3">
      <span className="text-foreground/60">{k}</span>
      <span className="text-right font-semibold">{v}</span>
    </li>
  );
}

function fmt(ts: number | null): string {
  if (!ts) return "—";
  return new Date(ts).toLocaleString();
}
