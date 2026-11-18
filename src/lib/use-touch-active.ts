"use client";

import type { RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

// Touch screens have no hover, so hover styles are mirrored with `.is-active`,
// toggled while each item crosses the middle of the viewport.
export function useTouchActive(scope: RefObject<HTMLElement | null>, selector: string) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(hover: none)", () => {
        gsap.utils.toArray<HTMLElement>(selector).forEach((el) => {
          ScrollTrigger.create({ trigger: el, start: "top 55%", end: "bottom 55%", toggleClass: "is-active" });
        });
      });
      return () => mm.revert();
    },
    { scope },
  );
}
