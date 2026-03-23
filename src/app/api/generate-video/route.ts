import { NextRequest, NextResponse } from "next/server";
import { startVideoGeneration } from "@/lib/veo";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { videoPrompt, imageUrl, apiKey } = body as Record<string, unknown>;

  if (typeof videoPrompt !== "string" || !videoPrompt.trim()) {
    return NextResponse.json({ error: "Missing or invalid videoPrompt" }, { status: 400 });
  }
  if (typeof imageUrl !== "string" || !imageUrl.trim()) {
    return NextResponse.json({ error: "Missing or invalid imageUrl" }, { status: 400 });
  }
  if (typeof apiKey !== "string" || !apiKey.trim()) {
    return NextResponse.json({ error: "Missing or invalid apiKey" }, { status: 400 });
  }

  try {
    const operationName = await startVideoGeneration(videoPrompt, imageUrl, apiKey);
    return NextResponse.json({ operationName });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Video generation failed";
    const lower = message.toLowerCase();
    const authHint =
      lower.includes("api key") ||
      lower.includes("unauthorized") ||
      lower.includes("401") ||
      lower.includes("403") ||
      lower.includes("permission") ||
      lower.includes("invalid authentication");
    const status = authHint ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
