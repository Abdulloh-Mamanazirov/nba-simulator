"use client";

import { useState } from "react";
import { CHEMICALS } from "@/lib/chemicals";
import type { ChemicalScores } from "@/lib/scoring";

interface ChemicalAccordionProps {
  scores: ChemicalScores;
}

export default function ChemicalAccordion({ scores }: ChemicalAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden transition-all duration-250">
      {/* Toggle header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-5 flex items-center justify-between cursor-pointer
                   hover:bg-[var(--bg-card-hover)] transition-colors"
      >
        <div>
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)] text-left">
            Explore All 12 Chemical Systems
          </h2>
          <p className="text-[10px] text-[var(--text-dim)] mt-0.5 text-left">
            Detailed breakdown of each neurochemical system
          </p>
        </div>
        <span
          className={`text-[var(--text-muted)] transition-transform duration-300 text-lg ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>

      {/* Collapsible content */}
      {isOpen && (
        <div className="border-t border-[var(--border)] animate-slide-in divide-y divide-[var(--border)]">
          {CHEMICALS.map((chem) => {
            const score = scores[chem.id] ?? 0;
            const isExpanded = expanded === chem.id;
            const isTriad = chem.category === "triad";
            const isOverdriven = isTriad && score >= chem.dangerThreshold;
            const isStarving = !isTriad && score < chem.starvationThreshold;

            return (
              <div key={chem.id}>
                <button
                  onClick={() =>
                    setExpanded(isExpanded ? null : chem.id)
                  }
                  className="w-full flex items-center gap-3 px-4 sm:px-5 py-3.5 
                             hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer text-left"
                >
                  {/* Color dot */}
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: chem.color }}
                  />

                  {/* Name and plain name */}
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-[var(--text)] block sm:inline">
                      {chem.name}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] block sm:inline sm:ml-2">
                      {chem.plainName}
                    </span>
                  </div>

                  {/* Score bar */}
                  <div className="hidden sm:block w-20 sm:w-28 h-1.5 bg-[var(--bg-card-2)] rounded-full overflow-hidden flex-shrink-0">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${score}%`,
                        backgroundColor: chem.color,
                      }}
                    />
                  </div>

                  {/* Score number */}
                  <span
                    className="text-sm font-bold tabular-nums w-8 text-right flex-shrink-0"
                    style={{ color: chem.color }}
                  >
                    {score}
                  </span>

                  {/* Status */}
                  {(isOverdriven || isStarving) && (
                    <span
                      className={`hidden sm:inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded flex-shrink-0 ${
                        isOverdriven
                          ? "text-[var(--danger)] bg-[var(--danger)]/10"
                          : "text-[var(--gold)] bg-[var(--gold)]/10"
                      }`}
                    >
                      {isOverdriven ? "HIGH" : "LOW"}
                    </span>
                  )}

                  {/* Expand arrow */}
                  <span
                    className={`text-[var(--text-muted)] transition-transform duration-200 flex-shrink-0 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  >
                    ▾
                  </span>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-4 animate-slide-in">
                    <div className="pl-5 border-l-2 ml-0.5" style={{ borderColor: chem.color }}>
                      <p className="text-sm font-serif text-[var(--text)] leading-relaxed mb-2">
                        {chem.description}
                      </p>
                      <p className="text-xs font-serif italic text-[var(--text-muted)] leading-relaxed">
                        {chem.scientificDetail}
                      </p>
                      {chem.conditions.length > 0 && (
                        <div className="mt-2 flex gap-1">
                          {chem.conditions.map((cond) => (
                            <span
                              key={cond}
                              className="text-[9px] font-medium px-2 py-0.5 rounded bg-[var(--bg-card-2)] text-[var(--text-muted)]"
                            >
                              {cond.charAt(0).toUpperCase() + cond.slice(1)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
