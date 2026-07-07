"use client";

import type { ChemicalScores } from "@/lib/scoring";
import { useLanguage } from "@/lib/language";
import { getCopy, deltaSummary } from "@/lib/copy";
import SpectrumBars from "@/app/components/shared/SpectrumBars";

interface BeforeAfterSpectrumProps {
  currentScores: ChemicalScores;
  projectedScores: ChemicalScores;
  currentBandwidth: number;
  projectedBandwidth: number;
}

export default function BeforeAfterSpectrum({
  currentScores,
  projectedScores,
  currentBandwidth,
  projectedBandwidth,
}: BeforeAfterSpectrumProps) {
  const { mode } = useLanguage();
  const copy = getCopy(mode);
  const delta = projectedBandwidth - currentBandwidth;

  return (
    <div className="card p-4 sm:p-6">
      <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-1">
        {copy.beforeAfterTitle}
      </h2>
      <p className="text-xs text-[var(--text-dim)] mb-6">
        {copy.beforeAfterIntro}
      </p>

      {/* Stack vertically on mobile, side-by-side on larger screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Current */}
        <div className="w-full">
          <div className="text-center mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              {copy.labelCurrent}
            </span>
          </div>
          <div className="overflow-x-auto pb-2 -mx-2 px-2">
            <div className="min-w-[400px]">
              <SpectrumBars
                scores={currentScores}
                height={140}
                animated={false}
                showLabels={false}
              />
            </div>
          </div>
          <div className="text-center mt-3">
            <span className="text-2xl font-bold text-[var(--text)]">
              {currentBandwidth}
            </span>
            <span className="text-sm text-[var(--text-muted)]"> / 9</span>
          </div>
        </div>

        {/* Projected */}
        <div className="w-full">
          <div className="text-center mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--success)]">
              {copy.labelProjected}
            </span>
          </div>
          <div className="overflow-x-auto pb-2 -mx-2 px-2">
            <div className="min-w-[400px]">
              <SpectrumBars
                scores={projectedScores}
                height={140}
                animated={true}
                showLabels={false}
              />
            </div>
          </div>
          <div className="text-center mt-3">
            <span className="text-2xl font-bold text-[var(--success)]">
              {projectedBandwidth}
            </span>
            <span className="text-sm text-[var(--text-muted)]"> / 9</span>
            {delta > 0 && (
              <span className="ml-2 text-sm font-bold text-[var(--success)]">
                +{delta}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Delta summary */}
      <div className="mt-6 pt-4 border-t border-[var(--border)] text-center">
        <p className="text-sm font-serif text-[var(--text-muted)] italic">
          {deltaSummary(delta, currentBandwidth, projectedBandwidth, mode)}
        </p>
      </div>
    </div>
  );
}
