"use client";

import { gsap, useGSAP } from "@/lib/gsap";
import { CommandSpell } from "./CommandSpell";

function SplitChars({ text }: { text: string }) {
  return (
    <span aria-label={text}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className="hero-char inline-block"
          style={{ willChange: "transform, opacity" }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}

export function HeroSequence() {
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Command Spell stroke-draw
    tl.to(".cmd-path", {
      strokeDashoffset: 0,
      duration: 1.7,
      stagger: 0.04,
    })
      // title characters rise + fade in
      .fromTo(
        ".hero-char",
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.025 },
        "-=1.1",
      )
      .fromTo(
        ".hero-sub",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.35",
      )
      .fromTo(
        ".hero-cta",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
        "-=0.4",
      )
      .fromTo(
        ".hero-scroll",
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        "-=0.2",
      );
  });

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-5 pb-20 pt-24 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 -z-10 animate-glow rounded-full bg-circuit/10 blur-3xl" />
        <CommandSpell className="h-44 w-44 sm:h-56 sm:w-56" variant="cyan" />
      </div>

      <p className="hero-sub mb-3 font-ui text-[0.65rem] uppercase tracking-[0.5em] text-circuit/80 sm:text-xs">
        The Seventh Holy Grail War
      </p>

      <h1 className="font-display text-[clamp(2rem,8vw,5rem)] font-bold uppercase leading-[1.05] tracking-wide text-white">
        <span className="block text-glow">
          <SplitChars text="FATE" />
        </span>
        <span className="my-1 block text-[0.5em] tracking-[0.4em] text-crimson text-glow-crimson">
          / STAY LAST TIME /
        </span>
        <span className="block text-ether">
          <SplitChars text="2.0" />
        </span>
      </h1>

      <p className="hero-sub mx-auto mt-7 max-w-xl font-prose text-base leading-relaxed text-ether-dim sm:text-lg">
        Rain falls over Fuyuki for the seventh and final time. A boy bleeds onto
        a chalk circle, the Grail chooses to listen, and the loop that has
        turned for centuries finally begins to break.
      </p>

      <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
        <a
          href="/chapters/vol1-ch1-last-summoning"
          className="hero-cta group relative overflow-hidden rounded-md border border-circuit/60 bg-circuit/10 px-7 py-3 font-ui text-sm font-semibold uppercase tracking-widest text-circuit transition-all hover:border-glow hover:text-white"
        >
          <span className="relative z-10">Begin the Summoning</span>
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-circuit/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </a>
        <a
          href="/chapters"
          className="hero-cta rounded-md border border-ether/15 px-7 py-3 font-ui text-sm font-semibold uppercase tracking-widest text-ether-dim transition-colors hover:border-crimson/50 hover:text-crimson"
        >
          Chapter Archive
        </a>
      </div>

      <div className="hero-scroll absolute bottom-6 flex flex-col items-center gap-2">
        <span className="font-ui text-[0.6rem] uppercase tracking-[0.3em] text-ether-dim/60">
          Scroll
        </span>
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-ether/20 p-1">
          <span className="h-2 w-1 animate-bounce rounded-full bg-circuit" />
        </span>
      </div>
    </section>
  );
}
