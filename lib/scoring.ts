import { CHEMICALS, NEGLECTED_CHEMICALS } from "./chemicals";
import { ACTIVITIES } from "./activities";

export type Ratings = Record<string, number>;
export type ChemicalScores = Record<string, number>;

/**
 * Calculate individual chemical scores from user ratings.
 * Formula: chemical_score = base + Σ((activity_rating / 4) × weight)
 * Clamped to 0–100.
 */
export function calculateChemicalScores(ratings: Ratings): ChemicalScores {
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

    scores[chemical.id] = Math.max(0, Math.min(100, Math.round(score)));
  }

  return scores;
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
  conditionScores: { slowness: number; embodiment: number; attention: number }
): string {
  const dopamine = scores.dopamine ?? 0;
  const cortisol = scores.cortisol ?? 0;

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
    s1 =
      "Your brain is running predominantly on seeking drive and stress mobilization — the two systems modern life overactivates most aggressively.";
  } else if (dopamine > 68) {
    s1 =
      "Your neurochemical profile is dominated by seeking drive — the anticipation-reward loop that digital environments exploit most directly.";
  } else if (cortisol > 68) {
    s1 =
      "Stress mobilization is running well above its intended threshold, maintaining a chronic low-grade emergency your nervous system was never designed to sustain.";
  } else {
    s1 =
      "Your triad systems are within moderate range — less overdriven than the statistical norm for knowledge workers.";
  }

  // Sentence 2: What's missing
  const lowNames = lowestTwo.map((c) => `${c.plainName} (${c.name})`);
  let s2: string;
  if (bandwidth <= 2) {
    s2 = `The systems associated with ${lowNames[0]} and ${lowNames[1]} are operating well below activation threshold — effectively offline.`;
  } else if (bandwidth <= 5) {
    s2 = `${lowNames[0]} and ${lowNames[1]} remain your most depleted systems, operating in a range where their functional effects are minimal.`;
  } else {
    s2 = `Most of your neglected architecture is online. ${lowNames[0]} remains the system with the most room for expansion.`;
  }

  // Sentence 3: The structural observation
  let s3: string;
  const condName =
    lowestCondition[0] === "slowness"
      ? "slowness"
      : lowestCondition[0] === "embodiment"
        ? "embodiment"
        : "sustained attention";
  if (bandwidth <= 3) {
    s3 = `Your environment appears structurally optimised for the first group and hostile to the second — particularly in its lack of ${condName}.`;
  } else if (bandwidth <= 6) {
    s3 = `The limiting factor is ${condName} — the activating condition your current week provides least of.`;
  } else {
    s3 = `Your current patterns provide a relatively broad neurochemical range. The remaining opportunity is in deepening ${condName}.`;
  }

  return `${s1} ${s2} ${s3}`;
}
