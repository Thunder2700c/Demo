type Variant = "cyan" | "crimson";

interface AvatarEmblemProps {
  speaker: string;
  variant?: Variant;
  className?: string;
}

const COLOR: Record<Variant, string> = {
  cyan: "#00f3ff",
  crimson: "#de2129",
};

/** Pick a glyph pathset based on the Servant class implied by the speaker. */
function glyphFor(speaker: string): "sword" | "spear" | "bow" | "sigil" {
  const s = speaker.toLowerCase();
  if (s.includes("saber") || s.includes("haruto")) return "sword";
  if (s.includes("lancer")) return "spear";
  if (s.includes("archer")) return "bow";
  return "sigil";
}

export function AvatarEmblem({
  speaker,
  variant = "cyan",
  className,
}: AvatarEmblemProps) {
  const color = COLOR[variant];
  const glyph = glyphFor(speaker);
  const id = `av-${speaker.replace(/[^a-z0-9]/gi, "")}-${variant}`;

  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label={`${speaker} emblem`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id={id} cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.04" />
        </radialGradient>
      </defs>

      {/* hex frame */}
      <polygon
        points="32,3 57,17.5 57,46.5 32,61 7,46.5 7,17.5"
        fill={`url(#${id})`}
        stroke={color}
        strokeWidth="1.4"
        opacity="0.9"
      />
      <polygon
        points="32,9 52,20.5 52,43.5 32,55 12,43.5 12,20.5"
        stroke={color}
        strokeWidth="0.7"
        opacity="0.5"
      />

      <g
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="drop-shadow(0 0 3px rgba(0,0,0,0.6))"
      >
        {glyph === "sword" && (
          <>
            <path d="M32 16 L32 42" />
            <path d="M26 22 L32 16 L38 22" />
            <path d="M24 44 L40 44" />
            <circle cx="32" cy="48" r="2.4" fill={color} stroke="none" />
          </>
        )}
        {glyph === "spear" && (
          <>
            <path d="M32 14 L32 46" />
            <path d="M27 20 L32 14 L37 20" />
            <path d="M28 42 L36 42" />
          </>
        )}
        {glyph === "bow" && (
          <>
            <path d="M24 16 Q44 32 24 48" />
            <path d="M24 16 L40 32 L24 48" strokeDasharray="2 3" />
          </>
        )}
        {glyph === "sigil" && (
          <>
            <circle cx="32" cy="32" r="12" />
            <path d="M32 20 L32 44 M20 32 L44 32" />
          </>
        )}
      </g>
    </svg>
  );
}
