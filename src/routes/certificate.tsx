import { createFileRoute, Link } from "@tanstack/react-router";
import { PATHS } from "@/lib/lessons-data";
import { HodlchiAvatar } from "@/components/HodlchiAvatar";
import { useHodlchi } from "@/lib/hodlchi-store";
import { useEffect, useMemo, useState } from "react";

const LEARNER_NAME_KEY = "hodlchi-learner-name-v1";


function certIdFor(name: string, count: number) {
  const seed = `${name}-${count}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const alpha = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const a = alpha[h % 24] + alpha[(h >> 5) % 24] + alpha[(h >> 10) % 24] + alpha[(h >> 15) % 24];
  const n = String(1000 + (h % 9000));
  return `${a}-${n}`;
}


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
  const { state } = useHodlchi();
  const totalLessons = PATHS.reduce((n, p) => n + p.lessons.length, 0);
  const totalMinutes = PATHS.reduce(
    (n, p) => n + p.lessons.reduce((m, l) => m + l.minutes, 0),
    0,
  );
  const doneCount = state.completedLessons.length;
  const unlocked = state.onboarded && doneCount >= totalLessons;

  const [learnerNameInput, setLearnerNameInput] = useState("");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(LEARNER_NAME_KEY);
    if (saved) setLearnerNameInput(saved);
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(LEARNER_NAME_KEY, learnerNameInput);
  }, [learnerNameInput]);

  const trimmedLearnerName = learnerNameInput.trim();
  const learnerName = trimmedLearnerName || "Your Name Here";
  const hasName = trimmedLearnerName.length > 0;

  const certId = useMemo(
    () => certIdFor(learnerName, totalLessons),
    [learnerName, totalLessons],
  );
  const awardedDate = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <main className="min-h-screen bg-gradient-sky pb-20 print:bg-white print:pb-0">
      {/* Print styles: isolate certificate card only */}
      <style>{`
        @media print {
          @page { size: letter landscape; margin: 0.5in; }
          html, body { background: #fff !important; }
          body * { visibility: hidden !important; }
          #cert-print, #cert-print * { visibility: visible !important; }
          #cert-print {
            position: absolute !important;
            left: 0; top: 0;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0.25in !important;
            box-shadow: none !important;
            border: none !important;
            background: #fff !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="mx-auto max-w-md px-5 pt-6 print:max-w-none print:px-0 print:pt-0">
        <Link to="/" className="no-print text-sm font-semibold text-foreground/60">
          ← Back
        </Link>

        <header className="mt-4 rounded-3xl bg-white p-6 text-center shadow-soft">
          <div className="text-[10px] font-bold uppercase tracking-widest text-primary-deep">
            {unlocked ? "🎉 Certificate unlocked" : "Free certificate of completion"}
          </div>
          <h1 className="mt-2 text-3xl font-black leading-tight">
            Financial Literacy Certificate
          </h1>
          <p className="mt-3 text-sm text-foreground/70">
            {unlocked
              ? `Amazing work${hasName ? `, ${learnerName}` : ""}! You finished all ${totalLessons} lessons across every Hodlchi path.`
              : "Finish all 5 Hodlchi learning paths and earn a free certificate that shows you've mastered the money basics."}
          </p>

          <div className="mt-5 grid place-items-center">
            <HodlchiAvatar egg={state.egg ?? "mint"} personality={state.personality ?? "fox"} stage="Money Legend" size={140} />
          </div>

          {unlocked && (
            <div className="mt-5 text-left">
              <label htmlFor="learner-name" className="block text-[10px] font-bold uppercase tracking-widest text-foreground/50">
                Your name (as it should appear on the certificate)
              </label>
              <input
                id="learner-name"
                type="text"
                value={learnerNameInput}
                onChange={(e) => setLearnerNameInput(e.target.value)}
                placeholder="e.g. Alex Johnson"
                maxLength={60}
                className="mt-2 w-full rounded-2xl border-2 border-foreground/15 bg-white px-4 py-3 text-base font-semibold outline-none focus:border-primary-deep"
              />
              <p className="mt-1 text-[11px] text-foreground/50">
                This is different from your Hodlchi's name ({state.name || "your pet"}). Enter the person's name that should appear on the certificate.
              </p>
            </div>
          )}

          <div className="mt-5 text-left">
            <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/50 mb-2 text-center">
              {unlocked ? "Your certificate" : "Preview your certificate"}
            </div>

            <div
              id="cert-print"
              className="relative overflow-hidden rounded-2xl border-2 border-foreground/10 bg-gradient-to-br from-primary/10 via-white to-primary/20 p-5 shadow-soft print:rounded-none print:border-4 print:border-primary-deep/40 print:p-10 print:aspect-[11/8.5]"
            >
              <div className="relative text-center print:flex print:h-full print:flex-col print:items-center print:justify-center">
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-deep print:text-sm">
                  Certificate of Completion
                </div>
                <div className="mt-2 font-display text-lg font-extrabold print:text-3xl">Hodlchi</div>
                <div className="mt-3 text-[10px] uppercase tracking-widest text-foreground/50 print:mt-8 print:text-xs">
                  Awarded to
                </div>
                <div
                  className={`mt-1 font-display text-xl font-black print:mt-3 print:text-5xl ${
                    unlocked && hasName
                      ? "text-foreground"
                      : "text-foreground/80 blur-[1px] select-none print:blur-0"
                  }`}
                >
                  {learnerName}
                </div>
                <div className="mt-2 text-[10px] text-foreground/60 print:mt-6 print:text-base">
                  For completing all 5 Hodlchi Financial Literacy paths
                </div>
                {unlocked && (
                  <div className="mt-1 text-[10px] text-foreground/60 print:mt-2 print:text-sm">{awardedDate}</div>
                )}
                <div className="mt-3 flex items-center justify-between text-[9px] text-foreground/50 print:mt-10 print:w-full print:text-xs">
                  <span>ID · {unlocked ? certId : "ABCD-1234"}</span>
                  <span>hodlchi.com/verify</span>
                </div>
              </div>
            </div>
          </div>

          {unlocked ? (
            <>
              <button
                onClick={handlePrint}
                disabled={!hasName}
                className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-foreground px-5 py-3.5 font-bold text-primary shadow-pop disabled:opacity-40"
              >
                {hasName ? "Print or save as PDF →" : "Enter your name to print"}
              </button>
              <Link
                to="/dashboard"
                className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-foreground/20 bg-white px-5 py-3 text-sm font-bold text-foreground"
              >
                Back to dashboard
              </Link>
              <p className="mt-2 text-xs text-foreground/60">
                {totalLessons}/{totalLessons} lessons complete • Certificate ID {certId}
              </p>
            </>
          ) : (
            <>
              <Link
                to={state.onboarded ? "/dashboard" : "/onboarding"}
                className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-foreground px-5 py-3.5 font-bold text-primary shadow-pop"
              >
                {state.onboarded ? "Keep learning →" : "Start the free course →"}
              </Link>
              <p className="mt-2 text-xs text-foreground/60">
                {state.onboarded
                  ? `${doneCount}/${totalLessons} lessons complete • Finish them all to unlock your certificate`
                  : `${totalLessons} lessons • About ${Math.round(totalMinutes / 5) * 5} minutes • No credit card required`}
              </p>
            </>
          )}
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
            <li>🎓 <b>Prove your skills:</b> Show you understand money basics.</li>
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
