"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Key, Loader2 } from "lucide-react";

export interface ApiKeyInputProps {
  onSubmit: (apiKey: string) => void;
  isLoading: boolean;
}

export function ApiKeyInput({ onSubmit, isLoading }: ApiKeyInputProps) {
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  }

  return (
    <motion.div
      className="mx-auto w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-sm"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2 className="font-serif text-xl tracking-tight text-foreground">Connect Your API Key</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Veo video generation requires your own Gemini API key. Your key is never stored on our servers.
      </p>
      <a
        href="https://aistudio.google.com/apikey"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block text-sm font-medium text-accent underline-offset-4 hover:underline"
      >
        Get a free API key →
      </a>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="flex h-12 w-full items-center gap-3 overflow-hidden rounded-xl border border-border bg-background px-4 transition-shadow focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20">
          <Key className="size-5 shrink-0 text-muted" aria-hidden />
          <input
            type="password"
            autoComplete="off"
            placeholder="Enter your Gemini API key"
            value={value}
            disabled={isLoading}
            onChange={(e) => setValue(e.target.value)}
            className="h-full min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
          />
        </label>
        <button
          type="submit"
          disabled={isLoading || !value.trim()}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:pointer-events-none disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="size-5 animate-spin" aria-hidden /> : "Start Generation"}
        </button>
      </form>
    </motion.div>
  );
}
