import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { useState } from "react";
import { PATHS, PATH_FRUIT, PATH_ACCENT } from "@/lib/lessons-data";
import { useHodlchi } from "@/lib/hodlchi-store";
import { HodlchiAvatar } from "@/components/HodlchiAvatar";


export const Route = createFileRoute("/lesson/$pathId/$lessonId")({
  component: LessonView,
  head: ({ params }) => {
    const path = PATHS.find((p) => p.id === params.pathId);
    const lesson = path?.lessons.find((l) => l.id === params.lessonId);
    const title = lesson ? `${lesson.title} — ${path!.title} · Hodlchi` : "Lesson — Hodlchi";
    const description = lesson
      ? `${lesson.intro.slice(0, 150)}${lesson.intro.length > 150 ? "…" : ""}`
      : "A short financial literacy lesson in Hodlchi.";
    const url = `https://demo.hodlchi.com/lesson/${params.pathId}/${params.lessonId}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: lesson
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "LearningResource",
                name: lesson.title,
                description: lesson.intro,
                timeRequired: `PT${lesson.minutes}M`,
                learningResourceType: "Lesson",
                educationalLevel: "beginner",
                inLanguage: "en",
                isPartOf: { "@type": "Course", name: `${path!.title} — Hodlchi` },
                provider: { "@type": "Organization", name: "Hodlchi", url: "https://demo.hodlchi.com" },
              }),
            },
          ]
        : [],
    };
  },
});

type Phase = "intro" | "quiz" | "done";

function LessonView() {
  const { pathId, lessonId } = Route.useParams();
  const nav = useNavigate();
  const { state, completeLesson } = useHodlchi();
  const path = PATHS.find((p) => p.id === pathId);
  const lesson = path?.lessons.find((l) => l.id === lessonId);
  if (!path || !lesson) throw notFound();

  const [phase, setPhase] = useState<Phase>("intro");
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const q = lesson.quiz[qIdx];
  const isCorrect = selected !== null && selected === q?.answer;

  const check = () => {
    if (selected === null) return;
    setLocked(true);
    if (selected === q.answer) setCorrectCount((c) => c + 1);
  };

  const nextQ = () => {
    if (qIdx + 1 < lesson.quiz.length) {
      setQIdx((i) => i + 1);
      setSelected(null);
      setLocked(false);
    } else {
      completeLesson(path.id, lesson.id, correctCount, lesson.quiz.length);
      setPhase("done");
    }
  };

  const xpGained = correctCount * 10 + (correctCount === lesson.quiz.length ? 20 : 0);
  const accent = PATH_ACCENT[path.id];

  return (
    <main className="min-h-screen pb-8" style={{ background: `linear-gradient(180deg, ${accent.soft} 0%, #fafbf7 100%)` }}>
      <div className="mx-auto max-w-md px-5 pt-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => nav({ to: "/path/$pathId", params: { pathId: path.id } })}
            className="text-sm font-semibold text-foreground/60"
          >
            ← Exit
          </button>
          <div className="text-xs font-semibold text-foreground/60">
            {path.emoji} {path.title}
          </div>
        </div>

        {phase === "intro" && (() => {
          const parts = lesson.intro.split(/(?<=[.!?])\s+/);
          const headline = parts[0];
          const body = parts.slice(1).join(" ");
          return (
            <div className="mt-6 animate-pop">
              <div className="rounded-3xl bg-white p-5 shadow-soft">
                <div className="text-xs font-bold uppercase tracking-widest text-primary-deep">
                  Lesson · {lesson.minutes} min
                </div>
                <h1 className="mt-1 text-2xl font-extrabold">{lesson.title}</h1>
                <p className="mt-4 rounded-2xl bg-primary/15 p-3 text-[16px] font-bold leading-snug text-foreground">
                  {headline}
                </p>
                {body && (
                  <p className="mt-3 text-[15px] leading-relaxed text-foreground/75">{body}</p>
                )}
              </div>
              <button
                onClick={() => setPhase("quiz")}
                className="mt-5 w-full rounded-2xl bg-foreground px-5 py-4 font-bold text-primary shadow-pop active:scale-[0.98]"
              >
                Start the quiz →
              </button>
            </div>
          );
        })()}

        {phase === "quiz" && q && (
          <div className="mt-6 animate-pop">
            {/* progress */}
            <div className="flex gap-1.5">
              {lesson.quiz.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${i <= qIdx ? "bg-foreground" : "bg-foreground/15"}`}
                />
              ))}
            </div>
            <div className="mt-6 rounded-3xl bg-white p-5 shadow-soft">
              <div className="text-xs font-bold text-foreground/60">
                Question {qIdx + 1} of {lesson.quiz.length}
              </div>
              <h2 className="mt-1 text-xl font-extrabold leading-snug">{q.q}</h2>
              <div className="mt-5 space-y-2.5">
                {q.options.map((opt, i) => {
                  const isSel = selected === i;
                  const showRight = locked && i === q.answer;
                  const showWrong = locked && isSel && i !== q.answer;
                  return (
                    <button
                      key={i}
                      disabled={locked}
                      onClick={() => setSelected(i)}
                      className={`flex w-full items-center gap-3 rounded-2xl border-2 bg-white px-4 py-3.5 text-left font-semibold transition ${
                        showRight
                          ? "border-success bg-success/15"
                          : showWrong
                            ? "border-destructive bg-destructive/10"
                            : isSel
                              ? "border-foreground"
                              : "border-foreground/15"
                      }`}
                    >
                      <span
                        className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-black ${isSel || showRight ? "bg-foreground text-primary" : "bg-foreground/10"}`}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {locked && (
                <div
                  className={`mt-4 rounded-2xl p-3 text-sm ${isCorrect ? "bg-success/15 text-foreground" : "bg-destructive/10 text-foreground"}`}
                >
                  <div className="font-bold">{isCorrect ? "✅ Nice!" : "💡 Not quite."}</div>
                  <div className="mt-0.5 text-foreground/80">{q.explain}</div>
                </div>
              )}

              {/* Micro-delight when correct */}
              {locked && isCorrect && (
                <div className="pointer-events-none relative h-0" aria-hidden="true">
                  <div className="animate-fruit-fly absolute left-1/2 -top-2 text-4xl">
                    {PATH_FRUIT[path.id]}
                  </div>
                  <span
                    className="animate-heart-pop absolute left-1/3 -top-2 text-2xl"
                    style={{ ["--tx" as string]: "-12px" } as CSSProperties}
                  >
                    💚
                  </span>
                  <span
                    className="animate-heart-pop absolute left-2/3 -top-2 text-2xl"
                    style={{ ["--tx" as string]: "10px", animationDelay: "0.15s" } as CSSProperties}
                  >
                    ✨
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={locked ? nextQ : check}
              disabled={selected === null}
              className="mt-5 w-full rounded-2xl bg-foreground px-5 py-4 font-bold text-primary shadow-pop transition active:scale-[0.98] disabled:opacity-40"
            >
              {locked ? (qIdx + 1 < lesson.quiz.length ? "Next question" : "Finish lesson") : "Check answer"}
            </button>
          </div>
        )}

        {phase === "done" && (
          <div className="mt-8 animate-pop text-center">
            <div className="mx-auto grid place-items-center">
              <div className="animate-bounce-happy">
                <HodlchiAvatar
                  egg={state.egg}
                  personality={state.personality}
                  stage={state.acknowledgedStage}
                  size={170}
                />
              </div>
            </div>
            <h1 className="mt-4 text-3xl font-extrabold">
              {PATH_FRUIT[path.id]} {state.name} enjoyed that lesson!
            </h1>
            <p className="mt-1 text-foreground/70">
              +{xpGained} XP · {state.name} feels {correctCount === lesson.quiz.length ? "amazing" : "a little wiser"}.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-2">
              <Stat label="XP" value={`⭐ +${xpGained}`} />
              <Stat label="Streak" value={`🔥 ${state.streak}`} />
              <Stat label="Correct" value={`✅ ${correctCount}/${lesson.quiz.length}`} />
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => nav({ to: "/path/$pathId", params: { pathId: path.id } })}
                className="flex-1 rounded-2xl border-2 border-foreground/15 bg-white px-5 py-4 font-bold"
              >
                Back to path
              </button>
              <button
                onClick={() => nav({ to: "/dashboard" })}
                className="flex-1 rounded-2xl bg-foreground px-5 py-4 font-bold text-primary shadow-pop"
              >
                Home
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-soft">
      <div className="text-xs font-semibold text-foreground/60">{label}</div>
      <div className="mt-0.5 text-lg font-extrabold">{value}</div>
    </div>
  );
}
