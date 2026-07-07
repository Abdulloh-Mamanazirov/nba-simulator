"use client";

import { useLanguage } from "@/lib/language";

interface DynorphinCalloutProps {
  dopamineScore: number;
}

export default function DynorphinCallout({
  dopamineScore,
}: DynorphinCalloutProps) {
  const { mode } = useLanguage();
  if (dopamineScore < 68) return null;

  const plain = mode === "plain";

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
            {plain ? "The 'Never Enough' Trap" : "Dynorphin Floor Active"}
          </h3>
        </div>

        {plain ? (
          <>
            <p className="text-sm font-serif text-[var(--text)] leading-relaxed mb-3">
              Your{" "}
              <strong className="text-[var(--chem-dopamine)]">reward</strong>{" "}
              chemical (dopamine) is running very high. When it spikes this
              often, your brain pushes back with a downer chemical right after
              each hit — so nothing quite satisfies.
            </p>
            <p className="text-xs font-serif italic text-[var(--text-muted)] leading-relaxed">
              It&apos;s the &ldquo;I&apos;ll feel better after the next
              one&rdquo; feeling — one more scroll, one more snack, one more buy.
              You can chase for hours and still feel like something&apos;s
              missing. It&apos;s not sadness exactly; it&apos;s everything
              feeling a little flat.
            </p>
          </>
        ) : (
          <>
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
          </>
        )}

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
