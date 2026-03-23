import { GoogleGenAI } from "@google/genai";
import type { GeneratedScript, ProductData } from "@/types";

const SCRIPT_SCHEMA_HINT = `{
  "hook": "string",
  "benefits": "string",
  "callToAction": "string",
  "fullScript": "string",
  "videoPrompt": "string"
}`;

function buildPrompt(product: ProductData): string {
  return `You are writing ad copy for a YouTube Shorts product promo (about 30 seconds when read aloud).

Product:
- Title: ${product.title}
- Price: ${product.price || "N/A"}
- URL: ${product.url}
- Description:
${product.description}

Tasks:
1) Write a catchy 30-second YouTube Shorts script with three clear sections:
   - Hook: one attention-grabbing opening line.
   - Benefits: 2–3 key selling points (concise, persuasive).
   - Call to Action: must include the literal placeholder [AFFILIATE_LINK] where the link should go.
   - fullScript: the full spoken script in order (Hook → Benefits → CTA), natural and energetic, suitable for vertical short-form video.

2) Write videoPrompt: a single detailed prompt for a vertical (9:16) AI video generator (Veo) describing a dynamic, visually engaging sequence that showcases this product (motion, lighting, setting, pacing). Do not include instructions to read on-screen text unless essential.

Respond with ONLY valid JSON matching this exact shape (no markdown, no code fences):
${SCRIPT_SCHEMA_HINT}`;
}

function parseGeneratedScript(raw: string): GeneratedScript {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Gemini returned invalid JSON");
  }
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Gemini JSON was not an object");
  }
  const o = parsed as Record<string, unknown>;
  const hook = o.hook;
  const benefits = o.benefits;
  const callToAction = o.callToAction;
  const fullScript = o.fullScript;
  const videoPrompt = o.videoPrompt;
  if (
    typeof hook !== "string" ||
    typeof benefits !== "string" ||
    typeof callToAction !== "string" ||
    typeof fullScript !== "string" ||
    typeof videoPrompt !== "string"
  ) {
    throw new Error("Gemini JSON missing required string fields");
  }
  return { hook, benefits, callToAction, fullScript, videoPrompt };
}

export async function generateScript(product: ProductData): Promise<GeneratedScript> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey?.trim()) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey.trim() });

  let text: string | undefined;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: buildPrompt(product),
      config: {
        responseMimeType: "application/json",
      },
    });
    text = response.text;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gemini request failed";
    throw new Error(`Script generation failed: ${message}`);
  }

  if (!text?.trim()) {
    throw new Error("Gemini returned an empty response");
  }

  return parseGeneratedScript(text.trim());
}
