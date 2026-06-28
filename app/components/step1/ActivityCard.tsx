"use client";

import type { Activity, ImpactChip } from "@/lib/activities";
import { FREQUENCY_LABELS } from "@/lib/activities";
import { getChemical } from "@/lib/chemicals";

interface ActivityCardProps {
  activity: Activity;
  rating: number;
  onRatingChange: (activityId: string, rating: number) => void;
}

function ImpactChipBadge({ chip }: { chip: ImpactChip }) {
  const chemical = getChemical(chip.chemicalId);
  const isTriad = chemical.category === "triad";
  const isNegative = chip.direction === "down";

  // Red for triad overactivation or neglected depletion, green for neglected activation
  const isHarmful = (isTriad && chip.direction === "up") || isNegative;
  const arrows =
    chip.direction === "up"
      ? "↑".repeat(chip.strength)
      : "↓".repeat(chip.strength);

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold
        ${
          isHarmful
            ? "bg-[var(--danger)]/15 text-[var(--danger)]"
            : "bg-[var(--success)]/15 text-[var(--success)]"
        }
      `}
    >
      <span>{arrows}</span>
      <span>{chemical.name.length > 10 ? chemical.name.slice(0, 8) + "." : chemical.name}</span>
    </span>
  );
}

export default function ActivityCard({
  activity,
  rating,
  onRatingChange,
}: ActivityCardProps) {
  return (
    <div
      className={`
        card p-4 sm:p-5 flex flex-col gap-3 w-full h-full
        ${rating > 0 ? "border-[var(--border-light)]" : ""}
      `}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0 mt-0.5">{activity.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-[var(--text)] leading-snug">
            {activity.name}
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">
            {activity.description}
          </p>
        </div>
      </div>

      {/* Impact chips */}
      <div className="flex flex-wrap gap-1.5">
        {activity.impacts.map((chip, i) => (
          <ImpactChipBadge key={i} chip={chip} />
        ))}
      </div>

      {/* Frequency selector */}
      <div className="flex gap-1 mt-auto">
        {FREQUENCY_LABELS.map((label, i) => (
          <button
            key={i}
            onClick={() => onRatingChange(activity.id, i)}
            className={`
              flex-1 py-2 px-1 rounded-lg text-[10px] sm:text-xs font-medium
              transition-all duration-200 cursor-pointer
              ${
                rating === i
                  ? "bg-[var(--gold)] text-[var(--gold-text)] shadow-[0_0_12px_rgba(232,181,90,0.2)]"
                  : "bg-[var(--bg-card-2)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-card-hover)]"
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
