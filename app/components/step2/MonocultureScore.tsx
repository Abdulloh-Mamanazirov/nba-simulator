"use client";

import { useLanguage } from "@/lib/language";
import { getCopy, monocultureLabel, monocultureExplanation } from "@/lib/copy";

interface MonocultureScoreProps {
  index: number;
}

export default function MonocultureScore({ index }: MonocultureScoreProps) {
  const { mode } = useLanguage();
  const copy = getCopy(mode);

  const levelColor =
    index >= 60
      ? "var(--danger)"
      : index >= 40
        ? "var(--chem-dopamine)"
        : index >= 25
          ? "var(--gold)"
          : index >= 10
            ? "var(--success)"
            : "var(--chem-gaba)";
  const level = { label: monocultureLabel(index, mode), color: levelColor };

  return (
    <div className="card p-4 sm:p-6">
      <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-1">
        {copy.monoTitle}
      </h2>
      <p className="text-xs text-[var(--text-dim)] mb-4 leading-relaxed">
        {copy.monoIntro}
      </p>

      <div className="flex items-center gap-4">
        {/* Gauge */}
        <div className="flex-1">
          <div className="relative h-3 rounded-full overflow-hidden"
            style={{
              background: "linear-gradient(90deg, var(--chem-gaba), var(--success), var(--gold), var(--chem-dopamine), var(--danger))",
              opacity: 0.25,
            }}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000"
              style={{
                width: `${index}%`,
                background: `linear-gradient(90deg, var(--chem-gaba), ${level.color})`,
              }}
            />
          </div>

          {/* Marker */}
          <div className="relative h-0 mt-0.5">
            <div
              className="absolute -top-0.5 w-2.5 h-2.5 rounded-full border-2 border-[var(--bg)] transition-all duration-1000"
              style={{
                left: `calc(${index}% - 5px)`,
                backgroundColor: level.color,
                boxShadow: `0 0 8px ${level.color}60`,
              }}
            />
          </div>
        </div>

        {/* Score */}
        <div className="text-right flex-shrink-0">
          <span className="text-2xl font-bold tabular-nums" style={{ color: level.color }}>
            {index}
          </span>
          <span className="text-xs text-[var(--text-muted)]">/100</span>
          <div
            className="text-[10px] font-bold uppercase tracking-wider mt-0.5"
            style={{ color: level.color }}
          >
            {level.label}
          </div>
        </div>
      </div>

      {/* Explanation */}
      <p className="text-xs font-serif italic text-[var(--text-muted)] mt-4 leading-relaxed">
        {monocultureExplanation(index, mode)}
      </p>
    </div>
  );
}
