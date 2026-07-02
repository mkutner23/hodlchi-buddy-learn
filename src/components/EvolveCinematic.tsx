import { useEffect, useMemo } from "react";
import { HodlchiAvatar } from "@/components/HodlchiAvatar";
import type { EggColor, Personality, Stage } from "@/lib/hodlchi-store";

interface Props {
  name: string;
  egg: EggColor;
  personality: Personality;
  fromStage: Stage;
  toStage: Stage;
  onDone: () => void;
}

// Signature "Evolve" moment: darken → glow → shell burst → confetti reveal.
// Duration ~3.2s, then auto-dismisses.
export function EvolveCinematic({ name, egg, personality, toStage, onDone }: Props) {
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);

  const particles = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        left: 50 + (Math.random() * 60 - 30),
        top: 50 + (Math.random() * 60 - 30),
        delay: Math.random() * 0.4,
        hue: [140, 60, 45, 200, 320][i % 5],
        size: 6 + Math.random() * 10,
      })),
    [],
  );

  const confetti = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        rot: Math.random() * 360,
        color: ["#22c55e", "#eab308", "#3b82f6", "#a855f7", "#f97316", "#ec4899"][i % 6],
        w: 6 + Math.random() * 6,
        h: 10 + Math.random() * 8,
      })),
    [],
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden animate-evolve-fade"
      style={{ background: "radial-gradient(circle at center, rgba(15,23,42,0.55), rgba(0,0,0,0.92))" }}
      aria-live="polite"
      role="dialog"
    >
      {/* Confetti */}
      {confetti.map((c, i) => (
        <span
          key={`c${i}`}
          className="pointer-events-none absolute top-0 animate-evolve-confetti"
          style={{
            left: `${c.left}%`,
            width: c.w,
            height: c.h,
            background: c.color,
            transform: `rotate(${c.rot}deg)`,
            animationDelay: `${c.delay}s`,
            borderRadius: 2,
          }}
        />
      ))}

      {/* Particles around avatar */}
      <div className="relative">
        <div
          className="absolute inset-0 -m-16 rounded-full animate-evolve-glow"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,200,0.85) 0%, rgba(163,230,53,0.5) 30%, rgba(34,197,94,0) 70%)",
          }}
        />
        {particles.map((p, i) => (
          <span
            key={`p${i}`}
            className="pointer-events-none absolute rounded-full animate-evolve-particle"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              background: `hsl(${p.hue} 90% 65%)`,
              boxShadow: `0 0 12px hsl(${p.hue} 95% 70%)`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}

        <div className="relative z-10 animate-evolve-avatar">
          <HodlchiAvatar egg={egg} personality={personality} stage={toStage} size={220} />
        </div>

        {/* Shell burst */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="text-6xl animate-evolve-burst">✨</span>
        </div>
      </div>

      {/* Text reveal */}
      <div className="absolute bottom-24 left-0 right-0 text-center animate-evolve-text">
        <div className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-200/90">
          Evolution complete
        </div>
        <div className="mt-2 font-display text-4xl font-extrabold text-white drop-shadow-lg">
          {name} is now a<br />
          <span className="bg-gradient-to-r from-yellow-200 via-lime-200 to-emerald-300 bg-clip-text text-transparent">
            {toStage}!
          </span>
        </div>
      </div>
    </div>
  );
}
