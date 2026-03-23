export function HowItWorks() {
  const steps = [
    {
      title: "Find product",
      body: "Paste any Amazon product link (including short links from the app). We read the title, image, price, and details.",
    },
    {
      title: "Generate script",
      body: "Gemini turns that into a punchy Shorts script plus a video prompt you can copy.",
    },
    {
      title: "Create video",
      body: "Add your Gemini API key and Veo generates a vertical video from your image and prompt.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="mx-auto mt-16 w-full max-w-2xl scroll-mt-6 px-1"
      aria-labelledby="how-it-works-heading"
    >
      <h2
        id="how-it-works-heading"
        className="font-serif text-xl tracking-tight text-foreground sm:text-2xl"
      >
        How it works
      </h2>
      <ol className="mt-6 space-y-5">
        {steps.map((step, i) => (
          <li key={step.title} className="flex gap-4">
            <span
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent"
              aria-hidden
            >
              {i + 1}
            </span>
            <div>
              <p className="font-medium text-foreground">{step.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
