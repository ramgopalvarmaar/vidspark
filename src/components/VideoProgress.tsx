"use client";

import { motion } from "framer-motion";

export interface VideoProgressProps {
  status: string;
  elapsedSeconds: number;
}

export function VideoProgress({ status, elapsedSeconds }: VideoProgressProps) {
  return (
    <motion.div
      className="mx-auto w-full max-w-xl rounded-2xl border border-border bg-card p-8 text-center shadow-sm"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{
        opacity: 1,
        scale: 1,
        boxShadow: [
          "0 0 0 0 color-mix(in srgb, var(--color-accent) 0%, transparent)",
          "0 12px 40px -12px color-mix(in srgb, var(--color-accent) 18%, transparent)",
          "0 0 0 0 color-mix(in srgb, var(--color-accent) 0%, transparent)",
        ],
      }}
      transition={{
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
        boxShadow: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      <motion.div
        className="flex items-center justify-center gap-2"
        initial="initial"
        animate="animate"
        variants={{
          animate: {
            transition: { staggerChildren: 0.14, delayChildren: 0 },
          },
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="size-2.5 rounded-full bg-accent"
            variants={{
              initial: { y: 0, opacity: 0.45 },
              animate: {
                y: [0, -8, 0],
                opacity: [0.45, 1, 0.45],
                transition: { duration: 0.55, repeat: Infinity, ease: "easeInOut" },
              },
            }}
          />
        ))}
      </motion.div>
      <p className="mt-6 text-base font-medium text-foreground">{status}</p>
      <p className="mt-2 text-sm text-muted">
        {elapsedSeconds} second{elapsedSeconds === 1 ? "" : "s"}
      </p>
      <p className="mt-4 text-xs text-muted">This typically takes 30-90 seconds</p>
    </motion.div>
  );
}
