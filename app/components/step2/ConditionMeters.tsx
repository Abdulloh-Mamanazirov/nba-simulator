"use client";

import { useEffect, useRef } from "react";

interface ConditionMetersProps {
  slowness: number;
  embodiment: number;
  attention: number;
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
  return (
    <div className="card p-4 sm:p-6">
      <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-2">
        The Three Activating Conditions
      </h2>
      <p className="text-xs text-[var(--text-dim)] mb-6">
        These are what the modern environment most systematically removes.
      </p>

      <div className="flex justify-center gap-6 sm:gap-10">
        <Ring
          value={slowness}
          label="Slowness"
          color="#38D39F"
          delay={0.2}
        />
        <Ring
          value={embodiment}
          label="Embodiment"
          color="#63B3ED"
          delay={0.4}
        />
        <Ring
          value={attention}
          label="Attention"
          color="#7F9CF5"
          delay={0.6}
        />
      </div>
    </div>
  );
}
