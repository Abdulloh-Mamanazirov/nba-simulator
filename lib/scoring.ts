import {
  CHEMICALS,
  NEGLECTED_CHEMICALS,
  getChemical,
  type Chemical,
} from "./chemicals";
import { ACTIVITIES } from "./activities";
import { CHEMICAL_INTERACTIONS } from "./interactions";
import type { LanguageMode } from "./language";

export type Ratings = Record<string, number>;
export type ChemicalScores = Record<string, number>;

const clamp = (v: number) => Math.max(0, Math.min(100, v));
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/**
 * First pass: each chemical from the user's activities alone.
 * Formula: chemical_score = base + Σ((activity_rating / 4) × weight)
 * Clamped to 0–100 (not yet rounded — the second pass rounds).
 */
function calculateBaseScores(ratings: Ratings): ChemicalScores {
  const scores: ChemicalScores = {};

  for (const chemical of CHEMICALS) {
    let score = chemical.baseScore;

    for (const activity of ACTIVITIES) {
      const rating = ratings[activity.id] ?? 0;
      const weight = activity.weights[chemical.id] ?? 0;

      if (weight !== 0 && rating > 0) {
        score += (rating / 4) * weight;
      }
    }

    scores[chemical.id] = clamp(score);
  }

  return scores;
}

/**
 * Second pass: apply cross-chemical interactions (the Chemical Interaction Map).
 * A source chemical modulates its targets based on how activated it is:
 *  - "suppresses" scales with how far the source is above its danger threshold
 *    (chronic overdrive — e.g. sustained cortisol crushing GABA / recovery systems).
 *  - "supports" scales with how far the source is above its starvation threshold
 *    (an active system lifting a partner — e.g. GABA facilitating allopregnanolone).
 * All modifiers read the first-pass scores, so this is a single, order-independent pass.
 */
function applyInteractions(base: ChemicalScores): ChemicalScores {
  const deltas: Record<string, number> = {};

  for (const link of CHEMICAL_INTERACTIONS) {
    const source = getChemical(link.from);
    const sourceScore = base[link.from] ?? 0;
    const floor =
      link.type === "suppresses"
        ? source.dangerThreshold
        : source.starvationThreshold;

    const activation = clamp01((sourceScore - floor) / (100 - floor));
    if (activation <= 0) continue;

    const effect = link.magnitude * activation;
    deltas[link.to] =
      (deltas[link.to] ?? 0) + (link.type === "suppresses" ? -effect : effect);
  }

  const result: ChemicalScores = {};
  for (const chemical of CHEMICALS) {
    const adjusted = (base[chemical.id] ?? 0) + (deltas[chemical.id] ?? 0);
    result[chemical.id] = Math.round(clamp(adjusted));
  }
  return result;
}

/**
 * Calculate individual chemical scores from user ratings, including the
 * second-order interactions between chemical systems. Clamped to 0–100.
 */
export function calculateChemicalScores(ratings: Ratings): ChemicalScores {
  return applyInteractions(calculateBaseScores(ratings));
}

/**
 * How "online" a single neglected channel is, on a continuous 0–1 scale.
 * Crossing the starvation threshold is worth 0.5; the remaining 0.5 accrues
 * as the channel climbs from starvation toward the danger threshold. This gives
 * partial credit for lifting a dead system off the floor even before it fully
 * crosses threshold — which the discrete count alone cannot express.
 */
export function activationFraction(score: number, chem: Chemical): number {
  const s = chem.starvationThreshold;
  const d = chem.dangerThreshold;
  if (score <= s) return 0.5 * clamp01(score / s);
  return 0.5 + 0.5 * clamp01((score - s) / (d - s));
}

/**
 * Continuous counterpart to calculateBandwidth: the summed activation of all
 * nine neglected channels (0–9). Used to rank interventions so that progress on
 * deeply-starved systems is not invisible just because it hasn't crossed a line.
 */
export function calculateContinuousBandwidth(scores: ChemicalScores): number {
  return NEGLECTED_CHEMICALS.reduce(
    (sum, c) => sum + activationFraction(scores[c.id] ?? 0, c),
    0
  );
}

/**
 * Count how many neglected chemical systems are above their starvation threshold.
 */
export function calculateBandwidth(scores: ChemicalScores): number {
  return NEGLECTED_CHEMICALS.filter(
    (c) => (scores[c.id] ?? 0) >= c.starvationThreshold
  ).length;
}

/**
 * Calculate the three activating condition scores (0–100).
 */
export function calculateConditionScores(ratings: Ratings): {
  slowness: number;
  embodiment: number;
  attention: number;
} {
  const r = (id: string) => (ratings[id] ?? 0) / 4; // normalize to 0–1

  const slowness = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        r("meditation") * 38 +
          r("sleep") * 34 +
          r("nature") * 20 +
          r("sunlight") * 14 +
          r("diet") * 8
      )
    )
  );

  const embodiment = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        r("aerobic") * 42 +
          r("touch") * 28 +
          r("nature") * 20 +
          r("cold_exposure") * 10 +
          r("hiit") * 8 +
          4
      )
    )
  );

  const attention = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        r("deep_work") * 48 +
          r("meditation") * 22 +
          r("deep_convo") * 20 +
          r("creative_work") * 16 -
          (r("social_media") * 22 + r("notifications") * 28) * 0.55 +
          12
      )
    )
  );

  return { slowness, embodiment, attention };
}

/**
 * Monoculture Score: Herfindahl-like concentration index.
 * High = narrow range (bad), Low = broad range (good).
 * Returns 0–100 where 100 = all activity in one system.
 */
export function calculateMonocultureIndex(scores: ChemicalScores): number {
  const allScores = CHEMICALS.map((c) => scores[c.id] ?? 0);
  const total = allScores.reduce((sum, s) => sum + s, 0);

  if (total === 0) return 100;

  const shares = allScores.map((s) => s / total);
  const hhi = shares.reduce((sum, s) => sum + s * s, 0);

  // HHI ranges from 1/n (perfectly even) to 1 (all in one)
  // Normalize: 0 = perfectly even, 100 = perfectly concentrated
  const n = allScores.length;
  const minHHI = 1 / n;
  const normalized = ((hhi - minHHI) / (1 - minHHI)) * 100;

  return Math.round(Math.max(0, Math.min(100, normalized)));
}

/**
 * Generate a 3-sentence neurochemical narrative based on scores.
 */
export function generateNarrative(
  scores: ChemicalScores,
  bandwidth: number,
  conditionScores: { slowness: number; embodiment: number; attention: number },
  mode: LanguageMode = "science"
): string {
  const dopamine = scores.dopamine ?? 0;
  const cortisol = scores.cortisol ?? 0;
  const plain = mode === "plain";

  // Find the lowest neglected chemicals
  const neglectedSorted = NEGLECTED_CHEMICALS.map((c) => ({
    ...c,
    score: scores[c.id] ?? 0,
  })).sort((a, b) => a.score - b.score);

  const lowestTwo = neglectedSorted.slice(0, 2);
  const lowestCondition = Object.entries(conditionScores).sort(
    ([, a], [, b]) => a - b
  )[0];

  // Sentence 1: What's dominating
  let s1: string;
  if (dopamine > 68 && cortisol > 68) {
    s1 = plain
      ? "Right now your brain is running mostly on chasing and stress — the two things modern life cranks up the hardest."
      : "Your brain is running predominantly on seeking drive and stress mobilization — the two systems modern life overactivates most aggressively.";
  } else if (dopamine > 68) {
    s1 = plain
      ? "Your brain is running mostly on the chase — the wanting-the-next-thing loop that phones and apps pull hardest."
      : "Your neurochemical profile is dominated by seeking drive — the anticipation-reward loop that digital environments exploit most directly.";
  } else if (cortisol > 68) {
    s1 = plain
      ? "Your stress system is stuck on, keeping you in a low-level emergency your body was never meant to hold all day."
      : "Stress mobilization is running well above its intended threshold, maintaining a chronic low-grade emergency your nervous system was never designed to sustain.";
  } else {
    s1 = plain
      ? "Your chasing and stress systems are only moderately busy — less cranked up than usual for busy desk work."
      : "Your triad systems are within moderate range — less overdriven than the statistical norm for knowledge workers.";
  }

  // Sentence 2: What's missing
  const lowNames = lowestTwo.map((c) =>
    plain ? c.plainName : `${c.plainName} (${c.name})`
  );
  let s2: string;
  if (bandwidth <= 2) {
    s2 = plain
      ? `The systems behind ${lowNames[0]} and ${lowNames[1]} are running so low they're basically switched off.`
      : `The systems associated with ${lowNames[0]} and ${lowNames[1]} are operating well below activation threshold — effectively offline.`;
  } else if (bandwidth <= 5) {
    s2 = plain
      ? `${lowNames[0]} and ${lowNames[1]} are your most depleted — low enough that you barely feel their benefits.`
      : `${lowNames[0]} and ${lowNames[1]} remain your most depleted systems, operating in a range where their functional effects are minimal.`;
  } else {
    s2 = plain
      ? `Most of your quieter systems are online. ${lowNames[0]} has the most room left to grow.`
      : `Most of your neglected architecture is online. ${lowNames[0]} remains the system with the most room for expansion.`;
  }

  // Sentence 3: The structural observation
  let s3: string;
  const condKey = lowestCondition[0];
  const condName = plain
    ? condKey === "slowness"
      ? "slowing down"
      : condKey === "embodiment"
        ? "being in your body"
        : "focus"
    : condKey === "slowness"
      ? "slowness"
      : condKey === "embodiment"
        ? "embodiment"
        : "sustained attention";
  if (bandwidth <= 3) {
    s3 = plain
      ? `Your week looks built for the first group and hostile to the second — especially in how little room it leaves for ${condName}.`
      : `Your environment appears structurally optimised for the first group and hostile to the second — particularly in its lack of ${condName}.`;
  } else if (bandwidth <= 6) {
    s3 = plain
      ? `The thing holding you back most is ${condName} — the one your current week gives you least of.`
      : `The limiting factor is ${condName} — the activating condition your current week provides least of.`;
  } else {
    s3 = plain
      ? `Your week already gives you a fairly broad range. The next step is going deeper on ${condName}.`
      : `Your current patterns provide a relatively broad neurochemical range. The remaining opportunity is in deepening ${condName}.`;
  }

  return `${s1} ${s2} ${s3}`;
}
