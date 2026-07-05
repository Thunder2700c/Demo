import Link from "next/link";
import { CommandSpell } from "./CommandSpell";

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-circuit/10 bg-void/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <CommandSpell
            className="h-7 w-7 transition-transform duration-500 group-hover:rotate-90"
            readyForDraw={false}
            title="Fate / Stay Last Time"
          />
          <span className="font-display text-sm font-bold uppercase tracking-[0.2em] text-ether">
            Fate<span className="text-circuit">/</span>SLT
          </span>
        </Link>

        <nav className="flex items-center gap-1 font-ui text-[0.7rem] uppercase tracking-widest">
          <Link
            href="/"
            className="rounded px-3 py-1.5 text-ether-dim transition-colors hover:text-circuit"
          >
            Home
          </Link>
          <Link
            href="/chapters"
            className="rounded px-3 py-1.5 text-ether-dim transition-colors hover:text-circuit"
          >
            Archive
          </Link>
          <Link
            href="/chapters/vol1-ch1-last-summoning"
            className="rounded border border-circuit/40 px-3 py-1.5 text-circuit transition-colors hover:border-glow hover:bg-circuit/10"
          >
            Read
          </Link>
        </nav>
      </div>
    </header>
  );
}
