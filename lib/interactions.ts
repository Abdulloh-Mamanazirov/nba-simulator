export interface ChemicalInteraction {
  from: string;
  to: string;
  type: "suppresses" | "supports";
  /**
   * Maximum points of effect applied to the target chemical when the source
   * chemical is fully activated (see scoring.ts → applyInteractions).
   */
  magnitude: number;
  description: string;
  /** Plain-language version of `description`, shown in plain mode. */
  plainDescription: string;
}

/**
 * Second-order relationships between chemical systems. These are both rendered
 * in the Chemical Interaction Map and applied as a second pass in the scoring
 * engine, so what the user sees is what the model actually computes.
 */
export const CHEMICAL_INTERACTIONS: ChemicalInteraction[] = [
  {
    from: "cortisol",
    to: "gaba",
    type: "suppresses",
    magnitude: 14,
    description: "Chronic cortisol prevents genuine GABA-mediated rest",
    plainDescription: "Ongoing stress blocks your ability to really rest",
  },
  {
    from: "cortisol",
    to: "allopregnanolone",
    type: "suppresses",
    magnitude: 16,
    description: "Sustained stress collapses allopregnanolone production",
    plainDescription: "Ongoing stress crushes your natural sense of calm",
  },
  {
    from: "dopamine",
    to: "serotonin",
    type: "suppresses",
    magnitude: 10,
    description: "Chronic dopamine overstimulation depletes serotonin over time",
    plainDescription: "Constant chasing slowly wears down your 'enough' feeling",
  },
  {
    from: "gaba",
    to: "allopregnanolone",
    type: "supports",
    magnitude: 10,
    description: "GABA activation facilitates allopregnanolone at GABA-A receptors",
    plainDescription: "Genuine rest helps your deep calm build up",
  },
  {
    from: "bdnf",
    to: "serotonin",
    type: "supports",
    magnitude: 6,
    description: "BDNF and serotonin have a bidirectional positive relationship",
    plainDescription: "Brain growth and the 'enough' feeling lift each other",
  },
  {
    from: "serotonin",
    to: "bdnf",
    type: "supports",
    magnitude: 6,
    description: "Serotonin promotes BDNF expression in the hippocampus",
    plainDescription: "Feeling settled helps your brain grow",
  },
  {
    from: "cortisol",
    to: "bdnf",
    type: "suppresses",
    magnitude: 10,
    description: "Chronic cortisol reduces BDNF and hippocampal neurogenesis",
    plainDescription: "Ongoing stress slows down brain growth",
  },
  {
    from: "glymphatic",
    to: "bdnf",
    type: "supports",
    magnitude: 8,
    description: "Quality sleep supports BDNF production and brain health",
    plainDescription: "Good sleep feeds brain growth",
  },
  {
    from: "cortisol",
    to: "glymphatic",
    type: "suppresses",
    magnitude: 12,
    description: "Stress hormones impair deep sleep and glymphatic clearance",
    plainDescription: "Stress wrecks the deep sleep that cleans your brain",
  },
];
