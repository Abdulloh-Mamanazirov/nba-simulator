"use client";

import { useState } from "react";
import type { ChemicalScores } from "@/lib/scoring";
import type {
  OptimizeResult,
  OptimizeChip,
  OptimizeConditions,
} from "@/lib/optimize";
import { MAX_ACTION_LENGTH } from "@/lib/optimize";
import { useLanguage } from "@/lib/language";
import { getCopy } from "@/lib/copy";

interface ActionOptimizerProps {
  scores: ChemicalScores;
  conditions: OptimizeConditions;
}

function ChipRow({
  label,
  chips,
  mode,
}: {
  label: string;
  chips: OptimizeChip[];
  mode: "plain" | "science";
}) {
  if (chips.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)] mr-0.5">
        {label}
      </span>
      {chips.map((c) => (
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
  );
}

export default function ActionOptimizer({
  scores,
  conditions,
}: ActionOptimizerProps) {
  const { mode } = useLanguage();
  const copy = getCopy(mode);

  const [action, setAction] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OptimizeResult | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = action.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: trimmed, mode, scores, conditions }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Try again.");
      } else {
        setResult(data.result as OptimizeResult);
      }
    } catch {
      setError("Couldn't reach the optimizer. Check your connection and retry.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-5 sm:p-8 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 80% 0%, var(--gold), transparent 60%)",
        }}
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-px bg-[var(--gold)]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-dim)]">
            ✨ {copy.optimizerKicker}
          </span>
          <div className="flex-1 h-px bg-[var(--gold)]/20" />
        </div>
        <p className="text-xs text-[var(--text-dim)] mb-4 leading-relaxed max-w-2xl">
          {copy.optimizerIntro}
        </p>

        {/* Input */}
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={action}
            onChange={(e) => setAction(e.target.value)}
            maxLength={MAX_ACTION_LENGTH}
            placeholder={copy.optimizerPlaceholder}
            aria-label={copy.optimizerKicker}
            className="flex-1 px-4 py-3 rounded-xl text-sm
                       bg-[var(--bg-card-2)] text-[var(--text)] border border-[var(--border)]
                       placeholder:text-[var(--text-dim)]
                       focus:outline-none focus:border-[var(--gold)] transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !action.trim()}
            className={`px-6 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300
              ${
                loading || !action.trim()
                  ? "bg-[var(--bg-card-2)] text-[var(--text-muted)] border border-[var(--border)] cursor-not-allowed"
                  : "bg-[var(--gold)] text-[var(--gold-text)] shadow-[0_0_24px_rgba(232,181,90,0.25)] hover:shadow-[0_0_36px_rgba(232,181,90,0.4)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              }`}
          >
            {loading ? copy.optimizerLoading : copy.optimizerButton}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-xl px-4 py-3 bg-[var(--danger)]/10 border border-[var(--danger)]/25">
            <span className="text-sm text-[var(--danger)]">{error}</span>
            <button
              onClick={submit}
              className="text-xs font-semibold text-[var(--danger)] underline underline-offset-2 cursor-pointer whitespace-nowrap"
            >
              {copy.optimizerRetry}
            </button>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-5 animate-fade-up rounded-xl p-4 sm:p-5 border-l-2 bg-[var(--bg-card-2)] border border-[var(--border)] border-l-[var(--gold)]">
            <div className="text-[11px] text-[var(--text-dim)] mb-1">
              &ldquo;{result.action}&rdquo;
            </div>
            <div className="flex items-start gap-2 mb-3">
              <span className="text-[var(--gold)] text-sm leading-6 flex-shrink-0">
                ↳
              </span>
              <h3 className="text-sm sm:text-base font-bold text-[var(--text)] leading-snug">
                {result.optimizedAction}
              </h3>
            </div>

            {result.steps.length > 0 && (
              <ol className="space-y-2.5 mb-3 pl-6">
                {result.steps.map((step, i) => (
                  <li key={i} className="text-sm text-[var(--text)] leading-relaxed">
                    <div className="flex gap-2">
                      <span className="text-[var(--gold-dim)] font-bold tabular-nums flex-shrink-0">
                        {i + 1}.
                      </span>
                      <div className="flex-1">
                        <span>{step.text}</span>
                        {step.chemicals.length > 0 && (
                          <span className="inline-flex flex-wrap gap-1 ml-1 align-middle">
                            {step.chemicals.map((c) => (
                              <span
                                key={c.id}
                                className="inline-block w-2 h-2 rounded-full"
                                style={{ backgroundColor: c.color }}
                                title={mode === "plain" ? c.plainName : c.name}
                              />
                            ))}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            )}

            {result.why && (
              <p className="text-sm font-serif italic text-[var(--text-muted)] leading-relaxed pl-6 mb-3">
                {result.why}
              </p>
            )}

            <div className="flex flex-col gap-2 pl-6">
              <ChipRow label={copy.transducerLifts} chips={result.boosts} mode={mode} />
              <ChipRow label={copy.optimizerEases} chips={result.dampens} mode={mode} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
