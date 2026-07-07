"use client";

import { getChemical } from "@/lib/chemicals";
import { useLanguage } from "@/lib/language";
import {
  getCopy,
  chemPrimary,
  chemSecondary,
  chemDescription,
  chemDetail,
  conditionLabel,
} from "@/lib/copy";

interface ChemicalDetailPanelProps {
  chemicalId: string;
  score: number;
  onClose: () => void;
}

export default function ChemicalDetailPanel({
  chemicalId,
  score,
  onClose,
}: ChemicalDetailPanelProps) {
  const { mode } = useLanguage();
  const copy = getCopy(mode);
  const chemical = getChemical(chemicalId);
  const isTriad = chemical.category === "triad";
  const isOverdriven = isTriad && score >= chemical.dangerThreshold;
  const isStarving = !isTriad && score < chemical.starvationThreshold;
  const detail = chemDetail(chemical, mode);

  return (
    <div className="mt-4 animate-slide-in">
      <div
        className="rounded-xl p-4 sm:p-5 border relative"
        style={{
          borderColor: `color-mix(in srgb, ${chemical.color} 30%, var(--border))`,
          background: `color-mix(in srgb, ${chemical.color} 5%, var(--bg-card))`,
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center
                     text-[var(--text-muted)] hover:text-[var(--text)] bg-[var(--bg-card)] border border-[var(--border)]
                     transition-colors cursor-pointer text-xs"
        >
          ×
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: chemical.color }}
          />
          <div>
            <h3 className="text-sm font-bold" style={{ color: chemical.color }}>
              {chemPrimary(chemical, mode)}
            </h3>
            <span className="text-xs text-[var(--text-muted)]">
              {chemSecondary(chemical, mode)}
            </span>
          </div>
          <div className="ml-auto text-right">
            <span
              className="text-2xl font-bold tabular-nums"
              style={{ color: chemical.color }}
            >
              {score}
            </span>
            <span className="text-xs text-[var(--text-muted)]"> / 100</span>
          </div>
        </div>

        {/* Score bar */}
        <div className="relative h-2 bg-[var(--bg-card-2)] rounded-full mb-4 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
            style={{
              width: `${score}%`,
              backgroundColor: chemical.color,
            }}
          />
          {/* Thresholds */}
          <div
            className="absolute top-0 bottom-0 w-px bg-[var(--text-muted)]/50"
            style={{ left: `${chemical.starvationThreshold}%` }}
          />
          <div
            className="absolute top-0 bottom-0 w-px bg-[var(--danger)]/50"
            style={{ left: `${chemical.dangerThreshold}%` }}
          />
        </div>

        {/* Status badge */}
        {(isOverdriven || isStarving) && (
          <div
            className={`
              inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3
              ${isOverdriven ? "bg-[var(--danger)]/15 text-[var(--danger)]" : ""}
              ${isStarving ? "bg-[var(--gold)]/15 text-[var(--gold)]" : ""}
            `}
          >
            {isOverdriven ? copy.statusOverdriven : copy.statusStarving}
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-[var(--text)] leading-relaxed mb-3 font-serif">
          {chemDescription(chemical, mode)}
        </p>

        {/* Scientific detail — hidden in plain mode */}
        {detail && (
          <p className="text-xs text-[var(--text-muted)] leading-relaxed font-serif italic">
            {detail}
          </p>
        )}

        {/* Conditions */}
        {chemical.conditions.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[var(--border)]">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">
              {copy.activatingConditions}{" "}
            </span>
            {chemical.conditions.map((cond) => (
              <span
                key={cond}
                className="inline-block px-2 py-0.5 rounded text-[10px] font-medium
                           bg-[var(--bg-card-2)] text-[var(--text-muted)] mr-1"
              >
                {conditionLabel(cond, mode)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
