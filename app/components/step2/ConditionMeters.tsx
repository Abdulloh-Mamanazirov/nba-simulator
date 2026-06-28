"use client";

interface ConditionMetersProps {
  slowness: number;
  embodiment: number;
  attention: number;
}

function getInsight(label: string, value: number): string {
  if (label === "Slowness") {
    if (value < 20) return "Your week provides almost no genuine deceleration";
    if (value < 45) return "Some rest, but rarely the deep kind";
    if (value < 70) return "Moderate — real stillness is present but inconsistent";
    return "Strong — your week includes genuine slowness";
  }
  if (label === "Embodiment") {
    if (value < 20) return "Very little physical reality in your routine";
    if (value < 45) return "Some movement, but your body is mostly sidelined";
    if (value < 70) return "Moderate — regular physical engagement";
    return "Strong — your body is central to your week";
  }
  // Attention
  if (value < 20) return "Attention is highly fragmented — rarely on one thing";
  if (value < 45) return "Some depth, but fragmentation is dominant";
  if (value < 70) return "Moderate — focused work happens but competes with distraction";
  return "Strong — sustained attention is a regular part of your week";
}

function Ring({
  value,
  label,
  color,
  delay,
}: {
  value: number;
  label: string;
  color: string;
  delay: number;
}) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24 sm:w-28 sm:h-28">
        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 100 100"
        >
          {/* Background ring */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth="6"
          />
          {/* Progress ring */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="animate-ring-fill"
            style={{
              "--ring-circumference": circumference,
              "--ring-offset": offset,
              animationDelay: `${delay}s`,
              filter: `drop-shadow(0 0 6px ${color}40)`,
            } as React.CSSProperties}
          />
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-xl sm:text-2xl font-bold tabular-nums"
            style={{ color }}
          >
            {value}
          </span>
        </div>
      </div>
      <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </span>
    </div>
  );
}

export default function ConditionMeters({
  slowness,
  embodiment,
  attention,
}: ConditionMetersProps) {
  // Find the lowest condition for emphasis
  const conditions = [
    { label: "Slowness", value: slowness, color: "#38D39F" },
    { label: "Embodiment", value: embodiment, color: "#63B3ED" },
    { label: "Attention", value: attention, color: "#7F9CF5" },
  ];
  const lowest = conditions.reduce((a, b) => (a.value < b.value ? a : b));

  return (
    <div className="card p-4 sm:p-6">
      <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-1">
        What Your Week Provides
      </h2>
      <p className="text-xs text-[var(--text-dim)] mb-6 leading-relaxed">
        All nine neglected systems need one of these three conditions to activate.
        Your lowest is <span className="font-semibold text-[var(--text-muted)]">{lowest.label.toLowerCase()}</span>.
      </p>

      <div className="flex justify-center gap-6 sm:gap-10">
        {conditions.map((c, i) => (
          <Ring
            key={c.label}
            value={c.value}
            label={c.label}
            color={c.color}
            delay={0.2 + i * 0.2}
          />
        ))}
      </div>

      {/* Insight for the lowest condition */}
      <p className="text-xs font-serif italic text-[var(--text-muted)] text-center mt-5 leading-relaxed">
        {getInsight(lowest.label, lowest.value)}
      </p>
    </div>
  );
}
