"use client";

import { useRef } from "react";
import { Star } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Counter } from "@/components/ui/Counter";

const distribution = [
  { stars: 5, pct: 91 },
  { stars: 4, pct: 7 },
  { stars: 3, pct: 1.5 },
  { stars: 2, pct: 0.3 },
  { stars: 1, pct: 0.2 },
];

const platforms = [
  { name: "Google", rating: "4.9" },
  { name: "Instagram", rating: "25K+ followers" },
  { name: "TripAdvisor", rating: "4.8" },
];

export function RatingSummary() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from("[data-bar-fill]", {
        scaleX: 0,
        stagger: 0.1,
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="grid gap-10 rounded-[2rem] bg-white p-8 shadow-[0_30px_80px_-45px_rgba(26,18,11,0.45)] sm:p-12 lg:grid-cols-3">
      <div>
        <p className="font-display text-7xl font-bold tracking-tight text-ink-900">
          <Counter value={4.9} decimals={1} />
        </p>
        <div className="mt-2 flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-sun-400 text-sun-400" />
          ))}
        </div>
        <p className="mt-3 text-ink-500">Based on 1,177 verified traveller reviews</p>
      </div>
      <div className="space-y-3">
        {distribution.map((d) => (
          <div key={d.stars} className="flex items-center gap-3 text-sm">
            <span className="w-8 font-semibold text-ink-700">{d.stars}★</span>
            <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-cream-100">
              <span data-bar-fill className="bg-brand block h-full origin-left rounded-full" style={{ width: `${Math.max(d.pct, 1)}%` }} />
            </span>
            <span className="w-10 text-right text-ink-500">{d.pct}%</span>
          </div>
        ))}
      </div>
      <div className="grid gap-3">
        {platforms.map((p) => (
          <div key={p.name} className="flex items-center justify-between rounded-2xl bg-cream-100 px-5 py-4">
            <span className="font-display font-semibold text-ink-900">{p.name}</span>
            <span className="text-sm font-semibold text-flame-600">{p.rating}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
