/* Client-side reading state. Everything lives in localStorage — no cookies,
   no backend, no trackers, exactly as the persistence spec demands. */

export const STORAGE_PREFIX = "fate-slt";

export function progressKey(slug: string): string {
  return `${STORAGE_PREFIX}:progress:${slug}`;
}

export function getProgress(slug: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const v = window.localStorage.getItem(progressKey(slug));
    if (!v) return 0;
    return Math.min(100, Math.max(0, Number(v) || 0));
  } catch {
    return 0;
  }
}

export function setProgress(slug: string, pct: number): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(progressKey(slug), String(Math.round(pct)));
  } catch {
    /* storage may be unavailable */
  }
}

export type ReaderMode = "standard" | "vn";
export type FontFamily = "serif" | "sans";
export type ReaderWidth = "narrow" | "normal" | "wide";

export interface ReaderSettings {
  mode: ReaderMode;
  fontSize: number; // 14 - 24
  fontFamily: FontFamily;
  width: ReaderWidth;
}

export const DEFAULT_SETTINGS: ReaderSettings = {
  mode: "standard",
  fontSize: 18,
  fontFamily: "serif",
  width: "normal",
};

export const SETTINGS_KEY = `${STORAGE_PREFIX}:settings`;

export function loadSettings(): ReaderSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<ReaderSettings>;
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      fontSize: clamp(
        Number(parsed.fontSize) || DEFAULT_SETTINGS.fontSize,
        14,
        24,
      ),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(s: ReaderSettings): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export const WIDTH_PX: Record<ReaderWidth, number> = {
  narrow: 620,
  normal: 720,
  wide: 840,
};
