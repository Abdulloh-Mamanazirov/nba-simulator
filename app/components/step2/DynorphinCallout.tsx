"use client";

interface DynorphinCalloutProps {
  dopamineScore: number;
}

export default function DynorphinCallout({
  dopamineScore,
}: DynorphinCalloutProps) {
  if (dopamineScore < 68) return null;

  return (
    <div className="animate-fade-up card p-4 sm:p-6 border-[var(--danger)]/30 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--chem-dopamine), transparent 70%)",
        }}
      />

      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">⚠️</span>
          <h3 className="text-sm font-bold text-[var(--danger)] uppercase tracking-wider">
            Dynorphin Floor Active
          </h3>
        </div>

        <p className="text-sm font-serif text-[var(--text)] leading-relaxed mb-3">
          Your dopamine system is operating above the overdriven threshold.
          At this level, every peak activates its mirror chemical —{" "}
          <strong className="text-[var(--chem-dopamine)]">dynorphin</strong>{" "}
          (kappa-opioid) — which produces dysphoria and motivational
          withdrawal after each reward.
        </p>

        <p className="text-xs font-serif italic text-[var(--text-muted)] leading-relaxed">
          The subjective experience is &ldquo;seeking without arrival&rdquo; — a
          persistent feeling that something is missing, that the next thing
          might be the thing, while the capacity to feel satisfied with what
          you have continues to erode. This is structural anhedonia: not
          depression, but a progressive flattening of ordinary experience.
        </p>

        <div className="mt-3 flex items-center gap-2">
          <div
            className="h-1.5 rounded-full flex-1 overflow-hidden bg-[var(--bg-card-2)]"
          >
            <div
              className="h-full rounded-full animate-tri-pulse"
              style={{
                width: `${dopamineScore}%`,
                background: `linear-gradient(90deg, var(--chem-dopamine), #FF8A65)`,
              }}
            />
          </div>
          <span className="text-xs font-bold text-[var(--chem-dopamine)] tabular-nums">
            {dopamineScore}/100
          </span>
        </div>
      </div>
    </div>
  );
}
