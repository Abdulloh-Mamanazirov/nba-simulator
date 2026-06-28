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
    name: "Social media & scrolling",
    description: "TikTok, Instagram, feeds, YouTube shorts",
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
    name: "Notifications & multitasking",
    description: "Task-switching, checking messages frequently",
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
    name: "Passive screen time",
    description: "TV, Netflix, long-form YouTube — watching, not scrolling",
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
    name: "Deadline-driven work",
    description: "Urgency, performance pressure, time stress",
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
    name: "Deep single-task focus",
    description: "One thing, 60+ min — reading, writing, coding, studying",
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
    name: "Creative or making work",
    description: "Music, art, cooking, craft, building — making things",
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
    name: "Sustained aerobic exercise",
    description: "Running, swimming, cycling — 30+ continuous min",
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
    name: "Brief high-intensity exercise",
    description: "HIIT, gym sets, sprints — under 30 min",
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
    name: "Time in nature",
    description: "Outside — walks, parks, mountains. Not through a screen.",
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
    name: "Cold exposure",
    description: "Cold showers, cold plunge — deliberate cold stress",
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
    name: "Meditation or breathwork",
    description: "Formal practice, stillness, conscious breathing",
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
    name: "Quality sleep",
    description: "7–9 hrs, consistent schedule, no screens before bed",
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
    name: "Morning sunlight",
    description: "Outdoor light within 2 hrs of waking — even overcast days count",
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
    name: "Quality diet & fermented foods",
    description: "Whole foods, vegetables, fermented foods (yogurt, kimchi)",
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
    name: "Deep in-person conversation",
    description: "Face-to-face, 30+ min, someone you know well",
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
    name: "Physical proximity & touch",
    description: "Real time with close others — family, friends, partner",
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
    name: "Alcohol or substances",
    description: "Regular use — artificial relaxation, not genuine rest",
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
