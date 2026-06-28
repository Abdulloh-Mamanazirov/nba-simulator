export type ActivityCategory =
  | "digital"
  | "work"
  | "body"
  | "mind"
  | "social";

export interface ImpactChip {
  chemicalId: string;
  direction: "up" | "down";
  strength: 1 | 2 | 3;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  category: ActivityCategory;
  icon: string;
  impacts: ImpactChip[];
  /** Weight map: chemicalId → effect magnitude. Positive = boost, negative = deplete */
  weights: Record<string, number>;
}

export const FREQUENCY_LABELS = [
  "Never",
  "Monthly",
  "Weekly",
  "3–4×/wk",
  "Daily",
] as const;

export const CATEGORY_LABELS: Record<ActivityCategory, string> = {
  digital: "Digital",
  work: "Work",
  body: "Body",
  mind: "Mind & Rest",
  social: "Social",
};

export const CATEGORY_ICONS: Record<ActivityCategory, string> = {
  digital: "📱",
  work: "💼",
  body: "🏃",
  mind: "🧘",
  social: "🤝",
};

export const ACTIVITIES: Activity[] = [
  // === DIGITAL ===
  {
    id: "social_media",
    name: "Social Media & Scrolling",
    description: "Time spent on feeds, stories, short-form video, doomscrolling",
    category: "digital",
    icon: "📱",
    impacts: [
      { chemicalId: "dopamine", direction: "up", strength: 2 },
      { chemicalId: "cortisol", direction: "up", strength: 1 },
      { chemicalId: "acetylcholine", direction: "down", strength: 2 },
    ],
    weights: {
      dopamine: 18,
      cortisol: 10,
      oxytocin: 12,
      acetylcholine: -22,
      serotonin: -8,
      gaba: -10,
      allopregnanolone: -6,
    },
  },
  {
    id: "notifications",
    name: "Notifications & Multitasking",
    description:
      "Constant pings, tab-switching, checking multiple apps simultaneously",
    category: "digital",
    icon: "🔔",
    impacts: [
      { chemicalId: "cortisol", direction: "up", strength: 2 },
      { chemicalId: "acetylcholine", direction: "down", strength: 3 },
    ],
    weights: {
      cortisol: 16,
      dopamine: 10,
      acetylcholine: -28,
      gaba: -12,
      allopregnanolone: -10,
      serotonin: -6,
    },
  },
  {
    id: "passive_screen",
    name: "Passive Screen Time / TV",
    description: "Streaming, watching without engagement, background content",
    category: "digital",
    icon: "📺",
    impacts: [
      { chemicalId: "dopamine", direction: "up", strength: 1 },
    ],
    weights: {
      dopamine: 8,
      gaba: -6,
      acetylcholine: -8,
      serotonin: -4,
    },
  },

  // === WORK ===
  {
    id: "deadline_work",
    name: "Deadline-Driven Work",
    description: "Time-pressured tasks, urgent deliverables, reactive work",
    category: "work",
    icon: "⏰",
    impacts: [
      { chemicalId: "cortisol", direction: "up", strength: 2 },
      { chemicalId: "allopregnanolone", direction: "down", strength: 1 },
    ],
    weights: {
      cortisol: 20,
      dopamine: 8,
      allopregnanolone: -14,
      gaba: -10,
      serotonin: -6,
    },
  },
  {
    id: "deep_work",
    name: "Deep Single-Task Focus (60+ min)",
    description:
      "Sustained, uninterrupted work on one thing — coding, writing, research",
    category: "work",
    icon: "🎯",
    impacts: [
      { chemicalId: "acetylcholine", direction: "up", strength: 2 },
      { chemicalId: "bdnf", direction: "up", strength: 1 },
    ],
    weights: {
      acetylcholine: 28,
      bdnf: 14,
      dopamine: -4,
      cortisol: -6,
    },
  },
  {
    id: "creative_work",
    name: "Creative / Making Work",
    description: "Art, music, building, cooking — making something with your hands or mind",
    category: "work",
    icon: "🎨",
    impacts: [
      { chemicalId: "acetylcholine", direction: "up", strength: 2 },
      { chemicalId: "npy", direction: "up", strength: 1 },
    ],
    weights: {
      acetylcholine: 22,
      npy: 12,
      serotonin: 8,
      bdnf: 8,
      dopamine: -2,
    },
  },

  // === BODY ===
  {
    id: "aerobic",
    name: "Sustained Aerobic (30+ min)",
    description: "Running, cycling, swimming — continuous effort past 30 minutes",
    category: "body",
    icon: "🏃",
    impacts: [
      { chemicalId: "anandamide", direction: "up", strength: 2 },
      { chemicalId: "bdnf", direction: "up", strength: 2 },
      { chemicalId: "npy", direction: "up", strength: 1 },
    ],
    weights: {
      anandamide: 32,
      bdnf: 24,
      npy: 16,
      serotonin: 10,
      cortisol: -12,
      gaba: 8,
      allopregnanolone: 6,
    },
  },
  {
    id: "hiit",
    name: "Brief HIIT (under 30 min)",
    description: "High-intensity intervals, sprints, intense gym sessions",
    category: "body",
    icon: "💪",
    impacts: [
      { chemicalId: "npy", direction: "up", strength: 1 },
      { chemicalId: "bdnf", direction: "up", strength: 1 },
    ],
    weights: {
      npy: 12,
      bdnf: 10,
      cortisol: 4,
      dopamine: 6,
    },
  },
  {
    id: "nature",
    name: "Time in Nature",
    description: "Parks, forests, water, open sky — being physically outside",
    category: "body",
    icon: "🌿",
    impacts: [
      { chemicalId: "gaba", direction: "up", strength: 1 },
      { chemicalId: "serotonin", direction: "up", strength: 1 },
      { chemicalId: "cortisol", direction: "down", strength: 1 },
    ],
    weights: {
      gaba: 14,
      serotonin: 12,
      cortisol: -10,
      allopregnanolone: 8,
      anandamide: 4,
    },
  },
  {
    id: "cold_exposure",
    name: "Cold Exposure / Showers",
    description: "Cold showers, ice baths, cold water immersion",
    category: "body",
    icon: "🧊",
    impacts: [
      { chemicalId: "npy", direction: "up", strength: 2 },
      { chemicalId: "bdnf", direction: "up", strength: 1 },
      { chemicalId: "allopregnanolone", direction: "up", strength: 1 },
    ],
    weights: {
      npy: 18,
      bdnf: 10,
      allopregnanolone: 10,
      dopamine: 6,
      cortisol: -4,
    },
  },

  // === MIND & REST ===
  {
    id: "meditation",
    name: "Meditation / Breathwork",
    description: "Formal sitting practice, breathwork, body scanning",
    category: "mind",
    icon: "🧘",
    impacts: [
      { chemicalId: "gaba", direction: "up", strength: 2 },
      { chemicalId: "allopregnanolone", direction: "up", strength: 2 },
      { chemicalId: "acetylcholine", direction: "up", strength: 1 },
    ],
    weights: {
      gaba: 22,
      allopregnanolone: 20,
      acetylcholine: 14,
      serotonin: 10,
      cortisol: -14,
    },
  },
  {
    id: "sleep",
    name: "Quality Sleep (7–9 hrs)",
    description: "Consistent, deep, uninterrupted sleep in a dark room",
    category: "mind",
    icon: "😴",
    impacts: [
      { chemicalId: "glymphatic", direction: "up", strength: 2 },
      { chemicalId: "allopregnanolone", direction: "up", strength: 2 },
      { chemicalId: "gaba", direction: "up", strength: 2 },
      { chemicalId: "cortisol", direction: "down", strength: 1 },
    ],
    weights: {
      glymphatic: 30,
      allopregnanolone: 22,
      gaba: 20,
      cortisol: -16,
      serotonin: 10,
      bdnf: 8,
    },
  },
  {
    id: "sunlight",
    name: "Morning Sunlight",
    description: "Direct sunlight exposure within 1–2 hours of waking",
    category: "mind",
    icon: "☀️",
    impacts: [
      { chemicalId: "serotonin", direction: "up", strength: 2 },
    ],
    weights: {
      serotonin: 18,
      cortisol: -6,
      dopamine: 4,
      allopregnanolone: 4,
    },
  },
  {
    id: "diet",
    name: "Quality Diet & Fermented Foods",
    description:
      "Whole foods, fiber, fermented foods, minimal processed food",
    category: "mind",
    icon: "🥗",
    impacts: [
      { chemicalId: "serotonin", direction: "up", strength: 2 },
      { chemicalId: "allopregnanolone", direction: "up", strength: 1 },
    ],
    weights: {
      serotonin: 16,
      allopregnanolone: 8,
      gaba: 6,
      bdnf: 4,
      glymphatic: 4,
    },
  },

  // === SOCIAL ===
  {
    id: "deep_convo",
    name: "Deep In-Person Conversation (30+ min)",
    description:
      "Extended, meaningful face-to-face conversation — not small talk",
    category: "social",
    icon: "💬",
    impacts: [
      { chemicalId: "vasopressin", direction: "up", strength: 2 },
      { chemicalId: "acetylcholine", direction: "up", strength: 1 },
      { chemicalId: "serotonin", direction: "up", strength: 1 },
    ],
    weights: {
      vasopressin: 24,
      acetylcholine: 12,
      serotonin: 10,
      oxytocin: 8,
      gaba: 4,
    },
  },
  {
    id: "touch",
    name: "Physical Proximity & Touch",
    description:
      "Hugs, holding hands, sitting close, physical affection with trusted people",
    category: "social",
    icon: "🤗",
    impacts: [
      { chemicalId: "vasopressin", direction: "up", strength: 2 },
      { chemicalId: "serotonin", direction: "up", strength: 1 },
    ],
    weights: {
      vasopressin: 22,
      serotonin: 12,
      oxytocin: 10,
      gaba: 6,
      allopregnanolone: 6,
      cortisol: -8,
    },
  },
  {
    id: "alcohol",
    name: "Alcohol / Substances",
    description: "Drinking, recreational substances, cannabis",
    category: "social",
    icon: "🍷",
    impacts: [
      { chemicalId: "gaba", direction: "down", strength: 1 },
      { chemicalId: "glymphatic", direction: "down", strength: 2 },
      { chemicalId: "serotonin", direction: "down", strength: 1 },
    ],
    weights: {
      gaba: -14,
      glymphatic: -20,
      serotonin: -12,
      allopregnanolone: -10,
      bdnf: -8,
      dopamine: 10,
      cortisol: 6,
    },
  },
];

export function getActivity(id: string): Activity {
  const a = ACTIVITIES.find((a) => a.id === id);
  if (!a) throw new Error(`Unknown activity: ${id}`);
  return a;
}

export function getActivitiesByCategory(
  category: ActivityCategory
): Activity[] {
  return ACTIVITIES.filter((a) => a.category === category);
}
