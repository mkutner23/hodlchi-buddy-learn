import { createFileRoute, Link } from "@tanstack/react-router";
import { PATHS } from "@/lib/lessons-data";

const URL = "https://demo.hodlchi.com/financial-literacy-for-teens";
const TITLE = "Financial Literacy Course for Teens — Hodlchi";
const DESCRIPTION =
  "Free gamified financial literacy course for teens. Learn saving, investing, credit, entrepreneurship, and crypto in 20 bite-size lessons.";

export const Route = createFileRoute("/financial-literacy-for-teens")({
  component: TeensPage,
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
          "@type": "Course",
          name: "Financial Literacy Course for Teens",
          description: DESCRIPTION,
          educationalLevel: "Beginner / Teen",
          audience: {
            "@type": "EducationalAudience",
            educationalRole: "student",
          },
          provider: {
            "@type": "Organization",
            name: "Hodlchi",
            url: "https://demo.hodlchi.com",
          },
          hasCourseInstance: PATHS.flatMap((p) =>
            p.lessons.map((l) => ({
              "@type": "CourseInstance",
              name: `${p.title}: ${l.title}`,
              courseMode: "online",
              courseWorkload: `PT${l.minutes}M`,
            })),
          ),
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            category: "Free",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Is this financial literacy course free?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Every lesson in Hodlchi is completely free. No credit card, no subscription.",
              },
            },
            {
              "@type": "Question",
              name: "Is Hodlchi suitable for teens and beginners?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Lessons are 3-minute reads with plain language and short quizzes, designed for absolute beginners and teens learning money for the first time.",
              },
            },
            {
              "@type": "Question",
              name: "Does Hodlchi give investment advice?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "No. Hodlchi is strictly educational. We do not offer trading, wallets, or investment recommendations.",
              },
            },
          ],
        }),
      },
    ],
  }),
});

function TeensPage() {
  const totalLessons = PATHS.reduce((n, p) => n + p.lessons.length, 0);
  const totalMinutes = PATHS.reduce(
    (n, p) => n + p.lessons.reduce((m, l) => m + l.minutes, 0),
    0,
  );

  return (
    <main className="min-h-screen bg-gradient-sky pb-20">
      <div className="mx-auto max-w-md px-5 pt-6">
        <Link to="/" className="text-sm font-semibold text-foreground/60">
          ← Back
        </Link>

        <header className="mt-4 rounded-3xl bg-white p-6 shadow-soft">
          <div className="text-[10px] font-bold uppercase tracking-widest text-primary-deep">
            Free · Beginner-friendly
          </div>
          <h1 className="mt-2 text-3xl font-black leading-tight">
            Financial Literacy Course for Teens
          </h1>
          <p className="mt-3 text-sm text-foreground/70">
            {totalLessons} bite-size lessons · ~{totalMinutes} minutes total. Hatch a Hodlchi and
            learn money the fun way — saving, investing, credit, entrepreneurship and crypto
            basics, all in one gamified curriculum.
          </p>
          <Link
            to="/onboarding"
            className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-foreground px-5 py-3.5 font-bold text-primary shadow-pop"
          >
            Start the free course →
          </Link>
        </header>

        <section className="mt-8">
          <h2 className="px-1 text-sm font-extrabold uppercase tracking-widest text-foreground/60">
            What you'll learn
          </h2>
          <div className="mt-3 grid gap-2">
            {PATHS.map((p) => (
              <Link
                key={p.id}
                to="/path/$pathId"
                params={{ pathId: p.id }}
                className="flex items-center gap-3 rounded-2xl bg-white/80 p-3 backdrop-blur"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/25 text-xl">
                  {p.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold">{p.title}</div>
                  <div className="text-xs text-foreground/60">{p.tagline}</div>
                </div>
                <div className="text-[11px] font-bold text-foreground/50">
                  {p.lessons.length} lessons
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl bg-white p-5 shadow-soft">
          <h2 className="text-lg font-extrabold">Why teens love Hodlchi</h2>
          <ul className="mt-3 space-y-2 text-sm text-foreground/80">
            <li>🎮 <b>Gamified:</b> Feed a virtual companion by completing lessons.</li>
            <li>⏱️ <b>3 minutes a day:</b> Short lessons that fit between classes.</li>
            <li>🔥 <b>Streaks:</b> Come back daily to keep your Hodlchi alive.</li>
            <li>🧠 <b>Plain English:</b> No jargon. No pressure. Just the basics.</li>
          </ul>
        </section>

        <section className="mt-8 rounded-3xl bg-foreground p-6 text-primary shadow-pop">
          <div className="text-[10px] font-bold uppercase tracking-widest text-primary/80">
            Completion milestone
          </div>
          <h2 className="mt-2 text-lg font-extrabold">Earn a free financial literacy certificate</h2>
          <p className="mt-2 text-sm text-primary/80">
            Finish all 5 paths and unlock a shareable certificate for your resume, class, or portfolio.
          </p>
          <Link
            to="/certificate"
            className="mt-4 inline-flex items-center font-semibold text-primary underline underline-offset-2"
          >
            Learn about the certificate →
          </Link>
        </section>

        <section className="mt-8">
          <h2 className="px-1 text-sm font-extrabold uppercase tracking-widest text-foreground/60">
            FAQ
          </h2>
          <div className="mt-3 space-y-3">
            <Faq q="Is this financial literacy course really free?">
              Yes — every lesson is free forever. No card, no subscription.
            </Faq>
            <Faq q="Is Hodlchi good for teens and total beginners?">
              Yes. Lessons are written in plain English with short quizzes and instant feedback,
              designed for people learning about money for the first time.
            </Faq>
            <Faq q="Does Hodlchi give investment advice?">
              No. Hodlchi is strictly educational. We don't offer trading, wallets, or investment
              recommendations.
            </Faq>
          </div>
        </section>

        <div className="mt-10 text-center">
          <Link
            to="/onboarding"
            className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 font-bold text-primary shadow-pop"
          >
            Hatch your Hodlchi
          </Link>
        </div>
      </div>
    </main>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details className="rounded-2xl bg-white/80 p-4 backdrop-blur">
      <summary className="cursor-pointer font-bold">{q}</summary>
      <p className="mt-2 text-sm text-foreground/70">{children}</p>
    </details>
  );
}
