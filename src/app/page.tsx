"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ProductData, GeneratedScript, VideoOperation } from "@/types";
import Header from "@/components/Header";
import { StepIndicator } from "@/components/StepIndicator";
import { UrlInput } from "@/components/UrlInput";
import { ProductCard } from "@/components/ProductCard";
import { ScriptDisplay } from "@/components/ScriptDisplay";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { VideoProgress } from "@/components/VideoProgress";
import { VideoPlayer } from "@/components/VideoPlayer";
import { HowItWorks } from "@/components/HowItWorks";

const STEPS = ["Find Product", "Generate Script", "Create Video"];

type AppPhase =
  | "url-input"
  | "product-preview"
  | "script-display"
  | "api-key"
  | "video-generating"
  | "video-done";

function phaseToStep(phase: AppPhase): number {
  switch (phase) {
    case "url-input":
    case "product-preview":
      return 1;
    case "script-display":
      return 2;
    case "api-key":
    case "video-generating":
    case "video-done":
      return 3;
  }
}

export default function Home() {
  const [phase, setPhase] = useState<AppPhase>("url-input");
  const [product, setProduct] = useState<ProductData | null>(null);
  const [script, setScript] = useState<GeneratedScript | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [scrapeLoading, setScrapeLoading] = useState(false);
  const [scriptLoading, setScriptLoading] = useState(false);
  const [videoStarting, setVideoStarting] = useState(false);
  const [videoElapsed, setVideoElapsed] = useState(0);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const apiKeyRef = useRef<string>("");

  const cleanup = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    pollRef.current = null;
    timerRef.current = null;
  }, []);

  useEffect(() => cleanup, [cleanup]);

  async function handleScrape(url: string) {
    setScrapeLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Scraping failed");
      setProduct(data as ProductData);
      setPhase("product-preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setScrapeLoading(false);
    }
  }

  async function handleGenerateScript() {
    if (!product) return;
    setScriptLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Script generation failed");
      setScript(data as GeneratedScript);
      setPhase("script-display");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setScriptLoading(false);
    }
  }

  function handleGoToVideoStep() {
    setPhase("api-key");
  }

  async function handleStartVideo(apiKey: string) {
    if (!script || !product) return;
    apiKeyRef.current = apiKey;
    setVideoStarting(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoPrompt: script.videoPrompt,
          imageUrl: product.image,
          apiKey,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Video generation failed");

      const operationName = data.operationName as string;
      setVideoStarting(false);
      setPhase("video-generating");
      setVideoElapsed(0);

      timerRef.current = setInterval(() => {
        setVideoElapsed((prev) => prev + 1);
      }, 1000);

      pollRef.current = setInterval(async () => {
        try {
          const statusRes = await fetch("/api/video-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operationName, apiKey: apiKeyRef.current }),
          });
          const statusData = (await statusRes.json()) as VideoOperation;
          if (!statusRes.ok) throw new Error(statusData.error || "Status check failed");

          if (statusData.done) {
            cleanup();
            if (statusData.error) {
              setError(statusData.error);
              setPhase("api-key");
            } else if (statusData.videoUrl) {
              setVideoUrl(statusData.videoUrl);
              setPhase("video-done");
            }
          }
        } catch (err) {
          cleanup();
          setError(err instanceof Error ? err.message : "Video polling failed");
          setPhase("api-key");
        }
      }, 10000);
    } catch (err) {
      setVideoStarting(false);
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  function handleStartOver() {
    cleanup();
    setPhase("url-input");
    setProduct(null);
    setScript(null);
    setVideoUrl(null);
    setError(null);
    setVideoElapsed(0);
  }

  const currentStep = phaseToStep(phase);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center px-4 py-12 sm:px-6 sm:py-16">
        <div className="w-full max-w-3xl">
          {phase !== "url-input" && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <StepIndicator currentStep={currentStep} steps={STEPS} />
            </motion.div>
          )}
        </div>

        {error && (
          <motion.div
            className="mb-8 w-full max-w-2xl rounded-xl border border-accent/20 bg-accent/5 px-5 py-4"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm text-accent">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-xs font-medium text-accent underline underline-offset-2 hover:no-underline"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {phase === "url-input" && (
            <motion.div
              key="url-input"
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="pt-8 sm:pt-16">
                <UrlInput onSubmit={handleScrape} isLoading={scrapeLoading} />
              </div>
            </motion.div>
          )}

          {phase === "product-preview" && product && (
            <motion.div
              key="product-preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ProductCard
                product={product}
                onContinue={handleGenerateScript}
                isGenerating={scriptLoading}
              />
            </motion.div>
          )}

          {phase === "script-display" && script && (
            <motion.div
              key="script-display"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ScriptDisplay
                script={script}
                imageUrl={product?.image}
                imageAlt={product?.title}
                onContinue={handleGoToVideoStep}
              />
            </motion.div>
          )}

          {phase === "api-key" && (
            <motion.div
              key="api-key"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ApiKeyInput onSubmit={handleStartVideo} isLoading={videoStarting} />
            </motion.div>
          )}

          {phase === "video-generating" && (
            <motion.div
              key="video-generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <VideoProgress
                status="Generating your video..."
                elapsedSeconds={videoElapsed}
              />
            </motion.div>
          )}

          {phase === "video-done" && videoUrl && script && (
            <motion.div
              key="video-done"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <VideoPlayer videoUrl={videoUrl} script={script} />
            </motion.div>
          )}
        </AnimatePresence>

        {phase !== "url-input" && (
          <motion.button
            onClick={handleStartOver}
            className="mt-12 text-sm text-muted transition-colors hover:text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Start over with a new product
          </motion.button>
        )}

        <HowItWorks />
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted">
        Built with Next.js, Gemini & Veo
      </footer>
    </div>
  );
}
