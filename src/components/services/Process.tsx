"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const steps = [
  { n: "01", title: "Tell us your vibe", text: "Pick a fixed departure or share your dates, budget and group size for a custom plan." },
  { n: "02", title: "We design & book", text: "Stays, transport, activities and permits — handpicked, verified and confirmed within 24 hours." },
  { n: "03", title: "Pack your bags", text: "Join your trip WhatsApp group, meet your captain and get a packing list tailored to the trip." },
  { n: "04", title: "Therapy begins", text: "Show up. We handle everything else while you make memories (and friends) for life." },
];

export function Process() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=220%", scrub: 1, pin: true },
        });
        tl.fromTo("[data-proc-line]", { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 4 }, 0);
        gsap.utils.toArray<HTMLElement>("[data-step]").forEach((el, i) => {
          tl.fromTo(el, { opacity: 0.15, y: 40 }, { opacity: 1, y: 0, duration: 0.8 }, i * 1);
          tl.fromTo(el.querySelector("[data-step-dot]"), { scale: 0.4 }, { scale: 1, duration: 0.5, ease: "back.out(3)" }, i * 1);
        });
      });
      mm.add("(max-width: 1023px)", () => {
        gsap.utils.toArray<HTMLElement>("[data-step]").forEach((el) => {
          gsap.from(el, { opacity: 0, y: 40, duration: 0.9, scrollTrigger: { trigger: el, start: "top 85%", once: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative flex min-h-screen items-center overflow-hidden bg-ink-950 py-24 text-white">
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-flame-500/25 blur-[140px]" />
      <div className="container-x relative">
        <span className="eyebrow text-sun-300">How it works</span>
        <h2 className="heading-lg mt-5 max-w-3xl">
          From &ldquo;let&apos;s go&rdquo; to <span className="accent text-gradient">gone</span> in four steps.
        </h2>
        <div className="relative mt-20">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-white/10 lg:block" />
          <div data-proc-line className="bg-brand absolute left-0 right-0 top-6 hidden h-px origin-left lg:block" />
          <div className="grid gap-12 lg:grid-cols-4 lg:gap-8">
            {steps.map((s) => (
              <div key={s.n} data-step className="relative">
                <span data-step-dot className="bg-brand relative z-10 flex h-12 w-12 items-center justify-center rounded-full font-display text-sm font-bold">
                  {s.n}
                </span>
                <h3 className="mt-8 font-display text-2xl font-semibold">{s.title}</h3>
                <p className="mt-3 text-white/65">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
