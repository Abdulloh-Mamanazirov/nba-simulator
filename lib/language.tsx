"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type LanguageMode = "plain" | "science";

const STORAGE_KEY = "nba-language";

/* A tiny external store over localStorage. Using useSyncExternalStore (rather
 * than useState + useEffect) lets the server and first client render agree on
 * "plain" and then sync to any saved preference after hydration, with no
 * hydration mismatch and no setState-in-effect. */
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function readMode(): LanguageMode {
  try {
    return localStorage.getItem(STORAGE_KEY) === "science" ? "science" : "plain";
  } catch {
    return "plain";
  }
}

function writeMode(m: LanguageMode) {
  try {
    localStorage.setItem(STORAGE_KEY, m);
  } catch {
    // localStorage unavailable — preference just won't persist.
  }
  listeners.forEach((l) => l());
}

interface LanguageContextValue {
  mode: LanguageMode;
  setMode: (m: LanguageMode) => void;
  toggle: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

/**
 * Provides the app-wide language mode, defaulting to "plain" so first-time
 * visitors land in everyday language.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const mode = useSyncExternalStore(
    subscribe,
    readMode,
    (): LanguageMode => "plain"
  );
  const setMode = useCallback((m: LanguageMode) => writeMode(m), []);
  const toggle = useCallback(
    () => writeMode(readMode() === "plain" ? "science" : "plain"),
    []
  );

  return (
    <LanguageContext.Provider value={{ mode, setMode, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  // Fall back to plain so a component still renders if used outside a provider.
  if (!ctx) return { mode: "plain", setMode: () => {}, toggle: () => {} };
  return ctx;
}
