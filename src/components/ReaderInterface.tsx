"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ProseRenderer } from "./ProseRenderer";
import { TypographyDrawer } from "./TypographyDrawer";
import {
  WIDTH_PX,
  loadSettings,
  saveSettings,
  getProgress,
  setProgress,
  type ReaderSettings,
} from "@/lib/reading";
import type { ChapterMeta } from "@/lib/chapters";
import type { Block } from "@/lib/markdown";

interface ReaderInterfaceProps {
  chapter: {
    slug: string;
    title: string;
    volume: number;
    chapterNumber: number;
    timeline: string;
    wordCount: number;
    estReadMinutes: number;
    tags: string[];
  };
  blocks: Block[];
  prev: ChapterMeta | null;
  next: ChapterMeta | null;
}

export function ReaderInterface({
  chapter,
  blocks,
  prev,
  next,
}: ReaderInterfaceProps) {
  const [settings, setSettings] = useState<ReaderSettings | null>(null);
  const [progress, setProgressState] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restored = useRef(false);

  // hydrate settings from localStorage
  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const update = useCallback((patch: Partial<ReaderSettings>) => {
    setSettings((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      saveSettings(next);
      return next;
    });
  }, []);

  // scroll tracking + persistence
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      setProgressState(pct);

      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        setProgress(chapter.slug, pct);
      }, 400);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [chapter.slug]);

  // restore last reading position (unless a paragraph hash is targeted)
  useEffect(() => {
    if (restored.current) return;
    const hasHash = window.location.hash.length > 0;
    if (hasHash) {
      restored.current = true;
      return;
    }
    const pct = getProgress(chapter.slug);
    if (pct > 3 && pct < 99) {
      restored.current = true;
      requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        window.scrollTo({ top: (pct / 100) * max });
      });
    }
    restored.current = true;
  }, [chapter.slug]);

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "m" || e.key === "M") {
        setSettings((s) =>
          s ? { ...s, mode: s.mode === "vn" ? "standard" : "vn" } : s,
        );
      } else if (e.key === "s" || e.key === "S") {
        setDrawerOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const vnMode = settings?.mode === "vn";
  const fontFamilyClass = settings?.fontFamily === "sans" ? "font-ui" : "font-prose";
  const widthPx = WIDTH_PX[settings?.width ?? "normal"];
  const fontSize = settings?.fontSize ?? 18;

  return (
    <div className="min-h-screen pb-32">
      {/* ===== Floating Header ===== */}
      <header className="fixed inset-x-0 top-0 z-30 border-b border-circuit/15 bg-void/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <a
            href="/chapters"
            className="group flex items-center gap-1.5 font-ui text-xs uppercase tracking-widest text-ether-dim transition-colors hover:text-circuit"
          >
            <span className="transition-transform group-hover:-translate-x-0.5">←</span>
            Archive
          </a>

          <span className="h-4 w-px bg-ether/15" />

          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-sm font-semibold uppercase tracking-wide text-ether">
              {chapter.title}
            </p>
            <p className="font-ui text-[0.62rem] uppercase tracking-[0.2em] text-circuit/70">
              {chapter.timeline}
            </p>
          </div>

          <button
            onClick={() => update({ mode: vnMode ? "standard" : "vn" })}
            className={`hidden rounded border px-2.5 py-1 font-ui text-[0.65rem] uppercase tracking-widest transition-colors sm:block ${
              vnMode
                ? "border-crimson/60 text-crimson"
                : "border-circuit/40 text-circuit hover:bg-circuit/10"
            }`}
            aria-label="Toggle reading mode"
            title="Toggle mode (M)"
          >
            {vnMode ? "VN" : "Lit"} Mode
          </button>

          <button
            onClick={() => setDrawerOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded border border-ether/15 text-ether-dim transition-colors hover:border-circuit/50 hover:text-circuit"
            aria-label="Open settings"
            title="Settings (S)"
          >
            <GearGlyph />
          </button>
        </div>

        {/* progress bar */}
        <div className="h-0.5 w-full bg-ether/5">
          <div
            className="h-full bg-gradient-to-r from-circuit to-crimson transition-[width] duration-150"
            style={{
              width: `${Math.max(2, Math.min(100, progress))}%`,
              boxShadow: "0 0 10px rgba(0,243,255,0.6)",
            }}
          />
        </div>
      </header>

      {/* ===== Chapter Heading ===== */}
      <div className="mx-auto max-w-2xl px-5 pb-10 pt-28 text-center sm:pt-32">
        <p className="font-ui text-[0.65rem] uppercase tracking-[0.4em] text-circuit/70">
          Volume {chapter.volume} · Chapter {chapter.chapterNumber}
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold uppercase leading-tight tracking-wide text-white text-glow sm:text-4xl">
          {chapter.title}
        </h1>
        <div className="mx-auto mt-4 flex max-w-md items-center justify-center gap-4 font-ui text-[0.7rem] uppercase tracking-widest text-ether-dim">
          <span>{chapter.wordCount.toLocaleString()} words</span>
          <span className="h-1 w-1 rotate-45 bg-ether-dim/50" />
          <span>{chapter.estReadMinutes} min read</span>
        </div>
        {chapter.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {chapter.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-circuit/25 bg-circuit/5 px-2.5 py-0.5 font-ui text-[0.65rem] uppercase tracking-wider text-circuit/80"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        <div className="mx-auto mt-8 flex max-w-xs items-center gap-3">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-circuit/40" />
          <span className="h-1.5 w-1.5 rotate-45 bg-crimson/70" />
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-circuit/40" />
        </div>
      </div>

      {/* ===== Reading Pane ===== */}
      <article
        className={`mx-auto px-5 ${fontFamilyClass}`}
        style={{ maxWidth: widthPx, fontSize: `${fontSize}px` }}
      >
        <ProseRenderer blocks={blocks} vnMode={vnMode} />
      </article>

      {/* ===== Prev / Next ===== */}
      <nav className="mx-auto mt-16 grid max-w-2xl gap-3 px-5 sm:grid-cols-2">
        {prev ? (
          <a
            href={`/chapters/${prev.slug}`}
            className="group rounded-md border border-ether/10 p-4 transition-colors hover:border-circuit/40 hover:bg-circuit/5"
          >
            <span className="font-ui text-[0.62rem] uppercase tracking-widest text-ether-dim">
              ← Previous
            </span>
            <span className="mt-1 block font-display text-sm font-semibold uppercase tracking-wide text-ether group-hover:text-circuit">
              {prev.title}
            </span>
          </a>
        ) : (
          <span />
        )}
        {next ? (
          <a
            href={`/chapters/${next.slug}`}
            className="group rounded-md border border-ether/10 p-4 text-right transition-colors hover:border-crimson/40 hover:bg-crimson/5"
          >
            <span className="font-ui text-[0.62rem] uppercase tracking-widest text-ether-dim">
              Next →
            </span>
            <span className="mt-1 block font-display text-sm font-semibold uppercase tracking-wide text-ether group-hover:text-crimson">
              {next.title}
            </span>
          </a>
        ) : (
          <span className="rounded-md border border-crimson/20 bg-crimson/5 p-4 text-right">
            <span className="font-ui text-[0.62rem] uppercase tracking-widest text-crimson/80">
              End of Volume
            </span>
            <span className="mt-1 block font-display text-sm font-semibold uppercase tracking-wide text-ether">
              The loop awaits…
            </span>
          </span>
        )}
      </nav>

      {/* ===== VN Command Bar ===== */}
      {vnMode && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-crimson/30 bg-void-2/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-3">
            <span className="flex h-2 w-2 items-center">
              <span className="absolute h-2 w-2 animate-ping rounded-full bg-crimson/60" />
              <span className="h-2 w-2 rounded-full bg-crimson" />
            </span>
            <span className="font-ui text-[0.65rem] uppercase tracking-[0.3em] text-ether-dim">
              Immersive Mode · {chapter.timeline}
            </span>
            <span className="ml-auto hidden font-ui text-[0.6rem] uppercase tracking-widest text-circuit/60 sm:block">
              Click dialogue to advance ▸
            </span>
          </div>
        </div>
      )}

      <TypographyDrawer
        open={drawerOpen}
        settings={settings ?? loadSettingsFallback()}
        onChange={update}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}

function loadSettingsFallback() {
  // Placeholder shape used only before hydration completes.
  return {
    mode: "standard" as const,
    fontSize: 18,
    fontFamily: "serif" as const,
    width: "normal" as const,
  };
}

function GearGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
