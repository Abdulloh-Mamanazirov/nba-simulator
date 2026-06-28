"use client";

import type { Ratings, ChemicalScores } from "@/lib/scoring";
import {
  calculateConditionScores,
  calculateMonocultureIndex,
  generateNarrative,
} from "@/lib/scoring";
import BandwidthScore from "./BandwidthScore";
import SpectrumVisualizer from "./SpectrumVisualizer";
import DynorphinCallout from "./DynorphinCallout";
import ConditionMeters from "./ConditionMeters";
import ChemicalAccordion from "./ChemicalAccordion";
import MonocultureScore from "./MonocultureScore";
import NarrativeSummary from "./NarrativeSummary";
import ChemicalInteractionMap from "./ChemicalInteractionMap";

interface YourResultsProps {
  ratings: Ratings;
  scores: ChemicalScores;
  bandwidth: number;
  onNext: () => void;
  onBack: () => void;
}

export default function YourResults({
  ratings,
  scores,
  bandwidth,
  onNext,
  onBack,
}: YourResultsProps) {
  const conditionScores = calculateConditionScores(ratings);
  const monocultureIndex = calculateMonocultureIndex(scores);
  const narrative = generateNarrative(scores, bandwidth, conditionScores);

  return (
    <div className="animate-fade-up space-y-6 sm:space-y-8">
      {/* Bandwidth Score */}
      <div className="py-6 sm:py-10">
        <BandwidthScore bandwidth={bandwidth} />
      </div>

      {/* Narrative */}
      <NarrativeSummary narrative={narrative} />

      {/* Spectrum Visualizer */}
      <SpectrumVisualizer scores={scores} />

      {/* Dynorphin Warning */}
      <DynorphinCallout dopamineScore={scores.dopamine ?? 0} />

      {/* Condition Meters + Monoculture in a grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConditionMeters
          slowness={conditionScores.slowness}
          embodiment={conditionScores.embodiment}
          attention={conditionScores.attention}
        />
        <MonocultureScore index={monocultureIndex} />
      </div>

      {/* Chemical Interaction Map */}
      <ChemicalInteractionMap scores={scores} />

      {/* Chemical Accordion — collapsed by default */}
      <ChemicalAccordion scores={scores} />

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 pb-8">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl text-sm font-medium cursor-pointer
                     bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border)]
                     hover:border-[var(--border-light)] hover:text-[var(--text)]
                     transition-all duration-200"
        >
          ← Edit Ratings
        </button>

        <button
          onClick={onNext}
          id="get-prescription-btn"
          className="px-8 py-3.5 rounded-xl text-sm font-semibold cursor-pointer
                     bg-[var(--gold)] text-[var(--gold-text)]
                     shadow-[0_0_30px_rgba(232,181,90,0.3)]
                     hover:shadow-[0_0_40px_rgba(232,181,90,0.5)] hover:scale-[1.02]
                     active:scale-[0.98] transition-all duration-300"
        >
          Get My Prescription →
        </button>
      </div>
    </div>
  );
}
