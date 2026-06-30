"use client";

import { useState } from "react";
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
    <div className="card p-5 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)]">
          Your Neurochemical Spectrum
        </h2>
        <span className="whitespace-nowrap text-[9px] sm:text-[11px] text-[var(--text-dim)] border rounded-full border-red-500 text-red-700 font-semibold px-2">
          Tap any bar for details
        </span>
      </div>

      {/* Main spectrum — full width with group labels */}
      <div className="overflow-x-auto pb-2 -mx-2 px-2">
        <div className="min-w-[500px]">
          <SpectrumBars
            scores={scores}
            height={320}
            animated={true}
            showLabels={true}
            showThresholds={true}
            showGroupLabels={true}
            onBarClick={handleBarClick}
          />
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
