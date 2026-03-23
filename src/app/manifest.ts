import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VidSpark — Spark Viral Videos from Any Product",
    short_name: "VidSpark",
    description:
      "Paste an Amazon product link and instantly get an AI-generated YouTube Shorts script and video.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafaf8",
    theme_color: "#e8634a",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
