import { NextRequest, NextResponse } from "next/server";
import { scrapeAmazonProduct } from "@/lib/scraper";

function isAmazonUrl(url: string): boolean {
  try {
    const u = new URL(url);
    // amazon.* + short links: amzn.to, amzn.in (India), a.co
    return /amazon\.|amzn\.to|amzn\.in|a\.co/i.test(u.hostname);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const url = body && typeof body === "object" && "url" in body ? (body as { url?: unknown }).url : undefined;
  if (typeof url !== "string" || !url.trim()) {
    return NextResponse.json({ error: "Missing or invalid url" }, { status: 400 });
  }

  const trimmed = url.trim();
  if (!isAmazonUrl(trimmed)) {
    return NextResponse.json({ error: "URL must be an Amazon product link" }, { status: 400 });
  }

  try {
    const product = await scrapeAmazonProduct(trimmed);
    return NextResponse.json(product);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Scrape failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
