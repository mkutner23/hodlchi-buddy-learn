import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PATHS, PATH_FRUIT } from "@/lib/lessons-data";
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

  return (
    <main className="min-h-screen bg-gradient-sky pb-16">
      <div className="mx-auto max-w-md px-5 pt-6">
        <Link to="/dashboard" className="text-sm font-semibold text-foreground/60">
          ← Back
        </Link>
        <header className="mt-4 rounded-3xl bg-white p-5 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/25 text-3xl">
              {path.emoji}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold">{path.title}</h1>
              <p className="text-sm text-foreground/70">{path.tagline}</p>
            </div>
          </div>
          <div className="mt-4 text-xs font-bold text-foreground/60">
            {done} of {path.lessons.length} lessons complete
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
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-lg font-black ${complete ? "bg-primary/25" : locked ? "bg-foreground/10" : "bg-foreground text-primary"}`}
                >
                  {complete ? (
                    <span className="text-2xl leading-none" aria-label="completed">
                      {PATH_FRUIT[path.id]}
                    </span>
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
                {!locked && <span className="text-lg">→</span>}
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
