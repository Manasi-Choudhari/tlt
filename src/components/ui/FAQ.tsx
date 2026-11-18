"use client";

import clsx from "clsx";
import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

export function FAQ({ items, dark = false }: { items: { q: string; a: string }[]; dark?: boolean }) {
  const [open, setOpen] = useState<number | null>(0);
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      root.current?.querySelectorAll<HTMLElement>("[data-answer]").forEach((el, i) => {
        gsap.to(el, {
          height: open === i ? "auto" : 0,
          opacity: open === i ? 1 : 0,
          duration: 0.5,
          ease: "power3.inOut",
          onComplete: () => ScrollTrigger.refresh(),
        });
      });
    },
    { dependencies: [open], scope: root },
  );

  return (
    <div ref={root} className={clsx("divide-y", dark ? "divide-white/10" : "divide-ink-900/10")}>
      {items.map((item, i) => (
        <div key={item.q} className="py-2">
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            className="flex w-full items-center justify-between gap-6 py-5 text-left"
          >
            <span className={clsx("font-display text-lg font-semibold sm:text-xl", dark ? "text-white" : "text-ink-900")}>{item.q}</span>
            <span
              className={clsx(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-500",
                open === i ? "rotate-45 border-flame-500 bg-flame-500 text-white" : dark ? "border-white/20 text-white" : "border-ink-900/15 text-ink-900",
              )}
            >
              <Plus className="h-4 w-4" />
            </span>
          </button>
          <div data-answer className="overflow-hidden" style={{ height: i === 0 ? "auto" : 0, opacity: i === 0 ? 1 : 0 }}>
            <p className={clsx("max-w-2xl pb-6 leading-relaxed", dark ? "text-white/70" : "text-ink-700/80")}>{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
