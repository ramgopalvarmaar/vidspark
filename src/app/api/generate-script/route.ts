import { NextRequest, NextResponse } from "next/server";
import { generateScript } from "@/lib/gemini";
import type { ProductData } from "@/types";

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function parseProductData(body: unknown): ProductData | null {
  if (!body || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  if (
    !isNonEmptyString(o.title) ||
    !isNonEmptyString(o.description) ||
    !isNonEmptyString(o.url) ||
    typeof o.image !== "string" ||
    typeof o.price !== "string"
  ) {
    return null;
  }
  return {
    title: o.title.trim(),
    description: o.description.trim(),
    image: o.image.trim(),
    price: o.price.trim(),
    url: o.url.trim(),
  };
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const product = parseProductData(body);
  if (!product) {
    return NextResponse.json(
      {
        error:
          "Body must include non-empty title, description, and url, plus string fields image and price",
      },
      { status: 400 },
    );
  }

  try {
    const script = await generateScript(product);
    return NextResponse.json(script);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Script generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
