import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getTopic, MONEY_BASICS_TOPICS, type MoneyBasicsTopic } from "@/lib/money-basics";

export const Route = createFileRoute("/money-basics/$topic")({
  component: TopicPage,
  loader: ({ params }) => {
    const topic = getTopic(params.topic);
    if (!topic) throw notFound();
    return { topic };
  },
  head: ({ params, loaderData }) => {
    const topic = loaderData?.topic;
    if (!topic) {
      return {
        meta: [
          { title: "Money Basics — Not found | Hodlchi" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const url = `https://hodlchi.com/money-basics/${params.topic}`;
    const title = `${topic.title} — A plain-English guide | Hodlchi`;
    const description = topic.short;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DefinedTerm",
            name: topic.title,
            description: topic.definition,
            inDefinedTermSet: {
              "@type": "DefinedTermSet",
              name: "Hodlchi Money Basics",
              url: "https://hodlchi.com/money-basics",
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: topic.faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        },
      ],
    };
  },
  notFoundComponent: TopicNotFound,
  errorComponent: TopicError,
});

function TopicPage() {
  const { topic } = Route.useLoaderData() as { topic: MoneyBasicsTopic };
  const related = topic.related
    .map((slug) => MONEY_BASICS_TOPICS.find((t) => t.slug === slug))
    .filter((t): t is MoneyBasicsTopic => Boolean(t));

  return (
    <main className="min-h-screen bg-gradient-sky pb-20">
      <div className="mx-auto max-w-2xl px-5 pt-6">
        <Link to="/money-basics" className="text-sm font-semibold text-foreground/60">
          ← Money Basics
        </Link>

        <header className="mt-4 rounded-3xl bg-white p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/25 text-2xl">
              {topic.emoji}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-primary-deep">
              Money Basics
            </div>
          </div>
          <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">{topic.title}</h1>
          <p className="mt-4 rounded-2xl bg-primary/10 p-4 text-[15px] font-semibold leading-snug text-foreground">
            {topic.definition}
          </p>
        </header>

        <article className="mt-6 space-y-5">
          {topic.body.map((section) => (
            <section key={section.heading} className="rounded-3xl bg-white/80 p-5 shadow-soft backdrop-blur">
              <h2 className="text-lg font-extrabold">{section.heading}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-foreground/80">{section.text}</p>
            </section>
          ))}

          {topic.example && (
            <section className="rounded-3xl border-l-4 border-primary-deep bg-white/80 p-5 shadow-soft backdrop-blur">
              <div className="text-[10px] font-bold uppercase tracking-widest text-primary-deep">
                Quick example
              </div>
              <p className="mt-2 text-[15px] leading-relaxed text-foreground/80">{topic.example}</p>
            </section>
          )}
        </article>

        <section className="mt-8 rounded-3xl bg-foreground p-6 text-center shadow-pop">
          <div className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
            Make it stick
          </div>
          <h2 className="mt-1 text-xl font-extrabold text-primary">{topic.ctaCopy}</h2>
          <p className="mt-2 text-sm text-primary/80">
            Feed your Hodlchi a short lesson on this topic — takes about 5 minutes.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link
              to="/path/$pathId"
              params={{ pathId: topic.ctaPath }}
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-foreground shadow-pop"
            >
              Learn this in 5 minutes with Hodlchi →
            </Link>
            <Link
              to="/onboarding"
              className="inline-flex items-center justify-center rounded-full border border-primary/40 px-6 py-3 text-sm font-bold text-primary"
            >
              Hatch a Hodlchi
            </Link>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-foreground/60">
            Frequently asked
          </h2>
          <div className="mt-3 space-y-3">
            {topic.faq.map((f) => (
              <details key={f.q} className="rounded-2xl bg-white/80 p-4 backdrop-blur">
                <summary className="cursor-pointer font-bold">{f.q}</summary>
                <p className="mt-2 text-sm text-foreground/70">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-foreground/60">
              Related topics
            </h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to="/money-basics/$topic"
                  params={{ topic: r.slug }}
                  className="flex items-center gap-2 rounded-2xl bg-white/80 p-3 shadow-soft backdrop-blur transition hover:-translate-y-0.5"
                >
                  <span className="text-lg">{r.emoji}</span>
                  <span className="text-sm font-bold">{r.title}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function TopicNotFound() {
  return (
    <main className="min-h-screen bg-gradient-sky">
      <div className="mx-auto max-w-md px-5 pt-16 text-center">
        <h1 className="text-2xl font-extrabold">Topic not found</h1>
        <p className="mt-2 text-foreground/70">That money-basics page doesn't exist (yet).</p>
        <Link
          to="/money-basics"
          className="mt-6 inline-flex items-center rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-primary shadow-pop"
        >
          Browse all topics
        </Link>
      </div>
    </main>
  );
}

function TopicError({ reset }: { reset: () => void }) {
  return (
    <main className="min-h-screen bg-gradient-sky">
      <div className="mx-auto max-w-md px-5 pt-16 text-center">
        <h1 className="text-2xl font-extrabold">Something wobbled</h1>
        <p className="mt-2 text-foreground/70">This page couldn't load. Try again.</p>
        <button
          onClick={() => reset()}
          className="mt-6 rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-primary shadow-pop"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
