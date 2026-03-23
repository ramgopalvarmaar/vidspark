import { NextRequest, NextResponse } from "next/server";
import { checkVideoStatus } from "@/lib/veo";

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

  const { operationName, apiKey } = body as Record<string, unknown>;

  if (typeof operationName !== "string" || !operationName.trim()) {
    return NextResponse.json({ error: "Missing or invalid operationName" }, { status: 400 });
  }
  if (typeof apiKey !== "string" || !apiKey.trim()) {
    return NextResponse.json({ error: "Missing or invalid apiKey" }, { status: 400 });
  }

  try {
    const status = await checkVideoStatus(operationName, apiKey);
    return NextResponse.json(status);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Status check failed";
    const lower = message.toLowerCase();
    const authHint =
      lower.includes("api key") ||
      lower.includes("unauthorized") ||
      lower.includes("401") ||
      lower.includes("403") ||
      lower.includes("permission");
    const code = authHint ? 401 : 500;
    return NextResponse.json({ error: message }, { status: code });
  }
}
