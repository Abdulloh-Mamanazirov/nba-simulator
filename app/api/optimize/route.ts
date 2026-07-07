import {
  buildPrompt,
  enrichResult,
  RESPONSE_SCHEMA,
  MAX_ACTION_LENGTH,
  type OptimizeRaw,
  type OptimizeConditions,
} from "@/lib/optimize";
import type { ChemicalScores } from "@/lib/scoring";
import type { LanguageMode } from "@/lib/language";

interface Body {
  action?: string;
  mode?: LanguageMode;
  scores?: ChemicalScores;
  conditions?: OptimizeConditions;
}

function bad(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

/** Pull the JSON payload out of Gemini's response parts, tolerating extras. */
function extractJson(data: unknown): OptimizeRaw | null {
  const parts =
    (data as { candidates?: { content?: { parts?: { text?: string }[] } }[] })
      ?.candidates?.[0]?.content?.parts ?? [];
  const texts = parts.map((p) => p?.text).filter((t): t is string => !!t);
  for (const t of [texts.join(""), ...texts]) {
    try {
      return JSON.parse(t) as OptimizeRaw;
    } catch {
      const m = t.match(/\{[\s\S]*\}/);
      if (m) {
        try {
          return JSON.parse(m[0]) as OptimizeRaw;
        } catch {
          /* keep trying */
        }
      }
    }
  }
  return null;
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return bad("The optimizer isn't configured on the server.", 503);

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return bad("Invalid request.");
  }

  const action = (body.action ?? "").trim();
  const mode: LanguageMode = body.mode === "science" ? "science" : "plain";
  const scores = body.scores ?? {};
  const conditions = body.conditions ?? {
    slowness: 0,
    embodiment: 0,
    attention: 0,
  };

  if (!action) return bad("Type an action first.");
  if (action.length > MAX_ACTION_LENGTH)
    return bad(`Keep it under ${MAX_ACTION_LENGTH} characters.`);

  const model = process.env.GEMINI_MODEL || "gemini-flash-latest";
  const prompt = buildPrompt(action, mode, scores, conditions);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: RESPONSE_SCHEMA,
            temperature: 0.7,
            // Disable "thinking" — cuts latency from ~10s to ~2s for this task.
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
        signal: controller.signal,
      }
    );

    if (!res.ok) {
      const status = res.status;
      if (status === 429)
        return bad("The optimizer is rate-limited right now — try again shortly.", 429);
      return bad("The optimizer service returned an error. Try again.", 502);
    }

    const data = await res.json();
    const raw = extractJson(data);
    if (!raw || !raw.optimizedAction) {
      return bad("Couldn't read a suggestion for that — try rephrasing.", 502);
    }

    return Response.json({ result: enrichResult(action, raw) });
  } catch (err) {
    const aborted = err instanceof Error && err.name === "AbortError";
    return bad(
      aborted ? "The optimizer timed out — try again." : "Couldn't reach the optimizer.",
      504
    );
  } finally {
    clearTimeout(timeout);
  }
}
