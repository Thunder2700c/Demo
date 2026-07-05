"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import type { ImpactEffect, Intensity } from "@/lib/markdown";

interface ImpactTextProps {
  text: string;
  effect?: ImpactEffect;
  intensity?: Intensity;
  className?: string;
}

/**
 * Kinetic dramatic text for incantations / Noble Phantasm releases.
 *  - shake   : oscillates x±5px in a 300ms loop
 *  - shatter : splits into chars, scatters rotation/translate on enter
 *  - glow    : pulsing neon glow reveal
 */
export function ImpactText({
  text,
  effect = "shake",
  intensity = "high",
  className = "",
}: ImpactTextProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const amp = intensity === "high" ? 1 : 0.45;

  useGSAP(
    () => {
      const el = rootRef.current;
      if (!el) return;

      if (effect === "shatter") {
        const chars = el.querySelectorAll<HTMLElement>(".imp-char");
        gsap.set(chars, {
          opacity: 0,
          rotate: () => gsap.utils.random(-35, 35),
          y: () => gsap.utils.random(-40, 40),
          x: () => gsap.utils.random(-25, 25),
        });
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(chars, {
              opacity: 1,
              rotate: 0,
              x: 0,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              stagger: { each: 0.035, from: "center" },
            });
          },
        });
      }

      if (effect === "shake") {
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.92 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );
        gsap.to(el, {
          x: () => gsap.utils.random([-1, 1]) * 5 * amp,
          duration: 0.045,
          repeat: -1,
          yoyo: true,
          ease: "none",
          delay: 0.35,
        });
        gsap.to(el, {
          y: () => gsap.utils.random([-1, 1]) * 3 * amp,
          duration: 0.06,
          repeat: -1,
          yoyo: true,
          ease: "none",
          delay: 0.4,
        });
      }

      if (effect === "glow") {
        gsap.fromTo(
          el,
          { opacity: 0, filter: "blur(8px)" },
          {
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );
        gsap.to(el, {
          textShadow:
            "0 0 18px rgba(0,243,255,0.9), 0 0 48px rgba(0,243,255,0.5)",
          duration: 1.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    },
    { scope: rootRef },
  );

  const fontClass =
    effect === "shatter"
      ? "font-display"
      : "font-display";

  return (
    <div
      ref={rootRef}
      className={`my-10 flex justify-center ${className}`}
      aria-label={text}
    >
      <p
        className={`${fontClass} text-center text-[clamp(1.4rem,4.5vw,2.6rem)] font-bold uppercase tracking-[0.18em] text-circuit text-glow`}
        style={{ opacity: effect === "shake" ? 0 : 1 }}
      >
        {effect === "shatter" ? (
          text.split("").map((ch, i) => (
            <span
              key={i}
              className="imp-char inline-block"
              style={{ whiteSpace: ch === " " ? "pre" : "normal" }}
            >
              {ch}
            </span>
          ))
        ) : (
          <span>{text}</span>
        )}
      </p>
    </div>
  );
}
