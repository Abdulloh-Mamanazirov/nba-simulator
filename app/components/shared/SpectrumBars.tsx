"use client";

import { CHEMICALS } from "@/lib/chemicals";
import type { ChemicalScores } from "@/lib/scoring";

interface SpectrumBarsProps {
  scores: ChemicalScores;
  height?: number;
  animated?: boolean;
  compact?: boolean;
  showLabels?: boolean;
  showThresholds?: boolean;
  onBarClick?: (chemicalId: string) => void;
  className?: string;
}

export default function SpectrumBars({
  scores,
  height = 200,
  animated = true,
  compact = false,
  showLabels = true,
  showThresholds = false,
  onBarClick,
  className = "",
}: SpectrumBarsProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Threshold lines */}
      {showThresholds && (
        <>
          {/* Danger threshold at 68% */}
          <div
            className="absolute left-0 right-0 border-t border-dashed border-[var(--danger)]/40 z-10 pointer-events-none"
            style={{ bottom: `${(68 / 100) * height}px` }}
          >
            <span className="absolute -top-4 right-0 text-[9px] font-medium text-[var(--danger)]/60 tracking-wider uppercase">
              Overdriven
            </span>
          </div>
          {/* Starvation threshold at 35% */}
          <div
            className="absolute left-0 right-0 border-t border-dashed border-[var(--text-muted)]/30 z-10 pointer-events-none"
            style={{ bottom: `${(35 / 100) * height}px` }}
          >
            <span className="absolute -top-4 right-0 text-[9px] font-medium text-[var(--text-muted)]/50 tracking-wider uppercase">
              Starvation
            </span>
          </div>
        </>
      )}

      <div
        className={`flex items-end ${compact ? "gap-1" : "gap-1.5 sm:gap-2"} justify-center`}
        style={{ height }}
      >
        {CHEMICALS.map((chem, i) => {
          const score = scores[chem.id] ?? chem.baseScore;
          const barHeight = (score / 100) * height;
          const isTriad = chem.category === "triad";
          const isOverdriven = isTriad && score >= chem.dangerThreshold;
          const isActive =
            !isTriad && score >= chem.starvationThreshold;

          return (
            <div
              key={chem.id}
              className={`flex flex-col items-center ${compact ? "gap-0.5" : "gap-1"}`}
              style={{
                flex: isTriad && !compact ? "1.3" : "1",
                maxWidth: compact ? "18px" : isTriad ? "40px" : "32px",
                minWidth: compact ? "6px" : isTriad ? "20px" : "14px",
              }}
            >
              {/* Bar */}
              <div
                className="relative w-full flex items-end justify-center"
                style={{ height }}
              >
                <div
                  onClick={() => onBarClick?.(chem.id)}
                  className={`
                    spectrum-bar w-full
                    ${isTriad ? "triad" : "neglected"}
                    ${isOverdriven ? "overdriven" : ""}
                    ${isActive ? "active-glow" : ""}
                    ${animated ? "animate-bar-rise" : ""}
                    ${onBarClick ? "cursor-pointer hover:brightness-125" : ""}
                    delay-${i + 1}
                  `}
                  style={{
                    height: `${barHeight}px`,
                    backgroundColor: chem.color,
                    "--bar-color": chem.color,
                    opacity: !isTriad && score < chem.starvationThreshold ? 0.5 : 1,
                  } as React.CSSProperties}
                  title={`${chem.name}: ${score}/100`}
                />
              </div>

              {/* Label */}
              {showLabels && !compact && (
                <div className="text-center w-full">
                  <span className="text-[8px] sm:text-[9px] font-medium text-[var(--text-muted)] leading-none block truncate">
                    {chem.name.length > 6
                      ? chem.name.slice(0, 5) + "."
                      : chem.name}
                  </span>
                  <span
                    className="text-[9px] sm:text-[10px] font-bold block"
                    style={{ color: chem.color }}
                  >
                    {score}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
