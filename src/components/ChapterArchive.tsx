"use client";

import { useEffect, useState } from "react";
import { getProgress } from "@/lib/reading";
import type { ChapterSummary } from "@/lib/chapters";

interface ChapterArchiveProps {
  summaries: ChapterSummary[];
}

export function ChapterArchive({ summaries }: ChapterArchiveProps) {
  const [progress, setProgressState] = useState<Record<string, number>>({});

  useEffect(() => {
    const next: Record<string, number> = {};
    for (const c of summaries) next[c.slug] = getProgress(c.slug);
    setProgressState(next);
  }, [summaries]);

  // group by volume
  const volumes = Array.from(new Set(summaries.map((s) => s.volume))).sort();

  return (
    <div className="space-y-12">
      {volumes.map((vol) => {
        const items = summaries.filter((s) => s.volume === vol);
        return (
          <div key={vol}>
            <div className="mb-5 flex items-center gap-3">
              <span className="font-display text-sm font-bold uppercase tracking-[0.3em] text-crimson">
                Volume {vol}
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-crimson/40 to-transparent" />
              <span className="font-ui text-[0.6rem] uppercase tracking-widest text-ether-dim">
                {items.length} chapters
              </span>
            </div>

            <div className="space-y-3">
              {items.map((c) => {
                const pct = progress[c.slug] ?? 0;
                return (
                  <a
                    key={c.slug}
                    href={`/chapters/${c.slug}`}
                    className="group relative flex items-center gap-4 overflow-hidden rounded-md border border-circuit/15 bg-void-2/50 p-4 backdrop-blur-sm transition-all hover:border-circuit/50 hover:bg-void-2/80 sm:p-5"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded border border-circuit/25 font-display text-lg font-bold text-circuit/70">
                      {String(c.chapterNumber).padStart(2, "0")}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3 className="font-display text-base font-bold uppercase tracking-wide text-ether transition-colors group-hover:text-circuit sm:text-lg">
                          {c.title}
                        </h3>
                        <span className="font-ui text-[0.58rem] uppercase tracking-widest text-circuit/60">
                          {c.timeline}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 font-prose text-sm leading-relaxed text-ether-dim">
                        {c.excerpt}
                      </p>
                      <div className="mt-2 flex items-center gap-3 font-ui text-[0.58rem] uppercase tracking-widest text-ether-dim">
                        <span>{c.wordCount.toLocaleString()} words</span>
                        <span className="h-1 w-1 rotate-45 bg-ether-dim/40" />
                        <span>{c.estReadMinutes} min</span>
                        {pct >= 99 && (
                          <span className="rounded-full bg-crimson/20 px-2 py-0.5 text-crimson">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* progress rail */}
                    <div className="hidden w-20 shrink-0 sm:block">
                      <div className="mb-1 text-right font-ui text-[0.55rem] uppercase tracking-widest text-ether-dim">
                        {Math.round(pct)}%
                      </div>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-ether/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-circuit to-crimson"
                          style={{ width: `${Math.max(2, pct)}%` }}
                        />
                      </div>
                    </div>

                    <span className="hidden text-circuit opacity-0 transition-opacity group-hover:opacity-100 sm:block">
                      ▸
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
