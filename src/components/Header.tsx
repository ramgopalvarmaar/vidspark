"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex items-baseline gap-1.5">
          <span className="font-serif text-lg italic tracking-tight text-foreground sm:text-xl">
            VidSpark
          </span>
          <Sparkles
            className="size-3.5 shrink-0 text-accent sm:size-4"
            aria-hidden
            strokeWidth={1.75}
          />
        </div>
        <Link
          href="#how-it-works"
          className="text-sm text-muted transition-colors hover:text-foreground"
          scroll
        >
          How it works
        </Link>
      </div>
    </header>
  );
}
