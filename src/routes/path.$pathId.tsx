import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PATHS } from "@/lib/lessons-data";
import { useHodlchi } from "@/lib/hodlchi-store";

export const Route = createFileRoute("/path/$pathId")({
  component: PathView,
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
        <Link to="/home" className="text-sm font-semibold text-foreground/60">
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
            return (
              <li key={lesson.id}>
                <Link
                  to="/lesson/$pathId/$lessonId"
                  params={{ pathId: path.id, lessonId: lesson.id }}
                  disabled={locked}
                  className={`flex items-center gap-4 rounded-2xl bg-white p-4 shadow-soft transition ${locked ? "pointer-events-none opacity-50" : "active:scale-[0.99]"}`}
                >
                  <div
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-lg font-black ${complete ? "bg-primary text-primary-foreground" : locked ? "bg-foreground/10" : "bg-foreground text-primary"}`}
                  >
                    {complete ? "✓" : locked ? "🔒" : idx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold">{lesson.title}</div>
                    <div className="text-xs text-foreground/60">
                      {lesson.minutes} min · {lesson.quiz.length} questions
                    </div>
                  </div>
                  {!locked && <span className="text-lg">→</span>}
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </main>
  );
}
