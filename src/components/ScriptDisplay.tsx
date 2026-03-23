"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Copy, Film, ImageIcon, Video } from "lucide-react";
import type { GeneratedScript } from "@/types";

export interface ScriptDisplayProps {
  script: GeneratedScript;
  /** Main product image URL (for preview + copy) */
  imageUrl?: string;
  imageAlt?: string;
  onContinue: () => void;
}

function useCopyFeedback() {
  const [copied, setCopied] = useState(false);
  function flash() {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }
  return { copied, flash };
}

export function ScriptDisplay({ script, imageUrl, imageAlt, onContinue }: ScriptDisplayProps) {
  const [promptOpen, setPromptOpen] = useState(false);
  const imageCopy = useCopyFeedback();
  const promptCopy = useCopyFeedback();

  async function copyImageUrl() {
    if (!imageUrl?.trim()) return;
    try {
      await navigator.clipboard.writeText(imageUrl.trim());
      imageCopy.flash();
    } catch {
      /* ignore */
    }
  }

  async function copyVideoPrompt() {
    try {
      await navigator.clipboard.writeText(script.videoPrompt);
      promptCopy.flash();
    } catch {
      /* ignore */
    }
  }

  return (
    <motion.div
      className="mx-auto w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-sm"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-6 flex items-center gap-2">
        <Film className="size-6 shrink-0 text-accent" strokeWidth={1.75} aria-hidden />
        <h2 className="font-serif text-2xl tracking-tight text-foreground">Your Viral Script</h2>
      </div>

      {imageUrl?.trim() ? (
        <div className="mb-6 overflow-hidden rounded-xl border border-border bg-surface">
          <div className="flex max-h-48 w-full items-center justify-center">
            <img
              src={imageUrl}
              alt={imageAlt ?? "Product"}
              className="max-h-48 w-full object-contain"
            />
          </div>
          <div className="border-t border-border p-3">
            <button
              type="button"
              onClick={copyImageUrl}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface"
            >
              {imageCopy.copied ? (
                <>
                  <Check className="size-4 text-sage" strokeWidth={2} aria-hidden />
                  Image URL copied
                </>
              ) : (
                <>
                  <ImageIcon className="size-4 text-muted" strokeWidth={2} aria-hidden />
                  Copy image URL
                </>
              )}
            </button>
          </div>
        </div>
      ) : null}

      <div className="divide-y divide-border">
        <section className="pb-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">The Hook</p>
          <p className="mt-2 text-lg leading-relaxed text-foreground">{script.hook}</p>
        </section>
        <section className="py-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Key Benefits</p>
          <p className="mt-2 leading-relaxed text-foreground">{script.benefits}</p>
        </section>
        <section className="pt-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Call to Action</p>
          <p className="mt-2 leading-relaxed text-foreground">{script.callToAction}</p>
        </section>
      </div>

      <div className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setPromptOpen((o) => !o)}
            className="flex min-w-0 flex-1 items-center justify-between gap-2 rounded-xl py-2 text-left text-sm font-medium text-foreground transition-colors hover:text-accent"
            aria-expanded={promptOpen}
          >
            <span>Video Prompt</span>
            <motion.span animate={{ rotate: promptOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="size-5 shrink-0 text-muted" aria-hidden />
            </motion.span>
          </button>
          <button
            type="button"
            onClick={copyVideoPrompt}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-card"
          >
            {promptCopy.copied ? (
              <>
                <Check className="size-3.5 text-sage" strokeWidth={2} aria-hidden />
                Copied
              </>
            ) : (
              <>
                <Copy className="size-3.5 text-muted" strokeWidth={2} aria-hidden />
                Copy prompt
              </>
            )}
          </button>
        </div>
        <AnimatePresence initial={false}>
          {promptOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-surface p-4 font-mono text-sm leading-relaxed text-foreground">
                {script.videoPrompt}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent text-sm font-medium text-white transition-colors hover:bg-accent-hover"
      >
        <Video className="size-5" strokeWidth={2} aria-hidden />
        Generate Video
      </button>
    </motion.div>
  );
}
