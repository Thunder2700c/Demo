import { Index, type Id } from "flexsearch";

export interface ChapterIndex {
  slug: string;
  title: string;
  synopsis: string;
  tags: string[];
  timeline: string;
  paragraphs: { idx: number; text: string }[];
}

interface Entry {
  chapterIdx: number;
  kind: "title" | "synopsis" | "para";
  paraIdx: number;
  text: string;
}

export interface SearchHit {
  slug: string;
  title: string;
  timeline: string;
  tags: string[];
  snippet: string;
  paraIdx: number;
}

export interface BuiltIndex {
  index: Index<false, false, true>;
  entries: Entry[];
  chapters: ChapterIndex[];
}

export function buildIndex(chapters: ChapterIndex[]): BuiltIndex {
  const entries: Entry[] = [];
  const index = new Index({
    tokenize: "forward",
    resolution: 9,
    context: { resolution: 6, depth: 1, bidirectional: true },
  });

  chapters.forEach((ch, ci) => {
    pushEntry(entries, index, ci, "title", -1, ch.title);
    pushEntry(entries, index, ci, "synopsis", -1, ch.synopsis);
    ch.paragraphs.forEach((p) => {
      pushEntry(entries, index, ci, "para", p.idx, p.text);
    });
  });

  return { index, entries, chapters };
}

function pushEntry(
  entries: Entry[],
  index: Index<false, false, true>,
  chapterIdx: number,
  kind: Entry["kind"],
  paraIdx: number,
  text: string,
) {
  const entry: Entry = { chapterIdx, kind, paraIdx, text };
  index.add(entries.length, text);
  entries.push(entry);
}

function buildSnippet(text: string, query: string): string {
  if (!text) return "";
  const tokens = query.trim().split(/\s+/).filter((t) => t.length > 1);
  const lower = text.toLowerCase();
  let at = -1;
  for (const t of tokens) {
    const i = lower.indexOf(t.toLowerCase());
    if (i !== -1) {
      at = i;
      break;
    }
  }
  if (at === -1) {
    return text.slice(0, 160).trim() + (text.length > 160 ? "…" : "");
  }
  const start = Math.max(0, at - 70);
  const end = Math.min(text.length, at + 120);
  return (
    (start > 0 ? "…" : "") +
    text.slice(start, end).trim() +
    (end < text.length ? "…" : "")
  );
}

export function runSearch(
  query: string,
  built: BuiltIndex,
  limit = 8,
): SearchHit[] {
  const q = query.trim();
  if (q.length < 2) return [];

  const raw = built.index.search(q, { limit: limit * 8, suggest: true });
  const ids = (Array.isArray(raw) ? raw : []) as Id[];
  const seen = new Map<number, { entry: Entry; rank: number }>();

  ids.forEach((id, rank) => {
    const entry = built.entries[id as number];
    if (!entry) return;
    // Prefer paragraph matches for deep-linking, then titles, then synopsis.
    const score =
      rank + (entry.kind === "para" ? 0 : entry.kind === "title" ? 1 : 2);
    const prev = seen.get(entry.chapterIdx);
    if (!prev || score < prev.rank) {
      seen.set(entry.chapterIdx, { entry, rank: score });
    }
  });

  const hits: SearchHit[] = [];
  for (const [chapterIdx, { entry }] of seen) {
    const ch = built.chapters[chapterIdx];
    if (!ch) continue;
    let paraIdx = -1;
    let text = ch.synopsis;
    if (entry.kind === "para") {
      paraIdx = entry.paraIdx;
      const p = ch.paragraphs.find((pp) => pp.idx === entry.paraIdx);
      text = p?.text ?? ch.synopsis;
    }
    hits.push({
      slug: ch.slug,
      title: ch.title,
      timeline: ch.timeline,
      tags: ch.tags,
      snippet: buildSnippet(text, q),
      paraIdx,
    });
  }

  return hits.slice(0, limit);
}

/** Split a snippet into plain / match parts for crimson highlighting. */
export function highlight(
  snippet: string,
  query: string,
): { text: string; match: boolean }[] {
  const tokens = query
    .trim()
    .split(/\s+/)
    .filter((t) => t.length > 1)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (tokens.length === 0) return [{ text: snippet, match: false }];
  const regex = new RegExp(`(${tokens.join("|")})`, "gi");
  return snippet
    .split(regex)
    .filter((p) => p !== "")
    .map((p) => ({
      text: p,
      match: tokens.some((t) => new RegExp(`^${t}$`, "i").test(p)),
    }));
}
