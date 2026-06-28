"use client";

import { useState } from "react";
import type { ActivityCategory } from "@/lib/activities";
import { ACTIVITIES } from "@/lib/activities";
import type { Ratings } from "@/lib/scoring";
import CategoryTabs from "./CategoryTabs";
import ActivityCard from "./ActivityCard";
import MiniSpectrum from "./MiniSpectrum";

interface RateYourWeekProps {
  ratings: Ratings;
  onRatingChange: (activityId: string, rating: number) => void;
  onNext: () => void;
}

export default function RateYourWeek({
  ratings,
  onRatingChange,
  onNext,
}: RateYourWeekProps) {
  const [category, setCategory] = useState<ActivityCategory | "all">("all");

  const filtered =
    category === "all"
      ? ACTIVITIES
      : ACTIVITIES.filter((a) => a.category === category);

  const ratedCount = Object.values(ratings).filter((v) => v > 0).length;
  const allRated = ratedCount >= ACTIVITIES.length;

  return (
    <div className="animate-fade-up">
      {/* Thesis statement */}
      <div className="text-center mb-8 sm:mb-12 max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-[var(--text)] leading-tight mb-4 sm:mb-6">
          Neurochemical Bandwidth Audit
        </h1>
        <blockquote className="text-base sm:text-lg lg:text-xl font-serif italic text-[var(--text-muted)] leading-relaxed border-l-2 border-[var(--gold)] pl-4 sm:pl-6 text-left">
          &ldquo;The central failure of late modernity may be less an excess of
          stimulation than a systematic impoverishment of inhabitable
          range.&rdquo;
        </blockquote>
        <p className="mt-4 sm:mt-6 text-sm sm:text-base text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
          Your brain runs on 100+ neurochemical signaling systems. Modern life
          overloads three of them while starving the rest. Rate your typical
          week below to see which channels are active — and which have gone
          silent.
        </p>
      </div>

      {/* Mini spectrum preview */}
      <div className="mb-6 sm:mb-8 sticky top-16 z-30 sm:static">
        <MiniSpectrum ratings={ratings} />
      </div>

      {/* Category filter */}
      <div className="mb-6">
        <CategoryTabs
          activeCategory={category}
          onCategoryChange={setCategory}
        />
      </div>

      {/* Activity cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {filtered.map((activity, i) => (
          <div
            key={activity.id}
            className="animate-fade-up"
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            <ActivityCard
              activity={activity}
              rating={ratings[activity.id] ?? 0}
              onRatingChange={onRatingChange}
            />
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="flex flex-col items-center gap-3 pt-4 pb-8">
        <span className="text-xs text-[var(--text-muted)]">
          {ratedCount} / {ACTIVITIES.length} activities rated
        </span>
        <button
          onClick={onNext}
          id="calculate-range-btn"
          className={`
            px-8 py-4 rounded-xl text-base font-semibold
            transition-all duration-300 cursor-pointer
            ${
              ratedCount > 0
                ? "bg-[var(--gold)] text-[#060B12] shadow-[0_0_30px_rgba(232,181,90,0.3)] hover:shadow-[0_0_40px_rgba(232,181,90,0.5)] hover:scale-[1.02] active:scale-[0.98]"
                : "bg-[var(--bg-card-2)] text-[var(--text-muted)] border border-[var(--border)] cursor-not-allowed"
            }
          `}
          disabled={ratedCount === 0}
        >
          Calculate My Range →
        </button>
      </div>
    </div>
  );
}
