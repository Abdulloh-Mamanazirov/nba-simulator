import type { ChemicalScores, Ratings } from "./scoring";

export interface AuditResult {
  date: string;
  ratings: Ratings;
  chemicalScores: ChemicalScores;
  bandwidth: number;
}

const STORAGE_KEY = "neurochemical-audit-history";

export function saveResult(result: AuditResult): void {
  if (typeof window === "undefined") return;

  try {
    const history = getHistory();
    history.push(result);
    // Keep last 50 results
    const trimmed = history.slice(-50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage unavailable or full
    console.warn("Could not save audit result to localStorage");
  }
}

export function getHistory(): AuditResult[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AuditResult[];
  } catch {
    return [];
  }
}

export function getLatestResult(): AuditResult | null {
  const history = getHistory();
  return history.length > 0 ? history[history.length - 1] : null;
}
