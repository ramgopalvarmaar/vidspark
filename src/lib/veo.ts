import { GoogleGenAI } from "@google/genai";
import type { VideoOperation } from "@/types";

const OPERATIONS_BASE = "https://generativelanguage.googleapis.com/v1beta";

function normalizeMimeType(contentType: string | null): string {
  if (!contentType) return "image/jpeg";
  const base = contentType.split(";")[0]?.trim().toLowerCase();
  if (base?.startsWith("image/")) return base;
  return "image/jpeg";
}

async function fetchImageAsBase64(
  imageUrl: string,
): Promise<{ base64: string; mimeType: string }> {
  let res: Response;
  try {
    res = await fetch(imageUrl, { redirect: "follow" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch image";
    throw new Error(`Could not download product image: ${message}`);
  }
  if (!res.ok) {
    throw new Error(`Product image request failed with HTTP ${res.status}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length === 0) {
    throw new Error("Product image is empty");
  }
  return {
    base64: buf.toString("base64"),
    mimeType: normalizeMimeType(res.headers.get("content-type")),
  };
}

export async function startVideoGeneration(
  videoPrompt: string,
  imageUrl: string,
  apiKey: string,
): Promise<string> {
  const key = apiKey.trim();
  if (!key) throw new Error("API key is required");
  if (!videoPrompt.trim()) throw new Error("videoPrompt is required");
  if (!imageUrl.trim()) throw new Error("imageUrl is required");

  const { base64, mimeType } = await fetchImageAsBase64(imageUrl.trim());

  const ai = new GoogleGenAI({ apiKey: key });

  let operation;
  try {
    operation = await ai.models.generateVideos({
      model: "veo-3.1-fast-generate-preview",
      prompt: videoPrompt.trim(),
      image: {
        imageBytes: base64,
        mimeType,
      },
      config: {
        aspectRatio: "9:16",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Video generation request failed";
    throw new Error(message);
  }

  const name = operation.name?.trim();
  if (!name) {
    throw new Error("Video generation did not return an operation name");
  }
  return name;
}

function asRecord(v: unknown): Record<string, unknown> | undefined {
  if (v && typeof v === "object" && !Array.isArray(v)) {
    return v as Record<string, unknown>;
  }
  return undefined;
}

function extractVideoUriFromOperationBody(data: Record<string, unknown>): string | undefined {
  const response = asRecord(data.response);
  if (!response) return undefined;

  const gvr = asRecord(
    response.generateVideoResponse ?? response.generate_video_response,
  );
  if (gvr) {
    const samples = (gvr.generatedSamples ?? gvr.generated_samples) as unknown;
    if (Array.isArray(samples) && samples.length > 0) {
      const first = asRecord(samples[0]);
      const video = asRecord(first?.video);
      const uri = video?.uri;
      if (typeof uri === "string" && uri.trim()) return uri.trim();
    }
  }

  const genVideos = response.generatedVideos ?? response.generated_videos;
  if (Array.isArray(genVideos) && genVideos.length > 0) {
    const first = asRecord(genVideos[0]);
    const video = asRecord(first?.video);
    const uri = video?.uri;
    if (typeof uri === "string" && uri.trim()) return uri.trim();
  }

  return undefined;
}

function extractOperationError(data: Record<string, unknown>): string | undefined {
  const err = asRecord(data.error);
  if (!err) return undefined;
  const message = err.message;
  if (typeof message === "string" && message.trim()) return message.trim();
  return JSON.stringify(err);
}

export async function checkVideoStatus(
  operationName: string,
  apiKey: string,
): Promise<VideoOperation> {
  const name = operationName.trim();
  const key = apiKey.trim();
  if (!name) throw new Error("operationName is required");
  if (!key) throw new Error("API key is required");

  const path = name.startsWith("/") ? name.slice(1) : name;
  const url = `${OPERATIONS_BASE}/${path}?key=${encodeURIComponent(key)}`;

  let res: Response;
  try {
    res = await fetch(url, { method: "GET" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Status request failed";
    throw new Error(`Failed to poll video operation: ${message}`);
  }

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    throw new Error("Video status response was not valid JSON");
  }

  if (!res.ok) {
    const errObj = asRecord(body);
    const msg =
      (typeof errObj?.error === "object" &&
        errObj.error &&
        typeof (errObj.error as { message?: string }).message === "string" &&
        (errObj.error as { message: string }).message) ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }

  const data = asRecord(body);
  if (!data) {
    throw new Error("Unexpected video status payload");
  }

  const done = Boolean(data.done);
  const opError = extractOperationError(data);
  if (done && opError) {
    return { operationName: name, done: true, error: opError };
  }

  const videoUrl = done ? extractVideoUriFromOperationBody(data) : undefined;
  if (done && !videoUrl && !opError) {
    return {
      operationName: name,
      done: true,
      error: "Operation finished but no video URI was found",
    };
  }

  return { operationName: name, done, videoUrl };
}
