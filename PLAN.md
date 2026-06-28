Here's a full brief, written to give Opus 4.7 everything it needs — the science, the design system, the logic, and a few new directions to explore.

---

# Neurochemical Bandwidth Audit — Project Brief

## The Core Idea

Build a 3-step interactive self-assessment web application called the **Neurochemical Bandwidth Audit**. The thesis, drawn from a 2026 research paper by J. Ricketts, is this:

> *"The central failure of late modernity may be less an excess of stimulation than a systematic impoverishment of inhabitable range."*

The human brain runs on 100+ neurochemical signaling systems. Late modernity selectively overloads three of them — dopamine, cortisol, and shallow oxytocin — while systematically degrading the conditions the remaining architecture needs to activate. The app makes this visible, personal, and actionable.

The user rates how often they engage in 17 daily activities. The system maps these onto 12 neurochemical systems, calculates a "bandwidth score" (how many neglected channels are active), and then generates a personalized prescription — the specific changes that would most expand their range based on their actual results.

---

## The Science — What to Know Before Building

### The Dominant Triad (chronically overstimulated)

These three systems are activated automatically by the modern environment, often past their healthy threshold:

- **Dopamine** — anticipation and reward-seeking. Variable-ratio reinforcement (social media, notifications) exploits this continuously. Chronic overactivation downregulates D2 receptors — ordinary life stops feeling like enough. Its mirror chemical, **dynorphin** (kappa-opioid), activates after every peak and produces dysphoria and motivational withdrawal. The result is **structural anhedonia** — not depression, but a persistent background flatness. This is the candidate mechanism for why people in historically wealthy societies report flat wellbeing despite rising material conditions.
- **Cortisol** — stress mobilization designed for acute, time-limited threats. Chronic low-grade elevation (financial precarity, social comparison, information overload) never resolves. Sustained elevation measurably shrinks hippocampal grey matter. The world gets smaller and more threatening over time.
- **Oxytocin (shallow)** — social warmth. Digital media generates this constantly through likes, comments, and parasocial connections — but only the surface version. Without its depth counterpart (vasopressin), which requires embodied co-presence over time, shallow oxytocin actually amplifies in-group/out-group division at scale.

### The Neglected Architecture (nine systems that require specific conditions)

These systems have something in common: they cannot be activated quickly, cheaply, or digitally. They require slowness, embodiment, or sustained attention — exactly what the modern economic and technological environment removes.

- **GABA** — genuine nervous system rest. Not tiredness. Not sedation. Real stillness, requiring a sustained absence of urgency. Alcohol hijacks this receptor artificially; its cultural prevalence is highest where genuine rest is scarcest.
- **Vasopressin** — deep attachment and belonging. Oxytocin's depth counterpart. Accumulates only through repeated, embodied co-presence over time. A video call cannot generate this. A parasocial relationship cannot generate this. A single great conversation cannot generate this. It requires bodies in the same room, repeatedly, over months and years.
- **Acetylcholine** — depth of attention and genuine learning absorption. Requires undivided, sustained engagement with a single thing. Fragmented attention doesn't just reduce it — task-switching is the specific condition that stops it from activating at all.
- **Serotonin** — the felt sense of being sufficient, present, not scanning for what's missing. 90% produced in the gut. Diet quality and microbiome health are deeply underappreciated variables.
- **Anandamide** — expansive, timeless presence. The actual chemistry behind the runner's high (not endorphins — that's the painkiller). Activated by 30+ continuous minutes of aerobic effort. Brief high-intensity exercise doesn't reach this threshold.
- **BDNF** — brain-derived neurotrophic factor. Brain fertilizer. Promotes hippocampal neurogenesis. Sedentary life doesn't just affect the body: it literally shrinks the memory-making regions of the brain.
- **Neuropeptide Y** — earned resilience. Released after successful resolution of genuine adversity. A risk-managed, friction-free environment prevents this from accumulating. Stimulation without resolution produces no resilience.
- **Allopregnanolone** — the brain's own anxiolytic. A neurosteroid acting at GABA-A receptors, producing qualitative groundedness. Collapses almost immediately under chronic stress or poor sleep. Almost never discussed in public health despite being a primary calm-down system.
- **Glymphatic System** — brain waste clearance, first described in 2012. Runs only during deep sleep, flushing out metabolic waste including amyloid-beta through cerebrospinal fluid. Poor sleep doesn't just cause fatigue: it leaves the brain physically dirty.

### The Three Activating Conditions

Across all nine neglected systems, three requirements recur. These are also what the modern environment most systematically removes:

1. **Slowness** — genuine deceleration; not passive consumption (which is itself managed stimulation). Activates: GABA, Allopregnanolone, Serotonin, Glymphatic.
2. **Embodiment** — physical reality: other bodies, temperature variation, exertion, tactile contact. Representation of presence is not presence. Activates: Vasopressin, Anandamide, BDNF, Neuropeptide Y.
3. **Sustained Attention** — duration with one thing. These systems cannot be accessed quickly; they accumulate through repeated engagement with the same person, practice, or material. Activates: Acetylcholine, BDNF, Vasopressin.

---

## The 17 Activities & Their Chemical Effects

Rate each 0–4: **Never / Monthly / Weekly / 3–4×/wk / Daily**

Group them into five categories: Digital, Work, Body, Mind & Rest, Social.

**Digital:** Social media & scrolling (↑↑ dopamine, ↑ cortisol, ↓↓ acetylcholine), Notifications & multitasking (↑↑ cortisol, ↓↓↓ acetylcholine), Passive screen time/TV (↑ dopamine mild, no restoration)

**Work:** Deadline-driven work (↑↑ cortisol, ↓ allopregnanolone), Deep single-task focus 60+ min (↑↑ acetylcholine, ↑ BDNF), Creative/making work (↑↑ acetylcholine, ↑ neuropeptide Y)

**Body:** Sustained aerobic 30+ min (↑↑ anandamide, ↑↑ BDNF, ↑ NPY), Brief HIIT under 30 min (↑ NPY, ↑ BDNF partial — no anandamide threshold), Time in nature (↑ GABA, ↑ serotonin, ↓ cortisol), Cold exposure/showers (↑↑ NPY, ↑ BDNF, ↑ allopregnanolone)

**Mind & Rest:** Meditation/breathwork (↑↑ GABA, ↑↑ allopregnanolone, ↑ acetylcholine), Quality sleep 7–9hrs (↑↑ glymphatic, ↑↑ allopregnanolone, ↑↑ GABA, ↓ cortisol), Morning sunlight (↑↑ serotonin, circadian reset), Quality diet & fermented foods (↑↑ serotonin via gut-brain axis, ↑ allopregnanolone)

**Social:** Deep in-person conversation 30+ min (↑↑ vasopressin, ↑ acetylcholine, ↑ serotonin), Physical proximity & touch (↑↑ vasopressin, ↑ serotonin), Alcohol/substances (hijacks GABA artificially, ↓↓ glymphatic, ↓ serotonin)

---

## Application Flow — Three Steps

### Step 1: Rate Your Week
- Thesis statement at top, dramatic and clear
- A **live mini-spectrum preview** that updates in real-time as the user rates each activity — 12 small bars showing all chemicals, with the triad bars in warm orange and neglected bars in cool colors. The spectrum should visibly shift as ratings change.
- Filterable activity cards by category (tabs: All / Digital / Work / Body / Mind & Rest / Social)
- Each card: icon, name, description, 2–3 colored impact chips (red for triad overactivation or neglected depletion, green for neglected activation), and a 5-button frequency selector labeled Never / Monthly / Weekly / 3–4×/wk / Daily
- On mobile: single-column layout
- At bottom: "Calculate My Range →" button

### Step 2: Your Results (lean — mostly visual)
- **Large animated bandwidth score** that counts up from 0: "X / 9 neglected channels active" in a color that reflects severity (red/gold/green)
- **The spectrum visualizer** — the signature element. A vertical bar equalizer with all 12 chemicals. The 3 triad bars are wide, tall, glowing warm orange/red, and pulse subtly when overdriven. The 9 neglected bars are narrower, often short, cool-colored. Two reference lines: danger threshold at 68, starvation threshold at 35. Click/tap any bar for an expandable detail panel showing the plain English and scientific explanations. On mobile, the chart scrolls horizontally.
- **Dynorphin floor callout** (only appears if dopamine > 68): explains structural anhedonia — "seeking without arrival"
- **What-If Simulator**: pick any activity, set a frequency, instantly see how your bandwidth would change. Shows before/after mini-spectrums side by side.
- **Three condition meters**: circular SVG progress rings for Slowness, Embodiment, Sustained Attention
- **Collapsible accordion**: "Explore all 12 chemical systems" — each row shows the chemical name, plain English name, score bar, and expands to full explanation
- **"Get My Prescription →"** button to Step 3

### Step 3: Your Prescription (personalized)
- Algorithm: for each activity the user rates below "Often," simulate adding it at Daily level and calculate the bandwidth delta. Rank by impact. Show top 4.
- Each prescription card shows: activity name & icon, target frequency (specific: "3–4× per week, 30+ continuous min"), which chemicals would be unlocked (colored pills with plain names), predicted channel gain (+X), and a **personalized sentence** referencing the user's specific lowest chemical (e.g., "Your Flow State (Anandamide) is at 8/100. Sustained aerobic exercise is its primary and most direct activator.")
- At the bottom: "If you followed all of these" — shows the projected bandwidth with a before/after mini-spectrum
- Clean, protocol-like aesthetic — feels like a lab report, not a wellness app

---

## Visual Design System

**Typography:**
- Body text, science passages, quotes: **Lora** (Google Fonts) — warm, humanist serif
- UI elements, labels, numbers, buttons, tabs: **Inter** (Google Fonts) — clean geometric sans

Make it in two themes, light and dark modes. Dark mode palette is below, but make 

**Color palette (dark theme):**
- Background: `#060B12` (deep blue-black)
- Card: `#0C1525`
- Card 2: `#101D30`
- Border: `#1A2D48`
- Text: `#E8EEFF`
- Muted: `#5C7A99`
- Gold accent: `#E8B55A`
- Success green: `#48BB78`
- Danger red: `#E53E3E`

**Triad chemical colors:** Dopamine `#FF5722`, Cortisol `#E53E3E`, Oxytocin `#F6AD55`

**Neglected chemical colors:** GABA `#38D39F`, Vasopressin `#63B3ED`, Acetylcholine `#7F9CF5`, Serotonin `#B794F4`, Anandamide `#2CC4B0`, BDNF `#48BB78`, NPY `#ECC94B`, Allopregnanolone `#B67FEA`, Glymphatic `#76C4F0`

**Key visual effects:**
- Spectrum bars rise with a staggered animation on load (cubic ease-out, left to right)
- Overdriven triad bars pulse subtly (CSS `@keyframes triPulse`)
- Overdriven bars have a multi-layer box-shadow glow (e.g., `0 0 14px #FF572288, 0 0 28px #FF572244`)
- Active neglected bars (above starvation threshold) have a soft glow
- Hover tooltips above bars on desktop
- `fadeUp` animation for page transitions, `slideIn` for expanding panels
- Three-step progress indicator in the header showing current position

---

## Scoring System

Each chemical has a **base score** (the modern-life default) and a **weight map** linking every activity to its effect on that chemical.

```
chemical_score = base + Σ((activity_rating / 4) × weight)
```

Clamp all scores to 0–100. The bandwidth count = number of neglected chemicals scoring above their individual starvation threshold (varies by chemical, roughly 30–35).

The three condition scores (0–100) are weighted sums of relevant activities:
- Slowness: meditation × 38 + sleep × 34 + nature × 20 + sunlight × 14 + diet × 8
- Embodiment: aerobic × 42 + touch × 28 + nature × 20 + cold exposure × 10 + HIIT × 8 + base 4
- Attention: deep_work × 48 + meditation × 22 + deep_convo × 20 + creative × 16 − (social_media × 22 + notifications × 28) × 0.55 + base 12

---

## Additional Ideas to Explore

These weren't in the original build but would make it richer:

**Monoculture Score.** A single derived metric showing *how narrow* the user's range is — not just the count of active channels, but the distribution. A Herfindahl-like concentration index: if all chemical activity is concentrated in 3 systems, score is high (bad). If spread across 10+, score is low (good). Show it as a "monoculture warning level."

**Chemical Interaction Map.** A simple network diagram showing how the chemicals affect each other. High cortisol suppresses GABA and allopregnanolone. High dopamine suppresses serotonin over time. GABA supports allopregnanolone. BDNF and serotonin have a bidirectional relationship. Making this visible would help users understand *why* certain combinations of habits are especially powerful.

**Activity Synergy Pairs.** Some activities combine for greater effect than either alone: aerobic + cold exposure dramatically boosts NPY; meditation + deep work creates strong acetylcholine conditions; nature + no phone = maximal GABA activation. A "stacking" panel showing the 3 highest-synergy combinations for this user.

**Narrative Summary.** After results, generate a 3-sentence "neurochemical story" for the user: "Your brain is running predominantly on seeking drive and stress mobilization. The systems associated with deep focus, genuine rest, and long friendship are operating below activation threshold. Your environment is optimised for the first group and structurally hostile to the second." Feels much more human than just numbers.

**Persistent Progress Tracking.** Using the app's storage API, save results across sessions. Show a simple timeline: "Your range 3 weeks ago: 2/9. Today: 5/9." The spectrum shows both, overlaid. The trajectory matters more than any single reading.

**Sound Mode.** The equalizer visualization is already borrowed from audio metaphors. Take it literally: each chemical plays a frequency when active (neglected systems are quiet, barely audible; overdriven triad channels are loud and clipping). Users can "hear" their neurochemical range. Connects meaningfully to the professor's cybernetics/music work.

**Comparison Profiles.** Show how the user's spectrum compares to named patterns: "The Typical Knowledge Worker" (high dopamine/cortisol, low everything else), "The Athlete" (high anandamide/BDNF/NPY, moderate others), "The Contemplative" (high GABA/allopregnanolone, high acetylcholine). Not judgment — just orientation.

---

## Tone & Intent

This is not a wellness app. It is not motivational. It does not celebrate or shame. It is a diagnostic tool grounded in peer-reviewed science, built with the aesthetic of a research instrument. The language should be direct, precise, and occasionally unsettling — because the findings often are. The design should feel like a lab environment: dark, focused, serious, with visual elements that carry meaning rather than decoration.

The target user is someone curious and slightly uncomfortable with what they're about to find out.