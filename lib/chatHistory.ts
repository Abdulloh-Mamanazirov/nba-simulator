import type { OptimizeResult } from "./optimize";
import type { LanguageMode } from "./language";

export interface ChatEntry {
  id: string;
  action: string;
  /** Voice the result was generated in — used to render it consistently. */
  mode: LanguageMode;
  result: OptimizeResult;
  ts: number;
}

const STORAGE_KEY = "nba-optimizer-history";
const MAX_ENTRIES = 40;

export function getChatHistory(): ChatEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ChatEntry[]) : [];
  } catch {
    return [];
  }
}

/** Append an entry and persist, keeping the most recent MAX_ENTRIES. */
export function addChatEntry(entry: ChatEntry): ChatEntry[] {
  const next = [...getChatHistory(), entry].slice(-MAX_ENTRIES);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage full/unavailable — keep the in-memory list regardless
  }
  return next;
}

export function clearChatHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
