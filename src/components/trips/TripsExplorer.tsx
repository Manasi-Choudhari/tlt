"use client";

import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { SearchX } from "lucide-react";
import { Flip, gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { trips, type Destination } from "@/data/trips";
import { TripCard } from "./TripCard";

type Filter = "all" | Destination;
type Sort = "popular" | "price-asc" | "price-desc" | "duration";

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All trips" },
  { id: "goa", label: "Goa" },
  { id: "hampi", label: "Hampi" },
  { id: "combo", label: "Combo" },
];

const isFilter = (v: string | null): v is Filter => !!v && ["all", "goa", "hampi", "combo"].includes(v);

export function TripsExplorer() {
  const params = useSearchParams();
  const router = useRouter();
  const initial = params.get("destination");
  const [filter, setFilter] = useState<Filter>(isFilter(initial) ? initial : "all");
  const [sort, setSort] = useState<Sort>("popular");
  const grid = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const list = trips
    .filter((t) => filter === "all" || t.destination === filter)
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "duration") return b.days - a.days;
      return b.reviews * b.rating - a.reviews * a.rating;
    });

  function capture() {
    if (grid.current) flipState.current = Flip.getState(grid.current.querySelectorAll("[data-flip]"));
  }

  function changeFilter(f: Filter) {
    capture();
    setFilter(f);
    const url = f === "all" ? "/trips" : `/trips?destination=${f}`;
    router.replace(url, { scroll: false });
  }

  function changeSort(s: Sort) {
    capture();
    setSort(s);
  }

  useGSAP(
    () => {
      if (!flipState.current) {
        gsap.from("[data-flip]", { y: 60, opacity: 0, stagger: 0.1, duration: 1, scrollTrigger: { trigger: grid.current, start: "top 85%", once: true } });
        return;
      }
      Flip.from(flipState.current, {
        duration: 0.8,
        ease: "power3.inOut",
        absolute: true,
        stagger: 0.04,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.6 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.85, duration: 0.4 }),
        onComplete: () => ScrollTrigger.refresh(),
      });
      flipState.current = null;
    },
    { dependencies: [filter, sort], scope: grid },
  );

  return (
    <section className="bg-cream-50 py-20 sm:py-28">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div role="tablist" aria-label="Filter by destination" className="flex flex-wrap gap-2">
            {filters.map((f) => {
              const count = f.id === "all" ? trips.length : trips.filter((t) => t.destination === f.id).length;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={filter === f.id}
                  onClick={() => changeFilter(f.id)}
                  className={clsx(
                    "flex items-center gap-2 rounded-full px-5 py-2.5 font-display text-sm font-semibold transition-all duration-300",
                    filter === f.id ? "bg-ink-900 text-white" : "bg-white text-ink-700 hover:bg-cream-200",
                  )}
                >
                  {f.label}
                  <span className={clsx("rounded-full px-2 py-0.5 text-[11px]", filter === f.id ? "bg-white/15" : "bg-cream-100")}>{count}</span>
                </button>
              );
            })}
          </div>
          <label className="flex items-center gap-3 text-sm font-medium text-ink-700">
            Sort by
            <select value={sort} onChange={(e) => changeSort(e.target.value as Sort)} className="input w-auto py-2.5 pr-10">
              <option value="popular">Most popular</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="duration">Longest first</option>
            </select>
          </label>
        </div>

        <div ref={grid} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((t, i) => (
            <div key={t.slug} data-flip data-flip-id={t.slug}>
              <TripCard trip={t} className="h-full" priority={i < 3} />
            </div>
          ))}
        </div>
        {list.length === 0 && (
          <div className="flex flex-col items-center py-24 text-center text-ink-500">
            <SearchX className="h-10 w-10" />
            <p className="mt-4">No trips here yet — more destinations are coming soon!</p>
          </div>
        )}
      </div>
    </section>
  );
}
