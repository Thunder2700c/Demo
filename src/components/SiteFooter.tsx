import { CommandSpell } from "./CommandSpell";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-circuit/10 bg-void-2/50">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6">
        <div className="flex flex-col items-center gap-5 text-center">
          <CommandSpell className="h-10 w-10 opacity-80" readyForDraw={false} />
          <div>
            <p className="font-display text-base font-bold uppercase tracking-[0.2em] text-ether">
              Fate / Stay Last Time <span className="text-circuit">2.0</span>
            </p>
            <p className="mx-auto mt-2 max-w-md font-prose text-sm leading-relaxed text-ether-dim">
              An original fan-work inspired by the urban-fantasy tradition of
              the Holy Grail War. All prose, characters and events herein are
              original to this archive.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-ui text-[0.65rem] uppercase tracking-widest text-ether-dim">
            <span>Zero JavaScript Trackers</span>
            <span className="h-1 w-1 rotate-45 bg-ether-dim/40" />
            <span>Local-Only Progress</span>
            <span className="h-1 w-1 rotate-45 bg-ether-dim/40" />
            <span>Static Delivery</span>
          </div>

          <p className="font-ui text-[0.6rem] uppercase tracking-[0.2em] text-ether-dim/50">
            Project FATE-SLT-2.0 · v1.0.0
          </p>
        </div>
      </div>
    </footer>
  );
}
