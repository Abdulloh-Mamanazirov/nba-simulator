"use client";

import { useState } from "react";
import { CHEMICALS } from "@/lib/chemicals";
import { CHEMICAL_INTERACTIONS as INTERACTIONS } from "@/lib/interactions";
import type { ChemicalScores } from "@/lib/scoring";
import { useLanguage } from "@/lib/language";
import { getCopy, chemPrimary, interactionText } from "@/lib/copy";

interface ChemicalInteractionMapProps {
  scores: ChemicalScores;
}

export default function ChemicalInteractionMap({
  scores,
}: ChemicalInteractionMapProps) {
  const { mode } = useLanguage();
  const copy = getCopy(mode);
  const [hoveredChem, setHoveredChem] = useState<string | null>(null);

  // Position chemicals in a circle
  const size = 360;
  const center = size / 2;
  const radius = 140;

  const positions = CHEMICALS.map((chem, i) => {
    const angle = (i / CHEMICALS.length) * 2 * Math.PI - Math.PI / 2;
    return {
      id: chem.id,
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
      chemical: chem,
    };
  });

  const getPos = (id: string) => positions.find((p) => p.id === id)!;

  const relevantInteractions = hoveredChem
    ? INTERACTIONS.filter(
        (int) => int.from === hoveredChem || int.to === hoveredChem
      )
    : INTERACTIONS;

  return (
    <div className="card p-4 sm:p-6">
      <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-1">
        {copy.mapTitle}
      </h2>
      <p className="text-xs text-[var(--text-dim)] mb-4">
        {copy.mapIntro}
      </p>

      <div className="flex justify-center overflow-x-auto">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full max-w-[360px]"
        >
          {/* Interaction lines */}
          {relevantInteractions.map((int, i) => {
            const from = getPos(int.from);
            const to = getPos(int.to);
            const isHighlighted =
              !hoveredChem ||
              int.from === hoveredChem ||
              int.to === hoveredChem;

            return (
              <g key={i}>
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={
                    int.type === "suppresses"
                      ? "var(--danger)"
                      : "var(--success)"
                  }
                  strokeWidth={isHighlighted ? 1.5 : 0.5}
                  strokeDasharray={int.type === "suppresses" ? "4,3" : "none"}
                  opacity={isHighlighted ? 0.7 : 0.15}
                />
                {/* Arrow/indicator at midpoint */}
                <circle
                  cx={(from.x + to.x) / 2}
                  cy={(from.y + to.y) / 2}
                  r={isHighlighted ? 3 : 2}
                  fill={
                    int.type === "suppresses"
                      ? "var(--danger)"
                      : "var(--success)"
                  }
                  opacity={isHighlighted ? 0.8 : 0.2}
                />
              </g>
            );
          })}

          {/* Chemical nodes */}
          {positions.map((pos) => {
            const score = scores[pos.id] ?? 0;
            const nodeRadius = 14 + (score / 100) * 8;
            const isHovered = hoveredChem === pos.id;
            const isConnected =
              hoveredChem &&
              INTERACTIONS.some(
                (int) =>
                  (int.from === hoveredChem && int.to === pos.id) ||
                  (int.to === hoveredChem && int.from === pos.id)
              );
            const dimmed = hoveredChem && !isHovered && !isConnected;

            return (
              <g
                key={pos.id}
                onMouseEnter={() => setHoveredChem(pos.id)}
                onMouseLeave={() => setHoveredChem(null)}
                className="cursor-pointer"
                opacity={dimmed ? 0.25 : 1}
              >
                {/* Glow */}
                {isHovered && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={nodeRadius + 6}
                    fill={pos.chemical.color}
                    opacity={0.15}
                  />
                )}
                {/* Node */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={nodeRadius}
                  fill={pos.chemical.color}
                  opacity={0.85}
                  stroke={isHovered ? pos.chemical.color : "transparent"}
                  strokeWidth={2}
                />
                {/* Score */}
                <text
                  x={pos.x}
                  y={pos.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="8"
                  fontWeight="700"
                  fontFamily="Inter, sans-serif"
                >
                  {score}
                </text>
                {/* Label */}
                <text
                  x={pos.x}
                  y={pos.y + nodeRadius + 11}
                  textAnchor="middle"
                  fill="var(--text-muted)"
                  fontSize="7"
                  fontFamily="Inter, sans-serif"
                  fontWeight="500"
                >
                  {(() => {
                    const label = chemPrimary(pos.chemical, mode);
                    return label.length > 10 ? label.slice(0, 8) + "." : label;
                  })()}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-px bg-[var(--danger)]" />
          <span className="text-[10px] text-[var(--text-muted)]">{copy.legendSuppresses}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-px bg-[var(--success)]" />
          <span className="text-[10px] text-[var(--text-muted)]">{copy.legendSupports}</span>
        </div>
      </div>

      {/* Hovered interaction details */}
      {hoveredChem && (
        <div className="mt-3 space-y-1">
          {INTERACTIONS.filter(
            (int) => int.from === hoveredChem || int.to === hoveredChem
          ).map((int, i) => (
            <p key={i} className="text-[10px] text-[var(--text-muted)] leading-relaxed">
              <span
                className="font-semibold"
                style={{
                  color: int.type === "suppresses" ? "var(--danger)" : "var(--success)",
                }}
              >
                {int.type === "suppresses" ? "⊘" : "⊕"}
              </span>{" "}
              {interactionText(int, mode)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
