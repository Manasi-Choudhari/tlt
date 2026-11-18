"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

let firstMount = true;

export function PageTransition({ children }: { children: ReactNode }) {
  const curtain = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = curtain.current;
    if (!el) return;
    if (firstMount || prefersReducedMotion()) {
      firstMount = false;
      return;
    }
    gsap
      .timeline()
      .set(el, { display: "flex", yPercent: 0 })
      .fromTo(el.querySelector("[data-mark]"), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35 })
      .to(el.querySelector("[data-mark]"), { opacity: 0, duration: 0.2 }, "+=0.05")
      .to(el, { yPercent: -100, duration: 0.8, ease: "power4.inOut" }, "-=0.1")
      .set(el, { display: "none" });
  });

  return (
    <>
      <div
        ref={curtain}
        aria-hidden
        className="bg-brand pointer-events-none fixed inset-0 z-[9000] items-center justify-center"
        style={{ display: "none" }}
      >
        <div data-mark className="relative h-20 w-14">
          <Image src="/brand/mark-white.png" alt="" fill sizes="56px" className="object-contain" />
        </div>
      </div>
      {children}
    </>
  );
}
