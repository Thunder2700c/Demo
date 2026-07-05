interface CircuitBackgroundProps {
  className?: string;
  /** Subtle vertical "rain" streaks toggle. */
  rain?: boolean;
}

/**
 * Pure-CSS atmospheric background: deep void gradient, a drifting mana-circuit
 * grid, radial glows, an animated scanline and film grain. Zero JS, zero
 * network — keeps the landing paint instantly.
 */
export function CircuitBackground({
  className = "",
  rain = true,
}: CircuitBackgroundProps) {
  return (
    <div
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className}`}
      aria-hidden
    >
      {/* base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% -10%, #12121b 0%, #0a0a0c 55%, #060608 100%)",
        }}
      />

      {/* cyan + crimson radial glows */}
      <div
        className="absolute -top-40 left-1/2 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full opacity-40 animate-glow"
        style={{
          background:
            "radial-gradient(circle, rgba(0,243,255,0.18) 0%, rgba(0,243,255,0) 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 h-[55vh] w-[55vh] translate-x-1/4 translate-y-1/4 rounded-full opacity-30 animate-glow-crimson"
        style={{
          background:
            "radial-gradient(circle, rgba(222,33,41,0.16) 0%, rgba(222,33,41,0) 70%)",
        }}
      />

      {/* drifting circuit grid */}
      <div
        className="absolute inset-0 opacity-[0.18] animate-drift"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,243,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,243,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(120% 80% at 50% 30%, black 10%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(120% 80% at 50% 30%, black 10%, transparent 80%)",
        }}
      />

      {/* diagonal mana veins */}
      <svg
        className="absolute inset-0 h-full w-full opacity-20"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <path
          d="M-5 20 L40 45 L35 80 L105 95"
          stroke="#00f3ff"
          strokeWidth="0.2"
          fill="none"
        />
        <path
          d="M105 10 L60 40 L70 75 L-5 90"
          stroke="#de2129"
          strokeWidth="0.15"
          fill="none"
          opacity="0.7"
        />
      </svg>

      {/* rain streaks */}
      {rain && (
        <div className="absolute inset-0 opacity-[0.12]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(100deg, transparent 0 7px, rgba(0,243,255,0.5) 7px 8px)",
              backgroundSize: "100% 3px",
            }}
          />
        </div>
      )}

      {/* scanline */}
      <div className="absolute inset-x-0 top-0 h-24 animate-scan bg-gradient-to-b from-transparent via-circuit/10 to-transparent" />

      {/* film grain */}
      <div className="grain absolute inset-0 opacity-[0.04] mix-blend-overlay" />

      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(130% 120% at 50% 50%, transparent 55%, rgba(0,0,0,0.7) 100%)",
        }}
      />
    </div>
  );
}
