"use client";

import { useEffect, useState } from "react";

const FINAL_TEXT = "I am Batu.";

const FRAMES = [
  "I",
  "I ",
  "I a",
  "I am",
  "I am ",
  "I am G",
  "I am Gr",
  "I am Gro",
  "I am Groo",
  "I am Groot",
  "I am Groot.",
  "I am Groot",
  "I am Groo",
  "I am Gro",
  "I am Gr",
  "I am G",
  "I am ",
  "I am B",
  "I am Ba",
  "I am Bat",
  FINAL_TEXT,
];

const DELAYS = [
  180,
  120,
  160,
  140,
  210,
  260,
  170,
  220,
  155,
  240,
  520,
  95,
  80,
  95,
  75,
  230,
  190,
  145,
  175,
  0,
];

export default function AboutTypewriter() {
  const [frameIndex, setFrameIndex] = useState(() => {
    if (typeof window === "undefined") return 0;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? FRAMES.length - 1 : 0;
  });
  const text = FRAMES[frameIndex];

  useEffect(() => {
    if (frameIndex >= FRAMES.length - 1) return;

    const timeout = window.setTimeout(() => {
      setFrameIndex((prev) => prev + 1);
    }, DELAYS[frameIndex]);

    return () => window.clearTimeout(timeout);
  }, [frameIndex]);

  return (
    <span className="inline-flex items-center font-mono normal-case tracking-normal" aria-label={FINAL_TEXT}>
      <span aria-hidden="true">{text}</span>
      <span className="ml-1 inline-block h-[1em] w-2 translate-y-[0.08em] bg-[var(--color-accent)] animate-pulse" aria-hidden="true" />
    </span>
  );
}
