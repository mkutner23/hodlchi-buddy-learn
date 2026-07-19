import { createFileRoute, notFound, useNavigate, useParams } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { PATHS, PATH_ACCENT, getLocalizedPath } from "@/lib/lessons-data";
import { useHodlchi, deriveMood } from "@/lib/hodlchi-store";
import { HodlchiAvatar } from "@/components/HodlchiAvatar";
import { PathFruit } from "@/components/PathFruit";
import { sfx } from "@/lib/sfx";
import { getReflectionPrompt } from "@/lib/reflections";
import { useI18n } from "@/lib/i18n";




export const Route = createFileRoute("/lesson/$pathId/$lessonId")({
  component: LessonView,
  head: ({ params }) => {
    const path = PATHS.find((p) => p.id === params.pathId);
    const lesson = path?.lessons.find((l) => l.id === params.lessonId);
    const title = lesson ? `${lesson.title} — ${path!.title} · Hodlchi` : "Lesson — Hodlchi";
    const description = lesson
      ? `${lesson.intro.slice(0, 150)}${lesson.intro.length > 150 ? "…" : ""}`
      : "A short financial literacy lesson in Hodlchi.";
    const url = `https://hodlchi.com/lesson/${params.pathId}/${params.lessonId}`;
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
                provider: { "@type": "Organization", name: "Hodlchi", url: "https://hodlchi.com" },
              }),
            },
          ]
        : [],
    };
  },
});

type Phase = "intro" | "quiz" | "done";

export function LessonView() {
  const { pathId, lessonId } = useParams({ strict: false }) as { pathId: string; lessonId: string };
  const nav = useNavigate();
  const { state, completeLesson, flashMood, addReflection, logEvent, submitFeedback } = useHodlchi();
  const { locale, t } = useI18n();
  const path = getLocalizedPath(pathId as any, locale) ?? PATHS.find((p) => p.id === pathId);
  const lesson = path?.lessons.find((l) => l.id === lessonId);
  if (!path || !lesson) throw notFound();


  const [phase, setPhase] = useState<Phase>("intro");
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [reflection, setReflection] = useState("");
  const [reflectionSaved, setReflectionSaved] = useState(false);
  const lessonIdx = path.lessons.findIndex((l) => l.id === lesson.id);

  const q = lesson.quiz[qIdx];
  const isCorrect = selected !== null && selected === q?.answer;

  const check = () => {
    if (selected === null) return;
    setLocked(true);
    if (selected === q.answer) {
      setCorrectCount((c) => c + 1);
      flashMood("excited", 1400);
      sfx.ding();
      setTimeout(() => sfx.crunch(), 220);
      setTimeout(() => sfx.xp(), 380);
    } else {
      flashMood("confused", 1600);
      sfx.wrong();
    }
  };

  const nextQ = () => {
    if (qIdx + 1 < lesson.quiz.length) {
      setQIdx((i) => i + 1);
      setSelected(null);
      setLocked(false);
      sfx.pop();
    } else {
      completeLesson(path.id, lesson.id, correctCount, lesson.quiz.length);
      setPhase("done");
      sfx.levelUp();
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
            {"← " + t("common.back")}
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
                <div className="text-xs font-bold uppercase tracking-widest" style={{ color: accent.deep }}>
                  {t("common.lesson")} · {lesson.minutes} {t("common.minutes")}
                </div>
                <h1 className="mt-1 text-2xl font-extrabold">{lesson.title}</h1>
                <p
                  className="mt-4 rounded-2xl p-3 text-[16px] font-bold leading-snug text-foreground"
                  style={{ backgroundColor: accent.soft, borderLeft: `4px solid ${accent.hex}` }}
                >
                  {headline}
                </p>
                {body && (
                  <p className="mt-3 text-[15px] leading-relaxed text-foreground/75">{body}</p>
                )}
              </div>
              <button
                onClick={() => setPhase("quiz")}
                className="btn-squish mt-5 w-full rounded-2xl px-5 py-4 font-bold text-white shadow-pop"
                style={{ backgroundColor: accent.hex, boxShadow: `0 12px 30px -10px ${accent.ring}` }}
              >
                {t("lesson.intro.begin_quiz") + " →"}
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
                  className="h-1.5 flex-1 rounded-full"
                  style={{ backgroundColor: i <= qIdx ? accent.hex : `${accent.hex}20` }}
                />
              ))}
            </div>
            <div className="mt-6 rounded-3xl bg-white p-5 shadow-soft">
              <div className="text-xs font-bold text-foreground/60">
                {`${t("lesson.quiz.question_of")} ${qIdx + 1} ${t("lesson.quiz.of")} ${lesson.quiz.length}`}
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
                  <div className="font-bold">{isCorrect ? `✅ ${t("lesson.feedback.correct")}` : `💡 ${t("lesson.feedback.incorrect")}`}</div>
                  <div className="mt-0.5 text-foreground/80">{q.explain}</div>
                </div>
              )}

              {/* Micro-delight when correct */}
              {locked && isCorrect && (
                <div className="pointer-events-none relative h-0" aria-hidden="true">
                  <PathFruit
                    pathId={path.id}
                    animate={false}
                    className="animate-fruit-fly absolute left-1/2 -top-2 text-4xl"
                  />
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
              className="btn-squish mt-5 w-full rounded-2xl px-5 py-4 font-bold text-white shadow-pop disabled:opacity-40"
              style={{ backgroundColor: accent.hex, boxShadow: `0 12px 30px -10px ${accent.ring}` }}
            >
              {locked ? (qIdx + 1 < lesson.quiz.length ? t("lesson.quiz.next") : t("lesson.quiz.finish")) : t("lesson.quiz.check")}
            </button>

          </div>
        )}

        {phase === "done" && (
          <div className="relative mt-8 animate-pop text-center">
            {/* Path-specific fruit rain celebration */}
            <div className="pointer-events-none absolute inset-x-0 -top-4 h-64 overflow-hidden" aria-hidden="true">
              {Array.from({ length: 14 }).map((_, i) => {
                const left = (i / 14) * 100 + (Math.random() * 6 - 3);
                const delay = Math.random() * 0.9;
                const size = 22 + Math.random() * 16;
                return (
                  <PathFruit
                    key={i}
                    pathId={path.id}
                    animate={false}
                    className="absolute top-0 animate-fruit-rain"
                    style={{
                      left: `${left}%`,
                      fontSize: `${size}px`,
                      animationDelay: `${delay}s`,
                    }}
                  />
                );
              })}
            </div>
            <div className="mx-auto grid place-items-center">
              <div className="animate-bounce-happy">
                <HodlchiAvatar
                  egg={state.egg}
                  personality={state.personality}
                  stage={state.acknowledgedStage}
                  size={170}
                  mood={deriveMood(state)}
                />

              </div>
            </div>
            <h1 className="mt-4 text-3xl font-extrabold">
              <PathFruit pathId={path.id} animate={false} className="text-4xl" /> {`${state.name} ${locale === "es" ? "disfrutó esta lección" : "enjoyed that lesson"}!`}
            </h1>
            <p className="mt-1 text-foreground/70">
              +{xpGained} XP · {state.name} feels {correctCount === lesson.quiz.length ? (locale==="es"?"increíble":"amazing") : (locale==="es"?"un poco más sabio":"a little wiser")}.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-2">
              <div
                className="relative overflow-visible rounded-2xl p-3 shadow-soft"
                style={{ backgroundColor: accent.soft }}
              >
                <div className="text-xs font-semibold" style={{ color: accent.deep }}>XP</div>
                <div className="mt-0.5 text-lg font-extrabold" style={{ color: accent.deep }}>
                  ⭐ +{xpGained}
                </div>
                {/* Radiating XP particles */}
                <div className="pointer-events-none absolute inset-0" aria-hidden>
                  {Array.from({ length: 6 }).map((_, i) => {
                    const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
                    const dist = 40 + Math.random() * 18;
                    return (
                      <span
                        key={i}
                        className="absolute left-1/2 top-1/2 text-sm animate-xp-particle"
                        style={{
                          ["--xpx" as string]: `${Math.cos(angle) * dist}px`,
                          ["--xpy" as string]: `${Math.sin(angle) * dist}px`,
                          animationDelay: `${i * 60}ms`,
                        } as CSSProperties}
                      >
                        {i % 2 === 0 ? "⭐" : "✨"}
                      </span>
                    );
                  })}
                </div>
              </div>

              <Stat label={t("lesson.result.streak")} value={`🔥 ${state.streak}`} />
              <Stat label={t("lesson.result.correct")} value={`✅ ${correctCount}/${lesson.quiz.length}`} />
            </div>

            {/* Optional, non-graded reflection — bridges lesson to real life */}
            <div className="mt-6 rounded-3xl bg-white p-5 text-left shadow-soft">
              <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: accent.deep }}>
                {locale === "es" ? "Una reflexión rápida · opcional" : "A quick reflection · optional"}
              </div>
              <p className="mt-1 text-[15px] font-bold leading-snug">
                {getReflectionPrompt(path.id, lessonIdx)}
              </p>
              {reflectionSaved ? (
                <div className="mt-3 rounded-2xl bg-primary/15 p-3 text-sm font-semibold text-primary-deep">
                  {`💚 ${locale === "es" ? "Guardado. " + state.name + " lo recordará." : "Saved. " + state.name + " will remember this."}`}
                </div>
              ) : (
                <>
                  <textarea
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder={locale==="es" ? "Escribe lo que sea — no hay respuesta correcta." : "Type anything — no right or wrong answer."}
                    maxLength={280}
                    rows={3}
                    className="mt-3 w-full resize-none rounded-2xl border-2 border-foreground/15 bg-white p-3 text-sm outline-none focus:border-foreground/40"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => {
                        addReflection(path.id, lesson.id, reflection);
                        setReflectionSaved(true);
                        sfx.pop();
                      }}
                      disabled={!reflection.trim()}
                      className="flex-1 rounded-2xl px-4 py-2.5 text-sm font-bold text-white shadow-pop disabled:opacity-40"
                      style={{ backgroundColor: accent.hex }}
                    >
                      {t("lesson.reflection.save")}
                    </button>
                    <button
                      onClick={() => setReflectionSaved(true)}
                      className="rounded-2xl border-2 border-foreground/15 px-4 py-2.5 text-sm font-bold text-foreground/70"
                    >
                      {t("lesson.reflection.skip")}
                    </button>

                  </div>
                </>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => nav({ to: "/path/$pathId", params: { pathId: path.id } })}
                className="flex-1 rounded-2xl border-2 border-foreground/15 bg-white px-5 py-4 font-bold"
              >
                {locale === "es" ? "Volver al camino" : "Back to path"}
              </button>
              <button
                onClick={() => nav({ to: "/dashboard" })}
                className="flex-1 rounded-2xl bg-foreground px-5 py-4 font-bold text-primary shadow-pop"
              >
                {t("common.home")}
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
