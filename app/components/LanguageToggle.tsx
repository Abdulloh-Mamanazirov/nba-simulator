"use client";

import { useLanguage } from "@/lib/language";

export default function LanguageToggle() {
  const { mode, toggle } = useLanguage();
  const isPlain = mode === "plain";

  return (
    <button
      onClick={toggle}
      id="language-toggle"
      aria-label={`Switch to ${isPlain ? "scientific" : "plain"} language`}
      title={
        isPlain
          ? "Plain language — tap for the scientific version"
          : "Scientific language — tap for plain English"
      }
      className="flex items-center gap-1.5 h-10 px-2.5 sm:px-3 rounded-full
                 border border-[var(--border)] bg-[var(--bg-card)]
                 text-[var(--text-muted)] hover:text-[var(--text)]
                 hover:border-[var(--border-light)] hover:bg-[var(--bg-card-hover)]
                 transition-all duration-300 cursor-pointer"
    >
      <span className="text-base leading-none">{isPlain ? "💬" : "🧪"}</span>
      <span className="hidden sm:inline text-xs font-semibold tracking-wide">
        {isPlain ? "Plain" : "Science"}
      </span>
    </button>
  );
}
