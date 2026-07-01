import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { EggPreview, HodlchiAvatar, getPersonalityMeta, EGGS, PERSONALITIES } from "@/components/HodlchiAvatar";
import { useHodlchi, type EggColor, type Personality } from "@/lib/hodlchi-store";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
  head: () => ({
    meta: [
      { title: "Hatch your Hodlchi — Onboarding" },
      {
        name: "description",
        content:
          "Pick an egg, name your companion, and choose a personality. Your Hodlchi hatches in under a minute.",
      },
      { property: "og:title", content: "Hatch your Hodlchi" },
      {
        property: "og:description",
        content: "Choose an egg, a name, and a personality to start your money-learning journey.",
      },
      { property: "og:url", content: "https://demo.hodlchi.com/onboarding" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://demo.hodlchi.com/onboarding" }],
  }),
});

function Onboarding() {
  const nav = useNavigate();
  const { setOnboarding } = useHodlchi();
  const [step, setStep] = useState(0);
  const [egg, setEgg] = useState<EggColor>("mint");
  const [name, setName] = useState("");
  const [personality, setPersonality] = useState<Personality>("fox");

  const canNext =
    (step === 0 && !!egg) || (step === 1 && name.trim().length > 0) || step === 2;

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      setOnboarding({ name: name.trim() || "Hodlchi", egg, personality });
      nav({ to: "/home" });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-hero">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 pt-8 pb-8">
        {/* Progress */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full ${i <= step ? "bg-foreground" : "bg-foreground/15"}`}
            />
          ))}
        </div>

        <div className="mt-8 flex-1">
          {step === 0 && (
            <div className="animate-pop">
              <h1 className="text-3xl font-extrabold">Choose your egg</h1>
              <p className="mt-2 text-foreground/70">Your Hodlchi will hatch from here.</p>
              <div className="mt-8 grid grid-cols-3 gap-3">
                {EGGS.map((e) => (
                  <button
                    key={e}
                    onClick={() => setEgg(e)}
                    className={`rounded-2xl border-2 bg-white/70 p-4 text-center backdrop-blur transition ${egg === e ? "border-foreground shadow-pop" : "border-transparent"}`}
                  >
                    <div className="mx-auto grid place-items-center">
                      <EggPreview egg={e} size={80} />
                    </div>
                    <div className="mt-2 text-sm font-semibold capitalize">{e}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="animate-pop">
              <h1 className="text-3xl font-extrabold">Name your Hodlchi</h1>
              <p className="mt-2 text-foreground/70">Pick anything. You can't change it later — kidding, you can.</p>
              <div className="mt-8 grid place-items-center">
                <EggPreview egg={egg} size={140} />
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
            </div>
          )}

          {step === 2 && (
            <div className="animate-pop">
              <h1 className="text-3xl font-extrabold">Pick a personality</h1>
              <p className="mt-2 text-foreground/70">This is how <b>{name || "your Hodlchi"}</b> shows up in the world.</p>
              <div className="mt-6 space-y-3">
                {PERSONALITIES.map((p) => {
                  const meta = getPersonalityMeta(p);
                  const active = personality === p;
                  return (
                    <button
                      key={p}
                      onClick={() => setPersonality(p)}
                      className={`flex w-full items-center gap-4 rounded-2xl border-2 bg-white/70 p-4 text-left backdrop-blur transition ${active ? "border-foreground shadow-pop" : "border-transparent"}`}
                    >
                      <HodlchiAvatar egg={egg} personality={p} stage="Baby Hodlchi" size={72} bob={false} />
                      <div>
                        <div className="font-bold">{meta.name}</div>
                        <div className="text-sm text-foreground/70">
                          {p === "ape" && "Bold, confident, ready to try."}
                          {p === "turtle" && "Patient, steady, plays the long game."}
                          {p === "fox" && "Curious, quick, loves a clever answer."}
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
          {step > 0 && (
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
            {step < 2 ? "Continue" : "Hatch!"}
          </button>
        </div>
      </div>
    </main>
  );
}
