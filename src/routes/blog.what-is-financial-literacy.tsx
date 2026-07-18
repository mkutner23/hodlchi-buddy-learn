import { createFileRoute, Link } from "@tanstack/react-router";
import { HodlchiLogo } from "@/components/HodlchiLogo";

const URL = "https://hodlchi.com/blog/what-is-financial-literacy";
const TITLE = "What is Financial Literacy? A Simple Guide";
const DESCRIPTION =
  "A beginner-friendly guide to financial literacy: saving, budgeting, credit, investing, and entrepreneurship — no jargon.";

const FAQ = [
  {
    q: "What is financial literacy?",
    a: "Financial literacy is the ability to understand and manage money basics. It covers saving, budgeting, credit, investing, and earning — the skills that make day-to-day and future money decisions easier.",
  },
  {
    q: "Why is financial literacy important?",
    a: "People face real money decisions earlier than ever: first jobs, bank accounts, spending online, and even student loans or rent. Learning the basics early builds confidence and helps avoid costly mistakes like debt or missed savings.",
  },
  {
    q: "What topics are covered in a financial literacy course?",
    a: "A good beginner course covers saving, budgeting, credit and borrowing, investing basics, entrepreneurship, and how to protect money. Hodlchi breaks these into 5 short paths with 4 lessons each.",
  },
  {
    q: "Can you learn financial literacy for free?",
    a: "Yes. Hodlchi offers a free gamified financial literacy course with short lessons and quizzes. No credit card, no subscription, and no investment advice.",
  },
];

export const Route = createFileRoute("/blog/what-is-financial-literacy")({
  component: GuidePage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: URL },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "What is Financial Literacy?",
          description: DESCRIPTION,
          author: { "@type": "Organization", name: "Hodlchi" },
          publisher: { "@type": "Organization", name: "Hodlchi" },
          mainEntityOfPage: URL,
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

export function GuidePage() {
  return (
    <main className="min-h-screen bg-gradient-hero">
      <div className="mx-auto max-w-2xl px-5 pt-10 pb-16">
        <header className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <HodlchiLogo size={36} />
            <span className="font-display text-xl font-extrabold">Hodlchi</span>
          </Link>
          <Link
            to="/financial-literacy-for-everyone"
            className="text-xs font-semibold text-primary-deep underline underline-offset-2"
          >
            Curriculum
          </Link>
        </header>

        <article className="mt-8">
          <div className="w-fit rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-primary-deep shadow-soft">
            Money basics for everyone
          </div>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            What is financial literacy? A simple guide to money basics
          </h1>
          <p className="mt-3 text-sm text-foreground/70">
            Last updated: July 2026 · 4 min read
          </p>

          <section className="mt-8 rounded-2xl bg-white/80 p-5 shadow-soft backdrop-blur">
            <h2 className="text-xl font-extrabold">Financial literacy definition</h2>
            <p className="mt-2 text-foreground/80">
              Financial literacy is the ability to understand and use money skills in everyday life. That includes earning, saving, spending, borrowing, investing, and protecting money. It means building a practical money mindset before bills, rent, loans, or paychecks arrive.
            </p>
          </section>

          <section className="mt-6">
            <h2 className="text-2xl font-extrabold tracking-tight">Why money basics matter</h2>
            <p className="mt-3 text-foreground/75">
              Making money decisions comes earlier than most people think: first paychecks, online purchases, subscriptions, and peer pressure to spend. Without the basics, small habits can become expensive problems. A few hours of financial literacy can prevent years of avoidable debt or missed opportunities.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-foreground/75">
              <li><b>Save before spending:</b> Pay yourself first, even with small amounts.</li>
              <li><b>Budget without stress:</b> A simple plan beats perfection every time.</li>
              <li><b>Use credit carefully:</b> Borrowing is a tool, not free money.</li>
              <li><b>Start investing early:</b> Time is the biggest advantage young people have.</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-extrabold tracking-tight">5 money basics everyone should know</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <TopicCard emoji="💰" title="Saving" body="Build the habit of keeping more than you spend. Even pocket money can grow into an emergency fund." />
              <TopicCard emoji="🧾" title="Budgeting" body="Track money in and money out. A simple split between needs, wants, and savings is enough to start." />
              <TopicCard emoji="💳" title="Credit" body="Understand credit scores, interest, and why borrowing has a real cost. Good credit opens doors later." />
              <TopicCard emoji="📈" title="Investing" body="Learn how compound growth works and why starting small and early beats waiting for a big paycheck." />
              <TopicCard emoji="🚀" title="Entrepreneurship" body="Turn a skill or hobby into income. Even tiny ventures teach pricing, profit, and problem-solving." />
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-extrabold tracking-tight">How Hodlchi teaches financial literacy</h2>
            <p className="mt-3 text-foreground/75">
              Hodlchi turns money basics into a daily habit. Instead of a long lecture, you hatch a virtual companion and complete 5-minute lessons. Each lesson feeds your Hodlchi, earns XP, and keeps your streak alive. It's the Duolingo of Money — designed for beginners who want to learn without being overwhelmed.
            </p>
          </section>

          <section className="mt-10 rounded-2xl bg-foreground p-6 text-center text-primary shadow-pop">
            <h2 className="text-xl font-extrabold">Start your money basics journey</h2>
            <p className="mt-2 text-sm text-primary/80">
              Hatch your Hodlchi and finish your first free lesson in under 5 minutes.
            </p>
            <Link
              to="/onboarding"
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-foreground"
            >
              Hatch my Hodlchi →
            </Link>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-extrabold tracking-tight">Frequently asked questions</h2>
            <div className="mt-4 grid gap-3">
              {FAQ.map((f) => (
                <details key={f.q} className="rounded-2xl bg-white/80 p-4 shadow-soft backdrop-blur">
                  <summary className="cursor-pointer font-bold">{f.q}</summary>
                  <p className="mt-2 text-sm text-foreground/70">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        </article>

        <p className="mt-8 text-center text-xs text-foreground/50">
          Educational only. No trading, wallets, or investment advice.
        </p>
      </div>
    </main>
  );
}

function TopicCard({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  return (
    <div className="rounded-2xl bg-white/80 p-4 shadow-soft backdrop-blur">
      <div className="text-xl">{emoji}</div>
      <div className="mt-1 font-bold">{title}</div>
      <p className="mt-1 text-sm text-foreground/70">{body}</p>
    </div>
  );
}
