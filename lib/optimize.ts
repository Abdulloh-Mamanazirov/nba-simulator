import {
  CHEMICALS,
  NEGLECTED_CHEMICALS,
  TRIAD_CHEMICALS,
  getChemical,
} from "./chemicals";
import type { ChemicalScores } from "./scoring";
import type { LanguageMode } from "./language";

/* ---- Wire types (client ⇄ /api/optimize) ---- */

export interface OptimizeConditions {
  slowness: number;
  embodiment: number;
  attention: number;
}

export interface OptimizeChip {
  id: string;
  name: string;
  plainName: string;
  color: string;
}

export interface OptimizeStep {
  text: string;
  chemicals: OptimizeChip[];
}

/** Enriched result the client renders. */
export interface OptimizeResult {
  action: string;
  optimizedAction: string;
  steps: OptimizeStep[];
  why: string;
  boosts: OptimizeChip[];
  dampens: OptimizeChip[];
}

/** Raw JSON shape we ask Gemini for (chemical ids, not enriched). */
export interface OptimizeRaw {
  optimizedAction: string;
  steps: { text: string; chemicals?: string[] }[];
  why: string;
  boosts: string[];
  dampens?: string[];
}

export const MAX_ACTION_LENGTH = 160;

/** JSON schema handed to Gemini's structured-output mode. */
export const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    optimizedAction: { type: "string" },
    steps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          text: { type: "string" },
          chemicals: { type: "array", items: { type: "string" } },
        },
        required: ["text"],
      },
    },
    why: { type: "string" },
    boosts: { type: "array", items: { type: "string" } },
    dampens: { type: "array", items: { type: "string" } },
  },
  required: ["optimizedAction", "steps", "why", "boosts"],
} as const;

const VALID_IDS = new Set(CHEMICALS.map((c) => c.id));

function chip(id: string): OptimizeChip | null {
  if (!VALID_IDS.has(id)) return null;
  const c = getChemical(id);
  return { id: c.id, name: c.name, plainName: c.plainName, color: c.color };
}

function chips(ids: string[] | undefined): OptimizeChip[] {
  if (!ids) return [];
  const seen = new Set<string>();
  const out: OptimizeChip[] = [];
  for (const id of ids) {
    if (seen.has(id)) continue;
    const c = chip(id);
    if (c) {
      seen.add(id);
      out.push(c);
    }
  }
  return out;
}

/** Turn Gemini's raw id-based result into enriched chips for rendering. */
export function enrichResult(action: string, raw: OptimizeRaw): OptimizeResult {
  return {
    action,
    optimizedAction: raw.optimizedAction,
    steps: (raw.steps ?? []).map((s) => ({
      text: s.text,
      chemicals: chips(s.chemicals),
    })),
    why: raw.why,
    boosts: chips(raw.boosts),
    dampens: chips(raw.dampens),
  };
}

/**
 * Build a grounded prompt: the fixed 12-chemical framework, this user's actual
 * deficits, and the action to optimize — instructing Gemini to answer inside
 * the model, in the requested voice, using only known chemical ids.
 */
export function buildPrompt(
  action: string,
  mode: LanguageMode,
  scores: ChemicalScores,
  conditions: OptimizeConditions
): string {
  const framework = CHEMICALS.map((c) => {
    const kind = c.category === "triad" ? "OVERWORKED" : "neglected";
    const needs = c.conditions.length ? ` — needs ${c.conditions.join("/")}` : "";
    return `  ${c.id} = "${c.plainName}" (${c.name}), ${kind}${needs}`;
  }).join("\n");

  const low = NEGLECTED_CHEMICALS.map((c) => ({ c, score: scores[c.id] ?? 0 }))
    .filter(({ c, score }) => score < c.dangerThreshold)
    .sort((a, b) => a.score - b.score)
    .slice(0, 6)
    .map(({ c, score }) => `${c.id} (${c.plainName}) at ${score}/100`)
    .join(", ");

  const over = TRIAD_CHEMICALS.filter(
    (c) => (scores[c.id] ?? 0) >= c.dangerThreshold
  )
    .map((c) => `${c.id} (${c.plainName}) at ${scores[c.id] ?? 0}/100`)
    .join(", ");

  const weakestCondition = Object.entries(conditions).sort(
    ([, a], [, b]) => a - b
  )[0][0];

  const voice =
    mode === "plain"
      ? `Write in plain, warm, everyday English. NO scientific jargon in the visible text — a curious teenager should understand it. Refer to systems by their plain names (e.g. "Deep Rest", "Flow State"), not their scientific names.`
      : `Write in precise, clinical language. You may use the scientific chemical names.`;

  return `You are the reasoning engine inside a neurochemical self-audit app. The app models human wellbeing as 12 systems (3 OVERWORKED by modern life, 9 neglected):

${framework}

The user wants to take this ordinary action and do it in a way that improves their neurochemical activity — WITHOUT turning it into a different activity. Keep it realistically the same action, just upgraded.

ACTION: "${action}"

THIS USER'S PROFILE (personalize to it — prioritise lifting their most depleted systems):
- Most depleted (lift these first): ${low || "none strongly depleted"}
- Overdriven / needs cooling: ${over || "none overdriven"}
- Weakest activating condition: ${weakestCondition}

${voice}

Return JSON only:
- optimizedAction: one short line naming the upgraded version of the action.
- steps: 2 to 4 concrete, doable tweaks. Each has "text" (imperative, one sentence) and "chemicals" (array of the affected system ids from the list above).
- why: 1–2 sentences on how these tweaks shift the user's neurochemistry, referencing their depleted systems.
- boosts: array of system ids this upgrade lifts (only ids from the list).
- dampens: array of OVERWORKED system ids it cools (only ids from the list), or empty.

If the action is unsafe, impossible, or not a real action, set optimizedAction to a brief note saying so and return empty steps/boosts. Use ONLY the exact ids listed above in every id field.`;
}
