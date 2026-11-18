"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Counter } from "@/components/ui/Counter";
import { site } from "@/data/site";

export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      if (prefersReducedMotion()) return;
      let split: SplitText | undefined;
      const run = contextSafe!(() => {
        split = SplitText.create("[data-manifesto]", { type: "words" });
        gsap.fromTo(
          split.words,
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: "[data-manifesto]", start: "top 80%", end: "bottom 45%", scrub: true },
          },
        );
      });
      document.fonts.ready.then(run);

      gsap.to("[data-mark-spin]", {
        rotate: 360,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 },
      });
      return () => split?.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-cream-50 py-28 sm:py-40">
      <div className="container-x grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <span className="eyebrow text-flame-600">Our manifesto</span>
          <div data-mark-spin className="relative mt-10 hidden h-40 w-32 lg:block">
            <Image src="/brand/mark-dark.png" alt="" fill sizes="128px" className="object-contain opacity-90" />
          </div>
        </div>
        <div className="lg:col-span-9">
          <p data-manifesto className="font-display text-[clamp(1.8rem,3.8vw,3.4rem)] font-medium leading-[1.12] tracking-[-0.025em] text-ink-900">
            We&apos;re not a travel agency. We&apos;re a <span className="accent text-flame-600">community of legends</span> who
            believe the best therapy is a window seat, a sunset shared with strangers who become family, and stories you&apos;ll
            tell for the rest of your life.
          </p>

          <div className="mt-20 grid grid-cols-2 gap-x-8 gap-y-12 border-t border-ink-900/10 pt-12 md:grid-cols-4">
            {site.stats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-5xl font-semibold tracking-tight text-ink-900 sm:text-6xl">
                  <Counter value={s.value} suffix={s.suffix} decimals={"decimals" in s ? s.decimals : 0} />
                </p>
                <p className="mt-2 text-sm font-medium uppercase tracking-[0.15em] text-ink-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
