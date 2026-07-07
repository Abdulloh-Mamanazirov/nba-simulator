export type ChemicalCategory = "triad" | "neglected";

export interface Chemical {
  id: string;
  name: string;
  plainName: string;
  color: string;
  category: ChemicalCategory;
  baseScore: number;
  starvationThreshold: number;
  dangerThreshold: number;
  conditions: ("slowness" | "embodiment" | "attention")[];
  description: string;
  scientificDetail: string;
  /** One friendly, jargon-free sentence shown in plain-language mode. */
  plainDescription: string;
}

export const CHEMICALS: Chemical[] = [
  // === THE DOMINANT TRIAD ===
  {
    id: "dopamine",
    name: "Dopamine",
    plainName: "Seeking Drive",
    color: "#FF5722",
    category: "triad",
    baseScore: 72,
    starvationThreshold: 35,
    dangerThreshold: 68,
    conditions: [],
    description:
      "Anticipation and reward-seeking. Variable-ratio reinforcement from social media and notifications exploits this continuously.",
    scientificDetail:
      "Chronic overactivation downregulates D2 receptors — ordinary life stops feeling like enough. Its mirror chemical, dynorphin (kappa-opioid), activates after every peak and produces dysphoria and motivational withdrawal. The result is structural anhedonia — not depression, but a persistent background flatness.",
    plainDescription:
      "The 'I want that' chemical. It drives you to chase the next like, snack, or purchase — great in short bursts, draining on a constant loop.",
  },
  {
    id: "cortisol",
    name: "Cortisol",
    plainName: "Stress Mobilization",
    color: "#E53E3E",
    category: "triad",
    baseScore: 70,
    starvationThreshold: 35,
    dangerThreshold: 68,
    conditions: [],
    description:
      "Stress mobilization designed for acute, time-limited threats. Chronic low-grade elevation never resolves.",
    scientificDetail:
      "Financial precarity, social comparison, and information overload maintain chronic elevation. Sustained cortisol measurably shrinks hippocampal grey matter. The world gets smaller and more threatening over time.",
    plainDescription:
      "Your built-in alarm system. It's meant for real emergencies, but modern life leaves it quietly switched on all day.",
  },
  {
    id: "oxytocin",
    name: "Oxytocin (Shallow)",
    plainName: "Surface Warmth",
    color: "#F6AD55",
    category: "triad",
    baseScore: 65,
    starvationThreshold: 35,
    dangerThreshold: 68,
    conditions: [],
    description:
      "Social warmth generated constantly through likes, comments, and parasocial connections — but only the surface version.",
    scientificDetail:
      "Without its depth counterpart (vasopressin), which requires embodied co-presence over time, shallow oxytocin actually amplifies in-group/out-group division at scale. Digital media generates the feeling of connection without its neurochemical substance.",
    plainDescription:
      "The quick hit of feeling liked — a comment, a heart, a reply. It's real, but shallow, and it fades almost as fast as it arrives.",
  },

  // === THE NEGLECTED ARCHITECTURE ===
  {
    id: "gaba",
    name: "GABA",
    plainName: "Deep Rest",
    color: "#38D39F",
    category: "neglected",
    baseScore: 22,
    starvationThreshold: 32,
    dangerThreshold: 68,
    conditions: ["slowness"],
    description:
      "Genuine nervous system rest. Not tiredness. Not sedation. Real stillness, requiring a sustained absence of urgency.",
    scientificDetail:
      "Alcohol hijacks this receptor artificially; its cultural prevalence is highest where genuine rest is scarcest. True GABA activation requires the absence of perceived threat — something the modern information environment makes structurally difficult.",
    plainDescription:
      "The brake pedal for your nervous system. It's what real calm feels like — not tired, just settled and safe.",
  },
  {
    id: "vasopressin",
    name: "Vasopressin",
    plainName: "Deep Belonging",
    color: "#63B3ED",
    category: "neglected",
    baseScore: 18,
    starvationThreshold: 30,
    dangerThreshold: 68,
    conditions: ["embodiment", "attention"],
    description:
      "Deep attachment and belonging. Oxytocin's depth counterpart. Accumulates only through repeated, embodied co-presence over time.",
    scientificDetail:
      "A video call cannot generate this. A parasocial relationship cannot generate this. A single great conversation cannot generate this. It requires bodies in the same room, repeatedly, over months and years.",
    plainDescription:
      "The feeling of truly belonging. It only builds from real time with the same people, in person, again and again over months.",
  },
  {
    id: "acetylcholine",
    name: "Acetylcholine",
    plainName: "Flow State",
    color: "#7F9CF5",
    category: "neglected",
    baseScore: 20,
    starvationThreshold: 32,
    dangerThreshold: 68,
    conditions: ["attention"],
    description:
      "Depth of attention and genuine learning absorption. Requires undivided, sustained engagement with a single thing.",
    scientificDetail:
      "Fragmented attention doesn't just reduce it — task-switching is the specific condition that stops it from activating at all. The modern attention economy is architecturally hostile to acetylcholine production.",
    plainDescription:
      "Your focus chemical. It switches on when you give one thing your full attention — and switches off the moment you start juggling.",
  },
  {
    id: "serotonin",
    name: "Serotonin",
    plainName: "Quiet Sufficiency",
    color: "#B794F4",
    category: "neglected",
    baseScore: 25,
    starvationThreshold: 33,
    dangerThreshold: 68,
    conditions: ["slowness"],
    description:
      "The felt sense of being sufficient, present, not scanning for what's missing. 90% produced in the gut.",
    scientificDetail:
      "Diet quality and microbiome health are deeply underappreciated variables. Serotonin is not the 'happiness chemical' — it's the 'enough chemical.' Its depletion doesn't cause sadness; it causes seeking.",
    plainDescription:
      "The 'I have enough' feeling. When it's low you don't feel sad exactly — you just keep restlessly looking for something more.",
  },
  {
    id: "anandamide",
    name: "Anandamide",
    plainName: "Expansive Presence",
    color: "#2CC4B0",
    category: "neglected",
    baseScore: 15,
    starvationThreshold: 30,
    dangerThreshold: 68,
    conditions: ["embodiment"],
    description:
      "Expansive, timeless presence. The actual chemistry behind the runner's high (not endorphins — that's the painkiller).",
    scientificDetail:
      "Activated by 30+ continuous minutes of aerobic effort. Brief high-intensity exercise doesn't reach this threshold. The sensation is qualitatively different from dopamine reward — it's not pleasure, it's expansion.",
    plainDescription:
      "The calm, open, timeless feeling — the real 'runner's high.' It shows up after long, steady movement, not a quick workout.",
  },
  {
    id: "bdnf",
    name: "BDNF",
    plainName: "Brain Growth",
    color: "#48BB78",
    category: "neglected",
    baseScore: 20,
    starvationThreshold: 32,
    dangerThreshold: 68,
    conditions: ["embodiment", "attention"],
    description:
      "Brain-derived neurotrophic factor. Brain fertilizer. Promotes hippocampal neurogenesis.",
    scientificDetail:
      "Sedentary life doesn't just affect the body: it literally shrinks the memory-making regions of the brain. BDNF is the primary growth signal for new neural connections and is strongly exercise-dependent.",
    plainDescription:
      "Fertilizer for your brain. It helps you grow new connections and learn — and exercise is what releases it.",
  },
  {
    id: "npy",
    name: "Neuropeptide Y",
    plainName: "Earned Resilience",
    color: "#ECC94B",
    category: "neglected",
    baseScore: 16,
    starvationThreshold: 30,
    dangerThreshold: 68,
    conditions: ["embodiment"],
    description:
      "Released after successful resolution of genuine adversity. A risk-managed, friction-free environment prevents this from accumulating.",
    scientificDetail:
      "Stimulation without resolution produces no resilience. NPY is what separates stress that strengthens from stress that damages. It requires voluntary engagement with difficulty that has a resolution — not chronic ambient threat.",
    plainDescription:
      "The bounce-back chemical. You earn it by taking on a real challenge and getting through it — not by everyday background stress.",
  },
  {
    id: "allopregnanolone",
    name: "Allopregnanolone",
    plainName: "Deep Calm",
    color: "#B67FEA",
    category: "neglected",
    baseScore: 18,
    starvationThreshold: 30,
    dangerThreshold: 68,
    conditions: ["slowness"],
    description:
      "The brain's own anxiolytic. A neurosteroid producing qualitative groundedness. Collapses almost immediately under chronic stress or poor sleep.",
    scientificDetail:
      "Acts at GABA-A receptors, producing a qualitatively different calm than GABA itself. Almost never discussed in public health despite being a primary calm-down system. It doesn't reduce anxiety — it makes the ground feel solid.",
    plainDescription:
      "Your body's own anti-anxiety chemical. It makes the ground feel solid underfoot — and it collapses fast under stress or poor sleep.",
  },
  {
    id: "glymphatic",
    name: "Glymphatic System",
    plainName: "Brain Clearance",
    color: "#76C4F0",
    category: "neglected",
    baseScore: 24,
    starvationThreshold: 35,
    dangerThreshold: 68,
    conditions: ["slowness"],
    description:
      "Brain waste clearance, first described in 2012. Runs only during deep sleep, flushing out metabolic waste including amyloid-beta.",
    scientificDetail:
      "Poor sleep doesn't just cause fatigue: it leaves the brain physically dirty. The glymphatic system uses cerebrospinal fluid to flush metabolic waste, and this process requires sustained deep sleep — not just time in bed.",
    plainDescription:
      "Your brain's overnight rinse cycle. Deep sleep flushes out the day's waste — skip it and your head feels foggy the next day.",
  },
];

export const TRIAD_CHEMICALS = CHEMICALS.filter((c) => c.category === "triad");
export const NEGLECTED_CHEMICALS = CHEMICALS.filter(
  (c) => c.category === "neglected"
);

export function getChemical(id: string): Chemical {
  const c = CHEMICALS.find((c) => c.id === id);
  if (!c) throw new Error(`Unknown chemical: ${id}`);
  return c;
}
