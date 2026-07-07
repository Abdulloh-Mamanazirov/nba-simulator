"use client";

import { useState } from "react";
import type { ActivityCategory } from "@/lib/activities";
import { ACTIVITIES } from "@/lib/activities";
import type { Ratings } from "@/lib/scoring";
import { useLanguage } from "@/lib/language";
import { getCopy, ratedLabel } from "@/lib/copy";
import CategoryTabs from "./CategoryTabs";
import ActivityCard from "./ActivityCard";

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
  const { mode } = useLanguage();
  const copy = getCopy(mode);
  const [category, setCategory] = useState<ActivityCategory | "all">("all");

  const filtered =
    category === "all"
      ? ACTIVITIES
      : ACTIVITIES.filter((a) => a.category === category);

  const ratedCount = Object.values(ratings).filter((v) => v > 0).length;

  return (
    <div className="animate-fade-up">
      {/* Hero */}
      <div className="mb-10 sm:mb-14 max-w-3xl font-serif">
        {mode === "plain" ? (
          <>
            <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-bold text-[var(--text)] leading-[1.15] mb-1">
              Your brain runs on dozens of feel-good chemicals.
            </h2>
            <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-bold text-[var(--text-muted)] leading-[1.15] mb-6">
              Everyday life keeps just three of them busy.
            </h2>

            <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed mb-2">
              Phones, stress, and constant busyness overwork your{" "}
              <span className="font-semibold text-[var(--chem-dopamine)]">reward</span> and{" "}
              <span className="font-semibold text-[var(--chem-cortisol)]">stress</span>{" "}
              chemicals — while the nine that bring real calm, focus, and
              connection barely switch on. Answer a few questions and let&apos;s
              see where you stand.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-bold text-[var(--text)] leading-[1.15] mb-1">
              You run on 100+ neurochemical channels.
            </h2>
            <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-bold text-[var(--text-muted)] leading-[1.15] mb-6">
              Modern life activates approximately three.
            </h2>

            <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed mb-2">
              Late modernity overloads{" "}
              <span className="font-semibold text-[var(--chem-dopamine)]">dopamine</span>,{" "}
              <span className="font-semibold text-[var(--chem-cortisol)]">cortisol</span>, and{" "}
              <span className="font-semibold text-[var(--chem-oxytocin)]">shallow oxytocin</span>{" "}
              while degrading the conditions the remaining nine systems need to activate.
            </p>
          </>
        )}
      </div>

      {/* Category filter */}
      <div className="mb-6">
        <CategoryTabs
          activeCategory={category}
          onCategoryChange={setCategory}
        />
      </div>

      {/* Activity cards grid — 1 col mobile, 2 col default, 3 col on very wide screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-3 gap-4 mb-8">
        {filtered.map((activity, i) => (
          <div
            key={activity.id}
            className="animate-fade-up flex"
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
          {ratedLabel(ratedCount, ACTIVITIES.length, mode)}
        </span>
        <button
          onClick={onNext}
          id="calculate-range-btn"
          className={`
            px-8 py-4 rounded-xl text-base font-semibold
            transition-all duration-300 cursor-pointer
            ${
              ratedCount > 0
                ? "bg-[var(--gold)] text-[var(--gold-text)] shadow-[0_0_30px_rgba(232,181,90,0.3)] hover:shadow-[0_0_40px_rgba(232,181,90,0.5)] hover:scale-[1.02] active:scale-[0.98]"
                : "bg-[var(--bg-card-2)] text-[var(--text-muted)] border border-[var(--border)] cursor-not-allowed"
            }
          `}
          disabled={ratedCount === 0}
        >
          {copy.ctaCalculate}
        </button>
      </div>
    </div>
  );
}
