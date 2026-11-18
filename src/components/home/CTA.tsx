"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { whatsappLink } from "@/data/site";

export function CTA() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-cta-card]",
        { scale: 0.88, borderRadius: "4rem" },
        {
          scale: 1,
          borderRadius: "2.5rem",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "center center", scrub: true },
        },
      );
      gsap.to("[data-cta-mark]", { rotate: 25, yPercent: -10, ease: "none", scrollTrigger: { trigger: root.current, scrub: true } });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-cream-50 px-4 py-20 sm:px-6 sm:py-28">
      <div data-cta-card className="bg-brand grain relative mx-auto max-w-[1500px] overflow-hidden rounded-[2.5rem] px-6 py-24 text-center text-white sm:py-32">
        <div data-cta-mark className="pointer-events-none absolute -right-10 -top-10 h-[420px] w-[320px] opacity-20 sm:h-[560px] sm:w-[420px]">
          <Image src="/brand/mark-white.png" alt="" fill sizes="420px" className="object-contain" />
        </div>
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-[300px] w-[230px] -rotate-12 opacity-10">
          <Image src="/brand/mark-white.png" alt="" fill sizes="230px" className="object-contain" />
        </div>
        <p className="eyebrow relative justify-center text-white/90">Your seat is waiting</p>
        <SplitReveal as="h2" className="heading-xl relative mx-auto mt-6 max-w-5xl">
          Ready for your <span className="accent text-ink-900">therapy</span> session?
        </SplitReveal>
        <p className="relative mx-auto mt-6 max-w-xl text-lg text-white/90">
          Join 2,500+ legends who swapped stress for sunsets. Seats on every departure are limited.
        </p>
        <div className="relative mt-10 flex flex-wrap justify-center gap-3">
          <Button href="/trips" variant="dark" size="lg">
            Book your trip
          </Button>
          <Button href={whatsappLink("Hi TLT! I'd like to plan a trip.")} variant="light" size="lg">
            WhatsApp us
          </Button>
        </div>
      </div>
    </section>
  );
}
