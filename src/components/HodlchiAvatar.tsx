import type { Personality, EggColor, Stage } from "@/lib/hodlchi-store";

const PERSONALITY_META: Record<Personality, { name: string; face: string; body: string; accent: string }> = {
  ape: { name: "Brave Ape", face: "🦍", body: "🟫", accent: "oklch(0.55 0.14 60)" },
  turtle: { name: "Chill Turtle", face: "🐢", body: "🟢", accent: "oklch(0.65 0.15 155)" },
  fox: { name: "Clever Fox", face: "🦊", body: "🟧", accent: "oklch(0.7 0.19 45)" },
};

const EGG_META: Record<EggColor, { name: string; bg: string; ring: string }> = {
  mint: { name: "Mint", bg: "oklch(0.9 0.14 150)", ring: "oklch(0.6 0.18 150)" },
  sun: { name: "Sun", bg: "oklch(0.9 0.16 85)", ring: "oklch(0.62 0.18 65)" },
  berry: { name: "Berry", bg: "oklch(0.85 0.15 350)", ring: "oklch(0.6 0.2 355)" },
};

export function getPersonalityMeta(p: Personality) {
  return PERSONALITY_META[p];
}
export function getEggMeta(e: EggColor) {
  return EGG_META[e];
}
export const PERSONALITIES = Object.keys(PERSONALITY_META) as Personality[];
export const EGGS = Object.keys(EGG_META) as EggColor[];

interface Props {
  egg: EggColor;
  personality: Personality;
  stage: Stage;
  size?: number;
  bob?: boolean;
}

export function HodlchiAvatar({ egg, personality, stage, size = 160, bob = true }: Props) {
  const p = PERSONALITY_META[personality];
  const e = EGG_META[egg];

  const isEgg = stage === "Egg";
  const isBaby = stage === "Baby Hodlchi";

  // Scale features based on stage
  const stageScale =
    ({ Egg: 0.9, "Baby Hodlchi": 1, Learner: 1.05, Builder: 1.1, "Wealth Sage": 1.15 } as Record<Stage, number>)[stage] ?? 1;

  return (
    <div
      className={bob ? "animate-float" : ""}
      style={{ width: size, height: size, position: "relative" }}
    >
      <svg viewBox="0 0 200 200" width={size} height={size}>
        <defs>
          <radialGradient id={`eggGrad-${egg}`} cx="50%" cy="35%" r="70%">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="60%" stopColor={e.bg} stopOpacity="1" />
            <stop offset="100%" stopColor={e.ring} stopOpacity="1" />
          </radialGradient>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>

        {/* shadow */}
        <ellipse cx="100" cy="180" rx={55 * stageScale} ry="7" fill="oklch(0 0 0 / 0.18)" />

        {/* body */}
        {isEgg ? (
          <ellipse cx="100" cy="105" rx={55 * stageScale} ry={70 * stageScale} fill={`url(#eggGrad-${egg})`} />
        ) : (
          <g>
            {/* body blob */}
            <ellipse
              cx="100"
              cy="115"
              rx={58 * stageScale}
              ry={62 * stageScale}
              fill={`url(#eggGrad-${egg})`}
            />
            {/* character accent */}
            <ellipse
              cx="100"
              cy="115"
              rx={40 * stageScale}
              ry={44 * stageScale}
              fill={p.accent}
              opacity={0.85}
            />
            {/* face */}
            <circle cx="100" cy="105" r={28 * stageScale} fill="oklch(0.98 0.02 90)" />
            {/* eyes */}
            <circle cx={90} cy={100} r={isBaby ? 4 : 3.5} fill="oklch(0.15 0.03 155)" />
            <circle cx={110} cy={100} r={isBaby ? 4 : 3.5} fill="oklch(0.15 0.03 155)" />
            <circle cx={91} cy={99} r={1.2} fill="white" />
            <circle cx={111} cy={99} r={1.2} fill="white" />
            {/* smile */}
            <path
              d={`M ${92} ${112} Q 100 ${118 + (stage === "Wealth Sage" ? 2 : 0)} ${108} 112`}
              stroke="oklch(0.2 0.04 155)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            {/* stage decoration */}
            {stage === "Wealth Sage" && (
              <g>
                <path
                  d="M 70 78 Q 100 55 130 78"
                  stroke="oklch(0.75 0.16 85)"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="63" r="5" fill="oklch(0.85 0.18 85)" />
              </g>
            )}
            {stage === "Builder" && (
              <rect
                x="82"
                y="72"
                width="36"
                height="10"
                rx="4"
                fill="oklch(0.4 0.08 155)"
              />
            )}
          </g>
        )}

        {/* egg cracks for higher levels of egg */}
        {isEgg && (
          <path
            d="M 80 90 L 90 95 L 85 105 L 100 110"
            stroke="oklch(0.35 0.04 155)"
            strokeWidth="1.5"
            fill="none"
            opacity="0.5"
          />
        )}

        {/* personality mini badge */}
        {!isEgg && (
          <g>
            <circle cx="150" cy="60" r="16" fill="white" stroke={p.accent} strokeWidth="2" />
            <text x="150" y="66" textAnchor="middle" fontSize="16">
              {p.face}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

export function EggPreview({ egg, size = 100 }: { egg: EggColor; size?: number }) {
  return <HodlchiAvatar egg={egg} personality="fox" stage="Egg" size={size} bob={false} />;
}
