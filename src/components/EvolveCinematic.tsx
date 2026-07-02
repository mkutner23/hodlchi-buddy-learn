import { useEffect, useMemo } from "react";
import { HodlchiAvatar } from "@/components/HodlchiAvatar";
import type { EggColor, Personality, Stage } from "@/lib/hodlchi-store";
import type { PathId } from "@/lib/lessons-data";

interface Props {
  name: string;
  egg: EggColor;
  personality: Personality;
  fromStage: Stage;
  toStage: Stage;
  onDone: () => void;
  studiedPaths?: PathId[];
}


// Signature "Evolve" moment (Pokémon-style):
// darken → shaking shell → shell burst → glow halo → avatar reveal with
// particles + confetti → XP stars fly out → name reveal. Auto-dismisses.
const TOTAL_MS = 4200;

export function EvolveCinematic({ name, egg, personality, toStage, onDone }: Props) {
  useEffect(() => {
    const t = setTimeout(onDone, TOTAL_MS);
    return () => clearTimeout(t);
  }, [onDone]);

  const particles = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        left: 50 + (Math.random() * 60 - 30),
        top: 50 + (Math.random() * 60 - 30),
        delay: 0.9 + Math.random() * 0.4,
        hue: [140, 60, 45, 200, 320][i % 5],
        size: 6 + Math.random() * 10,
      })),
    [],
  );

  const confetti = useMemo(
    () =>
      Array.from({ length: 32 }, (_, i) => ({
        left: Math.random() * 100,
        delay: 1.0 + Math.random() * 0.8,
        rot: Math.random() * 360,
        color: ["#22c55e", "#eab308", "#3b82f6", "#a855f7", "#f97316", "#ec4899"][i % 6],
        w: 6 + Math.random() * 6,
        h: 10 + Math.random() * 8,
      })),
    [],
  );

  // XP stars fly outward in 12 directions after the reveal.
  const xpStars = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const angle = (i / 14) * Math.PI * 2;
        const dist = 180 + Math.random() * 80;
        return {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          delay: 2.4 + Math.random() * 0.3,
          emoji: i % 3 === 0 ? "⭐" : i % 3 === 1 ? "✨" : "💫",
        };
      }),
    [],
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden animate-evolve-fade"
      style={{ background: "radial-gradient(circle at center, rgba(15,23,42,0.55), rgba(0,0,0,0.94))" }}
      aria-live="polite"
      role="dialog"
    >
      {/* Subtle screen shake when the shell cracks */}
      <div
        className="pointer-events-none absolute inset-0 animate-screen-shake"
        style={{ animationDelay: "0.9s" }}
        aria-hidden
      />

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
              "radial-gradient(circle, rgba(255,255,200,0.9) 0%, rgba(163,230,53,0.55) 30%, rgba(34,197,94,0) 70%)",
            animationDelay: "0.9s",
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

        {/* Cracking shell — plays first, then bursts */}
        <div
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center animate-evolve-shell"
          style={{ animationDelay: "0.2s" }}
        >
          <span className="text-8xl drop-shadow-2xl">🥚</span>
        </div>

        {/* Avatar reveal (delayed until after shell bursts) */}
        <div
          className="relative z-10 animate-evolve-avatar"
          style={{ animationDelay: "1.4s" }}
        >
          <HodlchiAvatar egg={egg} personality={personality} stage={toStage} size={220} />
        </div>

        {/* Sparkle burst on emergence */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span
            className="text-6xl animate-evolve-burst"
            style={{ animationDelay: "1.4s" }}
          >
            ✨
          </span>
        </div>

        {/* XP stars fly outward from the avatar */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {xpStars.map((s, i) => (
            <span
              key={`xp${i}`}
              className="absolute text-2xl animate-evolve-xp"
              style={
                {
                  ["--xpx" as string]: `${s.x}px`,
                  ["--xpy" as string]: `${s.y}px`,
                  animationDelay: `${s.delay}s`,
                } as React.CSSProperties
              }
            >
              {s.emoji}
            </span>
          ))}
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
