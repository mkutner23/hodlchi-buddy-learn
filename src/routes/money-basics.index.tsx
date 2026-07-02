import { createFileRoute, Link } from "@tanstack/react-router";
import { MONEY_BASICS_TOPICS } from "@/lib/money-basics";

const URL = "https://hodlchi.com/money-basics";
const TITLE = "Money Basics — Plain-English Answers to Financial Questions | Hodlchi";
const DESCRIPTION =
  "Short, beginner-friendly answers to the money questions everyone Googles: budgeting, saving, investing, APR, credit scores, inflation, and more.";

export const Route = createFileRoute("/money-basics/")({
  component: MoneyBasicsHub,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Money Basics",
          description: DESCRIPTION,
          url: URL,
          isPartOf: { "@type": "WebSite", name: "Hodlchi", url: "https://hodlchi.com" },
          hasPart: MONEY_BASICS_TOPICS.map((t) => ({
            "@type": "Article",
            name: t.title,
            url: `${URL}/${t.slug}`,
            description: t.short,
          })),
        }),
      },
    ],
  }),
});

function MoneyBasicsHub() {
  return (
    <main className="min-h-screen bg-gradient-sky pb-20">
      <div className="mx-auto max-w-2xl px-5 pt-6">
        <Link to="/" className="text-sm font-semibold text-foreground/60">
          ← Back
        </Link>

        <header className="mt-4 rounded-3xl bg-white p-6 text-center shadow-soft">
          <div className="text-[10px] font-bold uppercase tracking-widest text-primary-deep">
            Money Basics
          </div>
          <h1 className="mt-2 text-3xl font-black leading-tight sm:text-4xl">
            Plain-English answers to the money questions everyone Googles
          </h1>
          <p className="mt-3 text-foreground/70">
            Short, honest explainers. Every topic ends with a 5-minute Hodlchi lesson so the idea
            actually sticks.
          </p>
        </header>

        <section className="mt-8 grid gap-3 sm:grid-cols-2">
          {MONEY_BASICS_TOPICS.map((t) => (
            <Link
              key={t.slug}
              to="/money-basics/$topic"
              params={{ topic: t.slug }}
              className="group flex flex-col rounded-2xl bg-white/80 p-4 shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:shadow-pop"
            >
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/25 text-xl">
                  {t.emoji}
                </div>
                <div className="min-w-0">
                  <div className="font-extrabold leading-tight">{t.title}</div>
                  <div className="mt-1 text-sm text-foreground/70">{t.short}</div>
                </div>
              </div>
              <div className="mt-3 text-xs font-semibold text-primary-deep">
                Read →
              </div>
            </Link>
          ))}
        </section>

        <section className="mt-10 rounded-3xl bg-foreground p-6 text-center shadow-pop">
          <div className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
            Learn by playing
          </div>
          <h2 className="mt-1 text-xl font-extrabold text-primary">
            Turn these ideas into a daily habit
          </h2>
          <p className="mt-2 text-sm text-primary/80">
            Hatch a Hodlchi and complete 5-minute lessons that make the basics stick.
          </p>
          <Link
            to="/onboarding"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-foreground shadow-pop"
          >
            Hatch your Hodlchi →
          </Link>
        </section>
      </div>
    </main>
  );
}
