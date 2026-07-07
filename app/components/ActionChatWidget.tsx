"use client";

import { useEffect, useRef, useState } from "react";
import type { ChemicalScores } from "@/lib/scoring";
import type { OptimizeResult, OptimizeChip, OptimizeConditions } from "@/lib/optimize";
import { MAX_ACTION_LENGTH } from "@/lib/optimize";
import {
  getChatHistory,
  addChatEntry,
  clearChatHistory,
  type ChatEntry,
} from "@/lib/chatHistory";
import { useLanguage, type LanguageMode } from "@/lib/language";
import { getCopy } from "@/lib/copy";

interface ActionChatWidgetProps {
  scores: ChemicalScores;
  conditions: OptimizeConditions;
}

function chipLabel(c: OptimizeChip, mode: LanguageMode) {
  return mode === "plain" ? c.plainName : c.name;
}

function ChipRow({
  label,
  chips,
  mode,
}: {
  label: string;
  chips: OptimizeChip[];
  mode: LanguageMode;
}) {
  if (chips.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-1 mt-1.5">
      <span className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">
        {label}
      </span>
      {chips.map((c) => (
        <span
          key={c.id}
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
          style={{
            color: c.color,
            backgroundColor: `color-mix(in srgb, ${c.color} 12%, transparent)`,
            border: `1px solid color-mix(in srgb, ${c.color} 25%, transparent)`,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color }} />
          {chipLabel(c, mode)}
        </span>
      ))}
    </div>
  );
}

/** The structured optimizer result, rendered inside an assistant bubble. */
function ResultBubble({
  result,
  mode,
  liftsLabel,
  easesLabel,
}: {
  result: OptimizeResult;
  mode: LanguageMode;
  liftsLabel: string;
  easesLabel: string;
}) {
  return (
    <div>
      <div className="flex items-start gap-1.5 mb-1.5">
        <span className="text-[var(--gold)] text-sm leading-5 flex-shrink-0">↳</span>
        <span className="text-sm font-bold text-[var(--text)] leading-snug">
          {result.optimizedAction}
        </span>
      </div>
      {result.steps.length > 0 && (
        <ol className="space-y-1.5 mb-1.5">
          {result.steps.map((step, i) => (
            <li key={i} className="text-[13px] text-[var(--text)] leading-relaxed flex gap-1.5">
              <span className="text-[var(--gold-dim)] font-bold tabular-nums flex-shrink-0">
                {i + 1}.
              </span>
              <span className="flex-1">
                {step.text}
                {step.chemicals.length > 0 && (
                  <span className="inline-flex gap-0.5 ml-1 align-middle">
                    {step.chemicals.map((c) => (
                      <span
                        key={c.id}
                        className="inline-block w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: c.color }}
                        title={chipLabel(c, mode)}
                      />
                    ))}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ol>
      )}
      {result.why && (
        <p className="text-[13px] font-serif italic text-[var(--text-muted)] leading-relaxed">
          {result.why}
        </p>
      )}
      <ChipRow label={liftsLabel} chips={result.boosts} mode={mode} />
      <ChipRow label={easesLabel} chips={result.dampens} mode={mode} />
    </div>
  );
}

export default function ActionChatWidget({ scores, conditions }: ActionChatWidgetProps) {
  const { mode } = useLanguage();
  const copy = getCopy(mode);

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Lazy-init from localStorage. Safe from hydration mismatch because the panel
  // (where entries render) is closed on first paint, so entries aren't in the
  // server-rendered DOM.
  const [entries, setEntries] = useState<ChatEntry[]>(() => getChatHistory());
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep the conversation scrolled to the latest message.
  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries, loading, open]);

  // Escape closes the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    const action = input.trim();
    if (!action || loading) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, mode, scores, conditions }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Try again.");
      } else {
        const entry: ChatEntry = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          action,
          mode,
          result: data.result as OptimizeResult,
          ts: Date.now(),
        };
        setEntries(addChatEntry(entry));
        setInput("");
      }
    } catch {
      setError("Couldn't reach the optimizer. Check your connection and retry.");
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    clearChatHistory();
    setEntries([]);
    setError(null);
  }

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={copy.chatOpen}
        aria-expanded={open}
        className="fixed bottom-4 right-4 z-[60] w-14 h-14 rounded-full flex items-center justify-center
                   bg-[var(--gold)] text-[var(--gold-text)] shadow-[0_6px_24px_rgba(0,0,0,0.28)]
                   hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer"
      >
        <span className="text-2xl leading-none">{open ? "×" : "✨"}</span>
      </button>

      {/* Panel */}
      {open && (
        <div
          className="fixed z-[60] bottom-20 right-4 left-4 sm:left-auto sm:w-[380px]
                     h-[min(70vh,560px)] flex flex-col
                     rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]
                     shadow-[0_16px_48px_rgba(0,0,0,0.4)] animate-fade-up overflow-hidden"
          role="dialog"
          aria-label={copy.optimizerKicker}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-card-2)]">
            <div className="min-w-0">
              <div className="text-sm font-bold text-[var(--text)] flex items-center gap-1.5">
                <span>✨</span>
                {copy.optimizerKicker}
              </div>
              <div className="text-[10px] text-[var(--text-dim)]">{copy.chatSubtitle}</div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {entries.length > 0 && (
                <button
                  onClick={handleClear}
                  className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]
                             hover:text-[var(--text)] px-2 py-1 rounded cursor-pointer"
                >
                  {copy.chatClear}
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--text-muted)]
                           hover:text-[var(--text)] hover:bg-[var(--bg-card-hover)] cursor-pointer"
              >
                ×
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
            {/* Welcome */}
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm px-3 py-2 bg-[var(--bg-card-2)] border border-[var(--border)]">
              <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">
                {copy.chatWelcome}
              </p>
            </div>

            {entries.map((entry) => (
              <div key={entry.id} className="space-y-2">
                {/* User bubble */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-sm px-3 py-2 bg-[var(--gold)] text-[var(--gold-text)]">
                    <p className="text-[13px] font-medium leading-snug break-words">
                      {entry.action}
                    </p>
                  </div>
                </div>
                {/* Assistant bubble */}
                <div className="flex justify-start">
                  <div className="max-w-[92%] rounded-2xl rounded-tl-sm px-3 py-2.5 bg-[var(--bg-card-2)] border border-[var(--border)]">
                    <ResultBubble
                      result={entry.result}
                      mode={entry.mode}
                      liftsLabel={copy.transducerLifts}
                      easesLabel={copy.optimizerEases}
                    />
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-tl-sm px-3 py-2 bg-[var(--bg-card-2)] border border-[var(--border)]">
                  <span className="text-[13px] text-[var(--text-muted)] italic">
                    {copy.optimizerLoading}
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-between gap-2 rounded-xl px-3 py-2 bg-[var(--danger)]/10 border border-[var(--danger)]/25">
                <span className="text-[12px] text-[var(--danger)]">{error}</span>
                <button
                  onClick={() => submit()}
                  className="text-[11px] font-semibold text-[var(--danger)] underline underline-offset-2 cursor-pointer whitespace-nowrap"
                >
                  {copy.optimizerRetry}
                </button>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={submit}
            className="flex items-center gap-2 p-3 border-t border-[var(--border)] bg-[var(--bg-card)]"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={MAX_ACTION_LENGTH}
              placeholder={copy.optimizerPlaceholder}
              aria-label={copy.optimizerKicker}
              className="flex-1 px-3 py-2.5 rounded-xl text-sm min-w-0
                         bg-[var(--bg-card-2)] text-[var(--text)] border border-[var(--border)]
                         placeholder:text-[var(--text-dim)]
                         focus:outline-none focus:border-[var(--gold)] transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label={copy.optimizerButton}
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all
                ${
                  loading || !input.trim()
                    ? "bg-[var(--bg-card-2)] text-[var(--text-dim)] border border-[var(--border)] cursor-not-allowed"
                    : "bg-[var(--gold)] text-[var(--gold-text)] hover:scale-105 active:scale-95 cursor-pointer"
                }`}
            >
              <span className="text-lg leading-none">↑</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
