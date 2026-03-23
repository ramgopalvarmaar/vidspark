import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "VidSpark — AI Product Video Generator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(145deg, #fafaf8 0%, #f4f3f0 50%, #fafaf8 100%)",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <svg
              width="56"
              height="56"
              viewBox="0 0 32 32"
              fill="none"
            >
              <rect width="32" height="32" rx="8" fill="#1c1c1e" />
              <path
                d="M18.5 4L10 18h5.5l-2 10L22 14h-5.5l2-10z"
                fill="#e8634a"
              />
            </svg>
            <span
              style={{
                fontSize: "52px",
                fontStyle: "italic",
                color: "#1c1c1e",
                letterSpacing: "-1px",
              }}
            >
              VidSpark
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              marginTop: "16px",
            }}
          >
            <span
              style={{
                fontSize: "36px",
                color: "#1c1c1e",
                textAlign: "center",
                lineHeight: 1.3,
              }}
            >
              Turn any product into
            </span>
            <span
              style={{
                fontSize: "42px",
                fontStyle: "italic",
                color: "#e8634a",
                textAlign: "center",
              }}
            >
              a viral Short
            </span>
          </div>

          <span
            style={{
              fontSize: "18px",
              color: "#6b6b6f",
              textAlign: "center",
              maxWidth: "600px",
              lineHeight: 1.5,
              marginTop: "12px",
            }}
          >
            AI-generated scripts and videos from Amazon product links.
            Powered by Gemini & Veo.
          </span>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "32px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#6b6b6f",
            fontSize: "16px",
          }}
        >
          <span>vidspark.vercel.app</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
