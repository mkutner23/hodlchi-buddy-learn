import type { Personality, EggColor, Stage } from "@/lib/hodlchi-store";

const PERSONALITY_META: Record<
  Personality,
  { name: string; face: string; body: string; accent: string; belly: string; dark: string }
> = {
  ape: {
    name: "Brave Ape",
    face: "🦍",
    body: "🟫",
    accent: "oklch(0.45 0.06 60)",
    belly: "oklch(0.78 0.05 70)",
    dark: "oklch(0.28 0.04 60)",
  },
  turtle: {
    name: "Chill Turtle",
    face: "🐢",
    body: "🟢",
    accent: "oklch(0.55 0.14 155)",
    belly: "oklch(0.85 0.08 150)",
    dark: "oklch(0.35 0.1 155)",
  },
  fox: {
    name: "Clever Fox",
    face: "🦊",
    body: "🟧",
    accent: "oklch(0.7 0.19 45)",
    belly: "oklch(0.95 0.04 80)",
    dark: "oklch(0.45 0.14 40)",
  },
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

const STAGE_INDEX: Record<Stage, number> = {
  Egg: 0,
  "Baby Hodlchi": 1,
  Learner: 2,
  Builder: 3,
  "Wealth Sage": 4,
  "Money Legend": 5,
};

export function HodlchiAvatar({ egg, personality, stage, size = 160, bob = true }: Props) {
  return (
    <div className={bob ? "animate-float" : ""} style={{ width: size, height: size, position: "relative" }}>
      <svg viewBox="0 0 200 200" width={size} height={size}>
        <defs>
          <radialGradient id={`eggGrad-${egg}-${stage}`} cx="50%" cy="35%" r="70%">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="60%" stopColor={EGG_META[egg].bg} stopOpacity="1" />
            <stop offset="100%" stopColor={EGG_META[egg].ring} stopOpacity="1" />
          </radialGradient>
        </defs>

        {/* shadow */}
        <ellipse cx="100" cy="184" rx="52" ry="6" fill="oklch(0 0 0 / 0.18)" />

        <StageBody egg={egg} personality={personality} stage={stage} />
      </svg>
    </div>
  );
}

function StageBody({
  egg,
  personality,
  stage,
}: {
  egg: EggColor;
  personality: Personality;
  stage: Stage;
}) {
  const idx = STAGE_INDEX[stage];
  const p = PERSONALITY_META[personality];
  const eggFill = `url(#eggGrad-${egg}-${stage})`;

  if (idx === 0) {
    // Egg — smooth, whole
    return (
      <g>
        <ellipse cx="100" cy="108" rx="52" ry="66" fill={eggFill} />
        <ellipse cx="86" cy="88" rx="14" ry="20" fill="white" opacity="0.35" />
      </g>
    );
  }

  if (idx === 1) {
    // Baby — hatching from broken egg shell, tiny creature peeking
    return (
      <g>
        {/* bottom half of shell */}
        <path
          d="M 52 118 Q 55 168 100 172 Q 145 168 148 118 L 138 122 L 128 116 L 118 122 L 108 116 L 98 122 L 88 116 L 78 122 L 68 116 L 58 122 Z"
          fill={EGG_META[egg].bg}
          stroke={EGG_META[egg].ring}
          strokeWidth="2"
        />
        {/* baby head inside */}
        <BabyHead personality={personality} p={p} />
        {/* top shell fragment tilted */}
        <path
          d="M 62 62 L 74 56 L 84 62 L 94 56 L 104 62"
          fill="none"
          stroke={EGG_META[egg].ring}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
    );
  }

  // Idx 2+ : full body, personality-specific
  return <FullCreature personality={personality} p={p} stage={stage} idx={idx} />;
}

function BabyHead({
  personality,
  p,
}: {
  personality: Personality;
  p: (typeof PERSONALITY_META)[Personality];
}) {
  if (personality === "turtle") {
    return (
      <g>
        <ellipse cx="100" cy="108" rx="22" ry="20" fill={p.accent} />
        <circle cx="93" cy="105" r="2.6" fill="#111" />
        <circle cx="107" cy="105" r="2.6" fill="#111" />
        <path d="M 94 114 Q 100 118 106 114" stroke="#111" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </g>
    );
  }
  if (personality === "fox") {
    return (
      <g>
        <ellipse cx="100" cy="108" rx="22" ry="20" fill={p.accent} />
        {/* tiny ears */}
        <path d="M 82 96 L 86 82 L 92 94 Z" fill={p.accent} />
        <path d="M 118 96 L 114 82 L 108 94 Z" fill={p.accent} />
        <circle cx="93" cy="107" r="2.6" fill="#111" />
        <circle cx="107" cy="107" r="2.6" fill="#111" />
        <ellipse cx="100" cy="115" rx="3" ry="2" fill="#111" />
      </g>
    );
  }
  // ape
  return (
    <g>
      <ellipse cx="100" cy="108" rx="24" ry="21" fill={p.accent} />
      <ellipse cx="100" cy="115" rx="14" ry="10" fill={p.belly} />
      <circle cx="93" cy="105" r="2.8" fill="#111" />
      <circle cx="107" cy="105" r="2.8" fill="#111" />
      <path d="M 94 118 Q 100 121 106 118" stroke="#111" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </g>
  );
}

function FullCreature({
  personality,
  p,
  stage,
  idx,
}: {
  personality: Personality;
  p: (typeof PERSONALITY_META)[Personality];
  stage: Stage;
  idx: number;
}) {
  // idx: 2 Learner, 3 Builder, 4 Wealth Sage, 5 Money Legend
  const scale = 1 + (idx - 2) * 0.05;

  return (
    <g transform={`translate(100 110) scale(${scale}) translate(-100 -110)`}>
      {personality === "ape" && <ApeBody p={p} idx={idx} />}
      {personality === "turtle" && <TurtleBody p={p} idx={idx} />}
      {personality === "fox" && <FoxBody p={p} idx={idx} />}
      <StageAccessory idx={idx} />
      {idx === 5 && <LegendAura />}
      {stage === "Money Legend" && null}
    </g>
  );
}

// ------------- APE -------------
function ApeBody({ p, idx }: { p: (typeof PERSONALITY_META)["ape"]; idx: number }) {
  return (
    <g>
      {/* arms */}
      <ellipse cx="58" cy="130" rx="14" ry="24" fill={p.accent} transform="rotate(-15 58 130)" />
      <ellipse cx="142" cy="130" rx="14" ry="24" fill={p.accent} transform="rotate(15 142 130)" />
      {/* body */}
      <ellipse cx="100" cy="135" rx="42" ry="42" fill={p.accent} />
      <ellipse cx="100" cy="140" rx="26" ry="30" fill={p.belly} />
      {/* head */}
      <ellipse cx="100" cy="90" rx="38" ry="34" fill={p.accent} />
      {/* ears */}
      <circle cx="66" cy="88" r="8" fill={p.dark} />
      <circle cx="134" cy="88" r="8" fill={p.dark} />
      {/* face patch */}
      <ellipse cx="100" cy="98" rx="22" ry="20" fill={p.belly} />
      {/* eyes */}
      <circle cx="92" cy="90" r={idx >= 4 ? 3 : 3.2} fill="#111" />
      <circle cx="108" cy="90" r={idx >= 4 ? 3 : 3.2} fill="#111" />
      <circle cx="93" cy="89" r="0.9" fill="#fff" />
      <circle cx="109" cy="89" r="0.9" fill="#fff" />
      {/* nostrils */}
      <ellipse cx="96" cy="102" rx="1.4" ry="1" fill={p.dark} />
      <ellipse cx="104" cy="102" rx="1.4" ry="1" fill={p.dark} />
      {/* smile */}
      <path
        d={`M 92 108 Q 100 ${112 + (idx >= 4 ? 2 : 0)} 108 108`}
        stroke={p.dark}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

// ------------- TURTLE -------------
function TurtleBody({ p, idx }: { p: (typeof PERSONALITY_META)["turtle"]; idx: number }) {
  return (
    <g>
      {/* feet */}
      <ellipse cx="70" cy="168" rx="12" ry="7" fill={p.accent} />
      <ellipse cx="130" cy="168" rx="12" ry="7" fill={p.accent} />
      {/* shell back */}
      <ellipse cx="100" cy="135" rx="52" ry="38" fill={p.dark} />
      {/* shell pattern */}
      <ellipse cx="100" cy="135" rx="44" ry="30" fill={p.accent} />
      <path
        d="M 100 108 L 118 122 L 112 148 L 88 148 L 82 122 Z"
        fill={p.dark}
        opacity="0.35"
      />
      <line x1="100" y1="108" x2="100" y2="148" stroke={p.dark} strokeWidth="1.2" opacity="0.5" />
      <line x1="82" y1="122" x2="118" y2="122" stroke={p.dark} strokeWidth="1.2" opacity="0.5" />
      {/* head */}
      <ellipse cx="100" cy="82" rx="24" ry="22" fill={p.accent} />
      <ellipse cx="100" cy="90" rx="16" ry="10" fill={p.belly} />
      {/* eyes */}
      <circle cx="92" cy="80" r="3" fill="#111" />
      <circle cx="108" cy="80" r="3" fill="#111" />
      <circle cx="93" cy="79" r="0.9" fill="#fff" />
      <circle cx="109" cy="79" r="0.9" fill="#fff" />
      {/* smile */}
      <path
        d={`M 93 90 Q 100 ${94 + (idx >= 4 ? 2 : 0)} 107 90`}
        stroke={p.dark}
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

// ------------- FOX -------------
function FoxBody({ p, idx }: { p: (typeof PERSONALITY_META)["fox"]; idx: number }) {
  return (
    <g>
      {/* tail */}
      <path
        d="M 150 140 Q 176 130 172 108 Q 168 96 156 104 Q 148 118 148 132 Z"
        fill={p.accent}
      />
      <path d="M 168 106 Q 172 116 164 118" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* body */}
      <ellipse cx="100" cy="140" rx="40" ry="34" fill={p.accent} />
      <ellipse cx="100" cy="150" rx="24" ry="20" fill={p.belly} />
      {/* head */}
      <ellipse cx="100" cy="92" rx="36" ry="30" fill={p.accent} />
      {/* ears */}
      <path d="M 74 78 L 68 50 L 88 68 Z" fill={p.accent} />
      <path d="M 78 68 L 74 56 L 86 66 Z" fill={p.dark} />
      <path d="M 126 78 L 132 50 L 112 68 Z" fill={p.accent} />
      <path d="M 122 68 L 126 56 L 114 66 Z" fill={p.dark} />
      {/* face patch */}
      <path d="M 100 78 Q 82 96 92 116 L 108 116 Q 118 96 100 78 Z" fill={p.belly} />
      {/* eyes */}
      <circle cx="88" cy="90" r="3" fill="#111" />
      <circle cx="112" cy="90" r="3" fill="#111" />
      <circle cx="89" cy="89" r="0.9" fill="#fff" />
      <circle cx="113" cy="89" r="0.9" fill="#fff" />
      {/* nose */}
      <ellipse cx="100" cy="106" rx="3.2" ry="2.4" fill="#111" />
      <path
        d={`M 100 108 Q 100 ${114 + (idx >= 4 ? 2 : 0)} 96 116 M 100 108 Q 100 ${114 + (idx >= 4 ? 2 : 0)} 104 116`}
        stroke="#111"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

// ------------- ACCESSORIES per stage -------------
function StageAccessory({ idx }: { idx: number }) {
  if (idx === 3) {
    // Builder — hard-hat / graduation-ish cap
    return (
      <g>
        <rect x="70" y="52" width="60" height="8" rx="2" fill="oklch(0.3 0.05 155)" />
        <path d="M 78 52 Q 100 34 122 52 Z" fill="oklch(0.35 0.05 155)" />
        <circle cx="100" cy="42" r="3" fill="oklch(0.82 0.24 145)" />
      </g>
    );
  }
  if (idx === 4) {
    // Wealth Sage — glasses + subtle crown of coins
    return (
      <g>
        <circle cx="88" cy="90" r="9" fill="none" stroke="oklch(0.25 0.02 155)" strokeWidth="2" />
        <circle cx="112" cy="90" r="9" fill="none" stroke="oklch(0.25 0.02 155)" strokeWidth="2" />
        <line x1="97" y1="90" x2="103" y2="90" stroke="oklch(0.25 0.02 155)" strokeWidth="2" />
        {/* coin trio floating above */}
        <circle cx="82" cy="46" r="6" fill="oklch(0.82 0.18 85)" stroke="oklch(0.55 0.14 70)" strokeWidth="1.5" />
        <circle cx="100" cy="40" r="7" fill="oklch(0.85 0.2 85)" stroke="oklch(0.55 0.14 70)" strokeWidth="1.5" />
        <circle cx="118" cy="46" r="6" fill="oklch(0.82 0.18 85)" stroke="oklch(0.55 0.14 70)" strokeWidth="1.5" />
        <text x="100" y="44" textAnchor="middle" fontSize="9" fontWeight="900" fill="oklch(0.35 0.08 70)">
          $
        </text>
      </g>
    );
  }
  if (idx === 5) {
    // Money Legend — golden crown + halo
    return (
      <g>
        <path
          d="M 66 56 L 76 34 L 88 50 L 100 28 L 112 50 L 124 34 L 134 56 Z"
          fill="oklch(0.85 0.19 85)"
          stroke="oklch(0.5 0.14 70)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <rect x="66" y="54" width="68" height="8" rx="2" fill="oklch(0.78 0.18 80)" stroke="oklch(0.5 0.14 70)" strokeWidth="1.5" />
        <circle cx="76" cy="34" r="3" fill="oklch(0.7 0.2 20)" />
        <circle cx="100" cy="28" r="3.5" fill="oklch(0.55 0.18 250)" />
        <circle cx="124" cy="34" r="3" fill="oklch(0.65 0.2 145)" />
      </g>
    );
  }
  return null;
}

function LegendAura() {
  return (
    <g opacity="0.55">
      <circle cx="100" cy="110" r="86" fill="none" stroke="oklch(0.82 0.24 145)" strokeWidth="1" strokeDasharray="2 4" />
      <circle cx="100" cy="110" r="94" fill="none" stroke="oklch(0.82 0.18 85)" strokeWidth="1" strokeDasharray="1 6" />
    </g>
  );
}

export function EggPreview({ egg, size = 100 }: { egg: EggColor; size?: number }) {
  return <HodlchiAvatar egg={egg} personality="fox" stage="Egg" size={size} bob={false} />;
}
