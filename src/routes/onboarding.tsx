import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Dice5 } from "lucide-react";
import {
  EggPreview,
  HodlchiAvatar,
  getPersonalityMeta,
  EGGS,
  PERSONALITIES,
} from "@/components/HodlchiAvatar";
import { useHodlchi, type EggColor, type Personality } from "@/lib/hodlchi-store";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
  head: () => ({
    meta: [
      { title: "Hatch your Hodlchi — Onboarding" },
      {
        name: "description",
        content:
          "Pick an egg, name your companion, and choose how it learns. Your Hodlchi hatches in under a minute.",
      },
      { property: "og:title", content: "Hatch your Hodlchi" },
      {
        property: "og:description",
        content: "Choose an egg, a name, and a learning style to start your money journey.",
      },
      { property: "og:url", content: "https://demo.hodlchi.com/onboarding" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://demo.hodlchi.com/onboarding" }],
  }),
});

const EGG_HINTS: Record<EggColor, { emoji: string; hint: string }> = {
  mint: { emoji: "🟢", hint: "Calm & balanced" },
  sun: { emoji: "🟡", hint: "Bright & optimistic" },
  berry: { emoji: "🩷", hint: "Curious & playful" },
};

const PERSONALITY_HINTS: Record<Personality, string> = {
  ape: "Learns by trying.",
  turtle: "Learns one step at a time.",
  fox: "Loves solving puzzles.",
};

const PERSONALITY_GREETINGS: Record<Personality, string> = {
  ape: "Let's try something new today!",
  turtle: "One lesson at a time. 🐢",
  fox: "Let's solve some money puzzles!",
};


const RANDOM_NAMES = [
  "Bean", "Mochi", "Atlas", "Pixel", "Penny", "Waffles",
  "Nugget", "Sage", "Pip", "Biscuit", "Ziggy", "Clover",
  "Mango", "Nova", "Tofu", "Miso",
];

function Onboarding() {
  const nav = useNavigate();
  const { setOnboarding } = useHodlchi();
  // steps: 0 egg, 1 name, 2 hatch, 3 personality
  const [step, setStep] = useState(0);
  const [egg, setEgg] = useState<EggColor>("mint");
  const [name, setName] = useState("");
  const [personality, setPersonality] = useState<Personality>("fox");

  const [hatchPhase, setHatchPhase] = useState<"idle" | "cracking" | "revealed">("idle");
  const [hatchCTAReady, setHatchCTAReady] = useState(false);

  useEffect(() => {
    if (step !== 2) {
      setHatchPhase("idle");
      setHatchCTAReady(false);
      return;
    }
    setHatchPhase("cracking");
    const t1 = setTimeout(() => setHatchPhase("revealed"), 1700);
    const t2 = setTimeout(() => setHatchCTAReady(true), 3600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [step]);

  const displayName = name.trim() || "Hodlchi";

  const canNext =
    (step === 0 && !!egg) ||
    (step === 1 && name.trim().length > 0) ||
    (step === 2 && hatchCTAReady) ||
    step === 3;

  const handleNext = () => {
    if (step === 0 || step === 1) {
      setStep(step + 1);
    } else if (step === 2) {
      if (!hatchCTAReady) return;
      setStep(3);

    } else {
      setOnboarding({ name: displayName, egg, personality });
      nav({ to: "/demo" });
    }
  };

  const rollRandomName = () => {
    const pick = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
    setName(pick);
  };

  return (
    <main className="min-h-screen bg-gradient-hero">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 pt-8 pb-8">
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-colors ${i <= step ? "bg-foreground" : "bg-foreground/15"}`}
            />
          ))}
        </div>

        <div className="mt-8 flex-1">
          {step === 0 && (
            <div className="animate-pop">
              <h1 className="text-3xl font-extrabold">Choose your egg</h1>
              <p className="mt-2 text-foreground/70">Your Hodlchi will hatch from here.</p>
              <div className="mt-8 grid grid-cols-3 gap-3">
                {EGGS.map((e) => {
                  const active = egg === e;
                  const hint = EGG_HINTS[e];
                  return (
                    <button
                      key={e}
                      onClick={() => setEgg(e)}
                      className={`rounded-2xl border-2 bg-white/70 p-3 text-center backdrop-blur transition ${active ? "border-foreground shadow-pop" : "border-transparent"}`}
                    >
                      <div className="mx-auto grid place-items-center">
                        <div className={active ? "animate-heartbeat" : ""}>
                          <EggPreview egg={e} size={72} />
                        </div>
                      </div>
                      <div className="mt-2 text-sm font-semibold capitalize">
                        {hint.emoji} {e}
                      </div>
                      <div className="mt-0.5 text-[11px] leading-tight text-foreground/60">
                        {hint.hint}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="animate-pop">
              <h1 className="text-3xl font-extrabold">What should your Hodlchi call themselves?</h1>
              <p className="mt-2 text-foreground/70">
                Pick anything. You can't change it later — kidding, you can.
              </p>
              <div className="mt-8 grid place-items-center">
                <div className="animate-wiggle">
                  <EggPreview egg={egg} size={140} />
                </div>
              </div>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
                placeholder="e.g. Pip, Sage, Nugget"
                aria-label="Hodlchi name"
                className="mt-8 w-full rounded-2xl border-2 border-foreground/15 bg-white/80 px-5 py-4 text-lg font-semibold outline-none focus:border-foreground"
              />
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-foreground/60">Need inspiration?</span>
                <button
                  type="button"
                  onClick={rollRandomName}
                  className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 bg-white/80 px-3 py-1.5 text-xs font-semibold hover:bg-white"
                >
                  <Dice5 className="h-3.5 w-3.5" /> Random name
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <HatchScene
              egg={egg}
              name={displayName}
              personality={personality}
              phase={hatchPhase}
            />
          )}

          {step === 3 && (
            <div className="animate-pop">
              <h1 className="text-3xl font-extrabold">How does {displayName} learn?</h1>
              <p className="mt-2 text-foreground/70">
                Pick a learning style. You'll unlock the others as you grow.
              </p>
              <div className="mt-6 space-y-3">
                {PERSONALITIES.map((p) => {
                  const meta = getPersonalityMeta(p);
                  const active = personality === p;
                  return (
                    <button
                      key={p}
                      onClick={() => setPersonality(p)}
                      className={`flex w-full items-center gap-4 rounded-2xl border-2 bg-white/70 p-4 text-left backdrop-blur transition ${active ? "scale-[1.02] border-foreground shadow-pop ring-2 ring-primary/60" : "border-transparent"}`}
                    >
                      <div className={active ? "animate-heartbeat" : ""}>
                        <HodlchiAvatar
                          egg={egg}
                          personality={p}
                          stage="Baby Hodlchi"
                          size={72}
                          bob={false}
                        />
                      </div>
                      <div>
                        <div className="font-bold">{meta.name}</div>
                        <div className="text-sm text-foreground/70">
                          {PERSONALITY_HINTS[p]}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          {step > 0 && step !== 2 && (
            <button
              onClick={() => setStep(step - 1)}
              className="rounded-2xl border-2 border-foreground/15 bg-white/70 px-5 py-4 font-semibold"
            >
              Back
            </button>
          )}
          <button
            disabled={!canNext}
            onClick={handleNext}
            className="flex-1 rounded-2xl bg-foreground px-6 py-4 font-bold text-primary shadow-pop transition active:scale-[0.98] disabled:opacity-40"
          >
            {step === 0 && "Continue"}
            {step === 1 && "Hatch!"}
            {step === 2 && (hatchPhase === "revealed" ? `Meet ${displayName} →` : "Hatching…")}
            {step === 3 && "Start my journey"}
          </button>
        </div>
      </div>
    </main>
  );
}

function HatchScene({
  egg,
  name,
  personality,
  phase,
}: {
  egg: EggColor;
  name: string;
  personality: Personality;
  phase: "idle" | "cracking" | "revealed";
}) {
  const confetti = useMemo(
    () =>
      Array.from({ length: 20 }).map((_, i) => ({
        left: Math.round(Math.random() * 100),
        delay: Math.random() * 0.6,
        color: ["#8fe36b", "#ffd166", "#ff8fab", "#7ec8ff", "#c39bff"][i % 5],
        size: 6 + Math.round(Math.random() * 6),
      })),
    [],
  );

  return (
    <div className="relative flex flex-col items-center pt-6">
      {phase === "revealed" && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {confetti.map((c, i) => (
            <span
              key={i}
              className="animate-confetti absolute top-0 block rounded-sm"
              style={{
                left: `${c.left}%`,
                width: c.size,
                height: c.size,
                backgroundColor: c.color,
                animationDelay: `${c.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative grid h-52 w-52 place-items-center">
        {phase !== "revealed" ? (
          <div className="animate-egg-crack">
            <EggPreview egg={egg} size={180} />
          </div>
        ) : (
          <div className="animate-hatch-reveal">
            <HodlchiAvatar
              egg={egg}
              personality={personality}
              stage="Baby Hodlchi"
              size={180}
              bob
            />
          </div>
        )}
      </div>

      <div className="mt-6 min-h-[92px] text-center">
        {phase !== "revealed" ? (
          <>
            <p className="text-lg font-semibold">Something's stirring…</p>
            <p className="mt-1 text-sm text-foreground/60">Hold tight, {name} is on the way.</p>
          </>
        ) : (
          <div className="animate-pop">
            <p className="text-2xl font-extrabold">Hi! I'm {name}. ✨</p>
            <p className="mt-1 text-sm text-foreground/70">Thanks for choosing me.</p>
          </div>
        )}
      </div>
    </div>
  );
}
