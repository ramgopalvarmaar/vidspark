"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Link as LinkIcon, Loader2 } from "lucide-react";

export interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

const AMAZON_DOMAINS = /amazon\.|amzn\.to|a\.co/i;

function isValidAmazonLink(url: string): boolean {
  const lower = url.toLowerCase();
  if (lower.includes("amazon") || AMAZON_DOMAINS.test(url)) return true;
  try {
    const u = new URL(url);
    return AMAZON_DOMAINS.test(u.hostname);
  } catch {
    return false;
  }
}

export function UrlInput({ onSubmit, isLoading }: UrlInputProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Enter a product URL.");
      return;
    }
    if (!isValidAmazonLink(trimmed)) {
      setError("Please use an Amazon product link.");
      return;
    }
    setError(null);
    onSubmit(trimmed);
  }

  return (
    <motion.div
      className="mx-auto w-full max-w-2xl px-4 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <h1 className="font-serif text-4xl leading-tight tracking-tight text-foreground sm:text-5xl">
        Turn any product into
        <br />
        a{" "}
        <span className="italic text-accent">
          viral
        </span>{" "}
        Short
      </h1>
      <p className="mx-auto mt-4 max-w-md text-muted">
        Paste an Amazon product link, get an AI-generated script and video in seconds.
      </p>
      <form onSubmit={handleSubmit} className="mt-10">
        <div
          className={`flex h-14 w-full items-stretch overflow-hidden rounded-xl border bg-card transition-shadow ${
            error
              ? "border-accent/40 ring-2 ring-accent/10"
              : "border-border focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20"
          }`}
        >
          <label className="flex min-w-0 flex-1 items-center gap-3 pl-4">
            <LinkIcon className="size-5 shrink-0 text-muted" aria-hidden />
            <input
              type="url"
              inputMode="url"
              autoComplete="url"
              placeholder="Paste an Amazon product URL..."
              value={value}
              disabled={isLoading}
              onChange={(e) => {
                setValue(e.target.value);
                if (error) setError(null);
              }}
              className="h-full min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted"
            />
          </label>
          <button
            type="submit"
            disabled={isLoading}
            className="m-1.5 inline-flex shrink-0 items-center gap-2 rounded-lg bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:pointer-events-none disabled:opacity-60"
          >
            {isLoading ? (
              <Loader2 className="size-5 animate-spin" aria-hidden />
            ) : (
              <>
                Analyze
                <ArrowRight className="size-4" aria-hidden />
              </>
            )}
          </button>
        </div>
        {error && (
          <p className="mt-2 text-left text-sm text-muted" role="alert">
            {error}
          </p>
        )}
      </form>
    </motion.div>
  );
}
