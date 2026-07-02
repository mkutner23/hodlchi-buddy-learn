import { createFileRoute, Link } from "@tanstack/react-router";
import { PATHS } from "@/lib/lessons-data";
import { HodlchiAvatar } from "@/components/HodlchiAvatar";

const URL = "https://demo.hodlchi.com/certificate";
const TITLE = "Free Financial Literacy Certificate — Hodlchi";
const DESCRIPTION =
  "Earn a free Hodlchi Financial Literacy Certificate by completing all 5 learning paths. A fun, gamified course for teens and beginners.";

const FAQ = [
  {
    q: "Is the financial literacy certificate free?",
    a: "Yes. The Hodlchi Financial Literacy Certificate is completely free. Complete all 5 learning paths and claim your certificate at no cost.",
  },
  {
    q: "Who is the certificate for?",
    a: "It's built for teens, students, parents, and beginners who want a simple way to prove they understand money basics like saving, budgeting, credit, investing, and entrepreneurship.",
  },
  {
    q: "How do I earn the certificate?",
    a: "Hatch a Hodlchi, complete every lesson across the 5 learning paths, and pass the short quizzes. Once you finish the full curriculum, your certificate is unlocked.",
  },
  {
    q: "What will I learn?",
    a: "You'll cover the core money basics: saving, investing, credit, entrepreneurship, and crypto fundamentals. Each path has 4 bite-size lessons with instant feedback.",
  },
];

export const Route = createFileRoute("/certificate")({
  component: CertificatePage,
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
          name: "Hodlchi Financial Literacy Certificate",
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
          "@type": "EducationalOccupationalCredential",
          name: "Hodlchi Financial Literacy Certificate",
          description:
            "A free certificate of completion for finishing the Hodlchi financial literacy course.",
          recognizedBy: {
            "@type": "Organization",
            name: "Hodlchi",
            url: "https://demo.hodlchi.com",
          },
          competencyRequired: PATHS.map((p) => p.title).join(", "),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
});

function CertificatePage() {
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

        <header className="mt-4 rounded-3xl bg-white p-6 text-center shadow-soft">
          <div className="text-[10px] font-bold uppercase tracking-widest text-primary-deep">
            Free certificate of completion
          </div>
          <h1 className="mt-2 text-3xl font-black leading-tight">
            Financial Literacy Certificate for Teens
          </h1>
          <p className="mt-3 text-sm text-foreground/70">
            Finish all 5 Hodlchi learning paths and earn a free certificate that shows you’ve
            mastered the money basics.
          </p>

          <div className="mt-5 grid place-items-center">
            <HodlchiAvatar egg="mint" personality="fox" stage="Money Legend" size={140} />
          </div>

          <Link
            to="/onboarding"
            className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-foreground px-5 py-3.5 font-bold text-primary shadow-pop"
          >
            Start the free course →
          </Link>
          <p className="mt-2 text-xs text-foreground/60">
            {totalLessons} lessons · ~{totalMinutes} minutes · No credit card required
          </p>
        </header>

        <section className="mt-8">
          <h2 className="px-1 text-sm font-extrabold uppercase tracking-widest text-foreground/60">
            How to earn it
          </h2>
          <div className="mt-3 space-y-3">
            <Step n={1} title="Hatch your Hodlchi" body="Pick an egg, name your companion, and choose a personality." />
            <Step n={2} title="Complete all 5 paths" body="Saving, Investing, Credit, Entrepreneurship, and Crypto basics." />
            <Step n={3} title="Pass the quizzes" body="Each lesson ends with 3 quick questions and instant feedback." />
            <Step n={4} title="Claim your certificate" body="Unlock a free certificate you can share with teachers, parents, or on your resume." />
          </div>
        </section>

        <section className="mt-8">
          <h2 className="px-1 text-sm font-extrabold uppercase tracking-widest text-foreground/60">
            What you’ll learn
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
          <h2 className="text-lg font-extrabold">Why complete the certificate?</h2>
          <ul className="mt-3 space-y-2 text-sm text-foreground/80">
            <li>🎓 <b>Prove your skills:</b> Show you understand money basics before adulthood.</li>
            <li>📄 <b>Shareable milestone:</b> Great for class assignments, portfolios, and resumes.</li>
            <li>🎮 <b>Fun, not boring:</b> Learn through a game instead of long videos or textbooks.</li>
            <li>🔥 <b>Build a habit:</b> Daily lessons and streaks keep you coming back.</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="px-1 text-sm font-extrabold uppercase tracking-widest text-foreground/60">
            FAQ
          </h2>
          <div className="mt-3 space-y-3">
            {FAQ.map((f) => (
              <details key={f.q} className="rounded-2xl bg-white/80 p-4 backdrop-blur">
                <summary className="cursor-pointer font-bold">{f.q}</summary>
                <p className="mt-2 text-sm text-foreground/70">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="mt-10 text-center">
          <Link
            to="/onboarding"
            className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 font-bold text-primary shadow-pop"
          >
            Hatch your Hodlchi
          </Link>
          <p className="mt-3 text-xs text-foreground/60">
            Educational only. No trading, wallets, or investment advice.
          </p>
        </div>
      </div>
    </main>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-white/80 p-4 backdrop-blur">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-foreground text-sm font-bold text-primary">
        {n}
      </div>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-foreground/70">{body}</div>
      </div>
    </div>
  );
}
