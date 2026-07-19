import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { HodlchiLogo } from "@/components/HodlchiLogo";
import { ProductWalkthrough } from "@/components/ProductWalkthrough";
import { useHodlchi } from "@/lib/hodlchi-store";
import { useI18n } from "@/lib/i18n";


export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    // Title, description, og:title, og:description come from sitewide
    // defaults in src/routes/__root.tsx to avoid duplicate tags.
    meta: [
      { property: "og:url", content: "https://hodlchi.com/" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "https://hodlchi.com/" },
      { rel: "alternate", hrefLang: "en", href: "https://hodlchi.com/" },
      { rel: "alternate", hrefLang: "es", href: "https://hodlchi.com/es" },
      { rel: "alternate", hrefLang: "x-default", href: "https://hodlchi.com/" },
    ],
  }),
});

export function Landing() {
  const { demoMode } = useHodlchi();
  const nav = useNavigate();
  const { locale, t } = useI18n();
  const es = locale === "es";

  return (
    <main className="min-h-screen bg-gradient-hero">
      <div className="mx-auto max-w-2xl px-5 pt-8 pb-16">
        <header className="flex flex-col items-center text-center">
          <HodlchiLogo size={120} className="drop-shadow-sm" />
          <span className="mt-2 font-display text-4xl font-extrabold tracking-tight">
            Hodlchi
          </span>
          <span className="mt-1 text-sm font-semibold text-primary-deep">
            {t("landing.footer.tagline")}
          </span>
        </header>

        <section className="mt-8 text-center">
          <div className="mt-4 grid place-items-center">
            <div className="relative">
              <span className="pointer-events-none absolute -left-6 top-4 text-xl animate-sparkle-a">✨</span>
              <span className="pointer-events-none absolute -right-4 top-14 text-lg animate-sparkle-b">✨</span>
              <span className="pointer-events-none absolute left-6 -bottom-2 text-base animate-sparkle-c">💚</span>
              <div className="animate-wiggle">
                <HodlchiLogo size={190} />
              </div>
            </div>
          </div>

          {/* Penny greets first — she is the hero */}
          <div className="relative mx-auto mt-4 inline-block max-w-[22rem] rounded-2xl bg-white px-5 py-3 text-left shadow-pop">
            <span className="mr-1 font-display font-extrabold">Penny:</span>
            <span className="text-foreground/80 text-[15px]">
              {es ? "¡Hola! Soy Penny. ¿Me incubas?" : "Hi! I'm Penny. Will you hatch me?"}
            </span>
            <span className="absolute -top-1.5 left-10 h-3 w-3 rotate-45 bg-white" />
          </div>

          <h1 className="mt-6 font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl">
            {t("landing.hero.title")}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-center text-[15px] text-foreground/80">
            {t("landing.hero.subtitle")}
          </p>

          <Link
            to="/onboarding"
            className="mt-7 inline-flex w-full max-w-sm items-center justify-center rounded-2xl bg-foreground px-6 py-4 text-base font-bold text-primary shadow-pop transition active:scale-[0.98]"
          >
            {es ? "Incuba a Penny" : "Hatch Penny"} →
          </Link>

          <p className="mt-3 text-xs text-foreground/60">
            {es ? "Solo educativo. Sin trading, wallets ni asesoría de inversión." : "Educational only. No trading, wallets, or investment advice."}
          </p>
        </section>

        <section className="mt-10">
          <div className="mb-3 text-center">
            <div className="text-[10px] font-bold uppercase tracking-widest text-primary-deep">
              {es ? "Tour de producto de 30 segundos" : "30-second product tour"}
            </div>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight">
              {es ? "Mira el ciclo principal en acción" : "See the core loop in action"}
            </h2>
          </div>
          <ProductWalkthrough />
        </section>

        <section className="mt-10 rounded-2xl bg-foreground p-5 text-center shadow-pop">
          <p className="text-lg font-extrabold text-primary">
            {es ? "5 minutos hoy. Dinero más inteligente mañana." : "5 minutes today. Smarter money tomorrow."}
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-primary/70">
            {es ? "Diseñado para crear hábitos financieros de por vida" : "Designed to build lifelong money habits"}
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-center text-2xl font-extrabold tracking-tight">
            {t("landing.features.title")}
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <FeatureCard
              emoji="🥚"
              title={es ? "Aprende criando a un compañero que sí te importará" : "Learn by raising a companion you'll actually care about"}
              body={es ? "Incuba, ponle nombre y haz crecer a un Hodlchi que evoluciona con cada lección que terminas." : "Hatch, name, and grow a Hodlchi that evolves with every lesson you finish."}
            />
            <FeatureCard
              emoji="📚"
              title={es ? "Domina las habilidades de dinero que las escuelas rara vez enseñan" : "Master the money skills schools rarely teach"}
              body={es ? "Lecciones simples que hacen el dinero más fácil de entender." : "Simple lessons that make money easier to understand."}
            />
            <FeatureCard
              emoji="🔥"
              title={es ? "Construye un hábito diario de dinero que dura" : "Build a daily money habit that lasts"}
              body={es ? "Rachas, retos diarios y evoluciones convierten 5 minutos al día en confianza real." : "Streaks, daily challenges, and evolutions turn 5 minutes a day into real confidence."}
            />
          </div>
        </section>

        <section className="mt-8 rounded-2xl bg-white/80 p-4 text-center shadow-soft backdrop-blur">
          <div className="text-[10px] font-bold uppercase tracking-widest text-primary-deep">
            {es ? "Para estudiantes, padres, profesores y cualquiera que aprenda de dinero" : "For students, parents, teachers & anyone learning money"}
          </div>
          <h2 className="mt-1 text-lg font-bold">{t("for_everyone.title")}</h2>
          <div className="mt-2 flex flex-col items-center gap-1 text-sm">
            <Link to="/financial-literacy-for-everyone" className="font-semibold text-primary-deep underline underline-offset-2">
              {es ? "Ver el currículo →" : "See the curriculum →"}
            </Link>
            <Link to="/certificate" className="font-semibold text-primary-deep underline underline-offset-2">
              {es ? "Certificado gratuito de alfabetización financiera →" : "Free financial literacy certificate →"}
            </Link>
            <Link to="/blog/what-is-financial-literacy" className="font-semibold text-foreground/70 underline underline-offset-2">
              {es ? "¿Qué es la alfabetización financiera? →" : "What is financial literacy? →"}
            </Link>
          </div>
        </section>

        <section className="mt-10 border-t border-foreground/10 pt-6 text-center">
          <p className="text-xs uppercase tracking-widest text-foreground/50 font-semibold">
            {es ? "¿Solo quieres echar un vistazo?" : "Just want to look around?"}
          </p>
          <button
            onClick={() => {
              demoMode();
              nav({ to: "/dashboard" });
            }}
            className="mt-2 rounded-full border border-foreground/20 bg-white/80 px-4 py-2 text-xs font-semibold backdrop-blur"
          >
            {t("landing.hero.cta_demo")} →
          </button>
          <p className="mt-2 text-[11px] text-foreground/50">
            {es ? "Vista previa de un Hodlchi con progreso de ejemplo." : "Preview a Hodlchi with sample progress."}
          </p>
        </section>

        <footer className="mt-12 border-t border-foreground/10 pt-6">
          <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">
            {es ? "Recursos" : "Resources"}
          </div>
          <ul className="mt-3 grid gap-2 text-sm">
            <li>
              <Link to="/financial-literacy-for-everyone" className="font-semibold text-foreground/80 underline underline-offset-2">
                {t("nav.curriculum")}
              </Link>
            </li>
            <li>
              <Link to="/certificate" className="font-semibold text-foreground/80 underline underline-offset-2">
                {es ? "Certificado de Alfabetización Financiera" : "Financial Literacy Certificate"}
              </Link>
            </li>
            <li>
              <Link to="/blog/what-is-financial-literacy" className="font-semibold text-foreground/80 underline underline-offset-2">
                {es ? "¿Qué es la alfabetización financiera?" : "What is Financial Literacy?"}
              </Link>
            </li>
            <li>
              <Link to="/money-basics" className="font-semibold text-foreground/80 underline underline-offset-2">
                {es ? "Glosario de conceptos básicos" : "Money Basics glossary"}
              </Link>
            </li>
            <li>
              <Link to="/compare/khan-academy" className="font-semibold text-foreground/80 underline underline-offset-2">
                {es ? "Comparar con Khan Academy" : "Compare to Khan Academy"}
              </Link>
            </li>
          </ul>
          <p className="mt-6 text-[11px] text-foreground/50">
            © Hodlchi · {t("landing.footer.disclaimer")}
          </p>
        </footer>
      </div>
    </main>
  );
}


function FeatureCard({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/70 p-4 text-center shadow-soft backdrop-blur">
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/30 text-2xl">{emoji}</div>
      <div className="font-bold leading-snug">{title}</div>
      <div className="text-sm text-foreground/70">{body}</div>
    </div>
  );
}
