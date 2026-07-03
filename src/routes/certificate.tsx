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
  const a =
    alpha[h % alpha.length] +
    alpha[(h >>> 5) % alpha.length] +
    alpha[(h >>> 10) % alpha.length] +
    alpha[(h >>> 15) % alpha.length];
  const n = String(1000 + (h % 9000));
  return `${a}-${n}`;
}

function escapeCertificateText(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function certificatePrintHtml({
  learnerName,
  awardedDate,
  certId,
}: {
  learnerName: string;
  awardedDate: string;
  certId: string;
}) {
  const safeName = escapeCertificateText(learnerName);
  const safeDate = escapeCertificateText(awardedDate);
  const safeId = escapeCertificateText(certId);

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Hodlchi Financial Literacy Certificate</title>
    <style>
      @page { size: letter landscape; margin: 0; }
      * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      html, body { width: 11in; height: 8.5in; margin: 0; padding: 0; overflow: hidden; background: #ffffff; }
      body { display: flex; align-items: center; justify-content: center; font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #092615; }
      .page { width: 11in; height: 8.5in; display: flex; align-items: center; justify-content: center; padding: 0.28in; overflow: hidden; }
      .certificate { position: relative; width: 100%; height: 100%; overflow: hidden; border-radius: 0.18in; border: 0.045in solid rgba(36, 111, 67, 0.28); background: linear-gradient(135deg, rgba(98, 232, 139, 0.18), #ffffff 48%, rgba(255, 216, 88, 0.24)); padding: 0.32in; }
      .certificate::before { content: ""; position: absolute; inset: 0.12in; border: 1px solid rgba(36, 111, 67, 0.18); border-radius: 0.14in; }
      .glow-a, .glow-b { position: absolute; border-radius: 999px; filter: blur(28px); }
      .glow-a { left: -0.4in; top: -0.35in; width: 1.5in; height: 1.5in; background: rgba(98, 232, 139, 0.24); }
      .glow-b { right: -0.45in; bottom: -0.45in; width: 1.8in; height: 1.8in; background: rgba(255, 216, 88, 0.28); }
      .inner { position: relative; height: 100%; border: 1px solid rgba(36, 111, 67, 0.2); border-radius: 0.1in; background: rgba(255, 255, 255, 0.72); padding: 0 0.52in; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
      .eyebrow { color: #08732c; font-size: 14px; font-weight: 900; letter-spacing: 0.28em; text-transform: uppercase; }
      .brand { margin-top: 0.16in; font-family: Georgia, "Times New Roman", serif; font-size: 50px; line-height: 1; font-weight: 900; letter-spacing: 0; }
      .rule { margin-top: 0.2in; width: 1.95in; height: 1px; background: rgba(36, 111, 67, 0.25); }
      .label { margin-top: 0.28in; color: rgba(9, 38, 21, 0.46); font-size: 12px; font-weight: 800; letter-spacing: 0.32em; text-transform: uppercase; }
      .name { margin-top: 0.1in; font-family: Georgia, "Times New Roman", serif; font-size: 60px; line-height: 1.08; font-weight: 900; letter-spacing: 0; }
      .body { margin-top: 0.18in; max-width: 7.3in; color: rgba(9, 38, 21, 0.72); font-size: 18px; line-height: 1.45; font-weight: 650; }
      .seal { margin-top: 0.26in; width: 0.86in; height: 0.86in; display: grid; place-items: center; border-radius: 999px; border: 0.035in solid rgba(36, 111, 67, 0.26); background: rgba(98, 232, 139, 0.18); font-size: 30px; }
      .meta { margin-top: 0.28in; width: 100%; display: grid; grid-template-columns: 1fr 1fr 1fr; align-items: end; gap: 0.2in; color: rgba(9, 38, 21, 0.56); font-size: 13px; }
      .meta b { display: block; margin-bottom: 0.04in; font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(9, 38, 21, 0.62); }
      .left { text-align: left; } .center { text-align: center; } .right { text-align: right; }
    </style>
  </head>
  <body>
    <main class="page">
      <section class="certificate" aria-label="Financial Literacy Certificate">
        <div class="glow-a"></div><div class="glow-b"></div>
        <div class="inner">
          <div class="eyebrow">Certificate of Completion</div>
          <div class="brand">Hodlchi</div>
          <div class="rule"></div>
          <div class="label">Awarded to</div>
          <div class="name">${safeName}</div>
          <div class="body">For completing all 5 Hodlchi Financial Literacy paths and demonstrating beginner-friendly money basics.</div>
          <div class="seal">✦</div>
          <div class="meta">
            <div class="left"><b>Date</b>${safeDate}</div>
            <div class="center"><b>Certificate ID</b>${safeId}</div>
            <div class="right"><b>Verify</b>hodlchi.com/verify</div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>`;
}

function printCertificateDocument(learnerName: string, awardedDate: string, certId: string) {
  if (typeof window === "undefined") return;

  const frame = document.createElement("iframe");
  frame.title = "Hodlchi certificate print document";
  frame.setAttribute("aria-hidden", "true");
  frame.style.position = "fixed";
  frame.style.left = "-10000px";
  frame.style.top = "0";
  frame.style.width = "11in";
  frame.style.height = "8.5in";
  frame.style.border = "0";

  frame.onload = () => {
    const printWindow = frame.contentWindow;
    if (!printWindow) {
      frame.remove();
      window.print();
      return;
    }
    printWindow.addEventListener("afterprint", () => frame.remove(), { once: true });
    printWindow.focus();
    printWindow.print();
    window.setTimeout(() => frame.remove(), 60_000);
  };

  frame.srcdoc = certificatePrintHtml({ learnerName, awardedDate, certId });
  document.body.appendChild(frame);
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
    printCertificateDocument(learnerName, awardedDate, certId);
  };

  return (
    <>
      <style>{`
        @media print {
          @page { size: letter landscape; margin: 0; }
          html, body {
            background: #fff !important;
            width: 11in !important;
            height: 8.5in !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
          }
          #cert-screen-page { display: none !important; }
          #cert-print-page {
            display: flex !important;
            position: absolute !important;
            inset: 0 !important;
            width: 11in !important;
            height: 8.5in !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 0.28in !important;
            background: #fff !important;
            overflow: hidden !important;
            page-break-before: avoid !important;
            page-break-after: avoid !important;
          }
          #cert-print-page, #cert-print-page * {
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      <div id="cert-print-page" className="hidden">
        <CertificateArtwork
          learnerName={learnerName}
          awardedDate={awardedDate}
          certId={unlocked ? certId : "ABCD-1234"}
          unlocked={unlocked}
          print
        />
      </div>

      <main id="cert-screen-page" className="min-h-screen bg-gradient-sky pb-20">
      <div className="mx-auto max-w-md px-5 pt-6">
        <Link to="/" className="text-sm font-semibold text-foreground/60">
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

            <CertificateArtwork
              learnerName={learnerName}
              awardedDate={awardedDate}
              certId={unlocked ? certId : "ABCD-1234"}
              unlocked={unlocked}
            />
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
    </>
  );
}

function CertificateArtwork({
  learnerName,
  awardedDate,
  certId,
  unlocked,
  print = false,
}: {
  learnerName: string;
  awardedDate: string;
  certId: string;
  unlocked: boolean;
  print?: boolean;
}) {
  const frameClass = print
    ? "relative h-full w-full overflow-hidden rounded-[0.18in] border-[0.045in] border-primary-deep/35 bg-gradient-to-br from-primary/10 via-white to-accent/20 p-[0.32in]"
    : "relative aspect-[11/8.5] overflow-hidden rounded-2xl border-2 border-foreground/10 bg-gradient-to-br from-primary/10 via-white to-accent/20 p-5 shadow-soft";
  const innerClass = print
    ? "relative flex h-full flex-col items-center justify-center rounded-[0.1in] border border-primary-deep/20 bg-white/70 px-[0.52in] text-center"
    : "relative rounded-xl border border-primary-deep/15 bg-white/65 px-4 py-5 text-center";

  return (
    <section className={frameClass} aria-label="Financial Literacy Certificate preview">
      <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
      <div className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-accent/25 blur-2xl" />
      <div className="absolute inset-3 rounded-[inherit] border border-primary-deep/10" />
      <div className={innerClass}>
        <div className={print ? "text-sm font-black uppercase tracking-[0.28em] text-primary-deep" : "text-[9px] font-black uppercase tracking-[0.22em] text-primary-deep"}>
          Certificate of Completion
        </div>
        <div className={print ? "mt-4 font-display text-5xl font-black leading-none" : "mt-2 font-display text-lg font-extrabold leading-none"}>
          Hodlchi
        </div>
        <div className={print ? "mt-5 h-px w-48 bg-primary-deep/25" : "mx-auto mt-3 h-px w-24 bg-primary-deep/20"} />
        <div className={print ? "mt-7 text-xs font-bold uppercase tracking-[0.32em] text-foreground/45" : "mt-3 text-[10px] uppercase tracking-widest text-foreground/50"}>
          Awarded to
        </div>
        <div
          className={`${print ? "mt-3 font-display text-6xl font-black leading-tight" : "mt-1 font-display text-xl font-black leading-tight"} ${
            unlocked ? "text-foreground" : "select-none text-foreground/80 blur-[1px]"
          }`}
        >
          {learnerName}
        </div>
        <p className={print ? "mt-5 max-w-[7.3in] text-lg font-semibold leading-relaxed text-foreground/70" : "mt-2 text-[10px] leading-snug text-foreground/60"}>
          For completing all 5 Hodlchi Financial Literacy paths and demonstrating beginner-friendly money basics.
        </p>
        <div className={print ? "mt-7 grid h-[0.9in] w-[0.9in] place-items-center rounded-full border-[0.035in] border-primary-deep/35 bg-primary/15 text-3xl" : "mx-auto mt-3 grid h-12 w-12 place-items-center rounded-full border border-primary-deep/25 bg-primary/15 text-lg"}>
          ✦
        </div>
        <div className={print ? "mt-6 flex w-full items-end justify-between text-sm text-foreground/55" : "mt-3 flex items-center justify-between text-[9px] text-foreground/50"}>
          <div className="text-left">
            <div className="font-bold uppercase tracking-widest">Date</div>
            <div>{unlocked ? awardedDate : "July 2, 2026"}</div>
          </div>
          <div className="text-center">
            <div className="font-bold uppercase tracking-widest">Certificate ID</div>
            <div>{certId}</div>
          </div>
          <div className="text-right">
            <div className="font-bold uppercase tracking-widest">Verify</div>
            <div>hodlchi.com/verify</div>
          </div>
        </div>
      </div>
    </section>
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
