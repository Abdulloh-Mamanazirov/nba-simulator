"use client";

interface MonocultureScoreProps {
  index: number;
}

function getExplanation(index: number): string {
  if (index >= 60)
    return "Almost all your neurochemical activity is concentrated in a few systems. The rest are functionally silent.";
  if (index >= 40)
    return "Your range is narrow — a few systems dominate while many others sit idle.";
  if (index >= 25)
    return "Some concentration is present, but activity is starting to spread across systems.";
  if (index >= 10)
    return "Your neurochemical activity is reasonably distributed across multiple systems.";
  return "Activity is well-spread — you're using a broad range of your available neurochemistry.";
}

export default function MonocultureScore({ index }: MonocultureScoreProps) {
  const getLevel = () => {
    if (index >= 60) return { label: "Severe", color: "var(--danger)" };
    if (index >= 40) return { label: "High", color: "var(--chem-dopamine)" };
    if (index >= 25) return { label: "Moderate", color: "var(--gold)" };
    if (index >= 10) return { label: "Low", color: "var(--success)" };
    return { label: "Minimal", color: "var(--chem-gaba)" };
  };

  const level = getLevel();

  return (
    <div className="card p-4 sm:p-6">
      <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-1">
        Range Concentration
      </h2>
      <p className="text-xs text-[var(--text-dim)] mb-4 leading-relaxed">
        Are you running on many systems or just a few? Higher = more concentrated (worse).
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
        {getExplanation(index)}
      </p>
    </div>
  );
}
