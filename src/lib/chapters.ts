import fs from "node:fs";
import path from "node:path";
import { parseBlocks, blocksToPlainText, type Block } from "./markdown";

const CHAPTERS_DIR = path.join(process.cwd(), "src/content/chapters");

export interface ChapterMeta {
  slug: string;
  title: string;
  volume: number;
  chapterNumber: number;
  publishDate: string;
  synopsis: string;
  tags: string[];
  timeline: string;
  wordCount: number;
  estReadMinutes: number;
}

export interface Chapter extends ChapterMeta {
  blocks: Block[];
  plainText: string;
}

export interface ChapterSummary extends ChapterMeta {
  excerpt: string;
}

/* ---------- frontmatter ---------- */

function parseFrontmatter(raw: string): Record<string, string> {
  const out: Record<string, string> = {};
  const lines = raw.split("\n");
  for (const line of lines) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function parseList(val: string | undefined): string[] {
  if (!val) return [];
  const cleaned = val.replace(/[[\]]/g, "").trim();
  if (cleaned === "") return [];
  return cleaned
    .split(",")
    .map((s) => s.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}

function splitFile(file: string): { fm: string; body: string } {
  if (file.startsWith("---")) {
    const end = file.indexOf("\n---", 3);
    if (end !== -1) {
      return {
        fm: file.slice(3, end).trim(),
        body: file.slice(end + 4).trim(),
      };
    }
  }
  return { fm: "", body: file.trim() };
}

function countWords(text: string): number {
  return text
    .split(/\s+/)
    .map((w) => w.trim())
    .filter(Boolean).length;
}

/* ---------- io ---------- */

function listChapterFiles(): string[] {
  if (!fs.existsSync(CHAPTERS_DIR)) return [];
  return fs
    .readdirSync(CHAPTERS_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort();
}

function readChapterFile(fileName: string): Chapter {
  const fullPath = path.join(CHAPTERS_DIR, fileName);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { fm, body } = splitFile(raw);
  const m = parseFrontmatter(fm);
  const blocks = parseBlocks(body);
  const plainText = blocksToPlainText(blocks);
  const wordCount = countWords(plainText);

  const slug =
    m.slug ||
    fileName.replace(/\.md$/, "").replace(/[^a-z0-9-]/gi, "-").toLowerCase();

  return {
    slug,
    title: m.title || slug,
    volume: Number(m.volume || 1),
    chapterNumber: Number(m.chapterNumber || 1),
    publishDate: m.publishDate || "",
    synopsis: m.synopsis || "",
    tags: parseList(m.tags),
    timeline: m.timeline || `Volume ${m.volume || 1}`,
    wordCount,
    estReadMinutes: Math.max(1, Math.round(wordCount / 220)),
    blocks,
    plainText,
  };
}

const cache = new Map<string, Chapter>();

function getChapterCached(fileName: string): Chapter {
  if (!cache.has(fileName)) {
    cache.set(fileName, readChapterFile(fileName));
  }
  return cache.get(fileName)!;
}

export function getAllChapters(): Chapter[] {
  return listChapterFiles().map(getChapterCached);
}

export function getChapterBySlug(slug: string): Chapter | null {
  const found = getAllChapters().find((c) => c.slug === slug);
  return found ?? null;
}

export function getChapterNeighbors(slug: string): {
  prev: ChapterMeta | null;
  next: ChapterMeta | null;
} {
  const all = getAllChapters();
  const idx = all.findIndex((c) => c.slug === slug);
  return {
    prev: idx > 0 ? toMeta(all[idx - 1]) : null,
    next: idx >= 0 && idx < all.length - 1 ? toMeta(all[idx + 1]) : null,
  };
}

function toMeta(c: Chapter): ChapterMeta {
  const { blocks: _b, plainText: _p, ...meta } = c;
  void _b;
  void _p;
  return meta;
}

export function getChapterSummaries(): ChapterSummary[] {
  return getAllChapters()
    .sort((a, b) => a.volume - b.volume || a.chapterNumber - b.chapterNumber)
    .map((c) => {
      const firstPara = c.plainText.split("\n\n")[0] ?? "";
      const excerpt = `${firstPara.slice(0, 180).trim()}${
        firstPara.length > 180 ? "…" : ""
      }`;
      return { ...toMeta(c), excerpt };
    });
}

/* ---------- global stats ---------- */

export function getStats(): {
  totalChapters: number;
  totalWords: number;
  totalReadMinutes: number;
  latestTimeline: string;
  volumes: number;
} {
  const all = getAllChapters();
  const totalWords = all.reduce((acc, c) => acc + c.wordCount, 0);
  const latest = [...all].sort((a, b) =>
    b.timeline.localeCompare(a.timeline),
  )[0];
  return {
    totalChapters: all.length,
    totalWords,
    totalReadMinutes: Math.max(1, Math.round(totalWords / 220)),
    latestTimeline: latest?.timeline ?? "—",
    volumes: new Set(all.map((c) => c.volume)).size,
  };
}
