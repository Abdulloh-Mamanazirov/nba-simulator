"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("nba-theme") as "dark" | "light" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("nba-theme", next);
  };

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
      <span className="text-lg">
        {theme === "dark" ? "☀️" : "🌙"}
      </span>
    </button>
  );
}
