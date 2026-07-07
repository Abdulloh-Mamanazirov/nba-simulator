import type { Chemical } from "./chemicals";
import type { ChemicalInteraction } from "./interactions";
import type { Transducer } from "./transducers";
import type { LanguageMode } from "./language";

type Condition = "slowness" | "embodiment" | "attention";

/* ============================================================
   CHEMICAL / INTERACTION LABEL HELPERS
   In plain mode the everyday name leads and the scientific name
   becomes the footnote; in science mode it's the reverse.
   ============================================================ */

export const chemPrimary = (c: Chemical, mode: LanguageMode): string =>
  mode === "plain" ? c.plainName : c.name;

export const chemSecondary = (c: Chemical, mode: LanguageMode): string =>
  mode === "plain" ? c.name : c.plainName;

export const chemDescription = (c: Chemical, mode: LanguageMode): string =>
  mode === "plain" ? c.plainDescription : c.description;

/** The dense scientific paragraph — hidden entirely in plain mode. */
export const chemDetail = (
  c: Chemical,
  mode: LanguageMode
): string | null => (mode === "plain" ? null : c.scientificDetail);

export const interactionText = (
  i: ChemicalInteraction,
  mode: LanguageMode
): string => (mode === "plain" ? i.plainDescription : i.description);

export const transducerAnchor = (t: Transducer, mode: LanguageMode): string =>
  mode === "plain" ? t.anchorPlain : t.anchor;

export const transducerUpgrade = (t: Transducer, mode: LanguageMode): string =>
  mode === "plain" ? t.upgradePlain : t.upgrade;

export const transducerWhy = (t: Transducer, mode: LanguageMode): string =>
  mode === "plain" ? t.whyPlain : t.why;

export function effortLabel(effort: 1 | 2 | 3, mode: LanguageMode): string {
  if (mode === "plain") {
    return effort === 1 ? "No effort" : effort === 2 ? "Little effort" : "Some effort";
  }
  return effort === 1 ? "Negligible" : effort === 2 ? "Low" : "Moderate";
}

/* ============================================================
   STATIC UI CHROME
   ============================================================ */

interface UICopy {
  // buttons / nav
  ctaCalculate: string;
  editRatings: string;
  getPrescription: string;
  backToResults: string;
  retake: string;
  stepLabels: [string, string, string];
  // bandwidth
  bandwidthKicker: string;
  bandwidthUnit: string;
  // narrative
  narrativeKicker: string;
  // spectrum
  spectrumTitle: string;
  spectrumHint: string;
  groupTriad: string;
  groupNeglected: string;
  thresholdOverdriven: string;
  thresholdStarvation: string;
  // detail panel
  statusOverdriven: string;
  statusStarving: string;
  activatingConditions: string;
  // conditions
  conditionsTitle: string;
  conditionsLead: string;
  conditionsBalanced: string;
  conditionsLowestPrefix: string;
  // monoculture
  monoTitle: string;
  monoIntro: string;
  // interaction map
  mapTitle: string;
  mapIntro: string;
  legendSuppresses: string;
  legendSupports: string;
  // accordion
  accordionTitle: string;
  accordionSub: string;
  statusHigh: string;
  statusLow: string;
  // possible outcomes
  outcomesKicker: string;
  drivenBy: string;
  // everyday transducers
  transducerKicker: string;
  transducerIntro: string;
  transducerLifts: string;
  transducerEffort: string;
  // action optimizer (AI)
  optimizerKicker: string;
  optimizerIntro: string;
  optimizerPlaceholder: string;
  optimizerButton: string;
  optimizerLoading: string;
  optimizerEases: string;
  optimizerRetry: string;
  // prescription
  rxTitle: string;
  rxIntro: string;
  rxEmpty: string;
  targetLabel: string;
  unlockLabel: string;
  rangeUnit: string;
  beforeAfterTitle: string;
  beforeAfterIntro: string;
  labelCurrent: string;
  labelProjected: string;
  closingNote: string;
  // footer
  footerNote: string;
}

const COPY: Record<LanguageMode, UICopy> = {
  plain: {
    ctaCalculate: "See My Results →",
    editRatings: "← Change Answers",
    getPrescription: "See What To Do →",
    backToResults: "← Back",
    retake: "Start Over",
    stepLabels: ["Rate", "Results", "Plan"],
    bandwidthKicker: "Your Range",
    bandwidthUnit: "quieter systems switched on",
    narrativeKicker: "What's Going On",
    spectrumTitle: "Your Chemical Balance",
    spectrumHint: "Tap a bar to learn more",
    groupTriad: "Overworked",
    groupNeglected: "Underused",
    thresholdOverdriven: "Too high",
    thresholdStarvation: "Too low",
    statusOverdriven: "⚠ Running too high",
    statusStarving: "⚠ Barely switched on",
    activatingConditions: "Switched on by:",
    conditionsTitle: "What Your Week Gives You",
    conditionsLead:
      "All nine quieter systems need one of these three things to switch on.",
    conditionsBalanced: "These three are perfectly balanced.",
    conditionsLowestPrefix: "Your weakest is",
    monoTitle: "How Balanced You Are",
    monoIntro:
      "Are you spread across many systems, or stuck on a few? Higher means more stuck.",
    mapTitle: "How They Affect Each Other",
    mapIntro:
      "How your systems push and pull on each other. Tap or hover a circle to focus it.",
    legendSuppresses: "Holds down",
    legendSupports: "Lifts up",
    accordionTitle: "See All 12, Explained",
    accordionSub: "Tap any one to see what it does",
    statusHigh: "HIGH",
    statusLow: "LOW",
    outcomesKicker: "Possible Outcomes",
    drivenBy: "Driven by:",
    transducerKicker: "Tiny Upgrades",
    transducerIntro:
      "Start here. These don't add anything to your day — they just upgrade things you already do, so the same moment does more for your brain.",
    transducerLifts: "Lifts:",
    transducerEffort: "Effort:",
    optimizerKicker: "Optimize Your Own",
    optimizerIntro:
      "Got something specific in mind? Type anything you're about to do and we'll suggest a way to do it that's better for your brain — tuned to what you're low in.",
    optimizerPlaceholder: "e.g. wash the dishes, study for an exam, call my mum…",
    optimizerButton: "Optimize",
    optimizerLoading: "Finding the best way…",
    optimizerEases: "Eases:",
    optimizerRetry: "Try again",
    rxTitle: "Your Next Steps",
    rxIntro:
      "The few changes that would do the most for you, in order. Start at the top — these are your highest-impact moves.",
    rxEmpty:
      "You're already using nearly all nine systems. Focus on going deeper rather than adding more.",
    targetLabel: "Aim for:",
    unlockLabel: "Would switch on:",
    rangeUnit: "balance",
    beforeAfterTitle: "If You Did All This",
    beforeAfterIntro:
      "Here's how your balance could look if you made all these changes.",
    labelCurrent: "Now",
    labelProjected: "After",
    closingNote:
      "This is a mirror, not a to-do list you have to finish. The systems here are real, well-studied brain chemistry — and so is the modern life that wears them down. What you do next is entirely up to you.",
    footerNote:
      "Based on research by J. Ricketts (2026). This is a self-check, not medical advice.",
  },
  science: {
    ctaCalculate: "Calculate My Range →",
    editRatings: "← Edit Ratings",
    getPrescription: "Get My Prescription →",
    backToResults: "← Back to Results",
    retake: "Retake Audit",
    stepLabels: ["Rate", "Results", "Prescription"],
    bandwidthKicker: "Neurochemical Bandwidth",
    bandwidthUnit: "neglected channels active",
    narrativeKicker: "Neurochemical Narrative",
    spectrumTitle: "Your Neurochemical Spectrum",
    spectrumHint: "Tap any bar for details",
    groupTriad: "Dominant Triad",
    groupNeglected: "Neglected Architecture",
    thresholdOverdriven: "Overdriven",
    thresholdStarvation: "Starvation",
    statusOverdriven: "⚠ Overdriven",
    statusStarving: "⚠ Below Starvation Threshold",
    activatingConditions: "Activating conditions:",
    conditionsTitle: "What Your Week Provides",
    conditionsLead:
      "All nine neglected systems need one of these three conditions to activate.",
    conditionsBalanced: "Your conditions are perfectly balanced.",
    conditionsLowestPrefix: "Your lowest is",
    monoTitle: "Range Concentration",
    monoIntro:
      "Are you running on many systems or just a few? Higher = more concentrated (worse).",
    mapTitle: "Chemical Interaction Map",
    mapIntro:
      "How your chemical systems affect each other. Hover a node to highlight connections.",
    legendSuppresses: "Suppresses",
    legendSupports: "Supports",
    accordionTitle: "Explore All 12 Chemical Systems",
    accordionSub: "Detailed breakdown of each neurochemical system",
    statusHigh: "HIGH",
    statusLow: "LOW",
    outcomesKicker: "Possible Outcomes",
    drivenBy: "Driven by:",
    transducerKicker: "Action Transducers",
    transducerIntro:
      "Before the bigger changes below: these add no new activities. Each one modifies an action you already perform so it transduces into richer neurochemical output.",
    transducerLifts: "Lifts:",
    transducerEffort: "Effort:",
    optimizerKicker: "Custom Transducer",
    optimizerIntro:
      "Enter any action to transduce. The engine returns a modified protocol for performing it, optimised against your most depleted systems.",
    optimizerPlaceholder: "e.g. wash the dishes, study for an exam, call my mother…",
    optimizerButton: "Transduce",
    optimizerLoading: "Computing optimal protocol…",
    optimizerEases: "Cools:",
    optimizerRetry: "Retry",
    rxTitle: "Your Prescription",
    rxIntro:
      "The specific changes that would most expand your neurochemical range, ranked by impact. These are not suggestions — they are the highest-leverage interventions for your particular profile.",
    rxEmpty:
      "Your bandwidth is already at or near maximum. Focus on deepening individual systems rather than broadening.",
    targetLabel: "Target:",
    unlockLabel: "Would unlock:",
    rangeUnit: "range",
    beforeAfterTitle: "If You Followed All Recommendations",
    beforeAfterIntro:
      "Projected neurochemical spectrum with all prescriptions applied.",
    labelCurrent: "Current",
    labelProjected: "Projected",
    closingNote:
      "This is a diagnostic instrument, not a motivational tool. The systems described here are real, peer-reviewed neurochemistry. The environment that degrades them is also real. Whether and how you respond is entirely your own.",
    footerNote:
      "Based on research by J. Ricketts (2026). This is a diagnostic instrument, not medical advice.",
  },
};

export const getCopy = (mode: LanguageMode): UICopy => COPY[mode];

/* ============================================================
   TIERED / TEMPLATED COPY
   ============================================================ */

export function ratedLabel(
  n: number,
  total: number,
  mode: LanguageMode
): string {
  return mode === "plain"
    ? `You've answered ${n} of ${total}`
    : `${n} / ${total} activities rated`;
}

export function bandwidthLevel(bw: number, mode: LanguageMode): string {
  if (mode === "plain") {
    if (bw <= 2) return "Very Narrow";
    if (bw <= 4) return "Narrow";
    if (bw <= 6) return "Okay";
    if (bw <= 8) return "Broad";
    return "Full";
  }
  if (bw <= 2) return "Critically Narrow";
  if (bw <= 4) return "Constricted";
  if (bw <= 6) return "Moderate";
  if (bw <= 8) return "Broad";
  return "Full Range";
}

export function monocultureLabel(index: number, mode: LanguageMode): string {
  if (mode === "plain") {
    if (index >= 60) return "Very stuck";
    if (index >= 40) return "Stuck";
    if (index >= 25) return "So-so";
    if (index >= 10) return "Balanced";
    return "Very balanced";
  }
  if (index >= 60) return "Severe";
  if (index >= 40) return "High";
  if (index >= 25) return "Moderate";
  if (index >= 10) return "Low";
  return "Minimal";
}

export function monocultureExplanation(
  index: number,
  mode: LanguageMode
): string {
  if (mode === "plain") {
    if (index >= 60)
      return "Almost everything is running on just a few systems. The rest are basically switched off.";
    if (index >= 40)
      return "You're leaning on a handful of systems while lots of others sit idle.";
    if (index >= 25)
      return "A few systems dominate, but things are starting to spread out.";
    if (index >= 10)
      return "Your activity is spread reasonably across several systems.";
    return "Nicely spread — you're using a broad range of what you've got.";
  }
  if (index >= 60)
    return "Almost all your neurochemical activity is concentrated in a few systems. The rest are functionally silent.";
  if (index >= 40)
    return "Your range is narrow — a few systems dominate while many others sit idle.";
  if (index >= 25)
    return "Some concentration is present, but activity is starting to spread across systems.";
  if (index >= 10)
    return "Your neurochemical activity is reasonably distributed across multiple systems.";
  return "Activity is well-spread — you're using a broad range of your available neurochemistry.";
}

const CONDITION_LABELS: Record<Condition, { plain: string; science: string }> = {
  slowness: { plain: "Stillness", science: "Slowness" },
  embodiment: { plain: "Body", science: "Embodiment" },
  attention: { plain: "Focus", science: "Attention" },
};

export function conditionLabel(cond: Condition, mode: LanguageMode): string {
  return CONDITION_LABELS[cond][mode];
}

const CONDITION_TOOLTIPS: Record<
  Condition,
  { plain: string; science: string }
> = {
  slowness: {
    plain:
      "Genuinely slowing down — no rushing, no urgency. It's what lets your body actually rest and recover.",
    science:
      "A psychological state characterized by intentional deceleration, reduced cognitive load, and deliberate pacing, essential for parasympathetic recovery.",
  },
  embodiment: {
    plain:
      "Being in your body — moving, using your senses, feeling physically present instead of stuck in your head.",
    science:
      "The subjective experience of being grounded in one's physical body, involving sensory awareness and interoceptive sensitivity.",
  },
  attention: {
    plain:
      "Staying with one thing at a time, without being pulled in ten directions at once.",
    science:
      "The ability to sustain focus on a single cognitive thread or perceptual object without fragmentation by competing stimuli.",
  },
};

export function conditionTooltip(cond: Condition, mode: LanguageMode): string {
  return CONDITION_TOOLTIPS[cond][mode];
}

export function conditionInsight(
  cond: Condition,
  value: number,
  mode: LanguageMode
): string {
  if (mode === "plain") {
    if (cond === "slowness") {
      if (value < 20) return "Your week has almost no real downtime";
      if (value < 45) return "Some rest, but rarely the deep kind";
      if (value < 70) return "Okay — real stillness happens, just not often";
      return "Great — your week has genuine calm built into it";
    }
    if (cond === "embodiment") {
      if (value < 20) return "Your body barely gets a look-in";
      if (value < 45) return "A little movement, but your body's mostly benched";
      if (value < 70) return "Okay — you move fairly regularly";
      return "Great — your body is a real part of your week";
    }
    if (value < 20) return "Your focus is scattered — rarely on one thing";
    if (value < 45) return "Some focus, but distraction usually wins";
    if (value < 70) return "Okay — you focus, but distraction competes";
    return "Great — deep focus is a regular thing for you";
  }
  if (cond === "slowness") {
    if (value < 20) return "Your week provides almost no genuine deceleration";
    if (value < 45) return "Some rest, but rarely the deep kind";
    if (value < 70)
      return "Moderate — real stillness is present but inconsistent";
    return "Strong — your week includes genuine slowness";
  }
  if (cond === "embodiment") {
    if (value < 20) return "Very little physical reality in your routine";
    if (value < 45) return "Some movement, but your body is mostly sidelined";
    if (value < 70) return "Moderate — regular physical engagement";
    return "Strong — your body is central to your week";
  }
  if (value < 20) return "Attention is highly fragmented — rarely on one thing";
  if (value < 45) return "Some depth, but fragmentation is dominant";
  if (value < 70)
    return "Moderate — focused work happens but competes with distraction";
  return "Strong — sustained attention is a regular part of your week";
}

export function deltaSummary(
  delta: number,
  current: number,
  projected: number,
  mode: LanguageMode
): string {
  if (delta <= 0) {
    return mode === "plain"
      ? "You're already using nearly your full range. Focus on going deeper rather than wider."
      : "Your current range is already at maximum breadth. Focus on deepening individual systems.";
  }
  const plural = delta !== 1 ? "s" : "";
  return mode === "plain"
    ? `Doing all this would switch on ${delta} more quiet system${plural}, taking you from ${current} to ${projected} out of 9.`
    : `These changes would activate ${delta} additional neglected system${plural}, expanding your neurochemical range from ${current} to ${projected} channels.`;
}
