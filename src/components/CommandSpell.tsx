import type { CSSProperties } from "react";

type Variant = "cyan" | "crimson";

interface CommandSpellProps {
  variant?: Variant;
  className?: string;
  /** When true (default) strokes start hidden so a GSAP draw can reveal them. */
  readyForDraw?: boolean;
  title?: string;
}

const COLORS: Record<Variant, { stroke: string; glow: string; fill: string }> = {
  cyan: {
    stroke: "#00f3ff",
    glow: "rgba(0,243,255,0.85)",
    fill: "rgba(0,243,255,0.12)",
  },
  crimson: {
    stroke: "#de2129",
    glow: "rgba(222,33,41,0.9)",
    fill: "rgba(222,33,41,0.14)",
  },
};

/**
 * The signature Command Spell vector. All stroked paths carry pathLength="1"
 * and begin with a full dash-offset so a GSAP stroke-draw reveal can animate
 * them into view. Falls back to fully visible if JS never runs.
 */
export function CommandSpell({
  variant = "cyan",
  className,
  readyForDraw = true,
  title = "Command Spell",
}: CommandSpellProps) {
  const c = COLORS[variant];
  const drawStyle: CSSProperties = readyForDraw
    ? { strokeDasharray: 1, strokeDashoffset: 1 }
    : {};

  const filterId = `cmd-glow-${variant}`;
  const coreId = `cmd-core-${variant}`;

  return (
    <svg
      viewBox="0 0 240 240"
      className={className}
      role="img"
      aria-label={title}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id={filterId} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id={coreId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.stroke} stopOpacity="0.9" />
          <stop offset="55%" stopColor={c.stroke} stopOpacity="0.25" />
          <stop offset="100%" stopColor={c.stroke} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ambient core glow */}
      <circle cx="120" cy="120" r="70" fill={`url(#${coreId})`} opacity="0.6" />

      <g filter={`url(#${filterId})`} stroke={c.stroke}>
        {/* outer rings */}
        <circle
          className="cmd-path"
          style={drawStyle}
          pathLength={1}
          cx="120"
          cy="120"
          r="104"
          strokeWidth="1.4"
          opacity="0.55"
        />
        <circle
          className="cmd-path"
          style={drawStyle}
          pathLength={1}
          cx="120"
          cy="120"
          r="86"
          strokeWidth="2.2"
        />

        {/* tick ring */}
        <g className="cmd-path" style={drawStyle} pathLength={1} strokeWidth="1.6" opacity="0.8">
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i / 24) * Math.PI * 2;
            const r1 = 94;
            const r2 = i % 2 === 0 ? 100 : 97;
            return (
              <line
                key={i}
                x1={120 + Math.cos(a) * r1}
                y1={120 + Math.sin(a) * r1}
                x2={120 + Math.cos(a) * r2}
                y2={120 + Math.sin(a) * r2}
              />
            );
          })}
        </g>

        {/* the three command strokes */}
        <path
          className="cmd-path"
          style={drawStyle}
          pathLength={1}
          d="M120 36 L120 168"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          className="cmd-path"
          style={drawStyle}
          pathLength={1}
          d="M70 64 L150 176"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          className="cmd-path"
          style={drawStyle}
          pathLength={1}
          d="M170 64 L90 176"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* converging mana lines */}
        <g className="cmd-path" style={drawStyle} pathLength={1} strokeWidth="1.2" opacity="0.7">
          <path d="M120 120 L120 30" />
          <path d="M120 120 L48 70" />
          <path d="M120 120 L192 70" />
        </g>

        {/* central diamond core */}
        <g className="cmd-path" style={drawStyle} pathLength={1} strokeWidth="2.4" fill={c.fill}>
          <path d="M120 104 L138 120 L120 136 L102 120 Z" />
        </g>
        <circle className="cmd-path" style={drawStyle} pathLength={1} cx="120" cy="120" r="4" fill={c.stroke} />
      </g>

      {/* corner brackets */}
      <g stroke={c.stroke} strokeWidth="1.6" opacity="0.6">
        <path className="cmd-path" style={drawStyle} pathLength={1} d="M20 40 L20 20 L40 20" />
        <path className="cmd-path" style={drawStyle} pathLength={1} d="M220 40 L220 20 L200 20" />
        <path className="cmd-path" style={drawStyle} pathLength={1} d="M20 200 L20 220 L40 220" />
        <path className="cmd-path" style={drawStyle} pathLength={1} d="M220 200 L220 220 L200 220" />
      </g>
    </svg>
  );
}
