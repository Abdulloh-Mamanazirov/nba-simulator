"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

type Theme = "dark" | "light";

const STORAGE_KEY = "nba-theme";

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

// Light is the rendered default (see layout.tsx), so the server snapshot and
// this both default to "light" — keeping the toggle in sync with the DOM.
function readTheme(): Theme {
  try {
    return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function writeTheme(t: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, t);
  } catch {
    // localStorage unavailable — preference just won't persist.
  }
  listeners.forEach((l) => l());
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribe,
    readTheme,
    (): Theme => "light"
  );

  // Keep the document's data-theme attribute in sync with the stored theme.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggle = useCallback(
    () => writeTheme(readTheme() === "dark" ? "light" : "dark"),
    []
  );

  return (
    <button
      onClick={toggle}
      id="theme-toggle"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="relative w-10 h-10 rounded-full flex items-center justify-center
                 border border-[var(--border)] bg-[var(--bg-card)]
                 hover:border-[var(--border-light)] hover:bg-[var(--bg-card-hover)]
                 transition-all duration-300 cursor-pointer"
    >
      <span className="text-lg">{theme === "dark" ? "☀️" : "🌙"}</span>
    </button>
  );
}
