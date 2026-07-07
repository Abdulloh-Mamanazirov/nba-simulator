"use client";

import type { Ratings, ChemicalScores } from "@/lib/scoring";
import { calculateConditionScores } from "@/lib/scoring";
import {
  generatePrescriptions,
  calculateProjectedScores,
} from "@/lib/prescriptions";
import { generateTransducers } from "@/lib/transducers";
import { useLanguage } from "@/lib/language";
import { getCopy } from "@/lib/copy";
import PrescriptionCard from "./PrescriptionCard";
import BeforeAfterSpectrum from "./BeforeAfterSpectrum";
import EverydayUpgrades from "./EverydayUpgrades";
import ActionOptimizer from "./ActionOptimizer";

interface YourPrescriptionProps {
  ratings: Ratings;
  scores: ChemicalScores;
  bandwidth: number;
  onBack: () => void;
  onRestart: () => void;
}

export default function YourPrescription({
  ratings,
  scores,
  bandwidth,
  onBack,
  onRestart,
}: YourPrescriptionProps) {
  const { mode } = useLanguage();
  const copy = getCopy(mode);
  const prescriptions = generatePrescriptions(ratings, scores, bandwidth, mode);
  const projected = calculateProjectedScores(ratings, prescriptions);
  const conditionScores = calculateConditionScores(ratings);
  const transducers = generateTransducers(scores, conditionScores);

  return (
    <div className="animate-fade-up space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center py-4 sm:py-8">
        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[var(--text)] mb-3">
          {copy.rxTitle}
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
          {copy.rxIntro}
        </p>
      </div>

      {/* Optimize any action the user types (AI) */}
      <ActionOptimizer scores={scores} conditions={conditionScores} />

      {/* Everyday Upgrades (transducers) — friction-free on-ramp */}
      <EverydayUpgrades picks={transducers} />

      {/* Prescription Cards */}
      {prescriptions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {prescriptions.map((rx, i) => (
            <PrescriptionCard key={rx.activityId} prescription={rx} index={i} />
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center">
          <span className="text-4xl mb-4 block">🎯</span>
          <p className="text-base font-serif text-[var(--text)]">
            {copy.rxEmpty}
          </p>
        </div>
      )}

      {/* Before/After Spectrum */}
      {prescriptions.length > 0 && (
        <BeforeAfterSpectrum
          currentScores={scores}
          projectedScores={projected.scores}
          currentBandwidth={bandwidth}
          projectedBandwidth={projected.bandwidth}
        />
      )}

      {/* Closing note */}
      <div className="card p-5 sm:p-8 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, var(--gold), transparent 70%)",
          }}
        />
        <div className="relative">
          <p className="text-sm sm:text-base font-serif italic text-[var(--text-muted)] leading-relaxed max-w-2xl mx-auto">
            {copy.closingNote}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 pb-8">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl text-sm font-medium cursor-pointer
                     bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border)]
                     hover:border-[var(--border-light)] hover:text-[var(--text)]
                     transition-all duration-200"
        >
          {copy.backToResults}
        </button>

        <button
          onClick={onRestart}
          id="retake-audit-btn"
          className="px-8 py-3.5 rounded-xl text-sm font-semibold cursor-pointer
                     bg-[var(--bg-card-2)] text-[var(--text)] border border-[var(--border)]
                     hover:border-[var(--gold)] hover:text-[var(--gold)]
                     transition-all duration-300"
        >
          {copy.retake}
        </button>
      </div>
    </div>
  );
}
