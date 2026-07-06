"use client";

import type {
  PossibleOutcome,
  OutcomeTone,
  OutcomeLikelihood,
} from "@/lib/outcomes";

interface PossibleOutcomesProps {
  outcomes: PossibleOutcome[];
}

function toneColor(tone: OutcomeTone): string {
  if (tone === "risk") return "var(--danger)";
  if (tone === "positive") return "var(--success)";
  return "var(--text-muted)";
}

const LIKELIHOOD_LABEL: Record<OutcomeLikelihood, string> = {
  possible: "Possible",
  elevated: "Elevated",
  likely: "Likely",
};

/** Filled-dot strength indicator: possible = 1, elevated = 2, likely = 3. */
function LikelihoodPill({
  likelihood,
  color,
}: {
  likelihood: OutcomeLikelihood;
  color: string;
}) {
  const filled =
    likelihood === "likely" ? 3 : likelihood === "elevated" ? 2 : 1;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap"
      style={{
        color,
        backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
      }}
    >
      <span className="flex gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1 h-1 rounded-full"
            style={{
              backgroundColor: color,
              opacity: i < filled ? 1 : 0.25,
            }}
          />
        ))}
      </span>
      {LIKELIHOOD_LABEL[likelihood]}
    </span>
  );
}

export default function PossibleOutcomes({ outcomes }: PossibleOutcomesProps) {
  if (outcomes.length === 0) return null;

  return (
    <div className="card p-5 sm:p-8 relative overflow-hidden">
      {/* Subtle background wash */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 70% 0%, var(--gold), transparent 60%)",
        }}
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-px bg-[var(--gold)]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-dim)]">
            Possible Outcomes
          </span>
          <div className="flex-1 h-px bg-[var(--gold)]/20" />
        </div>
        <p className="text-xs text-[var(--text-dim)] mb-6 leading-relaxed max-w-2xl">
          How a profile like yours <span className="italic">tends</span> to feel and
          play out. These are pattern-based possibilities — not predictions, not a
          diagnosis. You may recognise some and not others.
        </p>

        {/* Outcome list */}
        <div className="space-y-3">
          {outcomes.map((outcome, i) => {
            const color = toneColor(outcome.tone);
            return (
              <div
                key={outcome.id}
                className="animate-fade-up rounded-xl p-4 sm:p-5 border-l-2 bg-[var(--bg-card-2)] border border-[var(--border)]"
                style={{
                  borderLeftColor: color,
                  animationDelay: `${i * 0.08}s`,
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-sm sm:text-base font-bold text-[var(--text)] leading-snug">
                    {outcome.title}
                  </h3>
                  <LikelihoodPill
                    likelihood={outcome.likelihood}
                    color={color}
                  />
                </div>

                <p className="text-sm font-serif text-[var(--text-muted)] leading-relaxed">
                  {outcome.body}
                </p>

                {outcome.drivers.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)] mr-0.5">
                      Driven by:
                    </span>
                    {outcome.drivers.map((d) => (
                      <span
                        key={d.id}
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold"
                        style={{
                          color: d.color,
                          backgroundColor: `color-mix(in srgb, ${d.color} 12%, transparent)`,
                          border: `1px solid color-mix(in srgb, ${d.color} 25%, transparent)`,
                        }}
                        title={d.name}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: d.color }}
                        />
                        {d.plainName}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer disclaimer */}
        <p className="text-[11px] font-serif italic text-[var(--text-dim)] leading-relaxed mt-5 pt-4 border-t border-[var(--border)]">
          Neurochemistry is one input among many — sleep, genetics, life
          circumstance and more all shape lived experience. Treat this as a
          mirror to think with, not a verdict.
        </p>
      </div>
    </div>
  );
}
