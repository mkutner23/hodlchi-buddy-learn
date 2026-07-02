interface HodlchiLogoProps {
  size?: number;
  className?: string;
}

/**
 * Hodlchi brand mark — a friendly fox peeking out of a cracked green
 * eggshell with a tiny sprout on top. Companion + growth + learning.
 */
export function HodlchiLogo({ size = 96, className }: HodlchiLogoProps) {
  return (
    <svg
      viewBox="0 0 160 170"
      width={size}
      height={(size * 170) / 160}
      className={className}
      role="img"
      aria-label="Hodlchi logo"
    >
      <defs>
        <linearGradient id="hl-shell" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8FE6A8" />
          <stop offset="100%" stopColor="#4FCB77" />
        </linearGradient>
        <linearGradient id="hl-shell-inner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9F3D6" />
          <stop offset="100%" stopColor="#A6E8BC" />
        </linearGradient>
        <linearGradient id="hl-fox" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFB35A" />
          <stop offset="100%" stopColor="#F08A2C" />
        </linearGradient>
        <linearGradient id="hl-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5FD98A" />
          <stop offset="100%" stopColor="#2E9A54" />
        </linearGradient>
      </defs>

      {/* Sprout stem + leaves */}
      <path
        d="M80 30 C 80 20, 80 12, 80 6"
        stroke="#2E9A54"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M80 14 C 72 8, 62 10, 60 18 C 68 22, 78 20, 80 14 Z"
        fill="url(#hl-leaf)"
      />
      <path
        d="M80 20 C 88 14, 98 16, 100 24 C 92 28, 82 26, 80 20 Z"
        fill="url(#hl-leaf)"
      />

      {/* Fox head */}
      <g>
        {/* Ears */}
        <path d="M40 62 L 46 40 L 58 56 Z" fill="url(#hl-fox)" stroke="#0F2A18" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M120 62 L 114 40 L 102 56 Z" fill="url(#hl-fox)" stroke="#0F2A18" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M44 56 L 48 46 L 54 55 Z" fill="#0F2A18" opacity="0.55" />
        <path d="M116 56 L 112 46 L 106 55 Z" fill="#0F2A18" opacity="0.55" />

        {/* Face */}
        <path
          d="M80 34 C 108 34, 122 52, 122 72 C 122 92, 106 106, 80 106 C 54 106, 38 92, 38 72 C 38 52, 52 34, 80 34 Z"
          fill="url(#hl-fox)"
          stroke="#0F2A18"
          strokeWidth="3"
        />
        {/* Cheeks / muzzle */}
        <path
          d="M56 76 C 60 92, 74 100, 80 100 C 86 100, 100 92, 104 76 C 96 74, 88 74, 80 74 C 72 74, 64 74, 56 76 Z"
          fill="#FFF2DE"
        />
        {/* Eyes */}
        <circle cx="66" cy="70" r="4.5" fill="#0F2A18" />
        <circle cx="94" cy="70" r="4.5" fill="#0F2A18" />
        <circle cx="67.5" cy="68.5" r="1.4" fill="#FFFFFF" />
        <circle cx="95.5" cy="68.5" r="1.4" fill="#FFFFFF" />
        {/* Nose + mouth */}
        <path d="M76 82 L 84 82 L 80 87 Z" fill="#0F2A18" />
        <path d="M80 87 C 78 91, 74 91, 73 89" stroke="#0F2A18" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M80 87 C 82 91, 86 91, 87 89" stroke="#0F2A18" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>

      {/* Cracked eggshell bottom — sits in front of the fox body */}
      <g>
        {/* Back rim of shell (inside) */}
        <path
          d="M28 96 C 40 90, 60 88, 80 88 C 100 88, 120 90, 132 96 C 128 112, 112 124, 80 124 C 48 124, 32 112, 28 96 Z"
          fill="url(#hl-shell-inner)"
        />
        {/* Front shell with jagged crack top edge */}
        <path
          d="M22 104
             L 34 96 L 42 104 L 52 96 L 62 104 L 72 96 L 82 104 L 92 96 L 102 104 L 112 96 L 122 104 L 132 96 L 140 104
             C 138 130, 118 150, 80 150
             C 42 150, 24 130, 22 104 Z"
          fill="url(#hl-shell)"
          stroke="#0F2A18"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Shell highlight */}
        <path
          d="M36 118 C 40 132, 52 142, 66 144"
          stroke="#E9FBEF"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
      </g>
    </svg>
  );
}
