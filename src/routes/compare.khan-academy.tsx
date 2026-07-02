import { createFileRoute, Link } from "@tanstack/react-router";
import { HodlchiLogo } from "@/components/HodlchiLogo";

const URL_ = "https://demo.hodlchi.com/compare/khan-academy";
const TITLE = "Hodlchi vs Khan Academy: Financial Literacy Compared";
const DESCRIPTION =
  "Compare Hodlchi and Khan Academy for financial literacy. Gamified 3-minute lessons vs traditional video courses — see which fits teens and beginners best.";

type Row = { feature: string; hodlchi: string; khan: string };

const ROWS: Row[] = [
  {
    feature: "Format",
    hodlchi: "Gamified 5-minute lessons with a companion that levels up",
    khan: "Video lectures with practice exercises",
  },
  {
    feature: "Best for",
    hodlchi: "Teens & beginners building a daily money habit",
    khan: "Learners who prefer structured, lecture-style courses",
  },
  {
    feature: "Motivation loop",
    hodlchi: "XP, streaks, evolution stages, daily challenges",
    khan: "Progress bars and mastery points",
  },
  {
    feature: "Topics",
    hodlchi: "Saving, Investing, Credit, Entrepreneurship, Crypto basics",
    khan: "Personal finance, taxes, budgeting, investing",
  },
  {
    feature: "Session length",
    hodlchi: "~5 minutes per lesson",
    khan: "10–20 minute videos",
  },
  {
    feature: "Price",
    hodlchi: "Free",
    khan: "Free",
  },
  {
    feature: "Approach",
    hodlchi: "Learn by playing — care for a virtual Hodlchi",
    khan: "Learn by watching — classroom-style curriculum",
  },
];

const FAQ = [
  {
    q: "Is Khan Academy good for financial literacy?",
    a: "Yes — Khan Academy offers a solid, free personal finance curriculum with video lectures on budgeting, taxes, and investing. It's a great fit for learners who like structured, classroom-style courses.",
  },
  {
    q: "How is Hodlchi different from Khan Academy?",
    a: "Hodlchi turns financial literacy into a daily habit. Instead of watching lectures, you complete 5-minute lessons to feed and evolve a virtual companion. It's designed for beginners who bounce off long-form video.",
  },
  {
    q: "Which is better for beginners?",
    a: "If you already enjoy longer courses, Khan Academy works well. If you need motivation to come back daily, Hodlchi's streaks, XP, and evolving character are usually more effective at building the habit.",
  },
  {
    q: "Can I use both?",
    a: "Absolutely. Many learners use Hodlchi for the daily 5-minute reps and Khan Academy for deeper dives on specific topics like taxes or compound interest.",
  },
];

export const Route = createFileRoute("/compare/khan-academy")({
  component: ComparePage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: URL_ },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL_ }],
    scripts: [
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
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: TITLE,
          description: DESCRIPTION,
          author: { "@type": "Organization", name: "Hodlchi" },
          publisher: { "@type": "Organization", name: "Hodlchi" },
          mainEntityOfPage: URL_,
        }),
      },
    ],
  }),
});

function ComparePage() {
  return (
    <main className="min-h-screen bg-gradient-hero">
      <div className="mx-auto max-w-2xl px-5 pt-10 pb-16">
        <header className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <HodlchiLogo size={36} className="drop-shadow-sm" />
            <span className="font-display text-xl font-extrabold">Hodlchi</span>
          </Link>
          <Link to="/financial-literacy-for-everyone" className="text-xs font-semibold text-primary-deep underline underline-offset-2">
            Curriculum
          </Link>
        </header>

        <section className="mt-8">
          <div className="w-fit rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-primary-deep shadow-soft">
            Comparison guide
          </div>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            Hodlchi vs Khan Academy for financial literacy
          </h1>
          <p className="mt-3 text-foreground/70">
            Khan Academy is a beloved free classroom. Hodlchi is a daily-habit game. Here's an honest side-by-side so you can pick what fits — or use both.
          </p>
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl bg-white/80 shadow-soft backdrop-blur">
          <div className="grid grid-cols-3 gap-0 border-b border-foreground/10 bg-white/60 p-3 text-xs font-bold uppercase tracking-widest text-foreground/60">
            <div>Feature</div>
            <div>Hodlchi</div>
            <div>Khan Academy</div>
          </div>
          {ROWS.map((r) => (
            <div key={r.feature} className="grid grid-cols-3 gap-3 border-b border-foreground/5 p-3 text-sm last:border-b-0">
              <div className="font-semibold">{r.feature}</div>
              <div className="text-foreground/80">{r.hodlchi}</div>
              <div className="text-foreground/70">{r.khan}</div>
            </div>
          ))}
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-extrabold tracking-tight">Gamified vs traditional learning</h2>
          <p className="mt-3 text-foreground/75">
            Traditional courses like Khan Academy's personal-finance track deliver depth: full lectures on taxes, compound interest, and budgeting frameworks. That structure is powerful — if you can sit down and press play consistently.
          </p>
          <p className="mt-3 text-foreground/75">
            Hodlchi is built for the moments in between. A 5-minute lesson feeds your companion, keeps your streak alive, and drops one useful money idea. The daily loop is the whole point: hatch → learn → feed → level up → return tomorrow.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-extrabold tracking-tight">Which should you pick?</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/80 p-4 shadow-soft backdrop-blur">
              <div className="text-xs font-bold uppercase tracking-widest text-primary-deep">Pick Khan Academy if…</div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground/80">
                <li>You like long-form videos and worked examples.</li>
                <li>You want a classroom-style curriculum with quizzes.</li>
                <li>You're studying a specific topic in depth (e.g. taxes).</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-primary/20 p-4 shadow-soft backdrop-blur">
              <div className="text-xs font-bold uppercase tracking-widest text-primary-deep">Pick Hodlchi if…</div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground/80">
                <li>You want a fun 5-minute daily money habit.</li>
                <li>You (or your teen) bounce off long videos.</li>
                <li>Streaks, XP, and a cute companion keep you coming back.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-extrabold tracking-tight">FAQ</h2>
          <div className="mt-4 grid gap-3">
            {FAQ.map((f) => (
              <div key={f.q} className="rounded-2xl bg-white/80 p-4 shadow-soft backdrop-blur">
                <div className="font-semibold">{f.q}</div>
                <p className="mt-1 text-sm text-foreground/75">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl bg-foreground p-6 text-center text-primary shadow-pop">
          <h2 className="text-xl font-extrabold">Try the 5-minute money habit</h2>
          <p className="mt-2 text-sm text-primary/80">Hatch your Hodlchi and finish your first lesson today.</p>
          <Link
            to="/onboarding"
            className="mt-4 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-foreground"
          >
            Hatch my Hodlchi →
          </Link>
        </section>

        <p className="mt-6 text-center text-xs text-foreground/50">
          Hodlchi is not affiliated with Khan Academy. Educational only — no trading, wallets, or investment advice.
        </p>
      </div>
    </main>
  );
}
