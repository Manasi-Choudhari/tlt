"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { markReady } from "@/lib/ready";

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const seen = sessionStorage.getItem("tlt-preloaded");
      if (seen || prefersReducedMotion()) {
        setDone(true);
        markReady();
        return;
      }

      const counter = { v: 0 };
      const num = root.current!.querySelector<HTMLSpanElement>("[data-count]");
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem("tlt-preloaded", "1");
          setDone(true);
        },
      });

      tl.from("[data-mark]", { scale: 0.4, rotate: -25, opacity: 0, duration: 1.1, ease: "back.out(1.6)" })
        .from("[data-word]", { yPercent: 110, stagger: 0.08, duration: 0.8, ease: "power4.out" }, "-=0.6")
        .to(
          counter,
          {
            v: 100,
            duration: 1.6,
            ease: "power2.inOut",
            onUpdate: () => {
              if (num) num.textContent = String(Math.round(counter.v)).padStart(3, "0");
            },
          },
          0.2,
        )
        .to("[data-bar]", { scaleX: 1, duration: 1.6, ease: "power2.inOut" }, 0.2)
        .to("[data-content]", { yPercent: -30, opacity: 0, duration: 0.6, ease: "power3.in" }, "+=0.15")
        .add(() => markReady(), "-=0.1")
        .to("[data-panel]", { yPercent: -100, stagger: 0.07, duration: 0.9, ease: "power4.inOut" }, "-=0.3");
    },
    { scope: root },
  );

  if (done) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[10000]" aria-hidden>
      <div className="absolute inset-0 flex">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            data-panel
            className="h-full flex-1"
            style={{ background: ["#ffd84d", "#ffc028", "#ff9a26", "#ff7a1a", "#ff5a14"][i] }}
          />
        ))}
      </div>
      <div data-content className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <div data-mark className="relative h-28 w-20 sm:h-36 sm:w-28">
          <Image src="/brand/mark-white.png" alt="" fill priority sizes="112px" className="object-contain drop-shadow-xl" />
        </div>
        <div className="mt-6 flex gap-3 overflow-hidden font-display text-2xl font-semibold tracking-tight sm:text-4xl">
          {["Trip.", "Travel.", "Therapy."].map((w) => (
            <span key={w} data-word className="inline-block">
              {w}
            </span>
          ))}
        </div>
        <div className="mt-10 w-56 sm:w-72">
          <div className="h-px w-full bg-white/30">
            <div data-bar className="h-px w-full origin-left scale-x-0 bg-white" />
          </div>
          <div className="mt-3 flex justify-between font-display text-xs font-medium tracking-[0.3em] text-white/80">
            <span>TLT COMMUNITY</span>
            <span data-count>000</span>
          </div>
        </div>
      </div>
    </div>
  );
}
