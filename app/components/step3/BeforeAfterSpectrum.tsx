"use client";

import type { ChemicalScores } from "@/lib/scoring";
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
  const delta = projectedBandwidth - currentBandwidth;

  return (
    <div className="card p-4 sm:p-6">
      <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-1">
        If You Followed All Recommendations
      </h2>
      <p className="text-xs text-[var(--text-dim)] mb-6">
        Projected neurochemical spectrum with all prescriptions applied.
      </p>

      <div className="grid grid-cols-2 gap-6 sm:gap-8">
        {/* Current */}
        <div>
          <div className="text-center mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Current
            </span>
          </div>
          <SpectrumBars
            scores={currentScores}
            height={120}
            compact={true}
            animated={false}
            showLabels={false}
          />
          <div className="text-center mt-3">
            <span className="text-2xl font-bold text-[var(--text)]">
              {currentBandwidth}
            </span>
            <span className="text-sm text-[var(--text-muted)]"> / 9</span>
          </div>
        </div>

        {/* Projected */}
        <div>
          <div className="text-center mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--success)]">
              Projected
            </span>
          </div>
          <SpectrumBars
            scores={projectedScores}
            height={120}
            compact={true}
            animated={true}
            showLabels={false}
          />
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
          {delta > 0
            ? `These changes would activate ${delta} additional neglected system${
                delta !== 1 ? "s" : ""
              }, expanding your neurochemical range from ${currentBandwidth} to ${projectedBandwidth} channels.`
            : "Your current range is already at maximum breadth. Focus on deepening individual systems."}
        </p>
      </div>
    </div>
  );
}
