import { useEffect, useRef, useState } from "react";
import { HodlchiAvatar } from "@/components/HodlchiAvatar";

type Scene = {
  key: string;
  emoji: string;
  label: string;
  caption: string;
  duration: number; // ms
};

const SCENES: Scene[] = [
  { key: "hatch", emoji: "🥚", label: "Step 1", caption: "Hatch your egg", duration: 5000 },
  { key: "name", emoji: "🦊", label: "Step 2", caption: "Name your companion", duration: 5000 },
  { key: "lesson", emoji: "📚", label: "Step 3", caption: "Finish a 5-minute lesson", duration: 7000 },
  { key: "xp", emoji: "✨", label: "Step 4", caption: "Earn XP — they smile", duration: 5000 },
  { key: "evolve", emoji: "🌱", label: "Step 5", caption: "Evolve to the next stage", duration: 6000 },
];

const TOTAL = SCENES.reduce((a, s) => a + s.duration, 0);

export function ProductWalkthrough() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0); // ms accumulated across scenes
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);

  useEffect(() => {
    function tick(ts: number) {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = ts - lastTsRef.current;
      lastTsRef.current = ts;
      if (!paused) {
        setElapsed((e) => {
          const next = (e + dt) % TOTAL;
          let acc = 0;
          for (let i = 0; i < SCENES.length; i++) {
            acc += SCENES[i].duration;
            if (next < acc) {
              setIdx((cur) => (cur === i ? cur : i));
              break;
            }
          }
          return next;
        });
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [paused]);

  const scene = SCENES[idx];
  const progress = Math.min(100, (elapsed / TOTAL) * 100);

  const jumpTo = (i: number) => {
    let acc = 0;
    for (let j = 0; j < i; j++) acc += SCENES[j].duration;
    setElapsed(acc);
    setIdx(i);
  };

  return (
    <div className="relative mx-auto max-w-[380px]">
      {/* Soft ambient glow behind the phone */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 blur-3xl"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 40%, rgba(80,220,140,0.35), transparent 70%)",
        }}
        aria-hidden
      />

      {/* Phone device frame */}
      <div
        className="relative animate-tour-float select-none rounded-[44px] bg-foreground p-3 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.45),0_10px_25px_-10px_rgba(0,0,0,0.3)]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        aria-label="Hodlchi product walkthrough"
      >
        {/* Notch */}
        <div className="pointer-events-none absolute left-1/2 top-3 z-20 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-foreground" />

        {/* Screen */}
        <div className="relative overflow-hidden rounded-[32px] bg-white">
          {/* Status bar */}
          <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[10px] font-bold text-foreground/70">
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <span>●●●●</span>
              <span>▲</span>
              <span className="rounded-sm border border-foreground/40 px-1">100</span>
            </span>
          </div>

          {/* Stage */}
          <div className="relative h-[380px] bg-gradient-hero">
            {/* Subtle top highlight sweep */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-60"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.6), transparent)",
              }}
              aria-hidden
            />

            {SCENES.map((s, i) => (
              <div
                key={s.key}
                className={`absolute inset-0 grid place-items-center px-6 transition-opacity duration-500 ${
                  i === idx ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                {i === idx && <SceneView sceneKey={s.key} />}
              </div>
            ))}

            {/* Caption */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-foreground/85 via-foreground/40 to-transparent p-4 text-white">
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                {scene.label}
              </div>
              <div className="text-lg font-extrabold leading-tight">
                <span className="mr-1.5">{scene.emoji}</span>
                {scene.caption}
              </div>
            </div>
          </div>

          {/* Progress + dots */}
          <div className="bg-white px-5 py-4">
            <div className="h-1 w-full overflow-hidden rounded-full bg-foreground/10">
              <div
                className="h-full rounded-full bg-primary-deep transition-[width] duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2.5 flex items-center justify-between">
              <div className="flex gap-3">
                {SCENES.map((s, i) => (
                  <button
                    key={s.key}
                    onClick={() => jumpTo(i)}
                    className={`text-base leading-none transition ${
                      i === idx ? "scale-110 opacity-100" : "opacity-40 hover:opacity-80"
                    }`}
                    aria-label={`Jump to ${s.caption}`}
                  >
                    {s.emoji}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPaused((p) => !p)}
                className="text-[11px] font-semibold text-foreground/60 hover:text-foreground"
                aria-label={paused ? "Play walkthrough" : "Pause walkthrough"}
              >
                {paused ? "▶" : "❚❚"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


function SceneView({ sceneKey }: { sceneKey: string }) {
  switch (sceneKey) {
    case "hatch":
      return <HatchScene />;
    case "name":
      return <NameScene />;
    case "lesson":
      return <LessonScene />;
    case "xp":
      return <XpScene />;
    case "evolve":
      return <EvolveScene />;
    default:
      return null;
  }
}

function HatchScene() {
  const [stage, setStage] = useState<"Egg" | "Baby">("Egg");
  const [shake, setShake] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setShake(true), 400);
    const t2 = setTimeout(() => setShake(false), 2600);
    const t3 = setTimeout(() => setStage("Baby"), 2700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);
  return (
    <div className="flex flex-col items-center gap-3">
      <div className={shake ? "animate-wobble" : "animate-float"}>
        <HodlchiAvatar egg="mint" personality="fox" stage={stage} size={170} />
      </div>
      <div className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground/70 shadow-soft">
        {stage === "Egg" ? "Tap to hatch…" : "It hatched! 🎉"}
      </div>
    </div>
  );
}

function NameScene() {
  const target = "Foxy";
  const [typed, setTyped] = useState("");
  useEffect(() => {
    setTyped("");
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setTyped(target.slice(0, i));
      if (i >= target.length) clearInterval(iv);
    }, 260);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-4">
      <div className="animate-float">
        <HodlchiAvatar egg="mint" personality="fox" stage="Baby" size={130} />
      </div>
      <div className="w-full">
        <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">
          Name your companion
        </div>
        <div className="mt-1 flex h-11 items-center rounded-xl border-2 border-primary-deep bg-white px-3 text-base font-bold">
          {typed}
          <span className="ml-0.5 inline-block h-5 w-[2px] animate-pulse bg-foreground" />
        </div>
      </div>
    </div>
  );
}

function LessonScene() {
  const questions = [
    { q: "What is a budget?", opts: ["A savings app", "A money plan", "A type of bank"], correct: 1 },
    { q: "Best way to build savings?", opts: ["Automate deposits", "Wait until year-end", "Buy crypto"], correct: 0 },
  ];
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  useEffect(() => {
    setPicked(null);
    const t1 = setTimeout(() => setPicked(questions[step].correct), 1800);
    const t2 = setTimeout(() => setStep((s) => (s + 1) % questions.length), 3400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);
  const cur = questions[step];
  return (
    <div className="w-full max-w-xs">
      <div className="rounded-2xl bg-white p-4 shadow-soft">
        <div className="text-[10px] font-bold uppercase tracking-widest text-primary-deep">
          Saving · Lesson 1
        </div>
        <div className="mt-1 text-sm font-bold">{cur.q}</div>
        <div className="mt-3 grid gap-2">
          {cur.opts.map((o, i) => {
            const isPicked = picked === i;
            const isCorrect = i === cur.correct;
            const state =
              picked == null
                ? "border-foreground/15 bg-white"
                : isPicked && isCorrect
                  ? "border-primary-deep bg-primary/30"
                  : isCorrect
                    ? "border-primary-deep/50 bg-primary/10"
                    : "border-foreground/10 bg-white opacity-60";
            return (
              <div
                key={i}
                className={`flex items-center justify-between rounded-xl border-2 px-3 py-2 text-xs font-semibold transition ${state}`}
              >
                <span>{o}</span>
                {picked != null && isCorrect && <span>✓</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function XpScene() {
  const [xp, setXp] = useState(40);
  const [pop, setPop] = useState(false);
  useEffect(() => {
    setXp(40);
    setPop(false);
    const t1 = setTimeout(() => {
      setPop(true);
      setXp(90);
    }, 500);
    const t2 = setTimeout(() => setPop(false), 1400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);
  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-4">
      <div className="relative">
        <div className={pop ? "animate-wobble" : "animate-float"}>
          <HodlchiAvatar egg="mint" personality="fox" stage="Baby" size={140} />
        </div>
        {pop && (
          <div className="absolute -right-2 -top-2 rounded-full bg-primary-deep px-2.5 py-1 text-xs font-extrabold text-white shadow-pop">
            +50 XP
          </div>
        )}
      </div>
      <div className="w-full">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-foreground/60">
          <span>Level 1</span>
          <span>{xp} / 100 XP</span>
        </div>
        <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-foreground/10">
          <div
            className="h-full rounded-full bg-primary-deep transition-[width] duration-[900ms] ease-out"
            style={{ width: `${xp}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function EvolveScene() {
  const [stage, setStage] = useState<"Baby" | "Student">("Baby");
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    setStage("Baby");
    setFlash(false);
    const t1 = setTimeout(() => setFlash(true), 900);
    const t2 = setTimeout(() => setStage("Student"), 1500);
    const t3 = setTimeout(() => setFlash(false), 2300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {flash && (
          <div className="absolute inset-0 -m-6 animate-ping rounded-full bg-primary/40" />
        )}
        <div className="relative animate-float">
          <HodlchiAvatar egg="mint" personality="fox" stage={stage} size={170} />
        </div>
      </div>
      <div className="rounded-full bg-foreground px-3 py-1 text-xs font-bold text-primary shadow-pop">
        Evolved → {stage === "Student" ? "Student" : "…"}
      </div>
    </div>
  );
}
