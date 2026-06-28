"use client";

import { useState } from "react";
import { CHEMICALS } from "@/lib/chemicals";
import type { ChemicalScores } from "@/lib/scoring";
import SpectrumBars from "@/app/components/shared/SpectrumBars";
import ChemicalDetailPanel from "./ChemicalDetailPanel";

interface SpectrumVisualizerProps {
  scores: ChemicalScores;
}

export default function SpectrumVisualizer({
  scores,
}: SpectrumVisualizerProps) {
  const [selectedChemical, setSelectedChemical] = useState<string | null>(null);

  const handleBarClick = (chemicalId: string) => {
    setSelectedChemical(
      selectedChemical === chemicalId ? null : chemicalId
    );
  };

  return (
    <div className="card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)]">
          Your Neurochemical Spectrum
        </h2>
        <span className="text-[10px] text-[var(--text-dim)]">
          Tap any bar for details
        </span>
      </div>

      {/* Main spectrum */}
      <div className="overflow-x-auto pb-2 -mx-2 px-2">
        <div className="min-w-[400px]">
          <SpectrumBars
            scores={scores}
            height={260}
            animated={true}
            showLabels={true}
            showThresholds={true}
            onBarClick={handleBarClick}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-4 border-t border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[var(--chem-dopamine)]" />
          <span className="text-[10px] sm:text-xs text-[var(--text-muted)]">
            Dominant Triad (overactivated)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[var(--chem-gaba)]" />
          <span className="text-[10px] sm:text-xs text-[var(--text-muted)]">
            Neglected Architecture
          </span>
        </div>
      </div>

      {/* Detail panel */}
      {selectedChemical && (
        <ChemicalDetailPanel
          chemicalId={selectedChemical}
          score={scores[selectedChemical] ?? 0}
          onClose={() => setSelectedChemical(null)}
        />
      )}
    </div>
  );
}
