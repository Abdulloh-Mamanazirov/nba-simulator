"use client";

import type { ActivityCategory } from "@/lib/activities";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/activities";

interface CategoryTabsProps {
  activeCategory: ActivityCategory | "all";
  onCategoryChange: (category: ActivityCategory | "all") => void;
}

const CATEGORIES: (ActivityCategory | "all")[] = [
  "all",
  "digital",
  "work",
  "body",
  "mind",
  "social",
];

export default function CategoryTabs({
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat;
        const label = cat === "all" ? "All" : CATEGORY_LABELS[cat];
        const icon = cat === "all" ? "⚡" : CATEGORY_ICONS[cat];

        return (
          <button
            key={cat}
            role="tab"
            aria-selected={isActive}
            onClick={() => onCategoryChange(cat)}
            className={`
              flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium
              transition-all duration-250 cursor-pointer
              ${
                isActive
                  ? "bg-[var(--gold)] text-[#060B12] shadow-[0_0_16px_rgba(232,181,90,0.25)]"
                  : "bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border)] hover:border-[var(--border-light)] hover:text-[var(--text)]"
              }
            `}
          >
            <span className="text-base">{icon}</span>
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
