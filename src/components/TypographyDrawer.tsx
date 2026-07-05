"use client";

import type { FontFamily, ReaderMode, ReaderSettings, ReaderWidth } from "@/lib/reading";

interface TypographyDrawerProps {
  open: boolean;
  settings: ReaderSettings;
  onChange: (next: Partial<ReaderSettings>) => void;
  onClose: () => void;
}

export function TypographyDrawer({
  open,
  settings,
  onChange,
  onClose,
}: TypographyDrawerProps) {
  return (
    <>
      {/* backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden
      />
      {/* panel */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-[300px] max-w-[85vw] flex-col border-l border-circuit/25 bg-void-2/95 backdrop-blur-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Reader settings"
      >
        <header className="flex items-center justify-between border-b border-ether/10 px-5 py-4">
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.25em] text-circuit">
            Interface
          </h2>
          <button
            onClick={onClose}
            className="text-ether-dim transition-colors hover:text-crimson"
            aria-label="Close settings"
          >
            <CloseGlyph />
          </button>
        </header>

        <div className="no-scrollbar flex-1 space-y-7 overflow-y-auto px-5 py-6">
          <Section label="Reading Mode">
            <div className="grid grid-cols-2 gap-2">
              <ModeButton
                active={settings.mode === "standard"}
                onClick={() => onChange({ mode: "standard" as ReaderMode })}
                label="Literary"
                hint="Classic prose"
              />
              <ModeButton
                active={settings.mode === "vn"}
                onClick={() => onChange({ mode: "vn" as ReaderMode })}
                label="Visual Novel"
                hint="Typewriter"
              />
            </div>
          </Section>

          <Section label="Text Size">
            <div className="flex items-center gap-3">
              <span className="font-prose text-xs text-ether-dim">A</span>
              <input
                type="range"
                min={14}
                max={24}
                step={1}
                value={settings.fontSize}
                onChange={(e) =>
                  onChange({ fontSize: Number(e.target.value) })
                }
                className="slider-cyan h-1 flex-1 cursor-pointer appearance-none rounded-full bg-ether/20"
                aria-label="Text size"
              />
              <span className="font-prose text-xl text-ether-dim">A</span>
            </div>
            <p className="mt-1 text-right font-ui text-xs text-ether-dim">
              {settings.fontSize}px
            </p>
          </Section>

          <Section label="Font Family">
            <div className="grid grid-cols-2 gap-2">
              <ModeButton
                active={settings.fontFamily === "serif"}
                onClick={() => onChange({ fontFamily: "serif" as FontFamily })}
                label="Serif"
                hint="Lora"
                fontClass="font-prose"
              />
              <ModeButton
                active={settings.fontFamily === "sans"}
                onClick={() => onChange({ fontFamily: "sans" as FontFamily })}
                label="Sans"
                hint="Inter"
                fontClass="font-ui"
              />
            </div>
          </Section>

          <Section label="Layout Width">
            <div className="grid grid-cols-3 gap-2">
              {(["narrow", "normal", "wide"] as ReaderWidth[]).map((w) => (
                <ModeButton
                  key={w}
                  active={settings.width === w}
                  onClick={() => onChange({ width: w })}
                  label={w.charAt(0).toUpperCase() + w.slice(1)}
                />
              ))}
            </div>
          </Section>

          <div className="rounded-md border border-crimson/20 bg-crimson/5 p-3">
            <p className="font-ui text-[0.7rem] leading-relaxed text-ether-dim">
              Preferences &amp; reading progress are stored only in this
              browser&apos;s secure localStorage. No accounts, no cookies, no
              tracking.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2.5 font-ui text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-ether-dim">
        {label}
      </p>
      {children}
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  label,
  hint,
  fontClass = "font-ui",
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  hint?: string;
  fontClass?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md border px-3 py-2.5 text-left transition-all ${
        active
          ? "border-circuit/70 border-glow bg-circuit/10"
          : "border-ether/10 hover:border-circuit/40"
      }`}
    >
      <span
        className={`block text-sm font-semibold ${fontClass} ${
          active ? "text-circuit" : "text-ether"
        }`}
      >
        {label}
      </span>
      {hint && (
        <span className="block font-ui text-[0.65rem] text-ether-dim">
          {hint}
        </span>
      )}
    </button>
  );
}

function CloseGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6 L18 18 M18 6 L6 18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
