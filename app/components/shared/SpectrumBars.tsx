"use client";

import { CHEMICALS, TRIAD_CHEMICALS, NEGLECTED_CHEMICALS } from "@/lib/chemicals";
import type { ChemicalScores } from "@/lib/scoring";
import { useLanguage } from "@/lib/language";
import { getCopy, chemPrimary } from "@/lib/copy";

interface SpectrumBarsProps {
  scores: ChemicalScores;
  height?: number;
  animated?: boolean;
  compact?: boolean;
  showLabels?: boolean;
  showThresholds?: boolean;
  showGroupLabels?: boolean;
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
  showGroupLabels = false,
  onBarClick,
  className = "",
}: SpectrumBarsProps) {
  const { mode } = useLanguage();
  const copy = getCopy(mode);

  const renderBar = (chem: (typeof CHEMICALS)[0], i: number) => {
    const label = chemPrimary(chem, mode);
    const score = scores[chem.id] ?? chem.baseScore;
    const barHeight = (score / 100) * height;
    const isTriad = chem.category === "triad";
    const isOverdriven = isTriad && score >= chem.dangerThreshold;
    const isActive = !isTriad && score >= chem.starvationThreshold;

    return (
      <div
        key={chem.id}
        className="flex flex-col items-center flex-1"
        style={{
          minWidth: compact ? 6 : 0,
          maxWidth: compact ? 24 : undefined,
        }}
      >
        {/* Bar container — extra padding top so 100% bars aren't clipped */}
        <div
          className="relative w-full flex items-end justify-center px-0.5"
          style={{ height: height + 4, paddingTop: 4 }}
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
          <div className="text-center w-full mt-1.5">
            <span className="text-[9px] sm:text-[10px] font-medium text-[var(--text-muted)] leading-none block truncate px-0.5">
              {label.length > 8 ? label.slice(0, 7) + "." : label}
            </span>
            <span
              className="text-[10px] sm:text-xs font-bold block mt-0.5"
              style={{ color: chem.color }}
            >
              {score}
            </span>
          </div>
        )}
      </div>
    );
  };

  // Full mode with group labels
  if (showGroupLabels && !compact) {
    return (
      <div className={`relative ${className}`}>
        {/* Threshold lines */}
        {showThresholds && (
          <>
            <div
              className="absolute left-0 right-0 border-t border-dashed border-[var(--danger)]/40 z-10 pointer-events-none"
              style={{ bottom: `${(68 / 100) * height + 4}px` }}
            >
              <span className="absolute -top-4 right-0 text-[9px] font-medium text-[var(--danger)]/60 tracking-wider uppercase">
                {copy.thresholdOverdriven}
              </span>
            </div>
            <div
              className="absolute left-0 right-0 border-t border-dashed border-[var(--text-muted)]/30 z-10 pointer-events-none"
              style={{ bottom: `${(35 / 100) * height + 4}px` }}
            >
              <span className="absolute -top-4 right-0 text-[9px] font-medium text-[var(--text-muted)]/50 tracking-wider uppercase">
                {copy.thresholdStarvation}
              </span>
            </div>
          </>
        )}

        <div className="flex gap-4 sm:gap-6 w-full">
          {/* Triad group */}
          <div className="flex flex-col items-center" style={{ flex: "0 0 auto", width: "25%" }}>
            <div className="flex items-end gap-1 sm:gap-1.5 w-full">
              {TRIAD_CHEMICALS.map((c, i) => renderBar(c, i))}
            </div>
            <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)] mt-3 text-center">
              {copy.groupTriad}
            </span>
          </div>

          {/* Separator */}
          <div className="w-px bg-[var(--border)] self-stretch opacity-50" />

          {/* Neglected group */}
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-end gap-1 sm:gap-1.5 w-full">
              {NEGLECTED_CHEMICALS.map((c, i) => renderBar(c, i + 3))}
            </div>
            <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)] mt-3 text-center">
              {copy.groupNeglected}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Compact / simple mode (no group labels)
  return (
    <div className={`relative ${className}`}>
      {showThresholds && (
        <>
          <div
            className="absolute left-0 right-0 border-t border-dashed border-[var(--danger)]/40 z-10 pointer-events-none"
            style={{ bottom: `${(68 / 100) * height + 4}px` }}
          >
            <span className="absolute -top-4 right-0 text-[9px] font-medium text-[var(--danger)]/60 tracking-wider uppercase">
              {copy.thresholdOverdriven}
            </span>
          </div>
          <div
            className="absolute left-0 right-0 border-t border-dashed border-[var(--text-muted)]/30 z-10 pointer-events-none"
            style={{ bottom: `${(35 / 100) * height + 4}px` }}
          >
            <span className="absolute -top-4 right-0 text-[9px] font-medium text-[var(--text-muted)]/50 tracking-wider uppercase">
              {copy.thresholdStarvation}
            </span>
          </div>
        </>
      )}

      <div className={`flex items-end ${compact ? "gap-1" : "gap-1.5 sm:gap-2"} w-full`}>
        {CHEMICALS.map((chem, i) => renderBar(chem, i))}
      </div>
    </div>
  );
}
