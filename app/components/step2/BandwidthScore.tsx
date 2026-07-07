"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language";
import { getCopy, bandwidthLevel } from "@/lib/copy";

interface BandwidthScoreProps {
  bandwidth: number;
}

export default function BandwidthScore({ bandwidth }: BandwidthScoreProps) {
  const { mode } = useLanguage();
  const copy = getCopy(mode);
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    let current = 0;
    const increment = () => {
      if (current < bandwidth) {
        current++;
        setDisplayed(current);
        setTimeout(increment, 180);
      }
    };
    const timer = setTimeout(increment, 400);
    return () => clearTimeout(timer);
  }, [bandwidth]);

  const getColor = () => {
    if (bandwidth <= 2) return "var(--danger)";
    if (bandwidth <= 5) return "var(--gold)";
    return "var(--success)";
  };

  const getLabel = () => bandwidthLevel(bandwidth, mode);

  return (
    <div className="text-center animate-count-up">
      <div className="mb-2">
        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
          {copy.bandwidthKicker}
        </span>
      </div>
      <div className="flex items-baseline justify-center gap-2 font-serif">
        <span
          className="text-6xl sm:text-8xl font-bold tabular-nums"
          style={{ color: getColor() }}
        >
          {displayed}
        </span>
        <span className="text-xl sm:text-2xl text-[var(--text-muted)] font-light">
          / 9
        </span>
      </div>
      <p className="text-sm sm:text-base text-[var(--text-muted)] mt-1 font-serif">
        {copy.bandwidthUnit}
      </p>
      <div
        className="mt-3 inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
        style={{
          color: getColor(),
          backgroundColor: `color-mix(in srgb, ${getColor()} 12%, transparent)`,
          border: `1px solid color-mix(in srgb, ${getColor()} 25%, transparent)`,
        }}
      >
        {getLabel()}
      </div>
    </div>
  );
}
