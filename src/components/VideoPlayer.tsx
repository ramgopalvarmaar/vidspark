"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Download, PartyPopper } from "lucide-react";
import type { GeneratedScript } from "@/types";

export interface VideoPlayerProps {
  videoUrl: string;
  script: GeneratedScript;
}

export function VideoPlayer({ videoUrl, script }: VideoPlayerProps) {
  const [copied, setCopied] = useState(false);

  async function copyScript() {
    try {
      await navigator.clipboard.writeText(script.fullScript);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <motion.div
      className="mx-auto w-full max-w-md"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-8 flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-center">
        <PartyPopper className="size-8 shrink-0 text-accent" strokeWidth={1.75} aria-hidden />
        <h2 className="font-serif text-3xl tracking-tight text-foreground">Your Short is Ready!</h2>
      </div>
      <div className="mx-auto aspect-[9/16] max-h-[600px] w-full overflow-hidden rounded-2xl bg-black shadow-lg">
        <video src={videoUrl} controls playsInline className="size-full object-contain" />
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <a
          href={videoUrl}
          download
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          <Download className="size-5" strokeWidth={2} aria-hidden />
          Download Video
        </a>
        <button
          type="button"
          onClick={copyScript}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-medium text-foreground transition-colors hover:bg-surface"
        >
          <Copy className="size-5 text-muted" strokeWidth={2} aria-hidden />
          {copied ? "Copied!" : "Copy Script"}
        </button>
      </div>
      <p className="mt-6 text-center text-xs text-muted">
        Generated with Veo 3.1 Fast • 9:16 portrait
      </p>
    </motion.div>
  );
}
