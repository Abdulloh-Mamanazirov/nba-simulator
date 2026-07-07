import { getChemical, type Chemical } from "./chemicals";
import type { ChemicalScores } from "./scoring";

type Condition = "slowness" | "embodiment" | "attention";

/**
 * A "transducer" upgrades an action the user almost certainly already does, so
 * that the *same* action produces richer neurochemical output — no new time
 * required. `boosts` lifts neglected systems; `dampens` cools an overdriven
 * triad system. Effort: 1 = trivial (same time & place), 3 = a little effort.
 */
export interface Transducer {
  id: string;
  anchor: string; // the ordinary moment (science voice)
  anchorPlain: string;
  upgrade: string; // the tweak (science voice)
  upgradePlain: string;
  why: string; // one line (science voice)
  whyPlain: string;
  effort: 1 | 2 | 3;
  boosts: string[]; // neglected chemical ids lifted
  dampens: string[]; // triad chemical ids cooled
}

export const TRANSDUCERS: Transducer[] = [
  {
    id: "coffee_daylight",
    anchor: "Your morning coffee or tea",
    anchorPlain: "Your morning coffee or tea",
    upgrade: "Drink it by a bright window or step outside with it",
    upgradePlain: "Drink it by a bright window, or take it outside",
    why: "Morning light anchors your circadian rhythm and lifts serotonin, while easing the day's cortisol curve.",
    whyPlain: "Morning light sets your body clock and gently lifts your calm, settled chemistry.",
    effort: 1,
    boosts: ["serotonin"],
    dampens: ["cortisol"],
  },
  {
    id: "phonefree_walk",
    anchor: "The walk you already take (to transit, the shop, the car)",
    anchorPlain: "A walk you already take (to the station, the shop)",
    upgrade: "Leave the earbuds and phone in your pocket and just look around",
    upgradePlain: "Leave the earbuds and phone in your pocket and just look around",
    why: "Undivided, unstimulated attention lets acetylcholine recover and drops background cortisol.",
    whyPlain: "Giving your attention a rest lets your focus chemistry recover and quiets stress.",
    effort: 1,
    boosts: ["acetylcholine", "serotonin"],
    dampens: ["cortisol", "dopamine"],
  },
  {
    id: "commute_move",
    anchor: "Your commute or trip across town",
    anchorPlain: "Your commute or trip across town",
    upgrade: "Get off a stop early, or walk/cycle one leg of it",
    upgradePlain: "Get off a stop early, or walk or cycle part of it",
    why: "Even short movement raises BDNF and serotonin and burns off circulating cortisol.",
    whyPlain: "A bit of movement feeds your brain and burns off stress — no gym needed.",
    effort: 2,
    boosts: ["bdnf", "serotonin"],
    dampens: ["cortisol"],
  },
  {
    id: "lunch_offscreen",
    anchor: "Your lunch",
    anchorPlain: "Your lunch",
    upgrade: "Eat it away from the screen — ideally near another person",
    upgradePlain: "Eat it away from your screen — with someone if you can",
    why: "Screen-free, shared eating supports serotonin and vasopressin and spares your attention system.",
    whyPlain: "Eating away from a screen, with company, feeds your 'enough' feeling and real connection.",
    effort: 1,
    boosts: ["serotonin", "vasopressin", "gaba"],
    dampens: [],
  },
  {
    id: "fermented_swap",
    anchor: "One thing on your plate",
    anchorPlain: "One thing on your plate",
    upgrade: "Add a whole or fermented food — yogurt, kimchi, fruit, greens",
    upgradePlain: "Add a whole or fermented food — yogurt, kimchi, fruit, veg",
    why: "Gut and microbiome quality is a major, underrated input to serotonin production.",
    whyPlain: "Most of your 'enough' chemistry is made in the gut — good food feeds it.",
    effort: 1,
    boosts: ["serotonin", "allopregnanolone"],
    dampens: [],
  },
  {
    id: "focus_sprint",
    anchor: "A task you already have to do",
    anchorPlain: "A task you already have to do",
    upgrade: "Do it in one 30–50 min block with your phone in another room",
    upgradePlain: "Do it in one 30–50 min stretch with your phone out of reach",
    why: "Single-tasking is the specific condition acetylcholine needs; it also grows BDNF and lowers cortisol.",
    whyPlain: "One thing at a time is the only way your focus chemistry switches on — and it grows your brain.",
    effort: 2,
    boosts: ["acetylcholine", "bdnf"],
    dampens: ["cortisol"],
  },
  {
    id: "walking_call",
    anchor: "A phone call or catch-up you have anyway",
    anchorPlain: "A phone call you have anyway",
    upgrade: "Take it as a walk instead of sitting",
    upgradePlain: "Take it while walking instead of sitting",
    why: "Turns dead sitting time into movement — raising BDNF and serotonin, trimming cortisol.",
    whyPlain: "Turns sitting time into movement that feeds your brain and eases stress.",
    effort: 1,
    boosts: ["bdnf", "serotonin"],
    dampens: ["cortisol"],
  },
  {
    id: "scroll_to_plan",
    anchor: "Ten minutes of your usual feed-scrolling",
    anchorPlain: "Ten minutes of your usual scrolling",
    upgrade: "Spend it messaging a real friend to actually meet up",
    upgradePlain: "Spend it messaging a real friend to actually meet up",
    why: "Redirects a shallow-oxytocin, dopamine-spiking loop toward the in-person contact that builds vasopressin.",
    whyPlain: "Swaps a shallow hit of 'liked' for a step toward the real belonging that only in-person time builds.",
    effort: 1,
    boosts: ["vasopressin"],
    dampens: ["dopamine", "cortisol"],
  },
  {
    id: "text_to_voice",
    anchor: "A text conversation you're already in",
    anchorPlain: "A text chat you're already having",
    upgrade: "Turn it into a short voice note or a plan to meet in person",
    upgradePlain: "Turn it into a quick voice note or a plan to meet up",
    why: "Voice and presence carry far more bonding signal than typed text toward vasopressin.",
    whyPlain: "Your voice — and being together — build real closeness that typing can't.",
    effort: 2,
    boosts: ["vasopressin", "oxytocin"],
    dampens: [],
  },
  {
    id: "cold_finish",
    anchor: "Your shower",
    anchorPlain: "Your shower",
    upgrade: "End it with 30 seconds of cold",
    upgradePlain: "End it with 30 seconds of cold water",
    why: "A brief cold stressor with a clear finish drives NPY resilience and a durable dopamine baseline.",
    whyPlain: "A quick, deliberate cold shock builds bounce-back resilience and steadier drive.",
    effort: 2,
    boosts: ["npy", "allopregnanolone", "bdnf"],
    dampens: [],
  },
  {
    id: "stairs",
    anchor: "The lift or escalator you'd normally take",
    anchorPlain: "The lift or escalator you'd normally take",
    upgrade: "Take the stairs, briskly",
    upgradePlain: "Take the stairs, briskly",
    why: "Short, sharp effort nudges BDNF and NPY with almost no time cost.",
    whyPlain: "A quick burst of effort feeds brain growth and resilience for almost no time.",
    effort: 1,
    boosts: ["bdnf", "npy"],
    dampens: [],
  },
  {
    id: "evening_dim",
    anchor: "Your last half hour before bed",
    anchorPlain: "Your last half hour before bed",
    upgrade: "Dim the lights and swap the screen for a paper book",
    upgradePlain: "Dim the lights and swap the screen for a paper book",
    why: "Protects the deep sleep that runs glymphatic clearance and restores GABA and allopregnanolone.",
    whyPlain: "Protects the deep sleep that cleans your brain overnight and lets real calm rebuild.",
    effort: 2,
    boosts: ["glymphatic", "gaba", "allopregnanolone"],
    dampens: ["cortisol"],
  },
  {
    id: "breath_before_bed",
    anchor: "The moment you get into bed",
    anchorPlain: "The moment you get into bed",
    upgrade: "Take five slow breaths — longer out than in — before anything else",
    upgradePlain: "Take five slow breaths — longer out than in — before anything else",
    why: "Extended exhalation activates GABA and allopregnanolone and pulls cortisol down.",
    whyPlain: "Slow breathing flips on your body's brakes and settles the day's stress.",
    effort: 1,
    boosts: ["gaba", "allopregnanolone"],
    dampens: ["cortisol"],
  },
  {
    id: "nature_detour",
    anchor: "A route you already travel",
    anchorPlain: "A route you already travel",
    upgrade: "Detour through a park, trees, or water instead of the grey way",
    upgradePlain: "Detour through a park or some trees instead of the grey way",
    why: "Even brief green exposure raises GABA and serotonin and measurably lowers cortisol.",
    whyPlain: "A few minutes of green quietly calms you and lifts your settled chemistry.",
    effort: 2,
    boosts: ["gaba", "serotonin"],
    dampens: ["cortisol"],
  },
];

export interface TransducerDriver {
  id: string;
  name: string;
  plainName: string;
  color: string;
}

export interface TransducerPick {
  transducer: Transducer;
  /** Boosted systems that are currently low for this user (shown as chips). */
  lowChemicals: TransducerDriver[];
  /** True when it serves the user's weakest activating condition. */
  servesWeakestCondition: boolean;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

function driver(c: Chemical): TransducerDriver {
  return { id: c.id, name: c.name, plainName: c.plainName, color: c.color };
}

/** How far a neglected system sits below full activation (0 = full, 1 = floor). */
function neglectDeficit(score: number, c: Chemical): number {
  return clamp01((c.dangerThreshold - score) / c.dangerThreshold);
}

/** How far a triad system sits above its overdrive threshold (0–1). */
function overdrive(score: number, c: Chemical): number {
  return clamp01((score - c.dangerThreshold) / (100 - c.dangerThreshold));
}

/**
 * Rank transducers by how well they target this user's profile: upgrades that
 * lift the systems they're most starved of, and cool whatever triad system is
 * overdriven, rise to the top. Ties break toward lower effort — the whole point
 * is friction-free wins. Returns the top `limit`.
 */
export function generateTransducers(
  scores: ChemicalScores,
  conditions: { slowness: number; embodiment: number; attention: number },
  limit = 5
): TransducerPick[] {
  const weakestCondition = (
    Object.entries(conditions).sort(([, a], [, b]) => a - b)[0]?.[0] ?? "slowness"
  ) as Condition;
  const weakestIsLow = conditions[weakestCondition] < 45;

  const scored = TRANSDUCERS.map((t) => {
    let relevance = 0;
    const servedConditions = new Set<Condition>();

    for (const id of t.boosts) {
      const c = getChemical(id);
      if (c.category === "neglected") {
        relevance += neglectDeficit(scores[id] ?? 0, c);
        for (const cond of c.conditions) servedConditions.add(cond);
      }
    }
    for (const id of t.dampens) {
      const c = getChemical(id);
      if (c.category === "triad") relevance += overdrive(scores[id] ?? 0, c);
    }

    const servesWeakestCondition = servedConditions.has(weakestCondition);
    if (servesWeakestCondition && weakestIsLow) relevance += 0.4;

    const lowChemicals = t.boosts
      .map((id) => getChemical(id))
      .filter(
        (c) => c.category === "neglected" && (scores[c.id] ?? 0) < c.dangerThreshold
      )
      .sort(
        (a, b) => neglectDeficit(scores[b.id] ?? 0, b) - neglectDeficit(scores[a.id] ?? 0, a)
      )
      .slice(0, 3)
      .map(driver);

    return { t, relevance, servesWeakestCondition, lowChemicals };
  });

  scored.sort((a, b) => {
    if (Math.abs(b.relevance - a.relevance) > 0.01) return b.relevance - a.relevance;
    return a.t.effort - b.t.effort;
  });

  return scored.slice(0, limit).map((s) => ({
    transducer: s.t,
    lowChemicals: s.lowChemicals,
    servesWeakestCondition: s.servesWeakestCondition,
  }));
}
