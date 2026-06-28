"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { calculateChemicalScores, calculateBandwidth, type Ratings } from "@/lib/scoring";
import { saveResult } from "@/lib/storage";
import StepIndicator from "./components/StepIndicator";
import ThemeToggle from "./components/ThemeToggle";
import RateYourWeek from "./components/step1/RateYourWeek";
import YourResults from "./components/step2/YourResults";
import YourPrescription from "./components/step3/YourPrescription";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [maxReachedStep, setMaxReachedStep] = useState(1);
  const [ratings, setRatings] = useState<Ratings>({});

  const scores = useMemo(() => calculateChemicalScores(ratings), [ratings]);
  const bandwidth = useMemo(() => calculateBandwidth(scores), [scores]);

  const handleRatingChange = useCallback(
    (activityId: string, rating: number) => {
      setRatings((prev) => ({ ...prev, [activityId]: rating }));
    },
    []
  );

  const goToStep = (step: number) => {
    setCurrentStep(step);
    setMaxReachedStep((prev) => Math.max(prev, step));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCalculate = () => {
    // Save result to localStorage
    saveResult({
      date: new Date().toISOString(),
      ratings,
      chemicalScores: scores,
      bandwidth,
    });
    goToStep(2);
  };

  const handleRestart = () => {
    setRatings({});
    setCurrentStep(1);
    setMaxReachedStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[var(--gold)] shadow-[0_0_8px_rgba(232,181,90,0.4)]" />
            <span className="text-xs sm:text-sm font-semibold text-[var(--text-muted)] tracking-wide hidden sm:inline">
              NBA
            </span>
          </div>

          <StepIndicator
            currentStep={currentStep}
            maxReachedStep={maxReachedStep}
            onStepClick={goToStep}
          />

          <ThemeToggle />
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {currentStep === 1 && (
          <RateYourWeek
            ratings={ratings}
            onRatingChange={handleRatingChange}
            onNext={handleCalculate}
          />
        )}

        {currentStep === 2 && (
          <YourResults
            ratings={ratings}
            scores={scores}
            bandwidth={bandwidth}
            onNext={() => goToStep(3)}
            onBack={() => goToStep(1)}
          />
        )}

        {currentStep === 3 && (
          <YourPrescription
            ratings={ratings}
            scores={scores}
            bandwidth={bandwidth}
            onBack={() => goToStep(2)}
            onRestart={handleRestart}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-6 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs text-[var(--text-dim)] font-serif italic">
            Based on research by J. Ricketts (2026). This is a diagnostic
            instrument, not medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
