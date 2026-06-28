import { ACTIVITIES, FREQUENCY_LABELS } from "./activities";
import { NEGLECTED_CHEMICALS, getChemical } from "./chemicals";
import {
  calculateChemicalScores,
  calculateBandwidth,
  type Ratings,
  type ChemicalScores,
} from "./scoring";

export interface Prescription {
  activityId: string;
  activityName: string;
  activityIcon: string;
  targetFrequency: string;
  unlockedChemicals: {
    id: string;
    name: string;
    plainName: string;
    color: string;
  }[];
  channelGain: number;
  personalizedSentence: string;
  newBandwidth: number;
}

/**
 * For each activity the user rates below 3 ("3–4×/wk"),
 * simulate adding it at Daily level (4) and calculate bandwidth delta.
 * Rank by impact. Return top 4.
 */
export function generatePrescriptions(
  ratings: Ratings,
  currentScores: ChemicalScores,
  currentBandwidth: number
): Prescription[] {
  const candidates: Prescription[] = [];

  // Find the user's lowest neglected chemical for personalized sentences
  const lowestNeglected = NEGLECTED_CHEMICALS.map((c) => ({
    ...c,
    score: currentScores[c.id] ?? 0,
  })).sort((a, b) => a.score - b.score);

  for (const activity of ACTIVITIES) {
    const currentRating = ratings[activity.id] ?? 0;

    // Only consider activities rated below 3 (below "3–4×/wk")
    if (currentRating >= 3) continue;

    // Skip activities that are purely harmful (alcohol)
    // Actually include it — user might drink daily and reducing it helps
    // We simulate setting to "Daily" for positive activities,
    // and "Never" for negative activities
    const isNegative = activity.id === "alcohol";
    const simulatedRating = isNegative ? 0 : 4;

    // Create simulated ratings
    const simulatedRatings = { ...ratings, [activity.id]: simulatedRating };
    const simulatedScores = calculateChemicalScores(simulatedRatings);
    const simulatedBandwidth = calculateBandwidth(simulatedScores);
    const gain = simulatedBandwidth - currentBandwidth;

    // Only include if there's a positive gain
    if (gain <= 0) continue;

    // Determine which chemicals would newly cross starvation threshold
    const unlockedChemicals = NEGLECTED_CHEMICALS.filter((c) => {
      const wasBelow =
        (currentScores[c.id] ?? 0) < c.starvationThreshold;
      const nowAbove =
        (simulatedScores[c.id] ?? 0) >= c.starvationThreshold;
      return wasBelow && nowAbove;
    }).map((c) => ({
      id: c.id,
      name: c.name,
      plainName: c.plainName,
      color: c.color,
    }));

    // Find the most-affected low chemical for this activity
    let bestChemical = lowestNeglected[0];
    const activityWeights = activity.weights;
    for (const nc of lowestNeglected) {
      if ((activityWeights[nc.id] ?? 0) > 0) {
        bestChemical = nc;
        break;
      }
    }

    // Build target frequency string
    let targetFrequency: string;
    if (isNegative) {
      targetFrequency = "Eliminate or reduce to monthly";
    } else {
      const targetLabel = FREQUENCY_LABELS[4]; // Daily
      targetFrequency = `${targetLabel}`;
      // Add specifics based on activity
      if (activity.id === "aerobic")
        targetFrequency = "Daily, 30+ continuous minutes";
      if (activity.id === "deep_work")
        targetFrequency = "Daily, 60+ minute sessions";
      if (activity.id === "deep_convo")
        targetFrequency = "3–4× per week, 30+ minutes each";
      if (activity.id === "meditation")
        targetFrequency = "Daily, 10–20 minutes minimum";
      if (activity.id === "sleep")
        targetFrequency = "Daily, 7–9 hours, consistent schedule";
      if (activity.id === "cold_exposure")
        targetFrequency = "Daily, 2–5 minutes cold water";
      if (activity.id === "nature")
        targetFrequency = "3–4× per week, 20+ minutes";
      if (activity.id === "sunlight")
        targetFrequency = "Daily, 10–15 minutes within first hour of waking";
      if (activity.id === "diet")
        targetFrequency =
          "Daily — whole foods, fiber, fermented foods";
      if (activity.id === "touch")
        targetFrequency = "Daily — physical presence with trusted people";
      if (activity.id === "creative_work")
        targetFrequency = "3–4× per week, sustained sessions";
    }

    // Build personalized sentence
    const chemScore = currentScores[bestChemical.id] ?? 0;
    const personalizedSentence = isNegative
      ? `Alcohol artificially hijacks GABA receptors and suppresses glymphatic clearance. Reducing intake would allow your ${bestChemical.plainName} (${bestChemical.name}) to recover from ${chemScore}/100.`
      : `Your ${bestChemical.plainName} (${bestChemical.name}) is at ${chemScore}/100. ${activity.name} is ${(activityWeights[bestChemical.id] ?? 0) > 20 ? "its primary and most direct activator" : "one of its key activators"}.`;

    candidates.push({
      activityId: activity.id,
      activityName: isNegative ? "Reduce Alcohol / Substances" : activity.name,
      activityIcon: activity.icon,
      targetFrequency,
      unlockedChemicals,
      channelGain: gain,
      personalizedSentence,
      newBandwidth: simulatedBandwidth,
    });
  }

  // Sort by channel gain descending, then by number of unlocked chemicals
  candidates.sort((a, b) => {
    if (b.channelGain !== a.channelGain) return b.channelGain - a.channelGain;
    return b.unlockedChemicals.length - a.unlockedChemicals.length;
  });

  return candidates.slice(0, 4);
}

/**
 * Calculate projected scores if user followed all prescriptions.
 */
export function calculateProjectedScores(
  ratings: Ratings,
  prescriptions: Prescription[]
): { scores: ChemicalScores; bandwidth: number } {
  const projectedRatings = { ...ratings };

  for (const p of prescriptions) {
    if (p.activityId === "alcohol") {
      projectedRatings[p.activityId] = 0;
    } else {
      projectedRatings[p.activityId] = 4;
    }
  }

  const scores = calculateChemicalScores(projectedRatings);
  const bandwidth = calculateBandwidth(scores);

  return { scores, bandwidth };
}
