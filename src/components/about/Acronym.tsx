"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const rows = [
  { word: "The", note: "a promise, not a product" },
  { word: "Legend", note: "every traveller is one" },
  { word: "Travellers", note: "who travel to feel alive" },
];

export function Acronym() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>("[data-acr-row]").forEach((row, i) => {
        gsap.fromTo(
          row,
          { xPercent: i % 2 ? 12 : -12 },
          { xPercent: i % 2 ? -4 : 4, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
        gsap.fromTo(
          row.querySelector("[data-acr-first]"),
          { color: "rgba(26,18,11,0.12)" },
          { color: "#ff7a1a", scrollTrigger: { trigger: row, start: "top 75%", end: "top 45%", scrub: true } },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="overflow-hidden bg-cream-50 py-28 sm:py-36" aria-label="What TLT stands for">
      <div className="container-x">
        <span className="eyebrow text-flame-600">What&apos;s in a name</span>
      </div>
      <div className="mt-12 space-y-2">
        {rows.map((r) => (
          <div key={r.word} data-acr-row className="flex items-baseline justify-center gap-6 whitespace-nowrap">
            <span className="font-display text-[clamp(4rem,15vw,15rem)] font-bold leading-[0.9] tracking-[-0.06em] text-ink-900/10">
              <span data-acr-first>{r.word[0]}</span>
              {r.word.slice(1)}
            </span>
            <span className="accent hidden text-2xl text-ink-700 md:inline lg:text-3xl">— {r.note}</span>
          </div>
        ))}
      </div>
      <div className="container-x mt-16 text-center">
        <p className="mx-auto max-w-2xl text-lg text-ink-700/80">
          <strong className="text-ink-900">TLT Community</strong> started with a simple belief: the best trips aren&apos;t about
          places, they&apos;re about people. Every itinerary we build is designed so strangers leave as friends.
        </p>
      </div>
    </section>
  );
}
