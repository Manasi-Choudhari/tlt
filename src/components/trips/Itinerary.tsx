"use client";

import { useRef } from "react";
import { BedDouble, Utensils } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import type { ItineraryDay } from "@/data/trips";

export function Itinerary({ days }: { days: ItineraryDay[] }) {
  const root = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-line]",
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom 60%", scrub: true } },
      );
      gsap.utils.toArray<HTMLElement>("[data-day]").forEach((el) => {
        gsap.from(el, { x: 40, opacity: 0, duration: 0.9, scrollTrigger: { trigger: el, start: "top 85%", once: true } });
        const dot = el.querySelector("[data-dot]");
        gsap.fromTo(
          dot,
          { scale: 0.6, backgroundColor: "#fbe8cc" },
          { scale: 1, backgroundColor: "#ff7a1a", scrollTrigger: { trigger: el, start: "top 65%", toggleActions: "play none none reverse" } },
        );
      });
    },
    { scope: root },
  );

  return (
    <ol ref={root} className="relative space-y-6 pl-12 sm:pl-16">
      <span className="absolute bottom-4 left-[19px] top-4 w-[2px] bg-cream-200 sm:left-[23px]" aria-hidden />
      <span data-line className="bg-brand absolute bottom-4 left-[19px] top-4 w-[2px] origin-top sm:left-[23px]" aria-hidden />
      {days.map((d) => (
        <li key={d.day} data-day className="relative">
          <span
            data-dot
            className="absolute -left-12 top-5 flex h-10 w-10 items-center justify-center rounded-full font-display text-sm font-bold text-white ring-8 ring-cream-50 sm:-left-16 sm:h-12 sm:w-12"
            style={{ backgroundColor: "#fbe8cc" }}
          >
            {d.day}
          </span>
          <div className="rounded-[1.5rem] bg-white p-6 shadow-[0_15px_50px_-35px_rgba(26,18,11,0.4)] sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-flame-600">Day {d.day}</p>
            <h3 className="mt-2 font-display text-xl font-semibold text-ink-900 sm:text-2xl">{d.title}</h3>
            <p className="mt-3 leading-relaxed text-ink-700/80">{d.description}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {d.activities.map((a) => (
                <li key={a} className="rounded-full bg-cream-100 px-3 py-1.5 text-xs font-semibold text-ink-700">
                  {a}
                </li>
              ))}
            </ul>
            {(d.meals || d.stay) && (
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-ink-900/5 pt-4 text-sm text-ink-500">
                {d.meals && (
                  <span className="flex items-center gap-2">
                    <Utensils className="h-4 w-4 text-flame-500" /> {d.meals}
                  </span>
                )}
                {d.stay && (
                  <span className="flex items-center gap-2">
                    <BedDouble className="h-4 w-4 text-flame-500" /> {d.stay}
                  </span>
                )}
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
