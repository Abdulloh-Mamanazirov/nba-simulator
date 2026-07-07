"use client";

import type { TransducerPick } from "@/lib/transducers";
import { useLanguage } from "@/lib/language";
import {
  getCopy,
  transducerAnchor,
  transducerUpgrade,
  transducerWhy,
  effortLabel,
} from "@/lib/copy";

interface EverydayUpgradesProps {
  picks: TransducerPick[];
}

/** Three dots, `effort` filled — a quick read on how much lift each one asks. */
function EffortDots({ effort }: { effort: 1 | 2 | 3 }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-1 h-1 rounded-full bg-[var(--text-muted)]"
          style={{ opacity: i <= effort ? 0.9 : 0.25 }}
        />
      ))}
    </span>
  );
}

export default function EverydayUpgrades({ picks }: EverydayUpgradesProps) {
  const { mode } = useLanguage();
  const copy = getCopy(mode);
  if (picks.length === 0) return null;

  return (
    <div className="card p-5 sm:p-8 relative overflow-hidden">
      {/* Subtle wash */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%, var(--success), transparent 60%)",
        }}
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-px bg-[var(--gold)]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-dim)]">
            {copy.transducerKicker}
          </span>
          <div className="flex-1 h-px bg-[var(--gold)]/20" />
        </div>
        <p className="text-xs text-[var(--text-dim)] mb-6 leading-relaxed max-w-2xl">
          {copy.transducerIntro}
        </p>

        {/* Upgrade list */}
        <div className="space-y-3">
          {picks.map(({ transducer: t, lowChemicals }, i) => (
            <div
              key={t.id}
              className="animate-fade-up rounded-xl p-4 sm:p-5 border-l-2 bg-[var(--bg-card-2)] border border-[var(--border)]"
              style={{
                borderLeftColor: "var(--success)",
                animationDelay: `${i * 0.07}s`,
              }}
            >
              {/* Anchor → upgrade */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <div className="text-[11px] text-[var(--text-dim)] mb-0.5">
                    {transducerAnchor(t, mode)}
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[var(--gold)] text-sm leading-6 flex-shrink-0">
                      ↳
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-[var(--text)] leading-snug">
                      {transducerUpgrade(t, mode)}
                    </h3>
                  </div>
                </div>

                {/* Effort */}
                <div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-dim)] hidden sm:inline">
                    {copy.transducerEffort}
                  </span>
                  <span className="text-[10px] font-semibold text-[var(--text-muted)] whitespace-nowrap">
                    {effortLabel(t.effort, mode)}
                  </span>
                  <EffortDots effort={t.effort} />
                </div>
              </div>

              {/* Why */}
              <p className="text-sm font-serif italic text-[var(--text-muted)] leading-relaxed pl-6">
                {transducerWhy(t, mode)}
              </p>

              {/* Lifts (only the systems this user is actually low in) */}
              {lowChemicals.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mt-3 pl-6">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)] mr-0.5">
                    {copy.transducerLifts}
                  </span>
                  {lowChemicals.map((c) => (
                    <span
                      key={c.id}
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold"
                      style={{
                        color: c.color,
                        backgroundColor: `color-mix(in srgb, ${c.color} 12%, transparent)`,
                        border: `1px solid color-mix(in srgb, ${c.color} 25%, transparent)`,
                      }}
                      title={mode === "plain" ? c.name : c.plainName}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: c.color }}
                      />
                      {mode === "plain" ? c.plainName : c.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
