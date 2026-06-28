"use client";

interface NarrativeSummaryProps {
  narrative: string;
}

export default function NarrativeSummary({ narrative }: NarrativeSummaryProps) {
  return (
    <div className="card p-5 sm:p-8 relative overflow-hidden">
      {/* Subtle background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, var(--gold), transparent 60%)",
        }}
      />

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-px bg-[var(--gold)]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-dim)]">
            Neurochemical Narrative
          </span>
          <div className="flex-1 h-px bg-[var(--gold)]/20" />
        </div>

        <blockquote className="text-base sm:text-lg font-serif leading-relaxed text-[var(--text)] italic">
          {narrative}
        </blockquote>
      </div>
    </div>
  );
}
