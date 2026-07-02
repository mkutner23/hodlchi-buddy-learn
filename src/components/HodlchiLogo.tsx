interface HodlchiLogoProps {
  size?: number;
  className?: string;
}

/**
 * Hodlchi brand mark.
 * Concept: a friendly egg (the companion) with a growing sprout (learning)
 * and a golden coin belly (money) — education + growth + money in one mark.
 */
export function HodlchiLogo({ size = 72, className }: HodlchiLogoProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Hodlchi logo"
    >
      <defs>
        <linearGradient id="hl-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B7F7C8" />
          <stop offset="100%" stopColor="#5BE38A" />
        </linearGradient>
        <linearGradient id="hl-egg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E8FFF0" />
        </linearGradient>
        <linearGradient id="hl-coin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE38A" />
          <stop offset="100%" stopColor="#F5B93A" />
        </linearGradient>
        <linearGradient id="hl-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3ECD6D" />
          <stop offset="100%" stopColor="#1F8C46" />
        </linearGradient>
      </defs>

      {/* Rounded badge background */}
      <rect x="4" y="4" width="112" height="112" rx="28" fill="url(#hl-bg)" />
      <rect
        x="4"
        y="4"
        width="112"
        height="112"
        rx="28"
        fill="none"
        stroke="#0F2A18"
        strokeOpacity="0.12"
        strokeWidth="2"
      />

      {/* Sprout stem + leaf (learning / growth) */}
      <path
        d="M60 30 C 60 24, 62 20, 68 18"
        stroke="#1F8C46"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M68 18 C 78 14, 86 20, 84 30 C 76 32, 68 28, 68 18 Z"
        fill="url(#hl-leaf)"
      />

      {/* Egg body (companion) */}
      <path
        d="M60 34 C 82 34, 94 56, 94 74 C 94 92, 80 104, 60 104 C 40 104, 26 92, 26 74 C 26 56, 38 34, 60 34 Z"
        fill="url(#hl-egg)"
        stroke="#0F2A18"
        strokeWidth="3"
      />

      {/* Coin belly (money) */}
      <circle cx="60" cy="78" r="16" fill="url(#hl-coin)" stroke="#8A5A0F" strokeWidth="2.5" />
      <text
        x="60"
        y="84"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight="900"
        fontSize="18"
        fill="#6B3F04"
      >
        H
      </text>

      {/* Eyes */}
      <circle cx="49" cy="60" r="3.2" fill="#0F2A18" />
      <circle cx="71" cy="60" r="3.2" fill="#0F2A18" />
      <circle cx="50" cy="59" r="1" fill="#FFFFFF" />
      <circle cx="72" cy="59" r="1" fill="#FFFFFF" />

      {/* Cheek blush */}
      <circle cx="42" cy="68" r="2.4" fill="#FF9BB3" opacity="0.7" />
      <circle cx="78" cy="68" r="2.4" fill="#FF9BB3" opacity="0.7" />
    </svg>
  );
}
