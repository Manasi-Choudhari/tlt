"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { destinations, trips, formatPrice } from "@/data/trips";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useTouchActive } from "@/lib/use-touch-active";

export function Destinations() {
  const root = useRef<HTMLElement>(null);
  useTouchActive(root, "[data-dest]");

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>("[data-dest]").forEach((card, i) => {
        gsap.from(card, {
          yPercent: 18,
          opacity: 0,
          duration: 1.3,
          delay: i * 0.12,
          ease: "power4.out",
          scrollTrigger: { trigger: card, start: "top 90%", once: true },
        });
        gsap.fromTo(
          card.querySelector("[data-dest-img]"),
          { yPercent: -10, scale: 1.15 },
          { yPercent: 10, scale: 1.15, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-cream-50 pb-28 sm:pb-36">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Where we go"
            title={
              <>
                Two destinations. <span className="accent text-flame-600">Endless</span> stories.
              </>
            }
          />
          <p className="max-w-sm text-ink-700/80">
            We go deep, not wide. Every itinerary is tested by our captains, so you get the hidden spots, the best sunsets and zero
            tourist traps.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {destinations.map((d, i) => {
            const count = trips.filter((t) => t.destination === d.id).length;
            const from = Math.min(...trips.filter((t) => t.destination === d.id).map((t) => t.price));
            return (
              <Link
                key={d.id}
                href={`/trips?destination=${d.id}`}
                data-dest
                data-cursor="Explore"
                className={`group relative block overflow-hidden rounded-[2rem] ${i === 1 ? "md:mt-24" : ""}`}
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <div data-dest-img className="absolute inset-0">
                    <Image
                      src={d.image}
                      alt={`${d.name} — TLT Community trips`}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-[translate,scale,rotate] duration-[1.4s] ease-out-expo group-hover:scale-110 group-[.is-active]:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-10">
                  <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                    <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur">{count} trips</span>
                    <span>from {formatPrice(from)}</span>
                  </div>
                  <div className="mt-4 flex items-end justify-between gap-4">
                    <div>
                      <h3 className="font-display text-6xl font-semibold tracking-[-0.04em] sm:text-8xl">{d.title}</h3>
                      <p className="mt-3 max-w-sm text-white/80">{d.blurb}</p>
                    </div>
                    <span className="bg-brand flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition-[translate,scale,rotate] duration-500 group-hover:rotate-45 group-hover:scale-110 group-[.is-active]:rotate-45 group-[.is-active]:scale-110">
                      <ArrowUpRight className="h-6 w-6" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
