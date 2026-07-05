"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface StatsPanelProps {
  totalChapters: number;
  totalWords: number;
  totalReadMinutes: number;
  latestTimeline: string;
  volumes: number;
}

interface Stat {
  label: string;
  value: number;
  suffix?: string;
  display: string;
}

export function StatsPanel({
  totalChapters,
  totalWords,
  totalReadMinutes,
  latestTimeline,
  volumes,
}: StatsPanelProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [counts, setCounts] = useState({
    chapters: 0,
    words: 0,
    minutes: 0,
    volumes: 0,
  });

  const stats: Stat[] = [
    {
      label: "Active Chapters",
      value: totalChapters,
      display: counts.chapters.toLocaleString(),
    },
    {
      label: "Total Words",
      value: totalWords,
      display: counts.words.toLocaleString(),
    },
    {
      label: "Read Time",
      value: totalReadMinutes,
      suffix: " min",
      display: `${counts.minutes.toLocaleString()} min`,
    },
    {
      label: "Volumes",
      value: volumes,
      display: String(counts.volumes),
    },
  ];

  useGSAP(
    () => {
      const obj = { chapters: 0, words: 0, minutes: 0, volumes: 0 };
      const sync = () =>
        setCounts({
          chapters: Math.round(obj.chapters),
          words: Math.round(obj.words),
          minutes: Math.round(obj.minutes),
          volumes: Math.round(obj.volumes),
        });
      gsap.to(obj, {
        chapters: totalChapters,
        volumes: volumes,
        words: totalWords,
        minutes: totalReadMinutes,
        duration: 1.8,
        ease: "power2.out",
        onUpdate: sync,
        scrollTrigger: { trigger: rootRef.current, start: "top 82%", once: true },
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="relative overflow-hidden rounded-md border border-circuit/20 bg-void-2/60 p-4 text-center backdrop-blur-sm transition-colors hover:border-circuit/50"
          >
            <div
              className="font-display text-2xl font-bold tabular-nums text-circuit text-glow sm:text-3xl"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {s.display}
            </div>
            <div className="mt-1.5 font-ui text-[0.6rem] uppercase tracking-[0.2em] text-ether-dim">
              {s.label}
            </div>
            <span className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-circuit/40 to-transparent" />
          </div>
        ))}
      </div>

      {/* Timeline status line */}
      <div className="mt-5 flex items-center justify-center gap-3 rounded-md border border-crimson/20 bg-crimson/5 px-5 py-3">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-crimson/60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-crimson" />
        </span>
        <span className="font-ui text-[0.7rem] uppercase tracking-[0.2em] text-ether-dim">
          Timeline Status
        </span>
        <span className="font-display text-sm font-semibold uppercase tracking-wide text-crimson text-glow-crimson">
          {latestTimeline}
        </span>
      </div>
    </div>
  );
}
