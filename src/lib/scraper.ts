import * as cheerio from "cheerio";
import type { ProductData } from "@/types";

const CHROME_MAC_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

function buildHeaders(): HeadersInit {
  return {
    "User-Agent": CHROME_MAC_UA,
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  };
}

function pickImage($: cheerio.CheerioAPI): string {
  const landing = $("#landingImage");
  const fromLanding =
    landing.attr("src")?.trim() ||
    landing.attr("data-old-hires")?.trim() ||
    "";
  if (fromLanding) return fromLanding;
  const blk = $("#imgBlkFront").attr("src")?.trim();
  return blk || "";
}

function pickDescription($: cheerio.CheerioAPI): string {
  const bullets = $("#feature-bullets .a-list-item")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(Boolean);
  if (bullets.length > 0) return bullets.join("\n");
  const fallback = $("#productDescription").text().trim();
  return fallback || "";
}

function pickPrice($: cheerio.CheerioAPI): string {
  const offscreen = $(".a-price .a-offscreen").first().text().trim();
  if (offscreen) return offscreen;
  const ourPrice = $("#priceblock_ourprice").text().trim();
  if (ourPrice) return ourPrice;
  const whole = $("span.a-price-whole").first().text().trim();
  return whole || "";
}

const RETRY_DELAY_MS = 500;

/** Fetches the URL; on network error or non-OK status, waits and retries once. */
async function fetchAmazonPage(url: string): Promise<Response> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await fetch(url, { headers: buildHeaders(), redirect: "follow" });
      if (response.ok) {
        return response;
      }
      lastError = new Error(
        `Amazon returned HTTP ${response.status} ${response.statusText || ""}`.trim(),
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Network request failed";
      lastError = new Error(`Failed to fetch Amazon page: ${message}`);
    }

    if (attempt < 2) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }

  throw lastError ?? new Error("Failed to fetch Amazon page");
}

export async function scrapeAmazonProduct(url: string): Promise<ProductData> {
  const response = await fetchAmazonPage(url);

  const html = await response.text();
  const $ = cheerio.load(html);

  const title = $("#productTitle").text().trim();
  const image = pickImage($);
  const description = pickDescription($);
  const price = pickPrice($);

  if (!title) {
    throw new Error(
      "Could not parse product title. The page may be blocked, captcha-protected, or not a product detail page.",
    );
  }

  return {
    title,
    description: description || "No description available.",
    image: image || "",
    price: price || "",
    url,
  };
}
