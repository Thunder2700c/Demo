"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { AvatarEmblem } from "./AvatarEmblem";
import { Typewriter } from "./Typewriter";
import type { DialogueVariant } from "@/lib/markdown";

interface DialogueBoxProps {
  speaker: string;
  text: string;
  variant?: DialogueVariant;
  /** When true, text is revealed with a typewriter (VN mode). */
  typewriter?: boolean;
  className?: string;
}

export function DialogueBox({
  speaker,
  text,
  variant = "cyan",
  typewriter = false,
  className = "",
}: DialogueBoxProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  const isCrimson = variant === "crimson";
  const accent = isCrimson ? "crimson" : "circuit";

  useGSAP(
    () => {
      const el = rootRef.current;
      if (!el) return;

      // Box rises + border strokes draw on scroll into view
      gsap.fromTo(
        el,
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        },
      );

      const borderPaths = el.querySelectorAll<SVGPathElement>(".db-stroke");
      if (borderPaths.length) {
        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.to(borderPaths, {
              strokeDashoffset: 0,
              duration: 0.9,
              ease: "power2.inOut",
              stagger: 0.12,
            });
          },
        });
      }

      // Avatar glitch reveal
      if (avatarRef.current) {
        const av = avatarRef.current;
        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          once: true,
          onEnter: () => {
            const tl = gsap.timeline();
            tl.fromTo(
              av,
              { opacity: 0, x: -8 },
              { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" },
            ).to(
              av,
              {
                x: 4,
                duration: 0.04,
                repeat: 5,
                yoyo: true,
                ease: "none",
              },
              0,
            );
          },
        });
      }
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      className={`group relative my-7 overflow-hidden rounded-md ${className}`}
      style={{ opacity: typewriter ? 1 : 0 }}
    >
      {/* base panel */}
      <div
        className="relative rounded-md border bg-panel/70 backdrop-blur-md"
        style={{
          borderColor: isCrimson
            ? "rgba(222,33,41,0.35)"
            : "rgba(0,243,255,0.28)",
          boxShadow: isCrimson
            ? "inset 0 0 28px rgba(222,33,41,0.08)"
            : "inset 0 0 28px rgba(0,243,255,0.06)",
        }}
      >
        {/* animated border overlay (drawn on enter) */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
          fill="none"
          aria-hidden
        >
          {isCrimson ? (
            <>
              <path
                className="db-stroke"
                d="M0 12 L0 0 L12 0"
                stroke="#de2129"
                strokeWidth="1.4"
                pathLength={1}
                style={{ strokeDasharray: 1, strokeDashoffset: 1, vectorEffect: "non-scaling-stroke" }}
              />
              <path
                className="db-stroke"
                d="M88 0 L100 0 L100 12"
                stroke="#de2129"
                strokeWidth="1.4"
                pathLength={1}
                style={{ strokeDasharray: 1, strokeDashoffset: 1, vectorEffect: "non-scaling-stroke" }}
              />
              <path
                className="db-stroke"
                d="M100 88 L100 100 L88 100"
                stroke="#de2129"
                strokeWidth="1.4"
                pathLength={1}
                style={{ strokeDasharray: 1, strokeDashoffset: 1, vectorEffect: "non-scaling-stroke" }}
              />
              <path
                className="db-stroke"
                d="M12 100 L0 100 L0 88"
                stroke="#de2129"
                strokeWidth="1.4"
                pathLength={1}
                style={{ strokeDasharray: 1, strokeDashoffset: 1, vectorEffect: "non-scaling-stroke" }}
              />
            </>
          ) : (
            <>
              <path
                className="db-stroke"
                d="M0 12 L0 0 L12 0"
                stroke="#00f3ff"
                strokeWidth="1.4"
                pathLength={1}
                style={{ strokeDasharray: 1, strokeDashoffset: 1, vectorEffect: "non-scaling-stroke" }}
              />
              <path
                className="db-stroke"
                d="M88 0 L100 0 L100 12"
                stroke="#00f3ff"
                strokeWidth="1.4"
                pathLength={1}
                style={{ strokeDasharray: 1, strokeDashoffset: 1, vectorEffect: "non-scaling-stroke" }}
              />
              <path
                className="db-stroke"
                d="M100 88 L100 100 L88 100"
                stroke="#00f3ff"
                strokeWidth="1.4"
                pathLength={1}
                style={{ strokeDasharray: 1, strokeDashoffset: 1, vectorEffect: "non-scaling-stroke" }}
              />
              <path
                className="db-stroke"
                d="M12 100 L0 100 L0 88"
                stroke="#00f3ff"
                strokeWidth="1.4"
                pathLength={1}
                style={{ strokeDasharray: 1, strokeDashoffset: 1, vectorEffect: "non-scaling-stroke" }}
              />
            </>
          )}
        </svg>

        <div className="relative flex items-start gap-4 p-4 sm:gap-5 sm:p-5">
          {/* avatar */}
          <div ref={avatarRef} className="shrink-0 pt-1" style={{ opacity: 0 }}>
            <div className="relative">
              <AvatarEmblem
                speaker={speaker}
                variant={variant}
                className="h-14 w-14 sm:h-16 sm:w-16"
              />
              <span
                className="absolute -bottom-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full blur-[3px]"
                style={{
                  background: isCrimson ? "#de2129" : "#00f3ff",
                  opacity: 0.7,
                }}
              />
            </div>
          </div>

          {/* content */}
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex items-center gap-2">
              <span
                className="font-ui text-[0.7rem] font-semibold uppercase tracking-[0.25em]"
                style={{ color: isCrimson ? "#ff5a60" : "#7fe9f2" }}
              >
                {speaker}
              </span>
              <span
                className={`h-px flex-1 ${isCrimson ? "bg-crimson/40" : "bg-circuit/40"}`}
              />
            </div>
            <p className="font-prose text-[1.05rem] leading-relaxed text-ether sm:text-[1.12rem]">
              {typewriter ? (
                <Typewriter text={text} speed={20} />
              ) : (
                <span>{text}</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
