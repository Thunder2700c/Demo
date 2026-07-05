"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  buildIndex,
  runSearch,
  highlight,
  type BuiltIndex,
  type ChapterIndex,
  type SearchHit,
} from "@/lib/search";

const IDLE = (cb: () => void): void => {
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    window.requestIdleCallback(() => cb());
  } else {
    setTimeout(cb, 220);
  }
};

export function SearchHub({ compact = false }: { compact?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [built, setBuilt] = useState<BuiltIndex | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Build the FlexSearch index off the critical path, once.
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const res = await fetch("/api/search-index");
        const data: ChapterIndex[] = await res.json();
        if (cancelled) return;
        IDLE(() => {
          if (cancelled) return;
          setBuilt(buildIndex(data));
        });
      } catch {
        /* network failed — search just stays disabled */
      }
    };
    IDLE(run);
    return () => {
      cancelled = true;
    };
  }, []);

  const results = useMemo<SearchHit[]>(() => {
    if (!built || query.trim().length < 2) return [];
    return runSearch(query, built, 8);
  }, [query, built]);

  // Track loading state for the brief moment before the index resolves a query.
  useEffect(() => {
    if (query.trim().length >= 2 && built) {
      setLoading(true);
      const t = setTimeout(() => setLoading(false), 60);
      return () => clearTimeout(t);
    }
    setLoading(false);
  }, [query, built]);

  useEffect(() => setActiveIndex(0), [query]);

  const onKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open || results.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        const hit = results[activeIndex];
        if (hit) {
          const hash = hit.paraIdx >= 0 ? `#p-${hit.paraIdx}` : "";
          window.location.href = `/chapters/${hit.slug}${hash}`;
        }
      } else if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    },
    [open, results, activeIndex],
  );

  const hrefFor = (hit: SearchHit) =>
    `/chapters/${hit.slug}${hit.paraIdx >= 0 ? `#p-${hit.paraIdx}` : ""}`;

  const ready = Boolean(built);

  return (
    <div className={`relative ${compact ? "w-full" : "mx-auto w-full max-w-xl"}`}>
      {/* input frame */}
      <div
        className={`group relative flex items-center gap-3 rounded-md border bg-void-2/80 backdrop-blur-md transition-all ${
          open
            ? "border-circuit/70 border-glow"
            : "border-ether/10 focus-within:border-circuit/60"
        }`}
      >
        <span className="pl-4 text-circuit">
          <SearchGlyph />
        </span>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 160)}
          onKeyDown={onKey}
          placeholder={
            ready ? "Search the archive…  e.g.  summoning, Saber, Grail" : "Loading index…"
          }
          className="w-full bg-transparent py-3.5 pr-4 font-ui text-[0.95rem] text-ether placeholder:text-ether-dim/60 focus:outline-none"
          aria-label="Search chapters"
        />
        {loading && (
          <span className="mr-3 h-3 w-3 animate-spin rounded-full border border-circuit/40 border-t-circuit" />
        )}
        <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 font-ui text-[0.6rem] uppercase tracking-widest text-ether-dim/50 sm:flex">
          {ready ? <kbd className="rounded border border-ether/15 px-1.5 py-0.5">/</kbd> : null}
        </span>
      </div>

      {/* results */}
      {open && query.trim().length >= 2 && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-md border border-circuit/25 bg-void-2/95 backdrop-blur-xl">
          {!ready && (
            <div className="px-4 py-6 text-center font-ui text-sm text-ether-dim">
              Indexing the archive…
            </div>
          )}
          {ready && results.length === 0 && (
            <div className="px-4 py-6 text-center font-ui text-sm text-ether-dim">
              No match found for{" "}
              <span className="text-crimson">&ldquo;{query}&rdquo;</span>
            </div>
          )}
          {ready &&
            results.map((hit, i) => (
              <a
                key={hit.slug + i}
                href={hrefFor(hit)}
                className={`block border-l-2 px-4 py-3 transition-colors ${
                  i === activeIndex
                    ? "border-circuit bg-circuit/5"
                    : "border-transparent hover:bg-circuit/5"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-display text-sm font-semibold uppercase tracking-wide text-ether">
                    {hit.title}
                  </span>
                  <span className="shrink-0 font-ui text-[0.62rem] uppercase tracking-widest text-circuit/70">
                    {hit.timeline}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 font-prose text-[0.85rem] leading-snug text-ether-dim">
                  {highlight(hit.snippet, query).map((part, j) =>
                    part.match ? (
                      <mark
                        key={j}
                        className="rounded-sm bg-crimson/25 px-0.5 text-crimson"
                      >
                        {part.text}
                      </mark>
                    ) : (
                      <span key={j}>{part.text}</span>
                    ),
                  )}
                </p>
              </a>
            ))}
        </div>
      )}
    </div>
  );
}

function SearchGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16.5 16.5 L21 21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
