import { getChemical, type Chemical } from "./chemicals";
import type { ChemicalScores } from "./scoring";
import { NEGLECTED_CHEMICALS } from "./chemicals";

export type OutcomeTone = "risk" | "positive" | "neutral";

/**
 * How confident the model is that this experience applies. Deliberately
 * hedged — the whole section is a *possibility*, never a diagnosis.
 *  - "possible"  → a weak-to-moderate signal
 *  - "elevated"  → a clear signal
 *  - "likely"    → a strong, converging signal
 */
export type OutcomeLikelihood = "possible" | "elevated" | "likely";

export interface OutcomeDriver {
  id: string;
  name: string;
  plainName: string;
  color: string;
}

export interface PossibleOutcome {
  id: string;
  title: string;
  body: string;
  likelihood: OutcomeLikelihood;
  tone: OutcomeTone;
  drivers: OutcomeDriver[];
}

export interface ConditionScores {
  slowness: number;
  embodiment: number;
  attention: number;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** How far a triad system sits above its overdrive threshold, as 0–1. */
function overdrive(score: number, chem: Chemical): number {
  return clamp01((score - chem.dangerThreshold) / (100 - chem.dangerThreshold));
}

/** How far a neglected system sits below its starvation threshold, as 0–1. */
function deficit(score: number, chem: Chemical): number {
  return clamp01((chem.starvationThreshold - score) / chem.starvationThreshold);
}

/** How fully a neglected system is activated (score toward its ceiling), 0–1. */
function activation(score: number, chem: Chemical): number {
  return clamp01(
    (score - chem.starvationThreshold) /
      (chem.dangerThreshold - chem.starvationThreshold)
  );
}

function levelFrom(severity: number): OutcomeLikelihood {
  if (severity >= 0.6) return "likely";
  if (severity >= 0.3) return "elevated";
  return "possible";
}

function driver(id: string): OutcomeDriver {
  const c = getChemical(id);
  return { id: c.id, name: c.name, plainName: c.plainName, color: c.color };
}

interface RankedOutcome extends PossibleOutcome {
  severity: number;
}

/**
 * Derive a small set of *possible* lived-experience outcomes from a profile.
 * These are probabilistic pattern-matches on the neurochemical scores — framed
 * as possibilities, not predictions or medical claims. Risk patterns are ranked
 * by how strong the underlying signal is; positive patterns surface the systems
 * that are working in the user's favour.
 */
export function generatePossibleOutcomes(
  scores: ChemicalScores,
  conditions: ConditionScores,
  bandwidth: number
): PossibleOutcome[] {
  const s = (id: string) => scores[id] ?? 0;
  const chem = (id: string) => getChemical(id);

  const dopamine = s("dopamine");
  const cortisol = s("cortisol");
  const oxytocin = s("oxytocin");
  const serotonin = s("serotonin");
  const gaba = s("gaba");
  const allo = s("allopregnanolone");
  const acetylcholine = s("acetylcholine");
  const vasopressin = s("vasopressin");
  const glymphatic = s("glymphatic");
  const npy = s("npy");
  const bdnf = s("bdnf");
  const anandamide = s("anandamide");

  const risks: RankedOutcome[] = [];
  const positives: RankedOutcome[] = [];

  const below = (id: string) => s(id) < chem(id).starvationThreshold;
  const over = (id: string) => s(id) >= chem(id).dangerThreshold;

  // — RISK PATTERNS —————————————————————————————————————————————

  // Seeking without arrival: hot dopamine + depleted "enough" signal.
  if (over("dopamine") && below("serotonin")) {
    const severity =
      (overdrive(dopamine, chem("dopamine")) +
        deficit(serotonin, chem("serotonin"))) /
      2;
    risks.push({
      id: "seeking-without-arrival",
      title: "Seeking without arrival",
      body: "With seeking drive running hot and the 'enough' signal (serotonin) depleted, ordinary rewards may start to feel flat. You might notice yourself reaching for the next thing — refresh, scroll, snack, buy — without the satisfaction it used to deliver.",
      likelihood: levelFrom(severity),
      tone: "risk",
      drivers: [driver("dopamine"), driver("serotonin")],
      severity,
    });
  }

  // Wired but can't wind down: elevated stress + offline calming systems.
  if (over("cortisol") && (below("gaba") || below("allopregnanolone"))) {
    const restDeficit = Math.max(
      deficit(gaba, chem("gaba")),
      deficit(allo, chem("allopregnanolone"))
    );
    const severity = (overdrive(cortisol, chem("cortisol")) + restDeficit) / 2;
    risks.push({
      id: "wired-but-tired",
      title: "Wired, but unable to wind down",
      body: "Stress mobilisation is elevated while the systems that produce genuine calm sit below threshold. This pattern often shows up as a mind that won't switch off at night, trouble falling asleep, or feeling tired and tense at the same time.",
      likelihood: levelFrom(severity),
      tone: "risk",
      drivers: [driver("cortisol"), driver("gaba")],
      severity,
    });
  }

  // Focus that keeps slipping: low acetylcholine, reinforced by low attention.
  if (below("acetylcholine")) {
    const severity =
      0.6 * deficit(acetylcholine, chem("acetylcholine")) +
      0.4 * clamp01((45 - conditions.attention) / 45);
    risks.push({
      id: "fragmented-focus",
      title: "Focus that keeps slipping",
      body: "The chemistry of sustained attention is running low. Staying with a long read, a complex idea, or a single task may feel harder than it should — attention repeatedly pulled sideways before it settles.",
      likelihood: levelFrom(severity),
      tone: "risk",
      drivers: [driver("acetylcholine")],
      severity,
    });
  }

  // Connected but still lonely: surface warmth present, deep bonding absent.
  if (below("vasopressin") && oxytocin >= 55) {
    const severity =
      0.7 * deficit(vasopressin, chem("vasopressin")) +
      0.3 * clamp01((oxytocin - 55) / 45);
    risks.push({
      id: "lonely-in-a-crowd",
      title: "Connected, yet still lonely",
      body: "There may be plenty of surface-level contact while the deeper bonding chemistry — which only accumulates through repeated, in-person presence — stays low. Subjectively this can feel like being around people yet still not quite seen.",
      likelihood: levelFrom(severity),
      tone: "risk",
      drivers: [driver("vasopressin"), driver("oxytocin")],
      severity,
    });
  }

  // Recovery debt: under-running overnight clearance.
  if (below("glymphatic")) {
    const severity = deficit(glymphatic, chem("glymphatic"));
    risks.push({
      id: "recovery-debt",
      title: "Recovery debt building up",
      body: "Your brain's overnight clearance system appears to be under-running. Over time this pattern is associated with morning grogginess, a foggier head, and the sense that sleep isn't quite doing its repair work.",
      likelihood: levelFrom(severity),
      tone: "risk",
      drivers: [driver("glymphatic")],
      severity,
    });
  }

  // Thin stress buffer: resilience + growth signals both quiet.
  if (below("npy") && below("bdnf")) {
    const severity =
      (deficit(npy, chem("npy")) + deficit(bdnf, chem("bdnf"))) / 2;
    risks.push({
      id: "thin-buffer",
      title: "A thinner buffer against setbacks",
      body: "The systems that build resilience and grow new neural connections are both quiet. Knocks and stressors may land harder and linger longer, with less of the natural bounce-back afterward.",
      likelihood: levelFrom(severity),
      tone: "risk",
      drivers: [driver("npy"), driver("bdnf")],
      severity,
    });
  }

  // — POSITIVE PATTERNS —————————————————————————————————————————

  // Broad range is protective.
  if (bandwidth >= 6) {
    const severity = clamp01((bandwidth - 5) / 4);
    positives.push({
      id: "broad-range",
      title: "A broad range is working for you",
      body: "Most of your neglected systems are online. That breadth tends to translate into steadier mood, better tolerance for stress, and a wider set of states you can actually reach on a given day.",
      likelihood: bandwidth >= 8 ? "likely" : "elevated",
      tone: "positive",
      drivers: NEGLECTED_CHEMICALS.filter(
        (c) => s(c.id) >= c.starvationThreshold
      )
        .slice(0, 3)
        .map((c) => driver(c.id)),
      severity,
    });
  }

  // Expansive calm is accessible: anandamide active.
  if (anandamide >= chem("anandamide").starvationThreshold) {
    const severity = activation(anandamide, chem("anandamide"));
    positives.push({
      id: "expansive-calm",
      title: "Expansive, timeless presence is within reach",
      body: "Your endocannabinoid tone is active — the chemistry behind the calm, spacious 'flow' that sustained movement produces. States that feel like expansion rather than reward are more available to you than to most.",
      likelihood: severity >= 0.5 ? "likely" : "possible",
      tone: "positive",
      drivers: [driver("anandamide")],
      severity,
    });
  }

  // Rest architecture is holding: both calm systems above threshold.
  if (!below("gaba") && !below("allopregnanolone") && cortisol < chem("cortisol").dangerThreshold) {
    const severity =
      (activation(gaba, chem("gaba")) +
        activation(allo, chem("allopregnanolone"))) /
      2;
    positives.push({
      id: "rest-holding",
      title: "Your capacity for real rest is intact",
      body: "Both of your core calming systems are above threshold and stress isn't overriding them. Genuine downshifting — the kind that actually restores you rather than just numbing — is something your nervous system can still do.",
      likelihood: severity >= 0.4 ? "elevated" : "possible",
      tone: "positive",
      drivers: [driver("gaba"), driver("allopregnanolone")],
      severity,
    });
  }

  risks.sort((a, b) => b.severity - a.severity);
  positives.sort((a, b) => b.severity - a.severity);

  // Lead with the strongest signals but keep at least one positive in view
  // when the profile has both, so the section isn't purely alarming.
  const combined: RankedOutcome[] = [];
  if (positives.length > 0 && risks.length >= 4) {
    combined.push(...risks.slice(0, 3), positives[0], ...risks.slice(3));
  } else {
    combined.push(...risks, ...positives);
  }

  const result: PossibleOutcome[] = combined.slice(0, 5).map((o) => ({
    id: o.id,
    title: o.title,
    body: o.body,
    likelihood: o.likelihood,
    tone: o.tone,
    drivers: o.drivers,
  }));

  // Fallback: a balanced profile with no strong signal in either direction.
  if (result.length === 0) {
    result.push({
      id: "balanced",
      title: "No single pattern dominates",
      body: "Your profile doesn't push strongly toward any one experiential outcome right now. That's a reasonably balanced place to be — the opportunity is less about damage control and more about deepening whichever systems you'd like more of.",
      likelihood: "possible",
      tone: "neutral",
      drivers: [],
    });
  }

  return result;
}
