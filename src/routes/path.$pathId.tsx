import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PATHS, PATH_FRUIT, PATH_ACCENT } from "@/lib/lessons-data";
import { PathFruit } from "@/components/PathFruit";
import { useHodlchi } from "@/lib/hodlchi-store";

export const Route = createFileRoute("/path/$pathId")({
  component: PathView,
  head: ({ params }) => {
    const path = PATHS.find((p) => p.id === params.pathId);
    const title = path ? `${path.title} — Hodlchi lessons` : "Learning path — Hodlchi";
    const description = path
      ? `${path.tagline} ${path.lessons.length} short, beginner-friendly lessons in Hodlchi.`
      : "Bite-size financial literacy lessons in Hodlchi.";
    const url = `https://demo.hodlchi.com/path/${params.pathId}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: path
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Course",
                name: `${path.title} — Hodlchi`,
                description: path.tagline,
                provider: { "@type": "Organization", name: "Hodlchi", url: "https://demo.hodlchi.com" },
                hasCourseInstance: path.lessons.map((l) => ({
                  "@type": "CourseInstance",
                  name: l.title,
                  courseMode: "online",
                })),
              }),
            },
          ]
        : [],
    };
  },
});

function PathView() {
  const { pathId } = Route.useParams();
  const path = PATHS.find((p) => p.id === pathId);
  const { state } = useHodlchi();
  if (!path) throw notFound();

  const done = path.lessons.filter((l) => state.completedLessons.includes(`${path.id}:${l.id}`)).length;

  const accent = PATH_ACCENT[path.id];

  return (
    <main className="min-h-screen pb-16" style={{ background: `linear-gradient(180deg, ${accent.soft} 0%, #fafbf7 100%)` }}>
      <div className="mx-auto max-w-md px-5 pt-6">
        <Link to="/dashboard" className="text-sm font-semibold text-foreground/60">
          ← Back
        </Link>
        <header
          className="mt-4 rounded-3xl bg-white p-5 shadow-soft"
          style={{ boxShadow: `0 12px 40px -18px ${accent.ring}` }}
        >
          <div className="flex items-center gap-4">
            <div
              className="grid h-16 w-16 place-items-center rounded-2xl text-3xl"
              style={{ backgroundColor: `${accent.hex}25` }}
            >
              {path.emoji}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold" style={{ color: accent.deep }}>
                {path.title}
              </h1>
              <p className="text-sm text-foreground/70">{path.tagline}</p>
            </div>
          </div>
          <div className="mt-4 text-xs font-bold" style={{ color: accent.deep }}>
            {done} of {path.lessons.length} lessons complete
          </div>
          <div
            className="mt-2 h-1.5 overflow-hidden rounded-full"
            style={{ backgroundColor: `${accent.hex}20` }}
          >
            <div
              className="h-full"
              style={{
                width: `${Math.round((done / path.lessons.length) * 100)}%`,
                backgroundColor: accent.hex,
              }}
            />
          </div>
        </header>

        <ol className="mt-6 space-y-3">
          {path.lessons.map((lesson, idx) => {
            const complete = state.completedLessons.includes(`${path.id}:${lesson.id}`);
            const prev = idx === 0 || state.completedLessons.includes(`${path.id}:${path.lessons[idx - 1].id}`);
            const locked = !prev && !complete;
            const inner = (
              <div
                className={`flex items-center gap-4 rounded-2xl bg-white p-4 shadow-soft transition ${locked ? "opacity-50" : "active:scale-[0.99]"}`}
              >
                <div
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-lg font-black"
                  style={{
                    backgroundColor: complete
                      ? `${accent.hex}25`
                      : locked
                        ? "rgba(0,0,0,0.08)"
                        : accent.hex,
                    color: complete || locked ? undefined : "#fff",
                  }}
                >
                  {complete ? (
                    <PathFruit pathId={path.id} className="text-2xl leading-none" />
                  ) : locked ? (
                    "🔒"
                  ) : (
                    idx + 1
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold">{lesson.title}</div>
                  <div className="text-xs text-foreground/60">
                    {lesson.minutes} min · {lesson.quiz.length} questions
                  </div>
                </div>
                {!locked && <span className="text-lg" style={{ color: accent.deep }}>→</span>}
              </div>
            );
            return (
              <li key={lesson.id}>
                {locked ? (
                  inner
                ) : (
                  <Link
                    to="/lesson/$pathId/$lessonId"
                    params={{ pathId: path.id, lessonId: lesson.id }}
                  >
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </main>
  );
}
