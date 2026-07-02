import { createFileRoute, Link } from "@tanstack/react-router";
import { HodlchiAvatar } from "@/components/HodlchiAvatar";
import { ProductWalkthrough } from "@/components/ProductWalkthrough";
import { useHodlchi } from "@/lib/hodlchi-store";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "Hodlchi — Learn money. Raise your Hodlchi." },
      {
        name: "description",
        content:
          "Hodlchi is the Duolingo of Money. Hatch a cute companion and level it up with 3-minute lessons on saving, investing, credit, and more.",
      },
      { property: "og:title", content: "Hodlchi — Learn money. Raise your Hodlchi." },
      {
        property: "og:description",
        content:
          "Hatch a cute companion and grow it with bite-size money lessons. Fun, friendly, 100% educational.",
      },
      { property: "og:url", content: "https://demo.hodlchi.com/" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://demo.hodlchi.com/" }],
  }),
});

function Landing() {
  const { state, demoMode } = useHodlchi();
  const primaryCta = state.onboarded ? { to: "/home", label: "Open my Hodlchi" } : { to: "/onboarding", label: "Hatch my Hodlchi" };

  return (
    <main className="min-h-screen bg-gradient-hero">
      <div className="mx-auto max-w-md px-5 pt-10 pb-16">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-foreground text-primary text-lg font-black">H</div>
            <span className="font-display text-xl font-extrabold">Hodlchi</span>
          </div>
          <button
            onClick={() => {
              demoMode();
              window.location.href = "/home";
            }}
            className="rounded-full border border-foreground/20 bg-white/60 px-3 py-1.5 text-xs font-semibold backdrop-blur"
          >
            Mentor demo
          </button>
        </header>

        <section className="mt-10 text-center">
          <div className="mx-auto w-fit rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-primary-deep shadow-soft">
            The Duolingo of Money
          </div>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
            Learn money.<br />Raise your <span className="text-primary-deep">Hodlchi.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-base text-foreground/70">
            Build real money skills in just 3 minutes a day. Every lesson helps your Hodlchi evolve — and helps you build your financial future.
          </p>
          <p className="mx-auto mt-3 max-w-sm text-sm font-semibold text-foreground/80 italic">
            From financial beginner to financial confidence — 3 minutes at a time.
          </p>
          <p className="mx-auto mt-3 max-w-sm text-sm font-semibold text-primary-deep">
            Come back every day to keep your streak alive and unlock new evolutions.
          </p>

          <div className="mt-8 grid place-items-center">
            <div className="relative">
              {/* Sparkles */}
              <span className="pointer-events-none absolute -left-4 top-2 text-lg animate-sparkle-a">✨</span>
              <span className="pointer-events-none absolute -right-2 top-8 text-base animate-sparkle-b">✨</span>
              <span className="pointer-events-none absolute left-6 -bottom-2 text-sm animate-sparkle-c">💚</span>
              {/* Blink overlay */}
              <span className="pointer-events-none absolute left-1/2 top-[38%] -translate-x-1/2 h-1.5 w-14 rounded-full bg-foreground/80 animate-blink" />
              <div className="animate-wiggle">
                <HodlchiAvatar egg="mint" personality="fox" stage="Baby Hodlchi" size={200} />
              </div>
            </div>
          </div>

          <Link
            to={primaryCta.to}
            className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-foreground px-6 py-4 text-base font-bold text-primary shadow-pop transition active:scale-[0.98]"
          >
            {primaryCta.label} →
          </Link>
          <p className="mt-3 text-xs text-foreground/60">
            Educational only. No trading, wallets, or investment advice.
          </p>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-foreground/50">
            Your Money Companion
          </p>
        </section>

        <section className="mt-10">
          <div className="mb-3 text-center">
            <div className="text-[10px] font-bold uppercase tracking-widest text-primary-deep">
              30-second product tour
            </div>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight">
              See the core loop in action
            </h2>
          </div>
          <ProductWalkthrough />
        </section>

        <section className="mt-10 rounded-2xl bg-foreground p-5 text-center shadow-pop">
          <div className="text-[10px] font-bold uppercase tracking-widest text-primary">
            Our moat
          </div>
          <p className="mt-1 text-lg font-extrabold text-primary">
            Built to make learning money a daily habit.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-center text-2xl font-extrabold tracking-tight">Why learn with Hodlchi?</h2>
          <div className="mt-5 grid gap-3">
            <FeatureRow emoji="🥚" title="Learn by raising a companion you'll actually care about" body="Hatch, name, and grow a Hodlchi that evolves with every lesson you finish." />
            <FeatureRow emoji="📚" title="Master the money skills schools rarely teach" body="Saving, investing, credit, entrepreneurship, and crypto basics — in plain English." />
            <FeatureRow emoji="🔥" title="Build a daily money habit that lasts" body="Streaks, daily challenges, and evolutions turn 3 minutes a day into real confidence." />
          </div>
        </section>

        <section className="mt-8 rounded-2xl bg-white/80 p-4 text-center shadow-soft backdrop-blur">
          <div className="text-[10px] font-bold uppercase tracking-widest text-primary-deep">
            For students, parents, teachers & anyone learning money
          </div>
          <h2 className="mt-1 text-lg font-bold">Financial literacy for everyone</h2>
          <div className="mt-2 flex flex-col items-center gap-1 text-sm">
            <Link
              to="/financial-literacy-for-teens"
              className="font-semibold text-primary-deep underline underline-offset-2"
            >
              See the curriculum →
            </Link>
            <Link
              to="/certificate"
              className="font-semibold text-primary-deep underline underline-offset-2"
            >
              Free financial literacy certificate →
            </Link>
            <Link
              to="/blog/what-is-financial-literacy-for-teens"
              className="font-semibold text-foreground/70 underline underline-offset-2"
            >
              What is financial literacy? →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function FeatureRow({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-white/70 p-4 shadow-soft backdrop-blur">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/30 text-xl">{emoji}</div>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-foreground/70">{body}</div>
      </div>
    </div>
  );
}
