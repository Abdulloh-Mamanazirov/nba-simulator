import { ACTIVITIES, FREQUENCY_LABELS, type Activity } from "./activities";
import { NEGLECTED_CHEMICALS, type Chemical } from "./chemicals";
import {
  calculateChemicalScores,
  calculateBandwidth,
  calculateContinuousBandwidth,
  type Ratings,
  type ChemicalScores,
} from "./scoring";
import type { LanguageMode } from "./language";

export interface Prescription {
  activityId: string;
  activityName: string;
  activityIcon: string;
  direction: "increase" | "reduce";
  targetFrequency: string;
  unlockedChemicals: {
    id: string;
    name: string;
    plainName: string;
    color: string;
  }[];
  /** Discrete channels newly crossing their starvation threshold (may be 0). */
  channelGain: number;
  /** Continuous activation gained across all neglected channels (0–9 scale). */
  rangeGain: number;
  personalizedSentence: string;
  newBandwidth: number;
}

type ScoredChemical = Chemical & { score: number };

/** Minimum continuous range gain for an intervention to be worth showing. */
const MIN_RANGE_GAIN = 0.05;

/** Specific, actionable target for an activity the user should do more of. */
function increaseTargetFrequency(activity: Activity): string {
  switch (activity.id) {
    case "aerobic":
      return "Daily, 30+ continuous minutes";
    case "deep_work":
      return "Daily, 60+ minute sessions";
    case "deep_convo":
      return "3–4× per week, 30+ minutes each";
    case "meditation":
      return "Daily, 10–20 minutes minimum";
    case "sleep":
      return "Daily, 7–9 hours, consistent schedule";
    case "cold_exposure":
      return "Daily, 2–5 minutes cold water";
    case "nature":
      return "3–4× per week, 20+ minutes";
    case "sunlight":
      return "Daily, 10–15 minutes within first hour of waking";
    case "diet":
      return "Daily — whole foods, fiber, fermented foods";
    case "touch":
      return "Daily — physical presence with trusted people";
    case "creative_work":
      return "3–4× per week, sustained sessions";
    default:
      return FREQUENCY_LABELS[4]; // Daily
  }
}

/** The neglected chemical this activity most strongly depletes, if any. */
function mostDepletedBy(activity: Activity): Chemical | null {
  let worst: Chemical | null = null;
  let worstWeight = 0;
  for (const c of NEGLECTED_CHEMICALS) {
    const w = activity.weights[c.id] ?? 0;
    if (w < worstWeight) {
      worstWeight = w;
      worst = c;
    }
  }
  return worst;
}

/**
 * Build a single prescription for moving an activity in one direction
 * (increase to Daily, or reduce to Never). Returns null if the move produces
 * no meaningful gain in the user's continuous neurochemical range.
 */
/** "Deep Calm (Allopregnanolone)" in science mode, just "Deep Calm" in plain. */
function chemName(c: Chemical, plain: boolean): string {
  return plain ? c.plainName : `${c.plainName} (${c.name})`;
}

function buildCandidate(
  activity: Activity,
  direction: "increase" | "reduce",
  ratings: Ratings,
  currentScores: ChemicalScores,
  currentBandwidth: number,
  currentRange: number,
  lowestNeglected: ScoredChemical[],
  mode: LanguageMode
): Prescription | null {
  const plain = mode === "plain";
  const simulatedRating = direction === "increase" ? 4 : 0;
  const simulatedRatings = { ...ratings, [activity.id]: simulatedRating };
  const simulatedScores = calculateChemicalScores(simulatedRatings);

  const rangeGain =
    calculateContinuousBandwidth(simulatedScores) - currentRange;
  if (rangeGain <= MIN_RANGE_GAIN) return null;

  const simulatedBandwidth = calculateBandwidth(simulatedScores);
  const channelGain = simulatedBandwidth - currentBandwidth;

  const unlockedChemicals = NEGLECTED_CHEMICALS.filter((c) => {
    const wasBelow = (currentScores[c.id] ?? 0) < c.starvationThreshold;
    const nowAbove = (simulatedScores[c.id] ?? 0) >= c.starvationThreshold;
    return wasBelow && nowAbove;
  }).map((c) => ({
    id: c.id,
    name: c.name,
    plainName: c.plainName,
    color: c.color,
  }));

  let activityName: string;
  let targetFrequency: string;
  let personalizedSentence: string;

  if (direction === "increase") {
    // Reference the user's lowest neglected system that this activity boosts.
    let best = lowestNeglected[0];
    for (const nc of lowestNeglected) {
      if ((activity.weights[nc.id] ?? 0) > 0) {
        best = nc;
        break;
      }
    }
    const chemScore = currentScores[best.id] ?? 0;
    const isPrimary = (activity.weights[best.id] ?? 0) > 20;

    activityName = activity.name;
    targetFrequency = increaseTargetFrequency(activity);
    personalizedSentence = plain
      ? `Your ${best.plainName} is only ${chemScore}/100. ${activity.name} is ${
          isPrimary ? "the most direct way to lift it" : "one of the best ways to lift it"
        }.`
      : `Your ${best.plainName} (${best.name}) is at ${chemScore}/100. ${activity.name} is ${
          isPrimary ? "its primary and most direct activator" : "one of its key activators"
        }.`;
  } else {
    activityName = plain ? `Cut back on ${activity.name}` : `Reduce ${activity.name}`;
    targetFrequency = plain ? "Cut to never or once a month" : "Cut to never or monthly";

    if (activity.id === "alcohol") {
      const depleted = mostDepletedBy(activity) ?? lowestNeglected[0];
      const chemScore = currentScores[depleted.id] ?? 0;
      personalizedSentence = plain
        ? `Alcohol fakes calm and wrecks the deep sleep that cleans your brain. Cutting back would let your ${depleted.plainName} recover from ${chemScore}/100.`
        : `Alcohol artificially hijacks GABA receptors and suppresses glymphatic clearance. Reducing intake would allow your ${chemName(depleted, false)} to recover from ${chemScore}/100.`;
    } else {
      const depleted = mostDepletedBy(activity) ?? lowestNeglected[0];
      const chemScore = currentScores[depleted.id] ?? 0;
      personalizedSentence = plain
        ? `${activity.name} is one of the biggest drains on your ${depleted.plainName}, now at ${chemScore}/100. Cutting back is one of the quickest ways to bring it back.`
        : `${activity.name} is one of the strongest suppressors of your ${chemName(depleted, false)}, currently at ${chemScore}/100. Reducing it is one of the most direct ways to bring that system back online.`;
    }
  }

  return {
    activityId: activity.id,
    activityName,
    activityIcon: activity.icon,
    direction,
    targetFrequency,
    unlockedChemicals,
    channelGain,
    rangeGain,
    personalizedSentence,
    newBandwidth: simulatedBandwidth,
  };
}

/**
 * Generate personalized prescriptions ranked by their impact on the user's
 * continuous neurochemical range. For each activity we consider both doing more
 * of it (if there's meaningful room) and doing less of it (if it's currently
 * frequent enough to matter); only the higher-impact, positive-gain direction
 * is kept. Returns the top 4.
 */
export function generatePrescriptions(
  ratings: Ratings,
  currentScores: ChemicalScores,
  currentBandwidth: number,
  mode: LanguageMode = "science"
): Prescription[] {
  const currentRange = calculateContinuousBandwidth(currentScores);

  const lowestNeglected: ScoredChemical[] = NEGLECTED_CHEMICALS.map((c) => ({
    ...c,
    score: currentScores[c.id] ?? 0,
  })).sort((a, b) => a.score - b.score);

  const candidates: Prescription[] = [];

  for (const activity of ACTIVITIES) {
    const currentRating = ratings[activity.id] ?? 0;
    const options: Prescription[] = [];

    // Do more — only where there's real room to grow (below 3–4×/wk).
    if (currentRating < 3) {
      const c = buildCandidate(
        activity,
        "increase",
        ratings,
        currentScores,
        currentBandwidth,
        currentRange,
        lowestNeglected,
        mode
      );
      if (c) options.push(c);
    }

    // Do less — only where they currently do it enough (weekly or more) for
    // reducing it to matter.
    if (currentRating >= 2) {
      const c = buildCandidate(
        activity,
        "reduce",
        ratings,
        currentScores,
        currentBandwidth,
        currentRange,
        lowestNeglected,
        mode
      );
      if (c) options.push(c);
    }

    // Keep at most one direction per activity — the more impactful one.
    if (options.length > 0) {
      options.sort((a, b) => b.rangeGain - a.rangeGain);
      candidates.push(options[0]);
    }
  }

  candidates.sort((a, b) => {
    if (Math.abs(b.rangeGain - a.rangeGain) > 0.001) {
      return b.rangeGain - a.rangeGain;
    }
    return b.unlockedChemicals.length - a.unlockedChemicals.length;
  });

  return candidates.slice(0, 4);
}

/**
 * Calculate projected scores if the user followed all prescriptions,
 * applying each in its recommended direction.
 */
export function calculateProjectedScores(
  ratings: Ratings,
  prescriptions: Prescription[]
): { scores: ChemicalScores; bandwidth: number } {
  const projectedRatings = { ...ratings };

  for (const p of prescriptions) {
    projectedRatings[p.activityId] = p.direction === "reduce" ? 0 : 4;
  }

  const scores = calculateChemicalScores(projectedRatings);
  const bandwidth = calculateBandwidth(scores);

  return { scores, bandwidth };
}
