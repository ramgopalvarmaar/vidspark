"use client";

import { motion } from "framer-motion";

export interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="flex w-full items-start pb-10">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isComplete = stepNum < currentStep;
        const isCurrent = stepNum === currentStep;

        return (
          <div key={label} className="contents">
            <div className="flex min-w-0 flex-1 flex-col items-center">
              <motion.div
                layout
                className="relative flex h-8 items-center justify-center"
                initial={false}
                animate={{ scale: isCurrent ? 1.06 : 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 28 }}
              >
                {isCurrent && (
                  <motion.span
                    layoutId="step-pulse"
                    className="pointer-events-none absolute size-10 rounded-full border-2 border-accent/40"
                    animate={{
                      scale: [1, 1.12, 1],
                      opacity: [0.6, 0.25, 0.6],
                    }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                <motion.div
                  layout
                  className={`relative flex size-8 items-center justify-center rounded-full text-xs font-semibold ${
                    isComplete
                      ? "bg-accent text-white"
                      : isCurrent
                        ? "border-2 border-accent bg-card text-accent"
                        : "border border-border bg-card text-muted"
                  }`}
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                >
                  {stepNum}
                </motion.div>
              </motion.div>
              <motion.span
                className={`mt-3 max-w-[7rem] text-center text-xs leading-snug ${
                  isCurrent ? "font-medium text-accent" : isComplete ? "text-foreground" : "text-muted"
                }`}
                layout
                transition={{ duration: 0.25 }}
              >
                {label}
              </motion.span>
            </div>
            {i < steps.length - 1 && (
              <div className="mt-4 flex min-w-8 flex-1 items-center px-1 sm:px-2">
                <motion.div
                  className="h-px w-full rounded-full"
                  initial={false}
                  animate={{
                    backgroundColor: isComplete ? "var(--color-accent)" : "var(--color-border)",
                  }}
                  transition={{ duration: 0.35 }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
