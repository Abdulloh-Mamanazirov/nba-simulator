"use client";

import { calculateChemicalScores, type Ratings } from "@/lib/scoring";
import SpectrumBars from "@/app/components/shared/SpectrumBars";

interface MiniSpectrumProps {
  ratings: Ratings;
}

export default function MiniSpectrum({ ratings }: MiniSpectrumProps) {
  const scores = calculateChemicalScores(ratings);

  return (
    <div className="card-2 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
          Live Spectrum Preview
        </span>
        <span className="text-[10px] sm:text-xs text-[var(--text-dim)]">
          Updates as you rate
        </span>
      </div>
      <SpectrumBars
        scores={scores}
        height={60}
        compact={true}
        animated={false}
        showLabels={false}
      />
    </div>
  );
}
