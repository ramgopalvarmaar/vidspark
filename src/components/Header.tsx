"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-6 sm:py-5">
        <Link href="/" className="flex items-baseline gap-1.5 transition-opacity hover:opacity-90">
          <span className="font-serif text-lg italic tracking-tight text-foreground sm:text-xl">
            VidSpark
          </span>
          <Sparkles
            className="size-3.5 shrink-0 text-accent sm:size-4"
            aria-hidden
            strokeWidth={1.75}
          />
        </Link>
        {/* Native <a> so in-page #hash scroll works reliably with Next.js App Router */}
        <a
          href="#how-it-works"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          How it works
        </a>
      </div>
    </header>
  );
}
