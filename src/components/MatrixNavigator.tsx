"use client";

import { useEffect, useState } from "react";
import { getProgress } from "@/lib/reading";
import type { ChapterSummary } from "@/lib/chapters";

interface MatrixNavigatorProps {
  chapters: ChapterSummary[];
}

export function MatrixNavigator({ chapters }: MatrixNavigatorProps) {
  const [progress, setProgressState] = useState<Record<string, number>>({});

  useEffect(() => {
    const next: Record<string, number> = {};
    for (const c of chapters) next[c.slug] = getProgress(c.slug);
    setProgressState(next);
  }, [chapters]);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {chapters.map((c, i) => {
        const pct = progress[c.slug] ?? 0;
        return (
          <a
            key={c.slug}
            href={`/chapters/${c.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-md border border-circuit/20 bg-void-2/60 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-circuit/60 hover:border-glow"
          >
            {/* index watermark */}
            <span className="pointer-events-none absolute -right-2 -top-4 font-display text-7xl font-bold text-circuit/5">
              {String(c.chapterNumber).padStart(2, "0")}
            </span>

            <div className="mb-3 flex items-center justify-between">
              <span className="font-ui text-[0.6rem] uppercase tracking-[0.3em] text-circuit/70">
                {c.timeline}
              </span>
              <span className="font-ui text-[0.6rem] uppercase tracking-widest text-ether-dim">
                #{String(i + 1).padStart(2, "0")}
              </span>
            </div>

            <h3 className="font-display text-lg font-bold uppercase leading-tight tracking-wide text-ether transition-colors group-hover:text-circuit">
              {c.title}
            </h3>

            <p className="mt-2 line-clamp-3 flex-1 font-prose text-sm leading-relaxed text-ether-dim">
              {c.excerpt}
            </p>

            <div className="mt-4 flex items-center gap-2 font-ui text-[0.6rem] uppercase tracking-widest text-ether-dim">
              <span>{c.wordCount.toLocaleString()} words</span>
              <span className="h-1 w-1 rotate-45 bg-ether-dim/40" />
              <span>{c.estReadMinutes} min</span>
            </div>

            {/* reading progress */}
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between font-ui text-[0.55rem] uppercase tracking-widest">
                <span className={pct > 0 ? "text-circuit" : "text-ether-dim/50"}>
                  {pct >= 99 ? "Completed" : pct > 0 ? "Reading" : "Unread"}
                </span>
                <span className="text-ether-dim">
                  {Math.round(pct)}%
                </span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-ether/10">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    pct >= 99
                      ? "bg-crimson"
                      : "bg-gradient-to-r from-circuit to-circuit/60"
                  }`}
                  style={{
                    width: `${Math.max(2, pct)}%`,
                    boxShadow:
                      pct > 0 ? "0 0 8px rgba(0,243,255,0.5)" : "none",
                  }}
                />
              </div>
            </div>

            <span className="mt-4 inline-flex items-center gap-1 font-ui text-[0.65rem] font-semibold uppercase tracking-widest text-circuit opacity-0 transition-opacity group-hover:opacity-100">
              Enter ▸
            </span>
          </a>
        );
      })}
    </div>
  );
}
