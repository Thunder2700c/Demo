"use client";

import { useEffect, useRef, useState } from "react";

interface TypewriterProps {
  text: string;
  /** ms per character */
  speed?: number;
  className?: string;
  showCaret?: boolean;
  onComplete?: () => void;
}

/**
 * Character-by-character typewriter used by VN dialogue. Mounting starts the
 * effect; clicking the element instantly reveals the full line (classic VN skip).
 */
export function Typewriter({
  text,
  speed = 22,
  className = "",
  showCaret = true,
  onComplete,
}: TypewriterProps) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const raf = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    setCount(0);
    setDone(false);
    startRef.current = null;

    const tick = (t: number) => {
      if (startRef.current === null) startRef.current = t;
      const elapsed = t - startRef.current;
      const next = Math.min(text.length, Math.floor(elapsed / speed));
      setCount(next);
      if (next < text.length) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setDone(true);
        onComplete?.();
      }
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [text, speed, onComplete]);

  const skip = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    setCount(text.length);
    setDone(true);
    onComplete?.();
  };

  return (
    <span
      className={className}
      onClick={skip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          skip();
        }
      }}
    >
      {text.slice(0, count)}
      {showCaret && <span className={`type-caret ${done ? "opacity-60" : ""}`}>&#8203;</span>}
    </span>
  );
}
