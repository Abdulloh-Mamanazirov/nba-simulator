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
  },
  {
    from: "cortisol",
    to: "allopregnanolone",
    type: "suppresses",
    magnitude: 16,
    description: "Sustained stress collapses allopregnanolone production",
  },
  {
    from: "dopamine",
    to: "serotonin",
    type: "suppresses",
    magnitude: 10,
    description: "Chronic dopamine overstimulation depletes serotonin over time",
  },
  {
    from: "gaba",
    to: "allopregnanolone",
    type: "supports",
    magnitude: 10,
    description: "GABA activation facilitates allopregnanolone at GABA-A receptors",
  },
  {
    from: "bdnf",
    to: "serotonin",
    type: "supports",
    magnitude: 6,
    description: "BDNF and serotonin have a bidirectional positive relationship",
  },
  {
    from: "serotonin",
    to: "bdnf",
    type: "supports",
    magnitude: 6,
    description: "Serotonin promotes BDNF expression in the hippocampus",
  },
  {
    from: "cortisol",
    to: "bdnf",
    type: "suppresses",
    magnitude: 10,
    description: "Chronic cortisol reduces BDNF and hippocampal neurogenesis",
  },
  {
    from: "glymphatic",
    to: "bdnf",
    type: "supports",
    magnitude: 8,
    description: "Quality sleep supports BDNF production and brain health",
  },
  {
    from: "cortisol",
    to: "glymphatic",
    type: "suppresses",
    magnitude: 12,
    description: "Stress hormones impair deep sleep and glymphatic clearance",
  },
];
