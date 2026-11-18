"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { trips } from "@/data/trips";
import { TripCard } from "@/components/trips/TripCard";
import { Button } from "@/components/ui/Button";

export function TripsScroller() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        gsap.to("[data-progress]", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: true },
        });
        gsap.utils.toArray<HTMLElement>("[data-trip-card]").forEach((card) => {
          gsap.from(card, {
            rotate: 4,
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left right",
              end: "center center",
              scrub: true,
            },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-ink-950 py-24 text-white lg:flex lg:h-screen lg:items-center lg:py-0">
      <div className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-flame-500/30 blur-[140px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-sun-400/20 blur-[120px]" />

      <div
        ref={track}
        className="relative flex snap-x snap-mandatory scroll-px-5 gap-6 overflow-x-auto px-5 pb-6 no-scrollbar sm:scroll-px-10 sm:px-10 lg:snap-none lg:overflow-visible lg:px-[6vw] lg:pb-0"
      >
        <div className="flex w-[82vw] shrink-0 snap-start flex-col justify-center sm:w-[420px] lg:w-[34vw] lg:pr-10">
          <span className="eyebrow text-sun-300">Upcoming trips</span>
          <h2 className="heading-lg mt-5">
            Pick your <span className="accent text-gradient">therapy</span> session.
          </h2>
          <p className="mt-6 max-w-md text-lg text-white/70">
            Fixed-departure group trips with stays, travel, experiences and a trip captain — all sorted. You just pack.
          </p>
          <div className="mt-8">
            <Button href="/trips" variant="primary">
              All trips
            </Button>
          </div>
          <div className="mt-12 hidden h-px w-full max-w-xs bg-white/15 lg:block">
            <div data-progress className="bg-brand h-px origin-left scale-x-0" />
          </div>
        </div>

        {trips.map((t) => (
          <div key={t.slug} data-trip-card className="w-[82vw] shrink-0 snap-start sm:w-[380px] lg:w-[min(30vw,420px)]">
            <TripCard trip={t} className="h-full" />
          </div>
        ))}
        <div className="w-1 shrink-0 lg:w-[4vw]" />
      </div>
    </section>
  );
}
