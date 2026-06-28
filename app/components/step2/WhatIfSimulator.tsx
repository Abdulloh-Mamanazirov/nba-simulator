"use client";

import { useState, useMemo } from "react";
import { ACTIVITIES, FREQUENCY_LABELS } from "@/lib/activities";
import { calculateChemicalScores, calculateBandwidth, type Ratings } from "@/lib/scoring";
import SpectrumBars from "@/app/components/shared/SpectrumBars";

interface WhatIfSimulatorProps {
  ratings: Ratings;
}

export default function WhatIfSimulator({ ratings }: WhatIfSimulatorProps) {
  const [selectedActivity, setSelectedActivity] = useState(ACTIVITIES[0].id);
  const [simulatedFreq, setSimulatedFreq] = useState(4);

  const currentScores = useMemo(() => calculateChemicalScores(ratings), [ratings]);
  const currentBandwidth = useMemo(() => calculateBandwidth(currentScores), [currentScores]);

  const simulatedScores = useMemo(() => {
    const simRatings = { ...ratings, [selectedActivity]: simulatedFreq };
    return calculateChemicalScores(simRatings);
  }, [ratings, selectedActivity, simulatedFreq]);

  const simulatedBandwidth = useMemo(
    () => calculateBandwidth(simulatedScores),
    [simulatedScores]
  );

  const bandwidthDelta = simulatedBandwidth - currentBandwidth;

  return (
    <div className="card p-4 sm:p-6">
      <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-4">
        What-If Simulator
      </h2>

      <p className="text-xs text-[var(--text-dim)] mb-4">
        Pick an activity and frequency to see how your spectrum would change.
      </p>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select
          value={selectedActivity}
          onChange={(e) => setSelectedActivity(e.target.value)}
          className="flex-1 px-3 py-2.5 rounded-lg text-sm
                     bg-[var(--bg-card-2)] text-[var(--text)] border border-[var(--border)]
                     focus:outline-none focus:border-[var(--gold)] transition-colors"
        >
          {ACTIVITIES.map((a) => (
            <option key={a.id} value={a.id}>
              {a.icon} {a.name}
            </option>
          ))}
        </select>

        <div className="flex gap-1">
          {FREQUENCY_LABELS.map((label, i) => (
            <button
              key={i}
              onClick={() => setSimulatedFreq(i)}
              className={`
                px-2.5 py-2 rounded-lg text-[10px] sm:text-xs font-medium
                transition-all duration-200 cursor-pointer
                ${
                  simulatedFreq === i
                    ? "bg-[var(--gold)] text-[#060B12]"
                    : "bg-[var(--bg-card-2)] text-[var(--text-muted)] hover:text-[var(--text)]"
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Before / After */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2 text-center">
            Current
          </div>
          <SpectrumBars
            scores={currentScores}
            height={100}
            compact={true}
            animated={false}
            showLabels={false}
          />
          <div className="text-center mt-2">
            <span className="text-lg font-bold text-[var(--text)]">{currentBandwidth}</span>
            <span className="text-xs text-[var(--text-muted)]"> / 9</span>
          </div>
        </div>

        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2 text-center">
            Projected
          </div>
          <SpectrumBars
            scores={simulatedScores}
            height={100}
            compact={true}
            animated={false}
            showLabels={false}
          />
          <div className="text-center mt-2">
            <span className="text-lg font-bold text-[var(--text)]">{simulatedBandwidth}</span>
            <span className="text-xs text-[var(--text-muted)]"> / 9</span>
            {bandwidthDelta !== 0 && (
              <span
                className={`ml-2 text-xs font-bold ${
                  bandwidthDelta > 0 ? "text-[var(--success)]" : "text-[var(--danger)]"
                }`}
              >
                {bandwidthDelta > 0 ? "+" : ""}{bandwidthDelta}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
