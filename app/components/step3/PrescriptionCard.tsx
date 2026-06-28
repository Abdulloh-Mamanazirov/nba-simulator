"use client";

import type { Prescription } from "@/lib/prescriptions";

interface PrescriptionCardProps {
  prescription: Prescription;
  index: number;
}

export default function PrescriptionCard({
  prescription,
  index,
}: PrescriptionCardProps) {
  return (
    <div
      className="card p-5 sm:p-6 animate-fade-up"
      style={{ animationDelay: `${index * 0.12}s` }}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <span className="text-3xl">{prescription.activityIcon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--gold)]/15 text-[var(--gold)]"
            >
              #{index + 1}
            </span>
            <span className="text-xs font-bold text-[var(--success)]">
              +{prescription.channelGain} channel{prescription.channelGain !== 1 ? "s" : ""}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[var(--text)]">
            {prescription.activityName}
          </h3>
        </div>
      </div>

      {/* Target frequency */}
      <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-[var(--bg-card-2)] border border-[var(--border)]">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">
          Target:
        </span>
        <span className="text-sm font-medium text-[var(--text)]">
          {prescription.targetFrequency}
        </span>
      </div>

      {/* Unlocked chemicals */}
      {prescription.unlockedChemicals.length > 0 && (
        <div className="mb-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)] block mb-2">
            Would unlock:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {prescription.unlockedChemicals.map((chem) => (
              <span
                key={chem.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{
                  color: chem.color,
                  backgroundColor: `color-mix(in srgb, ${chem.color} 12%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${chem.color} 25%, transparent)`,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: chem.color }}
                />
                {chem.plainName}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Personalized sentence */}
      <p className="text-sm font-serif italic text-[var(--text-muted)] leading-relaxed border-l-2 border-[var(--gold)]/30 pl-3">
        {prescription.personalizedSentence}
      </p>
    </div>
  );
}
