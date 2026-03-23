"use client";

import { motion } from "framer-motion";
import { CheckCircle, Loader2, Sparkles } from "lucide-react";
import type { ProductData } from "@/types";

export interface ProductCardProps {
  product: ProductData;
  onContinue: () => void;
  isGenerating: boolean;
}

export function ProductCard({ product, onContinue, isGenerating }: ProductCardProps) {
  return (
    <motion.article
      className="mx-auto w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex max-h-64 w-full items-center justify-center bg-surface">
        <img
          src={product.image}
          alt={product.title}
          className="max-h-64 w-full object-contain"
        />
      </div>
      <div className="p-6">
        <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-sage">
          <CheckCircle className="size-3.5 shrink-0" strokeWidth={2} aria-hidden />
          Product Found
        </p>
        <h2 className="font-serif text-2xl leading-snug tracking-tight text-foreground line-clamp-2">
          {product.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-3">
          {product.description}
        </p>
        {product.price ? (
          <p className="mt-4 text-xl font-semibold text-foreground">{product.price}</p>
        ) : null}
        <button
          type="button"
          onClick={onContinue}
          disabled={isGenerating}
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:pointer-events-none disabled:opacity-60"
        >
          {isGenerating ? (
            <Loader2 className="size-5 animate-spin" aria-hidden />
          ) : (
            <>
              <Sparkles className="size-5" strokeWidth={2} aria-hidden />
              Generate Script
            </>
          )}
        </button>
      </div>
    </motion.article>
  );
}
