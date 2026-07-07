"use client";

import { useLanguage } from "@/lib/language";
import { getCopy } from "@/lib/copy";

interface StepIndicatorProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
  maxReachedStep: number;
}

export default function StepIndicator({
  currentStep,
  onStepClick,
  maxReachedStep,
}: StepIndicatorProps) {
  const { mode } = useLanguage();
  const labels = getCopy(mode).stepLabels;
  const STEPS = labels.map((label, i) => ({ num: i + 1, label }));

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {STEPS.map((step, i) => {
        const isActive = currentStep === step.num;
        const isCompleted = currentStep > step.num;
        const isClickable = step.num <= maxReachedStep && onStepClick;

        return (
          <div key={step.num} className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => isClickable && onStepClick(step.num)}
              disabled={!isClickable}
              className={`
                flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium
                transition-all duration-300
                ${
                  isActive
                    ? "bg-[var(--gold)] text-[var(--gold-text)] shadow-[0_0_20px_rgba(232,181,90,0.3)]"
                    : isCompleted
                      ? "bg-[var(--bg-card-2)] text-[var(--gold)] border border-[var(--gold-dim)]"
                      : "bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border)]"
                }
                ${isClickable ? "cursor-pointer hover:brightness-110" : "cursor-default"}
              `}
            >
              <span
                className={`
                  w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold
                  ${
                    isActive
                      ? "bg-[color-mix(in_srgb,var(--gold-text)_20%,transparent)] text-[var(--gold-text)]"
                      : isCompleted
                        ? "bg-[var(--gold-dim)]/20 text-[var(--gold)]"
                        : "bg-[var(--border)] text-[var(--text-muted)]"
                  }
                `}
              >
                {isCompleted ? "✓" : step.num}
              </span>
              <span className="hidden sm:inline">{step.label}</span>
            </button>

            {i < STEPS.length - 1 && (
              <div
                className={`
                  w-6 sm:w-10 h-px transition-colors duration-300
                  ${isCompleted ? "bg-[var(--gold-dim)]" : "bg-[var(--border)]"}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
